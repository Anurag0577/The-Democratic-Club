import 'dotenv/config';
import {User} from '../Models/user.model.js'
import jwt from 'jsonwebtoken'
import { ApiResponse } from '../Utiles/ApiResponse.js';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

const DEFAULT_FETCH_TIMEOUT = 10000; // 10s

function fetchWithTimeout(url, options = {}, timeout = DEFAULT_FETCH_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const finalOptions = { ...options, signal: controller.signal };
  return fetch(url, finalOptions).finally(() => clearTimeout(id));
}


// This MUST match exactly what's registered in your Spotify Developer Dashboard
// and it must point to YOUR BACKEND callback route, not the frontend.
// const REDIRECT_URI = 'http://127.0.0.1:3000/api/auth/callback';
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URL;
// const FRONTEND_DASHBOARD_URL = 'http://127.0.0.1:5173/dashboard';
// const FRONTEND_DASHBOARD_URL = 'https://the-democratic-club.vercel.app/dashboard';
const FRONTEND_DASHBOARD_URL = `${FRONTEND_URL}/dashboard`;


// ---------- /LOGIN ROUTE -> CONTROLLER ---------
const spotifyAuthentication = (req, res) => {
  const { token } = req.query;
  if (!token) {
    // return res.status(401).send('Missing auth token');
    // return res.status(401).json(new ApiResponse(401, "Token missing while authenticating Spotify Account!"))
    return res.redirect(`${FRONTEND_URL}/dashboard?spotify_error=${encodeURIComponent('Token missing while authenticating Spotify Account!')}`);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.error('Token is invalid while authenticating Spotify account!', err.message);
    // return res.status(401).json(401, "Token is invalid while authenticating Spotify account!", err);
    return res.redirect(`${FRONTEND_URL}/dashboard?spotify_error=${encodeURIComponent('Token is invalid while authenticating Spotify account')}`);
  }

  const scope = 'user-read-private user-read-email streaming user-modify-playback-state';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state: token, // We are passing the jwt token to state so we can identify that the spotify account get authenticated for which user when spotify redirected to my callback url after authenticating. 
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
};




// ---------- /CALLBACK ROUTE -> CONTROLLER ---------
const getSpotifyToken = async (req, res) => {
  const code = req.query.code || null;
  const error = req.query.error || null;
  const state = req.query.state || null;

  if (error) {
    return res.redirect(`${FRONTEND_DASHBOARD_URL}?spotify_error=${error}`);
  }
  if (!code || !state) {
    console.log('Either code or state is missing in /callback route');
    return res.redirect(`${FRONTEND_URL}/dashboard?spotify_status=error&message=${encodeURIComponent(error || 'Access denied')}`);
  }
  let decoded;
  try {
    decoded = jwt.verify(state, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.error('Unable to decode token while authenticating Spotify account!', err.message);
    return res.redirect(`${FRONTEND_DASHBOARD_URL}?spotify_error=invalid_session`);
  }
  const userId = decoded.id ?? decoded._id ?? decoded.userId;
  try {
    const tokenResponse = await fetchWithTimeout('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    }, DEFAULT_FETCH_TIMEOUT);
    const data = await tokenResponse.json();
    if (data.access_token) {
      console.log('Spotify generated access token', data.access_token);
      console.log('Spotify generated refresh token', data.refresh_token);
      let product = null;
      try {
        const profileResponse = await fetchWithTimeout('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${data.access_token}` },
        }, DEFAULT_FETCH_TIMEOUT);
        const profileData = await profileResponse.json();
        product = profileData.product ?? null; // 'premium' | 'free' | 'open' | undefined
        console.log('Account is ', product, 'for user', userId);
      } catch (profileErr) {
        console.error('Getting error while checking whether the user have spotify premium or not:', profileErr.message);
      }
      await User.findByIdAndUpdate(userId, {
        spotify_access_token: data.access_token,
        spotify_refresh_token: data.refresh_token,
        spotify_token_expires_at: new Date(Date.now() + data.expires_in * 1000),
        spotify_product: product,
      });
      return res.redirect(FRONTEND_DASHBOARD_URL);
    }
    return res.redirect(`${FRONTEND_DASHBOARD_URL}?spotify_error=token_exchange_failed`);
  } catch (err) {
    console.error('Spotify token generation failed! Error: ', err.message);
    return res.redirect(`${FRONTEND_DASHBOARD_URL}?spotify_error=token_exchange_failed`);
  }
};




//  IF VERIFY USER HAVE SPOTIFY TOKEN OR NOT, AND IF THAT HAVE EXPIRE REGENERATE IT AGAIN
async function ensureValidSpotifyToken(user) {
  if (!user?.spotify_access_token) {
    return null; 
  }

  const isExpired =
    !user.spotify_token_expires_at || new Date() >= new Date(user.spotify_token_expires_at);

  if (!isExpired) {
    return user.spotify_access_token;
  }

  if (!user.spotify_refresh_token) {
    return null; 
  }

  console.log('[Spotify] Access token expired for user', user._id, '- refreshing');

  const refreshResponse = await fetchWithTimeout('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.spotify_refresh_token,
    }),
  }, DEFAULT_FETCH_TIMEOUT);

  const data = await refreshResponse.json();

  if (!data.access_token) {
    console.error('[Spotify] Refresh failed for user', user._id, ':', data);
    return null;
  }

  user.spotify_access_token = data.access_token;
  if (data.refresh_token) {
    user.spotify_refresh_token = data.refresh_token;
  }
  user.spotify_token_expires_at = new Date(Date.now() + data.expires_in * 1000);
  await user.save();

  console.log('[Spotify] Token refreshed successfully for user', user._id);
  return user.spotify_access_token;
}





// ---------- /STATUS ROUTE -> CONTROLLER ---------
const checkSpotifyAuthStatus = async (req, res) => {
  const userId = req.user.id ?? req.user._id ?? req.user.userId;
  const user = await User.findById(userId).select(
    '+spotify_access_token +spotify_refresh_token spotify_token_expires_at'
  );
  const token = await ensureValidSpotifyToken(user);
  console.log('Is User have spotify tokens ', !!token);
  if (token) {
    return res.json({ connected: true });
  }
  return res.json({ connected: false });
};





// ---------- /DISCONNECT ROUTE -> CONTROLLER ----------
const disconnectSpotify = async (req, res) => {
  const userId = req.user.id ?? req.user._id ?? req.user.userId;
  const user = await User.findById(userId).select('+spotify_access_token +spotify_refresh_token');
  if (!user?.spotify_access_token) {
    return res.json(new ApiResponse(200, "Spotify was not connected", { connected: false }));
  }
  user.spotify_access_token = undefined;
  user.spotify_refresh_token = undefined;
  user.spotify_token_expires_at = undefined;
  await user.save();
  console.log('Spotify desconnected for this user: ', userId);
  return res.json(new ApiResponse(200, "Spotify disconnected successfully", { connected: false }));
};






// ---------- /PLAYBACK-TOKEN ROUTE -> CONTROLLER ---------
const getPlaybackToken = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).select(
    '+spotify_access_token +spotify_refresh_token spotify_token_expires_at'
  );
  const token = await ensureValidSpotifyToken(user);
  if (!token) {
    return res.status(400).json({ error: 'Spotify not connected' });
  }
  return res.json({ access_token: token });
};





export { spotifyAuthentication, getSpotifyToken, checkSpotifyAuthStatus, getPlaybackToken, ensureValidSpotifyToken, disconnectSpotify };
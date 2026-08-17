import 'dotenv/config';
import {User} from '../Models/user.model.js'
import jwt from 'jsonwebtoken'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

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
const REDIRECT_URI = 'https://backend-hidden-comet-6630.fly.dev/api/auth/callback';
const FRONTEND_DASHBOARD_URL = 'http://127.0.0.1:5173/dashboard';
let decoded;


const spotifyAuthentication = (req, res) => {
  const { token } = req.query;
  console.log('THIS IS TOKEN: ', token)
  if (!token) {
    return res.status(401).send('Missing auth token');
  }

  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.error('[Spotify OAuth] Invalid token on login redirect:', err.message);
    return res.status(401).send('Invalid or expired session');
  }

  const scope = 'user-read-private user-read-email streaming user-modify-playback-state';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope,
    redirect_uri: REDIRECT_URI,
    state: token, // <-- carry the SAME jwt forward as `state`, Spotify echoes it back untouched
  });
  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
};

const getSpotifyToken = async (req, res) => {
  const code = req.query.code || null;
  const error = req.query.error || null;
  const state = req.query.state || null; // this is your JWT, round-tripped through Spotify

  if (error) {
    return res.redirect(`${FRONTEND_DASHBOARD_URL}?spotify_error=${error}`);
  }
  if (!code || !state) {
    return res.status(400).json({ error: 'Missing authorization code or state' });
  }

  
  try {
    decoded = jwt.verify(state, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    console.error('[Spotify OAuth] Invalid state/token on callback:', err.message);
    return res.redirect(`${FRONTEND_DASHBOARD_URL}?spotify_error=invalid_session`);
  }

  const userId = decoded.id ?? decoded._id ?? decoded.userId; // match whatever your JWT payload actually calls it

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
      console.log('[Spotify OAuth] Token exchange succeeded for user:', userId);
      console.log('Spotify access token', data.access_token)
      console.log('Spotify refresh token', data.refresh_token)
      await User.findByIdAndUpdate(userId, {
        spotify_access_token: data.access_token,
        spotify_refresh_token: data.refresh_token,
        spotify_token_expires_at: new Date(Date.now() + data.expires_in * 1000),
      });

      return res.redirect(FRONTEND_DASHBOARD_URL);
    }

    return res.redirect(`${FRONTEND_DASHBOARD_URL}?spotify_error=token_exchange_failed`);
  } catch (err) {
    console.error('[Spotify OAuth] Exception:', err.message);
    return res.status(500).json({ error: err.message });
  }
};



// Reusable: given a user document (with token fields already selected, NOT .lean()),
// returns a valid access token, refreshing in DB if expired. Returns null if not connected.
async function ensureValidSpotifyToken(user) {
  if (!user?.spotify_access_token) {
    return null; // never connected
  }

  const isExpired =
    !user.spotify_token_expires_at || new Date() >= new Date(user.spotify_token_expires_at);

  if (!isExpired) {
    return user.spotify_access_token;
  }

  if (!user.spotify_refresh_token) {
    return null; // expired and no way to refresh - treat as disconnected
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

const checkSpotifyAuthStatus = async (req, res) => {
  const userId = req.user.id ?? req.user._id ?? req.user.userId;

  // NOT .lean() - we need a real document in case ensureValidSpotifyToken needs to .save()
  const user = await User.findById(userId).select(
    '+spotify_access_token +spotify_refresh_token spotify_token_expires_at'
  );

  const token = await ensureValidSpotifyToken(user);

  console.log('[Spotify Status Check] Valid token available:', !!token);

  if (token) {
    return res.json({ connected: true });
  }
  return res.json({ connected: false });
};



// spotify.controller.js — new export
const getPlaybackToken = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select(
    '+spotify_access_token +spotify_refresh_token spotify_token_expires_at'
  );

  const token = await ensureValidSpotifyToken(user); // the helper from earlier

  if (!token) {
    return res.status(400).json({ error: 'Spotify not connected' });
  }

  return res.json({ access_token: token });
};





export { spotifyAuthentication, getSpotifyToken, checkSpotifyAuthStatus, getPlaybackToken, ensureValidSpotifyToken };
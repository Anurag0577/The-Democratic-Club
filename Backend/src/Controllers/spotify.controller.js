import {Room} from '../Models/room.model.js'
import {User} from '../Models/user.model.js'
import 'dotenv/config'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const getSpotifyAccessToken = async (userId, roomId) => {
    const roomDetail = await Room.findById(roomId).select('createdBy members');
    if (!roomDetail) {
      throw new Error('ROOM_NOT_FOUND');
    }
  
    const isMember = roomDetail.members?.some(
      (m) => m.toString() === userId.toString()
    );
  
    if (!isMember) {
      throw new Error('NOT_A_ROOM_MEMBER');
    }
  
    const roomHostId = roomDetail.createdBy;
  
    const roomHostDetail = await User.findById(roomHostId).select(
      '+spotify_access_token +spotify_refresh_token spotify_token_expires_at'
    );
  
    if (!roomHostDetail?.spotify_access_token) {
      throw new Error('SPOTIFY_NOT_CONNECTED');
    }
  
    const isExpired =
      !roomHostDetail.spotify_token_expires_at ||
      new Date() >= new Date(roomHostDetail.spotify_token_expires_at);
  
    if (!isExpired) {
      return { spotify_access_token: roomHostDetail.spotify_access_token };
    }
  
    if (!roomHostDetail.spotify_refresh_token) {
      throw new Error('SPOTIFY_REAUTH_REQUIRED');
    }
  
    console.log('Access token expired for host', roomHostId, '- refreshing');
  
    const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: roomHostDetail.spotify_refresh_token,
      }),
    });
  
    const data = await refreshResponse.json();
  
    if (!data.access_token) {
      console.error('[Spotify] Refresh failed for host', roomHostId, ':', data);
      throw new Error('SPOTIFY_REFRESH_FAILED');
    }
  
    roomHostDetail.spotify_access_token = data.access_token;
    if (data.refresh_token) {
      roomHostDetail.spotify_refresh_token = data.refresh_token;
    }
    roomHostDetail.spotify_token_expires_at = new Date(Date.now() + data.expires_in * 1000);
    await roomHostDetail.save();
  
    console.log('Token refreshed successfully for host', roomHostId);
  
    return { spotify_access_token: roomHostDetail.spotify_access_token };
  };
  

  const handleSearch = async (req, res) => {
    try {
      const { submittedQuery, currentRoomId } = req.body;
      const userId = req.user.id;
  
      if (!submittedQuery || submittedQuery.trim().length < 2) {
        return res.status(400).json({ error: 'Search query too short' });
      }
  
      const { spotify_access_token } = await getSpotifyAccessToken(userId, currentRoomId);
  
      const baseSpotifySearchURL = 'https://api.spotify.com/v1/search';
      const params = new URLSearchParams({
        q: submittedQuery,
        type: 'track',
        limit: 4,
        market: 'IN',
        include_external: 'audio',
      });
  
      const response = await fetch(`${baseSpotifySearchURL}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${spotify_access_token}`,
        },
      });
  
      if (!response.ok) {
        console.error('[Spotify Search] Failed:', response.status);
        return res.status(response.status).json({ error: 'Spotify search failed' });
      }
  
      const data = await response.json();
      const tracks = (data.tracks?.items ?? []).map((track) => ({
        artist_name: track.artists?.[0]?.name ?? 'Unknown artist',
        thumbnail_img: track.album?.images?.[2]?.url ?? track.album?.images?.[0]?.url,
        media_img: track.album?.images?.[0]?.url,
        song_dur: track.duration_ms,
        track_id: track.id,
        track_name: track.name,
        track_uri: track.uri
      }));
  
      return res.json(tracks);
    } catch (err) {
      if (err.message === 'ROOM_NOT_FOUND') {
        return res.status(404).json({ error: 'Room not found' });
      }
      if (err.message === 'NOT_A_ROOM_MEMBER') {
        return res.status(403).json({ error: 'You are not a member of this room' });
      }
      if (err.message === 'SPOTIFY_NOT_CONNECTED' || err.message === 'SPOTIFY_REAUTH_REQUIRED') {
        return res.status(400).json({ error: 'Host needs to (re)connect Spotify' });
      }
      console.error('[Spotify Search] Exception:', err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  };


  export {handleSearch};
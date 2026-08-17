import redisClient from '../redisClient.js'; 

const ANCHOR_TTL_SECONDS = 3600; 

function anchorKey(roomCode) {
  return `room:${roomCode}:playbackAnchor`;
}

async function setPlaybackAnchor(roomCode, { track, durationMs, positionMs, isPlaying }) {
  const anchor = {
    track,
    duration,
    position,
    isPlaying,
    updatedAt: Date.now(),
  };

  await redisClient.set(anchorKey(roomCode), JSON.stringify(anchor), {
    EX: ANCHOR_TTL_SECONDS,
  });

  return anchor;
}


async function getPlaybackAnchor(roomCode) {
  const raw = await redisClient.get(anchorKey(roomCode));
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('[playbackAnchor] Failed to parse stored anchor:', err);
    return null;
  }
}

async function clearPlaybackAnchor(roomCode) {
  await redisClient.del(anchorKey(roomCode));
}

export { setPlaybackAnchor, getPlaybackAnchor, clearPlaybackAnchor };
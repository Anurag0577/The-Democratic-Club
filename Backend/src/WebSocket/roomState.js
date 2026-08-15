// roomState.js

import { redisClient } from "../Database/redisClient.js";
import { Queue } from "../Models/queue.model.js";

const roomKey = (roomCode) => `room:${roomCode}:queue`;
const tracksKey = (roomCode) => `tracks:${roomCode}:queue`;

// -------------- GET QUEUE --------------
async function getQueue(roomCode, roomId) {
  const sortedTrackIds = await redisClient.zRange(roomKey(roomCode), 0, -1, { REV: true });
  
  if (sortedTrackIds.length !== 0) {
    const sortedQueue = await redisClient.hmGet(tracksKey(roomCode), sortedTrackIds);
    // Filter out potential nulls and parse JSON
    return sortedQueue
      .filter((item) => item !== null)
      .map((item) => JSON.parse(item));
  }

  // DB Fallback
  const queueFromDB = await Queue.findOne({ room: roomId }).lean();
  if (!queueFromDB || !queueFromDB.tracks || queueFromDB.tracks.length === 0) {
    return [];
  }

  const trackQueue = queueFromDB.tracks;
  const pipeline = redisClient.multi();

  pipeline.del(roomKey(roomCode));
  pipeline.del(tracksKey(roomCode));

  trackQueue.forEach((track) => {
    pipeline.zAdd(roomKey(roomCode), {
      score: track.upvote_count || 0,
      value: String(track.track_id)
    });

    pipeline.hSet(
      tracksKey(roomCode),
      String(track.track_id),
      JSON.stringify(track)
    );
  });

  await pipeline.exec();
  return trackQueue;
}

// -------------- SET QUEUE --------------
async function setQueue(roomCode, track, task, roomId) {
  const pipeline = redisClient.multi();

  if (task === 'add') {
    const tieBreaker = 1 - (Date.now() / 10000000000000); // Fixed Date.now()
    const calculatedScore = (track.upvote_count || 0) + tieBreaker;

    pipeline.zAdd(roomKey(roomCode), {
      score: calculatedScore,
      value: String(track.track_id)
    });

    pipeline.hSet(
      tracksKey(roomCode),
      String(track.track_id),
      JSON.stringify(track)
    );
  }

  if (task === 'remove') {
    pipeline.zRem(roomKey(roomCode), String(track.track_id));
    pipeline.hDel(tracksKey(roomCode), String(track.track_id));
  }

  await pipeline.exec();
  return await getQueue(roomCode, roomId);
}

// -------------- UPVOTE SONG --------------
async function upvoteSong(track_id, roomCode, roomId) {
  const trackId = String(track_id);

  // 1. Increment score in ZSET
  await redisClient.zIncrBy(roomKey(roomCode), 1, trackId);

  // 2. Fetch, increment, and re-save in HASH
  const rawTrackInfo = await redisClient.hGet(tracksKey(roomCode), trackId);
  if (rawTrackInfo) {
    const trackInfo = JSON.parse(rawTrackInfo);
    trackInfo.upvote_count = (trackInfo.upvote_count || 0) + 1;
    await redisClient.hSet(tracksKey(roomCode), trackId, JSON.stringify(trackInfo));
  }

  return await getQueue(roomCode, roomId);
}

// -------------- REMOVE UPVOTE --------------
async function removeUpvoteSong(track_id, roomCode, roomId) {
  const trackId = String(track_id);

  // 1. Decrement score in ZSET
  await redisClient.zIncrBy(roomKey(roomCode), -1, trackId);

  // 2. Fetch, decrement, and re-save in HASH
  const rawTrackInfo = await redisClient.hGet(tracksKey(roomCode), trackId);
  if (rawTrackInfo) {
    const trackInfo = JSON.parse(rawTrackInfo);
    trackInfo.upvote_count = Math.max(0, (trackInfo.upvote_count || 0) - 1);
    await redisClient.hSet(tracksKey(roomCode), trackId, JSON.stringify(trackInfo));
  }

  return await getQueue(roomCode, roomId);
}

export { getQueue, setQueue, upvoteSong, removeUpvoteSong };
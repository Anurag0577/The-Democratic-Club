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

    // upadating the queue in mongoDB
    const queueInfo = await Queue.findOneAndUpdate(
      { room: roomId },
      { $push: { tracks: track } },
      { 
        returnDocument: 'after', // returns the updated document
      }
    );
    console.log('this is updatedQueue after adding song: ', queueInfo)
  }

  if (task === 'remove') {
    pipeline.zRem(roomKey(roomCode), String(track.track_id));
    pipeline.hDel(tracksKey(roomCode), String(track.track_id));

    // romove track from the mongoDB
    const updatedQueue = await Queue.findOneAndUpdate(
      { room: roomId },
      { 
        $pull: { 
          tracks: { track_id: String(track.track_id) } 
        } 
      },
      { returnDocument: 'after' }
    );
    console.log('this is updatedQueue after remove song: ', updatedQueue)
  }

  await pipeline.exec();
  return await getQueue(roomCode, roomId);
}

// -------------- UPVOTE SONG --------------
async function upvoteSong(track_id, roomCode, roomId, upvoted_by) {
  const trackId = String(track_id);

  const rawTrackInfo = await redisClient.hGet(tracksKey(roomCode), trackId);
  if (!rawTrackInfo) {
    return await getQueue(roomCode, roomId);
  }

  const trackInfo = JSON.parse(rawTrackInfo);
  trackInfo.upvote_by = trackInfo.upvote_by || [];

  const alreadyUpvoted = trackInfo.upvote_by.includes(upvoted_by);
  if (alreadyUpvoted) {
    console.log('[upvoteSong] User already upvoted, skipping:', upvoted_by);
    return await getQueue(roomCode, roomId);
  }

  await redisClient.zIncrBy(roomKey(roomCode), 1, trackId);

  trackInfo.upvote_count = (trackInfo.upvote_count || 0) + 1;
  trackInfo.upvote_by.push(upvoted_by);

  await redisClient.hSet(tracksKey(roomCode), trackId, JSON.stringify(trackInfo));

  return await getQueue(roomCode, roomId);
}

// -------------- REMOVE UPVOTE --------------
async function removeUpvoteSong(track_id, roomCode, roomId, removedUpvote_by) {
  const trackId = String(track_id);

  const rawTrackInfo = await redisClient.hGet(tracksKey(roomCode), trackId);
  if (!rawTrackInfo) {
    return await getQueue(roomCode, roomId);
  }

  const trackInfo = JSON.parse(rawTrackInfo);
  trackInfo.upvote_by = trackInfo.upvote_by || [];

  console.log("UPVOTED_BY", trackId.upvote_by )
  console.log('removeUPVOTE REQUEST BY', removedUpvote_by)
  const hadUpvoted = trackInfo.upvote_by.includes(removedUpvote_by);
  if (!hadUpvoted) {
    console.log('[removeUpvoteSong] User never upvoted, skipping:', removedUpvote_by);
    return await getQueue(roomCode, roomId); 
  }

  await redisClient.zIncrBy(roomKey(roomCode), -1, trackId);

  trackInfo.upvote_count = Math.max(0, (trackInfo.upvote_count || 0) - 1);
  trackInfo.upvote_by = trackInfo.upvote_by.filter((id) => id !== removedUpvote_by);

  await redisClient.hSet(tracksKey(roomCode), trackId, JSON.stringify(trackInfo));
  const fetchingGetQueue = await getQueue(roomCode, roomId);
  console.log("This is fetchingGetQueue",fetchingGetQueue)
  return fetchingGetQueue;
}

export { getQueue, setQueue, upvoteSong, removeUpvoteSong };
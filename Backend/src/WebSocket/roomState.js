// roomState.js

import { constants } from "vm";
import { redisClient } from "../Database/redisClient.js";
import {Queue} from "../Models/queue.model.js"
const roomKey = (roomCode) => `room:${roomCode}:queue`
const tracksKey = (roomCode) => `tracks:${roomCode}:queue`

// -------------- GET QUEUE --------------
async function getQueue(roomCode, roomId){
  console.log("this means i enter in getQueue")
  const sortedTrackId = await redisClient.zRange(roomKey(roomCode), 0, -1, {REV: true});
  if(sortedTrackId.length !== 0){
    const sortedQueue = await redisClient.hmGet(tracksKey(roomCode), sortedTrackId)
    const queue = sortedQueue.map(item => JSON.parse(item))
    
    return queue;
  }

  const queueFromDB = await Queue.findOne({room: roomId}).lean();
  if(!queueFromDB || queueFromDB?.tracks?.length ) return [];

  const trackQueue = queueFromDB.tracks;

  const pipeline = redisClient.multi();

  pipeline.del(roomKey(roomCode));
  pipeline.del(tracksKey(roomCode));

  trackQueue.forEach((track, index) => {
    pipeline.zAdd(roomKey(roomCode), {
      score: track.upvote_count || 0,
      value: String(track.track_id)
    })

    pipeline.hSet(
      tracksKey(roomCode),
      String(track.track_id),
      JSON.stringify(track)
    )
  })

  await pipeline.exec();

  return trackQueue;
}

// -------------- SET QUEUE --------------
async function setQueue(roomCode, track, task, roomId) {
  const pipeline = redisClient.multi();

  if(task === 'add'){
      pipeline.zAdd( roomKey(roomCode), {
        score: track.upvote_count,
        value: String(track.track_id)
      })

      pipeline.hSet(tracksKey(roomCode),
      String(track.track_id),
      JSON.stringify(track)
      )
  }

  if(task === 'remove'){
    pipeline.zRem( roomKey(roomCode), String(track.track_id));
    pipeline.hDel(tracksKey(roomCode), String(track.track_id));
  }


  await pipeline.exec();

  // After this we need to update the mongoDb database also
  return await getQueue(roomCode, roomId);
}

async function upvoteSong(track_id, roomCode, roomId){
  const trackId = track_id;

  await  redisClient.zIncrBy(roomKey(roomCode), 1, trackId) // this will increase the vote count

  // now we also need to update the upvote count in hash bcoz this is where the whole song details stored
  const rawTrackInfo = await redisClient.hGet(roomKey(roomCode), trackId);

  const trackInfo = await JSON.parse(rawTrackInfo);
  trackInfo.upvote_count += 1;

  await redisClient.hSet(roomKey(roomCode), trackId, trackInfo)
  // Now we need to get the latest order of the queue bcoz due to this upvote the order must changed.
  return await getQueue(roomKey(roomCode), roomId)
}

async function removeUpvoteSong(track_id, roomCode, roomId){
  
  await redisClient.zIncrBy(roomKey(roomCode), -1, track_id);
  const rawTrackInfo = await redisClient.hGet(roomKey(roomCode), track_id)
  const trackInfo = await JSON.parse(rawTrackInfo);
  trackInfo.upvote_count -= 1;
  await redisClient.hSet(roomKey(roomCode), track_id, trackInfo);

  return getQueue(roomKey(roomCode), roomId)
}

export {getQueue, setQueue, upvoteSong, removeUpvoteSong}
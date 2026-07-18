/*
Write two functions..
1) getQueue - return the latest queue in sorted order
2) setQueue - update the queue and return the updated queue
*/

import { redisClient } from "../Database/redisClient.js";
import { Queue } from "../Models/queue.model.js";
import { Room } from "../Models/room.model";

const roomKey = (roomCode) => `room:${roomCode}:queue`

async function getQueue(roomCode){
// first try to fetch from the redis
// if not in the redis , fetch from DB
// Once get the queue from the db , please update/save the value in the redis

const key = roomKey(roomCode)

let foundQueue = await redisClient.hVals(key)
if(Object.keys(foundQueue).length === 0){
  const fetchedQueue = await Queue.findOne({room: roomCode})
  if(!fetchedQueue) return // here we do something later

  foundQueue = fetchedQueue.tracks // this is basically array
}

// if the length is not zero then we have to convert the hset in to a normal js object
const queue = foundQueue.map(tracks => JSON.parse(tracks))

return queue
  
}


export {getQueue}
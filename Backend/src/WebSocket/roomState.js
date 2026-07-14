// roomState.js
import {redisClient} from '../Database/redisClient.js'
import { Queue } from '../Models/queue.model.js'

const roomKey = (roomObjectId) => `room:${roomObjectId}:queue`;

function normalizeQueueData(queueData) {
  if (Array.isArray(queueData)) {
    return queueData;
  }

  if (typeof queueData === 'string') {
    try {
      const parsed = JSON.parse(queueData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

async function getQueue(roomObjectId) {
  const key = roomKey(roomObjectId);
  const redisType = await redisClient.type(key);

  if (redisType === 'string') {
    const cached = await redisClient.get(key);
    if (cached) {
      return normalizeQueueData(cached);
    }
  }

  if (redisType === 'zset') {
    const entries = await redisClient.zRange(key, 0, -1);
    return entries.map(entry => {
      try {
        return JSON.parse(entry);
      } catch {
        return null;
      }
    }).filter(Boolean);
  }

  const queueDoc = await Queue.findOne({room: roomObjectId}).lean();
  const queue = queueDoc?.tracks || [];

  await redisClient.set(key, JSON.stringify(queue));

  return queue;
}

async function setQueue(roomObjectId, updatedTracks) {
  const key = roomKey(roomObjectId);

  const updatedQueue = await Queue.findOneAndUpdate(
    {room: roomObjectId},
    {tracks: updatedTracks},
    {new: true, upsert: true}
  ).lean();

  await redisClient.set(key, JSON.stringify(updatedQueue.tracks || []));

  return updatedQueue;
}

export { getQueue, setQueue };
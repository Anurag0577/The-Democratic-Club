// roomState.js
import {redisClient} from '../Database/redisClient.js'
import { Room } from '../Models/room.model.js';

const roomKey = (roomId) => `room:${roomId}:queue`;

async function getQueue(roomId) {
  const cached = await redisClient.get(roomKey(roomId));
  if (cached) {
    return JSON.parse(cached); // Redis had it — fast path, done
  }

  // cache miss — pull from Mongo (the source of truth)
  const room = await Room.findById(roomId).lean();
  const queue = room?.queue || [];

  // warm the Redis cache so next call doesn't hit Mongo again
  await redisClient.set(roomKey(roomId), JSON.stringify(queue), { EX: 3600 });

  return queue;
}

async function setQueue(roomId, queue) {
  await redisClient.set(roomKey(roomId), JSON.stringify(queue), { EX: 3600 });
}

export { getQueue, setQueue };
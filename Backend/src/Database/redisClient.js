import { createClient } from 'redis';
import 'dotenv/config'

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});

export { redisClient };
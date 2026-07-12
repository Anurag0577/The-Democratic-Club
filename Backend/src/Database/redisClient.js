import {createClient} from 'redis'

const redisClient = createClient({
  url: "redis://127.0.0.1:6379"
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis when the server starts
(async () => {
  await redisClient.connect();
  console.log("Connected to Redis successfully!");
})();

export {redisClient};
const { createClient } = require("redis");

const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis error:", err));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log(" Redis connected");
    }
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
};

connectRedis();

module.exports = redisClient;

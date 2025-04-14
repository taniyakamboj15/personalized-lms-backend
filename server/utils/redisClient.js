const { createClient } = require("redis");

const redisClient = createClient({
  url: "rediss://default:AUIkAAIjcDFkY2JmNzVjY2VjYzg0OWE2OGNkNDFjZjFmNWNmN2IwN3AxMA@smashing-parrot-16932.upstash.io:6379",
});

redisClient.on("error", (err) => console.error("Redis error:", err));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log(" Redis connected successfully!");
    }
  } catch (err) {
    console.error(" Redis connection failed:", err);
  }
};

connectRedis();

module.exports = redisClient;

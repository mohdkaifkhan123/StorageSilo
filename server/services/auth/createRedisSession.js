import jwt from "jsonwebtoken";
import redisClient from "../../config/redis.js";

export const createRedisSession = async (userId) => {
  const sessionID = crypto.randomUUID();
  const sessionExpiry = 7 * 24 * 60 * 60 * 1000;

  const accessToken = jwt.sign(
    { userId, sessionID },
    process.env.JWT_SECRET || "secret",
    { expiresIn: sessionExpiry },
  );

  await redisClient.set(
    `session:${sessionID}`,
    JSON.stringify({ userId }),
    {
      EX: Math.floor(sessionExpiry / 1000),
    },
  );

  return {
    sessionID,
    sessionExpiry,
    accessToken,
  };
};
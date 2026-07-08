import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.signedCookies.token || req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (decoded.sessionID) {
      const sessionExists = await redisClient.exists(
        `session:${decoded.sessionID}`,
      );
      if (!sessionExists) {
        res.clearCookie("token", {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
        });

        return res.status(401).json({ message: "Session expired or invalid" });
      }
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

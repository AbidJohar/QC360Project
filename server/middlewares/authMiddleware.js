import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.currentToken !== token)
      return res.status(401).json({ message: "Invalid or expired token" });

    // Check inactivity 10 min = 600000 ms
    const now = Date.now();
    if (now - user.lastActivity.getTime() > 600000) {
      user.currentToken = null;
      await user.save();
      return res.status(401).json({
        success: false,
        message: "Session expired due to inactivity",
      });
    }

    // Update last activity time
    user.lastActivity = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
};

export default authMiddleware;

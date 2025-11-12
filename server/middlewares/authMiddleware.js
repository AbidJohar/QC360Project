import { User } from "../models/User.js";
import jwt from "jsonwebtoken";


const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.warn("authMiddleware: Token missing in request headers");
      return res.status(401).json({ message: "Token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      console.warn("authMiddleware: JWT verify failed:", jwtErr.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.warn(`authMiddleware: No user found for id ${decoded.userId}`);
      return res.status(401).json({ message: "User not found" });
    }

    if (user.currentToken !== token) {
      console.warn("authMiddleware: Token mismatch. user.currentToken and provided token differ");
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Check inactivity 10 min = 600000 ms (only if lastActivity is set)
    const now = Date.now();
    if (user.lastActivity && now - new Date(user.lastActivity).getTime() > 600000) {
      user.currentToken = null;
      await user.save();
      console.warn("authMiddleware: Session expired due to inactivity for user", user.email);
      return res.status(401).json({ success: false, message: "Session expired due to inactivity" });
    }

    // Update last activity time
    user.lastActivity = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (err) {
    console.error("authMiddleware unexpected error:", err);
    return res.status(401).json({ message: err.message || "Unauthorized" });
  }
};


export default authMiddleware;

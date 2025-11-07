import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/User.js";

const adminMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.userId);
    
  if (!user || user.currentToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Check inactivity timeout (10 minutes = 600000 ms)
    const now = Date.now();
    if (now - user.lastActivity.getTime() > 600000) {
      user.currentToken = null; // force logout
      await user.save();
      return res.status(401).json({
        success : false,
        message: "Session expired due to inactivity",
      });
    }

    // Update last activity time
    console.log("last activity time before update: ",user.lastActivity);
    
    user.lastActivity = new Date();
    console.log("last activity time after update: ",user.lastActivity);

    await user.save();

    if (user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in adminMiddleware:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default adminMiddleware;
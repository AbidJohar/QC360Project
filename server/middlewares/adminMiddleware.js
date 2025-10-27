import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/User.js";

export const adminMiddleware = async (req, res, next) => {
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


    console.log("user value after decode:",decoded);

    const user = await User.findById(decoded.userId);
    console.log("User value in admin Middleware:",user);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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

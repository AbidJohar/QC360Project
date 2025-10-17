import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//________________( Sign up Controller )_____________

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // Basic validation
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email OR username exists in one query
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? "Email is already registered"
            : "Username is already taken",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

     // generate acessToke
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken : token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//________________( Sign In Controller )___________________

export const signIn = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Validate fields
    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Username and password are required",
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // generate acessToke
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

     

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken : token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error in signIn controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//________________( Sign up Controller )_____________

export const signup = async (req, res) => {
  try {
    const { fullName, email, username, password, role } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const fullNameRegex = /^[A-Za-z\s]+$/;

    if (!fullNameRegex.test(fullName)) {
      return res.status(400).json({
        success: false,
        message: "Full name should contain only letters",
      });
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Gmail address",
      });
    }

    // Check if email OR username exists in one query
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
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
    const status = "Submitted";
    // Save user
    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      role,
      status,
    });

    // generate acessToke
    // generate acessToke

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET
    );

    // Store token + activity time
    newUser.currentToken = token;
    newUser.lastActivity = new Date();
    newUser.submittedAt = new Date();
    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken: token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
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
  console.log("Sgin In is hitting....");

  try {
    const { email, password } = req.body;

    console.log("email and password", email, password);

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email or username
    const user = await User.findOne({ email });

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

    if (user.status === "Submitted") {
      return res.status(403).json({
        success: false,
        status: user.status,
        message: "Your account has not been approved yet. Please wait for approval.",
      });
    } else if (user.status === "Rejected") {
      return res.status(401).json({
        success: false,
        status: user.status,
        message: "Login failed. The admin has rejected your account request.",
        remarks : user.remarks
      });
    }

    // generate acessToke

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    // Store token + activity time
    user.currentToken = token;
    user.lastActivity = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      remarks : user.remarks,
      accessToken: token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
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

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    user.currentToken = null; // invalidate token
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

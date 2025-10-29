import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//________________( Sign up Controller )_____________

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
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

    // Save user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
    });

    // generate acessToke
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken: token,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
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

    // generate acessToke
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: token,
      user,
    });
  } catch (error) {
    console.log("Error in signIn controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

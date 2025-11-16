import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    minlength: 3,
  },

  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["Admin", "Employee", "Manager"],
    default: "Employee",
  },

  status: {
    type: String,
    enum: ["Submitted", "Rejected", "Approved"],
  },

  remarks: {
    type: String,
    default : ""
  },

  actionedAt: {
    type: Date,
  },

  submittedAt : {
    type: Date
  },

  actionedBy: {
    type: String,
  },

  lastActivity: { type: Date, default: Date.now },

  currentToken: { type: String, default: null },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

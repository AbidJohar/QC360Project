import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      minlength: 3,
    },
    username: {
       type: String,
       unique:true,
       required: true,
       lowercase : true,
       trim : true,
       index : true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum : ["Admin", "Employee"],
      default : "Employee"
    },
    lastActivity: { type: Date, default: Date.now },

    currentToken: { type: String, default: null }
  },
  { timestamps: true }
);


export const User = mongoose.models.User || mongoose.model("User", userSchema);

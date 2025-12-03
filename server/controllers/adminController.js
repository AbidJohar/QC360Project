import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

//___________( get all users by admin )______________

const getALlUsersByAdmin = async (_, res) => {
  try {
    const users = await User.find({ role: "Employee" }).select("-password");

    res.status(200).json({
      success: true,
      message: "All users fetch successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

//___________( update user by admin )______________
const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, role, password } = req.body;

    // validation
    if (fullName && !/^[A-Za-z\s]+$/.test(fullName)) {
      return res.status(400).json({
        success: false,
        message: "Full name should contain only letter.",
      });
    }

    if (role && !["Admin", "Employee"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be either 'Admin' or 'Employee'.",
      });
    }

    if (password && password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // Build update object
    const updatedData = {};
    if (fullName) updatedData.fullName = fullName;
    if (role) updatedData.role = role;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    // Update user
    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};

//___________( delete user by admin )______________
const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

//___________( Admin dashboard data for frontend testing )______________

const dashboardData = async (_, res) => {
  return res.status(200).json({
    message: "Welcome Admin",
    stats: {},
  });
};

//___________( Fetch all signup requests by admin )______________

const getAllSignUpRequestsByAdmin = async (req, res) => {
  try {
    // Fetch ONLY pending requests
    const signupRequests = await User.find(
      {
        email: { $ne: "admin@gmail.com" },
        status: "Submitted",
      },
      "fullName email status submittedAt"
    ).sort({ submittedAt: -1 });

    const formattedRequests = signupRequests.map((user) => ({
      requestId: user._id,
      fullName: user.fullName,
      email: user.email,
      status: user.status,
      submittedAt: user.submittedAt,
    }));

    return res.status(200).json({
      success: true,
      message: "All pending sign-up requests fetched successfully",
      count: formattedRequests.length,
      data: formattedRequests,
    });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pending users",
    });
  }
};
//___________( Approve signup requests by admin )______________

const approvedSignUpRequestsByAdmin = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    console.log("Admin ID:", userId);

    const { requestIds, remarks } = req.body;
    // Validate input
    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one user ID.",
      });
    }

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: "Remarks is required.",
      });
    }

    const remarksRegex = /^[A-Za-z\s]{8,200}$/;

    if (!remarksRegex.test(remarks)) {
      return res.status(400).json({
        success: false,
        message:
          "Remarks must be alphabetic and 8–200 characters long."
      });
    }

    // Validate ObjectId format
    for (let id of requestIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
          success: false,
          message: `Invalid requestId`,
        });
      }
    }

    // Check if users actually exist
    const existingUsers = await User.find({ _id: { $in: requestIds } });
    if (existingUsers.length !== requestIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more requestIds do not exist.",
      });
    }

    // Update users in bulk
    const result = await User.updateMany(
      { _id: { $in: requestIds } },
      {
        $set: {
          status: "Approved",
          remarks: remarks,
          actionedBy: userId,
          actionedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `${
        result.modifiedCount > 1
          ? `${result.modifiedCount} requests`
          : `${result.modifiedCount} request`
      } approved successfully.`,
    });
  } catch (error) {
    console.error("Bulk approval error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

//___________( Reject signup requests by admin )______________

const rejectedSignUpRequestsByAdmin = async (req, res) => {
  try {
    const user = req.user;
    console.log("Admin ID:", user);

    const { requestIds, remarks } = req.body;
    // Validate input
    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one user ID.",
      });
    }

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: "Remarks is required.",
      });
    }

    const remarksRegex = /^[A-Za-z\s]{8,200}$/;

    if (!remarksRegex.test(remarks)) {
      return res.status(400).json({
        success: false,
        message:
          "Remarks must be alphabetic and 8–200 characters long."
      });
    }

    // Validate ObjectId format
    for (let id of requestIds) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
          success: false,
          message: `Invalid requestId`,
        });
      }
    }

    // Check if users actually exist
    const existingUsers = await User.find({ _id: { $in: requestIds } });
    if (existingUsers.length !== requestIds.length) {
      return res.status(404).json({
        success: false,
        message: "One or more requestIds do not exist.",
      });
    }

    // Update users in bulk
    const result = await User.updateMany(
      { _id: { $in: requestIds } },
      {
        $set: {
          status: "Rejected",
          remarks: remarks,
          actionedBy: user.userId,
          actionedAt: new Date(),
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `${
        result.modifiedCount > 1
          ? `${result.modifiedCount} requests`
          : `${result.modifiedCount} request`
      } rejected successfully.`,
    });
  } catch (error) {
    console.error("Bulk approval error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const getSignUpRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: `Invalid requestId`,
      });
    }

    // Correct way to find by ID
    const signupRequest = await User.findById(id).select(
      "-currentToken -password"
    );

    if (!signupRequest) {
      return res.status(404).json({
        success: false,
        message: "SignUp request not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SignUp request fetched successfully",
      data: signupRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export {
  getALlUsersByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  dashboardData,
  getAllSignUpRequestsByAdmin,
  approvedSignUpRequestsByAdmin,
  rejectedSignUpRequestsByAdmin,
  getSignUpRequestById,
};

import { User } from "../models/User.js";
import bcrypt from 'bcrypt';


//___________( get all users by admin )______________

const getALlUsersByAdmin = async (_, res) => {
    try {
        const users = await User.find({role : "Employee"}).select("-password");
        
        res.status(200).json({
            success: true,
            message: "All users fetch successfully",
            count: users.length,
            users,
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
        message: "Full name should contain only letters.",
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
      stats: {}
     })
};

export { getALlUsersByAdmin, updateUserByAdmin, deleteUserByAdmin,dashboardData };

import { User } from "../models/User";


//___________( get all users by admin )______________

const getALlUsersByAdmin = async (_, res) => {
    try {
        const users = await User.find().select("-password");
        
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
        const updatedData = req.body;
        
        const user = await User.findByIdAndUpdate(id, updatedData, {
            new: true,
            runValidators: true,
        }).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
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

export { getALlUsersByAdmin, updateUserByAdmin, deleteUserByAdmin };

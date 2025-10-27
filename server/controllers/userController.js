import { User } from "../models/User.js"; 

//_____________( Get user profile details )_________________

const getProfile = async (req, res) => {
    try {
        const { email } = req.user;  
        
        const user = await User.findOne({ email }).select("-password"); // exclude password for security
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
    return res.status(200).json({
        success: true,
        message: "User profile fetched successfully",
        data: user,
    });
    
} catch (error) {
    console.error("Error fetching user profile:", error);
    
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
};


//_____________( Update user Profile )_________________

const updateProfile = async (req, res) => {
    try {
        const { email } = req.user; 
        const { fullName, newEmail } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        if (fullName) user.fullName = fullName;
        if (newEmail) user.email = newEmail;
        
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                fullName: user.fullName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


//_____________( Update new Password )_________________

const changePassword = async (req, res) => {
    try {
        const { email } = req.user;
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Old and new password are required",
            });
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
} catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
};
export { getProfile, updateProfile, changePassword };
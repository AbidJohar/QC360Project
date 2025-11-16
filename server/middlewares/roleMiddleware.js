

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
     
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found",
        });
      }

      if (!allowedRoles.includes(user.role)) {
        const roleList = allowedRoles.join(", ");
        return res.status(403).json({
          success: false,
          message: `Access denied, only ${roleList}`,
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking role",
        error: error.message,
      });
    }
  };
};

export default roleMiddleware;
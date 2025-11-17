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

      // Check user status
      if (user.status === "Submitted" || user.status === "Rejected") {
        return res.status(403).json({
          success: false,
          message: "You are not approved yet to fetch all the requests data.",
        });
      }

      // Check allowed roles
      if (!allowedRoles.includes(user.role)) {
        const roleList = allowedRoles.join(", ");
        return res.status(403).json({
          success: false,
          message: `Access denied, only ${roleList} allowed`,
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

const userModel = require("../models/userModel");

function permission(requiredRole) {
  return async function (req, res, next) {
    try {
      const userId = req.userId; // assuming authToken middleware sets req.userId
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized", error: true, success: false });
      }
      const user = await userModel.findById(userId);
      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden", error: true, success: false });
      }
      next();
    } catch (err) {
      res.status(500).json({ message: err.message || err, error: true, success: false });
    }
  };
}

module.exports = permission;
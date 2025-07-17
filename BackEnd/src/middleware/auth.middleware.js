const jwt = require('jsonwebtoken');
const DB = require('../utils/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user with role information
      const user = await DB.query(`
        SELECT u.*, r.roleName, r.displayName 
        FROM users u 
        JOIN roles r ON u.roleId = r.id 
        WHERE u.id = ? AND u.isActive = 1
      `, [decoded.id]);

      if (!user || user.length === 0) {
        return res.status(401).json({ message: 'Not authorized, user not found or inactive' });
      }

      req.user = user[0];
      delete req.user.password;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roleName)) {
      return res.status(403).json({ 
        message: `Role ${req.user.displayName} is not authorized to access this resource` 
      });
    }
    next();
  };
};

// Middleware aliases for common role checks
const adminOnly = authorize('Admin');
const adminOrManager = authorize('Admin', 'FleetManager');

module.exports = { 
  protect, 
  authorize,
  adminOnly,
  adminOrManager
};


const User = require('../models/User');

module.exports = async function(req, res, next) {
    try {
      // Get user from database to check type
      const user = await User.findById(req.user.id);
  
      // Check if user exists and is an admin
      if (!user || user.type !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin rights required.' });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
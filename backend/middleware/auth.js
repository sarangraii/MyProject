const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    // Extract token (expecting "Bearer TOKEN")
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await User.findOne({ 
      _id: decoded.id 
    });

    if (!user) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    // Attach user and token to request object
    req.token = token;
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication token expired' });
    }

    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth;
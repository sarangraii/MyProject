// routes/authRoutes.js
const express = require('express');
const router = express.Router();
// const authController = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');
// const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin=require('../models/Admin');

// // Login route
// router.post('/login', [
//   check('email', 'Please include a valid email').isEmail(),
//   check('password', 'Password is required').exists()
// ], authController.login);
// Login user router
router.post('/login', async (req, res) => {
  try {
    const { email, password, type } = req.body;
    
    // Determine which collection to query based on type
    let user;
    if (type === 'admin') {
      // Find admin by email
      user = await Admin.findOne({ email });
    } else {
      // Default to regular user
      user = await User.findOne({ email });
    }
    
    // Check if user/admin exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Create JWT token with user type included
    const token = jwt.sign(
      { 
        userId: user._id,
        userType: type === 'admin' ? 'admin' : 'user'
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    // Return user info (without password) and token
    const userResponse = { ...user._doc };
    delete userResponse.password;
    
    res.json({ 
      message: `${type === 'admin' ? 'Admin' : 'User'} login successful`, 
      token, 
      user: userResponse 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get current user route
// router.get('/me', protect, authController.getCurrentUser);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const User = require('../models/User');
// const { sendVerificationEmail } = require('../utils/emailService');
// require('dotenv').config();

// // Register new user
// router.post('/register', async (req, res) => {
//   try {
//     const { fullName, email, password, type } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const verificationToken = jwt.sign(
//       { email },
//       process.env.JWT_SECRET,
//       { expiresIn: '15m' }
//     );

//     const verificationExpires = new Date();
//     verificationExpires.setMinutes(verificationExpires.getMinutes() + 15);

//     const newUser = new User({
//       fullName,
//       email,
//       password,
//       type,
//       verificationToken,
//       verificationExpires
//     });

//     await newUser.save();
//     await sendVerificationEmail(email, verificationToken);

//     res.status(201).json({ 
//       message: 'Registration successful. Please verify your email.' 
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Login user
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password, type } = req.body;

//     const user = await User.findOne({ email, type });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     if (!user.isVerified) {
//       return res.status(401).json({ 
//         message: 'Email not verified', 
//         code: 'EMAIL_NOT_VERIFIED',
//         email: user.email
//       });
//     }

//     const token = jwt.sign(
//       { userId: user._id, userType: user.type },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.json({ 
//       token, 
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         type: user.type
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Verify email
// router.get('/verify-email', async (req, res) => {
//   try {
//     const { token } = req.query;
    
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findOne({
//       email: decoded.email,
//       verificationToken: token,
//       verificationExpires: { $gt: new Date() }
//     });

//     if (!user) {
//       return res.redirect(`${process.env.CLIENT_URL}/verification-error`);
//     }

//     user.isVerified = true;
//     user.verificationToken = undefined;
//     user.verificationExpires = undefined;
//     await user.save();

//     res.redirect(`${process.env.CLIENT_URL}/verification-success`);
//   } catch (error) {
//     console.error('Email verification error:', error);
//     res.redirect(`${process.env.CLIENT_URL}/verification-error`);
//   }
// });

// // Resend verification email
// router.post('/resend-verification', async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email, isVerified: false });
//     if (!user) {
//       return res.status(400).json({ 
//         message: 'User not found or already verified' 
//       });
//     }

//     const verificationToken = jwt.sign(
//       { email },
//       process.env.JWT_SECRET,
//       { expiresIn: '15m' }
//     );

//     const verificationExpires = new Date();
//     verificationExpires.setMinutes(verificationExpires.getMinutes() + 15);

//     user.verificationToken = verificationToken;
//     user.verificationExpires = verificationExpires;
//     await user.save();

//     await sendVerificationEmail(email, verificationToken);

//     res.status(200).json({ 
//       message: 'Verification email resent. Please check your inbox.' 
//     });
//   } catch (error) {
//     console.error('Resend verification error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;

// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        hasProfile: !!(user.address || user.area || user.city)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// // controllers/authController.js
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

// // Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // or your preferred email service
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// // Generate random verification code
// const generateVerificationCode = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Login controller
// exports.login = async (req, res) => {
//   try {
//     const { email, password, type } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email, userType: type });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Verify password
//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email, type: user.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     // Return user and token
//     res.status(200).json({
//       token,
//       user: {
//         _id: user._id,
//         email: user.email,
//         type: user.userType,
//         isEmailVerified: user.isEmailVerified
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Send verification code
// exports.sendVerificationCode = async (req, res) => {
//   try {
//     const { email, userId } = req.body;

//     // Find user
//     const user = await User.findById(userId);
//     if (!user || user.email !== email) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Generate verification code
//     const verificationCode = generateVerificationCode();
    
//     // Set expiration (30 minutes from now)
//     const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

//     // Update user with verification code
//     user.emailVerificationCode = {
//       code: verificationCode,
//       expiresAt
//     };
//     await user.save();

//     // Send email with verification code
//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: user.email,
//       subject: 'Email Verification Code',
//       html: `
//         <h1>Email Verification</h1>
//         <p>Your verification code is: <strong>${verificationCode}</strong></p>
//         <p>This code will expire in 30 minutes.</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);
    
//     res.status(200).json({ message: 'Verification code sent successfully' });
//   } catch (error) {
//     console.error('Send verification error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Verify email
// exports.verifyEmail = async (req, res) => {
//   try {
//     const { userId, verificationCode } = req.body;

//     // Find user
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if verification code exists and is not expired
//     if (!user.emailVerificationCode || 
//         !user.emailVerificationCode.code || 
//         !user.emailVerificationCode.expiresAt ||
//         new Date() > new Date(user.emailVerificationCode.expiresAt)) {
//       return res.status(400).json({ message: 'Verification code expired or invalid' });
//     }

//     // Check if verification code matches
//     if (user.emailVerificationCode.code !== verificationCode) {
//       return res.status(400).json({ message: 'Invalid verification code' });
//     }

//     // Mark email as verified
//     user.isEmailVerified = true;
//     user.emailVerificationCode = undefined; // Clear verification code
//     await user.save();

//     // Generate new JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email, type: user.userType },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     // Return success with token and user
//     res.status(200).json({
//       message: 'Email verified successfully',
//       token,
//       user: {
//         _id: user._id,
//         email: user.email,
//         type: user.userType,
//         isEmailVerified: true
//       }
//     });
//   } catch (error) {
//     console.error('Verify email error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

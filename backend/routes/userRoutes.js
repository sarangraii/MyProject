// routes/userRoutes.js
const express = require('express');
const router = express.Router();
// const userController = require('../controllers/userController');
// const { protect, adminOnly } = require('../middleware/authMiddleware');
// const { check } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin=require('../models/Admin');

// // Public routes
// router.post('/', [
//   check('fullName', 'Full name is required').not().isEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check('phoneNumber', 'Phone number is required').not().isEmpty(),
//   check('country', 'Country is required').not().isEmpty(),
//   check('gender', 'Gender is required').not().isEmpty(),
//   check('userType', 'User type is required').not().isEmpty(),
//   check('password', 'Password must be at least 8 characters').isLength({ min: 8 })
// ], userController.createUser);
// Register new user or admin
router.post("/", async (req, res) => {
  try {
    const { fullName, email,phone, country, gender, type,password } = req.body;

    // Check if email already exists in either schema
    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    let user;
    if (type === "user") {
      user = new User({ fullName, email,phone, country, gender, type,password });
    } else if (type === "admin") {
      user = new Admin({ fullName, email,phone, country, gender, type,password  });
    } else {
      return res.status(400).json({ message: "Invalid account type" });
    }

    await user.save();

    // Create JWT token
    const token = jwt.sign({ userId: user._id, type: user.type }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user info (without password) and token
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res.status(201).json({
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} registered successfully`,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Protected routes
// router.get('/profile', protect, userController.getUserProfile);
// router.put('/profile', protect, userController.updateUserProfile);

// Admin and general routes
// router.get('/', protect, userController.getAllUsers);
// router.get('/:id', protect, userController.getUserById);
// router.put('/:id', protect, userController.updateUser);
// router.delete('/:id', protect, userController.deleteUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Multer storage configuration for profile image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/admin-profile-images/');
  },
  filename: function (req, file, cb) {
    cb(null, `admin-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get Admin Profile
router.get('/profile', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const admin = await User.findById(req.user.id).select('-password');
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      res.json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// Update Admin Profile
router.put('/profile', 
  authMiddleware, 
  adminMiddleware,
  upload.single('profileImage'), 
  async (req, res) => {
    try {
      const { fullName, phone } = req.body;
      
      const updateFields = {
        fullName,
        phone
      };

      // If a new profile image was uploaded
      if (req.file) {
        updateFields.profileImage = req.file.path;
      }

      const admin = await User.findByIdAndUpdate(
        req.user.id, 
        { $set: updateFields }, 
        { new: true, runValidators: true }
      ).select('-password');

      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      res.json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// Get All Users
router.get('/users', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const users = await User.find({ type: 'user' }).select('-password');
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// Block/Unblock User
router.put('/users/:userId/block', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { isBlocked } = req.body;

      const user = await User.findByIdAndUpdate(
        userId, 
        { $set: { isBlocked } }, 
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

// Delete User
router.delete('/users/:userId', 
  authMiddleware, 
  adminMiddleware, 
  async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
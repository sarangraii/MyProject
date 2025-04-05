// /routes/users.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { protect, admin } = require('../middleware/authMiddleware');
const { updateHomeContent, getHomeContent } = require('../controllers/homeController');

const { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');


router.post('/', protect, admin, updateHomeContent);
router.route('/')
  .get(homeController.getHomeContent)
  .post(protect, admin, homeController.updateHomeContent);
router.route('/profile')
  .get(protect, getUserProfile)
  .patch(protect, updateUserProfile);

module.exports = router;

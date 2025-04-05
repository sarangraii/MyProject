// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getAvailableTimeSlots
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/available-slots', getAvailableTimeSlots);

// Protected routes
router.route('/')
  .post(protect, createBooking)
  .get(protect, getUserBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, deleteBooking);

router.route('/:id/status')
  .patch(protect, updateBookingStatus);

module.exports = router;


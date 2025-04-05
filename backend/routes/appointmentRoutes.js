// server/routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getUserAppointments, 
  getAppointmentById, 
  updateAppointment, 
  updateAppointmentStatus, 
  deleteAppointment,
  getAvailableTimeSlots
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/available', getAvailableTimeSlots);

// Protected routes
router.route('/')
  .post(protect, createAppointment)
  .get(protect, getUserAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

router.route('/:id/status')
  .patch(protect, updateAppointmentStatus);

module.exports = router;

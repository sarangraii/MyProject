// controllers/bookingController.js
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Stylist = require('../models/Stylist');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { serviceId, stylistId, date, timeSlot, notes } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if stylist exists
    const stylist = await Stylist.findById(stylistId);
    if (!stylist) {
      return res.status(404).json({ message: 'Stylist not found' });
    }

    // Check if the time slot is available
    const bookingDate = new Date(date);
    const existingBooking = await Booking.findOne({
      stylist: stylistId,
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0)),
        $lt: new Date(bookingDate.setHours(23, 59, 59))
      },
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create the booking
    const booking = new Booking({
      user: req.user._id,
      service: serviceId,
      stylist: stylistId,
      date: new Date(date),
      timeSlot,
      notes
    });

    const createdBooking = await booking.save();

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all bookings for logged in user
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service', 'name price duration image')
      .populate('stylist', 'name specialization')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name description price duration image category gender')
      .populate('stylist', 'name specialization image')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the logged-in user or user is admin
    if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the logged-in user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Only admin can confirm or complete bookings
    if ((status === 'confirmed' || status === 'completed') && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to change to this status' });
    }
    
    booking.status = status;
    const updatedBooking = await booking.save();
    
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the logged-in user or user is admin
    if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await booking.deleteOne();
    
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get available time slots
// @route   GET /api/bookings/available-slots
// @access  Public
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, stylistId, serviceId } = req.query;
    
    if (!date || !stylistId || !serviceId) {
      return res.status(400).json({ message: 'Date, stylist ID, and service ID are required' });
    }
    
    // Get service to determine duration
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Get stylist to determine working hours
    const stylist = await Stylist.findById(stylistId);
    if (!stylist) {
      return res.status(404).json({ message: 'Stylist not found' });
    }
    
    // Check if stylist works on the selected day
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleString('en-US', { weekday: 'long' });
    
    if (!stylist.workingDays.includes(dayOfWeek)) {
      return res.json([]);
    }
    
    // Get all booked appointments for the specified date and stylist
    const bookingDate = new Date(date);
    const bookedAppointments = await Booking.find({
      stylist: stylistId,
      date: {
        $gte: new Date(bookingDate.setHours(0, 0, 0)),
        $lt: new Date(bookingDate.setHours(23, 59, 59))
      },
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');
    
    // Extract booked time slots
    const bookedTimeSlots = bookedAppointments.map(appointment => appointment.timeSlot);
    
    // Generate available time slots based on stylist's working hours
    const [startHour, startMinute] = stylist.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = stylist.workingHours.end.split(':').map(Number);
    
    const serviceDuration = parseInt(service.duration);
    const timeSlotInterval = 30; // minutes
    
    const availableTimeSlots = [];
    
    // Start from stylist's working hours start time
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    // Generate time slots until end of working hours
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeSlot = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      // Check if this time slot is available
      if (!bookedTimeSlots.includes(timeSlot)) {
        availableTimeSlots.push(timeSlot);
      }
      
      // Move to next time slot
      currentMinute += timeSlotInterval;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute = 0;
      }
    }
    
    res.json(availableTimeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  getAvailableTimeSlots
};
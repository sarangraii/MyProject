// server/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const { serviceId, stylist, date, time, notes } = req.body;
    
    // Get service details to calculate price and duration
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      stylist,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    const appointment = new Appointment({
      user: req.user._id,
      service: serviceId,
      stylist,
      date: new Date(date),
      time,
      duration: service.duration,
      price: service.price,
      notes
    });
    
    const createdAppointment = await appointment.save();
    
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('service', 'name price duration image')
      .sort({ date: 1 });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('service', 'name description price duration image category gender')
      .populate('user', 'name email phone');
    
    if (appointment) {
      // Check if the appointment belongs to the logged-in user
      if (appointment.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
        res.json(appointment);
      } else {
        res.status(403).json({ message: 'Not authorized' });
      }
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const { serviceId, stylist, date, time, notes } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the appointment belongs to the logged-in user
    if (appointment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // If changing service, get new service details
    let service = null;
    if (serviceId && serviceId !== appointment.service.toString()) {
      service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
    }
    
    // If changing date/time/stylist, check availability
    if ((date && date !== appointment.date.toISOString().split('T')[0]) || 
        (time && time !== appointment.time) || 
        (stylist && stylist !== appointment.stylist)) {
      
      const checkDate = date ? new Date(date) : appointment.date;
      const checkTime = time || appointment.time;
      const checkStylist = stylist || appointment.stylist;
      
      const existingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id }, // Exclude current appointment
        stylist: checkStylist,
        date: checkDate,
        time: checkTime,
        status: { $in: ['pending', 'confirmed'] }
      });
      
      if (existingAppointment) {
        return res.status(400).json({ message: 'This time slot is already booked' });
      }
    }
    
    // Update appointment
    appointment.service = serviceId || appointment.service;
    appointment.stylist = stylist || appointment.stylist;
    appointment.date = date ? new Date(date) : appointment.date;
    appointment.time = time || appointment.time;
    appointment.notes = notes !== undefined ? notes : appointment.notes;
    
    // Update price and duration if service changed
    if (service) {
      appointment.price = service.price;
      appointment.duration = service.duration;
    }
    
    const updatedAppointment = await appointment.save();
    
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Only user or admin can cancel, only admin can confirm/complete
    if (status === 'cancelled') {
      if (appointment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    appointment.status = status;
    
    const updatedAppointment = await appointment.save();
    
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the appointment belongs to the logged-in user or is admin
    if (appointment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await appointment.deleteOne();
    
    res.json({ message: 'Appointment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get available time slots
// @route   GET /api/appointments/available
// @access  Public
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, serviceId, stylist } = req.query;
    
    if (!date || !serviceId || !stylist) {
      return res.status(400).json({ message: 'Date, service ID, and stylist are required' });
    }
    
    // Get service to determine duration
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Get all booked appointments for the specified date and stylist
    const bookedAppointments = await Appointment.find({
      stylist,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    }).select('time duration');
    
    // Define business hours (e.g., 9 AM to 7 PM)
    const businessHours = {
      start: 9, // 9 AM
      end: 19   // 7 PM
    };
    
    // Generate all possible time slots (e.g., every 30 minutes)
    const timeSlotInterval = 30; // minutes
    const allTimeSlots = [];
    
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      for (let minute = 0; minute < 60; minute += timeSlotInterval) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allTimeSlots.push(timeString);
      }
    }
    
    // Filter out booked time slots
    const availableTimeSlots = allTimeSlots.filter(timeSlot => {
      const [hour, minute] = timeSlot.split(':').map(Number);
      const slotTime = hour * 60 + minute; // Convert to minutes
      
      // Check if this time slot overlaps with any booked appointment
      return !bookedAppointments.some(appointment => {
        const [appHour, appMinute] = appointment.time.split(':').map(Number);
        const appTime = appHour * 60 + appMinute; // Convert to minutes
        
        // Check if the time slot falls within the appointment duration
        return (slotTime >= appTime && slotTime < appTime + appointment.duration) ||
               (slotTime + service.duration > appTime && slotTime < appTime);
      });
    });
    
    res.json(availableTimeSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getAvailableTimeSlots
};

// controllers/stylistController.js
const Stylist = require('../models/Stylist');

// @desc    Get all stylists
// @route   GET /api/stylists
// @access  Public
const getStylists = async (req, res) => {
  try {
    const stylists = await Stylist.find({ isActive: true });
    res.json(stylists);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get stylist by ID
// @route   GET /api/stylists/:id
// @access  Public
const getStylistById = async (req, res) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    
    if (!stylist) {
      return res.status(404).json({ message: 'Stylist not found' });
    }
    
    res.json(stylist);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getStylists,
  getStylistById
};

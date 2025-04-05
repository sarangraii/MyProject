// server/controllers/clientController.js
const Client = require('../models/Client');
const generateToken = require('../utils/generateToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/profile-pictures';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, and PNG image files are allowed'));
    }
  }
}).single('profilePicture');

// @desc    Register a new client
// @route   POST /api/clients/register
// @access  Public
const registerClient = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if client already exists
    const clientExists = await Client.findOne({ email });
    
    if (clientExists) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }
    
    // Create new client
    const client = await Client.create({
      name,
      email,
      password,
      phone,
      role: 'client'
    });
    
    if (client) {
      res.status(201).json({
        _id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        role: client.role,
        token: generateToken(client._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid client data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate client & get token
// @route   POST /api/clients/login
// @access  Public
const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find client by email
    const client = await Client.findOne({ email });
    
    // Check if client exists and password matches
    if (client && (await client.matchPassword(password))) {
      res.json({
        _id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        role: client.role,
        token: generateToken(client._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get client profile
// @route   GET /api/clients/profile
// @access  Private
const getClientProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.user._id).select('-password');
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update client profile
// @route   PUT /api/clients/profile
// @access  Private
const updateClientProfile = async (req, res) => {
  try {
    const { name, email, phone, gender, dateOfBirth } = req.body;
    
    const client = await Client.findById(req.user._id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Update fields
    client.name = name || client.name;
    client.email = email || client.email;
    client.phone = phone || client.phone;
    client.gender = gender || client.gender;
    client.dateOfBirth = dateOfBirth || client.dateOfBirth;
    
    const updatedClient = await client.save();
    
    res.json({
      _id: updatedClient._id,
      name: updatedClient.name,
      email: updatedClient.email,
      phone: updatedClient.phone,
      gender: updatedClient.gender,
      dateOfBirth: updatedClient.dateOfBirth,
      profilePicture: updatedClient.profilePicture,
      addresses: updatedClient.addresses,
      paymentMethods: updatedClient.paymentMethods,
      favorites: updatedClient.favorites,
      reviews: updatedClient.reviews,
      notificationPreferences: updatedClient.notificationPreferences,
      role: updatedClient.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/clients/profile/picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Delete old profile picture if exists
      if (client.profilePicture) {
        const oldPicturePath = path.join(__dirname, '..', client.profilePicture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }
      
      // Update profile picture path
      client.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
      
      const updatedClient = await client.save();
      
      res.json({
        profilePicture: updatedClient.profilePicture
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Change client password
// @route   PUT /api/clients/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const client = await Client.findById(req.user._id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Check if current password matches
    if (!(await client.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    client.password = newPassword;
    await client.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Add client address
// @route   POST /api/clients/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;
    
    const client = await Client.findById(req.user._id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // If this is the first address or isDefault is true, set all other addresses to not default
    if (isDefault || client.addresses.length === 0) {
      client.addresses.forEach(address => {
        address.isDefault = false;
      });
    }
    
    // Add new address
    client.addresses.push({
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault || client.addresses.length === 0 // Make default if it's the first address
    });
    
    const updatedClient = await client.save();
    
    res.status(201).json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update client address
// @route   PUT /api/clients/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const { addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;
    
    const client = await Client.findById(req.user._id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Find address by ID
    const address = client.addresses.id(req.params.id);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    // If setting this address as default, unset all others
    if (isDefault && !address.isDefault) {
      client.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }
    
    // Update address fields
    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 || address.addressLine2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.postalCode = postalCode || address.postalCode;
    address.country = country || address.country;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
    
    const updatedClient = await client.save();
    
    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  registerClient,
  loginClient,
  getClientProfile,
  updateClientProfile,
  uploadProfilePicture,
  changePassword,
  addAddress,
  updateAddress,
  // Additional functions will be added here
};

// server/controllers/clientController.js (continued)

// @desc    Delete client address
// @route   DELETE /api/clients/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Find address by ID
      const address = client.addresses.id(req.params.id);
      
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
      
      // Remove address
      address.remove();
      
      // If the removed address was default and there are other addresses, make the first one default
      if (address.isDefault && client.addresses.length > 0) {
        client.addresses[0].isDefault = true;
      }
      
      const updatedClient = await client.save();
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Set address as default
  // @route   PATCH /api/clients/addresses/:id/default
  // @access  Private
  const setDefaultAddress = async (req, res) => {
    try {
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Find address by ID
      const address = client.addresses.id(req.params.id);
      
      if (!address) {
        return res.status(404).json({ message: 'Address not found' });
      }
      
      // Set all addresses to not default
      client.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      
      // Set selected address as default
      address.isDefault = true;
      
      const updatedClient = await client.save();
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Add payment method
  // @route   POST /api/clients/payment-methods
  // @access  Private
  const addPaymentMethod = async (req, res) => {
    try {
      const { type, name, details, isDefault } = req.body;
      
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // If this is the first payment method or isDefault is true, set all other payment methods to not default
      if (isDefault || client.paymentMethods.length === 0) {
        client.paymentMethods.forEach(method => {
          method.isDefault = false;
        });
      }
      
      // Add new payment method
      client.paymentMethods.push({
        type,
        name,
        details,
        isDefault: isDefault || client.paymentMethods.length === 0 // Make default if it's the first payment method
      });
      
      const updatedClient = await client.save();
      
      res.status(201).json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Update payment method
  // @route   PUT /api/clients/payment-methods/:id
  // @access  Private
  const updatePaymentMethod = async (req, res) => {
    try {
      const { type, name, details, isDefault } = req.body;
      
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Find payment method by ID
      const paymentMethod = client.paymentMethods.id(req.params.id);
      
      if (!paymentMethod) {
        return res.status(404).json({ message: 'Payment method not found' });
      }
      
      // If setting this payment method as default, unset all others
      if (isDefault && !paymentMethod.isDefault) {
        client.paymentMethods.forEach(method => {
          method.isDefault = false;
        });
      }
      
      // Update payment method fields
      paymentMethod.type = type || paymentMethod.type;
      paymentMethod.name = name || paymentMethod.name;
      paymentMethod.details = details || paymentMethod.details;
      paymentMethod.isDefault = isDefault !== undefined ? isDefault : paymentMethod.isDefault;
      
      const updatedClient = await client.save();
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Delete payment method
  // @route   DELETE /api/clients/payment-methods/:id
  // @access  Private
  const deletePaymentMethod = async (req, res) => {
    try {
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Find payment method by ID
      const paymentMethod = client.paymentMethods.id(req.params.id);
      
      if (!paymentMethod) {
        return res.status(404).json({ message: 'Payment method not found' });
      }
      
      // Remove payment method
      paymentMethod.remove();
      
      // If the removed payment method was default and there are other payment methods, make the first one default
      if (paymentMethod.isDefault && client.paymentMethods.length > 0) {
        client.paymentMethods[0].isDefault = true;
      }
      
      const updatedClient = await client.save();
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Add salon to favorites
  // @route   POST /api/clients/favorites
  // @access  Private
  const addFavorite = async (req, res) => {
    try {
      const { salonId } = req.body;
      
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Check if salon is already in favorites
      if (client.favorites.some(fav => fav.salon.toString() === salonId)) {
        return res.status(400).json({ message: 'Salon already in favorites' });
      }
      
      // Add salon to favorites
      client.favorites.push({
        salon: salonId
      });
      
      const updatedClient = await client.save();
      
      res.status(201).json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Remove salon from favorites
  // @route   DELETE /api/clients/favorites/:salonId
  // @access  Private
  const removeFavorite = async (req, res) => {
    try {
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Find favorite by salon ID
      const favoriteIndex = client.favorites.findIndex(
        fav => fav.salon.toString() === req.params.salonId
      );
      
      if (favoriteIndex === -1) {
        return res.status(404).json({ message: 'Salon not found in favorites' });
      }
      
      // Remove favorite
      client.favorites.splice(favoriteIndex, 1);
      
      const updatedClient = await client.save();
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Add salon review
  // @route   POST /api/clients/reviews
  // @access  Private
  const addReview = async (req, res) => {
    try {
      const { salonId, rating, comment } = req.body;
      
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Check if client has already reviewed this salon
      const existingReviewIndex = client.reviews.findIndex(
        review => review.salon.toString() === salonId
      );
      
      if (existingReviewIndex !== -1) {
        // Update existing review
        client.reviews[existingReviewIndex].rating = rating;
        client.reviews[existingReviewIndex].comment = comment;
        client.reviews[existingReviewIndex].date = Date.now();
      } else {
        // Add new review
        client.reviews.push({
          salon: salonId,
          rating,
          comment
        });
      }
      
      const updatedClient = await client.save();
      
      res.status(201).json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Delete salon review
  // @route   DELETE /api/clients/reviews/:salonId
  // @access  Private
  const deleteReview = async (req, res) => {
    try {
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Find review by salon ID
      const reviewIndex = client.reviews.findIndex(
        review => review.salon.toString() === req.params.salonId
      );
      
      if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      // Remove review
      client.reviews.splice(reviewIndex, 1);
      
      const updatedClient = await client.save();
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  // @desc    Update notification preferences
  // @route   PUT /api/clients/notification-preferences
  // @access  Private
  const updateNotificationPreferences = async (req, res) => {
    try {
      const { email, sms, app } = req.body;
      
      const client = await Client.findById(req.user._id);
      
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      
      // Update notification preferences
      client.notificationPreferences.email = email !== undefined ? email : client.notificationPreferences.email;
      client.notificationPreferences.sms = sms !== undefined ? sms : client.notificationPreferences.sms;
      client.notificationPreferences.app = app !== undefined ? app : client.notificationPreferences.app;
      
      const updatedClient = await client.save();
      
      res.json(updatedClient);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  
  module.exports = {
    registerClient,
    loginClient,
    getClientProfile,
    updateClientProfile,
    uploadProfilePicture,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    addFavorite,
    removeFavorite,
    addReview,
    deleteReview,
    updateNotificationPreferences
  };


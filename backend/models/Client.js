// server/models/Client.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = mongoose.Schema({
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const paymentMethodSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'wallet']
  },
  name: {
    type: String,
    required: true
  },
  details: {
    type: Object,
    required: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const favoriteSchema = mongoose.Schema({
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const reviewSchema = mongoose.Schema({
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const notificationPreferencesSchema = mongoose.Schema({
  email: {
    type: Boolean,
    default: true
  },
  sms: {
    type: Boolean,
    default: true
  },
  app: {
    type: Boolean,
    default: true
  }
});

const clientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  dateOfBirth: {
    type: Date
  },
  profilePicture: {
    type: String
  },
  addresses: [addressSchema],
  paymentMethods: [paymentMethodSchema],
  favorites: [favoriteSchema],
  reviews: [reviewSchema],
  notificationPreferences: {
    type: notificationPreferencesSchema,
    default: () => ({})
  },
  role: {
    type: String,
    default: 'client'
  }
}, {
  timestamps: true
});

// Hash password before saving
clientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
clientSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

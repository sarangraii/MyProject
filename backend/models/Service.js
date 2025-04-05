// /models/Service.js
const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['haircuts', 'coloring', 'treatments', 'makeup', 'spa', 'nails'],
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'unisex'],
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;

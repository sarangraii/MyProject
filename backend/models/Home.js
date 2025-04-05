// backend/models/Home.js
const mongoose = require('mongoose');

const homeSchema = mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: 'Welcome to One Stop Salon'
    },
    heroDescription: {
      type: String,
      default: 'Your one-stop destination for all beauty needs'
    },
    features: [
      {
        title: String,
        description: String,
        icon: String,
        image: String
      }
    ],
    services: [
      {
        title: String,
        description: String,
        image: String
      }
    ],
    gallery: [
      {
        image: String,
        alt: String
      }
    ],
    testimonials: [
      {
        name: String,
        comment: String,
        image: String
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;

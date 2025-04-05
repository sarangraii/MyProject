// backend/controllers/homeController.js
const Home = require('../models/Home');

// @desc    Get home page content
// @route   GET /api/home
// @access  Public
const getHomeContent = async (req, res) => {
  try {
    const homeContent = await Home.findOne();
    res.json(homeContent || {});
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update home page content
// @route   POST /api/home
// @access  Private/Admin
const updateHomeContent = async (req, res) => {
  try {
    const { 
      heroTitle, 
      heroDescription, 
      features, 
      services, 
      gallery, 
      testimonials 
    } = req.body;
    
    let homeContent = await Home.findOne();
    
    if (homeContent) {
      homeContent.heroTitle = heroTitle || homeContent.heroTitle;
      homeContent.heroDescription = heroDescription || homeContent.heroDescription;
      homeContent.features = features || homeContent.features;
      homeContent.services = services || homeContent.services;
      homeContent.gallery = gallery || homeContent.gallery;
      homeContent.testimonials = testimonials || homeContent.testimonials;
    } else {
      homeContent = new Home({
        heroTitle,
        heroDescription,
        features,
        services,
        gallery,
        testimonials
      });
    }
    
    const updatedContent = await homeContent.save();
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getHomeContent,
  updateHomeContent
};

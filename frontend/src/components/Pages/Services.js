// src/components/Pages/Services.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGender, setActiveGender] = useState('all');

  // Service categories
  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'haircuts', name: 'Haircuts & Styling' },
    { id: 'coloring', name: 'Hair Coloring' },
    { id: 'treatments', name: 'Hair Treatments' },
    { id: 'makeup', name: 'Makeup & Beauty' },
    { id: 'spa', name: 'Spa & Massage' },
    { id: 'nails', name: 'Nail Care' }
  ];

  // Services data
  // Services data
const servicesData = [
    {
      id: 1,
      name: "Men's Haircut",
      description: "Professional haircut tailored to your style preferences.",
      price: "₹2,175",
      duration: "30 min",
      category: "haircuts",
      gender: "male",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      name: "Women's Haircut",
      description: "Custom haircut and styling by our expert stylists.",
      price: "₹3,045",
      duration: "45 min",
      category: "haircuts",
      gender: "female",
      image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      name: "Hair Coloring",
      description: "Full hair coloring with premium products for vibrant, long-lasting color.",
      price: "₹5,655+",
      duration: "90 min",
      category: "coloring",
      gender: "female",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"
    },
    {
      id: 4,
      name: "Highlights",
      description: "Partial or full highlights to add dimension to your hair.",
      price: "₹6,525+",
      duration: "120 min",
      category: "coloring",
      gender: "female",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
    },
    {
      id: 5,
      name: "Deep Conditioning Treatment",
      description: "Intensive hair treatment to restore moisture and shine.",
      price: "₹3,480",
      duration: "45 min",
      category: "treatments",
      gender: "unisex",
      image: "https://images.unsplash.com/photo-1635364477626-7b8d59ad2a41?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 6,
      name: "Keratin Treatment",
      description: "Smoothing treatment that eliminates frizz and adds shine.",
      price: "₹13,050+",
      duration: "120 min",
      category: "treatments",
      gender: "unisex",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 7,
      name: "Bridal Makeup",
      description: "Complete makeup application for your special day.",
      price: "₹10,440",
      duration: "90 min",
      category: "makeup",
      gender: "female",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 8,
      name: "Everyday Makeup",
      description: "Natural-looking makeup for everyday occasions.",
      price: "₹4,350",
      duration: "45 min",
      category: "makeup",
      gender: "female",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
    },
    {
      id: 9,
      name: "Swedish Massage",
      description: "Relaxing full-body massage to relieve tension and stress.",
      price: "₹5,220",
      duration: "60 min",
      category: "spa",
      gender: "unisex",
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 10,
      name: "Deep Tissue Massage",
      description: "Therapeutic massage targeting deeper muscle layers.",
      price: "₹6,525",
      duration: "60 min",
      category: "spa",
      gender: "unisex",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 11,
      name: "Manicure",
      description: "Nail shaping, cuticle care, and polish application.",
      price: "₹2,175",
      duration: "30 min",
      category: "nails",
      gender: "unisex",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 12,
      name: "Pedicure",
      description: "Foot soak, exfoliation, nail care, and polish.",
      price: "₹3,045",
      duration: "45 min",
      category: "nails",
      gender: "unisex",
      image: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 13,
      name: "Beard Trim",
      description: "Professional beard shaping and trimming.",
      price: "₹1,305",
      duration: "15 min",
      category: "haircuts",
      gender: "male",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 14,
      name: "Men's Hair Coloring",
      description: "Natural-looking color to cover gray or change your look.",
      price: "₹3,915",
      duration: "45 min",
      category: "coloring",
      gender: "male",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];
  
  // Filter services based on active category and gender
  const filteredServices = servicesData
    .filter(service => activeCategory === 'all' || service.category === activeCategory)
    .filter(service => activeGender === 'all' || service.gender === activeGender);

  // Handle gender filter click
  const handleGenderFilter = (gender) => {
    setActiveGender(gender);
  };
  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Our Services</h1>
        <p>Discover our range of professional beauty and wellness services</p>
      </div>

      <div className="services-filter">
        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        <div className="gender-filter">
          <span>Filter by:</span>
          <div className="gender-buttons">
            <button 
              className={`gender-btn all ${activeGender === 'all' ? 'active' : ''}`}
              onClick={() => handleGenderFilter('all')}
            >
              All
            </button>
            <button 
              className={`gender-btn male ${activeGender === 'male' ? 'active' : ''}`}
              onClick={() => handleGenderFilter('male')}
            >
              Male
            </button>
            <button 
              className={`gender-btn female ${activeGender === 'female' ? 'active' : ''}`}
              onClick={() => handleGenderFilter('female')}
            >
              Female
            </button>
            <button 
              className={`gender-btn unisex ${activeGender === 'unisex' ? 'active' : ''}`}
              onClick={() => handleGenderFilter('unisex')}
            >
              Unisex
            </button>
          </div>
        </div>
      </div>

      <div className="services-grid">
        {filteredServices.map(service => (
          <div key={service.id} className={`service-card ${service.gender}`}>
            <div className="service-image" style={{ backgroundImage: `url(${service.image})` }}>
              <span className={`service-gender ${service.gender}`}>{service.gender}</span>
            </div>
            <div className="service-content">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-details">
                <span className="service-price">{service.price}</span>
                <span className="service-duration"><i className="far fa-clock"></i> {service.duration}</span>
              </div>
              <div className="service-actions">
                <Link to={`/book-appointment?service=${service.id}`} className="btn-book">Book Now</Link>
                <button className="btn-info">More Info</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="services-cta">
        <div className="cta-content">
          <h2>Can't decide what you need?</h2>
          <p>Schedule a consultation with our experts to get personalized recommendations.</p>
          <Link to="/contact" className="btn-primary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
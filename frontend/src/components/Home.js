// src/components/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Register from './Pages/Register';
import Navbar from './Navbar';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Services from './Pages/Services';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to One Stop Salon</h1>
          <p>Your one-stop destination for all beauty needs</p>
          <Link to="/login" className="btn-primary">Get Started</Link>
          
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Our Features</h2>
            <p>Experience the best salon services with our professional team</p>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <i className="fas fa-cut"></i>
              <h3>Professional Haircuts</h3>
              <p>Get a stylish haircut from expert stylists.</p>
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035" alt="Professional haircut service" className="feature-image" />
            </div>
            <div className="feature-item">
              <i className="fas fa-spa"></i>
              <h3>Relaxing Spa</h3>
              <p>Enjoy a relaxing spa experience.</p>
              <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874" alt="Relaxing spa treatment" className="feature-image" />
            </div>
            <div className="feature-item">
              <i className="fas fa-calendar-check"></i>
              <h3>Easy Appointments</h3>
              <p>Book your salon appointment online hassle-free.</p>
              <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7" alt="Online booking system" className="feature-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <div className="section-title">
            <h2>Our Services</h2>
          </div>
          <div className="services-grid">
            <div className="service-item">
              <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df" alt="Hair styling service" className="service-image" />
              <h3>Hair Styling</h3>
              <p>Trendy and classic hair styling by professionals.</p>
            </div>
            <div className="service-item">
              <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881" alt="Facial treatment" className="service-image" />
              <h3>Facials</h3>
              <p>Rejuvenate your skin with our special facials.</p>
            </div>
            <div className="service-item">
              <img src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b" alt="Manicure and pedicure service" className="service-image" />
              <h3>Manicure & Pedicure</h3>
              <p>Pamper your hands and feet with our nail services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery">
        <div className="container">
          <div className="section-title">
            <h2>Our Gallery</h2>
            <p>Take a look at our salon and services</p>
          </div>
          <div className="gallery-grid">
            <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250" alt="Salon interior" className="gallery-image" />
            <img src="https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3" alt="Hair coloring" className="gallery-image" />
            <img src="https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1" alt="Nail art" className="gallery-image" />
            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035" alt="Haircut service" className="gallery-image" />
            <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937" alt="Salon equipment" className="gallery-image" />
            <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df" alt="Hair styling session" className="gallery-image" />
            <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250" alt="Luxury salon interior" className="gallery-image" />
            <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e" alt="Keratin treatment" className="gallery-image" />
          </div>
        </div>
        </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-title">
            <h2>What Our Clients Say</h2>
          </div>
          <div className="testimonials-container">
            <div className="testimonial-item">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Jane Doe" className="testimonial-image" />
              <p>"Amazing service! My hair has never looked better."</p>
              <h4>- Jane Doe</h4>
            </div>
            <div className="testimonial-item">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="John Smith" className="testimonial-image" />
              <p>"The spa experience was so relaxing. Highly recommend!"</p>
              <h4>- John Smith</h4>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Home;
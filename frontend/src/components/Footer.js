// client/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>OneStopSalon</h3>
            <p>
              Your one-stop destination for all your beauty needs. We provide high-quality salon
              services with skilled professionals.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>

          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/booking">Book Appointment</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p>
              <i className="fas fa-map-marker-alt"></i> Universal Informatics, Bhawarkua
            </p>
            <p>
              <i className="fas fa-phone"></i> 7999862117,8619123623
            </p>
            <p>
              <i className="fas fa-envelope"></i> sarang2452@gmail.com, mahimachhatwani2@gmail.com
            </p>
            <p>
              <i className="fas fa-clock"></i> Mon-Sun: 9:00 AM - 8:00 PM
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} OneStopSalon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
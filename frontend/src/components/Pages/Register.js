import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

// List of countries for dropdown
const countries = [
  'United States', 'India', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Italy', 'Spain', 'Japan', 'China', 'Brazil', 
  'Mexico', 'South Africa', 'Nigeria', 'Egypt', 'Saudi Arabia', 'UAE', 
  'Singapore', 'Malaysia', 'Thailand', 'South Korea'
];

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    gender: "",
    type: ""
  });
  
  // Object to store field-specific errors
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear the specific error when user starts typing in that field
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Full Name validation
    if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    } else if (formData.fullName.trim().length > 50) {
      newErrors.fullName = "Full name cannot exceed 50 characters";
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Name contains invalid characters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must include at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must include at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must include at least one number";
    } else if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(formData.password)) {
      newErrors.password = "Password must include at least one special character";
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Phone number validation
    const phoneClean = formData.phone.replace(/[^\d]/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 15) {
      newErrors.phone = "Phone number must be between 10-15 digits";
    }
    
    // Country validation
    if (!formData.country) {
      newErrors.country = "Please select your country";
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }
    
    // Account type validation
    if (!formData.type) {
      newErrors.type = "Please select account type";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all form fields
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    setLoading(true);
    
    try {
      // Sanitize and prepare data for submission
      const sanitizedData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.replace(/[^\d]/g, ''), // Remove non-numeric characters
        country: formData.country,
        gender: formData.gender,
        type: formData.type
      };
      
      const response = await axios.post("http://localhost:4002/api/users", sanitizedData);
      
      // Automatically log the user in
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      navigate("/login"); // Redirect to user login
    } catch (err) {
      // Handle specific API error responses
      if (err.response?.status === 409) {
        setErrors({ ...errors, email: "This email is already registered" });
      } else if (err.response?.status === 400 && err.response?.data?.field) {
        // Handle field-specific errors from the server
        setErrors({ ...errors, [err.response.data.field]: err.response.data.message });
      } else {
        // General error
        setErrors({ 
          ...errors, 
          general: err.response?.data?.message || "Registration failed. Please try again." 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-form-wrapper">
        <div className="registration-header">
          <h2>Register Yourself</h2>
          <p>Join Glamour Studio to book appointments and access exclusive offers</p>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          {errors.general && <div className="error-message">{errors.general}</div>}
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "error-input" : ""}
              required
            />
            {errors.fullName && <div className="field-error">{errors.fullName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "error-input" : ""}
              required
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={errors.country ? "error-input" : ""}
                required
              >
                <option value="">Select Country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && <div className="field-error">{errors.country}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? "error-input" : ""}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <div className="field-error">{errors.gender}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error-input" : ""}
                required
              />
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error-input" : ""}
                required
              />
              {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Account Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={errors.type ? "error-input" : ""}
              required
            >
              <option value="">Select Account Type</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            {errors.type && <div className="field-error">{errors.type}</div>}
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
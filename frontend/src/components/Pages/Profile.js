// src/components/Pages/Profile.jsx
import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Profile.css';

const Profile = () => {
  // Mock user data - in a real app, this would come from your backend
  const [userData, setUserData] = useState({
    userId: '',
    name: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    address: '',
    area: '',
    city: '',
    bio: '',
    profileImage: null
  });

  const [formData, setFormData] = useState({...userData});
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    // If user data changes (e.g., from API), update form data
    setFormData({...userData});
    
    // Set preview image if user already has a profile image
    if (userData.profileImage) {
      setPreviewImage(userData.profileImage);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        profileImage: 'Please upload a valid image file (JPEG, PNG)'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        ...errors,
        profileImage: 'Image size should be less than 5MB'
      });
      return;
    }

    // Clear any previous errors
    if (errors.profileImage) {
      setErrors({
        ...errors,
        profileImage: ''
      });
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      setFormData({
        ...formData,
        profileImage: file
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    let tempErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]{3,30}$/.test(formData.name.trim())) {
      tempErrors.name = "Name should be 3-30 characters and contain only letters";
    }
    
    // Email validation
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Invalid email format";
    }
    
    // Phone validation
    if (!formData.phoneNumber) {
      tempErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/[-()\s]/g, ''))) {
      tempErrors.phoneNumber = "Phone number should be 10-15 digits";
    }
    
    // WhatsApp validation (optional field)
    if (formData.whatsappNumber && !/^\d{10,15}$/.test(formData.whatsappNumber.replace(/[-()\s]/g, ''))) {
      tempErrors.whatsappNumber = "WhatsApp number should be 10-15 digits";
    }
    
    // Address validation
    if (!formData.address.trim()) {
      tempErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      tempErrors.address = "Address should be at least 5 characters";
    }
    
    // Area validation
    if (!formData.area.trim()) {
      tempErrors.area = "Area is required";
    }
    
    // City validation
    if (!formData.city.trim()) {
      tempErrors.city = "City is required";
    }
    
    // Bio validation (optional but with length limit)
    if (formData.bio && formData.bio.length > 250) {
      tempErrors.bio = "Bio should be less than 250 characters";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, reset form data to original user data
      setFormData({...userData});
      setPreviewImage(userData.profileImage);
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validate()) {
      // Simulate API call to update profile
      setTimeout(() => {
        // Update user data with form data
        setUserData({
          ...formData,
          // If there's a new profile image, use it, otherwise keep the old one
          profileImage: previewImage
        });
        
        setIsEditing(false);
        setIsSubmitting(false);
        toast.success("Profile updated successfully!");
      }, 1500);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and preferences</p>
      </div>
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-image-container">
            <div 
              className="profile-image" 
              onClick={isEditing ? handleImageClick : undefined}
              style={{ 
                backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                cursor: isEditing ? 'pointer' : 'default'
              }}
            >
              {!previewImage && (
                <div className="profile-image-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              )}
              {isEditing && (
                <div className="profile-image-overlay">
                  <i className="fas fa-camera"></i>
                  <span>Change Photo</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/jpeg, image/png, image/jpg" 
              style={{ display: 'none' }} 
            />
            {errors.profileImage && (
              <span className="error-message">{errors.profileImage}</span>
            )}
          </div>
          
          <div className="user-id-container">
            <span className="user-id-label">User ID:</span>
            <span className="user-id">{userData.userId}</span>
          </div>
          
          <div className="profile-actions">
            <button 
              className={`btn-${isEditing ? 'secondary' : 'primary'}`} 
              onClick={handleEditToggle}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
        
        <div className="profile-details">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={errors.phoneNumber ? "error" : ""}
                />
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="whatsappNumber">WhatsApp Number </label>
              <input
                type="tel"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={errors.whatsappNumber ? "error" : ""}
              />
              {errors.whatsappNumber && <span className="error-message">{errors.whatsappNumber}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={errors.address ? "error" : ""}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area">Area</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={errors.area ? "error" : ""}
                />
                {errors.area && <span className="error-message">{errors.area}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={errors.city ? "error" : ""}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                className={errors.bio ? "error" : ""}
                rows="4"
                maxLength="250"
              ></textarea>
              {errors.bio && <span className="error-message">{errors.bio}</span>}
              {isEditing && (
                <div className="character-count">
                  {formData.bio ? formData.bio.length : 0}/250
                </div>
              )}
            </div>
            
            {isEditing && (
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

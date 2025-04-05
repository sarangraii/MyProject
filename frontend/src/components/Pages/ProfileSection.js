import React, { useState } from 'react';
import axios from 'axios';
import './ProfileSection.css';

const ProfileSection = ({ clientData, setClientData }) => {
  const [formData, setFormData] = useState({
    name: clientData.name,
    email: clientData.email,
    phone: clientData.phone || '',
    gender: clientData.gender || '',
    dateOfBirth: clientData.dateOfBirth ? clientData.dateOfBirth.split('T')[0] : '',
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(clientData.profilePicture || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      
      // First update profile data
      const { data } = await axios.put('/api/clients/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // If there's a new profile image, upload it
      if (profileImage) {
        const formData = new FormData();
        formData.append('profilePicture', profileImage);
        
        const imageResponse = await axios.post('/api/clients/profile/picture', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        data.profilePicture = imageResponse.data.profilePicture;
      }
      
      setClientData(data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-section">
      <h2>My Profile</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="profile-picture-upload">
          <div className="profile-picture">
            <img 
              src={imagePreview || '/default-avatar.png'} 
              alt={clientData.name} 
            />
          </div>
          <div className="upload-controls">
            <label htmlFor="profile-image" className="btn-upload">
              Change Profile Picture
            </label>
            <input 
              type="file" 
              id="profile-image" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }}
            />
            {imagePreview !== clientData.profilePicture && (
              <button 
                type="button" 
                className="btn-cancel-upload"
                onClick={() => {
                  setProfileImage(null);
                  setImagePreview(clientData.profilePicture);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select 
              id="gender" 
              name="gender" 
              value={formData.gender} 
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input 
            type="date" 
            id="dateOfBirth" 
            name="dateOfBirth" 
            value={formData.dateOfBirth} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-save" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: '',
    gender: ''
  });
  const [error, setError] = useState('');

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName,
          phone: response.data.phone,
          country: response.data.country,
          gender: response.data.gender
        });
      } catch (err) {
        setError('Failed to fetch profile');
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
        <button 
          className="logout-btn" 
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {!isEditing ? (
        <div className="profile-view">
          <div className="profile-item">
            <strong>Full Name:</strong> {user.fullName}
          </div>
          <div className="profile-item">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="profile-item">
            <strong>Phone:</strong> {user.phone}
          </div>
          <div className="profile-item">
            <strong>Country:</strong> {user.country}
          </div>
          <div className="profile-item">
            <strong>Gender:</strong> {user.gender}
          </div>
          <button 
            className="edit-btn" 
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="profile-edit-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;
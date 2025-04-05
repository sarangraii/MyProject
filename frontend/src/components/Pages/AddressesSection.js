import React, { useState } from 'react';
import axios from 'axios';
import './AddressesSection.css';

const AddressesSection = ({ addresses = [], clientId, setClientData }) => {
  const [formData, setFormData] = useState({
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });
  
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddClick = () => {
    setFormData({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: addresses.length === 0 // Make default if it's the first address
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setFormData({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (editingId) {
        // Update existing address
        response = await axios.put(`/api/clients/addresses/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Add new address
        response = await axios.post('/api/clients/addresses', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      setClientData(response.data);
      setShowForm(false);
      setMessage({ 
        type: 'success', 
        text: editingId ? 'Address updated successfully!' : 'Address added successfully!' 
      });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to save address' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(`/api/clients/addresses/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setClientData(response.data);
      setMessage({ type: 'success', text: 'Address deleted successfully!' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to delete address' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.patch(`/api/clients/addresses/${addressId}/default`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setClientData(response.data);
      setMessage({ type: 'success', text: 'Default address updated!' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update default address' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addresses-section">
      <h2>My Addresses</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      {!showForm && (
        <button onClick={handleAddClick} className="btn-add-address">
          Add New Address
        </button>
      )}
      
      {showForm && (
        <form onSubmit={handleSubmit} className="address-form">
          <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          
          <div className="form-group">
            <label htmlFor="addressLine1">Address Line 1</label>
            <input 
              type="text" 
              id="addressLine1" 
              name="addressLine1" 
              value={formData.addressLine1} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="addressLine2">Address Line 2 (Optional)</label>
            <input 
              type="text" 
              id="addressLine2" 
              name="addressLine2" 
              value={formData.addressLine2} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input 
                type="text" 
                id="city" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State</label>
              <input 
                type="text" 
                id="state" 
                name="state" 
                value={formData.state} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">Postal Code</label>
              <input 
                type="text" 
                id="postalCode" 
                name="postalCode" 
                value={formData.postalCode} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input 
                type="text" 
                id="country" 
                name="country" 
                value={formData.country} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group checkbox">
            <input 
              type="checkbox" 
              id="isDefault" 
              name="isDefault" 
              checked={formData.isDefault} 
              onChange={handleInputChange} 
            />
            <label htmlFor="isDefault">Set as default address</label>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-save" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Address'}
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      
      {addresses.length === 0 && !showForm ? (
        <div className="no-addresses">
          <p>You don't have any saved addresses yet.</p>
        </div>
      ) : (
        <div className="addresses-list">
          {addresses.map(address => (
            <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
              {address.isDefault && <span className="default-badge">Default</span>}
              
              <div className="address-content">
                <p>{address.addressLine1}</p>
                {address.addressLine2 && <p>{address.addressLine2}</p>}
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
              </div>
              
              <div className="address-actions">
                {!address.isDefault && (
                  <button 
                    onClick={() => handleSetDefault(address._id)} 
                    className="btn-set-default"
                  >
                    Set as Default
                  </button>
                )}
                <button 
                  onClick={() => handleEditClick(address)} 
                  className="btn-edit"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(address._id)} 
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesSection;

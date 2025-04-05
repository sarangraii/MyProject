import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminProfile.css'
const AdminProfile = () => {
  // State management
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [adminProfile, setAdminProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImage: null
  });
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10
  });

  // Fetch users list
  const fetchUsers = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/admin/users?page=${page}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUsers(response.data.users);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        pageSize: response.data.pageSize
      });
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Users fetch error:', error);
    }
  };

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setAdminProfile(response.data);
    } catch (error) {
      setError('Failed to fetch admin profile');
      console.error('Profile fetch error:', error);
    }
  };

  // Update admin profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/admin/profile', adminProfile, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setAdminProfile(response.data);
      setIsEditProfileModalOpen(false);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Profile update error:', error);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Profile image upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/profile/image', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setAdminProfile(prev => ({
        ...prev,
        profileImage: response.data.imagePath
      }));
    } catch (error) {
      setError('Failed to upload profile image');
      console.error('Image upload error:', error);
    }
  };

  // Delete user (admin functionality)
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Refresh users list
      fetchUsers(pagination.currentPage);
    } catch (error) {
      setError('Failed to delete user');
      console.error('User delete error:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers();
    fetchAdminProfile();
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-logo">OneStopSalon</div>
        <nav className="sidebar-menu">
          <button 
            className={`sidebar-menu-item ${activeSection === 'users' ? 'sidebar-menu-item-active' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            User Management
          </button>
          <button 
            className={`sidebar-menu-item ${activeSection === 'profile' ? 'sidebar-menu-item-active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            Admin Profile
          </button>
          <button 
            className="sidebar-menu-item text-red-500"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {activeSection === 'users' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">User Management</h1>
            </div>
            
            <div className="user-list-container">
              <table className="user-list-table">
                <thead className="user-list-header">
                  <tr>
                    <th className="user-list-cell">Name</th>
                    <th className="user-list-cell">Email</th>
                    <th className="user-list-cell">Phone</th>
                    <th className="user-list-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="user-list-row">
                      <td className="user-list-cell">{user.fullName}</td>
                      <td className="user-list-cell">{user.email}</td>
                      <td className="user-list-cell">{user.phone}</td>
                      <td className="user-list-cell">
                        <button 
                          className="btn btn-danger mr-2"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button 
                className="pagination-btn"
                disabled={pagination.currentPage === 1}
                onClick={() => fetchUsers(pagination.currentPage - 1)}
              >
                Previous
              </button>
              <span>{`Page ${pagination.currentPage} of ${pagination.totalPages}`}</span>
              <button 
                className="pagination-btn"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => fetchUsers(pagination.currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div>
            <div className="admin-header">
              <h1 className="admin-title">Admin Profile</h1>
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditProfileModalOpen(true)}
              >
                Edit Profile
              </button>
            </div>

            <div className="bg-white shadow-md rounded-lg p-8">
              {adminProfile.profileImage && (
                <img 
                  src={adminProfile.profileImage} 
                  alt="Admin Profile" 
                  className="w-40 h-40 rounded-full object-cover mx-auto mb-6"
                />
              )}
              <div className="text-center">
                <h2 className="text-2xl font-bold">{adminProfile.fullName}</h2>
                <p className="text-gray-600">{adminProfile.email}</p>
                <p className="text-gray-600">{adminProfile.phone}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label className="form-label">Profile Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="form-input"
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Full Name</label>
                <input 
                  type="text"
                  value={adminProfile.fullName}
                  onChange={(e) => setAdminProfile(prev => ({
                    ...prev, 
                    fullName: e.target.value
                  }))}
                  className="form-input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Email</label>
                <input 
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile(prev => ({
                    ...prev, 
                    email: e.target.value
                  }))}
                  className="form-input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Phone</label>
                <input 
                  type="tel"
                  value={adminProfile.phone}
                  onChange={(e) => setAdminProfile(prev => ({
                    ...prev, 
                    phone: e.target.value
                  }))}
                  className="form-input"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditProfileModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-white hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
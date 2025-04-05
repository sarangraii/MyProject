import React, { useState, useEffect } from 'react';

const UserProfileManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching users:', error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingUser)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      alert('User updated successfully');
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      setError(error.message);
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      setError(error.message);
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '64rem',
      margin: '0 auto',
      padding: '1rem'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>
        User Management
      </h2>
      
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#7f1d1d',
          padding: '0.75rem',
          borderRadius: '0.25rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {editingUser ? (
        <form 
          onSubmit={handleUpdateUser} 
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={editingUser.fullName}
            onChange={(e) => setEditingUser({...editingUser, fullName: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '0.25rem'
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '0.25rem'
            }}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={editingUser.phone}
            onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '0.25rem'
            }}
          />
          <div style={{
            display: 'flex',
            gap: '0.5rem'
          }}>
            <button 
              type="submit"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: 'none'
              }}
            >
              Save Changes
            </button>
            <button 
              type="button"
              style={{
                backgroundColor: '#f3f4f6',
                color: 'black',
                padding: '0.5rem 1rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db'
              }}
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div style={{overflowX: 'auto'}}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f3f4f6'
              }}>
                <th style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>Name</th>
                <th style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>Email</th>
                <th style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>Phone</th>
                <th style={{
                  padding: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user._id}
                  style={{
                    ':hover': {
                      backgroundColor: '#f9fafb'
                    }
                  }}
                >
                  <td style={{
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>{user.fullName}</td>
                  <td style={{
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>{user.email}</td>
                  <td style={{
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>{user.phone}</td>
                  <td style={{
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <button 
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          fontSize: '0.875rem'
                        }}
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          border: 'none',
                          fontSize: '0.875rem'
                        }}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserProfileManagement;
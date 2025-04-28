// src/components/Navbar.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUser({ name: decoded.name, email: decoded.email });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/delete`,
        
        {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      toast.success('Account deleted successfully');
      navigate('/register');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const buttonStyle = {
    padding: '8px 14px',
    margin: '5px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: darkMode ? '#444' : '#007bff',
    color: '#fff',
  };

  return (
    <nav style={{
      backgroundColor: darkMode ? '#1a1a1a' : '#f9f9f9',
      color: darkMode ? '#fff' : '#000',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      flexWrap: 'wrap',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    }}>
      <div>
        <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>💸 Expense Tracker</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {token ? (
          <>
            <button style={buttonStyle} onClick={() => navigate('/')}>Dashboard</button>
            <button style={buttonStyle} onClick={() => navigate('/add-expense')}>Add Expense</button>
            <button style={buttonStyle} onClick={() => navigate('/reports')}>Reports</button>
            <button style={buttonStyle} onClick={() => navigate('/history')}>History</button>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                style={{ ...buttonStyle, backgroundColor: darkMode ? '#555' : '#28a745' }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤 {user?.name || 'Profile'}
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: darkMode ? '#333' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  marginTop: '5px',
                  padding: '10px',
                  zIndex: 1000,
                  minWidth: '200px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }}>
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <button
                    style={{ ...buttonStyle, width: '100%', backgroundColor: '#ffc107', color: '#000' }}
                    onClick={() => navigate('/reset-password')}
                  >
                    Reset Password
                  </button>
                  <button
                    style={{ ...buttonStyle, width: '100%', backgroundColor: 'red' }}
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>

            <button style={{ ...buttonStyle, backgroundColor: '#dc3545' }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button style={buttonStyle} onClick={() => navigate('/login')}>Login</button>
            <button style={buttonStyle} onClick={() => navigate('/register')}>Register</button>
          </>
        )}

        <button
          onClick={toggleTheme}
          style={{
            ...buttonStyle,
            backgroundColor: darkMode ? '#666' : '#333',
            color: '#fff',
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import {jwtDecode} from 'jwt-decode';
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

  const buttonStyle = {
    margin: '0 5px',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: darkMode ? '#444' : '#2196F3',
    color: '#fff',
    cursor: 'pointer',
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
  
    const token = localStorage.getItem('token');
    try {
      await axios.delete('https://mern-expense-tracker-backend-n4id.onrender.com/api/users/delete', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      toast.success('Account deleted successfully');
      navigate('/register');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
  };
  
  return (
    <nav style={{
      backgroundColor: darkMode ? '#222' : '#f5f5f5',
      color: darkMode ? '#fff' : '#000',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      <h2>💸 Expense Tracker</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {token && (
          <>
            <button style={buttonStyle} onClick={() => navigate('/')}>Dashboard</button>
            <button style={buttonStyle} onClick={() => navigate('/add-expense')}>Add Expense</button>
            <button style={buttonStyle} onClick={() => navigate('/reports')}>Reports</button>
            <button style={buttonStyle} onClick={() => navigate('/history')}>History</button>

            {/* Dropdown */}
            <div style={{ position: 'relative' }}>
              <button style={buttonStyle} onClick={() => setShowDropdown(!showDropdown)}>
                👤 {user?.name || 'My Profile'}
              </button>
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: darkMode ? '#333' : '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                  zIndex: 1000,
                  minWidth: '200px',
                }}>
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <button
                    style={{ ...buttonStyle, width: '100%', margin: '5px 0', backgroundColor: '#666' }}
                    onClick={() => navigate('/reset-password')}
                  >
                    🔐 Reset Password
                  </button>
                  <button
                       onClick={handleDeleteAccount}
                    style={{ ...buttonStyle, backgroundColor: 'red' }}
                           >
                  🗑️ Delete Account
                   </button>

                </div>
              )}
            </div>

            <button style={buttonStyle} onClick={handleLogout}>Logout</button>
          </>
        )}

        {!token && (
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
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

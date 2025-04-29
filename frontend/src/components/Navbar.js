import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
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
    if (!window.confirm('Are you sure you want to delete your account?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/users/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('token');
      toast.success('Account deleted successfully');
      navigate('/register');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    }
  };

  const isActive = (path) => location.pathname === path;

  const navButtonStyle = (active = false) => ({
    margin: '5px',
    padding: active ? '10px 18px' : '8px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: active ? '#1976d2' : darkMode ? '#444' : '#2196F3',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: active ? 'bold' : 'normal',
    transform: active ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out',
  });

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: darkMode ? '#2c2c2c' : '#fff',
    color: darkMode ? '#fff' : '#000',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    zIndex: 1000,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    width: '200px',
  };

  return (
    <nav
      style={{
        backgroundColor: darkMode ? '#222' : '#f5f5f5',
        color: darkMode ? '#fff' : '#000',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <h2>💸 Expense Tracker</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {token && (
          <>
            <button style={navButtonStyle(isActive('/'))} onClick={() => navigate('/')}>
              Dashboard
            </button>
            <button style={navButtonStyle(isActive('/add-expense'))} onClick={() => navigate('/add-expense')}>
              Add Expense
            </button>
            <button style={navButtonStyle(isActive('/reports'))} onClick={() => navigate('/reports')}>
              Reports
            </button>
            <button style={navButtonStyle(isActive('/history'))} onClick={() => navigate('/history')}>
              History
            </button>

            <div style={{ position: 'relative' }}>
              <button
                style={{
                  ...navButtonStyle(showDropdown),
                  backgroundColor: darkMode ? '#555' : '#555',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                👤 {user?.name || 'Profile'}
              </button>

              {showDropdown && (
                <div style={dropdownStyle}>
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <button
                    style={{
                      ...navButtonStyle(),
                      backgroundColor: '#777',
                      width: '100%',
                    }}
                    onClick={() => navigate('/reset-password')}
                  >
                    🔐 Reset Password
                  </button>
                  <button
                    style={{
                      ...navButtonStyle(),
                      backgroundColor: 'crimson',
                      width: '100%',
                    }}
                    onClick={handleDeleteAccount}
                  >
                    🗑️ Delete Account
                  </button>
                </div>
              )}
            </div>

            <button style={navButtonStyle()} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!token && (
          <>
            <button style={navButtonStyle(isActive('/login'))} onClick={() => navigate('/login')}>
              Login
            </button>
            <button style={navButtonStyle(isActive('/register'))} onClick={() => navigate('/register')}>
              Register
            </button>
          </>
        )}

        <button
          onClick={toggleTheme}
          style={{
            ...navButtonStyle(),
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

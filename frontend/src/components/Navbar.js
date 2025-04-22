import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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

  return (
    <nav
      style={{
        backgroundColor: darkMode ? '#222' : '#f5f5f5',
        color: darkMode ? '#fff' : '#000',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <h2 style={{ margin: '0 0 10px 0' }}>💸 Expense Tracker</h2>
        
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {token && (
          <>
            <button style={buttonStyle} onClick={() => navigate('/')}>Dashboard</button>
            <button style={buttonStyle} onClick={() => navigate('/add-expense')}>Add Expense</button>
            <button style={buttonStyle} onClick={() => navigate('/reports')}>Reports</button>
            <button style={buttonStyle} onClick={() => navigate('/history')}>History</button>
            <button style={buttonStyle} onClick={handleLogout}>Logout</button>
          </>
        )}

        {!token && (
          <>
            <button style={buttonStyle} onClick={() => navigate('/login')}>Login</button>
            <button style={buttonStyle} onClick={() => navigate('/register')}>Register</button>
          </>
        )}

        {/* Dark mode toggle */}
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

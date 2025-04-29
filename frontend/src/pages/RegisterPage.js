import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      toast.error('Invalid email format');
      return;
    }
    if (!validatePassword(form.password)) {
      toast.error('Password must be at least 8 characters, 1 uppercase, and 1 special character');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/register`, form);
      localStorage.setItem('token', res.data.token);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={containerStyle(darkMode)}>
      <form onSubmit={handleSubmit} style={formStyle(darkMode)}>
        <h2 style={{ textAlign: 'center' }}>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Username"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle(darkMode)}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle(darkMode)}
        />

        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ ...inputStyle(darkMode), width: '100%' }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: darkMode ? '#ccc' : '#555'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit" disabled={loading} style={buttonStyle(loading)}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div style={linkGroupStyle(darkMode)}>
          <span>
            Already have an account?{' '}
            <Link to="/login" style={{ color: darkMode ? '#90caf9' : '#1976d2' }}>
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

// === STYLES ===

const containerStyle = (darkMode) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: darkMode ? '#121212' : '#f9f9f9',
  padding: '1rem',
});

const formStyle = (darkMode) => ({
  backgroundColor: darkMode ? '#1f1f1f' : '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  color: darkMode ? '#fff' : '#000',
});

const inputStyle = (darkMode) => ({
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  backgroundColor: darkMode ? '#333' : '#fff',
  color: darkMode ? '#fff' : '#000',
});

const buttonStyle = (loading) => ({
  backgroundColor: loading ? '#999' : '#4CAF50',
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: loading ? 'not-allowed' : 'pointer',
});

const linkGroupStyle = (darkMode) => ({
  textAlign: 'center',
  fontSize: '14px',
  color: darkMode ? '#90caf9' : '#1976d2',
});

export default RegisterPage;

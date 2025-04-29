import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, form);
      localStorage.setItem('token', res.data.token);
      toast.success(`Welcome ${res.data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={containerStyle(darkMode)}>
      <form onSubmit={handleSubmit} style={formStyle(darkMode)}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle(darkMode)}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle(darkMode)}
        />

        <button type="submit" disabled={loading} style={buttonStyle(loading)}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={linkGroupStyle(darkMode)}>
          <Link to="/reset-password">Forgot Password?</Link>
          <Link to="/register">New here? Register</Link>
        </div>
      </form>
    </div>
  );
};

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
  display: 'flex',
  flexDirection: 'column',
  fontSize: '14px',
  gap: '0.5rem',
  color: darkMode ? '#90caf9' : '#1976d2',
});

export default LoginPage;

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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res =  await axios.post(`${process.env.REACT_APP_API_URL}/users/login`, form);

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: darkMode ? '#121212' : '#f9f9f9',
        color: darkMode ? '#fff' : '#000',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: darkMode ? '#1f1f1f' : '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: darkMode
            ? '0 0 15px rgba(255,255,255,0.1)'
            : '0 0 10px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
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

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#999' : '#4CAF50',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Links */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
          }}
        >
          <Link to="/reset-password" style={{ color: darkMode ? '#90caf9' : '#1976d2' }}>
            Forgot Password?
          </Link>
          <span>
            New here?{' '}
            <Link to="/register" style={{ color: darkMode ? '#90caf9' : '#1976d2' }}>
              Register
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

const inputStyle = (darkMode) => ({
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  backgroundColor: darkMode ? '#333' : '#fff',
  color: darkMode ? '#fff' : '#000',
});

export default LoginPage;

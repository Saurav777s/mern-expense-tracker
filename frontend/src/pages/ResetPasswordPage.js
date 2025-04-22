import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate reset flow (you can wire this to backend if needed)
      await axios.post('https://mern-expense-tracker-backend-n4id.onrender.com/api/users/reset', { email });
      toast.success('📧 If this email exists, a reset link has been sent!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
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
        backgroundColor: darkMode ? '#121212' : '#f2f2f2',
        padding: '1rem',
        color: darkMode ? '#fff' : '#000',
      }}
    >
      <form
        onSubmit={handleReset}
        style={{
          backgroundColor: darkMode ? '#1f1f1f' : '#fff',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: darkMode
            ? '0 0 10px rgba(255,255,255,0.1)'
            : '0 0 10px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: darkMode ? '#333' : '#fff',
            color: darkMode ? '#fff' : '#000',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#999' : '#2196F3',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;

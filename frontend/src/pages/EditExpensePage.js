import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';

const EditExpensePage = () => {
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { title, amount, category, date } = res.data;
        setForm({
          title,
          amount,
          category,
          date: date.slice(0, 10)
        });
      } catch (err) {
        toast.error('Failed to fetch expense');
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/expenses/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Expense updated!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
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
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: darkMode ? '#1f1f1f' : '#fff',
          color: darkMode ? '#fff' : '#000',
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
        <h2 style={{ textAlign: 'center' }}>✏️ Edit Expense</h2>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={inputStyle(darkMode)}
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
          style={inputStyle(darkMode)}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={inputStyle(darkMode)}
        >
          <option value="">Select category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
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
            fontSize: '16px'
          }}
        >
          {loading ? 'Updating...' : 'Update Expense'}
        </button>
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
  fontSize: '14px',
});

export default EditExpensePage;

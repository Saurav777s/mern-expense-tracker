import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';

const AddExpensePage = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, amount, category, date } = form;
    if (!title || !amount || !category || !date) {
      toast.error('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      await axios.post(
       ' https://mern-expense-tracker-backend-n4id.onrender.com'
,
        { ...form },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('✅ Expense added successfully!');
      setForm({ title: '', amount: '', category: '', date: '' });
      navigate('/'); // or keep them on page
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '500px',
        margin: 'auto',
        color: darkMode ? '#fff' : '#000',
        backgroundColor: darkMode ? '#1f1f1f' : '#fff',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ marginBottom: '1.5rem' }}>➕ Add New Expense</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={form.title}
          onChange={handleChange}
          style={inputStyle(darkMode)}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          style={inputStyle(darkMode)}
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={inputStyle(darkMode)}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
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
          {loading ? 'Adding...' : 'Add Expense'}
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
});

export default AddExpensePage;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';

const EditExpensePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/expenses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { title, amount, category, date } = res.data;
        setForm({
          title,
          amount,
          category,
          date: date.slice(0, 10), // format to yyyy-mm-dd
        });
      } catch (error) {
        toast.error('Failed to load expense');
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:5000/api/expenses/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('✅ Expense updated successfully!');
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
        padding: '2rem',
        maxWidth: '500px',
        margin: 'auto',
        backgroundColor: darkMode ? '#1f1f1f' : '#fff',
        color: darkMode ? '#fff' : '#000',
        minHeight: '100vh',
      }}
    >
      <h2>Edit Expense</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
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
            backgroundColor: loading ? '#999' : '#2196F3',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
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
});

export default EditExpensePage;

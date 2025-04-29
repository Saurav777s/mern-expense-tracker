import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const ExpenseHistoryPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const expensesPerPage = 5;

  // Extract categories from the fetched data
  const categories = [...new Set(expenses.map(exp => exp.category))];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error('Failed to fetch expenses');
    }
  };

  const filterExpenses = useCallback(() => {
    let result = expenses;

    if (search) {
      result = result.filter(exp =>
        exp.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(exp => exp.category === category);
    }

    if (startDate && endDate) {
      result = result.filter(exp => {
        const d = new Date(exp.date);
        return d >= new Date(startDate) && d <= new Date(endDate);
      });
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [search, category, startDate, endDate, expenses]);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Expense deleted!');
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (error) {
      toast.error('Delete failed!');
    }
  };

  const indexOfLast = currentPage * expensesPerPage;
  const indexOfFirst = indexOfLast - expensesPerPage;
  const currentExpenses = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / expensesPerPage);

  const inputStyle = {
    padding: '8px',
    borderRadius: '5px',
    marginRight: '10px',
    border: '1px solid #ccc',
    marginBottom: '10px',
  };

  return (
    <div
      style={{
        padding: '1rem',
        maxWidth: '1000px',
        margin: 'auto',
        backgroundColor: darkMode ? '#1f1f1f' : '#fff',
        color: darkMode ? '#fff' : '#000',
      }}
    >
      <h2>📚 Expense History</h2>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search Title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Expense List */}
      {currentExpenses.length === 0 ? (
        <p>No matching expenses found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {currentExpenses.map((exp) => (
            <li
              key={exp._id}
              style={{
                backgroundColor: darkMode ? '#333' : '#f4f4f4',
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <strong>{exp.title}</strong> – ₹{exp.amount} ({exp.category}) <br />
                <small>{new Date(exp.date).toLocaleDateString('en-GB')}</small>
              </div>
              <div>
                <button
                  onClick={() => navigate(`/edit-expense/${exp._id}`)}
                  style={{
                    backgroundColor: '#2196F3',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 10px',
                    marginRight: '10px',
                    borderRadius: '5px',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  style={{
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '5px',
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              style={{
                padding: '5px 10px',
                margin: '0 5px',
                backgroundColor: num === currentPage ? '#4CAF50' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseHistoryPage;

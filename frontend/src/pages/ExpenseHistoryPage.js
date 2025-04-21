import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const ExpenseHistoryPage = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);

  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filterExpenses = useCallback(() => {
    let result = [...expenses];

    if (searchTerm) {
      result = result.filter((exp) =>
        exp.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter((exp) => exp.category === categoryFilter);
    }

    if (startDate) {
      result = result.filter((exp) => new Date(exp.date) >= new Date(startDate));
    }

    if (endDate) {
      result = result.filter((exp) => new Date(exp.date) <= new Date(endDate));
    }

    setFiltered(result);
    setCurrentPage(1);
  }, [expenses, searchTerm, categoryFilter, startDate, endDate]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses]);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      toast.error('Failed to load expenses');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Expense deleted!');
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExpenses = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '900px',
        margin: 'auto',
        color: darkMode ? '#fff' : '#000',
        backgroundColor: darkMode ? '#1f1f1f' : '#fff',
        minHeight: '100vh',
      }}
    >
      <h2>🧾 Expense History</h2>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', margin: '1rem 0' }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={inputStyle(darkMode)}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={inputStyle(darkMode)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={inputStyle(darkMode)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={inputStyle(darkMode)}
        />
      </div>

      {/* Expenses List */}
      {currentExpenses.length === 0 ? (
        <p>No matching expenses found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {currentExpenses.map((exp) => (
            <li
              key={exp._id}
              style={{
                backgroundColor: darkMode ? '#333' : '#f4f4f4',
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <strong>{exp.title}</strong> - ₹{exp.amount} ({exp.category}) <br />
                <small>{new Date(exp.date).toLocaleDateString()}</small>
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
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                padding: '5px 10px',
                backgroundColor: currentPage === i + 1 ? '#4CAF50' : '#eee',
                color: currentPage === i + 1 ? '#fff' : '#000',
                border: 'none',
                borderRadius: '4px',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const inputStyle = (darkMode) => ({
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  backgroundColor: darkMode ? '#333' : '#fff',
  color: darkMode ? '#fff' : '#000',
  flex: '1',
  minWidth: '150px',
});

export default ExpenseHistoryPage;

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { ThemeContext } from '../context/ThemeContext';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(res.data);
    } catch (err) {
      toast.error('Failed to fetch expenses');
    }
  };

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

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthExpenses = expenses.filter((exp) => {
    const date = new Date(exp.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalThisMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryData = Object.entries(
    currentMonthExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {})
  ).map(([category, amount]) => ({ name: category, value: amount }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

  return (
    <div
      style={{
        padding: '1rem',
        maxWidth: '1000px',
        margin: 'auto',
        backgroundColor: darkMode ? '#1f1f1f' : '#fff',
        color: darkMode ? '#fff' : '#000',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ fontSize: '1.5rem' }}>
        📅 Dashboard – {new Date().toLocaleString('default', { month: 'long' })} {currentYear}
      </h2>

      <h3 style={{ margin: '1rem 0' }}>
        💰 Total This Month: <span style={{ color: '#4CAF50' }}>₹{totalThisMonth}</span>
      </h3>

      <div style={{ width: '100%', height: 300 }}>
        {categoryData.length > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No expense data to display pie chart.</p>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h4>🧾 Recent Transactions:</h4>
        {currentMonthExpenses.length === 0 ? (
          <p>No expenses added this month.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {currentMonthExpenses.slice(-5).reverse().map((exp) => (
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
                  <strong>{exp.title}</strong> – ₹{exp.amount} ({exp.category})<br />
                  <small>{new Date(exp.date).toLocaleDateString('en-GB')}</small>
                </div>
                <div style={{ marginTop: '10px' }}>
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
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/add-expense')}
          style={{
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            fontSize: '16px',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            maxWidth: '250px',
          }}
        >
          ➕ Add New Expense
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { ThemeContext } from '../context/ThemeContext';

const ReportsPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [expenses, setExpenses] = useState([]);
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

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

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    const yearMatch = date.getFullYear() === parseInt(selectedYear);
    const monthMatch = date.getMonth() + 1 === parseInt(selectedMonth);
    return viewMode === 'monthly' ? yearMatch && monthMatch : yearMatch;
  });

  const chartData = viewMode === 'monthly'
    ? Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const total = filteredExpenses
          .filter(e => new Date(e.date).getDate() === day)
          .reduce((acc, e) => acc + e.amount, 0);
        return { label: `Day ${day}`, amount: total };
      })
    : Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const total = filteredExpenses
          .filter(e => new Date(e.date).getMonth() + 1 === month)
          .reduce((acc, e) => acc + e.amount, 0);
        return { label: `Month ${month}`, amount: total };
      });

  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div style={{
      padding: '1rem',
      maxWidth: '1000px',
      margin: 'auto',
      backgroundColor: darkMode ? '#1f1f1f' : '#fff',
      color: darkMode ? '#fff' : '#000',
      minHeight: '100vh'
    }}>
      <h2 style={{ textAlign: 'center' }}>📊 Expense Reports</h2>

      <div style={{
        marginBottom: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div>
          <button
            onClick={() => setViewMode('monthly')}
            style={{
              padding: '8px 15px',
              border: '1px solid #ccc',
              backgroundColor: viewMode === 'monthly' ? '#4CAF50' : (darkMode ? '#444' : '#f0f0f0'),
              color: viewMode === 'monthly' ? '#fff' : (darkMode ? '#fff' : '#000'),
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('yearly')}
            style={{
              padding: '8px 15px',
              border: '1px solid #ccc',
              backgroundColor: viewMode === 'yearly' ? '#4CAF50' : (darkMode ? '#444' : '#f0f0f0'),
              color: viewMode === 'yearly' ? '#fff' : (darkMode ? '#fff' : '#000'),
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '8px',
            }}
          >
            Yearly
          </button>
        </div>

        <label>
          Year:
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              marginLeft: '10px',
              padding: '5px',
              width: '80px',
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </label>

        {viewMode === 'monthly' && (
          <label>
            Month:
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                marginLeft: '10px',
                padding: '5px',
                backgroundColor: darkMode ? '#333' : '#fff',
                color: darkMode ? '#fff' : '#000',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#888' : '#ccc'} />
          <XAxis dataKey="label" stroke={darkMode ? '#fff' : '#000'} />
          <YAxis stroke={darkMode ? '#fff' : '#000'} />
          <Tooltip contentStyle={{ backgroundColor: darkMode ? '#444' : '#fff' }} />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Category Summary */}
      <div style={{ marginTop: '2rem' }}>
        <h4>💡 Total Expenses by Category:</h4>
        <ul>
          {Object.entries(categoryTotals).map(([category, total]) => (
            <li key={category}>
              <strong>{category}:</strong> ₹{total}
            </li>
          ))}
        </ul>
      </div>

      {/* Download CSV Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <CSVLink
          data={filteredExpenses}
          filename="expense-report.csv"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          ⬇️ Download CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default ReportsPage;

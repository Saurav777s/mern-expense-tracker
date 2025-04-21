import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';

const ReportsPage = () => {
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
      const res = await axios.get('http://localhost:5000/api/expenses', {
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
    <div style={{ padding: '1rem', maxWidth: '1000px', margin: 'auto' }}>
      <h2>📊 Expense Reports</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            onClick={() => setViewMode('monthly')}
            style={{
              padding: '8px 15px',
              border: '1px solid #ccc',
              backgroundColor: viewMode === 'monthly' ? '#4CAF50' : '#f0f0f0',
              color: viewMode === 'monthly' ? '#fff' : '#000',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '5px',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewMode('yearly')}
            style={{
              padding: '8px 15px',
              border: '1px solid #ccc',
              backgroundColor: viewMode === 'yearly' ? '#4CAF50' : '#f0f0f0',
              color: viewMode === 'yearly' ? '#fff' : '#000',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Yearly
          </button>
        </div>

        <div>
          <label>
            Year:
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
        </div>

        {viewMode === 'monthly' && (
          <div>
            <label>
              Month:
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ marginLeft: '10px', padding: '5px' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
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

      {/* Download Button */}
      <div style={{ marginTop: '2rem' }}>
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

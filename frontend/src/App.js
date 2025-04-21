import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddExpensePage from './pages/AddExpensePage';
import EditExpensePage from './pages/EditExpensePage';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import ReportsPage from './pages/ReportsPage';
import ExpenseHistoryPage from './pages/ExpenseHistoryPage';



function App() {
  return (
    <ThemeProvider>
    <Router>

<ToastContainer position="top-center" />

      <Navbar />
      
      <Routes>
  <Route
    path="/"
    element={
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    }
  />
  <Route
    path="/add-expense"
    element={
      <PrivateRoute>
        <AddExpensePage />
      </PrivateRoute>
    }
  />
  
  
  <Route path="/edit-expense/:id" element={
    <PrivateRoute>
      <EditExpensePage />
    </PrivateRoute>
  } />
  
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
  <Route path="/reset-password" element={<ResetPasswordPage />} />
  <Route path="*" element={<NotFoundPage />} />
  <Route path="/reports" element={<ReportsPage />} />
  <Route path="/history" element={<ExpenseHistoryPage />} />

</Routes>

    </Router>
    </ThemeProvider>
  );
}

export default App;

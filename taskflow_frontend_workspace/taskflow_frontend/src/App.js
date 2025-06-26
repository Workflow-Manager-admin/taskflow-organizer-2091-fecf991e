import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth context and route wrappers
import { AuthProvider } from './AuthContext';
import ProtectedRoute, { UnAuthRoute } from './ProtectedRoute';

// Skeleton page components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TaskDetailPage from './pages/TaskDetailPage';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Routes>
            {/* LOGIN and REGISTRATION should be inaccessible to logged-in users */}
            <Route path="/login" element={<UnAuthRoute><LoginPage /></UnAuthRoute>} />
            <Route path="/register" element={<UnAuthRoute><RegisterPage /></UnAuthRoute>} />

            {/* Protected routes for authenticated users */}
            <Route path="/dashboard" element={
              <ProtectedRoute><DashboardPage /></ProtectedRoute>
            } />
            <Route path="/tasks/:id" element={
              <ProtectedRoute><TaskDetailPage /></ProtectedRoute>
            } />
            {/* Default: go to dashboard if logged in, else login */}
            <Route path="/" element={
              <AuthGate />
            } />
            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

// Helper: root redirect based on auth state
function AuthGate() {
  // Must render only after loading flag resolves for SSR or token
  // Use the same AuthContext as routes
  const { isAuthenticated, loading } = require('./AuthContext').useAuth();
  if (loading) return <div>Loading...</div>;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default App;

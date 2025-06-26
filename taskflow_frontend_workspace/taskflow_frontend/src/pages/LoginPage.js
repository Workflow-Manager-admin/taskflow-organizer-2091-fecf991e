import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login Page component
 * Renders login form, handles user login with backend and JWT token storage.
 */
function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // FastAPI login expects application/x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append('username', form.username);
      params.append('password', form.password);
      params.append('grant_type', 'password');
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });
      if (resp.ok) {
        const data = await resp.json();
        login(data.access_token);
        // Redirect to original location (if any), else dashboard
        const from = (location.state && location.state.from && location.state.from.pathname) || '/dashboard';
        navigate(from, { replace: true });
      } else {
        const data = await resp.json().catch(() => ({}));
        setError(data?.detail || 'Login failed. Check username or password.');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  // PUBLIC_INTERFACE
  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{
      maxWidth: 340, margin: '50px auto', padding: 18, borderRadius: 8,
      background: 'var(--bg-secondary)', boxShadow: '0 2px 10px rgba(0,0,0,.07)'
    }}>
      <h2>Login</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          required
          style={{ padding: 8, borderRadius: 5, border: '1px solid var(--border-color)' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          required
          style={{ padding: 8, borderRadius: 5, border: '1px solid var(--border-color)' }}
        />
        <button
          type="submit"
          style={{
            background: 'var(--button-bg)',
            color: 'var(--button-text)',
            border: 'none',
            borderRadius: 5,
            padding: '10px 0',
            fontWeight: '600',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={goToRegister}
          style={{
            background: 'none',
            color: 'var(--text-secondary)',
            border: 'none',
            marginTop: 0,
            padding: '2px 0',
            cursor: 'pointer',
            fontSize: 15,
            textDecoration: 'underline'
          }}
        >
          Need an account? Register
        </button>
      </form>
      {error && (
        <div style={{ color: 'crimson', marginTop: 16, textAlign: 'left', fontSize: 15 }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default LoginPage;

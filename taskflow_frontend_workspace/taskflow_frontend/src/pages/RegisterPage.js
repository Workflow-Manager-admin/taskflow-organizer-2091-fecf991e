import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Registration Page component
 * Renders registration form, handles registration with backend, auth error display, and login redirect.
 */
function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password
        })
      });
      if (resp.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', { state: { registered: true } });
        }, 800);
      } else {
        const data = await resp.json().catch(() => ({}));
        setError(data?.detail || 'Registration failed. Try another username.');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  // PUBLIC_INTERFACE
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{
      maxWidth: 340, margin: '50px auto', padding: 18, borderRadius: 8,
      background: 'var(--bg-secondary)', boxShadow: '0 2px 10px rgba(0,0,0,.07)'
    }}>
      <h2>Register</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username (min. 3 chars)"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          minLength={3}
          required
          style={{ padding: 8, borderRadius: 5, border: '1px solid var(--border-color)' }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min. 6 chars)"
          value={form.password}
          onChange={handleChange}
          minLength={6}
          autoComplete="new-password"
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
          Register
        </button>
        <button
          type="button"
          onClick={goToLogin}
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
          Have an account? Login
        </button>
      </form>
      {success && (
        <div style={{ color: 'green', marginTop: 16, textAlign: 'left', fontSize: 15 }}>
          Registration successful! Redirecting to login...
        </div>
      )}
      {error && (
        <div style={{ color: 'crimson', marginTop: 16, textAlign: 'left', fontSize: 15 }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default RegisterPage;

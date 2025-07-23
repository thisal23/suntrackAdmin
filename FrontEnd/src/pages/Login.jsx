import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import apiService from '../config/axiosConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await apiService.post('/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-header">
          <h1 className="suntrack-title">SunTrack</h1>
        </div>
        <h2 className="admin-login-title">Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="login-links">
          <button className="link-btn" onClick={() => navigate('/forgot-password')} disabled={loading}>Forgot Password?</button>
          <button className="link-btn" onClick={() => navigate('/register')} disabled={loading}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login; 
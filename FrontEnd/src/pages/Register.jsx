import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../config/axiosConfig';
import './Login.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await apiService.post('/register', { firstName, lastName, userName, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="register-card">
        <div className="register-title">Create Admin Account</div>
        <div className="register-suntrack">SunTrack</div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required disabled={loading} placeholder="Enter your first name" />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} required disabled={loading} placeholder="Enter your last name" />
          </div>
          <div className="form-group">
            <label htmlFor="userName">Username:</label>
            <input id="userName" type="text" value={userName} onChange={e => setUserName(e.target.value)} required disabled={loading} placeholder="Choose a username" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} placeholder="Create a password" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={loading} placeholder="Re-enter your password" />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <div className="login-links">
          <button className="link-btn" onClick={() => navigate('/login')} disabled={loading}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default Register; 
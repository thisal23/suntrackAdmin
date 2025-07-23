import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../config/axiosConfig';
import './Login.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await apiService.post('/forgot-password', { email });
      setSuccess('OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await apiService.post('/verify-otp', { email, otp });
      setSuccess('OTP verified. Please set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.'); setLoading(false); return;
    }
    try {
      await apiService.post('/reset-password', { email, otp, newPassword });
      setSuccess('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-header">
          <h1 className="suntrack-title">SunTrack</h1>
        </div>
        <h2 className="admin-login-title">Forgot Password</h2>
        <div className="step-indicator">Step {step} of 3</div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Enter your admin email:</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="login-form">
            <div className="form-group">
              <label htmlFor="otp">Enter OTP sent to your email:</label>
              <input id="otp" type="text" value={otp} onChange={e => setOtp(e.target.value)} required disabled={loading} />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="login-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required disabled={loading} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password:</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required disabled={loading} />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
          </form>
        )}
        <div className="login-links">
          <button className="link-btn" onClick={() => navigate('/login')} disabled={loading}>Back to Login</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 
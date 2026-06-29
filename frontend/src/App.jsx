import React, { useState } from 'react';
import { User, Lock, Brain } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

export default function App() {
  // Session State
  const [token, setToken] = useState(localStorage.getItem('fomo_token') || '');
  const [username, setUsername] = useState(localStorage.getItem('fomo_username') || '');

  // Form State
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!authForm.username || !authForm.password) {
      setAuthError("All fields are required");
      return;
    }

    try {
      const endpoint = authMode === 'login' ? 'login' : 'register';
      const res = await fetch(`${API_BASE}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm)
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.message || "Authentication failed");
        return;
      }

      if (authMode === 'login') {
        localStorage.setItem('fomo_token', data.token);
        localStorage.setItem('fomo_username', data.username);
        setToken(data.token);
        setUsername(data.username);
      } else {
        setAuthSuccess("Registered successfully! Please log in.");
        setAuthMode('login');
        setAuthForm({ username: '', password: '' });
      }
    } catch (err) {
      setAuthError("Connection error. Is the backend server running?");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fomo_token');
    localStorage.removeItem('fomo_username');
    setToken('');
    setUsername('');
  };

  if (token) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Successfully Accessing Workspace</h2>
        <p style={{ margin: '12px 0', color: 'var(--text-secondary)' }}>Welcome, {username}!</p>
        <button onClick={handleLogout} className="btn btn-primary" style={{ width: 'auto', padding: '10px 24px', margin: '0 auto' }}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <Brain size={48} color="#00f2fe" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.4))' }} />
          </div>
          <h2>FOMO-Sense</h2>
          <p>Real-Time EEG Emotion & Cognitive Analyser</p>
        </div>

        <div className="auth-tabs">
          <button 
            type="button"
            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('login'); setAuthError(''); }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => { setAuthMode('register'); setAuthError(''); }}
          >
            Register
          </button>
        </div>

        {authError && <div className="error-message">{authError}</div>}
        {authSuccess && <div className="success-message">{authSuccess}</div>}

        <form onSubmit={handleAuthSubmit}>
          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter username" 
                value={authForm.username}
                onChange={(e) => setAuthForm(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                className="form-input" 
                placeholder="Enter password" 
                value={authForm.password}
                onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
            {authMode === 'login' ? 'Access Workspace' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

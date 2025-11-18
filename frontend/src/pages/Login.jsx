import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './Login.css';   // <-- ADD THIS

export default function Login() {
  const [email, setEmail] = useState('viewer@vite.co.in');
  const [password, setPassword] = useState('pass123');
  const [error, setError] = useState('');
  const auth = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await auth.login(email, password);
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={submit}>
        <h2>Sign In</h2>

        {error && <div className="error-message">{error}</div>}

        <label>Email</label>
        <input 
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
        />

        <label>Password</label>
        <input 
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
        />

        <button type="submit" className="btn-login">Login</button>
      </form>
    </div>
  );
}

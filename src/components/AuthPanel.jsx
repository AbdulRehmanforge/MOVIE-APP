import React, { useState } from 'react';

const AuthPanel = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        onLogin(email, password);
      } else {
        onRegister(name.trim(), email, password);
      }
    } catch (submissionError) {
      setError(submissionError.message || 'Something went wrong.');
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h1>HD Movies</h1>
        <p className="auth-subtitle">A premium streaming-style movie experience.</p>

        <div className="auth-mode-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')} type="button">Sign up</button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {error && <p className="error-message">{error}</p>}

          <button className="auth-submit" type="submit">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AuthPanel;

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
      <div className="auth-backdrop cinematic-bg" />
      <header className="auth-header fade-in">
        <h1 className="auth-brand cinematic-glow">NETFLIX</h1>
        <div className="auth-header-actions">
          <button type="button" className="auth-lang-btn">English</button>
          <button type="button" className="auth-signin-btn" onClick={() => setMode('login')}>Sign In</button>
        </div>
      </header>

      <section className="auth-hero-copy fade-in-delayed">
        <h2 className="cinematic-title">Unlimited movies, TV shows, and more</h2>
        <p className="cinematic-sub">Starts at USD 7.99. Cancel anytime.</p>
        <small className="cinematic-small">Ready to watch? Create an account or sign in to continue your streaming experience.</small>
      </section>

      <div className="auth-card card-pop-in">
        <h3>{mode === 'login' ? 'Sign In' : 'Create Account'}</h3>
        <p className="auth-subtitle">
          {mode === 'login' ? 'Sign in to continue watching your personalized library.' : 'Create your account to save watchlists and continue watching.'}
        </p>

        <div className="auth-mode-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">Login</button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')} type="button">Sign up</button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-animate"
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-animate"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-animate"
          />

          {error && <p className="error-message">{error}</p>}

          <button className="auth-submit btn-glow" type="submit">
            {mode === 'login' ? 'Sign In' : 'Get Started'}
          </button>
        </form>
      </div>

      {}
      <div className="cinematic-overlay" />
    </main>
  );
};

export default AuthPanel;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await login(formData.username, formData.password);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Login to share or request community resources
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${submitting ? 'btn-disabled' : ''}`}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Logging in...' : 'Login →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-emerald)', fontWeight: 600 }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

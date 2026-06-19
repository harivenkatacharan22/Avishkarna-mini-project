import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    village: '',
    password: '',
    confirmPassword: ''
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
    const { name, username, phone, village, password, confirmPassword } = formData;

    // Simple validation
    if (!name || !username || !phone || !village || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setSubmitting(true);
    setError('');

    const res = await register(name, username, password, phone, village);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="container" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '550px' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Join VillageShare and start sharing resources today
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                className="form-control"
                placeholder="e.g. ramesh123"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="form-control"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="village">Village Name</label>
            <input
              type="text"
              name="village"
              id="village"
              className="form-control"
              placeholder="e.g. Rampur"
              value={formData.village}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-control"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${submitting ? 'btn-disabled' : ''}`}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '1.5rem' }}
            disabled={submitting}
          >
            {submitting ? 'Creating account...' : 'Register Now →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-emerald)', fontWeight: 600 }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

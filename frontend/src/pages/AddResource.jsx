import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CATEGORIES = [
  'Drill Machine',
  'Water Motor',
  'Tractor',
  'Ladder',
  'Books',
  'Farming Tools',
  'Other'
];

const AddResource = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Farming Tools',
    description: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, category, description } = formData;

    if (!name || !category || !description) {
      setError('Please fill in all required fields (Name, Category, Description)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(`${API_BASE_URL}/resources`, formData);
      navigate('/resources');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to list resource. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null; // will redirect via useEffect
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', pb: '3rem' }}>
      <div className="glass-card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', textAlign: 'center' }}>Share a Resource</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', textAlign: 'center' }}>
          List your tools, machinery, or items here so others in the community can benefit from them.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Section 1: Item Details */}
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: 'var(--primary-dark)' }}>
            📦 Item Information
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Resource / Item Name *</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                placeholder="e.g. Bosch Hammer Drill, Iron Ladder"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                name="category"
                id="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              name="description"
              id="description"
              className="form-control"
              rows="4"
              placeholder="Provide information about the item's condition, how it works, terms of borrowing, or rules for return..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label htmlFor="imageUrl">Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              className="form-control"
              placeholder="Paste a direct link to an image (e.g. from Google or Unsplash)"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              If left empty, a professional placeholder based on the category will be used.
            </small>
          </div>

          {/* Section 2: Owner Info (Read-Only) */}
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: 'var(--primary-dark)' }}>
            👤 Contact Information (Synced from Profile)
          </h3>
          
          <div style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Owner Name</span>
                <strong>{user.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Village</span>
                📍 <strong>{user.village}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Phone Number</span>
                📞 <strong>{user.phone}</strong>
              </div>
            </div>
            <small style={{ display: 'block', marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              * To update your contact details, please contact system administration.
            </small>
          </div>

          <button
            type="submit"
            className={`btn btn-primary ${submitting ? 'btn-disabled' : ''}`}
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Creating listing...' : 'Submit Resource Listing →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResource;

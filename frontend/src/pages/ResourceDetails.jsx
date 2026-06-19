import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const ResourceDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [requestType, setRequestType] = useState('borrow'); // 'borrow' or 'pre-booking'
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/resources/${id}`);
      setResource(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load resource details. It may have been deleted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourceDetails();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setBookingError('Please select both start and end dates.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setBookingError('Start date cannot be after end date.');
      return;
    }

    // Minimum date check (cannot book in past)
    const today = new Date().toISOString().split('T')[0];
    if (startDate < today) {
      setBookingError('You cannot request bookings in the past.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);

    try {
      await axios.post(`${API_BASE_URL}/requests`, {
        resourceId: id,
        startDate,
        endDate,
        message,
        type: requestType
      });
      
      setBookingSuccess(true);
      setStartDate('');
      setEndDate('');
      setMessage('');
      
      // Refresh details to update the schedule
      fetchResourceDetails();
    } catch (err) {
      console.error(err);
      setBookingError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading resource details...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="container" style={{ paddingTop: '3rem', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {error || 'Resource not found'}
        </div>
        <Link to="/resources" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Browse
        </Link>
      </div>
    );
  }

  const { name, category, description, availabilityStatus, ownerId, ownerName, contactNumber, villageName, imageUrl, approvedBookings = [] } = resource;
  const isOwner = user && user.id === ownerId;

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <Link to="/resources" style={{ color: 'var(--primary-emerald)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', marginBottom: '2rem', gap: '0.25rem' }}>
      ← Back to Browse
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'clamp(280px, 55%, 600px) 1fr', gap: '3rem', flexWrap: 'wrap' }}>
        
        {/* Left Column: Image and Description */}
        <div>
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--glass-shadow)', border: '1px solid var(--border-color)', height: '400px', marginBottom: '2rem' }}>
            <img 
              src={imageUrl} 
              alt={name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600'; }}
            />
          </div>

          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <span className="badge badge-available" style={{ marginBottom: '0.75rem' }}>{category}</span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{name}</h1>
            <p style={{ color: '#475569', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>{description}</p>
          </div>

          {/* Booking Schedule / Calendar list */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>📅 Approved Booking Schedule</h3>
            {approvedBookings.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {approvedBookings.map((booking) => (
                  <div key={booking.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                    <div>
                      <strong style={{ color: 'var(--primary-emerald)' }}>{booking.startDate}</strong> to <strong style={{ color: 'var(--primary-emerald)' }}>{booking.endDate}</strong>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Borrowed by: <strong>{booking.borrowerName}</strong>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                No future bookings approved yet. This item is fully open for requests!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Owner info and Booking Request Form */}
        <div>
          {/* Owner details card */}
          <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '5px solid var(--primary-emerald)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>👤 Owner Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '1.05rem' }}>
              <div><strong>Name:</strong> {ownerName}</div>
              <div><strong>Village:</strong> 📍 {villageName}</div>
              
              {/* Show contact number only if user is logged in */}
              {user ? (
                <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0', marginTop: '0.5rem' }}>
                  📞 <strong>Phone Number:</strong>{' '}
                  <a href={`tel:${contactNumber}`} style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>
                    {contactNumber}
                  </a>
                </div>
              ) : (
                <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '6px', border: '1px solid #fde68a', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  🔒 Log in to view phone number & make calls
                </div>
              )}
            </div>
          </div>

          {/* Request Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>⚡ Request This Resource</h3>
            
            {availabilityStatus !== 'available' ? (
              <div className="alert alert-danger" style={{ margin: 0 }}>
                This item is currently set as <strong>UNAVAILABLE</strong> by the owner.
              </div>
            ) : isOwner ? (
              <div className="alert alert-success" style={{ margin: 0, borderLeft: '4px solid #16a34a' }}>
                ℹ️ You own this listing. You can update details or toggle its availability on your dashboard.
              </div>
            ) : !user ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  You need to be logged in to request borrowing.
                </p>
                <Link to="/login" className="btn btn-secondary" style={{ width: '100%' }}>
                  Login to Request
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                {bookingSuccess && (
                  <div className="alert alert-success">
                    🎉 Request submitted successfully! The owner will review it. You can track status on your dashboard.
                  </div>
                )}
                
                {bookingError && (
                  <div className="alert alert-danger">
                    ⚠️ {bookingError}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="requestType">Request Type</label>
                  <select
                    id="requestType"
                    className="form-control"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                  >
                    <option value="borrow">Standard Borrowing (Immediate need)</option>
                    <option value="pre-booking">Pre-booking (Future reservation)</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="message">Message to Owner (Optional)</label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows="3"
                    placeholder="e.g. Why you need it, when you plan to pickup..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className={`btn btn-primary ${bookingLoading ? 'btn-disabled' : ''}`}
                  style={{ width: '100%' }}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? 'Submitting request...' : 'Send Request →'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResourceDetails;

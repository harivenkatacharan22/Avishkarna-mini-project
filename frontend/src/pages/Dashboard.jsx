import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState('overview');
  const [resources, setResources] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    setActionError('');
    try {
      // 1. Fetch resources and filter for user's own items
      const resVal = await axios.get(`${API_BASE_URL}/resources`);
      const userItems = resVal.data.filter(r => r.ownerId === user.id);
      setResources(userItems);

      // 2. Fetch incoming requests
      const incomingVal = await axios.get(`${API_BASE_URL}/requests/owner`);
      setIncomingRequests(incomingVal.data);

      // 3. Fetch user's own borrow requests
      const myVal = await axios.get(`${API_BASE_URL}/requests/borrower`);
      setMyRequests(myVal.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setActionError('Failed to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Handle resource availability toggle
  const handleToggleAvailability = async (resourceId, currentStatus) => {
    setActionError('');
    setActionSuccess('');
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    try {
      await axios.put(`${API_BASE_URL}/resources/${resourceId}`, {
        availabilityStatus: newStatus
      });
      setActionSuccess('Resource status updated successfully!');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setActionError('Failed to update availability status.');
    }
  };

  // Handle resource delete
  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm('Are you sure you want to delete this resource listing? This action cannot be undone.')) {
      return;
    }
    setActionError('');
    setActionSuccess('');
    try {
      await axios.delete(`${API_BASE_URL}/resources/${resourceId}`);
      setActionSuccess('Resource listing deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setActionError('Failed to delete resource. Ensure it does not have approved active bookings.');
    }
  };

  // Handle request moderation (Approve / Reject)
  const handleModerateRequest = async (requestId, status) => {
    setActionError('');
    setActionSuccess('');
    try {
      await axios.patch(`${API_BASE_URL}/requests/${requestId}/status`, { status });
      setActionSuccess(`Request successfully ${status === 'approved' ? 'approved' : 'rejected'}!`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setActionError(err.response?.data?.message || 'Failed to update request status.');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', margin: 0 }}>Community Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user.name} ({user.village})</p>
        </div>
        <Link to="/add-resource" className="btn btn-primary">
          ➕ Share New Item
        </Link>
      </div>

      {actionError && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          ⚠️ {actionError}
        </div>
      )}

      {actionSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
          🎉 {actionSuccess}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => { setActiveTab('overview'); setActionError(''); setActionSuccess(''); }}
        >
          📈 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
          onClick={() => { setActiveTab('listings'); setActionError(''); setActionSuccess(''); }}
        >
          📦 My Listed Resources ({resources.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'incoming' ? 'active' : ''}`}
          onClick={() => { setActiveTab('incoming'); setActionError(''); setActionSuccess(''); }}
        >
          📩 Incoming Borrow Requests ({incomingRequests.filter(r => r.status === 'pending').length} Pending)
        </button>
        <button 
          className={`tab-btn ${activeTab === 'outgoing' ? 'active' : ''}`}
          onClick={() => { setActiveTab('outgoing'); setActionError(''); setActionSuccess(''); }}
        >
          📤 My Borrow Requests ({myRequests.length})
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard details...</p>
        </div>
      ) : (
        <div className="tab-content" style={{ minHeight: '350px' }}>
          
          {/* 1. Overview Tab */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                
                <div className="glass-panel" style={{ textAlign: 'center', borderTop: '4px solid var(--primary-emerald)' }}>
                  <span style={{ fontSize: '2.5rem' }}>📦</span>
                  <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0.2rem' }}>{resources.length}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Items Shared by You</p>
                </div>

                <div className="glass-panel" style={{ textAlign: 'center', borderTop: '4px solid var(--accent-amber)' }}>
                  <span style={{ fontSize: '2.5rem' }}>📩</span>
                  <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0.2rem' }}>
                    {incomingRequests.filter(r => r.status === 'pending').length}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Incoming Requests</p>
                </div>

                <div className="glass-panel" style={{ textAlign: 'center', borderTop: '4px solid var(--secondary-blue)' }}>
                  <span style={{ fontSize: '2.5rem' }}>📤</span>
                  <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0.2rem' }}>{myRequests.length}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Requests Made by You</p>
                </div>

                <div className="glass-panel" style={{ textAlign: 'center', borderTop: '4px solid var(--primary-green)' }}>
                  <span style={{ fontSize: '2.5rem' }}>🤝</span>
                  <h3 style={{ fontSize: '2rem', margin: '0.5rem 0 0.2rem' }}>
                    {myRequests.filter(r => r.status === 'approved').length + incomingRequests.filter(r => r.status === 'approved').length}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Successful Shared Transactions</p>
                </div>

              </div>

              {/* Quick info panel */}
              <div className="glass-card" style={{ borderLeft: '4px solid var(--primary-emerald)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>💡 Sharing Tip!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Make sure to toggle the status of your listed resources to <strong>UNAVAILABLE</strong> if they are broken or under repairs. This prevents community members from submitting requests that you cannot fulfill.
                </p>
              </div>
            </div>
          )}

          {/* 2. My Listed Resources Tab */}
          {activeTab === 'listings' && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {resources.length > 0 ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Resource Name</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map(item => (
                        <tr key={item.id}>
                          <td>
                            <Link to={`/resources/${item.id}`} style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
                              {item.name}
                            </Link>
                          </td>
                          <td>{item.category}</td>
                          <td>
                            <span className={`badge badge-${item.availabilityStatus === 'available' ? 'available' : 'unavailable'}`}>
                              {item.availabilityStatus}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                onClick={() => handleToggleAvailability(item.id, item.availabilityStatus)}
                                className="btn"
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  fontSize: '0.8rem',
                                  background: item.availabilityStatus === 'available' ? '#f1f5f9' : '#dcfce7',
                                  border: '1px solid #cbd5e1',
                                  color: item.availabilityStatus === 'available' ? '#475569' : '#15803d'
                                }}
                              >
                                {item.availabilityStatus === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                              </button>
                              <button 
                                onClick={() => handleDeleteResource(item.id)}
                                className="btn btn-danger"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't listed any resources yet.</p>
                  <Link to="/add-resource" className="btn btn-primary">List Your First Resource</Link>
                </div>
              )}
            </div>
          )}

          {/* 3. Incoming Requests Tab */}
          {activeTab === 'incoming' && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {incomingRequests.length > 0 ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Resource Name</th>
                        <th>Borrower</th>
                        <th>Dates Requested</th>
                        <th>Type</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomingRequests.map(reqItem => (
                        <tr key={reqItem.id}>
                          <td><strong>{reqItem.resourceName}</strong></td>
                          <td>
                            <div>{reqItem.borrowerName}</div>
                            <small style={{ color: 'var(--text-muted)' }}>📞 {reqItem.borrowerContact}</small>
                          </td>
                          <td>
                            <small>From: <strong>{reqItem.startDate}</strong></small><br />
                            <small>To: <strong>{reqItem.endDate}</strong></small>
                          </td>
                          <td>
                            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                              {reqItem.type}
                            </span>
                          </td>
                          <td>
                            <p style={{ maxWidth: '200px', fontSize: '0.85rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={reqItem.message}>
                              {reqItem.message || <em style={{ color: '#cbd5e1' }}>No message</em>}
                            </p>
                          </td>
                          <td>
                            <span className={`badge badge-${reqItem.status}`}>
                              {reqItem.status}
                            </span>
                          </td>
                          <td>
                            {reqItem.status === 'pending' ? (
                              <div className="table-actions">
                                <button 
                                  onClick={() => handleModerateRequest(reqItem.id, 'approved')}
                                  className="btn btn-primary" 
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleModerateRequest(reqItem.id, 'rejected')}
                                  className="btn btn-danger"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Moderated</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
                  No requests received yet for your listed items.
                </div>
              )}
            </div>
          )}

          {/* 4. Outgoing Requests Tab */}
          {activeTab === 'outgoing' && (
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              {myRequests.length > 0 ? (
                <div className="table-container">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Resource Name</th>
                        <th>Dates Requested</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Request Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myRequests.map(reqItem => (
                        <tr key={reqItem.id}>
                          <td>
                            <Link to={`/resources/${reqItem.resourceId}`} style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
                              {reqItem.resourceName}
                            </Link>
                          </td>
                          <td>
                            <small>From: <strong>{reqItem.startDate}</strong></small><br />
                            <small>To: <strong>{reqItem.endDate}</strong></small>
                          </td>
                          <td>
                            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                              {reqItem.type}
                            </span>
                          </td>
                          <td>
                            <span className={`badge badge-${reqItem.status}`}>
                              {reqItem.status}
                            </span>
                          </td>
                          <td>
                            <small style={{ color: 'var(--text-muted)' }}>
                              {new Date(reqItem.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't requested any resources yet.</p>
                  <Link to="/resources" className="btn btn-primary">Browse Available Resources</Link>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Dashboard;

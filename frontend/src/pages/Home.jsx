import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import ResourceCard from '../components/ResourceCard';

const Home = () => {
  const [featuredResources, setFeaturedResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/resources`);
        // Show the latest 3 available resources as featured
        const availableOnly = res.data.filter(r => r.availabilityStatus === 'available');
        setFeaturedResources(availableOnly.slice(0, 3));
      } catch (err) {
        console.error('Error fetching resources for home page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1 className="hero-title">
              Share Resources, <span>Strengthen Villages</span>
            </h1>
            <p className="hero-subtitle">
              VillageShare is a community platform allowing neighbors to share farming equipment, drill machines, ladders, water pumps, and other items for free or minimal rates.
            </p>
            <div className="hero-actions">
              <Link to="/resources" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                Browse Resources 🔍
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                Join Community 🤝
              </Link>
            </div>
          </div>
          
          <div className="hero-image-container">
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600" 
              alt="Beautiful village farm" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="features container" style={{ marginBottom: '5rem' }}>
        <h2 className="section-title">How VillageShare Works</h2>
        <p className="section-subtitle">A simple three-step process built to encourage trust and sharing among community members.</p>
        
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon-wrapper">📦</div>
            <h3>1. List Your Resource</h3>
            <p>Have an expensive tool like a tractor, drill machine, or ladder that you rarely use? List it here for others to borrow.</p>
          </div>
          
          <div className="glass-card feature-card">
            <div className="feature-icon-wrapper">📅</div>
            <h3>2. Request / Pre-Book</h3>
            <p>Browse resources shared by other villagers. Select the dates you need it and send a request directly to the owner.</p>
          </div>
          
          <div className="glass-card feature-card">
            <div className="feature-icon-wrapper">🤝</div>
            <h3>3. Coordinate & Borrow</h3>
            <p>Once approved, contact the owner via phone to arrange pick-up. Return it on time to maintain a strong trust score!</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container">
        <div className="stats">
          <div className="stats-grid">
            <div className="stat-item">
              <h2>150+</h2>
              <p>Items Listed</p>
            </div>
            <div className="stat-item">
              <h2>12+</h2>
              <p>Active Villages</p>
            </div>
            <div className="stat-item">
              <h2>480+</h2>
              <p>Successful Borrows</p>
            </div>
            <div className="stat-item">
              <h2>₹60K+</h2>
              <p>Expenses Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="container" style={{ margin: '5rem auto 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>Featured Resources</h2>
          <Link to="/resources" style={{ color: 'var(--primary-emerald)', fontWeight: 600 }}>
            View All Resources &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading featured listings...</p>
          </div>
        ) : featuredResources.length > 0 ? (
          <div className="items-grid">
            {featuredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No resources available right now</h3>
            <p>Be the first one to share an item and help your community grow!</p>
            <Link to="/add-resource" className="btn btn-primary">Share an Item</Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

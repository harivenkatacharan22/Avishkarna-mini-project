import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import ResourceCard from '../components/ResourceCard';

const CATEGORIES = [
  'All',
  'Drill Machine',
  'Water Motor',
  'Tractor',
  'Ladder',
  'Books',
  'Farming Tools',
  'Other'
];

const BrowseResources = () => {
  const location = useLocation();
  
  // Extract category from URL query parameters if present (e.g. from footer)
  const getCategoryFromQuery = () => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    return cat && CATEGORIES.includes(cat) ? cat : 'All';
  };

  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromQuery());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Sync category if URL search parameters change
  useEffect(() => {
    setSelectedCategory(getCategoryFromQuery());
  }, [location.search]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/resources`, {
        params: {
          category: selectedCategory,
          search: searchTerm
        }
      });
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources();
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Explore Shared Resources</h1>
        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
          Find available equipment, tools, and materials shared by other villagers in your neighborhood.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} style={{ maxWidth: '600px', margin: '0 auto 2.5rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, description, village or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '0.85rem 1.25rem', borderRadius: '8px' }}
          />
          <button type="submit" className="btn btn-secondary" style={{ borderRadius: '8px', padding: '0 1.5rem' }}>
            Search 🔍
          </button>
        </form>

        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {CATEGORIES.map(category => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', border: selectedCategory === category ? 'none' : '1px solid #cbd5e1' }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading community resources...</p>
        </div>
      ) : resources.length > 0 ? (
        <div className="items-grid">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>No resources found</h3>
          <p>We couldn't find any resources matching your search. Try resetting filters or adjust your keywords.</p>
          <button 
            className="btn btn-outline" 
            onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseResources;

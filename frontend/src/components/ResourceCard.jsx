import React from 'react';
import { Link } from 'react-router-dom';

const ResourceCard = ({ resource }) => {
  const { id, name, category, description, availabilityStatus, ownerName, villageName, imageUrl } = resource;

  // Fallback image based on category
  const getFallbackImage = (cat) => {
    switch (cat) {
      case 'Farming Tools':
        return 'https://images.unsplash.com/photo-1594498653385-d527250c69fe?auto=format&fit=crop&q=80&w=400';
      case 'Drill Machine':
        return 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400';
      case 'Water Motor':
        return 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=400';
      case 'Ladder':
        return 'https://images.unsplash.com/photo-1589307737252-090c14c5c2d3?auto=format&fit=crop&q=80&w=400';
      case 'Books':
        return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400';
      default:
        return 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400';
    }
  };

  const activeImg = imageUrl || getFallbackImage(category);

  return (
    <div className="glass-card item-card">
      <div className="card-img-wrapper">
        <img 
          src={activeImg} 
          alt={name} 
          className="card-img" 
          onError={(e) => { e.target.src = getFallbackImage(category); }}
        />
        <span 
          style={{ position: 'absolute', top: '10px', left: '10px' }} 
          className={`badge badge-${availabilityStatus === 'available' ? 'available' : 'unavailable'}`}
        >
          {availabilityStatus}
        </span>
      </div>
      
      <div className="card-content">
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-emerald)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
          {category}
        </span>
        <h3 className="card-title">{name}</h3>
        <p className="card-description">{description}</p>
        
        <div className="card-meta">
          <div>
            👤 <span style={{ fontWeight: 500 }}>{ownerName}</span>
          </div>
          <div className="card-meta-loc">
            📍 <span>{villageName}</span>
          </div>
        </div>

        <Link 
          to={`/resources/${id}`} 
          className="btn btn-primary" 
          style={{ marginTop: '1.25rem', width: '100%' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;

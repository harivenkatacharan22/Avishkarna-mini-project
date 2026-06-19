import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>🌾 <span>VillageShare</span></h3>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              Empowering rural communities by encouraging sharing of tools, equipment, and resources. Reducing individual costs, building trust, and promoting sustainable agriculture.
            </p>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/resources">Browse Resources</Link></li>
              <li><Link to="/about">About Concept</Link></li>
              <li><Link to="/contact">Help & Support</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/resources?category=Farming Tools">Farming Tools</Link></li>
              <li><Link to="/resources?category=Drill Machine">Drill Machines</Link></li>
              <li><Link to="/resources?category=Water Motor">Water Motors</Link></li>
              <li><Link to="/resources?category=Ladder">Ladders & Stools</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>B.Tech Project</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
              <strong>Mini Project 2026</strong><br />
              Focus: Rural Empowerment & Resource Optimization<br />
              Tech Stack: React.js, Express.js, Node.js & JSON File DB.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} VillageShare Platform. All Rights Reserved.</p>
          <p style={{ color: '#10b981' }}>Designed with 💚 for Rural Communities</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

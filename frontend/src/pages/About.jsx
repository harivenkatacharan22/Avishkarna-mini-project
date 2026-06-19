import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="section-title">About VillageShare</h1>
        <p className="section-subtitle">
          Empowering villages through collective resource utilization and collaborative community trust.
        </p>
      </div>

      <div style={{ maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Core Vision Panel */}
        <div className="glass-card" style={{ marginBottom: '3rem', borderLeft: '5px solid var(--primary-emerald)' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>🌱 Project Vision & Scope</h2>
          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.7' }}>
            In rural communities, smallholder farmers and households often struggle with the heavy financial burden of purchasing expensive tools—such as tractors, drill machines, water pumps, or tall ladders—that are only required a few times a year. 
            <br /><br />
            <strong>VillageShare</strong> is a digital solution that creates a collaborative economy. It allows neighbors to list their idle tools, making them available for others in the community to borrow. This simple shift from individual ownership to community sharing saves significant money, reduces waste, and strengthens social bonding.
          </p>
        </div>

        {/* The Three Pillars */}
        <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '2rem' }}>💎 Core Benefits</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
          
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>💰</span>
            <h3 style={{ margin: '1rem 0 0.5rem' }}>Cost Savings</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Avoid spending large capital amounts on items used rarely. Rent or borrow from a neighbor instead.
            </p>
          </div>

          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🚜</span>
            <h3 style={{ margin: '1rem 0 0.5rem' }}>Resource Efficiency</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Optimize the usage of tools already present in the village. Reduce idle inventory across rural homes.
            </p>
          </div>

          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>🤝</span>
            <h3 style={{ margin: '1rem 0 0.5rem' }}>Community Trust</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Foster closer relationships between neighboring villages through sharing, coordination, and cooperative agreements.
            </p>
          </div>

        </div>

        {/* Technical Architecture for Viva */}
        <div className="glass-card" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-dark)' }}>⚙️ Technical Architecture</h2>
          <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem' }}>
            This application has been developed as a standard Single Page Application (SPA) utilizing a modern MERN-like stack tailored for database-free execution.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', fontSize: '0.9rem' }}>
            <div className="glass-panel">
              <h4 style={{ color: 'var(--primary-emerald)', marginBottom: '0.5rem' }}>Frontend (Client)</h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li><strong>React.js (Vite)</strong>: Declarative component views</li>
                <li><strong>React Router DOM</strong>: Client-side routing control</li>
                <li><strong>Context API</strong>: Global Auth & Session management</li>
                <li><strong>Axios</strong>: Asynchronous HTTP request execution</li>
                <li><strong>CSS Variables & Flexbox</strong>: Custom glassmorphic styles</li>
              </ul>
            </div>

            <div className="glass-panel">
              <h4 style={{ color: 'var(--secondary-blue)', marginBottom: '0.5rem' }}>Backend (API Server)</h4>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li><strong>Node.js & Express.js</strong>: RESTful router server</li>
                <li><strong>JSON File Storage</strong>: File-based persistence layer</li>
                <li><strong>Bcrypt.js</strong>: Secure client password hashing</li>
                <li><strong>JSON Web Tokens (JWT)</strong>: Stateless bearer authorization</li>
                <li><strong>CORS middleware</strong>: Cross-origin sharing validation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mini Project Credits */}
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <p>VillageShare is developed as a <strong>B.Tech Computer Science & Engineering Mini Project</strong>.</p>
          <p style={{ marginTop: '0.25rem' }}>Academic Year: 2026</p>
        </div>

      </div>
    </div>
  );
};

export default About;

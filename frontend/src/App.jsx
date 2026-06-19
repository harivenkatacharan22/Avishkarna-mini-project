import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseResources from './pages/BrowseResources';
import ResourceDetails from './pages/ResourceDetails';
import AddResource from './pages/AddResource';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import About from './pages/About';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resources" element={<BrowseResources />} />
              <Route path="/resources/:id" element={<ResourceDetails />} />
              <Route path="/add-resource" element={<AddResource />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              {/* 404 fallback */}
              <Route path="*" element={
                <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
                  <h1 style={{ fontSize: '5rem', color: 'var(--primary-emerald)' }}>404</h1>
                  <h2>Page Not Found</h2>
                  <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>
                    The page you are looking for does not exist.
                  </p>
                  <a href="/" className="btn btn-primary">Go to Home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from './Icons';

const CitizenHeader = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className={`citizen-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="citizen-header-inner">
        <Link to="/" className="citizen-logo">
          <div className="citizen-logo-icon">
            <img src="/images/wolaita-logo.png" alt="Wolaita Sodo Water-Point Monitoring System" />
          </div>
          <div className="citizen-logo-text">
            <span className="citizen-logo-title">Wolaita Sodo</span>
            <span className="citizen-logo-subtitle">Water-Point Monitoring</span>
          </div>
        </Link>

        <nav className="citizen-nav">
          <Link to="/" className={`citizen-nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/map" className={`citizen-nav-link ${isActive('/map')}`}>Map</Link>
          <Link to="/track" className={`citizen-nav-link ${isActive('/track')}`}>Track</Link>
          <Link to="/about" className={`citizen-nav-link ${isActive('/about')}`}>About</Link>
          <Link to="/report" className="citizen-nav-cta">Report Issue</Link>
        </nav>

        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" className={`citizen-nav-link ${isActive('/')}`} onClick={() => setMobileOpen(false)}>Home</Link>
        <Link to="/map" className={`citizen-nav-link ${isActive('/map')}`} onClick={() => setMobileOpen(false)}>Map</Link>
        <Link to="/track" className={`citizen-nav-link ${isActive('/track')}`} onClick={() => setMobileOpen(false)}>Track</Link>
        <Link to="/about" className={`citizen-nav-link ${isActive('/about')}`} onClick={() => setMobileOpen(false)}>About</Link>
        <Link to="/report" className="citizen-nav-cta" onClick={() => setMobileOpen(false)}>Report Issue</Link>
      </div>
    </header>
  );
};

export default CitizenHeader;

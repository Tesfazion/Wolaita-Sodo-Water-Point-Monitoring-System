import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from './Icons';

const Footer = () => (
  <footer className="citizen-footer">
    <div className="footer-grid">
      <div className="footer-brand">
        <h3>Wolaita Sodo Water-Point Monitoring System</h3>
        <p>Community-driven water infrastructure monitoring for Wolaita Zone, South Ethiopia. Helping every community access clean, safe water.</p>
      </div>
      <div className="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/map">Water Points Map</Link></li>
          <li><Link to="/report">Report Issue</Link></li>
          <li><Link to="/track">Track Report</Link></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Resources</h4>
        <ul>
          <li><Link to="/about">About Us</Link></li>
        </ul>
      </div>
      <div className="footer-col">
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:+251911123456"><Phone size={14} /> +251-911-123456</a></li>
          <li><a href="mailto:admin@sodowater.gov.et"><Mail size={14} /> admin@sodowater.gov.et</a></li>
          <li><span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}><MapPin size={14} /> Sodo City, Wolaita</span></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2026 Wolaita Sodo Water-Point Monitoring System — Sunshine Tech Solution</p>
    </div>
  </footer>
);

export default Footer;

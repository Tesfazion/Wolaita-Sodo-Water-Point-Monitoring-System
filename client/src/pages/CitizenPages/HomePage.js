import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../../services/api';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { Droplet, CheckCircle, AlertTriangle, Wrench, Map, FileText, BarChart3, ArrowRight } from '../../components/common/Icons';

const HomePage = () => {
  const [stats, setStats] = useState({ total: 0, working: 0, broken: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getMapData()
      .then(res => {
        const data = res.data.data;
        setStats({
          total: data.length,
          working: data.filter(wp => wp.current_status === 'working').length,
          broken: data.filter(wp => wp.current_status === 'broken' || wp.current_status === 'reported_broken').length,
          maintenance: data.filter(wp => wp.current_status === 'under_repair').length
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <CitizenHeader />

      <section className="hero" style={{ position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=1600&h=900&fit=crop"
          alt="Water infrastructure in Ethiopia"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.18, pointerEvents: 'none'
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up">
            <h1>Report Water Issues<br />in Wolaita</h1>
          </div>
          <div className="animate-fade-in-up delay-2">
            <p>Help us maintain clean water access for all communities in Wolaita Zone. Report broken water points and track repairs in real-time.</p>
          </div>
          <div className="hero-actions animate-fade-in-up delay-4">
            <Link to="/report" className="btn btn-success btn-lg">Report an Issue</Link>
            <Link to="/map" className="btn btn-outline btn-lg">View Map</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card blue animate-fade-in-up delay-1">
              <div className="stat-card-icon"><Droplet size={24} /></div>
              <div className="stat-card-value">{loading ? '—' : stats.total}</div>
              <div className="stat-card-label">Total Water Points</div>
            </div>
            <div className="stat-card green animate-fade-in-up delay-2">
              <div className="stat-card-icon"><CheckCircle size={24} /></div>
              <div className="stat-card-value">{loading ? '—' : stats.working}</div>
              <div className="stat-card-label">Working</div>
            </div>
            <div className="stat-card red animate-fade-in-up delay-3">
              <div className="stat-card-icon"><AlertTriangle size={24} /></div>
              <div className="stat-card-value">{loading ? '—' : stats.broken}</div>
              <div className="stat-card-label">Need Repair</div>
            </div>
            <div className="stat-card orange animate-fade-in-up delay-4">
              <div className="stat-card-icon"><Wrench size={24} /></div>
              <div className="stat-card-value">{loading ? '—' : stats.maintenance}</div>
              <div className="stat-card-label">Under Maintenance</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title animate-fade-in-up">How It Works</h2>
          <p className="section-subtitle animate-fade-in-up delay-1">Three simple steps to report and track water point issues</p>
          <div className="feature-grid">
            <Link to="/map" className="feature-card animate-fade-in-up delay-2">
              <div className="feature-card-icon blue"><Map size={28} /></div>
              <h3>View the Map</h3>
              <p>Explore all water points across Wolaita Zone on an interactive map with real-time status.</p>
            </Link>
            <Link to="/report" className="feature-card animate-fade-in-up delay-3">
              <div className="feature-card-icon green"><FileText size={28} /></div>
              <h3>Report a Problem</h3>
              <p>Submit a fault report with photos in under a minute. Your report goes directly to the WASH office.</p>
            </Link>
            <Link to="/track" className="feature-card animate-fade-in-up delay-4">
              <div className="feature-card-icon orange"><BarChart3 size={28} /></div>
              <h3>Track Progress</h3>
              <p>Follow your report from submission to resolution with real-time status updates.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="info-card-with-image animate-fade-in-up">
            <img
              src="https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800&h=500&fit=crop"
              alt="Community water point in rural Ethiopia"
            />
            <div>
              <h2 style={{ marginBottom: '1rem' }}>About Wolaita Sodo Water-Point Monitoring System</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                Wolaita Sodo Water-Point Monitoring System is a community-driven water infrastructure monitoring system designed for Wolaita Zone in South Ethiopia.
                It enables citizens to report broken or malfunctioning water points in real-time and helps local WASH offices
                track and resolve issues efficiently.
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                By working together, we can ensure that every community has access to clean, safe water.
                Our WASH offices and technicians receive your reports immediately and coordinate repairs
                to restore water access as quickly as possible.
              </p>
              <Link to="/about" className="btn btn-primary">Learn More <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <Link to="/report" className="fab"><FileText size={18} /> Report Issue</Link>
    </div>
  );
};

export default HomePage;

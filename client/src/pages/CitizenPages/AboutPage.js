import React from 'react';
import { Link } from 'react-router-dom';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { FileText, Target, BarChart3, Droplet, Zap, CheckCircle, Map, Phone, Mail } from '../../components/common/Icons';

const AboutPage = () => (
  <div>
    <CitizenHeader />
    <main className="container-narrow page-content">

      <div className="page-hero-image animate-fade-in-up" style={{ marginBottom: '2.5rem' }}>
        <img
          src="https://images.unsplash.com/photo-1760873059715-7c7cfbe2a2c6?w=1200&h=400&fit=crop"
          alt="Community water pump in rural Africa"
        />
        <div className="page-hero-overlay">
          <h1 style={{ marginBottom: '0.5rem' }}>About Wolaita Sodo Water-Point Monitoring System</h1>
          <p>Community water-point monitoring for Wolaita Zone, South Ethiopia</p>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-1">
        <div className="card-body">
          <div className="about-split">
            <div className="about-split-image">
              <img
                src="https://images.unsplash.com/photo-1753940720022-053869f608c4?w=800&h=500&fit=crop"
                alt="Hand pump in rural landscape"
              />
            </div>
            <div className="about-split-content">
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>What is Wolaita Sodo Water-Point Monitoring System?</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                Wolaita Sodo Water-Point Monitoring System is a community water-point monitoring system designed specifically for Wolaita Zone in South Ethiopia.
                It enables citizens to report broken or malfunctioning water points in real-time and helps local WASH offices
                track and resolve issues efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-2">
        <div className="card-body">
          <h2 style={{ marginBottom: '0.75rem' }}>The Problem We Solve</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Hand pumps and shallow wells across rural and peri-urban Ethiopia frequently break down and stay broken for months.
            The root problem is not usually technical — it is informational:
          </p>
          <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: '1.5rem' }}>
            <li>No reliable way for community members to report broken water points</li>
            <li>Reports get lost or delayed through word-of-mouth</li>
            <li>No visibility into which water points need repair</li>
            <li>No accountability or tracking system</li>
            <li>Communities forced back onto unsafe water sources</li>
          </ul>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-3">
        <div className="card-body">
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>How We Help</h2>
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {[
              { icon: <FileText size={20} />, title: 'Easy Reporting', desc: 'Report a problem in under 1 minute with photo evidence' },
              { icon: <Target size={20} />, title: 'Automatic Routing', desc: 'Your report goes directly to the responsible WASH office' },
              { icon: <BarChart3 size={20} />, title: 'Real-Time Tracking', desc: 'Follow your report from submission to resolution' },
              { icon: <Droplet size={20} />, title: 'Transparency', desc: 'See which water points are working and which need repair' },
              { icon: <Zap size={20} />, title: 'Faster Response', desc: 'Offices can prioritize and track all reports in one place' },
              { icon: <CheckCircle size={20} />, title: 'Accountability', desc: 'Performance metrics ensure timely responses' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.125rem' }}>{item.icon}</span>
                <div>
                  <strong style={{ color: 'var(--text)' }}>{item.title}:</strong>
                  <span style={{ color: 'var(--text-secondary)' }}> {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-4">
        <div className="card-body">
          <div className="about-image-grid" style={{ marginBottom: '1.5rem' }}>
            <img
              src="https://images.unsplash.com/photo-1760873059715-7c7cfbe2a2c6?w=600&h=400&fit=crop"
              alt="Children at a village water pump"
            />
            <img
              src="https://images.unsplash.com/photo-1753940720022-053869f608c4?w=600&h=400&fit=crop"
              alt="Water pump in rural area"
            />
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>Coverage Area</h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p><strong>City:</strong> Sodo</p>
            <p><strong>Zone:</strong> Wolaita</p>
            <p><strong>Region:</strong> South Ethiopia (SNNPR)</p>
            <p><strong>Country:</strong> Ethiopia</p>
            <p>We currently cover water points across all woredas in Wolaita Zone, including Sodo Zuriya, Damot Gale, Damot Sore, Boloso Sore, and others.</p>
          </div>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-5">
        <div className="card-body">
          <h2 style={{ marginBottom: '0.75rem' }}>Contact Information</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <h4 style={{ marginBottom: '0.375rem' }}>Wolaita Zone Water Office</h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
                Location: Sodo City, Near Stadium<br />
                Phone: <a href="tel:+251911123456"><Phone size={14} /> +251-911-123456</a><br />
                Email: <a href="mailto:admin@sodowater.gov.et"><Mail size={14} /> admin@sodowater.gov.et</a>
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '0.375rem' }}>Technical Support</h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Sunshine Tech Solution — Sodo, Wolaita, Ethiopia</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in-up delay-6">
        <div className="card-body text-center">
          <h2 style={{ marginBottom: '0.75rem' }}>Get Started</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Ready to help your community access clean water?</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/map" className="btn btn-outline"><Map size={16} /> View Map</Link>
            <Link to="/report" className="btn btn-success"><FileText size={16} /> Report a Fault</Link>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default AboutPage;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { analyticsAPI } from '../../services/api';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { Droplet, CheckCircle, AlertTriangle, Wrench, Map, FileText, BarChart3, ArrowRight } from '../../components/common/Icons';

const HomePage = () => {
  const { t } = useTranslation();
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

      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1760873059715-7c7cfbe2a2c6?w=1600&h=900&fit=crop"
          alt={t('home.heroAlt')}
          className="hero-bg-image"
        />
        <div className="hero-overlay" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="animate-fade-in-up">
            <h1>{t('home.heroTitle1')}<br />{t('home.heroTitle2')}</h1>
          </div>
          <div className="animate-fade-in-up delay-2">
            <p>{t('home.heroDesc')}</p>
          </div>
          <div className="hero-actions animate-fade-in-up delay-4">
            <Link to="/report" className="btn btn-success btn-lg">{t('home.reportBtn')}</Link>
            <Link to="/map" className="btn btn-outline btn-lg">{t('home.viewMap')}</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card blue animate-fade-in-up delay-1">
              <div className="stat-card-icon"><Droplet size={24} /></div>
              <div className="stat-card-value">{loading ? '—' : stats.total}</div>
              <div className="stat-card-label">{t('home.totalWaterPoints')}</div>
            </div>
            <div className="stat-card green animate-fade-in-up delay-2">
              <div className="stat-card-icon"><CheckCircle size={24} /></div>
              <div className="stat-card-value">{loading ? '—' : stats.working}</div>
              <div className="stat-card-label">{t('home.working')}</div>
            </div>
            <div className="stat-card red animate-fade-in-up delay-3">
              <div className="stat-card-icon"><AlertTriangle size={24} /></div>
              <div className="stat-card-value">{loading ? '—' : stats.broken}</div>
              <div className="stat-card-label">{t('home.needRepair')}</div>
            </div>
            <div className="stat-card orange animate-fade-in-up delay-4">
              <div className="stat-card-icon"><Wrench size={24} /></div>
              <div className="stat-card-value">{loading ? '—' : stats.maintenance}</div>
              <div className="stat-card-label">{t('home.underMaintenance')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title animate-fade-in-up">{t('home.howItWorks')}</h2>
          <p className="section-subtitle animate-fade-in-up delay-1">{t('home.howItWorksSub')}</p>
          <div className="feature-grid">
            <Link to="/map" className="feature-card animate-fade-in-up delay-2">
              <div className="feature-card-image">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=300&fit=crop" alt={t('home.mapImgAlt')} />
              </div>
              <div className="feature-card-icon blue"><Map size={28} /></div>
              <h3>{t('home.viewTheMap')}</h3>
              <p>{t('home.viewTheMapDesc')}</p>
            </Link>
            <Link to="/report" className="feature-card animate-fade-in-up delay-3">
              <div className="feature-card-image">
                <img src="https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=600&h=300&fit=crop" alt={t('home.reportImgAlt')} />
              </div>
              <div className="feature-card-icon green"><FileText size={28} /></div>
              <h3>{t('home.reportAProblem')}</h3>
              <p>{t('home.reportAProblemDesc')}</p>
            </Link>
            <Link to="/track" className="feature-card animate-fade-in-up delay-4">
              <div className="feature-card-image">
                <img src="https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=600&h=300&fit=crop" alt={t('home.trackImgAlt')} />
              </div>
              <div className="feature-card-icon orange"><BarChart3 size={28} /></div>
              <h3>{t('home.trackProgress')}</h3>
              <p>{t('home.trackProgressDesc')}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-banner-section">
        <div className="cta-banner">
          <img
            src="https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=1400&h=500&fit=crop"
            alt="Community water project"
            className="cta-banner-img"
          />
          <div className="cta-banner-overlay">
            <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <h2 style={{ color: 'white', marginBottom: '0.75rem' }}>{t('home.aboutTitle')}</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: 600, margin: '0 auto 1.5rem' }}>{t('home.aboutDesc1')}</p>
              <Link to="/about" className="btn btn-success btn-lg">{t('home.learnMore')}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-split animate-fade-in-up">
            <div className="about-split-image">
              <img
                src="https://images.unsplash.com/photo-1753940720022-053869f608c4?w=800&h=600&fit=crop"
                alt={t('home.aboutImgAlt')}
              />
            </div>
            <div className="about-split-content">
              <h2>{t('home.aboutTitle')}</h2>
              <p>
                {t('home.aboutDesc1')}
              </p>
              <p>
                {t('home.aboutDesc2')}
              </p>
              <Link to="/about" className="btn btn-primary">{t('home.learnMore')} <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <Link to="/report" className="fab"><FileText size={18} /> {t('home.reportIssueFab')}</Link>
    </div>
  );
};

export default HomePage;

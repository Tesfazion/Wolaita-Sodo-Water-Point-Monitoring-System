import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { FileText, Target, BarChart3, Droplet, Zap, CheckCircle, Map, Phone, Mail } from '../../components/common/Icons';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
  <div>
    <CitizenHeader />
    <main className="container-narrow page-content">

      <div className="page-hero-image animate-fade-in-up" style={{ marginBottom: '2.5rem' }}>
        <img
          src="https://images.unsplash.com/photo-1760873059715-7c7cfbe2a2c6?w=1200&h=400&fit=crop"
          alt={t('home.heroAlt')}
        />
        <div className="page-hero-overlay">
          <h1 style={{ marginBottom: '0.5rem' }}>{t('about.whatIsTitle')}</h1>
          <p>{t('about.pageSubtitle')}</p>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-1">
        <div className="card-body">
          <div className="about-split">
            <div className="about-split-image">
              <img
                src="https://images.unsplash.com/photo-1753940720022-053869f608c4?w=800&h=500&fit=crop"
                alt={t('home.aboutImgAlt')}
              />
            </div>
            <div className="about-split-content">
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>{t('about.whatIsTitle')}</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {t('about.whatIsDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-2">
        <div className="info-card-with-image" style={{ padding: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop"
            alt="Broken water pump"
            style={{ borderRadius: 0, height: '100%', minHeight: 220, width: '100%' }}
          />
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>{t('about.problemTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              {t('about.problemDesc')}
            </p>
            <ul style={{ color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: '1.5rem' }}>
              <li>{t('about.problemList1')}</li>
              <li>{t('about.problemList2')}</li>
              <li>{t('about.problemList3')}</li>
              <li>{t('about.problemList4')}</li>
              <li>{t('about.problemList5')}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-3">
        <div className="info-card-with-image" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{t('about.howWeHelp')}</h2>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {[
                { icon: <FileText size={20} />, title: t('about.feature1Title'), desc: t('about.feature1Desc') },
                { icon: <Target size={20} />, title: t('about.feature2Title'), desc: t('about.feature2Desc') },
                { icon: <BarChart3 size={20} />, title: t('about.feature3Title'), desc: t('about.feature3Desc') },
                { icon: <Droplet size={20} />, title: t('about.feature4Title'), desc: t('about.feature4Desc') },
                { icon: <Zap size={20} />, title: t('about.feature5Title'), desc: t('about.feature5Desc') },
                { icon: <CheckCircle size={20} />, title: t('about.feature6Title'), desc: t('about.feature6Desc') }
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
          <img
            src="https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=600&h=500&fit=crop"
            alt="Water infrastructure repair"
            style={{ borderRadius: 0, height: '100%', minHeight: 280, width: '100%' }}
          />
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-4">
        <div className="card-body">
          <div className="about-image-grid" style={{ marginBottom: '1.5rem' }}>
            <img
              src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&h=400&fit=crop"
              alt="Rural water source"
            />
            <img
              src="https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=600&h=400&fit=crop"
              alt="Community gathering at water point"
            />
          </div>
          <h2 style={{ marginBottom: '0.75rem' }}>{t('about.coverageTitle')}</h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p><strong>{t('about.city')}:</strong> {t('about.cityVal')}</p>
            <p><strong>{t('about.zone')}:</strong> {t('about.zoneVal')}</p>
            <p><strong>{t('about.region')}:</strong> {t('about.regionVal')}</p>
            <p><strong>{t('about.country')}:</strong> {t('about.countryVal')}</p>
            <p>{t('about.coverageDesc')}</p>
          </div>
        </div>
      </div>

      <div className="card mb-lg animate-fade-in-up delay-5">
        <div className="info-card-with-image" style={{ padding: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&h=400&fit=crop"
            alt="Office building"
            style={{ borderRadius: 0, height: '100%', minHeight: 200, width: '100%' }}
          />
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>{t('about.contactTitle')}</h2>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <h4 style={{ marginBottom: '0.375rem' }}>{t('about.washOffice')}</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
                  {t('about.washOfficeLoc')}<br />
                  Phone: <a href="tel:+251911123456"><Phone size={14} /> +251-911-123456</a><br />
                  Email: <a href="mailto:admin@sodowater.gov.et"><Mail size={14} /> admin@sodowater.gov.et</a>
                </p>
              </div>
              <div>
                <h4 style={{ marginBottom: '0.375rem' }}>{t('about.techSupport')}</h4>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('about.techSupportInfo')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-banner-image mb-lg" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1590595906931-81f04f0ccebb?w=1000&h=300&fit=crop"
          alt="Clean water community"
          style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(225,29,72,0.6), rgba(26,26,46,0.5))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', padding: '0 1.5rem' }}>{t('home.aboutDesc2')}</p>
        </div>
      </div>

      <div className="card animate-fade-in-up delay-6">
        <div className="card-body text-center">
          <h2 style={{ marginBottom: '0.75rem' }}>{t('about.getStarted')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('about.getStartedDesc')}</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/map" className="btn btn-outline"><Map size={16} /> {t('about.viewMapBtn')}</Link>
            <Link to="/report" className="btn btn-success"><FileText size={16} /> {t('about.reportFaultBtn')}</Link>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
  );
};

export default AboutPage;

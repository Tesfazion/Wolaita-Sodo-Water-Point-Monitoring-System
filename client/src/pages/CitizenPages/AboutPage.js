import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { FileText, Target, BarChart3, Droplet, Zap, CheckCircle, Map, Phone, Mail, Users } from '../../components/common/Icons';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
  <div>
    <CitizenHeader />
    <main className="container page-content">

      <div className="about-brand animate-fade-in-up">
        <div className="about-brand-logo">
          <img src="/images/wolaita-logo.png" alt={t('brand.title')} />
        </div>
        <h1 className="about-brand-title">{t('brand.title')}</h1>
        <p className="about-brand-subtitle">{t('brand.subtitle')}</p>
        <span className="wolaita-tibeb"></span>
      </div>

      <div className="page-hero-image animate-fade-in-up" style={{ marginBottom: '2rem', minHeight: 260 }}>
        <img
          src="https://images.unsplash.com/photo-1748442001865-5583ec02ae22?w=1400&h=500&fit=crop"
          alt={t('about.whatIsTitle')}
        />
        <div className="page-hero-overlay">
          <h1 style={{ marginBottom: '0.5rem' }}>{t('about.whatIsTitle')}</h1>
          <p>{t('about.pageSubtitle')}</p>
        </div>
      </div>

      <div className="about-impact-band animate-fade-in-up delay-1">
        <div className="about-impact-block">
          <span className="about-impact-icon"><Users size={22} /></span>
          <span className="about-impact-value">{t('about.impactValue1')}</span>
          <span className="about-impact-label">{t('about.impactLabel1')}</span>
        </div>
        <div className="about-impact-block">
          <span className="about-impact-icon"><Map size={22} /></span>
          <span className="about-impact-value">{t('about.impactValue2')}</span>
          <span className="about-impact-label">{t('about.impactLabel2')}</span>
        </div>
        <div className="about-impact-block">
          <span className="about-impact-icon"><Zap size={22} /></span>
          <span className="about-impact-value">{t('about.impactValue3')}</span>
          <span className="about-impact-label">{t('about.impactLabel3')}</span>
        </div>
        <div className="about-impact-block">
          <span className="about-impact-icon"><CheckCircle size={22} /></span>
          <span className="about-impact-value">{t('about.impactValue4')}</span>
          <span className="about-impact-label">{t('about.impactLabel4')}</span>
        </div>
      </div>

      <span className="wolaita-tibeb animate-fade-in-up delay-1" style={{ marginBottom: '1.5rem' }}></span>

      <section className="card mb-lg animate-fade-in-up delay-2">
        <div className="about-split card-body">
          <div className="about-split-image">
            <img
              src="https://images.unsplash.com/photo-1764697761858-e126b8c7aaa6?w=900&h=560&fit=crop"
              alt={t('about.whatIsTitle')}
            />
          </div>
          <div className="about-split-content">
            <h2 style={{ color: 'var(--primary)' }}>{t('about.whatIsTitle')}</h2>
            <p>{t('about.whatIsDesc')}</p>
          </div>
        </div>
      </section>

      <section className="card mb-lg animate-fade-in-up delay-3">
        <div className="info-card-with-image" style={{ padding: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1696853961331-22ed783d24cd?w=700&h=460&fit=crop"
            alt={t('about.problemTitle')}
            style={{ borderRadius: 0, height: '100%', minHeight: 240, width: '100%' }}
          />
          <div style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>{t('about.problemTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
              {t('about.problemDesc')}
            </p>
            <ul className="about-problem-list">
              <li>{t('about.problemList1')}</li>
              <li>{t('about.problemList2')}</li>
              <li>{t('about.problemList3')}</li>
              <li>{t('about.problemList4')}</li>
              <li>{t('about.problemList5')}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="card mb-lg animate-fade-in-up delay-4">
        <div className="card-body">
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{t('about.howWeHelp')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 0, marginBottom: '1.5rem' }}>
            {t('about.coverageDesc')}
          </p>
          <div className="about-feature-grid">
            {[
              { icon: <FileText size={20} />, title: t('about.feature1Title'), desc: t('about.feature1Desc') },
              { icon: <Target size={20} />, title: t('about.feature2Title'), desc: t('about.feature2Desc') },
              { icon: <BarChart3 size={20} />, title: t('about.feature3Title'), desc: t('about.feature3Desc') },
              { icon: <Droplet size={20} />, title: t('about.feature4Title'), desc: t('about.feature4Desc') },
              { icon: <Zap size={20} />, title: t('about.feature5Title'), desc: t('about.feature5Desc') },
              { icon: <CheckCircle size={20} />, title: t('about.feature6Title'), desc: t('about.feature6Desc') }
            ].map((item, i) => (
              <div key={i} className="about-feature-item">
                <span className="about-feature-icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card mb-lg animate-fade-in-up delay-5">
        <div className="card-body">
          <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>{t('about.coverageTitle')}</h2>
          <div className="about-coverage">
            <div className="about-coverage-info">
              <p><strong>{t('about.city')}:</strong> {t('about.cityVal')}</p>
              <p><strong>{t('about.zone')}:</strong> {t('about.zoneVal')}</p>
              <p><strong>{t('about.region')}:</strong> {t('about.regionVal')}</p>
              <p><strong>{t('about.country')}:</strong> {t('about.countryVal')}</p>
              <p className="about-coverage-desc">{t('about.coverageDesc')}</p>
            </div>
            <div className="about-gallery about-gallery-single">
              <div className="about-gallery-item">
                <img src="https://images.unsplash.com/photo-1747330665987-78cec08c8ec9?w=700&h=420&fit=crop" alt={t('about.galleryCap1')} />
                <span>{t('about.galleryCap1')}</span>
              </div>
              <div className="about-gallery-item">
                <img src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=700&h=420&fit=crop" alt={t('about.galleryCap2')} />
                <span>{t('about.galleryCap2')}</span>
              </div>
              <div className="about-gallery-item">
                <img src="https://images.unsplash.com/photo-1740741703651-2ab84a608a0b?w=700&h=420&fit=crop" alt={t('about.galleryCap3')} />
                <span>{t('about.galleryCap3')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="card mb-lg animate-fade-in-up delay-6">
        <div className="about-contact">
          <div className="about-contact-info">
            <h2 style={{ marginBottom: '1rem' }}>{t('about.contactTitle')}</h2>
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
          <div className="about-contact-image">
            <img src="https://images.unsplash.com/photo-1710093072218-0024b8391475?w=700&h=420&fit=crop" alt={t('about.contactTitle')} />
          </div>
        </div>
      </section>

      <div className="about-banner-image mb-lg" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        <img
          src="https://images.unsplash.com/photo-1774290490354-3c2fb95f8bf2?w=1200&h=300&fit=crop"
          alt={t('home.aboutDesc2')}
          style={{ width: '100%', height: 240, objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(225,29,72,0.6), rgba(26,26,46,0.5))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', padding: '0 1.5rem' }}>{t('home.aboutDesc2')}</p>
        </div>
      </div>

      <div className="card animate-fade-in-up delay-6">
        <div className="card-body text-center">
          <h2 style={{ marginBottom: '0.75rem' }}>{t('about.getStarted')}</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{t('about.getStartedDesc')}</p>
          <span className="wolaita-chip" style={{ margin: '0 auto 1.5rem' }}><span className="chip-dot"></span> {t('about.loTag')}</span>
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

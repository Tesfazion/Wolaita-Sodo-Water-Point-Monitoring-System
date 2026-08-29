import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Home, Map, Search, Info, Camera } from './Icons';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'am', label: 'አማ' },
  { code: 'wt', label: 'WT' }
];

const CitizenHeader = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
    setLangOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <header className={`citizen-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="citizen-header-inner">
        <Link to="/" className="citizen-logo">
          <div className="citizen-logo-icon">
            <img src="/images/wolaita-logo.png" alt="Wolaita Sodo Water-Point Monitoring System" />
          </div>
          <div className="citizen-logo-text">
            <span className="citizen-logo-title">{t('brand.title')}</span>
            <span className="citizen-logo-subtitle">{t('brand.subtitle')}</span>
          </div>
        </Link>

        <nav className="citizen-nav">
          <Link to="/" className={`citizen-nav-link ${isActive('/')}`}>{t('nav.home')}</Link>
          <Link to="/map" className={`citizen-nav-link ${isActive('/map')}`}>{t('nav.map')}</Link>
          <Link to="/track" className={`citizen-nav-link ${isActive('/track')}`}>{t('nav.track')}</Link>
          <Link to="/about" className={`citizen-nav-link ${isActive('/about')}`}>{t('nav.about')}</Link>

          <div className="lang-switcher">
            <button className="lang-btn" onClick={() => setLangOpen(!langOpen)} aria-label="Language">
              <Globe size={16} /> {currentLang.label}
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    className={`lang-option ${i18n.language === l.code ? 'active' : ''}`}
                    onClick={() => changeLang(l.code)}
                  >{t(`lang.${l.code}`)}</button>
                ))}
              </div>
            )}
          </div>

          <Link to="/report" className="citizen-nav-cta">{t('nav.reportIssue')}</Link>
        </nav>

        <button className={`hamburger ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label={t('nav.menu')}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={24} />
        </button>
        
        <div className="mobile-nav-header">
          <div className="citizen-logo-icon" style={{ width: 36, height: 36 }}>
            <img src="/images/wolaita-logo.png" alt="Wolaita Sodo Water-Point Monitoring System" />
          </div>
          <div className="mobile-nav-brand">
            {t('brand.title')}
            <span>{t('brand.subtitle')}</span>
          </div>
        </div>
        
        <Link to="/" className={`citizen-nav-link ${isActive('/')}`} onClick={() => setMobileOpen(false)}>
          <Home size={20} /> {t('nav.home')}
        </Link>
        <Link to="/map" className={`citizen-nav-link ${isActive('/map')}`} onClick={() => setMobileOpen(false)}>
          <Map size={20} /> {t('nav.map')}
        </Link>
        <Link to="/track" className={`citizen-nav-link ${isActive('/track')}`} onClick={() => setMobileOpen(false)}>
          <Search size={20} /> {t('nav.track')}
        </Link>
        <Link to="/about" className={`citizen-nav-link ${isActive('/about')}`} onClick={() => setMobileOpen(false)}>
          <Info size={20} /> {t('nav.about')}
        </Link>
        
        <div className="mobile-nav-divider" />
        
        <div className="mobile-lang-row">
          {LANGUAGES.map(l => (
            <button key={l.code} className={`mobile-lang-btn ${i18n.language === l.code ? 'active' : ''}`} onClick={() => { changeLang(l.code); }}>{l.label}</button>
          ))}
        </div>
        
        <Link to="/report" className="citizen-nav-cta" onClick={() => setMobileOpen(false)}>
          <Camera size={20} /> {t('nav.reportIssue')}
        </Link>
      </div>
    </header>
  );
};

export default CitizenHeader;

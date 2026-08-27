import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from './Icons';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="citizen-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>{t('brand.title')} {t('footer.brandDesc')}</h3>
        </div>
        <div className="footer-col">
          <h4>{t('footer.quickLinks')}</h4>
          <ul>
            <li><Link to="/">{t('footer.home')}</Link></li>
            <li><Link to="/map">{t('footer.waterPointsMap')}</Link></li>
            <li><Link to="/report">{t('footer.reportIssue')}</Link></li>
            <li><Link to="/track">{t('footer.trackReport')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('footer.resources')}</h4>
          <ul>
            <li><Link to="/about">{t('footer.aboutUs')}</Link></li>
            <li><Link to="/admin/login">{t('footer.adminLogin')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t('footer.contact')}</h4>
          <ul>
            <li><a href="tel:+251911123456"><Phone size={14} /> +251-911-123456</a></li>
            <li><a href="mailto:admin@sodowater.gov.et"><Mail size={14} /> admin@sodowater.gov.et</a></li>
            <li><span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}><MapPin size={14} /> {t('footer.address')}</span></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;

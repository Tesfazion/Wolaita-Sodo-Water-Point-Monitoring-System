import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader } from '@googlemaps/js-api-loader';
import { analyticsAPI } from '../../services/api';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { Droplet, CheckCircle, AlertTriangle, Wrench, FileText } from '../../components/common/Icons';

const MapPage = () => {
  const { t } = useTranslation();
  const [waterPoints, setWaterPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState('');
  const [filter, setFilter] = useState('all');
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    analyticsAPI.getMapData()
      .then(res => setWaterPoints(res.data.data))
      .catch(() => setMapError(t('map.loadError')))
      .finally(() => setLoading(false));
  }, [t]);

  const initMap = useCallback(async () => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        setMapError(t('map.loadError'));
        setLoading(false);
        return;
      }
      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['marker']
      });
      await loader.load();

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 6.85, lng: 37.75 },
        zoom: 11,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
      });
      googleMapRef.current = map;

      waterPoints.forEach(wp => {
        const colors = { working: '28A745', reported_broken: 'DC3545', under_repair: 'FFC107' };
        const color = colors[wp.current_status] || '6C757D';
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(wp.latitude), lng: parseFloat(wp.longitude) },
          map,
          title: wp.name,
          icon: { url: `https://ui-avatars.com/api/?name=WP&size=128&background=${color}&color=fff&rounded=true&bold=true&font-size=0.4`, scaledSize: new window.google.maps.Size(40, 40) },
          animation: window.google.maps.Animation.DROP
        });

        const statusColors = { working: '#28A745', reported_broken: '#DC3545', under_repair: '#FFC107' };
        const statusColor = statusColors[wp.current_status] || '#6C757D';
        const statusText = wp.current_status.replace('_', ' ').toUpperCase();

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding:12px;max-width:300px;font-family:Inter,sans-serif">
              <h3 style="margin:0 0 8px;color:#E11D48;font-size:15px;font-weight:700">${wp.name}</h3>
              <div style="margin-bottom:6px;font-size:13px;color:#475569"><strong>${t('map.infoType')}</strong> ${wp.type.replace('_', ' ')}</div>
              <div style="margin-bottom:6px;font-size:13px;color:#475569"><strong>${t('map.infoAddress')}</strong> ${wp.address || t('map.infoNA')}</div>
              <div style="margin-bottom:6px;font-size:13px;color:#475569"><strong>${t('map.infoStatus')}</strong>
                <span style="background:${statusColor};color:white;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;margin-left:5px">${statusText}</span>
              </div>
              ${wp.active_reports > 0 ? `<div style="margin-top:10px;padding:8px;background:#FEF3C7;border-radius:8px;font-size:12px;font-weight:600;color:#92400E">⚠ ${wp.active_reports} ${wp.active_reports > 1 ? t('map.activeReports') : t('map.activeReport')}</div>` : ''}
              <div style="margin-top:10px"><a href="/report" style="color:#E11D48;font-weight:600;font-size:13px;text-decoration:none">${t('map.reportProblemLink')}</a></div>
            </div>`
        });

        marker.addListener('click', () => {
          markersRef.current.forEach(m => m.infoWindow.close());
          infoWindow.open(map, marker);
        });
        markersRef.current.push({ marker, infoWindow, status: wp.current_status });
      });
    } catch (err) {
      setMapError(t('map.mapsError'));
    }
  }, [waterPoints, t]);

  const filterMarkers = useCallback(() => {
    markersRef.current.forEach(({ marker, status }) => {
      marker.setVisible(filter === 'all' || status === filter);
    });
  }, [filter]);

  useEffect(() => {
    if (waterPoints.length > 0 && !googleMapRef.current) initMap();
  }, [waterPoints, initMap]);

  useEffect(() => {
    if (googleMapRef.current) filterMarkers();
  }, [filter, filterMarkers]);

  const stats = {
    total: waterPoints.length,
    working: waterPoints.filter(wp => wp.current_status === 'working').length,
    broken: waterPoints.filter(wp => wp.current_status === 'reported_broken').length,
    repair: waterPoints.filter(wp => wp.current_status === 'under_repair').length
  };

  return (
    <div>
      <CitizenHeader />
      <main className="container page-content">
        <div className="page-hero-image animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
          <img
            src="https://images.unsplash.com/photo-1748442001865-5583ec02ae22?w=1200&h=350&fit=crop"
            alt={t('map.pageTitle')}
          />
          <div className="page-hero-overlay">
            <h1>{t('map.pageTitle')}</h1>
            <p>{t('map.pageDesc')}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-card-icon"><Droplet size={24} /></div>
            <div className="stat-card-value">{stats.total}</div>
            <div className="stat-card-label">{t('map.totalPoints')}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-card-icon"><CheckCircle size={24} /></div>
            <div className="stat-card-value">{stats.working}</div>
            <div className="stat-card-label">{t('map.working')}</div>
          </div>
          <div className="stat-card red">
            <div className="stat-card-icon"><AlertTriangle size={24} /></div>
            <div className="stat-card-value">{stats.broken}</div>
            <div className="stat-card-label">{t('map.needRepair')}</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-card-icon"><Wrench size={24} /></div>
            <div className="stat-card-value">{stats.repair}</div>
            <div className="stat-card-label">{t('map.inProgress')}</div>
          </div>
        </div>

        <div className="filter-bar">
          {[
            { key: 'all', label: `${t('map.filterAll')} (${stats.total})` },
            { key: 'working', label: `${t('map.filterWorking')} (${stats.working})` },
            { key: 'reported_broken', label: `${t('map.filterBroken')} (${stats.broken})` },
            { key: 'under_repair', label: `${t('map.filterRepairing')} (${stats.repair})` }
          ].map(f => (
            <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ height: 'min(550px, 60vh)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', background: 'white' }}>
          {loading ? (
            <div className="loading-center"><div className="spinner-lg spinner"></div><p>{t('map.loading')}</p></div>
          ) : mapError ? (
            <div className="loading-center"><div className="alert alert-error" style={{ maxWidth: 400 }}>{mapError}</div></div>
          ) : (
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          )}
        </div>

        <div className="card mb-lg animate-fade-in-up">
          <div className="card-body map-info-split">
            <div className="map-legend">
              <h3>{t('map.legendTitle')}</h3>
              <div className="legend-items">
                <div className="legend-item"><div className="legend-dot" style={{ background: '#28A745' }}></div> {t('map.legendWorking')}</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: '#DC3545' }}></div> {t('map.legendBroken')}</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: '#F9826C' }}></div> {t('map.legendRepairing')}</div>
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {t('map.mapTip')}
              </p>
            </div>
            <div className="map-context">
              <img
                src="https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=600&h=320&fit=crop"
                alt={t('map.pageTitle')}
              />
              <div>
                <h3>{stats.total} {t('map.totalPoints')}</h3>
                <p>{t('map.pageDesc')}</p>
                <div className="map-context-stats">
                  <span className="chip green">{stats.working} {t('map.working')}</span>
                  <span className="chip red">{stats.broken} {t('map.needRepair')}</span>
                  <span className="chip orange">{stats.repair} {t('map.inProgress')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="map-gallery card animate-fade-in-up">
          <div className="card-body">
            <h3 className="map-gallery-title">{t('map.galleryTitle')}</h3>
            <div className="map-gallery-grid">
              <div className="map-gallery-item">
                <img src="https://images.unsplash.com/photo-1720175626735-193ff59ebd90?w=600&h=400&fit=crop" alt={t('map.galleryTag')} />
              </div>
              <div className="map-gallery-item">
                <img src="https://images.unsplash.com/photo-1774290490354-3c2fb95f8bf2?w=600&h=400&fit=crop" alt={t('map.galleryTag2')} />
              </div>
              <div className="map-gallery-item">
                <img src="https://images.unsplash.com/photo-1696853961331-22ed783d24cd?w=600&h=400&fit=crop" alt={t('map.galleryTag3')} />
              </div>
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '0.875rem' }}>
              {t('home.reportAProblemDesc')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <Link to="/report" className="fab"><FileText size={18} /> {t('map.reportIssueFab')}</Link>
    </div>
  );
};

export default MapPage;

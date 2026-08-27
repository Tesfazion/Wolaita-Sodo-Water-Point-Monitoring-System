import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import { FileText, CheckCircle, Clock, Droplet, TrendingUp, Zap, Target, AlertTriangle } from '../../components/common/Icons';
import { useTranslation } from 'react-i18next';

const AdminAnalytics = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getDashboard()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="admin-page-header animate-fade-in-up">
        <h1>{t('admin.analyticsTitle')}</h1>
        <p>{t('admin.analyticsDesc')}</p>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner-lg spinner"></div></div>
      ) : stats ? (
        <>
          <div className="stats-grid animate-fade-in-up delay-1">
            <div className="stat-card blue">
              <div className="stat-card-icon"><FileText size={24} /></div>
              <div className="stat-card-value">{(stats.reports?.new_reports || 0) + (stats.reports?.in_progress || 0)}</div>
              <div className="stat-card-label">{t('admin.totalActiveReports')}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-card-icon"><CheckCircle size={24} /></div>
              <div className="stat-card-value">
                {stats.water_points?.working ? Math.round((stats.water_points.working / (stats.water_points.working + (stats.reports?.new_reports || 0))) * 100) : 0}%
              </div>
              <div className="stat-card-label">{t('admin.workingRatio')}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-card-icon"><Clock size={24} /></div>
              <div className="stat-card-value">{stats.avg_resolution_time_hours || 0}h</div>
              <div className="stat-card-label">{t('admin.avgResponseTime')}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-card-icon"><Droplet size={24} /></div>
              <div className="stat-card-value">{stats.water_points?.working || 0}</div>
              <div className="stat-card-label">{t('admin.operationalPoints')}</div>
            </div>
          </div>

              <div className="analytics-chart-grid">
            <div className="card animate-fade-in-up delay-2">
              <div className="card-header"><h3>{t('admin.reportBreakdown')}</h3></div>
              <div className="card-body">
                {[
                  { label: t('admin.newReports'), value: stats.reports?.new_reports || 0, color: 'var(--primary)' },
                  { label: t('admin.inProgress'), value: stats.reports?.in_progress || 0, color: 'var(--warning)' }
                ].map(item => (
                  <div key={item.label} style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                    <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(item.value / ((stats.reports?.new_reports || 0) + (stats.reports?.in_progress || 0) + 1)) * 100}%`, background: item.color, borderRadius: 4, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                ))}
                <div style={{ padding: '0.875rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t('admin.totalActiveReports')}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{(stats.reports?.new_reports || 0) + (stats.reports?.in_progress || 0)}</div>
                </div>
              </div>
            </div>

            <div className="card animate-fade-in-up delay-3">
              <div className="card-header"><h3>{t('admin.infrastructureHealth')}</h3></div>
              <div className="card-body">
                {[
                  { label: t('admin.workingPointsLabel'), value: stats.water_points?.working || 0, color: 'var(--success)', bg: 'var(--success-light)', icon: <CheckCircle size={24} /> },
                  { label: t('admin.needAttention'), value: stats.reports?.new_reports || 0, color: 'var(--danger)', bg: 'var(--danger-light)', icon: <AlertTriangle size={24} /> },
                  { label: t('admin.inProgress'), value: stats.reports?.in_progress || 0, color: 'var(--warning)', bg: 'var(--warning-light)', icon: <Clock size={24} /> }
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem', background: item.bg, borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: item.color }}>{item.value}</div>
                    </div>
                    <span style={{ color: item.color }}>{item.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card animate-fade-in-up delay-4">
            <div className="card-header"><h3>{t('admin.systemInsights')}</h3></div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={16} /> {t('admin.performance')}</div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{t('admin.avgResolutionTime')}{stats.avg_resolution_time_hours || 0}{t('admin.hours')}</p>
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Target size={16} /> {t('admin.recommendation')}</div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
                    {stats.reports?.new_reports > 5 ? t('admin.highVolume') : t('admin.lowVolume')}
                  </p>
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={16} /> {t('admin.currentFocus')}</div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>
                    {stats.reports?.in_progress > 0 ? `${stats.reports.in_progress} ${stats.reports.in_progress > 1 ? t('admin.repairsInProgress') : t('admin.repairInProgress')}` : t('admin.allClear')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="alert alert-error">{t('admin.analyticsError')}</div>
      )}
    </AdminLayout>
  );
};

export default AdminAnalytics;

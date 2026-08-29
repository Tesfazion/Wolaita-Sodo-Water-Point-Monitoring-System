import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import AsyncState from '../../components/common/AsyncState';
import { CheckCircle, AlertTriangle, Wrench, Clock, ArrowRight } from '../../components/common/Icons';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '../../utils/apiError';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await analyticsAPI.getDashboard();
      setStats(res.data.data);
    } catch (e) {
      setError(getErrorMessage(e, t('admin.dashboardError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <AdminLayout>
      <div className="admin-page-header animate-fade-in-up">
        <h1>{t('admin.dashboardTitle')}</h1>
        <p>{t('admin.welcomeBack')}{user?.name}{t('admin.welcomeDesc')}</p>
      </div>

      <AsyncState loading={loading} error={error} onRetry={fetchStats}>
        {stats && (
        <>
          <div className="stats-grid animate-fade-in-up delay-1">
            <div className="stat-card green">
              <div className="stat-card-icon"><CheckCircle size={24} /></div>
              <div className="stat-card-value">{stats.water_points?.working || 0}</div>
              <div className="stat-card-label">{t('admin.workingPoints')}</div>
            </div>
            <div className="stat-card red">
              <div className="stat-card-icon"><AlertTriangle size={24} /></div>
              <div className="stat-card-value">{stats.reports?.new_reports || 0}</div>
              <div className="stat-card-label">{t('admin.newReports')}</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-card-icon"><Wrench size={24} /></div>
              <div className="stat-card-value">{stats.reports?.in_progress || 0}</div>
              <div className="stat-card-label">{t('admin.inProgress')}</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-card-icon"><Clock size={24} /></div>
              <div className="stat-card-value">{stats.avg_resolution_time_hours || 0}h</div>
              <div className="stat-card-label">{t('admin.avgResolution')}</div>
            </div>
          </div>

          <div className="card animate-fade-in-up delay-2" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-header">
              <h3>{t('admin.recentReports')}</h3>
              <Link to="/admin/reports" className="btn btn-ghost btn-sm">{t('admin.viewAll')} <ArrowRight size={14} /></Link>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.tableId')}</th><th>{t('admin.tableWaterPoint')}</th><th>{t('admin.tableFault')}</th><th>{t('admin.tableStatus')}</th><th>{t('admin.tablePriority')}</th><th>{t('admin.tableDate')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_activity && stats.recent_activity.length > 0 ? (
                    stats.recent_activity.map(r => (
                      <tr key={r.id}>
                        <td><strong style={{ color: 'var(--primary)' }}>#{r.id}</strong></td>
                        <td style={{ fontWeight: 500 }}>{r.water_point_name}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{r.fault_type.replace('_', ' ')}</td>
                        <td><span className={`badge ${r.status === 'resolved' ? 'badge-green' : r.status === 'in_progress' ? 'badge-orange' : 'badge-blue'}`}>{r.status.replace('_', ' ')}</span></td>
                        <td><span className={`badge ${r.priority === 'urgent' ? 'badge-red' : r.priority === 'high' ? 'badge-orange' : 'badge-gray'}`}>{r.priority}</span></td>
                        <td style={{ color: 'var(--text-secondary)' }}>{new Date(r.reported_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>{t('admin.noReports')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
        )}
      </AsyncState>
    </AdminLayout>
  );
};

export default AdminDashboard;

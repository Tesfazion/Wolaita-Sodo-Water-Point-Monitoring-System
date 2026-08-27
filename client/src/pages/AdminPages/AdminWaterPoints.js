import React, { useState, useEffect } from 'react';
import { waterPointsAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import { Droplet, CheckCircle, AlertTriangle, Wrench, Inbox } from '../../components/common/Icons';
import { useTranslation } from 'react-i18next';

const AdminWaterPoints = () => {
  const { t } = useTranslation();
  const [waterPoints, setWaterPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchWaterPoints(); }, []);

  const fetchWaterPoints = async () => {
    try { const res = await waterPointsAPI.getAll(); setWaterPoints(res.data.data || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const statusColor = (s) => ({ working: 'badge-green', reported_broken: 'badge-red', under_repair: 'badge-orange' }[s] || 'badge-gray');

  const filtered = waterPoints.filter(wp => filter === 'all' || wp.current_status === filter);
  const stats = {
    total: waterPoints.length,
    working: waterPoints.filter(wp => wp.current_status === 'working').length,
    broken: waterPoints.filter(wp => wp.current_status === 'reported_broken').length,
    repair: waterPoints.filter(wp => wp.current_status === 'under_repair').length
  };

  return (
    <AdminLayout>
      <div className="admin-page-header animate-fade-in-up">
        <h1>{t('admin.waterPointsTitle')}</h1>
        <p>{t('admin.waterPointsDesc')}</p>
      </div>

      <div className="stats-grid animate-fade-in-up delay-1">
        <div className="stat-card blue">
          <div className="stat-card-icon"><Droplet size={24} /></div>
          <div className="stat-card-value">{stats.total}</div>
          <div className="stat-card-label">{t('admin.totalPoints')}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-card-icon"><CheckCircle size={24} /></div>
          <div className="stat-card-value">{stats.working}</div>
          <div className="stat-card-label">{t('admin.working')}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-card-icon"><AlertTriangle size={24} /></div>
          <div className="stat-card-value">{stats.broken}</div>
          <div className="stat-card-label">{t('admin.needRepair')}</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-card-icon"><Wrench size={24} /></div>
          <div className="stat-card-value">{stats.repair}</div>
          <div className="stat-card-label">{t('admin.underRepair')}</div>
        </div>
      </div>

      <div className="filter-bar">
        {[
          { key: 'all', label: `${t('admin.filterAll')} (${stats.total})` },
          { key: 'working', label: `${t('admin.working')} (${stats.working})` },
          { key: 'reported_broken', label: `${t('admin.filterBroken')} (${stats.broken})` },
          { key: 'under_repair', label: `${t('admin.filterRepairing')} (${stats.repair})` }
        ].map(f => (
          <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner-lg spinner"></div></div>
      ) : filtered.length === 0 ? (
        <div className="card"><div className="card-body empty-state"><div className="empty-state-icon"><Inbox size={48} /></div><h3>{t('admin.noWaterPoints')}</h3></div></div>
      ) : (
        <div className="table-wrap animate-fade-in-up delay-2">
          <div className="table-scroll">
            <table style={{ minWidth: 800 }}>
              <thead>
                <tr>
                  <th>{t('admin.tableId')}</th><th>{t('admin.tableName')}</th><th>{t('admin.tableType')}</th><th>{t('admin.tableLocation')}</th><th>{t('admin.tableStatus')}</th><th>{t('admin.tableReports')}</th><th>{t('admin.tableCoordinates')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(wp => (
                  <tr key={wp.id}>
                    <td><strong style={{ color: 'var(--primary)' }}>#{wp.id}</strong></td>
                    <td style={{ fontWeight: 500 }}>{wp.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{wp.type.replace('_', ' ')}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{wp.address}</td>
                    <td><span className={`badge ${statusColor(wp.current_status)}`}>{wp.current_status.replace('_', ' ')}</span></td>
                    <td style={{ fontWeight: 600, textAlign: 'center' }}>{wp.active_reports || 0}</td>
                    <td className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{wp.latitude.toFixed(4)}, {wp.longitude.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWaterPoints;

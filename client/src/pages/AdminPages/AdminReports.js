import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI, reportsAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import { Inbox } from '../../components/common/Icons';
import { useTranslation } from 'react-i18next';

const AdminReports = () => {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [update, setUpdate] = useState({ status: '', notes: '', assigned_technician_id: '' });
  const [filter, setFilter] = useState('all');

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await adminAPI.getReports(params);
      setReports(res.data.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [filter]);

  const fetchTechnicians = useCallback(async () => {
    try { const res = await adminAPI.getTechnicians(); setTechnicians(res.data.data); } catch (e) {}
  }, []);

  useEffect(() => { fetchReports(); fetchTechnicians(); }, [fetchReports, fetchTechnicians]);
  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await reportsAPI.updateStatus(selected.id, update);
      alert(t('admin.reportUpdated'));
      setSelected(null); fetchReports();
    } catch (err) { alert(t('admin.errorPrefix') + (err.response?.data?.message || t('admin.errorDefault'))); }
  };

  const openModal = (r) => {
    setSelected(r);
    setUpdate({ status: r.status, notes: '', assigned_technician_id: r.assigned_technician_id || '' });
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="admin-page-header animate-fade-in-up" style={{ marginBottom: 0 }}>
          <h1>{t('admin.manageReports')}</h1>
          <p>{t('admin.manageReportsDesc')}</p>
        </div>
      </div>

      <div className="filter-bar">
        {[
          { key: 'all', label: t('admin.filterAll') },
          { key: 'reported', label: t('admin.filterNew') },
          { key: 'in_progress', label: t('admin.filterInProgress') },
          { key: 'resolved', label: t('admin.filterResolved') }
        ].map(f => (
          <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner-lg spinner"></div></div>
      ) : reports.length === 0 ? (
        <div className="card"><div className="card-body empty-state"><div className="empty-state-icon"><Inbox size={48} /></div><h3>{t('admin.noReportsFound')}</h3><p>{t('admin.noReportsMatch')}</p></div></div>
      ) : (
        <div className="table-wrap animate-fade-in-up delay-2">
          <div className="table-scroll">
            <table style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th>{t('admin.tableId')}</th><th>{t('admin.tableWaterPoint')}</th><th>{t('admin.tableFault')}</th><th>{t('admin.tablePriority')}</th><th>{t('admin.tableStatus')}</th><th>{t('admin.tableReporter')}</th><th>{t('admin.tableDate')}</th><th>{t('admin.tableAge')}</th><th>{t('admin.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(r => (
                  <tr key={r.id}>
                    <td><strong style={{ color: 'var(--primary)' }}>#{r.id}</strong></td>
                    <td style={{ fontWeight: 500 }}>{r.water_point_name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.fault_type.replace('_', ' ')}</td>
                    <td><span className={`badge ${r.priority === 'urgent' ? 'badge-red' : r.priority === 'high' ? 'badge-orange' : 'badge-gray'}`}>{r.priority}</span></td>
                    <td><span className={`badge ${r.status === 'resolved' ? 'badge-green' : r.status === 'in_progress' ? 'badge-orange' : 'badge-blue'}`}>{r.status.replace('_', ' ')}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.reporter_name || t('admin.anonymous')}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(r.reported_at).toLocaleDateString()}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{Math.floor(r.hours_since_report || 0)}h</td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => openModal(r)}>{t('admin.updateBtn')}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('admin.updateReportPrefix')}{selected.id}</h2>
            </div>
            <div className="modal-body">
              <div style={{ padding: '0.875rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <strong>{selected.water_point_name}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{selected.fault_type.replace('_', ' ')} — {selected.description}</div>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label">{t('admin.statusLabel')} *</label>
                  <select className="form-select" value={update.status} onChange={e => setUpdate({ ...update, status: e.target.value })} required>
                    <option value="">{t('admin.selectStatus')}</option>
                    <option value="reported">{t('admin.statusReported')}</option>
                    <option value="acknowledged">{t('admin.statusAcknowledged')}</option>
                    <option value="in_progress">{t('admin.statusInProgress')}</option>
                    <option value="resolved">{t('admin.statusResolved')}</option>
                    <option value="closed">{t('admin.statusClosed')}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.assignTech')}</label>
                  <select className="form-select" value={update.assigned_technician_id} onChange={e => setUpdate({ ...update, assigned_technician_id: e.target.value })}>
                    <option value="">{t('admin.noAssignment')}</option>
                    {technicians.map(t => <option key={t.id} value={t.id}>{t.name} — {t.phone}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('admin.notes')}</label>
                  <textarea className="form-textarea" rows="3" placeholder={t('admin.notesPlaceholder')} value={update.notes} onChange={e => setUpdate({ ...update, notes: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{t('admin.updateStatus')}</button>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSelected(null)}>{t('admin.cancel')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReports;

import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI, reportsAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import { Inbox } from '../../components/common/Icons';

const AdminReports = () => {
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
      alert('Report updated!');
      setSelected(null); fetchReports();
    } catch (err) { alert('Failed: ' + (err.response?.data?.message || 'Error')); }
  };

  const openModal = (r) => {
    setSelected(r);
    setUpdate({ status: r.status, notes: '', assigned_technician_id: r.assigned_technician_id || '' });
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="admin-page-header animate-fade-in-up" style={{ marginBottom: 0 }}>
          <h1>Manage Reports</h1>
          <p>Review and update water point issue reports</p>
        </div>
      </div>

      <div className="filter-bar">
        {[
          { key: 'all', label: 'All' },
          { key: 'reported', label: 'New' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'resolved', label: 'Resolved' }
        ].map(f => (
          <button key={f.key} className={`filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner-lg spinner"></div></div>
      ) : reports.length === 0 ? (
        <div className="card"><div className="card-body empty-state"><div className="empty-state-icon"><Inbox size={48} /></div><h3>No reports found</h3><p>No reports match your filter.</p></div></div>
      ) : (
        <div className="table-wrap animate-fade-in-up delay-2">
          <div className="table-scroll">
            <table style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th>ID</th><th>Water Point</th><th>Fault</th><th>Priority</th><th>Status</th><th>Reporter</th><th>Date</th><th>Age</th><th>Actions</th>
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
                    <td style={{ color: 'var(--text-secondary)' }}>{r.reporter_name || 'Anonymous'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(r.reported_at).toLocaleDateString()}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{Math.floor(r.hours_since_report || 0)}h</td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => openModal(r)}>Update</button></td>
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
              <h2>Update Report #{selected.id}</h2>
            </div>
            <div className="modal-body">
              <div style={{ padding: '0.875rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <strong>{selected.water_point_name}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{selected.fault_type.replace('_', ' ')} — {selected.description}</div>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select className="form-select" value={update.status} onChange={e => setUpdate({ ...update, status: e.target.value })} required>
                    <option value="">Select Status</option>
                    <option value="reported">Reported</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign Technician</label>
                  <select className="form-select" value={update.assigned_technician_id} onChange={e => setUpdate({ ...update, assigned_technician_id: e.target.value })}>
                    <option value="">No Assignment</option>
                    {technicians.map(t => <option key={t.id} value={t.id}>{t.name} — {t.phone}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" rows="3" placeholder="Add notes..." value={update.notes} onChange={e => setUpdate({ ...update, notes: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Update Status</button>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSelected(null)}>Cancel</button>
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

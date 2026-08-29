import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI, reportsAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import AsyncState from '../../components/common/AsyncState';
import { Inbox, MapPin } from '../../components/common/Icons';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/apiError';

const AdminTasks = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [update, setUpdate] = useState({ status: '', notes: '' });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getMyTasks();
      setTasks(res.data.data);
    } catch (e) {
      setError(getErrorMessage(e, t('admin.myTasksError')));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await reportsAPI.updateStatus(selected.id, update);
      toast.success(t('admin.reportUpdated'));
      setSelected(null);
      fetchTasks();
    } catch (err) {
      toast.error(getErrorMessage(err, t('admin.errorDefault')));
    }
  };

  const openModal = (task) => {
    setSelected(task);
    setUpdate({ status: task.status, notes: '' });
  };

  const statusClass = (s) => ({
    reported: 'badge-blue',
    acknowledged: 'badge-blue',
    in_progress: 'badge-orange',
    resolved: 'badge-green',
    closed: 'badge-gray'
  }[s] || 'badge-gray');

  const priorityClass = (p) => ({
    urgent: 'badge-red',
    high: 'badge-orange',
    normal: 'badge-gray'
  }[p] || 'badge-gray');

  return (
    <AdminLayout>
      <div className="admin-page-header animate-fade-in-up">
        <h1>{t('admin.myTasks')}</h1>
        <p>{t('admin.myTasksDesc')}</p>
      </div>

      <AsyncState
        loading={loading}
        error={error}
        onRetry={fetchTasks}
        empty={tasks.length === 0 ? t('admin.noTasks') : null}
        emptyIcon={<Inbox size={48} />}
      >
        <div className="table-wrap animate-fade-in-up delay-2">
          <div className="table-scroll">
            <table style={{ minWidth: 900 }}>
              <thead>
                <tr>
                  <th>{t('admin.tableId')}</th>
                  <th>{t('admin.tableWaterPoint')}</th>
                  <th>{t('admin.tableFault')}</th>
                  <th>{t('admin.tablePriority')}</th>
                  <th>{t('admin.tableStatus')}</th>
                  <th>{t('admin.tableLocation')}</th>
                  <th>{t('admin.tableAge')}</th>
                  <th>{t('admin.tableActions')}</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td><strong style={{ color: 'var(--primary)' }}>#{task.id}</strong></td>
                    <td style={{ fontWeight: 500 }}>{task.water_point_name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{String(task.fault_type || '').replace('_', ' ')}</td>
                    <td><span className={`badge ${priorityClass(task.priority)}`}>{task.priority}</span></td>
                    <td><span className={`badge ${statusClass(task.status)}`}>{String(task.status || '').replace('_', ' ')}</span></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                      <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {task.address || `${Number(task.latitude).toFixed(4)}, ${Number(task.longitude).toFixed(4)}`}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{Math.floor(task.hours_since_report || 0)}h</td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => openModal(task)}>{t('admin.updateBtn')}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AsyncState>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('admin.updateReportPrefix')}{selected.id}</h2>
            </div>
            <div className="modal-body">
              <div style={{ padding: '0.875rem', background: 'var(--bg)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <strong>{selected.water_point_name}</strong>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {String(selected.fault_type || '').replace('_', ' ')} — {selected.description}
                </div>
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

export default AdminTasks;

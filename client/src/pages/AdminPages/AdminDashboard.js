import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { analyticsAPI } from '../../services/api';
import AdminLayout from '../../components/common/AdminLayout';
import { CheckCircle, AlertTriangle, Wrench, Clock, ArrowRight } from '../../components/common/Icons';

const AdminDashboard = () => {
  const { user } = useAuth();
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
        <h1>Dashboard Overview</h1>
        <p>Welcome back, {user?.name}. Here's what's happening with water infrastructure today.</p>
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner-lg spinner"></div></div>
      ) : stats ? (
        <>
          <div className="stats-grid animate-fade-in-up delay-1">
            <div className="stat-card green">
              <div className="stat-card-icon"><CheckCircle size={24} /></div>
              <div className="stat-card-value">{stats.water_points?.working || 0}</div>
              <div className="stat-card-label">Working Water Points</div>
            </div>
            <div className="stat-card red">
              <div className="stat-card-icon"><AlertTriangle size={24} /></div>
              <div className="stat-card-value">{stats.reports?.new_reports || 0}</div>
              <div className="stat-card-label">New Reports</div>
            </div>
            <div className="stat-card orange">
              <div className="stat-card-icon"><Wrench size={24} /></div>
              <div className="stat-card-value">{stats.reports?.in_progress || 0}</div>
              <div className="stat-card-label">In Progress</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-card-icon"><Clock size={24} /></div>
              <div className="stat-card-value">{stats.avg_resolution_time_hours || 0}h</div>
              <div className="stat-card-label">Avg Resolution Time</div>
            </div>
          </div>

          <div className="card animate-fade-in-up delay-2" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-header">
              <h3>Recent Reports</h3>
              <Link to="/admin/reports" className="btn btn-ghost btn-sm">View All <ArrowRight size={14} /></Link>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>ID</th><th>Water Point</th><th>Fault</th><th>Status</th><th>Priority</th><th>Date</th>
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
                    <tr><td colSpan="6" className="text-center" style={{ padding: '2rem', color: 'var(--text-muted)' }}>No recent reports</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="alert alert-error">Failed to load dashboard data. Please refresh.</div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { reportsAPI } from '../../services/api';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { Search, Phone, FileText, CheckCircle, Settings, Shield } from '../../components/common/Icons';

const TrackReportPage = () => {
  const { id } = useParams();
  const [reportId, setReportId] = useState(id || '');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (id) fetchReport(id); }, [id]);

  const fetchReport = async (trackingId) => {
    setLoading(true); setError(''); setReport(null);
    try {
      const res = await reportsAPI.trackReport(trackingId);
      setReport(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Report not found. Please check the tracking number.');
    } finally { setLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reportId.trim()) fetchReport(reportId.trim());
  };

  const statusConfig = {
    reported: { color: 'var(--primary)', icon: <FileText size={28} />, label: 'Reported', msg: 'Your report has been received and is awaiting review.' },
    acknowledged: { color: '#7C3AED', icon: <Shield size={28} />, label: 'Acknowledged', msg: 'The WASH office has acknowledged your report.' },
    in_progress: { color: 'var(--warning)', icon: <Settings size={28} />, label: 'In Progress', msg: 'Technicians are working on fixing this water point.' },
    resolved: { color: 'var(--success)', icon: <CheckCircle size={28} />, label: 'Resolved', msg: 'The water point has been repaired and is now functional.' },
    closed: { color: 'var(--text-muted)', icon: <Shield size={28} />, label: 'Closed', msg: 'This report has been closed.' }
  };

  const getStatus = (s) => statusConfig[s] || statusConfig.reported;
  const priorityColors = { urgent: 'badge-red', high: 'badge-orange', normal: 'badge-gray', low: 'badge-gray' };

  const allStatuses = ['reported', 'acknowledged', 'in_progress', 'resolved'];

  return (
    <div>
      <CitizenHeader />
      <main className="container-narrow page-content">
        <div className="page-hero-image animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <img
            src="https://images.unsplash.com/photo-1468421870903-4df1664ac249?w=1200&h=350&fit=crop"
            alt="Track your water point report"
          />
          <div className="page-hero-overlay">
            <h1>Track Your Report</h1>
            <p>Enter your tracking number to check the status</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="card animate-fade-in-up delay-2" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', padding: '1.25rem 1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Tracking Number</label>
                <input type="text" className="form-input" placeholder="e.g. RPT-001" value={reportId} onChange={(e) => setReportId(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner"></span> Searching...</> : <><Search size={18} /> Track</>}
              </button>
            </div>
          </div>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {report && (
          <div className="card">
            <div className="card-body">
              {(() => {
                const s = getStatus(report.status);
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                      <span style={{ color: s.color }}>{s.icon}</span>
                      <div>
                        <h2 style={{ margin: 0 }}>Report #{report.id}</h2>
                        <div style={{ color: s.color, fontWeight: 600, fontSize: '1.0625rem' }}>Status: {s.label}</div>
                      </div>
                    </div>
                    <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>{s.msg}</div>

                    {/* Progress Steps */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                      {allStatuses.map((st, i) => {
                        const currentIdx = allStatuses.indexOf(report.status);
                        const isDone = i <= currentIdx;
                        return (
                          <div key={st} style={{
                            flex: 1, minWidth: 120, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                            background: isDone ? 'var(--primary)' : 'var(--border-light)',
                            color: isDone ? 'white' : 'var(--text-muted)',
                            textAlign: 'center', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'capitalize'
                          }}>
                            {st.replace('_', ' ')}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem' }}>Water Point</div>
                        <div style={{ fontWeight: 600 }}>{report.water_point_name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{report.water_point_address}</div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem' }}>Problem Type</div>
                        <div style={{ fontWeight: 600 }}>{report.fault_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem' }}>Priority</div>
                        <span className={`badge ${priorityColors[report.priority] || 'badge-gray'}`}>{report.priority}</span>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem' }}>Reported On</div>
                        <div>{new Date(report.reported_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                    </div>

                    {report.description && (
                      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <div className="form-label" style={{ marginBottom: '0.375rem' }}>Description</div>
                        <p style={{ margin: 0, lineHeight: 1.7 }}>{report.description}</p>
                      </div>
                    )}

                    {report.technician_name && (
                      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <div className="form-label" style={{ marginBottom: '0.375rem' }}>Assigned Technician</div>
                        <div style={{ fontWeight: 600 }}>{report.technician_name}</div>
                        {report.technician_phone && <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Phone: {report.technician_phone}</div>}
                      </div>
                    )}

                    {report.photo_url && (
                      <div style={{ marginTop: '1.5rem' }}>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>Reported Problem Photo</div>
                        <img src={report.photo_url} alt="Issue" style={{ width: '100%', maxWidth: 500, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <div className="card mt-xl">
          <div className="card-body text-center">
            <h3 style={{ marginBottom: '0.5rem' }}>Need Help?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>Contact the Wolaita Zone Water Office for assistance.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+251911123456" className="btn btn-outline"><Phone size={16} /> Call Office</a>
              <Link to="/report" className="btn btn-primary"><FileText size={16} /> Submit New Report</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackReportPage;

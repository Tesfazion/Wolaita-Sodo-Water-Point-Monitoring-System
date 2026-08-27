import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reportsAPI } from '../../services/api';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { Search, Phone, FileText, CheckCircle, Settings, Shield } from '../../components/common/Icons';

const TrackReportPage = () => {
  const { t } = useTranslation();
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
      setError(err.response?.data?.message || t('track.notFound'));
    } finally { setLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reportId.trim()) fetchReport(reportId.trim());
  };

  const statusConfig = {
    reported: { color: 'var(--primary)', icon: <FileText size={28} />, label: t('track.statusReported'), msg: t('track.statusReportedDesc') },
    acknowledged: { color: '#7C3AED', icon: <Shield size={28} />, label: t('track.statusAcknowledged'), msg: t('track.statusAcknowledgedDesc') },
    in_progress: { color: 'var(--warning)', icon: <Settings size={28} />, label: t('track.statusInProgress'), msg: t('track.statusInProgressDesc') },
    resolved: { color: 'var(--success)', icon: <CheckCircle size={28} />, label: t('track.statusResolved'), msg: t('track.statusResolvedDesc') },
    closed: { color: 'var(--text-muted)', icon: <Shield size={28} />, label: t('track.statusClosed'), msg: t('track.statusClosedDesc') }
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
            alt="Track water point repair progress"
          />
          <div className="page-hero-overlay">
            <h1>{t('track.pageTitle')}</h1>
            <p>{t('track.pageDesc')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="card animate-fade-in-up delay-2" style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', padding: '1.25rem 1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">{t('track.trackingNumber')}</label>
                <input type="text" className="form-input" placeholder={t('track.trackingPlaceholder')} value={reportId} onChange={(e) => setReportId(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner"></span> {t('track.searching')}</> : <><Search size={18} /> {t('track.trackBtn')}</>}
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
                        <h2 style={{ margin: 0 }}>{t('track.reportPrefix')}{report.id}</h2>
                        <div style={{ color: s.color, fontWeight: 600, fontSize: '1.0625rem' }}>{t('track.statusLabel')} {s.label}</div>
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
                        <div className="form-label" style={{ marginBottom: '0.25rem' }}>{t('track.waterPoint')}</div>
                        <div style={{ fontWeight: 600 }}>{report.water_point_name}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{report.water_point_address}</div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem' }}>{t('track.problemType')}</div>
                        <div style={{ fontWeight: 600 }}>{report.fault_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem' }}>{t('track.priority')}</div>
                        <span className={`badge ${priorityColors[report.priority] || 'badge-gray'}`}>{report.priority}</span>
                      </div>
                      <div>
                        <div className="form-label" style={{ marginBottom: '0.25rem' }}>{t('track.reportedOn')}</div>
                        <div>{new Date(report.reported_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                      </div>
                    </div>

                    {report.description && (
                      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <div className="form-label" style={{ marginBottom: '0.375rem' }}>{t('track.description')}</div>
                        <p style={{ margin: 0, lineHeight: 1.7 }}>{report.description}</p>
                      </div>
                    )}

                    {report.technician_name && (
                      <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                        <div className="form-label" style={{ marginBottom: '0.375rem' }}>{t('track.assignedTech')}</div>
                        <div style={{ fontWeight: 600 }}>{report.technician_name}</div>
                        {report.technician_phone && <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('track.phone')} {report.technician_phone}</div>}
                      </div>
                    )}

                    {report.photo_url && (
                      <div style={{ marginTop: '1.5rem' }}>
                        <div className="form-label" style={{ marginBottom: '0.5rem' }}>{t('track.photoLabel')}</div>
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
            <h3 style={{ marginBottom: '0.5rem' }}>{t('track.needHelp')}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{t('track.needHelpDesc')}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="tel:+251911123456" className="btn btn-outline"><Phone size={16} /> {t('track.callOffice')}</a>
              <Link to="/report" className="btn btn-primary"><FileText size={16} /> {t('track.submitNew')}</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TrackReportPage;

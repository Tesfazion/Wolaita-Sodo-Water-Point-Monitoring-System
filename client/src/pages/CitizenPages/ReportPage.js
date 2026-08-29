import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { waterPointsAPI, reportsAPI } from '../../services/api';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/apiError';
import { Camera, Upload } from '../../components/common/Icons';

const ReportPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [waterPoints, setWaterPoints] = useState([]);
  const [formData, setFormData] = useState({
    water_point_id: '', reporter_name: '', reporter_phone: '',
    fault_type: '', description: '', priority: 'normal'
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    waterPointsAPI.getAll()
      .then(res => setWaterPoints(res.data.data))
      .catch((e) => toast.error(getErrorMessage(e, t('report.loadWaterPointsError'))));
  }, [toast, t]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) { setPhoto(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach(k => fd.append(k, formData[k]));
      if (photo) fd.append('photo', photo);
      const res = await reportsAPI.submit(fd);
      setSuccess(`${t('report.successPrefix')}${res.data.data.report_id}`);
      setTimeout(() => navigate(`/track/${res.data.data.report_id}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('report.errorDefault'));
      setLoading(false);
    }
  };

  return (
    <div>
      <CitizenHeader />
      <main className="container-narrow page-content">
        <div className="page-hero-image animate-fade-in-up" style={{ marginBottom: '2rem' }}>
          <img
            src="https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=1200&h=350&fit=crop"
            alt="Report a broken water point"
          />
          <div className="page-hero-overlay">
            <h1>{t('report.pageTitle')}</h1>
            <p>{t('report.pageDesc')}</p>
          </div>
        </div>
        <span className="wolaita-tibeb animate-fade-in-up" style={{ marginBottom: '1.5rem' }}></span>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card animate-fade-in-up delay-2" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-body" style={{ padding: '2rem' }}>
              <div className="form-group">
                <label className="form-label">{t('report.waterPoint')} *</label>
                <select name="water_point_id" className="form-select" value={formData.water_point_id} onChange={handleChange} required>
                  <option value="">{t('report.selectWaterPoint')}</option>
                  {waterPoints.map(wp => <option key={wp.id} value={wp.id}>{wp.name} — {wp.address}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('report.faultType')} *</label>
                <select name="fault_type" className="form-select" value={formData.fault_type} onChange={handleChange} required>
                  <option value="">{t('report.selectFaultType')}</option>
                  <option value="no_water">{t('report.faultNoWater')}</option>
                  <option value="pump_broken">{t('report.faultPumpBroken')}</option>
                  <option value="contaminated">{t('report.faultContaminated')}</option>
                  <option value="leaking">{t('report.faultLeaking')}</option>
                  <option value="other">{t('report.faultOther')}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('report.description')}</label>
                <textarea name="description" className="form-textarea" rows="4" placeholder={t('report.descriptionPlaceholder')} value={formData.description} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">{t('report.photo')}</label>
                <div className="photo-upload" onClick={() => document.getElementById('photo-input').click()}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="photo-upload-preview" />
                  ) : (
                    <div>
                      <Camera size={40} style={{ margin: '0 auto 0.75rem', display: 'block', color: 'var(--text-muted)' }} />
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('report.photoUpload')}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: '0.25rem 0 0' }}>{t('report.photoHelp')}</p>
                    </div>
                  )}
                </div>
                <input id="photo-input" type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">{t('report.yourName')}</label>
                  <input type="text" name="reporter_name" className="form-input" placeholder={t('report.namePlaceholder')} value={formData.reporter_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('report.yourPhone')}</label>
                  <input type="tel" name="reporter_phone" className="form-input" placeholder={t('report.phonePlaceholder')} value={formData.reporter_phone} onChange={handleChange} />
                  <div className="form-help">{t('report.phoneHelp')}</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t('report.priority')}</label>
                <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                  <option value="normal">{t('report.priorityNormal')}</option>
                  <option value="high">{t('report.priorityHigh')}</option>
                  <option value="urgent">{t('report.priorityUrgent')}</option>
                </select>
              </div>

              <button type="submit" className="btn btn-success btn-full btn-lg" disabled={loading}>
                {loading ? <><span className="spinner"></span> {t('report.submitting')}</> : <><Upload size={18} /> {t('report.submitReport')}</>}
              </button>
            </div>
          </div>
        </form>

        <div className="card report-next animate-fade-in-up delay-4">
          <div className="report-next-image">
            <img src="https://images.unsplash.com/photo-1551604283-246c763f2cda?w=700&h=460&fit=crop" alt={t('report.nextTitle')} />
          </div>
          <div className="report-next-body">
            <span className="wolaita-chip"><span className="chip-dot"></span> {t('report.nextBadge')}</span>
            <h2 style={{ margin: '0.75rem 0 0.25rem' }}>{t('report.nextTitle')}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{t('report.nextSub')}</p>
            <div className="report-next-steps">
              <div className="report-next-step">
                <span className="step-num">1</span>
                <div><strong>{t('report.step1T')}</strong><p>{t('report.step1D')}</p></div>
              </div>
              <div className="report-next-step">
                <span className="step-num">2</span>
                <div><strong>{t('report.step2T')}</strong><p>{t('report.step2D')}</p></div>
              </div>
              <div className="report-next-step">
                <span className="step-num">3</span>
                <div><strong>{t('report.step3T')}</strong><p>{t('report.step3D')}</p></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportPage;

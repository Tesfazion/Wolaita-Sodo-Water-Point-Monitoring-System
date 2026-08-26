import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { waterPointsAPI, reportsAPI } from '../../services/api';
import CitizenHeader from '../../components/common/CitizenHeader';
import Footer from '../../components/common/Footer';
import { Camera, Upload } from '../../components/common/Icons';

const ReportPage = () => {
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
    waterPointsAPI.getAll().then(res => setWaterPoints(res.data.data)).catch(() => {});
  }, []);

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
      setSuccess(`Report submitted! ID: ${res.data.data.report_id}`);
      setTimeout(() => navigate(`/track/${res.data.data.report_id}`), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.');
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
            alt="Report a water point fault"
          />
          <div className="page-hero-overlay">
            <h1>Report a Water Point Fault</h1>
            <p>Help your community by reporting broken or malfunctioning water points.</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card animate-fade-in-up delay-2" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-body" style={{ padding: '2rem' }}>
              <div className="form-group">
                <label className="form-label">Water Point *</label>
                <select name="water_point_id" className="form-select" value={formData.water_point_id} onChange={handleChange} required>
                  <option value="">-- Select Water Point --</option>
                  {waterPoints.map(wp => <option key={wp.id} value={wp.id}>{wp.name} — {wp.address}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fault Type *</label>
                <select name="fault_type" className="form-select" value={formData.fault_type} onChange={handleChange} required>
                  <option value="">-- Select Fault Type --</option>
                  <option value="no_water">No Water Coming Out</option>
                  <option value="pump_broken">Pump/Handle Broken</option>
                  <option value="contaminated">Water Contaminated/Dirty</option>
                  <option value="leaking">Leaking Pipes</option>
                  <option value="other">Other Problem</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea name="description" className="form-textarea" rows="4" placeholder="Describe the problem in detail..." value={formData.description} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Photo (Optional)</label>
                <div className="photo-upload" onClick={() => document.getElementById('photo-input').click()}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="photo-upload-preview" />
                  ) : (
                    <div>
                      <Camera size={40} style={{ margin: '0 auto 0.75rem', display: 'block', color: 'var(--text-muted)' }} />
                      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Click to upload a photo</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: '0.25rem 0 0' }}>Photo evidence helps repairs happen faster</p>
                    </div>
                  )}
                </div>
                <input id="photo-input" type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Your Name (Optional)</label>
                  <input type="text" name="reporter_name" className="form-input" placeholder="Your name" value={formData.reporter_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Your Phone (Optional)</label>
                  <input type="tel" name="reporter_phone" className="form-input" placeholder="+251-911-123456" value={formData.reporter_phone} onChange={handleChange} />
                  <div className="form-help">We'll notify you when the problem is fixed</div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                  <option value="normal">Normal</option>
                  <option value="high">High (Many people affected)</option>
                  <option value="urgent">Urgent (Health risk)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-success btn-full btn-lg" disabled={loading}>
                {loading ? <><span className="spinner"></span> Submitting...</> : <><Upload size={18} /> Submit Report</>}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ReportPage;

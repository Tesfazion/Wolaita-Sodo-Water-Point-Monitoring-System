import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Droplet } from '../../components/common/Icons';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) navigate('/admin/dashboard'); }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    const result = await login(email, password);
    if (result.success) navigate('/admin/dashboard');
    else { setError(result.message || 'Login failed.'); setLoading(false); }
  };

  return (
    <div className="login-bg" style={{ position: 'relative' }}>
      <img
        src="https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=1600&h=1000&fit=crop"
        alt=""
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.08, pointerEvents: 'none'
        }}
      />
      <div className="login-container">
        <div className="login-brand animate-fade-in-up">
          <div className="login-brand-icon">
            <Droplet size={32} style={{ color: 'white' }} />
          </div>
          <h1 className="login-brand-title">Wolaita Sodo</h1>
          <p className="login-brand-subtitle">Water-Point Monitoring System</p>
        </div>

        <div className="card login-card animate-fade-in-up delay-2">
          <div className="card-body login-card-body">
            <h2 className="login-card-title">Sign In</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="admin@sodowater.gov.et" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-input" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? <><span className="spinner"></span> Signing in...</> : 'Sign In'}
              </button>
            </form>

            <div className="login-demo-box">
              <strong className="login-demo-label">Demo Credentials</strong>
              <div className="login-demo-creds">
                <div><strong>Admin:</strong> admin@sodowater.gov.et / Admin@123</div>
                <div><strong>Office:</strong> office@sodowater.gov.et / Office@123</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-lg animate-fade-in-up delay-4">
          <Link to="/" className="btn btn-outline"><ArrowLeft size={16} /> Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

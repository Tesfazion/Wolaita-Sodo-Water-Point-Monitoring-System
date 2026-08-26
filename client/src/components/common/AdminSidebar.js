import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, FileText, Droplet, TrendingUp, LogOut } from './Icons';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path || (path === '/admin/dashboard' && location.pathname === '/admin');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <BarChart3 size={20} />, label: 'Dashboard' },
    { to: '/admin/reports', icon: <FileText size={20} />, label: 'Reports' },
    { to: '/admin/water-points', icon: <Droplet size={20} />, label: 'Water Points' },
    { to: '/admin/analytics', icon: <TrendingUp size={20} />, label: 'Analytics' },
  ];

  return (
    <>
      <div className={`admin-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-sidebar-brand">
            <div className="admin-sidebar-logo">
              <img src="/images/wolaita-logo.png" alt="Wolaita Sodo Water-Point Monitoring System" />
            </div>
            <div className="admin-sidebar-logo-text">
              <span className="admin-sidebar-title">Wolaita Sodo</span>
              <span className="admin-sidebar-subtitle">Admin Portal</span>
            </div>
          </Link>
        </div>

        <div className="admin-user-section">
          <div className="admin-user-label">Logged in as</div>
          <div className="admin-user-name">{user?.name || 'Admin'}</div>
          <div className="admin-user-role">{user?.role || 'admin'}</div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-item ${isActive(item.to) ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

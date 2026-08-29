import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BarChart3, FileText, Droplet, TrendingUp, LogOut, Wrench, Building } from './Icons';
import { useTranslation } from 'react-i18next';
import { isAdmin, isOfficeUser, isTechnician, canViewAnalytics } from '../../utils/roles';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isActive = (path) => location.pathname === path || (path === '/admin/dashboard' && location.pathname === '/admin');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Technicians have a focused view: only their assigned tasks.
  const navItems = [];
  if (isTechnician(user)) {
    navItems.push({ to: '/admin/tasks', icon: <Wrench size={20} />, label: t('admin.myTasks') });
  } else {
    navItems.push({ to: '/admin/dashboard', icon: <BarChart3 size={20} />, label: t('admin.dashboard') });
    navItems.push({ to: '/admin/reports', icon: <FileText size={20} />, label: t('admin.reports') });
    navItems.push({ to: '/admin/water-points', icon: <Droplet size={20} />, label: t('admin.waterPoints') });
    if (canViewAnalytics(user)) {
      navItems.push({ to: '/admin/analytics', icon: <TrendingUp size={20} />, label: t('admin.analytics') });
    }
    if (isAdmin(user)) {
      navItems.push({ to: '/admin/offices', icon: <Building size={20} />, label: t('admin.offices') });
    }
  }

  const roleLabel = isAdmin(user) ? t('admin.roleAdmin')
    : isOfficeUser(user) ? t('admin.roleOffice')
    : isTechnician(user) ? t('admin.roleTechnician')
    : (user?.role || t('admin.adminFallback'));

  return (
    <>
      <div className={`admin-sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-sidebar-brand">
            <div className="admin-sidebar-logo">
              <img src="/images/wolaita-logo.png" alt={t('brand.title') + ' ' + t('brand.adminSubtitle')} />
            </div>
            <div className="admin-sidebar-logo-text">
              <span className="admin-sidebar-title">{t('brand.title')}</span>
              <span className="admin-sidebar-subtitle">{t('brand.adminSubtitle')}</span>
            </div>
          </Link>
        </div>

        <div className="admin-user-section">
          <div className="admin-user-label">{t('admin.loggedInAs')}</div>
          <div className="admin-user-name">{user?.name || t('admin.admin')}</div>
          <div className="admin-user-role">{roleLabel}</div>
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
            <LogOut size={18} /> {t('admin.signOut')}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

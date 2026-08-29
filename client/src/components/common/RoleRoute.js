import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/roles';

const ALLOWED = {
  [ROLES.ADMIN]: ['/admin/dashboard', '/admin', '/admin/reports', '/admin/water-points', '/admin/analytics', '/admin/offices'],
  [ROLES.OFFICE]: ['/admin/dashboard', '/admin', '/admin/reports', '/admin/water-points', '/admin/analytics'],
  [ROLES.TECHNICIAN]: ['/admin/tasks']
};

const RoleRoute = ({ children, path }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const allowedPaths = ALLOWED[user.role];
  if (allowedPaths && allowedPaths.includes(path)) {
    return children;
  }

  // Redirect each role to its own home page.
  if (user.role === ROLES.TECHNICIAN) return <Navigate to="/admin/tasks" replace />;
  return <Navigate to="/admin/dashboard" replace />;
};

export default RoleRoute;

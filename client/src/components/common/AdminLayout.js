/**
 * Admin Layout Component
 * Wraps admin pages with sidebar navigation
 */

import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <button className="admin-menu-toggle" onClick={() => setSidebarOpen(true)}>☰</button>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

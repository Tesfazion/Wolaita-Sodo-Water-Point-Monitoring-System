import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './i18n';

import HomePage from './pages/CitizenPages/HomePage';
import MapPage from './pages/CitizenPages/MapPage';
import ReportPage from './pages/CitizenPages/ReportPage';
import TrackReportPage from './pages/CitizenPages/TrackReportPage';
import AboutPage from './pages/CitizenPages/AboutPage';

import AdminLogin from './pages/AdminPages/AdminLogin';
import AdminDashboard from './pages/AdminPages/AdminDashboard';
import AdminReports from './pages/AdminPages/AdminReports';
import AdminWaterPoints from './pages/AdminPages/AdminWaterPoints';
import AdminAnalytics from './pages/AdminPages/AdminAnalytics';

import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/track" element={<TrackReportPage />} />
          <Route path="/track/:id" element={<TrackReportPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute><AdminReports /></PrivateRoute>} />
          <Route path="/admin/water-points" element={<PrivateRoute><AdminWaterPoints /></PrivateRoute>} />
          <Route path="/admin/analytics" element={<PrivateRoute><AdminAnalytics /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

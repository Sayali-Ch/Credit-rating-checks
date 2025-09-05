import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../../components/admin/Navbar';
import Analytics from './Analytics';
import Applications from './Applications';
import UserProfile from './UserProfile';

const AdminDashboard = () => {
  const navItems = [
    { path: '/admin-dashboard', label: 'Analytics' },
    { path: '/admin-dashboard/applications', label: 'Applications' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar navItems={navItems} />
      <div className="pt-0">
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

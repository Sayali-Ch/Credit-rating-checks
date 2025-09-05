import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Profile from './pages/Profile';

// Admin Dashboard Components
import AdminNavbar from './admin-components/Navbar';
import Analytics from './admin-pages/Analytics';
import Applications from './admin-pages/Applications';
import UserProfile from './admin-pages/UserProfile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer'); // 'customer' or 'employee'

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'features':
        return <FeaturesPage onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      case 'support':
        return <SupportPage onNavigate={navigate} />;
      case 'auth':
        return (
          <AuthPage 
            userType={userType} 
            setUserType={setUserType} 
            isLogin={isLogin} 
            setIsLogin={setIsLogin}
            onNavigate={navigate}
          />
        );
      case 'dashboard':
        return <Home />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Admin Dashboard Routes - Must come BEFORE catch-all routes */}
          <Route path="/admin-dashboard" element={
            <div className="admin-dashboard">
              <AdminNavbar />
              <Analytics />
            </div>
          } />
          <Route path="/admin-dashboard/analytics" element={
            <div className="admin-dashboard">
              <AdminNavbar />
              <Analytics />
            </div>
          } />
          <Route path="/admin-dashboard/applications" element={
            <div className="admin-dashboard">
              <AdminNavbar />
              <Applications />
            </div>
          } />
          <Route path="/admin-dashboard/profile/:userId" element={
            <div className="admin-dashboard">
              <AdminNavbar />
              <UserProfile />
            </div>
          } />
          
          {/* Customer Routes */}
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Default Routes - Must be LAST */}
          <Route path="/" element={
            <>
              <Navbar currentPage={currentPage} onNavigate={navigate} />
              {renderContent()}
            </>
          } />
          <Route path="*" element={
            <>
              <Navbar currentPage={currentPage} onNavigate={navigate} />
              {renderContent()}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

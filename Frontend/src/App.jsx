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
          <Route path="/dashboard" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={
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

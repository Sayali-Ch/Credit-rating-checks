import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import AuthPage from './pages/AuthPage';

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
          />
        );
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      {renderContent()}
    </div>
  );
}

export default App;

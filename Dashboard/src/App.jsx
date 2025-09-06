import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Analytics from './pages/Analytics';
import Applications from './pages/Applications';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import './App.css';

// Main Admin Dashboard Component - can be imported into any React app
const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Navbar />
      <Routes>
        <Route path="/" element={<Analytics />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

// Default App component (for standalone usage)
function App() {
  return (
    <Router>
      <div className="App">
        <AdminDashboard />
      </div>
    </Router>
  );
}

// Export both for different use cases
export default App;
export { AdminDashboard };

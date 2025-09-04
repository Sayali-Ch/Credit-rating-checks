
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import UserOnboardingForm from './components/UserOnboardingForm';

function App() {
  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/onboarding" element={<UserOnboardingForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import TopBar from "../components/Topbar";
import Dashboard from "./Dashboard";

function Home() {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("Home component mounted");
    console.log("Is authenticated:", AuthService.isAuthenticated());
    
    // Check authentication
    if (!AuthService.isAuthenticated()) {
      console.log("User not authenticated, redirecting to login");
      navigate('/');
      return;
    }
  }, [navigate]);
  
  console.log("Home component rendering...");
  
  // Show loading if not authenticated
  if (!AuthService.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Redirecting to login...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Dashboard />
    </div>
  );
}

export default Home;

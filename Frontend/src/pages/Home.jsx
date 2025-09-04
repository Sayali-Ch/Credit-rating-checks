import React from "react";
import TopBar from "../components/Topbar";
import Dashboard from "./Dashboard";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Dashboard />
    </div>
  );
}

export default Home;

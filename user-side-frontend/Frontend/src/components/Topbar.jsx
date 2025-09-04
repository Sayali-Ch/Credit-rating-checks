import React from "react";
import { useNavigate } from "react-router-dom";

function TopBar() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      <div className="flex items-center">
        <span className="text-2xl font-bold text-gray-800 select-none">
          CIBIL<span className="text-blue-600">VIEW</span>
        </span>
      </div>
      <div className="flex items-center">
        <span
          className="cursor-pointer bg-gray-100 rounded-full p-2 hover:bg-blue-100 transition"
          onClick={() => navigate("/profile")}
          title="Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9A3.75 3.75 0 1 1 8.25 9a3.75 3.75 0 0 1 7.5 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.25v-.5A4.75 4.75 0 0 1 9.25 14h5.5a4.75 4.75 0 0 1 4.75 4.75v.5" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default TopBar;
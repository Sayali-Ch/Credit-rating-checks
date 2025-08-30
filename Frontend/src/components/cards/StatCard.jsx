import React from 'react';

export default function StatCard({ 
  value, 
  label, 
  color = 'blue',
  className = ''
}) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    pink: 'text-pink-600',
    teal: 'text-teal-600'
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 text-center ${className}`}>
      <div className={`text-3xl font-bold mb-2 ${colorClasses[color] || 'text-gray-600'}`}>
        {value}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

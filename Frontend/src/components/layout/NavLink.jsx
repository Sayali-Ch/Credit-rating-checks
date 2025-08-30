import React from 'react';

export default function NavLink({ 
  label, 
  isActive, 
  onClick, 
  className = '' 
}) {
  const baseClasses = 'px-3 py-2 text-sm font-medium transition-colors';
  const activeClasses = isActive 
    ? 'text-blue-600' 
    : 'text-gray-600 hover:text-blue-600';

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${activeClasses} ${className}`}
    >
      {label}
    </button>
  );
}

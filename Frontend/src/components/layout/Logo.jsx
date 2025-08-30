import React from 'react';

export default function Logo({ 
  onClick, 
  className = '',
  size = 'default' 
}) {
  const sizeClasses = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl'
  };

  return (
    <div 
      className={`font-bold text-blue-600 cursor-pointer ${sizeClasses[size]} ${className}`}
      onClick={onClick}
    >
      CibilView
    </div>
  );
}

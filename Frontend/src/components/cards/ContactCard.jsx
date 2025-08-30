import React from 'react';

export default function ContactCard({ 
  icon, 
  title, 
  value, 
  description,
  color = 'blue',
  variant = 'default',
  onClick,
  className = ''
}) {
  const colorClasses = {
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
    green: 'bg-green-100',
    red: 'bg-red-100'
  };

  const variantClasses = {
    default: 'bg-white text-gray-900',
    gradient: 'bg-white/10 text-white border border-white/20'
  };

  const iconBgClasses = variant === 'gradient' ? 'bg-white/20' : colorClasses[color] || 'bg-gray-100';
  
  const valueColorStyle = variant === 'gradient' 
    ? { color: 'white' }
    : { color: color === 'blue' ? '#2563eb' : color === 'purple' ? '#7c3aed' : color === 'orange' ? '#ea580c' : color === 'green' ? '#059669' : '#374151' };

  return (
    <div 
      className={`rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all transform hover:-translate-y-1 ${variantClasses[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${iconBgClasses}`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className={`text-lg font-bold mb-2 ${variant === 'gradient' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
      <p className="font-semibold text-lg mb-1" style={valueColorStyle}>
        {value}
      </p>
      <p className={`text-sm ${variant === 'gradient' ? 'text-white/80' : 'text-gray-600'}`}>{description}</p>
    </div>
  );
}

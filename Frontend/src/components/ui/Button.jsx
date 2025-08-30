import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  disabled = false,
  type = 'button'
}) {
  const baseClasses = 'font-medium rounded-md transition-all duration-200 outline-none focus:outline-none border-0 focus:ring-0 focus:ring-offset-0';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600 hover:border-blue-700',
    secondary: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400',
    ghost: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-2 border-transparent',
    'white-primary': 'bg-white text-blue-600 hover:bg-gray-50 border-2 border-white',
    'white-outline': 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600'
  };

  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ outline: 'none', boxShadow: 'none' }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}

import React from "react";
import Logo from './Logo';
import NavLink from './NavLink';
import Button from '../ui/Button';

export default function Navbar({ onNavigate, currentPage }) {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'features', label: 'Features' },
    { key: 'about', label: 'About' },
    { key: 'support', label: 'Support' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo onClick={() => onNavigate && onNavigate('home')} />
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map(item => (
                <NavLink
                  key={item.key}
                  label={item.label}
                  isActive={currentPage === item.key}
                  onClick={() => onNavigate(item.key)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={() => onNavigate('auth')}>
              Login / Signup
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

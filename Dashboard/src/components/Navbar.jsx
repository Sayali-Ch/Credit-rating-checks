import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Navbar = ({ navItems, brandName = "CIBILVIEW", logoColor = "#198ae6" }) => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  
  // Default navigation items if none provided
  const defaultNavItems = [
    { path: '/', label: 'Analytics' },
    { path: '/applications', label: 'Applications' }
  ];
  
  const navigation = navItems || defaultNavItems;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 lg:px-8 sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 max-w-7xl mx-auto relative">
        {/* Logo */}
                {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: logoColor }}>
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div className="text-xl font-bold text-gray-900">
              {brandName.split('').map((char, index) => (
                <span key={index} style={char === 'V' && brandName === 'CIBILVIEW' ? { color: logoColor } : {}}>
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={location.pathname === item.path ? { backgroundColor: logoColor } : {}}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              style={location.pathname === item.path ? { backgroundColor: logoColor } : {}}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Profile Dropdown */}
        <div className="flex items-center space-x-4 relative">
          <div className="relative">
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full border-2 border-gray-100 hover:border-gray-200 transition-all duration-200"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" />
                <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: '#198ae6' }}>AD</AvatarFallback>
              </Avatar>
            </Button>
            
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-[9998]" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999]">
                  <div className="font-normal p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="Profile" />
                        <AvatarFallback className="text-white font-semibold" style={{ backgroundColor: '#198ae6' }}>AD</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold text-gray-900">Admin User</p>
                        <p className="text-xs text-gray-500">admin@cibilview.com</p>
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                          Online
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-1 border-gray-200" />
                  <div className="w-full text-left p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-700 transition-colors">
                    Profile Settings
                  </div>
                  <hr className="my-1 border-gray-200" />
                  <div className="w-full text-left p-3 hover:bg-red-50 rounded-lg cursor-pointer text-red-600 text-sm transition-colors">
                    Log out
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

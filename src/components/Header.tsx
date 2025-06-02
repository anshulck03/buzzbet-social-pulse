
import React from 'react';
import ResponsiveEBKLogo from './ResponsiveEBKLogo';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="w-full bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ResponsiveEBKLogo 
              onClick={handleLogoClick}
              className="mr-4"
            />
          </div>
          
          {/* Future navigation items can go here */}
          <div className="flex items-center space-x-4">
            {/* Navigation items placeholder */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

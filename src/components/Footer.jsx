import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="text-white font-bold text-lg tracking-tight">SM</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-xl tracking-tight">SM</div>
              <div className="text-blue-200 text-xs font-semibold tracking-widest -mt-1">EXPLOITS</div>
            </div>
          </div>

          {/* Copyright Text */}
          <div className="text-center">
            <p className="text-blue-100 font-medium text-base">
              © {currentYear} Boost Elix. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
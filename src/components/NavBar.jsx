import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Desktop Layout - Centered */}
        <div className="hidden md:flex flex-col items-center py-6">
          {/* Logo Section - Centered on Desktop */}
          <div className="flex items-center justify-center mb-6">
            <Link to="/" className="flex items-center space-x-4 group">
              {/* Logo Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="text-white font-bold text-2xl tracking-tight">SM</div>
              </div>
              {/* Logo Text */}
              <div className="text-center">
                <div className="text-blue-800 font-bold text-3xl tracking-tight">SM</div>
                <div className="text-blue-600 text-sm font-semibold tracking-widest -mt-1">EXPLOITS</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - Centered */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-12">
              <Link
                to="/signin"
                className="text-blue-600 hover:text-blue-800 font-medium text-lg transition-all duration-300 hover:scale-105 relative group"
              >
                Sign in
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-700 font-medium text-lg transition-all duration-300 hover:scale-105 relative group"
              >
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/api"
                className="text-gray-700 hover:text-blue-700 font-medium text-lg transition-all duration-300 hover:scale-105 relative group"
              >
                API
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Logo Left, Menu Right */}
        <div className="md:hidden flex justify-between items-center py-4">
          {/* Logo Section - Left aligned on Mobile */}
          <Link to="/" className="flex items-center space-x-3 group">
            {/* Logo Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <div className="text-white font-bold text-xl tracking-tight">SM</div>
            </div>
            {/* Logo Text */}
            <div>
              <div className="text-blue-800 font-bold text-xl tracking-tight">SM</div>
              <div className="text-blue-600 text-xs font-semibold tracking-widest -mt-1">EXPLOITS</div>
            </div>
          </Link>

          {/* Mobile menu button - Right aligned */}
          <button
            onClick={toggleMenu}
            className="bg-gray-50 p-3 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 pt-4 pb-6 space-y-4">
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-800 block py-3 text-lg font-medium transition-colors duration-200 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-blue-700 block py-3 text-lg font-medium transition-colors duration-200 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/api"
              className="text-gray-700 hover:text-blue-700 block py-3 text-lg font-medium transition-colors duration-200 border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              API
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white block py-3 px-6 rounded-full font-semibold text-lg transition-all duration-300 text-center mt-6"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React, { useState, useRef } from 'react';
import { 
  User, 
  Bell,
  HelpCircle,
  LogOut,
  Shield,
  ChevronDown,
  Menu,
  Settings
} from 'lucide-react';

const Header = ({ 
  sidebarOpen, 
  setSidebarOpen,
  user,
  onLogout 
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">AD</span>
            </div>
            <div>
              <span className="font-bold text-gray-800 text-lg">Admin Panel</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-600 rounded-full"></span>
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-700 hidden sm:block">{user?.username || 'Admin'}</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-medium text-gray-800">{user?.username || 'Admin'}</div>
                  <div className="text-sm text-gray-500">System Administrator</div>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-left">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-left">
                    <Settings className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">System Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-left">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Security</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-left">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Help Center</span>
                  </button>
                  <hr className="my-2" />
                  <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 text-left text-red-600">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import { NavLink } from 'react-router-dom';
import { 
  Plus, 
  List, 
  Zap,
  ShoppingBag,
  Users,
  Mail,
  BarChart3,
  Settings,
  Database,
  X,
  Shield
} from 'lucide-react';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen
}) => {

  const sidebarItems = [
    { icon: BarChart3, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: Plus, label: 'Add Services', to: '/admin/add-services' },
    { icon: List, label: 'Show Services', to: '/admin/show-services' },
    { icon: Zap, label: 'Manage API Providers', to: '/admin/api-providers' }, 
    { icon: ShoppingBag, label: 'Orders', to: '/admin/orders' },
    { icon: Users, label: 'All Users', to: '/admin/manage-users' },
    { icon: Mail, label: 'Send Mail', to: '/admin/send-mail' },
    { icon: Database, label: 'System Logs', to: '/admin/system-logs' },
    { icon: Settings, label: 'Settings', to: '/admin/settings' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-lg border-r border-gray-200/50
      transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      overflow-y-auto
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 text-lg">Admin Panel</span>
            <span className="text-xs text-gray-500">Control Center</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              end={item.to === '/admin'} // exact match for dashboard
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`w-5 h-5 ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-purple-600'
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">System Status</div>
                <div className="text-xs text-gray-600">All systems operational</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

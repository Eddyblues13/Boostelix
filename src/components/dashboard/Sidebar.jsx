import React, { useRef, useState } from 'react';
import { 
  ShoppingCart, 
  CreditCard, 
  History, 
  TrendingUp, 
  Star, 
  Headphones, 
  Settings, 
  DollarSign,
  Users,
  Shield,
  Bell,
  Zap,
  X,
  Wallet,
  ChevronDown,
  Globe
} from 'lucide-react';

const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen,
  activeNavItem,
  setActiveNavItem,
  selectedCurrency,
  setSelectedCurrency,
  currencies
}) => {
  const [mobileCurrencyDropdownOpen, setMobileCurrencyDropdownOpen] = useState(false);
  const mobileCurrencyRef = useRef(null);

  const sidebarItems = [
    { icon: ShoppingCart, label: 'New Order' },
    { icon: CreditCard, label: 'Add Funds' },
    { icon: History, label: 'Order History' },
    // { icon: TrendingUp, label: 'Analytics' },
    // { icon: Star, label: 'Favorites' },
    { icon: Headphones, label: 'Customer Support' },
    { icon: Settings, label: 'Services' },
    { icon: DollarSign, label: 'Make Money' },
    { icon: Users, label: 'Child Panel' },
    { icon: Settings, label: 'Mass Order' },
    { icon: Zap, label: 'API Access' },
    // { icon: Shield, label: 'Security' },
    { icon: Bell, label: 'Updates' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-lg border-r border-gray-200/50 transform transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      overflow-y-auto
    `}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">BE</span>
            </div>
            <div>
              <span className="font-bold text-gray-800 text-lg">Boostelix</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-4 py-3 lg:hidden border-b border-gray-200 relative">
          <div className="relative" ref={mobileCurrencyRef}>
            <button
              onClick={() => setMobileCurrencyDropdownOpen(!mobileCurrencyDropdownOpen)}
              className="w-full bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl flex items-center justify-between hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-700">{selectedCurrency.symbol} 0</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-blue-400 transition-transform ${mobileCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {mobileCurrencyDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-[60]">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setMobileCurrencyDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 text-left border-b border-gray-100 last:border-b-0"
                  >
                    <Globe className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-700">{currency.symbol} {currency.code}</div>
                      <div className="text-xs text-gray-500">{currency.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveNavItem(item.label)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group
                ${activeNavItem === item.label 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${activeNavItem === item.label ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
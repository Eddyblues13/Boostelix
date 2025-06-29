import { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Clock,
  Info,
  TrendingUp,
  ChevronDown , 
  User,
  Wallet
} from 'lucide-react';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/SideBar';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Instagram Followers - 28/04/2025 - [ No Flag Problem - Working ]');
  const [selectedService, setSelectedService] = useState('Instagram Followers - Old Accounts With Posts | 0/1Min Completed ⚡All Flag Workin⚡');
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState({ code: 'NGN', symbol: '₦', name: 'Nigerian Naira' });
  const [activeNavItem, setActiveNavItem] = useState('New Order');
  
  const currencies = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  const categories = [
    '📷 Instagram Followers - Premium Quality - No Drop Guaranteed',
    '📺 YouTube Subscribers - Real & Active - Fast Delivery',
    '📘 Facebook Page Likes - High Retention - Worldwide',
    '🐦 Twitter Followers - Organic Growth - Safe Method',
    '🎵 TikTok Followers - Trending Algorithm - Viral Ready',
    '💼 LinkedIn Connections - Professional Network - B2B Focus'
  ];

  const services = [
    'Instagram Followers - Premium Quality | 1-2 Hours Start ⚡Fast Delivery⚡',
    'Instagram Followers - Real Users | 24-48 Hours Complete ⚡Guaranteed⚡',
    'Instagram Followers - High Retention | Lifetime Refill ⚡No Drop⚡'
  ];

  const CustomSelect = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className="relative" ref={selectRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between hover:border-gray-300 transition-colors"
        >
          <span className="truncate text-gray-700">{value || placeholder}</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-gray-700 border-b border-gray-100 last:border-b-0"
              >
                <div className="truncate">{option}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Header 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        currencies={currencies}
      />

      <div className="flex">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeNavItem={activeNavItem}
          setActiveNavItem={setActiveNavItem}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          currencies={currencies}
        />

        <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full lg:ml-72">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">bensonate</h3>
                  <p className="text-sm text-gray-500">Premium Member</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedCurrency.symbol} 0.00</h3>
                  <p className="text-sm text-gray-500">Account Balance</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">156</h3>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-blue-100 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Place New Order</h2>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <CustomSelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                  placeholder="Select a category"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Service</label>
                <CustomSelect
                  value={selectedService}
                  onChange={setSelectedService}
                  options={services}
                  placeholder="Select a service"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Profile/Post URL</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1000"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                />
                <p className="text-sm text-gray-500 mt-2">Minimum: 10 • Maximum: 10,000,000</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Estimated Delivery Time</span>
                </div>
                <p className="text-blue-700 font-semibold text-lg">1 hour 36 minutes</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Total Cost</label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <span className="text-2xl font-bold text-gray-800">{selectedCurrency.symbol} 0.00</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Submit Order</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">
                Service <span className="text-yellow-300">Updates</span>
              </h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold mb-2 text-yellow-300">🚨 Important Notice</h4>
                <p className="text-blue-100">
                  For any non-delivered orders, please contact our support team for immediate assistance and refund processing.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
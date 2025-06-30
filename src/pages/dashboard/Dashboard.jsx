import { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Clock,
  Info,
  TrendingUp,
  ChevronDown, 
  User,
  Wallet,
  Loader
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/SideBar';
import api from '../../services/api';

// Moved CustomSelect outside the Dashboard component to prevent re-creation on every render
const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  displayProperty = 'name',
  loading = false 
}) => {
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
        type="button"
        onClick={() => !loading && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between hover:border-gray-300 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center text-gray-500">
            <Loader className="animate-spin w-4 h-4 mr-2" />
            Loading...
          </span>
        ) : (
          <>
            <span className="truncate text-gray-700">
              {value ? value[displayProperty] : placeholder}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>
      
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-gray-700 border-b border-gray-100 last:border-b-0 cursor-pointer"
            >
              <div className="truncate">{option[displayProperty]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState({ code: 'NGN', symbol: '₦', name: 'Nigerian Naira' });
  const [activeNavItem, setActiveNavItem] = useState('New Order');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/user');
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          handleLogout();
        } else {
          toast.error(err.response?.data?.message || "Failed to load user data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get('/categories');
         const categoriesArray = response.data.data;

      setCategories(categoriesArray);
    if (categoriesArray.length > 0) {
      setSelectedCategory(categoriesArray[0]);
    }
      } catch (err) {
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedCategory) return;
      
      try {
        setLoadingServices(true);
        const response = await api.get(`/services?category_id=${selectedCategory.id}`);
        setServices(response.data.data);
        if (response.data.length > 0) {
          setSelectedService(response.data[0]);
        } else {
          setSelectedService(null);
        }
      } catch (err) {
        toast.error('Failed to load services');
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [selectedCategory]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const currencies = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  const totalCost = selectedService && quantity 
    ? (quantity * selectedService.price).toFixed(2)
    : '0.00';

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
        user={user} 
        onLogout={handleLogout}
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
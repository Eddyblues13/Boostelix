// src/layouts/DashboardLayout.jsx

import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Clock, Info, TrendingUp, ChevronDown, User, Wallet, Loader 
} from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/SideBar';
import api from '../../services/api';
import { DashboardContext } from '../../context/DashboardContext'; // ✅ ADD THIS

const DashboardLayout = () => {
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
        if (categoriesArray.length > 0) setSelectedCategory(categoriesArray[0]);
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
        if (response.data.data.length > 0) {
          setSelectedService(response.data.data[0]);
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
    <DashboardContext.Provider value={{
      user,
      selectedCurrency,
      selectedCategory,
      setSelectedCategory,
      selectedService,
      setSelectedService,
      quantity,
      setQuantity,
      link,
      setLink,
      categories,
      services,
      loadingCategories,
      loadingServices,
      totalCost,
    }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
    </DashboardContext.Provider>
  );
};

export default DashboardLayout;

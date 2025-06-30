import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/SideBar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState({ code: 'NGN', symbol: '₦', name: 'Nigerian Naira' });
  const [activeNavItem, setActiveNavItem] = useState('New Order');

  const navigate = useNavigate();

  const currencies = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/user');
        setUser(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          handleLogout();
        } else {
          toast.error(err.response?.data?.message || 'Failed to load user data');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    toast.success('Logged out successfully');
    navigate('/');
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

      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        currencies={currencies}
        user={user}
        onLogout={handleLogout}
      />

      {/* Sidebar + Main */}
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

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 max-w-6xl mx-auto w-full lg:ml-72">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

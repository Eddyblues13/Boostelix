import React, { useState, useEffect } from 'react';
import {
  User, Wallet, TrendingUp, ShoppingCart, Search, Clock, Info
} from 'lucide-react';
import CustomSelect from './CustomSelect'; // adjust path if needed
import api from '../../services/api'; // ✅ make sure this exists and is working
import toast from 'react-hot-toast';
import { fetchUserData } from '../../services/userService'; 
import { fetchSmmCategories, fetchSmmServices } from '../../services/services';

const NewOrder = () => {
  const [user, setUser] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState({ symbol: '₦', code: 'NGN' });

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const totalCost = selectedService && quantity
    ? (quantity * selectedService.price).toFixed(2)
    : '0.00';

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUserData();
        setUser(response.data);
      } catch (err) {
        toast.error('Failed to fetch user info');
      }
    };
    fetchUser();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetchSmmCategories();
        const catData = response.data.data;
        setCategories(catData);
        if (catData.length > 0) setSelectedCategory(catData[0]);
      } catch (err) {
        toast.error('Failed to fetch categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch services for selected category
  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedCategory) return;
      try {
        setLoadingServices(true);
        const response = await fetchSmmServices(selectedCategory.id);
        const srv = response.data.data;
        setServices(srv);
        if (srv.length > 0) {
          setSelectedService(srv[0]);
        } else {
          setSelectedService(null);
        }
      } catch (err) {
        toast.error('Failed to fetch services');
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [selectedCategory]);

  return (
    <div className="p-4">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {user?.username || 'Loading...'}
              </h3>
              <p className="text-sm text-gray-500">Premium Member</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedCurrency.symbol} 0.00
              </h3>
              <p className="text-sm text-gray-500">Account Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
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

      {/* Order Form */}
      <div className="bg-white rounded-2xl p-8 shadow mb-8">
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
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories}
              displayProperty="category_title"
              placeholder="Select a category"
              loading={loadingCategories}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Service</label>
            <CustomSelect
              value={selectedService}
              onChange={setSelectedService}
              options={services}
              displayProperty="service_title"
              placeholder={services.length ? "Select a service" : "No services available"}
              loading={loadingServices}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Profile/Post URL</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={selectedService?.min_amount || 0}
              max={selectedService?.max_amount || 1000000}
              placeholder="1000"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Minimum: {selectedService?.min_amount || 10} • Maximum: {selectedService?.max_amount || 1000000}
            </p>
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
              <span className="text-2xl font-bold text-gray-800">
                {selectedCurrency.symbol} {totalCost}
              </span>
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Submit Order</span>
            </div>
          </button>
        </div>
      </div>

      {/* Notices */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-white/20 rounded-xl">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">
            Service <span className="text-yellow-300">Updates</span>
          </h3>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <h4 className="font-semibold mb-2 text-yellow-300">🚨 Important Notice</h4>
          <p className="text-blue-100">
            For any non-delivered orders, please contact our support team for immediate assistance and refund processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;

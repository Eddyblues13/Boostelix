"use client"

import { useState, useEffect } from "react"
import { 
  ShoppingCart, 
  Search, 
  Instagram, 
  Clock, 
  Info,
  Facebook,
  Youtube,
  Twitter,
  MessageSquare,
  Music,
  Twitch,
  Globe
} from "lucide-react"
import toast from "react-hot-toast"
import { fetchUserData } from "../../services/userService"
import { fetchSmmCategories, fetchSmmServices } from "../../services/services"
import { CSS_COLORS } from "../../components/constant/colors"

const NewOrder = () => {
  const [user, setUser] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState({ symbol: "₦", code: "NGN" })
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [quantity, setQuantity] = useState("")
  const [link, setLink] = useState("")
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [showServiceDescription, setShowServiceDescription] = useState(false)

  const totalCost = selectedService && quantity ? (quantity * selectedService.price).toFixed(2) : "0.00"

  const getPlatformIcon = (categoryTitle) => {
    if (!categoryTitle) return <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />;
    
    // Remove special characters and emojis from the beginning
    const cleanedTitle = categoryTitle.replace(/^[^a-zA-Z0-9]+/, '').toLowerCase();
    
    if (cleanedTitle.includes('instagram')) return <Instagram className="w-5 h-5 text-pink-500 flex-shrink-0" />;
    if (cleanedTitle.includes('facebook')) return <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />;
    if (cleanedTitle.includes('youtube')) return <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (cleanedTitle.includes('twitter') || cleanedTitle.includes('x')) return <Twitter className="w-5 h-5 text-blue-400 flex-shrink-0" />;
    if (cleanedTitle.includes('tiktok')) return <MessageSquare className="w-5 h-5 text-black flex-shrink-0" />;
    if (cleanedTitle.includes('soundcloud')) return <Music className="w-5 h-5 text-orange-500 flex-shrink-0" />;
    if (cleanedTitle.includes('twitch')) return <Twitch className="w-5 h-5 text-purple-500 flex-shrink-0" />;
    if (cleanedTitle.includes('telegram')) return <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    
    return <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />;
  };

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUserData()
        setUser(response.data)
      } catch (err) {
        toast.error("Failed to fetch user info")
      }
    }
    fetchUser()
  }, []) 

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await fetchSmmCategories()
        const catData = response.data.data
        setCategories(catData)
        if (catData.length > 0) setSelectedCategory(catData[0])
      } catch (err) {
        toast.error("Failed to fetch categories")
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Fetch services for selected category
  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedCategory) return
      try {
        setLoadingServices(true)
        const response = await fetchSmmServices(selectedCategory.id.toString())
        const srv = response.data.data
        setServices(srv)
        setSelectedService(srv.length > 0 ? srv[0] : null)
      } catch (err) {
        console.error("Error fetching services:", err)
        toast.error("Failed to fetch services")
        setServices([])
        setSelectedService(null)
      } finally {
        setLoadingServices(false)
      }
    }
    fetchServices()
  }, [selectedCategory])

  const socialPlatforms = [
    { name: "Facebook", icon: "📘", bgColor: "#1877f2" },
    { name: "Youtube", icon: "📺", bgColor: "#ff0000" },
    { name: "Instagram", icon: "📷", bgColor: "#e4405f" },
    { name: "Tiktok", icon: "🎵", bgColor: "#000000" },
    { name: "Spotify", icon: "🎧", bgColor: "#1db954" },
    { name: "Twitter", icon: "🐦", bgColor: "#1da1f2" },
    { name: "Snapchat", icon: "👻", bgColor: "#fffc00" },
    { name: "Telegram", icon: "✈️", bgColor: "#0088cc" },
    { name: "Soundcloud", icon: "🔊", bgColor: "#ff5500" },
    { name: "Twitch", icon: "🎮", bgColor: "#9146ff" },
    { name: "Website Traffic", icon: "🌐", bgColor: "#6b7280" },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "transparent" }}>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="max-w-md mx-auto p-4 space-y-4">
          {/* Stats Cards */}
          <div className="space-y-4">
            <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm relative overflow-hidden" style={{ backgroundColor: CSS_COLORS.background.card }}>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">💰</div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Balance</p>
                  <h3 className="text-2xl font-bold text-gray-800">0</h3>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl" style={{ backgroundColor: CSS_COLORS.primary }}></div>
            </div>

            <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm relative overflow-hidden" style={{ backgroundColor: CSS_COLORS.background.card }}>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">👑</div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Status</p>
                  <h3 className="text-xl font-bold text-gray-800">NEW</h3>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl" style={{ backgroundColor: CSS_COLORS.primary }}></div>
            </div>

            <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm relative overflow-hidden" style={{ backgroundColor: CSS_COLORS.background.card }}>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">👤</div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Username</p>
                  <h3 className="text-xl font-bold text-gray-800">{user?.username || "loading.."}</h3>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl" style={{ backgroundColor: CSS_COLORS.primary }}></div>
            </div>

            <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm relative overflow-hidden" style={{ backgroundColor: CSS_COLORS.background.card }}>
              <div className="flex items-center space-x-4">
                <div className="text-4xl">📦</div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Order</p>
                  <h3 className="text-2xl font-bold text-gray-800">4551537</h3>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl" style={{ backgroundColor: CSS_COLORS.primary }}></div>
            </div>
          </div>

          {/* Social Media Platforms */}
          <div className="grid grid-cols-2 gap-4">
            {socialPlatforms.slice(0, 6).map((platform, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg" style={{ backgroundColor: platform.bgColor }}>
                    {platform.icon}
                  </div>
                  <span className="font-medium text-gray-700">{platform.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 text-white py-4 rounded-full font-medium flex items-center justify-center space-x-2 shadow-lg" style={{ backgroundColor: CSS_COLORS.primary }}>
              <ShoppingCart className="w-5 h-5" />
              <span>New order</span>
            </button>
            <button className="flex-1 py-4 rounded-full font-medium flex items-center justify-center space-x-2 border border-gray-200" style={{ backgroundColor: CSS_COLORS.background.muted, color: "#374151" }}>
              <ShoppingCart className="w-5 h-5" />
              <span>Mass order</span>
            </button>
          </div>

          {/* Order Form */}
          <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm" style={{ backgroundColor: CSS_COLORS.background.card }}>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Place your order</h2>

            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ backgroundColor: CSS_COLORS.background.muted }}
                />
              </div> 

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                {loadingCategories ? (
                  <div className="p-4 border border-gray-200 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedCategory?.id || ''}
                      onChange={(e) => {
                        const cat = categories.find(c => c.id.toString() === e.target.value);
                        setSelectedCategory(cat);
                      }}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-sm appearance-none"
                      style={{ backgroundColor: CSS_COLORS.background.muted }}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id.toString()}>
                          {category.category_title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {selectedCategory ? getPlatformIcon(selectedCategory.category_title) : <Globe className="w-5 h-5 text-gray-500" />}
                    </div>
                  </div>
                )}
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Service</label>
                {loadingServices ? (
                  <div className="p-4 border border-gray-200 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                    <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ) : (
                  <select
                    value={selectedService?.id || ''}
                    onChange={(e) => {
                      const srv = services.find(s => s.id.toString() === e.target.value);
                      setSelectedService(srv);
                    }}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm appearance-none"
                    style={{ backgroundColor: CSS_COLORS.background.muted }}
                    disabled={!selectedCategory || services.length === 0}
                  >
                    {services.length > 0 ? (
                      services.map((service) => (
                        <option key={service.id} value={service.id.toString()}>
                          {service.service_title} - Min {service.min_amount} | Max {service.max_amount}
                        </option>
                      ))
                    ) : (
                      <option value="">No services available</option>
                    )}
                  </select>
                )}
                {selectedService && (
                  <p className="text-sm text-gray-500 mt-2">
                    Min: {selectedService.min_amount} - Max: {selectedService.max_amount}
                  </p>
                )}
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Link</label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ backgroundColor: CSS_COLORS.background.muted }}
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={selectedService?.min_amount || 0}
                  max={selectedService?.max_amount || 1000000}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  style={{ backgroundColor: CSS_COLORS.background.muted }}
                />
              </div>

              {/* Average Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center space-x-1">
                  <span>Average time</span>
                  <Info className="w-4 h-4 text-gray-400" />
                </label>
                <input
                  type="text"
                  value="7 hours 51 minutes"
                  readOnly
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl"
                  style={{ backgroundColor: CSS_COLORS.background.muted }}
                />
              </div>

              {/* Charge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Charge</label>
                <input
                  type="text"
                  value={`${selectedCurrency.symbol} ${totalCost}`}
                  readOnly
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl"
                  style={{ backgroundColor: CSS_COLORS.background.muted }}
                />
              </div>

              {/* Submit Button */}
              <button
                className="w-full text-white font-semibold py-5 px-6 rounded-full shadow-lg text-lg"
                style={{ backgroundColor: CSS_COLORS.primary }}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Service Description */}
          <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm" style={{ backgroundColor: CSS_COLORS.background.card }}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Description</h3>
            <div className="p-4 rounded-xl mb-4 text-white" style={{ backgroundColor: CSS_COLORS.primary }}>
              <h4 className="font-medium mb-2">Service</h4>
              <p className="text-sm opacity-90">{selectedService?.service_title || "--"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                <h5 className="text-sm font-medium text-gray-600 mb-1">Start Time</h5>
                <p className="text-sm text-gray-800">--</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                <h5 className="text-sm font-medium text-gray-600 mb-1">Speed</h5>
                <p className="text-sm text-gray-800">--</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                <h5 className="text-sm font-medium text-gray-600 mb-1">Avg. Time</h5>
                <p className="text-sm text-gray-800 font-medium">7 hours 43 minutes</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                <h5 className="text-sm font-medium text-gray-600 mb-1">Guarantee</h5>
                <p className="text-sm text-gray-800">--</p>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-3">Description</h5>
              <div className="text-sm text-gray-700 space-y-3">
                <p className="font-medium">{selectedService?.description || "Cheapest & fastest working service in the world!"}</p>
                {selectedService?.description ? null : (
                  <>
                    <p>⚡ Provider service</p>
                    <p>🛡️ If order doesn't deliver, turn off flag for review and request refill to restart the order for free</p>
                    <div className="mt-4 p-4 border border-yellow-200 rounded-xl" style={{ backgroundColor: "#fefce8" }}>
                      <p className="font-medium text-gray-800 mb-2">IMPORTANT</p>
                      <p className="text-sm mb-2">Turn off flag for review:</p>
                      <ol className="list-decimal list-inside text-sm space-y-1">
                        <li>Go to "Settings and activity"</li>
                        <li>Select "Follow and invite friends"</li>
                        <li>Disable "Flag for review" feature</li>
                      </ol>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">© Copyright 2025 All Rights Reserved.</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto p-6">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Account Status */}
            <div className="rounded-2xl p-6 drop-shadow-md border border-gray-200 bg-white transition duration-300 hover:scale-[1.02]" style={{ backgroundColor: CSS_COLORS.background.card }}>
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="text-5xl">👑</div>
                <p className="text-sm text-gray-500">Account Status</p>
                <h3 className="text-xl font-bold text-gray-800">NEW</h3>
              </div>
            </div>

            {/* Username */}
            <div className="rounded-2xl p-6 drop-shadow-md border border-gray-200 bg-white transition duration-300 hover:scale-[1.02]" style={{ backgroundColor: CSS_COLORS.background.card }}>
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="text-5xl">👤</div>
                <p className="text-sm text-gray-500">Username</p>
                <h3 className="text-xl font-bold text-gray-800">{user?.username || "loading.."}</h3>
              </div>
            </div>

            {/* Account Balance */}
            <div className="rounded-2xl p-6 drop-shadow-md border border-gray-200 bg-white transition duration-300 hover:scale-[1.02]" style={{ backgroundColor: CSS_COLORS.background.card }}>
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="text-5xl">💰</div>
                <p className="text-sm text-gray-500">Account Balance</p>
                <h3 className="text-xl font-bold text-gray-800">₦0</h3>
              </div>
            </div>

            {/* Total Order */}
            <div className="rounded-2xl p-6 drop-shadow-md border border-gray-200 bg-white transition duration-300 hover:scale-[1.02]" style={{ backgroundColor: CSS_COLORS.background.card }}>
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="text-5xl">📦</div>
                <p className="text-sm text-gray-500">Total Order</p>
                <h3 className="text-xl font-bold text-gray-800">4,551,537</h3>
              </div>
            </div>
          </div>

          {/* Social Media Platforms */}
          <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm mb-6" style={{ backgroundColor: CSS_COLORS.background.card }}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Platform</h2>
            <div className="grid grid-cols-6 gap-4">
              {socialPlatforms.map((platform, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:scale-105 transition-all duration-200 cursor-pointer">
                  <div className="text-2xl mb-2">{platform.icon}</div>
                  <p className="text-sm font-medium text-gray-700">{platform.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Order Form */}
            <div className="flex-1">
              <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm" style={{ backgroundColor: CSS_COLORS.background.card }}>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Place your order</h2>

                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ backgroundColor: CSS_COLORS.background.muted }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
                    {loadingCategories ? (
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                        <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={selectedCategory?.id || ''}
                          onChange={(e) => {
                            const cat = categories.find(c => c.id.toString() === e.target.value);
                            setSelectedCategory(cat);
                          }}
                          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-sm lg:text-base appearance-none"
                          style={{ backgroundColor: CSS_COLORS.background.muted }}
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id.toString()}>
                              {category.category_title}
                            </option>
                          ))}
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                          {selectedCategory ? getPlatformIcon(selectedCategory.category_title) : <Globe className="w-5 h-5 text-gray-500" />}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Service</label>
                    {loadingServices ? (
                      <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                        <div className="h-4 bg-gray-300 rounded w-full animate-pulse"></div>
                      </div>
                    ) : (
                      <select
                        value={selectedService?.id || ''}
                        onChange={(e) => {
                          const srv = services.find(s => s.id.toString() === e.target.value);
                          setSelectedService(srv);
                        }}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm lg:text-base appearance-none"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                        disabled={!selectedCategory || services.length === 0}
                      >
                        {services.length > 0 ? (
                          services.map((service) => (
                            <option key={service.id} value={service.id.toString()}>
                              {service.service_title} - Min {service.min_amount} | Max {service.max_amount}
                            </option>
                          ))
                        ) : (
                          <option value="">No services available</option>
                        )}
                      </select>
                    )}
                    {selectedService && (
                      <p className="text-sm text-gray-500 mt-2">
                        Min: {selectedService.min_amount} - Max: {selectedService.max_amount}
                      </p>
                    )}
                  </div>

                  {/* Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Link</label>
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="Enter your profile/post URL"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ backgroundColor: CSS_COLORS.background.muted }}
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min={selectedService?.min_amount || 0}
                      max={selectedService?.max_amount || 1000000}
                      placeholder="Enter quantity"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      style={{ backgroundColor: CSS_COLORS.background.muted }}
                    />
                  </div>

                  {/* Average Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center space-x-1">
                      <span>Average time</span>
                      <Info className="w-4 h-4 text-gray-400" />
                    </label>
                    <div className="flex items-center space-x-2 p-4 border border-gray-200 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                      <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-sm lg:text-base font-medium text-gray-800">7 hours 43 minutes</span>
                    </div>
                  </div>

                  {/* Charge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Charge</label>
                    <div className="p-4 lg:p-6 border border-gray-200 rounded-xl" style={{ background: CSS_COLORS.background.secondary }}>
                      <div className="text-center">
                        <span className="text-2xl lg:text-3xl font-bold text-gray-800">
                          {selectedCurrency.symbol} {totalCost}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">Total Cost</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full text-white font-semibold py-4 lg:py-5 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity text-base lg:text-lg"
                    style={{ backgroundColor: CSS_COLORS.primary }}
                  >
                    Submit Order
                  </button>

                  {/* Mobile Service Description Toggle */}
                  <button
                    onClick={() => setShowServiceDescription(!showServiceDescription)}
                    className="xl:hidden w-full py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-all border border-white/50 backdrop-blur-sm"
                    style={{ backgroundColor: CSS_COLORS.background.muted, color: "#374151" }}
                  >
                    {showServiceDescription ? "Hide" : "Show"} Service Description
                  </button>
                </div>
              </div>
            </div>

            {/* Service Description Sidebar */}
            <div className={`xl:block xl:w-80 ${showServiceDescription ? "block" : "hidden"}`}>
              <div className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm sticky top-24" style={{ backgroundColor: CSS_COLORS.background.card }}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Description</h3>
                <div className="p-4 rounded-xl mb-4 text-white" style={{ backgroundColor: CSS_COLORS.primary }}>
                  <h4 className="font-medium mb-2">Service</h4>
                  <p className="text-sm opacity-90">{selectedService?.service_title || "--"}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                    <h5 className="text-sm font-medium text-gray-600 mb-1">Start Time</h5>
                    <p className="text-sm text-gray-800">--</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                    <h5 className="text-sm font-medium text-gray-600 mb-1">Speed</h5>
                    <p className="text-sm text-gray-800">--</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                    <h5 className="text-sm font-medium text-gray-600 mb-1">Avg. Time</h5>
                    <p className="text-sm text-gray-800 font-medium">7 hours 43 minutes</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                    <h5 className="text-sm font-medium text-gray-600 mb-1">Guarantee</h5>
                    <p className="text-sm text-gray-800">--</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-600 mb-3">Description</h5>
                  <div className="text-sm text-gray-700 space-y-3">
                    <p className="font-medium">{selectedService?.description || "Cheapest & fastest working service in the world!"}</p>
                    {selectedService?.description ? null : (
                      <>
                        <p>⚡ Provider service</p>
                        <p>🛡️ If order doesn't deliver, turn off flag for review and request refill to restart the order for free</p>
                        <div className="mt-4 p-4 border border-yellow-200 rounded-xl" style={{ backgroundColor: "#fefce8" }}>
                          <p className="font-medium text-gray-800 mb-2">IMPORTANT</p>
                          <p className="text-sm mb-2">Turn off flag for review:</p>
                          <ol className="list-decimal list-inside text-sm space-y-1">
                            <li>Go to "Settings and activity"</li>
                            <li>Select "Follow and invite friends"</li>
                            <li>Disable "Flag for review" feature</li>
                          </ol>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-8 p-4 lg:p-6 rounded-2xl lg:rounded-3xl text-white shadow-lg border border-white/20 backdrop-blur-sm" style={{ background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})` }}>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-white/20 rounded-2xl flex-shrink-0">
                <Info className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h3 className="text-lg lg:text-xl font-bold mb-2">
                  Service <span className="text-yellow-300">Updates</span>
                </h3>
                <div className="bg-white/10 rounded-2xl p-4">
                  <h4 className="font-semibold mb-2 text-yellow-300">🚨 Important Notice</h4>
                  <p className="text-sm lg:text-base text-white/90">
                    For any non-delivered orders, please contact our support team for immediate assistance and refund processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewOrder
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
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Camera,
  Video,
  Headphones,
  Send,
  Linkedin,
  Github,
  Play,
  Radio,
  Mic,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  Gamepad2,
  Monitor,
  Smartphone,
} from "lucide-react"
import toast from "react-hot-toast"
import { fetchUserData } from "../../services/userService"
import { fetchSmmCategories, fetchSmmServices, createOrder } from "../../services/services"
import { CSS_COLORS } from "../../components/constant/colors"
import { useOutletContext } from "react-router-dom"

const NewOrder = () => {
  // Get currency context from DashboardLayout
  const { 
    selectedCurrency, 
    convertToSelectedCurrency, 
    formatCurrency,
    user: contextUser
  } = useOutletContext();

  const [user, setUser] = useState(contextUser || null)
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [allServices, setAllServices] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [quantity, setQuantity] = useState("")
  const [link, setLink] = useState("")
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [showServiceDescription, setShowServiceDescription] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isLoadingAllServices, setIsLoadingAllServices] = useState(false)

  // Calculate converted amounts
  const convertedBalance = user?.balance ? convertToSelectedCurrency(user.balance, "NGN") : 0;
  const formattedBalance = formatCurrency(convertedBalance, selectedCurrency);
  
  // Fixed total cost calculation
  const totalCost = selectedService && quantity ? 
    convertToSelectedCurrency((quantity * selectedService.price)   / 1, "NGN") : 0;
  const formattedTotalCost = formatCurrency(totalCost, selectedCurrency);

  const getPlatformIcon = (categoryTitle) => {
    if (!categoryTitle) return <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />

    const cleanedTitle = categoryTitle.replace(/^[^a-zA-Z0-9]+/, "").toLowerCase()

    if (cleanedTitle.includes("instagram")) return <Instagram className="w-5 h-5 text-pink-500 flex-shrink-0" />
    if (cleanedTitle.includes("facebook")) return <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
    if (cleanedTitle.includes("youtube")) return <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />
    if (cleanedTitle.includes("twitter") || cleanedTitle.includes("x"))
      return <Twitter className="w-5 h-5 text-blue-400 flex-shrink-0" />
    if (cleanedTitle.includes("tiktok")) return <Video className="w-5 h-5 text-black flex-shrink-0" />
    if (cleanedTitle.includes("soundcloud")) return <Music className="w-5 h-5 text-orange-500 flex-shrink-0" />
    if (cleanedTitle.includes("twitch")) return <Twitch className="w-5 h-5 text-purple-500 flex-shrink-0" />
    if (cleanedTitle.includes("telegram")) return <Send className="w-5 h-5 text-blue-500 flex-shrink-0" />
    if (cleanedTitle.includes("linkedin")) return <Linkedin className="w-5 h-5 text-blue-700 flex-shrink-0" />
    if (cleanedTitle.includes("spotify")) return <Headphones className="w-5 h-5 text-green-500 flex-shrink-0" />
    if (cleanedTitle.includes("snapchat")) return <Camera className="w-5 h-5 text-yellow-400 flex-shrink-0" />
    if (cleanedTitle.includes("discord")) return <MessageSquare className="w-5 h-5 text-indigo-500 flex-shrink-0" />
    if (cleanedTitle.includes("reddit")) return <MessageCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
    if (cleanedTitle.includes("pinterest")) return <Heart className="w-5 h-5 text-red-600 flex-shrink-0" />
    if (cleanedTitle.includes("whatsapp")) return <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />

    return <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
  }

  const handleServiceSelect = async (service) => {
    console.log("Selected service:", service)
    
    // Find the category that matches this service
    const serviceCategory = categories.find(cat => cat.id === service.categoryId)
    console.log("Found category:", serviceCategory)
    
    if (serviceCategory) {
      // Set the selected category immediately to update the dropdown
      setSelectedCategory(serviceCategory)
      
      // Wait for category to update, then fetch services for that category
      try {
        setLoadingServices(true)
        const response = await fetchSmmServices(serviceCategory.id.toString())
        const categoryServices = response.data.data
        setServices(categoryServices)
        
        // Find and set the exact service from the category services
        const exactService = categoryServices.find(s => s.id === service.id)
        if (exactService) {
          setSelectedService(exactService)
          console.log("Set selected service:", exactService)
        } else {
          // If exact match not found, set the first service from the category
          setSelectedService(categoryServices.length > 0 ? categoryServices[0] : null)
        }
      } catch (err) {
        console.error("Error fetching services for selected category:", err)
        toast.error("Failed to load services for selected category")
      } finally {
        setLoadingServices(false)
      }
    }
    
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.length > 0) {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  const handleSearchFocus = () => {
    if (searchQuery.length > 0 && allServices.length > 0) {
      setShowSearchResults(true)
    }
  }

  const handleSearchBlur = () => {
    // Delay hiding to allow for item selection
    setTimeout(() => {
      setShowSearchResults(false)
    }, 200)
  }

  const loadAllServices = async () => {
    if (allServices.length > 0 || isLoadingAllServices) return
    
    setIsLoadingAllServices(true)
    try {
      console.log("Loading all services...")
      const allServicesData = []
      
      // Fetch services for all categories
      for (const category of categories) {
        try {
          console.log(`Fetching services for category: ${category.category_title}`)
          const response = await fetchSmmServices(category.id.toString())
          const servicesData = response.data.data
          console.log(`Found ${servicesData.length} services for ${category.category_title}`)
          
          // Add category information to each service
          const servicesWithCategory = servicesData.map(service => ({
            ...service,
            categoryName: category.category_title,
            categoryId: category.id
          }))
          
          allServicesData.push(...servicesWithCategory)
        } catch (err) {
          console.error(`Error fetching services for category ${category.id}:`, err)
        }
      }
      
      console.log("Total services loaded:", allServicesData.length)
      setAllServices(allServicesData)
    } catch (err) {
      console.error("Error loading all services:", err)
      toast.error("Failed to load services for search")
    } finally {
      setIsLoadingAllServices(false)
    }
  }

  // Filter services based on search query
  const searchResults = searchQuery && allServices.length > 0
    ? allServices.filter(service => {
        const searchLower = searchQuery.toLowerCase()
        return (
          service.service_title?.toLowerCase().includes(searchLower) ||
          service.description?.toLowerCase().includes(searchLower) ||
          service.categoryName?.toLowerCase().includes(searchLower)
        )
      })
    : [];

  const handleSubmitOrder = async () => {
    if (!selectedCategory || !selectedService || !quantity || !link) {
      toast.error("Please fill all required fields")
      return
    }

    if (quantity < selectedService.min_amount || quantity > selectedService.max_amount) {
      toast.error(`Quantity must be between ${selectedService.min_amount} and ${selectedService.max_amount}`)
      return
    }

    setIsSubmitting(true)
    setOrderStatus(null)

    try {
      const orderData = {
        category: selectedCategory.id,
        service: selectedService.id,
        link,
        quantity: Number.parseInt(quantity),
        check: true,
      }

      const response = await createOrder(orderData)
      
      const orderId = response.order_id || response.data?.order_id
      
      if (!orderId) {
        throw new Error("Order ID not received in response")
      }

      setOrderStatus({
        success: true,
        message: "Order submitted successfully!",
        orderId: orderId,
      })

      toast.success("Order submitted successfully!")

      // Reset form
      setQuantity("")
      setLink("")
      setSelectedService(null)
    } catch (error) {
      console.error("Order submission error:", error)
      setOrderStatus({
        success: false,
        message: error.response?.data?.message || error.message || "Failed to submit order",
      })
      toast.error(error.response?.data?.message || error.message || "Failed to submit order")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fetch user if not available from context
  useEffect(() => {
    if (!contextUser) {
      const fetchUser = async () => {
        try {
          const response = await fetchUserData()
          setUser(response.data)
        } catch (err) {
          toast.error("Failed to fetch user info")
        }
      }
      fetchUser()
    }
  }, [contextUser])

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
        // Only set selected service if it's not already set or if it doesn't belong to current category
        if (!selectedService || selectedService.category !== selectedCategory.id) {
          setSelectedService(srv.length > 0 ? srv[0] : null)
        }
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

  // Load all services when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && allServices.length === 0) {
      loadAllServices()
    }
  }, [categories])

  const socialPlatforms = [
    { name: "Instagram", icon: Instagram, bgColor: "#e4405f" },
    { name: "Facebook", icon: Facebook, bgColor: "#1877f2" },
    { name: "Youtube", icon: Youtube, bgColor: "#ff0000" },
    { name: "Twitter/X", icon: Twitter, bgColor: "#1da1f2" },
    { name: "TikTok", icon: Video, bgColor: "#000000" },
    { name: "LinkedIn", icon: Linkedin, bgColor: "#0077b5" },
    { name: "Spotify", icon: Headphones, bgColor: "#1db954" },
    { name: "Snapchat", icon: Camera, bgColor: "#fffc00" },
    { name: "Telegram", icon: Send, bgColor: "#0088cc" },
    { name: "SoundCloud", icon: Music, bgColor: "#ff5500" },
    { name: "Twitch", icon: Twitch, bgColor: "#9146ff" },
    { name: "Discord", icon: MessageSquare, bgColor: "#5865f2" },
    { name: "Reddit", icon: MessageCircle, bgColor: "#ff4500" },
    { name: "Pinterest", icon: Heart, bgColor: "#bd081c" },
    { name: "WhatsApp", icon: Phone, bgColor: "#25d366" },
    { name: "GitHub", icon: Github, bgColor: "#333333" },
    { name: "Clubhouse", icon: Mic, bgColor: "#f1c40f" },
    { name: "Vimeo", icon: Play, bgColor: "#1ab7ea" },
    { name: "Podcast", icon: Radio, bgColor: "#9b59b6" },
    { name: "Gaming", icon: Gamepad2, bgColor: "#e74c3c" },
    { name: "Website Traffic", icon: Globe, bgColor: "#6b7280" },
    { name: "App Downloads", icon: Smartphone, bgColor: "#34495e" },
    { name: "Live Streaming", icon: Monitor, bgColor: "#e67e22" },
    { name: "Email Marketing", icon: Mail, bgColor: "#3498db" },
  ]

  const getServiceMetrics = () => {
    if (!selectedService) return null

    const startTime = selectedService.start_time || "5-30 minutes"
    const speed = selectedService.speed || "100-1000/hour"
    const avgTime = selectedService.avg_time || "7 hours 43 minutes"
    const guarantee = selectedService.guarantee || "30 days"

    return { startTime, speed, avgTime, guarantee }
  }

  const metrics = getServiceMetrics()

  // Search Results Dropdown Component
  const SearchResultsDropdown = () => {
    if (!showSearchResults || !searchQuery) return null

    if (isLoadingAllServices) {
      return (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-4 text-center">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-500" />
            <p className="text-sm text-gray-500 mt-2">Loading services...</p>
          </div>
        </div>
      )
    }

    if (searchResults.length === 0 && searchQuery.length > 0) {
      return (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No services found for "{searchQuery}"</p>
            <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
          </div>
        </div>
      )
    }

    return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
        <div className="p-2">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500">
              Found {searchResults.length} service{searchResults.length !== 1 ? 's' : ''}
            </p>
          </div>
          {searchResults.slice(0, 20).map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getPlatformIcon(service.categoryName)}
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {service.categoryName}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800 text-sm mb-1">
                    {service.service_title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {service.description || "No description available"}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-green-600 font-medium">
                      {formatCurrency(convertToSelectedCurrency(service.price   / 1, "NGN"), selectedCurrency)} per 1k
                    </span>
                    <span className="text-xs text-gray-500">
                      Min: {service.min_amount} | Max: {service.max_amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {searchResults.length > 20 && (
            <div className="px-3 py-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Showing first 20 of {searchResults.length} services
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order Status Alert */}
      {orderStatus && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
            orderStatus.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <div className="flex items-start">
            {orderStatus.success ? (
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">{orderStatus.success ? "Success!" : "Error!"}</p>
              <p className="text-sm">{orderStatus.message}</p>
              {orderStatus.success && orderStatus.orderId && (
                <p className="text-xs mt-1">Order ID: {orderStatus.orderId}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="container mx-auto p-4 space-y-6">
          {/* Stats Cards - Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">💰</div>
                <div>
                  <p className="text-xs text-gray-500">Balance</p>
                  <h3 className="text-lg font-bold text-gray-800 truncate">{formattedBalance}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">👑</div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <h3 className="text-lg font-bold text-gray-800 truncate">{user?.status || "NEW"}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">👤</div>
                <div>
                  <p className="text-xs text-gray-500">Username</p>
                  <h3 className="text-lg font-bold text-gray-800 truncate">{user?.username || "loading.."}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📦</div>
                <div>
                  <p className="text-xs text-gray-500">Orders</p>
                  <h3 className="text-lg font-bold text-gray-800">{user?.total_orders || "0"}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Platforms - Mobile */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Platforms</h2>
            <div className="grid grid-cols-3 gap-3">
              {socialPlatforms.slice(0, 6).map((platform, index) => {
                const IconComponent = platform.icon
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-3 text-center hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-100"
                  >
                    <div
                      className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: platform.bgColor }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-gray-700 truncate">{platform.name}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons - Mobile */}
          <div className="flex gap-3">
            <button
              className="flex-1 text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-lg"
              style={{ backgroundColor: CSS_COLORS.primary }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>New order</span>
            </button>
            <button
              className="flex-1 py-4 rounded-xl font-medium flex items-center justify-center space-x-2 border border-gray-200 bg-white text-gray-700"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Mass order</span>
            </button>
          </div>

          {/* Order Form - Mobile */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Place Your Order</h2>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                />
                <SearchResultsDropdown />
              </div>

              {/* Category & Service Row */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  {loadingCategories ? (
                    <div className="p-3 border border-gray-200 rounded-xl bg-gray-50 animate-pulse">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedCategory?.id || ""}
                        onChange={(e) => {
                          const cat = categories.find((c) => c.id.toString() === e.target.value)
                          setSelectedCategory(cat)
                          setSearchQuery("")
                          setShowSearchResults(false)
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm appearance-none bg-gray-50"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id.toString()}>
                            {category.category_title}
                          </option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        {selectedCategory ? (
                          getPlatformIcon(selectedCategory.category_title)
                        ) : (
                          <Globe className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  {loadingServices ? (
                    <div className="p-3 border border-gray-200 rounded-xl bg-gray-50 animate-pulse">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                  ) : (
                    <select
                      value={selectedService?.id || ""}
                      onChange={(e) => {
                        const srv = services.find((s) => s.id.toString() === e.target.value)
                        if (srv) {
                          setSelectedService(srv)
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm appearance-none bg-gray-50"
                      disabled={!selectedCategory || services.length === 0}
                    >
                      {services.length > 0 ? (
                        services.map((service) => (
                          <option key={service.id} value={service.id.toString()}>
                            {service.service_title} - {formatCurrency(
                              convertToSelectedCurrency(service.price   / 1, "NGN"),
                              selectedCurrency
                            )} per 1k
                          </option>
                        ))
                      ) : (
                        <option value="">No services available</option>
                      )}
                    </select>
                  )}
                  {selectedService && (
                    <p className="text-xs text-gray-500 mt-2">
                      Min: {selectedService.min_amount} - Max: {selectedService.max_amount}
                    </p>
                  )}
                </div>
              </div>

              {/* Link & Quantity */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="Enter your profile/post URL"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min={selectedService?.min_amount || 0}
                    max={selectedService?.max_amount || 1000000}
                    placeholder="Enter quantity"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50"
                    required
                  />
                </div>
              </div>

              {/* Cost Summary - Mobile */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-800">{formattedTotalCost}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {quantity} units × {selectedService ? formatCurrency(convertToSelectedCurrency(selectedService.price   / 1, "NGN"), selectedCurrency) : '0'} per 1k
                  </p>
                </div>
              </div>

              {/* Submit Button - Mobile */}
              <button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full text-white font-semibold py-4 rounded-xl shadow-lg text-lg flex items-center justify-center transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: CSS_COLORS.primary }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Order"
                )}
              </button>
            </div>
          </div>

          {/* Service Description - Mobile */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Details</h3>
            
            {/* Service Header */}
            <div className="bg-blue-600 rounded-xl p-4 text-white mb-4">
              <div className="flex items-center space-x-3 mb-2">
                {selectedCategory && getPlatformIcon(selectedCategory.category_title)}
                <h4 className="font-medium">Service</h4>
              </div>
              <p className="text-sm opacity-90">{selectedService?.service_title || "Select a service"}</p>
            </div>

            {/* Service Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <h5 className="text-xs font-medium text-gray-600 mb-1">Start Time</h5>
                <p className="text-sm text-gray-800">{metrics?.startTime || "--"}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <h5 className="text-xs font-medium text-gray-600 mb-1">Speed</h5>
                <p className="text-sm text-gray-800">{metrics?.speed || "--"}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <h5 className="text-xs font-medium text-gray-600 mb-1">Avg. Time</h5>
                <p className="text-sm text-gray-800 font-medium">{metrics?.avgTime || "--"}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <h5 className="text-xs font-medium text-gray-600 mb-1">Guarantee</h5>
                <p className="text-sm text-gray-800">{metrics?.guarantee || "--"}</p>
              </div>
            </div>

            {/* Service Description */}
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-3">Description</h5>
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium">
                  {selectedService?.description || "Select a service to view description"}
                </p>
                {!selectedService?.description && (
                  <>
                    <p>⚡ High-quality service delivery</p>
                    <p>🛡️ 30-day guarantee on all orders</p>
                    <p>🚀 Fast and reliable results</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto p-6">
          {/* Top Stats Cards - Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">💰</div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Balance</p>
                  <h3 className="text-2xl font-bold text-gray-800">{formattedBalance}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">👑</div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Status</p>
                  <h3 className="text-xl font-bold text-gray-800">{user?.status || "NEW"}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">👤</div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Username</p>
                  <h3 className="text-xl font-bold text-gray-800">{user?.username || "loading.."}</h3>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">📦</div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                  <h3 className="text-2xl font-bold text-gray-800">{user?.total_orders || "0"}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Social Platforms Section - Desktop (NOW ABOVE ORDER FORM) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Social Media Platforms</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {socialPlatforms.map((platform, index) => {
                const IconComponent = platform.icon
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 text-center hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200"
                  >
                    <div
                      className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: platform.bgColor }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate">{platform.name}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="flex gap-4 mb-8">
            <button
              className="flex-1 text-white py-4 rounded-xl font-medium flex items-center justify-center space-x-2 shadow-lg transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: CSS_COLORS.primary }}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-lg">New Order</span>
            </button>
            <button
              className="flex-1 py-4 rounded-xl font-medium flex items-center justify-center space-x-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-lg">Mass Order</span>
            </button>
          </div>

          {/* Main Content Area - Order Form & Description */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Order Form - Takes 2/3 of the space */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Place Your Order</h2>
                <div className="space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-lg"
                    />
                    <SearchResultsDropdown />
                  </div>

                  {/* Category & Service */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">Category</label>
                      {loadingCategories ? (
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 animate-pulse">
                          <div className="h-4 bg-gray-300 rounded"></div>
                        </div>
                      ) : (
                        <div className="relative">
                          <select
                            value={selectedCategory?.id || ""}
                            onChange={(e) => {
                              const cat = categories.find((c) => c.id.toString() === e.target.value)
                              setSelectedCategory(cat)
                              setSearchQuery("")
                              setShowSearchResults(false)
                            }}
                            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl appearance-none bg-gray-50 text-lg"
                          >
                            {categories.map((category) => (
                              <option key={category.id} value={category.id.toString()}>
                                {category.category_title}
                              </option>
                            ))}
                          </select>
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            {selectedCategory ? (
                              getPlatformIcon(selectedCategory.category_title)
                            ) : (
                              <Globe className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">Service</label>
                      {loadingServices ? (
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 animate-pulse">
                          <div className="h-4 bg-gray-300 rounded"></div>
                        </div>
                      ) : (
                        <select
                          value={selectedService?.id || ""}
                          onChange={(e) => {
                            const srv = services.find((s) => s.id.toString() === e.target.value)
                            if (srv) {
                              setSelectedService(srv)
                            }
                          }}
                          className="w-full px-4 py-4 border border-gray-200 rounded-xl appearance-none bg-gray-50 text-lg"
                          disabled={!selectedCategory || services.length === 0}
                        >
                          {services.length > 0 ? (
                            services.map((service) => (
                              <option key={service.id} value={service.id.toString()}>
                                {service.service_title} - {formatCurrency(
                                  convertToSelectedCurrency(service.price   / 1, "NGN"),
                                  selectedCurrency
                                )} per 1k
                              </option>
                            ))
                          ) : (
                            <option value="">No services available</option>
                          )}
                        </select>
                      )}
                      {selectedService && (
                        <p className="text-sm text-gray-500 mt-3">
                          Min: {selectedService.min_amount} - Max: {selectedService.max_amount}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Link & Quantity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">Link</label>
                      <input
                        type="url"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Enter your profile/post URL"
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min={selectedService?.min_amount || 0}
                        max={selectedService?.max_amount || 1000000}
                        placeholder="Enter quantity"
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50 text-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* Cost Summary - Desktop */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="text-center">
                      <p className="text-xl text-gray-600 mb-3">Total Cost</p>
                      <p className="text-4xl font-bold text-gray-800 mb-3">{formattedTotalCost}</p>
                      <p className="text-lg text-gray-500">
                        {quantity} units × {selectedService ? formatCurrency(convertToSelectedCurrency(selectedService.price   / 1, "NGN"), selectedCurrency) : '0'} per 1k
                      </p>
                    </div>
                  </div>

                  {/* Submit Button - Desktop */}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="w-full text-white font-semibold py-5 rounded-xl shadow-lg text-xl flex items-center justify-center transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: CSS_COLORS.primary }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      "Submit Order"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Service Description - Takes 1/3 of the space */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Service Details</h3>
                
                {/* Service Header */}
                <div className="bg-blue-600 rounded-xl p-4 text-white mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    {selectedCategory && getPlatformIcon(selectedCategory.category_title)}
                    <h4 className="font-medium text-lg">Service</h4>
                  </div>
                  <p className="text-base opacity-90">{selectedService?.service_title || "Select a service"}</p>
                </div>

                {/* Service Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Start Time</h5>
                    <p className="text-base text-gray-800">{metrics?.startTime || "--"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Speed</h5>
                    <p className="text-base text-gray-800">{metrics?.speed || "--"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Avg. Time</h5>
                    <p className="text-base text-gray-800 font-medium">{metrics?.avgTime || "--"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="text-sm font-medium text-gray-600 mb-2">Guarantee</h5>
                    <p className="text-base text-gray-800">{metrics?.guarantee || "--"}</p>
                  </div>
                </div>

                {/* Service Description */}
                <div>
                  <h5 className="text-lg font-medium text-gray-600 mb-4">Description</h5>
                  <div className="text-base text-gray-700 space-y-3">
                    <p className="font-medium">
                      {selectedService?.description || "Select a service to view detailed description and features."}
                    </p>
                    {!selectedService?.description && (
                      <>
                        <p>⚡ High-quality service delivery with guaranteed results</p>
                        <p>🛡️ 30-day guarantee on all orders with free refills</p>
                        <p>🚀 Fast and reliable delivery with real-time updates</p>
                        <p>💯 100% customer satisfaction guaranteed</p>
                      </>
                    )}
                  </div>
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
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
import { 
  fetchSmmCategories, 
  fetchSmmServices, 
  createOrder, 
  searchServicesFast
} from "../../services/services"
import { CSS_COLORS } from "../../components/constant/colors"
import { useOutletContext } from "react-router-dom"

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const NewOrder = () => {
  const { selectedCurrency, convertToSelectedCurrency, formatCurrency, user: contextUser } = useOutletContext();

  const [user, setUser] = useState(contextUser || null)
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [quantity, setQuantity] = useState("")
  const [link, setLink] = useState("")
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const convertedBalance = user?.balance ? convertToSelectedCurrency(user.balance, "NGN") : 0;
  const formattedBalance = formatCurrency(convertedBalance, selectedCurrency);

  const totalCost = selectedService && quantity ? 
    convertToSelectedCurrency((quantity * selectedService.price) / 1, "NGN") : 0;
  const formattedTotalCost = formatCurrency(totalCost, selectedCurrency);

  const getPlatformIcon = (categoryTitle) => {
    if (!categoryTitle) return <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
    const cleanedTitle = categoryTitle.replace(/^[^a-zA-Z0-9]+/, "").toLowerCase()
    if (cleanedTitle.includes("instagram")) return <Instagram className="w-5 h-5 text-pink-500 flex-shrink-0" />
    if (cleanedTitle.includes("facebook")) return <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
    if (cleanedTitle.includes("youtube")) return <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />
    if (cleanedTitle.includes("twitter") || cleanedTitle.includes("x")) return <Twitter className="w-5 h-5 text-blue-400 flex-shrink-0" />
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
    // Auto-fill category & service
    const serviceCategory = categories.find(cat => cat.id === service.category?.id || cat.id === service.categoryId)
    if (serviceCategory) setSelectedCategory(serviceCategory)
    setSelectedService(service)
    setSearchQuery("")
    setShowSearchResults(false)

    // Fetch services for category if needed
    if (!services.find(s => s.id === service.id)) {
      setLoadingServices(true)
      try {
        const response = await fetchSmmServices(serviceCategory.id.toString())
        setServices(response.data.data)
      } catch (err) {
        toast.error("Failed to fetch services for selected category")
      } finally {
        setLoadingServices(false)
      }
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    setShowSearchResults(query.length > 0)
  }

  const handleSearchFocus = () => { if (searchQuery.length > 0) setShowSearchResults(true) }
  const handleSearchBlur = () => { setTimeout(() => setShowSearchResults(false), 200) }

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
        setIsSearching(true)
        try {
          const response = await searchServicesFast(debouncedSearchQuery, 20)
          setSearchResults(response.data.data || [])
        } catch (error) {
          setSearchResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }
    performSearch()
  }, [debouncedSearchQuery])

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
        quantity: Number(quantity),
        check: true,
      }
      const response = await createOrder(orderData)
      const orderId = response.order_id || response.data?.order_id
      const newBalance = response.balance

      setOrderStatus({ success: true, message: "Order submitted successfully!", orderId })
      if (newBalance !== undefined) setUser(prev => ({ ...prev, balance: newBalance }))

      setQuantity("")
      setLink("")
      setSelectedService(null)
      toast.success("Order submitted successfully!")
    } catch (error) {
      setOrderStatus({ success: false, message: error.response?.data?.message || error.message || "Failed to submit order" })
      toast.error(error.response?.data?.message || error.message || "Failed to submit order")
    } finally { setIsSubmitting(false) }
  }

  useEffect(() => {
    if (!contextUser) {
      fetchUserData().then(res => setUser(res.data)).catch(() => toast.error("Failed to fetch user info"))
    }
  }, [contextUser])

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        const response = await fetchSmmCategories()
        setCategories(response.data.data)
        if (response.data.data.length > 0) setSelectedCategory(response.data.data[0])
      } catch (err) { toast.error("Failed to fetch categories") }
      finally { setLoadingCategories(false) }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (!selectedCategory) return
    const fetchServices = async () => {
      setLoadingServices(true)
      try {
        const response = await fetchSmmServices(selectedCategory.id.toString())
        setServices(response.data.data)
        if (!selectedService || selectedService.categoryId !== selectedCategory.id) setSelectedService(response.data.data[0] || null)
      } catch (err) { toast.error("Failed to fetch services"); setServices([]); setSelectedService(null) }
      finally { setLoadingServices(false) }
    }
    fetchServices()
  }, [selectedCategory])

  const SearchResultsDropdown = () => {
    if (!showSearchResults || !searchQuery) return null
    if (isSearching) return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center">
        <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-500" />
        <p className="text-sm text-gray-500 mt-2">Searching services...</p>
      </div>
    )
    if (searchResults.length === 0) return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center">
        <p className="text-sm text-gray-500">No services found for "{searchQuery}"</p>
      </div>
    )
    return (
      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg">
        {searchResults.map(service => (
          <div
            key={service.id}
            onClick={() => handleServiceSelect(service)}
            className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border-b border-gray-100 last:border-b-0"
          >
            <h4 className="font-medium text-gray-800 text-sm">{service.service_title}</h4>
            <p className="text-xs text-gray-500">{service.category?.category_title}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Search and Order Form */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Place Your Order</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <SearchResultsDropdown />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory?.id || ""}
              onChange={(e) => {
                const cat = categories.find(c => c.id.toString() === e.target.value)
                setSelectedCategory(cat)
                setSelectedService(null)
                setSearchQuery("")
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.category_title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              value={selectedService?.id || ""}
              onChange={e => {
                const srv = services.find(s => s.id.toString() === e.target.value)
                if (srv) setSelectedService(srv)
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
            >
              {services.map(s => <option key={s.id} value={s.id}>{s.service_title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link</label>
            <input
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="Enter profile/post URL"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              min={selectedService?.min_amount || 1}
              max={selectedService?.max_amount || 1000000}
              placeholder="Enter quantity"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50"
            />
          </div>
          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="w-full text-white py-4 rounded-xl font-semibold bg-blue-600 hover:opacity-90 transition-all"
          >
            {isSubmitting ? "Processing..." : "Submit Order"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewOrder

"use client"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Video,
  Music,
  Twitch,
  Send,
  Linkedin,
  Headphones,
  Camera,
  MessageSquare,
  MessageCircle,
  Heart,
  Phone,
  Globe,
} from "lucide-react"
import { fetchUserData } from "../../../services/userService"
import {
  fetchSmmCategories,
  fetchSmmServices,
  createOrder,
  searchServicesFast,
} from "../../../services/services"
import { useOutletContext } from "react-router-dom"

// Import components
import StatsCards from "./StatsCards"
import SearchBar from "./SearchBar"
import OrderForm from "./OrderForm"
import ServiceDetails from "./ServiceDetails"
import PlatformGrid from "./PlatformGrid"
import OrderStatusAlert from "./OrderStatusAlert"
import BalanceWarning from "./BalanceWarning"

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const NewOrder = () => {
  // Get currency context from DashboardLayout
  const context = useOutletContext();
  const {
    selectedCurrency,
    convertToSelectedCurrency,
    formatCurrency: contextFormatCurrency,
    user: contextUser
  } = context || {};

  // Fallback formatCurrency if not provided in context
  const formatCurrency = contextFormatCurrency || ((amount, currency) => {
    if (!currency || amount === null || amount === undefined) return '0.00';
    const formattedAmount = parseFloat(amount).toFixed(2);
    return `${currency?.symbol || '₦'} ${formattedAmount}`;
  });

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isLoadingAllServices, setIsLoadingAllServices] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Calculate converted amounts
  const convertedBalance = user?.balance ? convertToSelectedCurrency(user.balance, "NGN") : 0;
  const formattedBalance = formatCurrency(convertedBalance, selectedCurrency);

  // Fixed total cost calculation
  const totalCost = selectedService && quantity ?
    convertToSelectedCurrency((quantity * selectedService.price) / 1, "NGN") : 0;
  const formattedTotalCost = formatCurrency(totalCost, selectedCurrency);

  // Get platform icon with modern styling
  const getPlatformIcon = (categoryTitle, serviceTitle = null) => {
    // Check service title first if provided (more specific)
    const titleToCheck = serviceTitle || categoryTitle || ""
    if (!titleToCheck) return <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />

    const cleanedTitle = titleToCheck.replace(/^[^a-zA-Z0-9]+/, "").toLowerCase()

    // TikTok - modern video icon
    if (cleanedTitle.includes("tiktok")) return <Video className="w-5 h-5 text-black dark:text-white flex-shrink-0" />

    // Facebook - modern blue icon
    if (cleanedTitle.includes("facebook")) return <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />

    // Instagram - gradient pink/purple icon
    if (cleanedTitle.includes("instagram")) return <Instagram className="w-5 h-5 text-pink-500 flex-shrink-0" />

    // YouTube - red icon
    if (cleanedTitle.includes("youtube")) return <Youtube className="w-5 h-5 text-red-600 flex-shrink-0" />

    // Twitter/X - modern blue icon
    if (cleanedTitle.includes("twitter") || cleanedTitle.includes("x"))
      return <Twitter className="w-5 h-5 text-blue-400 flex-shrink-0" />

    // SoundCloud - orange icon
    if (cleanedTitle.includes("soundcloud")) return <Music className="w-5 h-5 text-orange-500 flex-shrink-0" />

    // Twitch - purple icon
    if (cleanedTitle.includes("twitch")) return <Twitch className="w-5 h-5 text-purple-500 flex-shrink-0" />

    // Telegram - blue icon
    if (cleanedTitle.includes("telegram")) return <Send className="w-5 h-5 text-blue-500 flex-shrink-0" />

    // LinkedIn - professional blue icon
    if (cleanedTitle.includes("linkedin")) return <Linkedin className="w-5 h-5 text-blue-700 flex-shrink-0" />

    // Spotify - green icon
    if (cleanedTitle.includes("spotify")) return <Headphones className="w-5 h-5 text-green-500 flex-shrink-0" />

    // Snapchat - yellow icon
    if (cleanedTitle.includes("snapchat")) return <Camera className="w-5 h-5 text-yellow-400 flex-shrink-0" />

    // Discord - indigo icon
    if (cleanedTitle.includes("discord")) return <MessageSquare className="w-5 h-5 text-indigo-500 flex-shrink-0" />

    // Reddit - orange icon
    if (cleanedTitle.includes("reddit")) return <MessageCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />

    // Pinterest - red icon
    if (cleanedTitle.includes("pinterest")) return <Heart className="w-5 h-5 text-red-600 flex-shrink-0" />

    // WhatsApp - green icon
    if (cleanedTitle.includes("whatsapp")) return <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />

    return <Globe className="w-5 h-5 text-gray-500 flex-shrink-0" />
  }

  const handleServiceSelect = async (service) => {
    console.log("Selected service from search:", service)

    // Clear search UI immediately for better UX
    setSearchQuery("")
    setShowSearchResults(false)

    // Find the category - try multiple methods
    let serviceCategory = categories.find(cat => cat.id === service.category_id)

    // If not found, try finding by category object
    if (!serviceCategory && service.category) {
      serviceCategory = categories.find(cat => cat.id === service.category.id)
    }

    console.log("Found category for service:", serviceCategory)

    if (serviceCategory) {
      // Set the selected category first
      setSelectedCategory(serviceCategory)

      try {
        setLoadingServices(true)
        const response = await fetchSmmServices(serviceCategory.id.toString())
        const categoryServices = response.data.data
        setServices(categoryServices)

        // Find the exact service from the category services
        const exactService = categoryServices.find(s => s.id === service.id)

        if (exactService) {
          // Successfully found exact match
          setSelectedService(exactService)
          setQuantity(exactService.min_amount.toString())

          console.log("Successfully set selected service:", exactService)
          toast.success(`Selected: ${exactService.service_title}`)
        } else {
          // Fallback: try to find by title match
          const similarService = categoryServices.find(s =>
            s.service_title.toLowerCase() === service.service_title.toLowerCase()
          )

          if (similarService) {
            setSelectedService(similarService)
            setQuantity(similarService.min_amount.toString())
            toast.success(`Selected: ${similarService.service_title}`)
          } else {
            // Last fallback: use first service
            const firstService = categoryServices[0]
            if (firstService) {
              setSelectedService(firstService)
              setQuantity(firstService.min_amount.toString())
              toast.info(`Category selected. Please choose your specific service.`)
            }
          }
        }
      } catch (err) {
        console.error("Error fetching services for selected category:", err)
        toast.error("Failed to load services for selected category")
      } finally {
        setLoadingServices(false)
      }
    } else {
      console.warn("No category found for service:", service)
      toast.error("Could not find category for selected service. Please try again.")
    }

    // Clear search results
    setSearchResults([])
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length > 0) {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
      setSearchResults([])
    }
  }

  const handleSearchFocus = () => {
    if (searchQuery.length > 0 && searchResults.length > 0) {
      setShowSearchResults(true)
    }
  }

  const handleSearchBlur = () => {
    // Delay hiding to allow for item selection
    setTimeout(() => {
      setShowSearchResults(false)
    }, 300)
  }

  // Enhanced search effect - more sensitive and comprehensive
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
        setIsSearching(true)
        try {
          console.log("Searching for:", debouncedSearchQuery)
          const response = await searchServicesFast(debouncedSearchQuery, 50)

          // Ensure we have the proper service data structure
          const allResults = response.data.data || []

          console.log("Raw search results:", allResults)

          // More sensitive search with better matching
          const sensitiveResults = allResults.filter(service => {
            const searchTerm = debouncedSearchQuery.toLowerCase()
            const serviceTitle = service.service_title?.toLowerCase() || ''
            const serviceDesc = service.description?.toLowerCase() || ''
            const categoryName = service.category?.category_title?.toLowerCase() || ''

            return (
              serviceTitle.includes(searchTerm) ||
              serviceDesc.includes(searchTerm) ||
              categoryName.includes(searchTerm) ||
              searchTerm.split(' ').some(word =>
                serviceTitle.includes(word) ||
                serviceDesc.includes(word) ||
                categoryName.includes(word)
              )
            )
          })

          console.log(`Found ${sensitiveResults.length} sensitive results`)

          // Ensure each service has the category_id properly set
          const resultsWithCategoryId = sensitiveResults.map(service => ({
            ...service,
            category_id: service.category_id || service.category?.id,
            // Ensure we have category info for later use
            category: service.category || { id: service.category_id }
          }))

          setSearchResults(resultsWithCategoryId)
        } catch (error) {
          console.error('Search API error:', error)
          // Fallback to client-side search if API fails
          performClientSideSearch()
        } finally {
          setIsSearching(false)
        }
      } else {
        setSearchResults([])
        setIsSearching(false)
      }
    }

    const performClientSideSearch = () => {
      if (allServices.length > 0 && debouncedSearchQuery.length >= 2) {
        const searchTerm = debouncedSearchQuery.toLowerCase()
        const results = allServices.filter(service => {
          const serviceTitle = service.service_title?.toLowerCase() || ''
          const serviceDesc = service.description?.toLowerCase() || ''
          const categoryName = service.categoryName?.toLowerCase() || ''

          return (
            serviceTitle.includes(searchTerm) ||
            serviceDesc.includes(searchTerm) ||
            categoryName.includes(searchTerm) ||
            searchTerm.split(' ').some(word =>
              serviceTitle.includes(word) ||
              serviceDesc.includes(word) ||
              categoryName.includes(word)
            )
          )
        })
        setSearchResults(results.slice(0, 30))
      }
    }

    performSearch()
  }, [debouncedSearchQuery, allServices])

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
      const newBalance = response.balance

      if (!orderId) {
        throw new Error("Order ID not received in response")
      }

      setOrderStatus({
        success: true,
        message: "Order submitted successfully!",
        orderId: orderId,
      })

      // Update user balance in frontend state
      if (newBalance !== undefined) {
        setUser(prevUser => ({
          ...prevUser,
          balance: newBalance
        }))
      }

      toast.success("Order submitted successfully!")

      // Reset form
      setQuantity("")
      setLink("")
      setSelectedService(null)
    } catch (error) {
      console.error("Order submission error:", error)

      let errorMessage = "Failed to submit order"
      let showDetailedError = false

      // Enhanced error handling for different error types
      if (error.response?.data) {
        const serverError = error.response.data

        // Handle specific error messages from backend
        if (serverError.message) {
          errorMessage = serverError.message

          // Show detailed information for specific errors
          if (serverError.message.includes('Insufficient balance') && serverError.shortfall) {
            errorMessage += ` You need $${serverError.shortfall} more.`
            showDetailedError = true
          }

          // Handle duplicate order error
          if (serverError.message.includes('active order with this link')) {
            errorMessage = "❌ " + serverError.message
          }

          // Handle service unavailable errors
          if (serverError.message.includes('Service not found') ||
            serverError.message.includes('currently unavailable')) {
            errorMessage = "⚠️ " + serverError.message
          }

          // Handle API provider errors
          if (serverError.message.includes('Service provider') ||
            serverError.message.includes('API connection')) {
            errorMessage = "🔧 " + serverError.message
          }
        }
      } else if (error.message) {
        // Handle frontend/network errors
        if (error.message.includes('Network Error') || error.isNetworkError) {
          errorMessage = "🌐 Network error. Please check your internet connection and try again."
        } else if (error.isTimeout) {
          errorMessage = "⏰ Request timeout. Please try again."
        } else {
          errorMessage = error.message
        }
      }

      setOrderStatus({
        success: false,
        message: errorMessage,
        details: showDetailedError ? {
          requiredAmount: error.response?.data?.required_amount,
          currentBalance: error.response?.data?.current_balance,
          shortfall: error.response?.data?.shortfall
        } : null
      })

      // Show appropriate toast based on error type
      if (errorMessage.includes('❌')) {
        toast.error(errorMessage.replace('❌ ', ''), {
          duration: 6000,
          icon: '⚠️'
        })
      } else if (errorMessage.includes('⚠️')) {
        toast.error(errorMessage.replace('⚠️ ', ''), {
          duration: 5000
        })
      } else if (errorMessage.includes('🔧')) {
        toast.error(errorMessage.replace('🔧 ', ''), {
          duration: 5000,
          icon: '🔧'
        })
      } else if (errorMessage.includes('🌐')) {
        toast.error(errorMessage, {
          duration: 4000,
          icon: '🌐'
        })
      } else if (errorMessage.includes('⏰')) {
        toast.error(errorMessage, {
          duration: 4000,
          icon: '⏰'
        })
      } else {
        toast.error(errorMessage)
      }
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

  // Sort categories function - TikTok, Facebook, Instagram first
  const sortCategories = (categories) => {
    const priorityOrder = ['tiktok', 'facebook', 'instagram']
    const sorted = [...categories].sort((a, b) => {
      const titleA = a.category_title?.toLowerCase().replace(/^[^a-zA-Z0-9]+/, '') || ''
      const titleB = b.category_title?.toLowerCase().replace(/^[^a-zA-Z0-9]+/, '') || ''

      const indexA = priorityOrder.findIndex(p => titleA.includes(p))
      const indexB = priorityOrder.findIndex(p => titleB.includes(p))

      // If both are in priority list, sort by priority order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      // Priority items come first
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      // Others sorted alphabetically
      return titleA.localeCompare(titleB)
    })
    return sorted
  }

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await fetchSmmCategories()
        const catData = response.data.data
        const sortedCategories = sortCategories(catData)
        setCategories(sortedCategories)
        if (sortedCategories.length > 0) setSelectedCategory(sortedCategories[0])
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

  // Load essential services when categories are loaded
  useEffect(() => {
    const loadAllServices = async () => {
      if (categories.length > 0 && allServices.length === 0 && !isLoadingAllServices) {
        setIsLoadingAllServices(true)
        try {
          console.log("Loading essential services for search...")
          const essentialServices = []

          // Load services for first 5 categories for better search coverage
          const categoriesToLoad = categories.slice(0, 5)

          for (const category of categoriesToLoad) {
            try {
              console.log(`Fetching services for category: ${category.category_title}`)
              const response = await fetchSmmServices(category.id.toString())
              const servicesData = response.data.data
              console.log(`Found ${servicesData.length} services for ${category.category_title}`)

              // Add category information to each service
              const servicesWithCategory = servicesData.map(service => ({
                ...service,
                categoryName: category.category_title,
                categoryId: category.id,
              }))

              essentialServices.push(...servicesWithCategory)
            } catch (err) {
              console.error(`Error fetching services for category ${category.id}:`, err)
            }
          }

          console.log("Total essential services loaded:", essentialServices.length)
          setAllServices(essentialServices)
        } catch (err) {
          console.error("Error loading essential services:", err)
        } finally {
          setIsLoadingAllServices(false)
        }
      }
    }

    loadAllServices()
  }, [categories])

  const getServiceMetrics = () => {
    if (!selectedService) return null

    const startTime = selectedService.start_time || "5-30 minutes"
    const speed = selectedService.speed || "100-1000/hour"
    const avgTime = selectedService.avg_time || selectedService.average_time || "7 hours 43 minutes"
    const guarantee = selectedService.guarantee || "30 days"

    return { startTime, speed, avgTime, guarantee }
  }

  const metrics = getServiceMetrics()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order Status Alert */}
      <OrderStatusAlert orderStatus={orderStatus} setOrderStatus={setOrderStatus} />

      {/* Mobile Layout */}
      <div className="lg:hidden w-full">
        <div className="w-full max-w-full px-2 sm:px-4 space-y-4 sm:space-y-6">
          {/* Balance Warning */}
          <BalanceWarning
            selectedService={selectedService}
            quantity={quantity}
            totalCost={totalCost}
            convertedBalance={convertedBalance}
            formattedTotalCost={formattedTotalCost}
            formattedBalance={formattedBalance}
            formatCurrency={formatCurrency}
            selectedCurrency={selectedCurrency}
          />

          {/* Stats Cards */}
          <StatsCards
            user={user}
            formattedBalance={formattedBalance}
            selectedCurrency={selectedCurrency}
          />

          {/* Platform Grid */}
          <PlatformGrid isMobile={true} />

          {/* Order Form */}
          <OrderForm
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            handleSearchFocus={handleSearchFocus}
            handleSearchBlur={handleSearchBlur}
            showSearchResults={showSearchResults}
            isSearching={isSearching}
            searchResults={searchResults}
            handleServiceSelect={handleServiceSelect}
            getPlatformIcon={getPlatformIcon}
            convertToSelectedCurrency={convertToSelectedCurrency}
            formatCurrency={formatCurrency}
            selectedCurrency={selectedCurrency}
            categories={categories}
            loadingCategories={loadingCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            services={services}
            loadingServices={loadingServices}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            setQuantity={setQuantity}
            quantity={quantity}
            setQuantityValue={setQuantity}
            link={link}
            setLink={setLink}
            isSubmitting={isSubmitting}
            handleSubmitOrder={handleSubmitOrder}
            formattedTotalCost={formattedTotalCost}
            isMobile={true}
          />

          {/* Service Details */}
          <ServiceDetails
            selectedService={selectedService}
            selectedCategory={selectedCategory}
            getPlatformIcon={getPlatformIcon}
            metrics={metrics}
            isMobile={true}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block w-full">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
          {/* Balance Warning */}
          <BalanceWarning
            selectedService={selectedService}
            quantity={quantity}
            totalCost={totalCost}
            convertedBalance={convertedBalance}
            formattedTotalCost={formattedTotalCost}
            formattedBalance={formattedBalance}
            formatCurrency={formatCurrency}
            selectedCurrency={selectedCurrency}
          />

          {/* Stats Cards */}
          <StatsCards
            user={user}
            formattedBalance={formattedBalance}
            selectedCurrency={selectedCurrency}
          />

          {/* Platform Grid */}
          <PlatformGrid isMobile={false} />

          {/* Main Content Area - Order Form & Description */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Order Form - Takes 2/3 of the space */}
            <div className="xl:col-span-2">
              <OrderForm
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                handleSearchFocus={handleSearchFocus}
                handleSearchBlur={handleSearchBlur}
                showSearchResults={showSearchResults}
                isSearching={isSearching}
                searchResults={searchResults}
                handleServiceSelect={handleServiceSelect}
                getPlatformIcon={getPlatformIcon}
                convertToSelectedCurrency={convertToSelectedCurrency}
                selectedCurrency={selectedCurrency}
                categories={categories}
                loadingCategories={loadingCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                services={services}
                loadingServices={loadingServices}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
                setQuantity={setQuantity}
                quantity={quantity}
                setQuantityValue={setQuantity}
                link={link}
                setLink={setLink}
                isSubmitting={isSubmitting}
                handleSubmitOrder={handleSubmitOrder}
                formattedTotalCost={formattedTotalCost}
                isMobile={false}
              />
            </div>

            {/* Service Details - Takes 1/3 of the space */}
            <div className="xl:col-span-1">
              <ServiceDetails
                selectedService={selectedService}
                selectedCategory={selectedCategory}
                getPlatformIcon={getPlatformIcon}
                metrics={metrics}
                isMobile={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewOrder

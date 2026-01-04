"use client"

import { useState, useEffect } from "react"
import {
  TrendingUp,
  DollarSign,
  Package,
  BarChart3,
  Calculator,
  AlertCircle,
  Check,
  X,
  Loader2,
  Globe,
  Server,
  Zap
} from "lucide-react"
import {
  increaseServicePrices,
  getServicePriceStats,
  fetchApiProviders,
  fetchAdminCategories
} from "../../services/adminService"

const BulkPriceIncrease = () => {
  const [percentage, setPercentage] = useState(10)
  const [scope, setScope] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("")
  const [categories, setCategories] = useState([])
  const [providers, setProviders] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [preview, setPreview] = useState(null)

  const percentageOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  const scopeOptions = [
    { value: "all", label: "All Services", icon: Globe, description: "Increase prices for all services in the system" },
    { value: "category", label: "By Category", icon: Package, description: "Increase prices for services in a specific category" },
    { value: "provider", label: "By API Provider", icon: Server, description: "Increase prices for services from a specific API provider" }
  ]

  // Load data on mount only
  useEffect(() => {
    loadCategories()
    loadProviders()
  }, []) // Remove dependencies to prevent re-running

  // Load stats when filters change
  useEffect(() => {
    loadPriceStats()
  }, [scope, selectedCategory, selectedProvider])

  const loadCategories = async () => {
    try {
      const response = await fetchAdminCategories()
      // Handle response structure from admin endpoint
      const categoriesData = response?.data || response || []
      setCategories(Array.isArray(categoriesData) ? categoriesData : [])
    } catch (err) {
      console.error("Error loading categories:", err)
      setCategories([])
    }
  }

  const loadProviders = async () => {
    try {
      const response = await fetchApiProviders()
      setProviders(Array.isArray(response) ? response : response?.data || [])
    } catch (err) {
      console.error("Error loading providers:", err)
      setProviders([])
      // Don't redirect - just show empty providers
    }
  }

  const loadPriceStats = async () => {
    try {
      setIsLoadingStats(true)
      const params = {}
      
      if (scope === "category" && selectedCategory) {
        params.category_id = selectedCategory
      } else if (scope === "provider" && selectedProvider) {
        params.provider_id = selectedProvider
      }
      
      const response = await getServicePriceStats(params)
      const statsData = response?.data || response
      setStats(statsData)
      
      // Generate preview
      if (statsData && statsData.average_price > 0) {
        const increaseFactor = 1 + (percentage / 100)
        const newAverage = statsData.average_price * increaseFactor
        setPreview({
          currentAverage: statsData.average_price,
          newAverage: newAverage,
          increaseAmount: newAverage - statsData.average_price,
          totalIncrease: (newAverage * statsData.total_services) - (statsData.average_price * statsData.total_services)
        })
      }
    } catch (err) {
      console.error("Error loading stats:", err)
      setStats(null)
      // Don't redirect - just show empty stats
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleIncreasePrices = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)
      
      // Check if admin token exists
      const adminToken = localStorage.getItem('adminToken')
      if (!adminToken) {
        setError('Admin authentication required. Please log in again.')
        return
      }
      
      const payload = {
        percentage: percentage,
        scope: scope
      }

      if (scope === "category" && selectedCategory) {
        payload.category_id = selectedCategory
      } else if (scope === "provider" && selectedProvider) {
        payload.provider_id = selectedProvider
      }

      const response = await increaseServicePrices(payload)
      
      const successMsg = response?.message || response?.data?.message || 'Prices increased successfully!'
      setSuccess(successMsg)
      
      // Reload stats to show updated numbers
      await loadPriceStats()
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err) {
      console.error('Error increasing prices:', err)
      // Don't redirect on error - let the interceptor handle it
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to increase prices"
      setError(errorMsg)
      
      // If it's a 401, the interceptor will handle the redirect
      // Don't do anything else here
    } finally {
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const getScopeDescription = () => {
    const scopeOption = scopeOptions.find(opt => opt.value === scope)
    return scopeOption ? scopeOption.description : ""
  }

  const getScopeLabel = () => {
    const scopeOption = scopeOptions.find(opt => opt.value === scope)
    return scopeOption ? scopeOption.label : ""
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Services</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Bulk Price Increase</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bulk Price Management</h1>
          <p className="text-gray-600 mt-2">
            Increase prices for multiple services at once
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={clearMessages}
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg p-1.5 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button
                onClick={clearMessages}
                className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg p-1.5 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-3 space-y-6">
            {/* Scope Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Increase Scope</h2>
                  <p className="text-gray-600 text-sm">Select which services to update</p>
                </div>
              </div>

              {/* Scope Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {scopeOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.value}
                      onClick={() => setScope(option.value)}
                      className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                        scope === option.value
                          ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500 ring-opacity-20"
                          : "bg-white border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          scope === option.value ? "bg-blue-600" : "bg-gray-100"
                        }`}>
                          <IconComponent className={`w-4 h-4 ${
                            scope === option.value ? "text-white" : "text-gray-600"
                          }`} />
                        </div>
                        <span className={`font-medium ${
                          scope === option.value ? "text-blue-900" : "text-gray-900"
                        }`}>
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {option.description}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Scope-specific Filters */}
              {scope === "category" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.category_title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {scope === "provider" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select API Provider
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a provider...</option>
                    {providers.map(provider => (
                      <option key={provider.id} value={provider.id}>
                        {provider.api_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Percentage Selection Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Percentage Increase</h2>
                  <p className="text-gray-600 text-sm">Select how much to increase prices</p>
                </div>
              </div>

              {/* Percentage Grid */}
              <div className="grid grid-cols-5 gap-3">
                {percentageOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => setPercentage(option)}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      percentage === option
                        ? "bg-green-600 text-white border-green-600 shadow-md transform scale-105"
                        : "bg-white text-gray-700 border-gray-200 hover:border-green-500 hover:bg-green-50"
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-lg font-bold">+{option}%</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Percentage Input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom percentage
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={percentage}
                    onChange={(e) => setPercentage(parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter percentage..."
                  />
                  <span className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Apply Changes</h2>
                  <p className="text-gray-600 text-sm">Review and execute the price increase</p>
                </div>
              </div>

              {/* Preview Information */}
              {preview && stats && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-3">Price Increase Preview</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Scope:</span>
                      <span className="ml-2 font-medium text-blue-900">{getScopeLabel()}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Services Affected:</span>
                      <span className="ml-2 font-medium text-blue-900">{stats.total_services}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Current Average:</span>
                      <span className="ml-2 font-medium text-blue-900">
                        ${(preview.currentAverage / 1000).toFixed(4)}
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">New Average:</span>
                      <span className="ml-2 font-medium text-green-600">
                        ${(preview.newAverage / 1000).toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Final Action Button */}
              <button
                onClick={handleIncreasePrices}
                disabled={isLoading || (scope === "category" && !selectedCategory) || (scope === "provider" && !selectedProvider)}
                className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-3 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Zap className="w-6 h-6" />
                )}
                Increase All Prices by {percentage}%
              </button>

              <p className="text-sm text-gray-500 mt-3 text-center">
                This will update {stats?.total_services || 0} services
              </p>
            </div>
          </div>

          {/* Right Column - Statistics & Quick Actions */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Current Statistics</h3>
              </div>

              {isLoadingStats ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              ) : stats ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Total Services</span>
                    <span className="text-sm font-semibold text-gray-900">{stats.total_services}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Average Price</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(stats.average_price / 1000).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Price Range</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${(stats.min_price / 1000).toFixed(4)} - ${(stats.max_price / 1000).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Volume</span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${((stats.total_price_volume || 0) / 1000).toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No statistics available</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Increases</h3>
              <div className="space-y-3">
                {[10, 25, 50].map(quickPercentage => (
                  <button
                    key={quickPercentage}
                    onClick={() => {
                      setPercentage(quickPercentage)
                      setScope("all")
                      setSelectedCategory("")
                      setSelectedProvider("")
                    }}
                    className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        All Services +{quickPercentage}%
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Warning Card */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Price increases affect all users immediately and cannot be automatically reversed.
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

export default BulkPriceIncrease
"use client"

import { useState } from "react"
import { Search, Star, Clock, Users, MessageCircle, Share2, Play, Zap, TrendingUp } from "lucide-react"

const serviceCategories = [
  { id: "all", name: "All Services", icon: "🌟" },
  { id: "instagram", name: "Instagram", icon: "📷" },
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "facebook", name: "Facebook", icon: "📘" },
  { id: "twitter", name: "Twitter", icon: "🐦" },
  { id: "youtube", name: "YouTube", icon: "📺" },
  { id: "telegram", name: "Telegram", icon: "✈️" },
]

const newServices = [
  {
    id: 5896,
    platform: "facebook",
    title: "Facebook Followers - Instant Start - Provider Service - All Types Working ++ Perfect Speed",
    price: 2691.38,
    minOrder: 10,
    maxOrder: 100000,
    deliveryTime: "5 hours 28 minutes",
    isNew: true,
    features: ["Instant Start", "High Quality", "All Types Working"],
  },
  {
    id: 5875,
    platform: "tiktok",
    title: "TikTok Likes | HQ & Real | Global 🟢 | Speed: Up To 50K/Day | Refill Button: 30 Days | MAX 1M 🟢🟢",
    price: 511.54,
    minOrder: 10,
    maxOrder: 1000000,
    deliveryTime: "14 minutes",
    isNew: true,
    features: ["HQ & Real", "Global", "30 Days Refill"],
  },
  {
    id: 5863,
    platform: "instagram",
    title:
      "Instagram Custom Comments [ Max 10K ] High Quality Accounts | SuperFast - Provider - No Bot Data %100 Original Accounts",
    price: 20678.41,
    minOrder: 5,
    maxOrder: 10000,
    deliveryTime: "Instant",
    isNew: true,
    features: ["Custom Comments", "High Quality", "No Bot Data"],
  },
  {
    id: 5862,
    platform: "instagram",
    title: "Instagram Followers - Old Accounts With Posts | 0/1 Min Completed - ⚡All Flag Working ⚡",
    price: 3701.89,
    minOrder: 10,
    maxOrder: 5000000,
    deliveryTime: "75 hours 31 minutes",
    isNew: true,
    features: ["Old Accounts", "With Posts", "All Flag Working"],
  },
  {
    id: 5860,
    platform: "twitter",
    title: "Twitter Custom Comments [ 1K ]",
    price: 52877.22,
    minOrder: 1,
    maxOrder: 10000,
    deliveryTime: "Instant",
    isNew: true,
    features: ["Custom Comments", "High Quality"],
  },
]

const recommendedServices = [
  {
    id: 4998,
    platform: "tiktok",
    title: "TikTok Video Views [ Max Unlimited ] | Instant Start | Life Time Guaranteed 🟢🟢🔥",
    price: 3.13,
    minOrder: 100,
    maxOrder: 100000000,
    deliveryTime: "43 minutes",
    isRecommended: true,
    features: ["Unlimited", "Instant Start", "Life Time Guaranteed"],
  },
  {
    id: 5005,
    platform: "tiktok",
    title:
      "TikTok Likes + Views | HQ - Real Profiles | Worldwide 🟢 | SuperFast | 30 Days 🟢 | Non Drop | Max 1M | Day 100K",
    price: 697.3,
    minOrder: 10,
    maxOrder: 1000000,
    deliveryTime: "42 minutes",
    isRecommended: true,
    features: ["HQ Real Profiles", "Worldwide", "30 Days Guarantee"],
  },
  {
    id: 4962,
    platform: "tiktok",
    title: "TikTok Likes + ExTra Views | Max 250k | HQ+REAL | 50k/Day | CHEAPEST FASTEST",
    price: 592.99,
    minOrder: 10,
    maxOrder: 500000,
    deliveryTime: "1 hour 3 minutes",
    isRecommended: true,
    features: ["Extra Views", "HQ+REAL", "Cheapest Fastest"],
  },
  {
    id: 4999,
    platform: "twitter",
    title: "Twitter Tweet Views - Provider Service - [ 0-1Min Completed⚡] - Best Speed in the World!",
    price: 69.93,
    minOrder: 100,
    maxOrder: 2147483647,
    deliveryTime: "10 minutes",
    isRecommended: true,
    features: ["0-1Min Completed", "Best Speed", "Provider Service"],
  },
  {
    id: 5000,
    platform: "instagram",
    title: "Instagram Video Views - Provider Service - Cheapest - Hours 500K Speed",
    price: 31.58,
    minOrder: 100,
    maxOrder: 2147483647,
    deliveryTime: "24 minutes",
    isRecommended: true,
    features: ["Cheapest", "500K Speed", "Provider Service"],
  },
]

const getPlatformIcon = (platform) => {
  const icons = {
    instagram: <MessageCircle className="w-4 h-4 text-pink-500" />,
    tiktok: <Play className="w-4 h-4 text-black" />,
    facebook: <Users className="w-4 h-4 text-blue-600" />,
    twitter: <Share2 className="w-4 h-4 text-sky-500" />,
    youtube: <Play className="w-4 h-4 text-red-500" />,
    telegram: <MessageCircle className="w-4 h-4 text-blue-500" />,
  }
  return icons[platform] || <Star className="w-4 h-4 text-gray-500" />
}

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const allServices = [...newServices, ...recommendedServices]

  const filteredServices = allServices.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.platform === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Social Media Services</h1>
          <p className="text-gray-600">Boost your social media presence with our premium services</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 h-11 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 rounded-md"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-48 h-11 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 rounded-md"
              >
                {serviceCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-40 h-11 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 rounded-md"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-transparent border border-gray-300 text-gray-700 hover:bg-blue-50"
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* New Services Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">🚀 NEW SERVICES</h2>
            <p className="text-blue-100">Latest additions to our service catalog</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="py-3 px-4 font-semibold text-gray-700 w-16">ID</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 min-w-96">Service</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Min</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Max</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Delivery</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {newServices.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-blue-600">{service.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(service.platform)}
                          <span className="font-medium text-gray-900 line-clamp-2">{service.title}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {service.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                          {service.isNew && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">NEW</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">₦{service.price.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{service.minOrder.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{service.maxOrder.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {service.deliveryTime}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Services Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              ⚡ Recommended Instant Services of the Day
            </h2>
            <p className="text-amber-100">Hand-picked services with the best performance and value</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-amber-50">
                  <th className="py-3 px-4 font-semibold text-gray-700 w-16">ID</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 min-w-96">Service</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Min</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Max</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Delivery</th>
                  <th className="py-3 px-4 font-semibold text-gray-700 w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {recommendedServices.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-blue-600">{service.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(service.platform)}
                          <span className="font-medium text-gray-900 line-clamp-2">{service.title}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {service.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs"
                            >
                              {feature}
                            </span>
                          ))}
                          {service.isRecommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">₦{service.price.toFixed(2)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{service.minOrder.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">{service.maxOrder.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {service.deliveryTime}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{allServices.length}</div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{newServices.length}</div>
              <div className="text-sm text-gray-600">New Services</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{recommendedServices.length}</div>
              <div className="text-sm text-gray-600">Recommended</div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{serviceCategories.length - 1}</div>
              <div className="text-sm text-gray-600">Platforms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
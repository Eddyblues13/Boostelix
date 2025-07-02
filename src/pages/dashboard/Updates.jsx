"use client"

import { useState } from "react"
import { Search, TrendingUp, TrendingDown, Calendar, Filter, RefreshCw, Download } from "lucide-react"

const updateTypes = [
  { value: "all", label: "All Updates" },
  { value: "price-decrease", label: "Price Decreases" },
  { value: "price-increase", label: "Price Increases" },
  { value: "service-changes", label: "Service Changes" },
  { value: "new-features", label: "New Features" },
]

const serviceUpdates = [
  {
    id: 5802,
    service: "TikTok Followers | Max 1M | %100 Real | Cancel Option | Drop %0-2 | 30D Refill 🟢 | 50K/D 🚀",
    date: "2025-07-01",
    updateType: "price-decrease",
    oldPrice: 6725.15,
    newPrice: 6694.7,
    change: -30.45,
    platform: "tiktok",
  },
  // ... other service updates
]

const getPlatformColor = (platform) => {
  const colors = {
    tiktok: "bg-black text-white",
    telegram: "bg-blue-500 text-white",
    youtube: "bg-red-500 text-white",
    kick: "bg-green-500 text-white",
    twitter: "bg-sky-500 text-white",
    instagram: "bg-pink-500 text-white",
    facebook: "bg-blue-600 text-white",
  }
  return colors[platform] || "bg-gray-500 text-white"
}

const getPlatformIcon = (platform) => {
  const icons = {
    tiktok: "🎵",
    telegram: "✈️",
    youtube: "📺",
    kick: "⚡",
    twitter: "🐦",
    instagram: "📷",
    facebook: "📘",
  }
  return icons[platform] || "🔧"
}

const Updates = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredUpdates = serviceUpdates.filter((update) => {
    const matchesSearch =
      update.service.toLowerCase().includes(searchQuery.toLowerCase()) || update.id.toString().includes(searchQuery)

    const matchesFilter = selectedFilter === "all" || update.updateType === selectedFilter

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUpdates = filteredUpdates.slice(startIndex, startIndex + itemsPerPage)

  const priceIncreases = serviceUpdates.filter((u) => u.updateType === "price-increase").length
  const priceDecreases = serviceUpdates.filter((u) => u.updateType === "price-decrease").length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Service Updates</h1>
          <p className="text-gray-600">Track all service changes, price updates, and improvements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <RefreshCw className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{serviceUpdates.length}</div>
            <div className="text-sm text-gray-600">Total Updates</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{priceDecreases}</div>
            <div className="text-sm text-gray-600">Price Decreases</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{priceIncreases}</div>
            <div className="text-sm text-gray-600">Price Increases</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">Today</div>
            <div className="text-sm text-gray-600">Last Updated</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full lg:w-48 h-11 px-4 py-2 border-2 border-gray-200 bg-blue-600 text-white rounded-md"
            >
              {updateTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                placeholder="Search by service name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 h-11 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 rounded-md"
              />
            </div>

            <div className="flex gap-2">
              <button className="h-11 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium flex items-center hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="h-11 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium flex items-center hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Updates Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Updates</h2>
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUpdates.length)} of{" "}
                {filteredUpdates.length} updates
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-3 px-4 font-semibold text-gray-700 w-24">Service ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 min-w-96">Service</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 w-32">Date</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 w-64">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUpdates.length > 0 ? (
                    paginatedUpdates.map((update) => (
                      <tr key={`${update.id}-${update.date}`} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getPlatformColor(update.platform)}`}>
                              {getPlatformIcon(update.platform)}
                            </span>
                            <span className="font-medium text-blue-600">{update.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900 line-clamp-2">{update.service}</p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                update.platform === "tiktok"
                                  ? "bg-gray-100 text-gray-800"
                                  : update.platform === "telegram"
                                    ? "bg-blue-100 text-blue-800"
                                    : update.platform === "youtube"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {update.platform.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {update.date}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div
                              className={`flex items-center gap-2 text-sm ${
                                update.updateType === "price-decrease" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {update.updateType === "price-decrease" ? (
                                <TrendingDown className="w-4 h-4" />
                              ) : (
                                <TrendingUp className="w-4 h-4" />
                              )}
                              <span className="font-medium">
                                Rate {update.updateType === "price-decrease" ? "decreased" : "increased"}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="line-through">₦{update.oldPrice.toFixed(2)}</span>
                              <span className="mx-2">→</span>
                              <span className="font-semibold">₦{update.newPrice.toFixed(2)}</span>
                            </div>
                            <div
                              className={`text-xs font-medium ${update.change < 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {update.change > 0 ? "+" : ""}₦{update.change.toFixed(2)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="text-gray-500">
                            <p className="font-medium">No updates found</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 7) {
                    pageNum = i + 1
                  } else if (currentPage <= 4) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i
                  } else {
                    pageNum = currentPage - 3 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                {totalPages > 7 && currentPage < totalPages - 3 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Updates
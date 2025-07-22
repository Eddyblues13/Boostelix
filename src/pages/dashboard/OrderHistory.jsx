"use client"

import { useState, useEffect } from "react"
import { Search, ExternalLink } from "lucide-react"
import toast from "react-hot-toast"
import { fetchUserData } from "../../services/userService"
import { CSS_COLORS } from "../../components/constant/colors"

const statusTabs = [
  { id: "all", label: "All", count: 0, color: null },
  { id: "pending", label: "Pending", count: 3, color: "#3b82f6" }, // blue
  { id: "in-progress", label: "In progress", count: 2, color: "#f59e0b" }, // orange
  { id: "completed", label: "Completed", count: 15, color: "#10b981" }, // green
  { id: "partial", label: "Partial", count: 1, color: "#8b5cf6" }, // purple
  { id: "processing", label: "Processing", count: 4, color: "#06b6d4" }, // cyan
  { id: "canceled", label: "Canceled", count: 0, color: "#ef4444" }, // red
]

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "in-progress":
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "partial":
      return "bg-purple-100 text-purple-800"
    case "canceled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const sampleOrders = [
  {
    id: "ORD001",
    date: "2024-01-15",
    link: "https://instagram.com/example_user_profile",
    charge: "₦2,500",
    startCount: "1,250",
    quantity: "1,000",
    service: "Instagram Followers",
    status: "Completed",
    remains: "0",
  },
  {
    id: "ORD002",
    date: "2024-01-14",
    link: "https://youtube.com/watch?v=example_video_id",
    charge: "₦5,000",
    startCount: "850",
    quantity: "2,000",
    service: "YouTube Views",
    status: "In progress",
    remains: "750",
  },
  {
    id: "ORD003",
    date: "2024-01-13",
    link: "https://tiktok.com/@example_user",
    charge: "₦1,200",
    startCount: "500",
    quantity: "500",
    service: "TikTok Likes",
    status: "Pending",
    remains: "500",
  },
  {
    id: "ORD004",
    date: "2024-01-12",
    link: "https://instagram.com/another_profile",
    charge: "₦3,200",
    startCount: "2,100",
    quantity: "1,500",
    service: "Instagram Likes",
    status: "Processing",
    remains: "200",
  },
  {
    id: "ORD005",
    date: "2024-01-11",
    link: "https://youtube.com/watch?v=another_video",
    charge: "₦800",
    startCount: "150",
    quantity: "300",
    service: "YouTube Subscribers",
    status: "Partial",
    remains: "50",
  },
]

const OrderHistory = () => {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [orders] = useState(sampleOrders)
  const [selectedService, setSelectedService] = useState("all-services")

  // Fetch user data
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.link.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = activeTab === "all" || order.status.toLowerCase().replace(" ", "-") === activeTab

    const matchesService =
      selectedService === "all-services" || order.service.toLowerCase().includes(selectedService.toLowerCase())

    return matchesSearch && matchesStatus && matchesService
  })

  const handleExport = () => {
    toast.success("Export functionality coming soon!")
  }

  const handleRefresh = () => {
    toast.success("Orders refreshed!")
  }

  return (
    <div className="w-full" style={{ backgroundColor: "transparent" }}>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="w-full p-4 space-y-4">
          {/* Status Filter Pills */}
          <div className="overflow-x-auto">
            <div className="flex space-x-2 pb-2" style={{ minWidth: "max-content" }}>
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? CSS_COLORS.primary : undefined,
                  }}
                >
                  {tab.color && activeTab !== tab.id && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tab.color }}></div>
                  )}
                  <span>{tab.label}</span>
                  {tab.count > 0 && activeTab !== tab.id && (
                    <span className="text-xs text-gray-500">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                style={{ backgroundColor: CSS_COLORS.background.muted }}
              />
            </div>
            <button
              onClick={() => {}}
              className="px-6 py-3 text-white font-medium rounded-xl shadow-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: CSS_COLORS.primary }}
            >
              Search
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl p-4 shadow-sm border border-white/50 backdrop-blur-sm"
                  style={{ backgroundColor: CSS_COLORS.background.card }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-800">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-800">{order.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service:</span>
                      <span className="text-gray-800">{order.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Charge:</span>
                      <span className="font-semibold" style={{ color: CSS_COLORS.primary }}>
                        {order.charge}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="text-gray-800">{order.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Remains:</span>
                      <span className="text-gray-800">{order.remains}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs"
                      >
                        <span className="truncate">{order.link}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No orders found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="text-center py-4 rounded-2xl text-white text-sm"
            style={{ background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})` }}
          >
            © Copyright 2025 All Rights Reserved.
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="w-full p-4 xl:p-6 space-y-6">
          {/* Status Filter Pills */}
          <div
            className="rounded-2xl p-4 shadow-sm border border-white/50 backdrop-blur-sm"
            style={{ backgroundColor: CSS_COLORS.background.card }}
          >
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === tab.id
                      ? "text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: activeTab === tab.id ? CSS_COLORS.primary : undefined,
                  }}
                >
                  {tab.color && activeTab !== tab.id && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tab.color }}></div>
                  )}
                  <span>{tab.label}</span>
                  {tab.count > 0 && activeTab !== tab.id && (
                    <span className="text-xs text-gray-500">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div
            className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
            style={{ backgroundColor: CSS_COLORS.background.card }}
          >
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                  style={{ backgroundColor: CSS_COLORS.background.muted }}
                />
              </div>
              <button
                onClick={() => {}}
                className="px-8 py-3 text-white font-medium rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: CSS_COLORS.primary }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div
            className="rounded-2xl shadow-sm border border-white/50 backdrop-blur-sm overflow-hidden"
            style={{ backgroundColor: CSS_COLORS.background.card }}
          >
            {/* Table Header */}
            <div
              className="px-6 py-4 text-white font-semibold"
              style={{ background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})` }}
            >
              <div className="grid grid-cols-9 gap-4 text-sm">
                <div>ID</div>
                <div>Date</div>
                <div>Link</div>
                <div>Charge</div>
                <div>Start Count</div>
                <div>Quantity</div>
                <div>Service</div>
                <div>Status</div>
                <div>Remains</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <div
                    key={order.id}
                    className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <div className="grid grid-cols-9 gap-4 items-center text-sm">
                      <div className="font-medium" style={{ color: CSS_COLORS.primary }}>
                        {order.id}
                      </div>
                      <div className="text-gray-600">{order.date}</div>
                      <div className="max-w-xs">
                        <a
                          href={order.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline truncate block flex items-center space-x-1"
                          title={order.link}
                        >
                          <span className="truncate">
                            {order.link.length > 25 ? `${order.link.substring(0, 25)}...` : order.link}
                          </span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                      <div className="font-semibold" style={{ color: CSS_COLORS.primary }}>
                        {order.charge}
                      </div>
                      <div className="text-gray-600">{order.startCount}</div>
                      <div className="text-gray-600">{order.quantity}</div>
                      <div className="font-medium text-gray-800">{order.service}</div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-gray-600">{order.remains}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No orders found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {filteredOrders.length > 0 && (
            <div
              className="rounded-2xl p-4 shadow-sm border border-white/50 backdrop-blur-sm"
              style={{ backgroundColor: CSS_COLORS.background.card }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    disabled
                  >
                    Previous
                  </button>
                  <button
                    className="px-4 py-2 text-white rounded-lg text-sm font-medium shadow-sm"
                    style={{ backgroundColor: CSS_COLORS.primary }}
                  >
                    1
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    disabled
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            className="text-center py-6 rounded-2xl text-white"
            style={{ background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})` }}
          >
            © Copyright 2025 All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory

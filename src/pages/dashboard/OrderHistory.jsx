"use client"
import { useState, useEffect } from "react"
import { Search, ExternalLink, RefreshCw, Download } from "lucide-react"
import toast from "react-hot-toast"
import { THEME_COLORS, CSS_COLORS } from "../../components/constant/colors"
import { fetchOrderHistory } from "../../services/services"

const statusTabs = [
  { id: "all", label: "All", color: null },
  { id: "pending", label: "Pending", color: "#3b82f6" },
  { id: "in-progress", label: "In progress", color: "#f59e0b" },
  { id: "completed", label: "Completed", color: "#10b981" },
  { id: "partial", label: "Partial", color: "#8b5cf6" },
  { id: "processing", label: "Processing", color: "#06b6d4" },
  { id: "canceled", label: "Canceled", color: "#ef4444" },
]

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "in-progress":
    case "processing":
      return `${THEME_COLORS.primary[100]} ${THEME_COLORS.text.primary700}`
    case "partial":
      return "bg-purple-100 text-purple-800"
    case "canceled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusCounts, setStatusCounts] = useState({})
  const [pagination, setPagination] = useState({
    currentPage: 1,
    total: 0,
    perPage: 10,
    lastPage: 1
  })

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(1) // Reset to first page when search changes
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch orders when tab changes
  useEffect(() => {
    fetchOrders(1) // Reset to first page when tab changes
  }, [activeTab])

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetchOrderHistory({
        status: activeTab === "all" ? null : activeTab,
        search: searchQuery,
        page: page
      })
      
      setOrders(response.data)
      setStatusCounts(response.status_counts)
      setPagination({
        currentPage: response.meta.current_page,
        total: response.meta.total,
        perPage: response.meta.per_page,
        lastPage: response.meta.last_page
      })
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchOrders(pagination.currentPage)
    toast.success("Orders refreshed!")
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchOrders(page)
    }
  }

  const handleExport = () => {
    toast.success("Export functionality coming soon!")
  }

  return (
    <div className="w-full min-h-screen" style={{ background: CSS_COLORS.background.primary }}>
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="w-full p-3 sm:p-4 space-y-4">
          {/* Status Filter Pills */}
          <div className="overflow-x-auto">
            <div className="flex space-x-2 pb-2" style={{ minWidth: "max-content" }}>
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full font-medium transition-all whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? `${THEME_COLORS.primary[500]} text-white shadow-lg`
                      : `${THEME_COLORS.background.card} text-gray-700 ${THEME_COLORS.border.primary200} border ${THEME_COLORS.hover.primary100}`
                  }`}
                >
                  {tab.color && activeTab !== tab.id && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tab.color }}></div>
                  )}
                  <span>{tab.label}</span>
                  {statusCounts[tab.id] > 0 && activeTab !== tab.id && (
                    <span className="text-xs text-gray-500">({statusCounts[tab.id]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 ${THEME_COLORS.border.primary200} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base ${THEME_COLORS.background.muted}`}
              />
            </div>
            <button
              onClick={handleRefresh}
              className={`p-2.5 ${THEME_COLORS.background.card} rounded-xl ${THEME_COLORS.border.primary200} border ${THEME_COLORS.hover.primary100}`}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-2xl p-4 shadow-sm ${THEME_COLORS.border.primary200} border backdrop-blur-sm ${THEME_COLORS.background.card}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-semibold text-gray-800 text-sm sm:text-base`}>{order.order_id}</span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date:</span>
                      <span className="text-gray-800">{order.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Service:</span>
                      <span className="text-gray-800 text-right max-w-[60%] truncate">{order.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Charge:</span>
                      <span className={`font-semibold ${THEME_COLORS.text.primary600}`}>{order.charge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Quantity:</span>
                      <span className="text-gray-800">{order.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Remains:</span>
                      <span className="text-gray-800">{order.remains}</span>
                    </div>
                    <div className={`pt-2 ${THEME_COLORS.border.primary200} border-t`}>
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-1 ${THEME_COLORS.text.primary600} hover:text-blue-800 text-xs`}
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
                <div
                  className={`w-16 h-16 ${THEME_COLORS.background.muted} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No orders found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1 || loading}
                className={`px-3 py-1.5 ${THEME_COLORS.border.primary200} border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.hover.primary100} transition-colors`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage || loading}
                className={`px-3 py-1.5 ${THEME_COLORS.border.primary200} border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.hover.primary100} transition-colors`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="w-full p-4 xl:p-6 space-y-6">
          {/* Status Filter Pills */}
          <div
            className={`rounded-2xl p-4 xl:p-6 shadow-sm ${THEME_COLORS.border.primary200} border backdrop-blur-sm ${THEME_COLORS.background.card}`}
          >
            <div className="flex flex-wrap gap-3">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === tab.id
                      ? `${THEME_COLORS.primary[500]} text-white shadow-lg`
                      : `${THEME_COLORS.background.card} text-gray-700 ${THEME_COLORS.border.primary200} border ${THEME_COLORS.hover.primary100}`
                  }`}
                >
                  {tab.color && activeTab !== tab.id && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tab.color }}></div>
                  )}
                  <span>{tab.label}</span>
                  {statusCounts[tab.id] > 0 && activeTab !== tab.id && (
                    <span className="text-xs text-gray-500">({statusCounts[tab.id]})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Actions */}
          <div
            className={`rounded-2xl p-6 shadow-sm ${THEME_COLORS.border.primary200} border backdrop-blur-sm ${THEME_COLORS.background.card}`}
          >
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search orders, services, or links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-3 ${THEME_COLORS.border.primary200} border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base ${THEME_COLORS.background.muted}`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className={`p-3 ${THEME_COLORS.background.card} rounded-xl ${THEME_COLORS.border.primary200} border ${THEME_COLORS.hover.primary100} flex items-center`}
                  title="Refresh"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleExport}
                  className={`p-3 ${THEME_COLORS.background.card} rounded-xl ${THEME_COLORS.border.primary200} border ${THEME_COLORS.hover.primary100} flex items-center`}
                  title="Export"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div
            className={`rounded-2xl shadow-sm ${THEME_COLORS.border.primary200} border backdrop-blur-sm overflow-hidden ${THEME_COLORS.background.card}`}
          >
            {/* Table Header */}
            <div className="px-6 py-4 text-white font-semibold" style={{ background: CSS_COLORS.background.sidebar }}>
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
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : orders.length > 0 ? (
                orders.map((order, index) => (
                  <div
                    key={order.id}
                    className={`px-6 py-4 ${THEME_COLORS.hover.primary100} transition-colors ${
                      index % 2 === 0 ? "bg-white" : `${THEME_COLORS.background.muted}`
                    }`}
                  >
                    <div className="grid grid-cols-9 gap-4 items-center text-sm">
                      <div className={`font-medium ${THEME_COLORS.text.primary600}`}>{order.order_id}</div>
                      <div className="text-gray-600">{order.date}</div>
                      <div className="max-w-xs">
                        <a
                          href={order.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${THEME_COLORS.text.primary600} hover:text-blue-800 hover:underline truncate block flex items-center space-x-1`}
                          title={order.link}
                        >
                          <span className="truncate">
                            {order.link.length > 25 ? `${order.link.substring(0, 25)}...` : order.link}
                          </span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                      <div className={`font-semibold ${THEME_COLORS.text.primary600}`}>{order.charge}</div>
                      <div className="text-gray-600">{order.start_count}</div>
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
                  <div
                    className={`w-16 h-16 ${THEME_COLORS.background.muted} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
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
          {orders.length > 0 && (
            <div
              className={`rounded-2xl p-4 shadow-sm ${THEME_COLORS.border.primary200} border backdrop-blur-sm ${THEME_COLORS.background.card}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {orders.length} of {pagination.total} orders
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loading}
                    className={`px-4 py-2 ${THEME_COLORS.border.primary200} border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.hover.primary100} transition-colors`}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.lastPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.lastPage || loading}
                    className={`px-4 py-2 ${THEME_COLORS.border.primary200} border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.hover.primary100} transition-colors`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderHistory
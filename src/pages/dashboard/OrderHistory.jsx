"use client"
import { useState, useEffect } from "react"
import { Search, ExternalLink, RefreshCw, Download, Copy } from "lucide-react"
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
  switch (status?.toLowerCase()) {
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
      fetchOrders(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch orders when tab changes
  useEffect(() => {
    fetchOrders(1)
  }, [activeTab])

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetchOrderHistory({
        status: activeTab === "all" ? null : activeTab,
        search: searchQuery,
        page: page
      })
      
      setOrders(response.data || [])
      setStatusCounts(response.status_counts || {})
      setPagination({
        currentPage: response.meta?.current_page || 1,
        total: response.meta?.total || 0,
        perPage: response.meta?.per_page || 10,
        lastPage: response.meta?.last_page || 1
      })
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to fetch orders")
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Link copied!')
  }

  // Mobile table columns configuration
  const mobileColumns = [
    { key: 'order_id', label: 'ID', className: 'font-semibold' },
    { key: 'date', label: 'Date' },
    { 
      key: 'service', 
      label: 'Service',
      render: (order) => order.service?.service_title || 'N/A'
    },
    { key: 'status', label: 'Status', render: (order) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
        {order.status}
      </span>
    )},
    { key: 'charge', label: 'Charge', className: 'font-semibold' }
  ]

  return (
    <div className="w-full min-h-screen" style={{ background: CSS_COLORS.background.primary }}>
      {/* Mobile View (Table Cards) */}
      <div className="block lg:hidden p-3 sm:p-4">
        <div className="space-y-4">
          {/* Status Filter Pills */}
          <div className="overflow-x-auto pb-2">
            <div className="flex space-x-2" style={{ minWidth: "max-content" }}>
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${
                    activeTab === tab.id
                      ? `${THEME_COLORS.primary[500]} text-white shadow-lg`
                      : `${THEME_COLORS.background.card} text-gray-700 ${THEME_COLORS.border.primary200} border ${THEME_COLORS.hover.primary100}`
                  }`}
                >
                  {tab.color && activeTab !== tab.id && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tab.color }} />
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
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${THEME_COLORS.border.primary200} ${THEME_COLORS.background.muted}`}
              />
            </div>
            <button
              onClick={handleRefresh}
              className={`p-2.5 rounded-xl border flex items-center ${THEME_COLORS.background.card} ${THEME_COLORS.border.primary200} ${THEME_COLORS.hover.primary100}`}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Orders List - Mobile Table Cards */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
              </div>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className={`rounded-xl p-4 border ${THEME_COLORS.border.primary200} ${THEME_COLORS.background.card}`}
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {mobileColumns.map((column) => (
                      <div key={column.key} className="space-y-1">
                        <div className="text-xs text-gray-500">{column.label}</div>
                        <div className={column.className}>
                          {column.render ? column.render(order) : order[column.key]}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Link with copy button */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">Link</div>
                      <button 
                        onClick={() => copyToClipboard(order.link)}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <a
                      href={order.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline truncate block"
                    >
                      {order.link}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className={`w-16 h-16 ${THEME_COLORS.background.muted} rounded-full flex items-center justify-center mx-auto mb-4`}>
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
                className={`px-3 py-1.5 border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.border.primary200} ${THEME_COLORS.hover.primary100}`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.lastPage}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage || loading}
                className={`px-3 py-1.5 border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.border.primary200} ${THEME_COLORS.hover.primary100}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block p-4 xl:p-6">
        <div className="space-y-6">
          {/* Status Filter Pills */}
          <div className={`rounded-xl p-6 border ${THEME_COLORS.border.primary200} ${THEME_COLORS.background.card}`}>
            <div className="flex flex-wrap gap-3">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium ${
                    activeTab === tab.id
                      ? `${THEME_COLORS.primary[500]} text-white shadow-lg`
                      : `${THEME_COLORS.background.card} text-gray-700 ${THEME_COLORS.border.primary200} border ${THEME_COLORS.hover.primary100}`
                  }`}
                >
                  {tab.color && activeTab !== tab.id && (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tab.color }} />
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
          <div className={`rounded-xl p-6 border ${THEME_COLORS.border.primary200} ${THEME_COLORS.background.card}`}>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search orders, services, or links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base ${THEME_COLORS.border.primary200} ${THEME_COLORS.background.muted}`}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className={`p-3 rounded-xl border flex items-center ${THEME_COLORS.background.card} ${THEME_COLORS.border.primary200} ${THEME_COLORS.hover.primary100}`}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleExport}
                  className={`p-3 rounded-xl border flex items-center ${THEME_COLORS.background.card} ${THEME_COLORS.border.primary200} ${THEME_COLORS.hover.primary100}`}
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className={`rounded-xl border overflow-hidden ${THEME_COLORS.border.primary200} ${THEME_COLORS.background.card}`}>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 text-white font-semibold" style={{ background: CSS_COLORS.background.sidebar }}>
              <div className="col-span-2">Order ID</div>
              <div>Date</div>
              <div className="col-span-2">Service</div>
              <div>Link</div>
              <div>Charge</div>
              <div>Quantity</div>
              <div>Start Count</div>
              <div>Status</div>
              <div>Remains</div>
              <div>Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
                </div>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 items-center text-sm ${THEME_COLORS.hover.primary100}`}
                  >
                    <div className="col-span-2 font-medium">{order.order_id}</div>
                    <div className="text-gray-600">{order.date}</div>
                    <div className="col-span-2 font-medium">
                      {order.service?.service_title || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                        title={order.link}
                      >
                        {order.link?.substring(0, 20)}...
                      </a>
                    </div>
                    <div className="font-semibold">{order.charge}</div>
                    <div>{order.quantity}</div>
                    <div>{order.start_count}</div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div>{order.remains}</div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(order.link)}
                        className="text-gray-400 hover:text-blue-500"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500"
                        title="Open link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className={`w-16 h-16 ${THEME_COLORS.background.muted} rounded-full flex items-center justify-center mx-auto mb-4`}>
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
            <div className={`rounded-xl p-4 border ${THEME_COLORS.border.primary200} ${THEME_COLORS.background.card}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {orders.length} of {pagination.total} orders
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loading}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.border.primary200} ${THEME_COLORS.hover.primary100}`}
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.lastPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.lastPage || loading}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.border.primary200} ${THEME_COLORS.hover.primary100}`}
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
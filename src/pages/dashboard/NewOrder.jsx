"use client"
import { useState, useEffect } from "react"
import { Search, ExternalLink, RefreshCw, Download, Copy, ChevronDown, ChevronUp } from "lucide-react"
import toast from "react-hot-toast"
import { THEME_COLORS, CSS_COLORS } from "../../components/constant/colors"
import { fetchOrderHistory } from "../../services/services"

const statusTabs = [
  { id: "all", label: "All", color: null },
  { id: "pending", label: "Pending", color: "#3b82f6" },
  { id: "processing", label: "Processing", color: "#f59e0b" },
  { id: "completed", label: "Completed", color: "#10b981" },
  { id: "partial", label: "Partial", color: "#8b5cf6" },
  { id: "cancelled", label: "Cancelled", color: "#ef4444" },
  { id: "failed", label: "Failed", color: "#dc2626" },
]

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return `${THEME_COLORS.primary[100]} ${THEME_COLORS.text.primary700}`
    case "partial":
      return "bg-purple-100 text-purple-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  if (price === null || price === undefined) return '$0.00'
  return `$${parseFloat(price).toFixed(2)}`
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
  const [expandedOrder, setExpandedOrder] = useState(null)

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
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  // Mobile table columns configuration - Updated to match SQL structure
  const mobileColumns = [
    { key: 'id', label: 'ID', className: 'font-semibold' },
    { key: 'created_at', label: 'Date', render: (order) => formatDate(order.created_at) },
    { 
      key: 'service_id', 
      label: 'Service ID',
      render: (order) => order.service_id || 'N/A'
    },
    { key: 'status', label: 'Status', render: (order) => (
      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
        {order.status}
      </span>
    )},
    { key: 'price', label: 'Price', render: (order) => formatPrice(order.price) },
    { key: 'quantity', label: 'Quantity', render: (order) => order.quantity || 0 }
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
                  
                  {/* Expandable details section */}
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="w-full mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600 hover:text-gray-800"
                  >
                    <span>View Details</span>
                    {expandedOrder === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {expandedOrder === order.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                      {/* Link with copy button */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
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
                          className="text-xs text-blue-600 hover:underline break-all"
                        >
                          {order.link}
                        </a>
                      </div>

                      {/* API Order ID */}
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">API Order ID:</span>
                        <span>{order.api_order_id || 'N/A'}</span>
                      </div>

                      {/* Category ID */}
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Category ID:</span>
                        <span>{order.category_id || 'N/A'}</span>
                      </div>

                      {/* Start Counter */}
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Start Counter:</span>
                        <span>{order.start_counter !== null ? order.start_counter : 'N/A'}</span>
                      </div>

                      {/* Remains */}
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Remains:</span>
                        <span>{order.remains !== null ? order.remains : 'N/A'}</span>
                      </div>

                      {/* Status Description */}
                      {order.status_description && (
                        <div className="text-xs">
                          <div className="text-gray-500 mb-1">Status Description:</div>
                          <div className="bg-gray-50 p-2 rounded text-gray-700">
                            {order.status_description}
                          </div>
                        </div>
                      )}

                      {/* Reason */}
                      {order.reason && (
                        <div className="text-xs">
                          <div className="text-gray-500 mb-1">Reason:</div>
                          <div className="bg-red-50 p-2 rounded text-red-700 border border-red-200">
                            {order.reason}
                          </div>
                        </div>
                      )}

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-gray-500">Runs:</div>
                          <div>{order.runs !== null ? order.runs : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Interval:</div>
                          <div>{order.interval !== null ? order.interval : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Drip Feed:</div>
                          <div>{order.drip_feed !== null ? (order.drip_feed ? 'Yes' : 'No') : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Refilled At:</div>
                          <div>{order.refilled_at ? formatDate(order.refilled_at) : 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  )}
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
            <div className="grid grid-cols-14 gap-2 px-4 py-4 text-white font-semibold text-sm" style={{ background: CSS_COLORS.background.sidebar }}>
              <div className="col-span-1">ID</div>
              <div className="col-span-1">User ID</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Service</div>
              <div className="col-span-2">Link</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-1">Quantity</div>
              <div className="col-span-1">Start Count</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Remains</div>
              <div className="col-span-1">Status Desc</div>
              <div className="col-span-1">Reason</div>
              <div className="col-span-1">Actions</div>
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
                    className={`grid grid-cols-14 gap-2 px-4 py-4 items-center text-sm ${THEME_COLORS.hover.primary100} ${expandedOrder === order.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="col-span-1 font-medium">{order.id}</div>
                    <div className="col-span-1">{order.user_id}</div>
                    <div className="col-span-1 text-gray-600 text-xs">{formatDate(order.created_at)}</div>
                    <div className="col-span-1">{order.service_id}</div>
                    <div className="col-span-2 flex items-center">
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate text-xs"
                        title={order.link}
                      >
                        {order.link?.substring(0, 25)}...
                      </a>
                    </div>
                    <div className="col-span-1 font-semibold text-xs">{formatPrice(order.price)}</div>
                    <div className="col-span-1">{order.quantity}</div>
                    <div className="col-span-1">{order.start_counter || 0}</div>
                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="col-span-1">{order.remains !== null ? order.remains : 'N/A'}</div>
                    <div className="col-span-1">
                      {order.status_description ? (
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs truncate max-w-full"
                          title={order.status_description}
                        >
                          {order.status_description.substring(0, 15)}...
                        </button>
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <div className="col-span-1">
                      {order.reason ? (
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="text-red-600 hover:text-red-800 text-xs truncate max-w-full"
                          title={order.reason}
                        >
                          {order.reason.substring(0, 15)}...
                        </button>
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <div className="col-span-1 flex space-x-1">
                      <button
                        onClick={() => copyToClipboard(order.link)}
                        className="text-gray-400 hover:text-blue-500 p-1"
                        title="Copy link"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 p-1"
                        title="Open link"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="text-gray-400 hover:text-blue-500 p-1"
                        title="View details"
                      >
                        {expandedOrder === order.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
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

          {/* Expanded Order Details Modal */}
          {expandedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className={`rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${THEME_COLORS.background.card} ${THEME_COLORS.border.primary200} border`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Order Details #{expandedOrder}</h3>
                  <button
                    onClick={() => setExpandedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                
                {(() => {
                  const order = orders.find(o => o.id === expandedOrder)
                  if (!order) return null
                  
                  return (
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-500">Order ID</div>
                          <div className="font-semibold">{order.id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">User ID</div>
                          <div>{order.user_id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Service ID</div>
                          <div>{order.service_id}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Category ID</div>
                          <div>{order.category_id || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">API Order ID</div>
                          <div>{order.api_order_id || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Status</div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1">Link</div>
                        <div className="flex items-center gap-2">
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {order.link}
                          </a>
                          <button
                            onClick={() => copyToClipboard(order.link)}
                            className="text-gray-400 hover:text-blue-500"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {order.status_description && (
                        <div>
                          <div className="text-gray-500 mb-1">Status Description</div>
                          <div className="bg-gray-50 p-3 rounded text-gray-700">
                            {order.status_description}
                          </div>
                        </div>
                      )}

                      {order.reason && (
                        <div>
                          <div className="text-gray-500 mb-1">Reason</div>
                          <div className="bg-red-50 p-3 rounded text-red-700 border border-red-200">
                            {order.reason}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-gray-500">Price</div>
                          <div className="font-semibold">{formatPrice(order.price)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Quantity</div>
                          <div>{order.quantity}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Remains</div>
                          <div>{order.remains !== null ? order.remains : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Start Counter</div>
                          <div>{order.start_counter || 0}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Runs</div>
                          <div>{order.runs !== null ? order.runs : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Interval</div>
                          <div>{order.interval !== null ? order.interval : 'N/A'}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-500">Drip Feed</div>
                          <div>{order.drip_feed !== null ? (order.drip_feed ? 'Yes' : 'No') : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Refilled At</div>
                          <div>{order.refilled_at ? formatDate(order.refilled_at) : 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Created At</div>
                          <div>{formatDate(order.created_at)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Updated At</div>
                          <div>{formatDate(order.updated_at)}</div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

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
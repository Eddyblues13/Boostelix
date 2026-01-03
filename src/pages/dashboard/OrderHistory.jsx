"use client"
import { useState, useEffect, useRef } from "react"
import {
  Search,
  ExternalLink,
  RefreshCw,
  Download,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import toast from "react-hot-toast"
import { THEME_COLORS, CSS_COLORS } from "../../components/constant/colors"
import { fetchOrderHistory } from "../../services/services"

/* ---------- constants ---------- */
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
      return `${THEME_COLORS.primary?.[100] ?? "bg-blue-100"} ${THEME_COLORS.text?.primary700 ?? "text-blue-700"}`
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
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatPrice = (price) => {
  if (price === null || price === undefined) return "$0.00"
  return `$${parseFloat(price).toFixed(2)}`
}

/* ---------- component ---------- */
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
    lastPage: 1,
  })
  const [expandedOrder, setExpandedOrder] = useState(null)

  // sorting
  const [sortBy, setSortBy] = useState(null) // column key
  const [sortOrder, setSortOrder] = useState("desc") // 'asc' | 'desc'

  // infinite scroll
  const sentinelRef = useRef(null)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(1, { replace: true })
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // Fetch orders when tab or sorting changes
  useEffect(() => {
    fetchOrders(1, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sortBy, sortOrder])

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading && !isFetchingMore) {
            if (pagination.currentPage < pagination.lastPage) {
              fetchOrders(pagination.currentPage + 1, { append: true })
            }
          }
        })
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    )

    observer.observe(sentinelRef.current)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, pagination.lastPage, loading, isFetchingMore, orders])

  const buildRequestPayload = (page = 1) => {
    return {
      status: activeTab === "all" ? null : activeTab,
      search: searchQuery,
      page,
      sort_by: sortBy,
      sort_order: sortOrder,
    }
  }

  const fetchOrders = async (page = 1, { replace = false, append = false } = {}) => {
    try {
      if (append) setIsFetchingMore(true)
      else setLoading(true)

      const payload = buildRequestPayload(page)
      console.log('🔄 Fetching orders with payload:', payload)
      
      const response = await fetchOrderHistory(payload)
      console.log('📦 API Response:', response)
      
      const incoming = response.data || []
      console.log('📊 Incoming orders data:', incoming)

      // Debug: Check first order structure
      if (incoming.length > 0) {
        console.log('🔍 First order structure:', incoming[0])
        console.log('📋 Available fields:', Object.keys(incoming[0]))
      }

      const newOrders = append ? [...orders, ...incoming] : incoming

      setOrders(newOrders)
      setStatusCounts(response.status_counts || {})

      setPagination({
        currentPage: response.meta?.current_page || page,
        total: response.meta?.total ?? (append ? pagination.total : incoming.length),
        perPage: response.meta?.per_page || pagination.perPage,
        lastPage: response.meta?.last_page || 1,
      })
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      console.error('📄 Error response:', error.response)
      toast.error(error.response?.data?.message || error.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
      setIsFetchingMore(false)
    }
  }

  const handleRefresh = () => {
    fetchOrders(1, { replace: true })
    toast.success("Orders refreshed!")
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchOrders(page, { replace: true })
    }
  }

  const handleExport = async ({ exportAll = false } = {}) => {
    try {
      toast.loading("Preparing CSV...", { id: "csv" })

      let exportOrders = orders

      if (exportAll && pagination.lastPage > pagination.currentPage) {
        // fetch remaining pages sequentially
        const all = [...orders]
        for (let p = pagination.currentPage + 1; p <= pagination.lastPage; p++) {
          const r = await fetchOrderHistory(buildRequestPayload(p))
          const d = r.data || []
          all.push(...d)
        }
        exportOrders = all
      }

      if (!exportOrders || exportOrders.length === 0) {
        toast.dismiss("csv")
        toast.error("No orders to export")
        return
      }

      // build CSV
      const headers = [
        "id",
        "user_id",
        "service_id",
        "api_order_id",
        "category_id",
        "link",
        "price",
        "quantity",
        "start_counter",
        "remains",
        "status",
        "status_description",
        "reason",
        "runs",
        "interval",
        "drip_feed",
        "refilled_at",
        "created_at",
        "updated_at",
      ]

      const csvRows = [
        headers.join(","),
        ...exportOrders.map((o) =>
          headers
            .map((h) => {
              let v = o[h]
              if (v === null || v === undefined) return '""'
              if (typeof v === "string") {
                return `"${v.replace(/"/g, '""')}"`
              }
              if (v instanceof Date) return `"${v.toISOString()}"`
              return `"${String(v)}"`
            })
            .join(",")
        ),
      ].join("\n")

      const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      const filename = `orders_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.dismiss("csv")
      toast.success("CSV downloaded")
    } catch (err) {
      toast.dismiss("csv")
      toast.error("Failed to export CSV")
    }
  }

  const copyToClipboard = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const setSorting = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder((s) => (s === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(columnKey)
      setSortOrder("asc")
    }
  }

  // mobile table columns configuration
  const mobileColumns = [
    { key: "id", label: "ID", className: "font-semibold" },
    { 
      key: "created_at", 
      label: "Date", 
      render: (order) => formatDate(order.created_at) 
    },
    {
      key: "service_name",
      label: "Service",
      render: (order) => order.service_name || order.service_id || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (order) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      ),
    },
    { 
      key: "price", 
      label: "Price", 
      render: (order) => formatPrice(order.price) 
    },
    { 
      key: "quantity", 
      label: "Quantity", 
      render: (order) => order.quantity || 0 
    },
  ]

  /* ---------- small skeleton helpers ---------- */
  const MobileSkeleton = () => (
    <div className={`rounded-xl p-4 border ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.card ?? "bg-white"} shadow-sm`}>
      <div className="animate-pulse space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-12" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    </div>
  )

  const DesktopRowSkeleton = ({ columns = 14 }) => (
    <div className={`grid grid-cols-14 gap-2 px-4 py-4 items-center text-sm`}>
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-full" />
      ))}
    </div>
  )

  return (
    <div className="w-full min-h-screen" style={{ background: CSS_COLORS.background?.primary ?? "#f7fafc" }}>
      {/* Mobile View (Table Cards) */}
      <div className="block lg:hidden w-full overflow-x-hidden">
        <div className="w-full p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-800">Order History</h1>
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg border flex items-center justify-center ${THEME_COLORS.background?.card ?? "bg-white"} ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.hover?.primary100 ?? ""}`}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Status Filter Pills */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-2" style={{ minWidth: "max-content" }}>
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? `${THEME_COLORS.primary?.[500] ?? "bg-blue-600"} text-white shadow-md`
                      : `${THEME_COLORS.background?.card ?? "bg-white"} text-gray-700 ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} border ${THEME_COLORS.hover?.primary100 ?? ""}`
                  }`}
                >
                  {tab.color && activeTab !== tab.id && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tab.color }} />}
                  <span>{tab.label}</span>
                  {statusCounts[tab.id] > 0 && activeTab !== tab.id && <span className="text-xs text-gray-500">({statusCounts[tab.id]})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.muted ?? "bg-gray-50"}`}
              />
            </div>
            <button
              onClick={() => handleExport({ exportAll: false })}
              className={`px-4 py-3 rounded-xl border flex items-center justify-center gap-2 ${THEME_COLORS.background?.card ?? "bg-white"} ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.hover?.primary100 ?? ""} text-sm font-medium`}
              title="Export visible"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>

          {/* Orders List - Mobile Table Cards */}
          <div className="space-y-4">
            {loading && orders.length === 0 ? (
              <>
                <MobileSkeleton />
                <MobileSkeleton />
                <MobileSkeleton />
              </>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className={`rounded-xl p-4 border ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.card ?? "bg-white"} shadow-sm hover:shadow-md transition-shadow`}>
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Order ID</div>
                      <div className="text-base font-bold text-gray-800">#{order.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">Status</div>
                      <div>
                        {mobileColumns.find(c => c.key === "status")?.render(order)}
                      </div>
                    </div>
                  </div>

                  {/* Main Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Date</div>
                      <div className="text-sm font-medium text-gray-800">{formatDate(order.created_at)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Price</div>
                      <div className="text-sm font-semibold text-gray-800">{formatPrice(order.price)}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500 mb-1">Service</div>
                      <div className="text-sm font-medium text-gray-800 truncate">{order.service_name || order.service_id || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Quantity</div>
                      <div className="text-sm font-medium text-gray-800">{order.quantity || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Remains</div>
                      <div className="text-sm font-medium text-gray-800">{order.remains !== null ? order.remains : "N/A"}</div>
                    </div>
                  </div>

                  {/* Link Preview */}
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Link</div>
                    <div className="flex items-center gap-2">
                      <a 
                        href={order.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-blue-600 hover:underline truncate flex-1"
                        title={order.link}
                      >
                        {order.link?.length > 40 ? `${order.link.substring(0, 40)}...` : order.link}
                      </a>
                      <button 
                        onClick={() => copyToClipboard(order.link)} 
                        className="text-gray-400 hover:text-blue-500 flex-shrink-0"
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable details section */}
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="w-full pt-3 border-t border-gray-200 flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <span>{expandedOrder === order.id ? "Hide" : "View"} Details</span>
                    {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {expandedOrder === order.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                      {/* Link - Full display */}
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-medium text-gray-700">Full Link</div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => copyToClipboard(order.link)} 
                              className="text-gray-500 hover:text-blue-600 transition-colors"
                              title="Copy link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <a 
                              href={order.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs text-blue-600 hover:underline font-medium"
                            >
                              Open
                            </a>
                          </div>
                        </div>
                        <a 
                          href={order.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-blue-600 hover:underline break-all block"
                        >
                          {order.link}
                        </a>
                      </div>

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">API Order ID</div>
                          <div className="text-sm font-medium text-gray-800">{order.api_order_id || "N/A"}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Category ID</div>
                          <div className="text-sm font-medium text-gray-800">{order.category_id || "N/A"}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Start Counter</div>
                          <div className="text-sm font-medium text-gray-800">{order.start_counter !== null ? order.start_counter : "N/A"}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">User ID</div>
                          <div className="text-sm font-medium text-gray-800">{order.user_id || "N/A"}</div>
                        </div>
                      </div>

                      {/* Status Description */}
                      {order.status_description && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="text-xs font-medium text-blue-700 mb-1">Status Description</div>
                          <div className="text-sm text-blue-800">{order.status_description}</div>
                        </div>
                      )}

                      {/* Reason */}
                      {order.reason && (
                        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                          <div className="text-xs font-medium text-red-700 mb-1">Reason</div>
                          <div className="text-sm text-red-800">{order.reason}</div>
                        </div>
                      )}

                      {/* Additional Details */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Runs</div>
                          <div className="text-sm font-medium text-gray-800">{order.runs !== null ? order.runs : "N/A"}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Interval</div>
                          <div className="text-sm font-medium text-gray-800">{order.interval !== null ? order.interval : "N/A"}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Drip Feed</div>
                          <div className="text-sm font-medium text-gray-800">{order.drip_feed !== null ? (order.drip_feed ? "Yes" : "No") : "N/A"}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">Refilled At</div>
                          <div className="text-sm font-medium text-gray-800">{order.refilled_at ? formatDate(order.refilled_at) : "N/A"}</div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="pt-2 border-t border-gray-200">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Created:</span>
                            <span className="text-gray-700">{formatDate(order.created_at)}</span>
                          </div>
                          {order.updated_at && (
                            <div className="flex justify-between">
                              <span>Updated:</span>
                              <span className="text-gray-700">{formatDate(order.updated_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className={`w-16 h-16 ${THEME_COLORS.background?.muted ?? "bg-gray-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium text-base mb-1">No orders found</p>
                <p className="text-sm text-gray-500">{searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}</p>
              </div>
            )}
          </div>

          {/* Loading More Indicator */}
          {isFetchingMore && (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
            </div>
          )}

          {/* Pagination Info */}
          {orders.length > 0 && (
            <div className={`rounded-xl p-4 border ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.card ?? "bg-white"}`}>
              <div className="text-center text-sm text-gray-600">
                Showing {orders.length} of {pagination.total} orders
                {pagination.currentPage < pagination.lastPage && (
                  <span className="block mt-1 text-xs text-gray-500">Scroll down for more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block p-4 xl:p-6">
        <div className="space-y-6">
          {/* Status Filter Pills */}
          <div className={`rounded-xl p-6 border ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.card ?? "bg-white"}`}>
            <div className="flex flex-wrap gap-3">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium ${
                    activeTab === tab.id
                      ? `${THEME_COLORS.primary?.[500] ?? "bg-blue-600"} text-white shadow-lg`
                      : `${THEME_COLORS.background?.card ?? "bg-white"} text-gray-700 ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} border ${THEME_COLORS.hover?.primary100 ?? ""}`
                  }`}
                >
                  {tab.color && activeTab !== tab.id && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tab.color }} />}
                  <span>{tab.label}</span>
                  {statusCounts[tab.id] > 0 && activeTab !== tab.id && <span className="text-xs text-gray-500">({statusCounts[tab.id]})</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Actions */}
          <div className={`rounded-xl p-6 border ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.card ?? "bg-white"}`}>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search orders, services, or links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.muted ?? "bg-gray-50"}`}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleRefresh} className={`p-3 rounded-xl border flex items-center ${THEME_COLORS.background?.card ?? "bg-white"} ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.hover?.primary100 ?? ""}`}>
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                </button>
                <div className="relative inline-flex">
                  <button onClick={() => handleExport({ exportAll: false })} className={`p-3 rounded-xl border flex items-center ${THEME_COLORS.background?.card ?? "bg-white"} ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.hover?.primary100 ?? ""}`}>
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleExport({ exportAll: true })}
                    className={`p-3 rounded-xl border flex items-center -ml-px ${THEME_COLORS.background?.card ?? "bg-white"} ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.hover?.primary100 ?? ""}`}
                    title="Export all pages"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className={`rounded-xl border overflow-hidden ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.card ?? "bg-white"}`}>
            {/* Table Header */}
            <div className="grid grid-cols-14 gap-2 px-4 py-4 text-white font-semibold text-sm" style={{ background: CSS_COLORS.background?.sidebar ?? "#0f172a" }}>
              <div className="col-span-1 cursor-pointer" onClick={() => setSorting("id")}>
                ID {sortBy === "id" && (sortOrder === "asc" ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
              </div>
              <div className="col-span-1">User ID</div>
              <div className="col-span-1 cursor-pointer" onClick={() => setSorting("created_at")}>
                Date {sortBy === "created_at" && (sortOrder === "asc" ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
              </div>
              <div className="col-span-1">Service</div>
              <div className="col-span-2">Link</div>
              <div className="col-span-1 cursor-pointer" onClick={() => setSorting("price")}>
                Price {sortBy === "price" && (sortOrder === "asc" ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
              </div>
              <div className="col-span-1 cursor-pointer" onClick={() => setSorting("quantity")}>
                Quantity {sortBy === "quantity" && (sortOrder === "asc" ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
              </div>
              <div className="col-span-1">Start Count</div>
              <div className="col-span-1 cursor-pointer" onClick={() => setSorting("status")}>
                Status {sortBy === "status" && (sortOrder === "asc" ? <ArrowUp className="inline w-3 h-3" /> : <ArrowDown className="inline w-3 h-3" />)}
              </div>
              <div className="col-span-1">Remains</div>
              <div className="col-span-1">Status Desc</div>
              <div className="col-span-1">Reason</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {loading && orders.length === 0 ? (
                <>
                  <DesktopRowSkeleton />
                  <DesktopRowSkeleton />
                  <DesktopRowSkeleton />
                </>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className={`grid grid-cols-14 gap-2 px-4 py-4 items-center text-sm ${THEME_COLORS.hover?.primary100 ?? ""} ${expandedOrder === order.id ? "bg-blue-50" : ""}`}>
                    <div className="col-span-1 font-medium">{order.id}</div>
                    <div className="col-span-1">{order.user_id}</div>
                    <div className="col-span-1 text-gray-600 text-xs">{formatDate(order.created_at)}</div>
                    <div className="col-span-1" title={order.service_name}>
                      {order.service_name || order.service_id}
                    </div>
                    <div className="col-span-2 flex items-center">
                      <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate text-xs" title={order.link}>
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
                    <div className="col-span-1">{order.remains !== null ? order.remains : "N/A"}</div>
                    <div className="col-span-1">
                      {order.status_description ? (
                        <button onClick={() => toggleOrderExpansion(order.id)} className="text-blue-600 hover:text-blue-800 text-xs truncate max-w-full" title={order.status_description}>
                          {order.status_description.substring(0, 15)}...
                        </button>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <div className="col-span-1">
                      {order.reason ? (
                        <button onClick={() => toggleOrderExpansion(order.id)} className="text-red-600 hover:text-red-800 text-xs truncate max-w-full" title={order.reason}>
                          {order.reason.substring(0, 15)}...
                        </button>
                      ) : (
                        "N/A"
                      )}
                    </div>
                    <div className="col-span-1 flex space-x-1">
                      <button onClick={() => copyToClipboard(order.link)} className="text-gray-400 hover:text-blue-500 p-1" title="Copy link">
                        <Copy className="w-3 h-3" />
                      </button>
                      <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 p-1" title="Open link">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button onClick={() => toggleOrderExpansion(order.id)} className="text-gray-400 hover:text-blue-500 p-1" title="View details">
                        {expandedOrder === order.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className={`w-16 h-16 ${THEME_COLORS.background?.muted ?? "bg-gray-100"} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No orders found</p>
                  <p className="text-sm text-gray-400 mt-1">{searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}</p>
                </div>
              )}

              {/* Loading more indicator */}
              {isFetchingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                </div>
              )}
            </div>
          </div>

          {/* Expanded Order Details Modal */}
          {expandedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className={`rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${THEME_COLORS.background?.card ?? "bg-white"} ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} border`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Order Details #{expandedOrder}</h3>
                  <button onClick={() => setExpandedOrder(null)} className="text-gray-500 hover:text-gray-700">×</button>
                </div>

                {(() => {
                  const order = orders.find((o) => o.id === expandedOrder)
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
                          <div>{order.category_id || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">API Order ID</div>
                          <div>{order.api_order_id || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Status</div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1">Link</div>
                        <div className="flex items-center gap-2">
                          <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                            {order.link}
                          </a>
                          <button onClick={() => copyToClipboard(order.link)} className="text-gray-400 hover:text-blue-500">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {order.status_description && (
                        <div>
                          <div className="text-gray-500 mb-1">Status Description</div>
                          <div className="bg-gray-50 p-3 rounded text-gray-700">{order.status_description}</div>
                        </div>
                      )}

                      {order.reason && (
                        <div>
                          <div className="text-gray-500 mb-1">Reason</div>
                          <div className="bg-red-50 p-3 rounded text-red-700 border border-red-200">{order.reason}</div>
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
                          <div>{order.remains !== null ? order.remains : "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Start Counter</div>
                          <div>{order.start_counter || 0}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Runs</div>
                          <div>{order.runs !== null ? order.runs : "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Interval</div>
                          <div>{order.interval !== null ? order.interval : "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Drip Feed</div>
                          <div>{order.drip_feed !== null ? (order.drip_feed ? "Yes" : "No") : "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Refilled At</div>
                          <div>{order.refilled_at ? formatDate(order.refilled_at) : "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Created At</div>
                          <div>{formatDate(order.created_at)}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-500 mb-1">Updated At</div>
                        <div>{formatDate(order.updated_at)}</div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button onClick={() => setExpandedOrder(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Close
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}

          {/* Pagination (fallback) */}
          {orders.length > 0 && (
            <div className={`rounded-xl p-4 border ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.background?.card ?? "bg-white"}`}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Showing {orders.length} of {pagination.total} orders</div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1 || loading} className={`px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.hover?.primary100 ?? ""}`}>
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">Page {pagination.currentPage} of {pagination.lastPage}</span>
                  <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage || loading} className={`px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 ${THEME_COLORS.border?.primary200 ?? "border-gray-200"} ${THEME_COLORS.hover?.primary100 ?? ""}`}>
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shared sentinel for infinite scroll */}
      <div ref={sentinelRef} />
    </div>
  )
}

export default OrderHistory
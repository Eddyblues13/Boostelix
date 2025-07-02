"use client"

import { useState } from "react"
import { Search, Filter, Download, RefreshCw, Info } from "lucide-react"

const statusTabs = [
  { id: "all", label: "All", count: 0 },
  { id: "pending", label: "Pending", count: 0 },
  { id: "in-progress", label: "In progress", count: 0 },
  { id: "completed", label: "Completed", count: 0 },
  { id: "partial", label: "Partial", count: 0 },
  { id: "processing", label: "Processing", count: 0 },
  { id: "canceled", label: "Canceled", count: 0 },
]

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "in-progress":
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "partial":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
    case "canceled":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

const sampleOrders = [
  {
    id: "ORD001",
    date: "2024-01-15",
    link: "https://instagram.com/example",
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
    link: "https://youtube.com/watch?v=example",
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
    link: "https://tiktok.com/@example",
    charge: "₦1,200",
    startCount: "500",
    quantity: "500",
    service: "TikTok Likes",
    status: "Pending",
    remains: "500",
  },
]

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [orders] = useState(sampleOrders)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.link.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = activeTab === "all" || order.status.toLowerCase().replace(" ", "-") === activeTab

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
              <p className="text-gray-600 mt-1">Track and manage all your orders</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium flex items-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-1">
            <div className="flex flex-wrap gap-1">
              {statusTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-blue-700 shadow-md"
                      : "text-blue-100 hover:text-white hover:bg-blue-500/30"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID, service, or link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select className="w-40 border border-gray-300 rounded-md p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="all-services">All Services</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
              </select>
              <button className="px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {activeTab === "all" ? "All Orders" : `${statusTabs.find((t) => t.id === activeTab)?.label} Orders`}
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 font-semibold text-gray-700">ID</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Link</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Charge</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Start Count</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Service</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Remains</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                        <td className="py-3 px-4 text-gray-600">{order.date}</td>
                        <td className="py-3 px-4 max-w-xs">
                          <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline truncate block"
                            title={order.link}
                          >
                            {order.link.length > 30 ? `${order.link.substring(0, 30)}...` : order.link}
                          </a>
                        </td>
                        <td className="py-3 px-4 font-semibold text-green-600">{order.charge}</td>
                        <td className="py-3 px-4 text-gray-600">{order.startCount}</td>
                        <td className="py-3 px-4 text-gray-600">{order.quantity}</td>
                        <td className="py-3 px-4 font-medium">{order.service}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{order.remains}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="text-gray-500">
                            <p className="font-medium">No orders found</p>
                            <p className="text-sm">
                              {searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}
                            </p>
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
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                  disabled
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 border border-blue-600 bg-blue-600 text-white rounded-md text-sm font-medium">
                  1
                </button>
                <button 
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Information Notice */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Info className="w-6 h-6" />
            <h4 className="text-lg font-bold">Order Information</h4>
          </div>
          <p className="text-sm">
            For any issues with your orders, please contact support with your order ID.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderHistory
"use client"

import { NavLink, useLocation } from "react-router-dom"
import {
  ShoppingCart,
  CreditCard,
  History,
  Headphones,
  Settings,
  DollarSign,
  Server,
  RefreshCw,
  BookOpen,
  Menu
} from "lucide-react"
import { CSS_COLORS, THEME_COLORS } from "../constant/colors"
import { useEffect } from "react"

const Sidebar = ({ sidebarOpen, setSidebarOpen, user }) => {
  const location = useLocation()

  // Collapse sidebar on mobile after route change
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [location.pathname])

  const sidebarItems = [
    { icon: ShoppingCart, label: "New order", to: "/dashboard" },
    { icon: CreditCard, label: "Add funds", to: "/dashboard/add-funds" },
    { icon: History, label: "Order history", to: "/dashboard/orders" },
    { icon: Headphones, label: "Customer Support", to: "/dashboard/support" },
    { icon: Settings, label: "Services", to: "/dashboard/services" },
    { icon: DollarSign, label: "Make money", to: "/dashboard/affiliate" },
    { icon: Server, label: "API", to: "/dashboard/api" },
    { icon: RefreshCw, label: "Updates", to: "/dashboard/updates" },
    { icon: BookOpen, label: "Tutorials", to: "/dashboard/tutorials" }
  ]

  return (
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          overflow-y-auto text-white
        `}
        style={{
          background: CSS_COLORS.background.sidebar,
          boxShadow: "4px 0 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className={`p-6 border-b ${THEME_COLORS.border.primary200}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-lg">boostelix.com</span>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-1 rounded-lg transition-colors ${THEME_COLORS.hover.primary100}`}
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className={`p-6 border-b ${THEME_COLORS.border.primary200}`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.username || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 font-bold text-xl">
                    {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
              <div>
                <div className="text-white font-medium">{user?.username || "Loading..."}</div>
                <div className="text-sm text-gray-300">0+</div>
              </div>
            </div>
          </div>

          {/* Menu Title */}
          <div className="px-6 py-4">
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Menu
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 pb-4">
            <div className="space-y-1">
              {sidebarItems.map((item, index) => {
                const isActive = location.pathname === item.to
                return (
                  <NavLink
                    key={index}
                    to={item.to}
                    className={`relative w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? `${THEME_COLORS.text.primary100} font-semibold`
                        : "text-white hover:bg-blue-100/10 hover:text-white"
                    }`}
                    style={
                      isActive
                        ? { background: CSS_COLORS.background.activeSidebar }
                        : {}
                    }
                  >
                    <item.icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? THEME_COLORS.text.primary100
                          : "text-white/70 group-hover:text-white"
                      }`}
                    />
                    <span className="relative z-10">{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

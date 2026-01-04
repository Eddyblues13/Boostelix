"use client"
import NotificationButton from "./NotificationButton"
import { useState, useRef, useEffect } from "react"
import { Bell, LogOut, Globe, ChevronDown, Settings, Menu, Shield } from "lucide-react"
import { CSS_COLORS } from "../constant/colors"
import { useNavigate } from "react-router-dom"

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  selectedCurrency,
  setSelectedCurrency,
  currencies,
  user,
  onLogout,
}) => {
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false)
  const currencyRef = useRef(null)
  const navigate = useNavigate()
  const isAdminImpersonating = localStorage.getItem('isAdminImpersonating') === 'true'

  // Handle return to admin
  const handleReturnToAdmin = () => {
    // Restore admin session
    const adminToken = sessionStorage.getItem('adminToken_backup')
    const adminData = sessionStorage.getItem('adminData_backup')
    
    if (adminToken && adminData) {
      localStorage.setItem('adminToken', adminToken)
      localStorage.setItem('adminData', adminData)
    }
    
    // Clear impersonation flags
    localStorage.removeItem('isAdminImpersonating')
    sessionStorage.removeItem('adminToken_backup')
    sessionStorage.removeItem('adminData_backup')
    
    // Clear user session
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    
    // Navigate to admin dashboard
    window.location.href = '/admin/dashboard'
  }

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-xl sm:rounded-2xl shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu - Mobile only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Page Title - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-gray-600 text-sm">
              Currently on <strong className="text-gray-800">New order</strong>
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
          {/* Return to Admin Button - Show when impersonating */}
          {isAdminImpersonating && (
            <button
              onClick={handleReturnToAdmin}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
              title="Return to Admin Panel"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Return to Admin</span>
            </button>
          )}
          
          {/* Currency Dropdown */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border text-xs sm:text-sm transition-colors"
              style={{
                backgroundColor: CSS_COLORS.primaryExtraLight,
                borderColor: CSS_COLORS.primaryLight,
              }}
            >
              <span
                className="font-semibold"
                style={{ color: CSS_COLORS.primaryDark }}
              >
                {selectedCurrency.symbol} {selectedCurrency.code}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${currencyDropdownOpen ? "rotate-180" : ""}`}
                style={{ color: CSS_COLORS.primary }}
              />
            </button>

            {currencyDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-y-auto transition-all duration-150 z-50"
                style={{ maxHeight: "70vh" }}
              >
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      setSelectedCurrency(currency)
                      setCurrencyDropdownOpen(false)
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <Globe className="w-4 h-4 text-gray-400" />
                    <div className="font-medium text-gray-700">
                      {currency.symbol} {currency.code}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 🔔 Notification Button */}
          {/* <button
            onClick={() => navigate("/dashboard/notifications")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ backgroundColor: CSS_COLORS.primary }}
            />
          </button> */}

           <NotificationButton />

          {/* ⚙️ Settings */}
          <button
            onClick={() => navigate(`/dashboard/account`)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>

          {/* 🚪 Logout */}
          <button
            onClick={onLogout}
            className="text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center space-x-1 sm:space-x-2"
            style={{ backgroundColor: CSS_COLORS.primary }}
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

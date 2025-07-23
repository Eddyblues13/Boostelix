"use client"

import { useState, useRef } from "react"
import { Bell, LogOut, Globe, ChevronDown, Settings, Menu } from "lucide-react"
import { THEME_COLORS, CSS_COLORS } from "../constant/colors"

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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 mx-4 mt-4 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Left side */}
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu - Visible on mobile only */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Logo (Mobile) */}
          <div className="block lg:hidden">
            <span className="font-bold text-gray-800 text-lg">Boostelix</span>
          </div>

          {/* Page Title - Desktop only */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-gray-600 text-sm">
              Currently on{" "}
              <strong className="text-gray-800">New order</strong>
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Currency Dropdown */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl border text-sm transition-colors"
              style={{
                backgroundColor: CSS_COLORS.primaryExtraLight,
                borderColor: CSS_COLORS.primaryLight,
              }}
            >
              <span
                className="font-semibold"
                style={{ color: CSS_COLORS.primaryDark }}
              >
                {selectedCurrency.symbol} 0
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  currencyDropdownOpen ? "rotate-180" : ""
                }`}
                style={{ color: CSS_COLORS.primary }}
              />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-lg z-50">
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
                    <div>
                      <div className="font-medium text-gray-700">
                        {currency.symbol} {currency.code}
                      </div>
                      <div className="text-xs text-gray-500">{currency.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
              style={{ backgroundColor: CSS_COLORS.primary }}
            />
          </button>

          {/* Settings */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2"
            style={{ backgroundColor: CSS_COLORS.primary }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

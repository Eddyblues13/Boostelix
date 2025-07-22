"use client"

import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Header from "../../components/dashboard/Header"
import Sidebar from "../../components/dashboard/Sidebar"
import { getUserFromLocalStorage } from "../../utils/helpers"
import { CSS_COLORS } from "../../components/constant/colors"
import toast from "react-hot-toast"

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState({ code: "NGN", symbol: "₦", name: "Nigerian Naira" })
  const navigate = useNavigate()

  const currencies = [
    { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  ]

  useEffect(() => {
    const userData = getUserFromLocalStorage()
    if (userData) {
      setUser(userData)
    } else {
      handleLogout()
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    toast.success("Logged out successfully")
    navigate("/")
  }

  return (
    <div className="min-h-screen" style={{ background: CSS_COLORS.background.primary }}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
          style={{ backgroundColor: "rgba(15, 118, 110, 0.4)", backdropFilter: "blur(8px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        currencies={currencies}
        user={user}
        onLogout={handleLogout}
      />

      {/* Sidebar + Main */}
      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
          currencies={currencies}
          user={user}
        />

        {/* Main Content - Increased space */}
        <main className="flex-1 lg:ml-64">
          <div className="w-full min-h-[calc(100vh-6rem)]">
            <div className="min-h-full p-2 lg:p-4" style={{ backgroundColor: CSS_COLORS.background.overlay }}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

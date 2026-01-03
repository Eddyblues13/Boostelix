"use client"
import React from "react"

const StatsCards = ({ user, formattedBalance, selectedCurrency }) => {
  return (
    <>
      {/* Mobile Stats Cards */}
      <div className="lg:hidden grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">💰</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Balance</p>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate leading-tight">{formattedBalance}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">👑</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Status</p>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate leading-tight">{user?.status || "NEW"}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">👤</div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Username</p>
              <h3 
                className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate break-words leading-tight"
                title={user?.username || "loading.."}
              >
                {user?.username || "loading.."}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-2xl sm:text-3xl md:text-4xl flex-shrink-0">📦</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">Orders</p>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 leading-tight">{user?.total_orders || "0"}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Stats Cards */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="text-4xl flex-shrink-0">💰</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500 mb-1">Account Balance</p>
              <h3 className="text-2xl font-bold text-gray-800 truncate">{formattedBalance}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="text-4xl flex-shrink-0">👑</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500 mb-1">Account Status</p>
              <h3 className="text-xl font-bold text-gray-800 truncate">{user?.status || "NEW"}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="text-4xl flex-shrink-0">👤</div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-sm text-gray-500 mb-1">Username</p>
              <h3 
                className="text-xl font-bold text-gray-800 truncate break-all"
                title={user?.username || "loading.."}
              >
                {user?.username || "loading.."}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center space-x-4">
            <div className="text-4xl flex-shrink-0">📦</div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">{user?.total_orders || "0"}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StatsCards

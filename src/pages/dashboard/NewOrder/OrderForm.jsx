"use client"
import React from "react"
import { Globe, Loader2 } from "lucide-react"
import SearchBar from "./SearchBar"
import { CSS_COLORS } from "../../../components/constant/colors"

const OrderForm = ({
  // Search
  searchQuery,
  handleSearchChange,
  handleSearchFocus,
  handleSearchBlur,
  showSearchResults,
  isSearching,
  searchResults,
  handleServiceSelect,
          getPlatformIcon,
          convertToSelectedCurrency,
          formatCurrency,
          selectedCurrency,
  
  // Categories & Services
  categories,
  loadingCategories,
  selectedCategory,
  setSelectedCategory,
  services,
  loadingServices,
  selectedService,
  setSelectedService,
  setQuantity,
  
  // Form fields
  quantity,
  setQuantityValue,
  link,
  setLink,
  
  // Submission
  isSubmitting,
  handleSubmitOrder,
  
  // Totals
  formattedTotalCost,
  
  // Layout
  isMobile = false
}) => {
  return (
    <div className={`bg-white ${isMobile ? 'rounded-lg sm:rounded-xl p-3 sm:p-4' : 'rounded-2xl p-6'} shadow-sm border border-gray-100`}>
      <h2 className={`${isMobile ? 'text-lg sm:text-xl' : 'text-2xl'} font-semibold text-gray-800 ${isMobile ? 'mb-3 sm:mb-4' : 'mb-6'}`}>
        Place Your Order
      </h2>
      
      <div className={`${isMobile ? 'space-y-3 sm:space-y-4' : 'space-y-6'}`}>
        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchFocus={handleSearchFocus}
          onSearchBlur={handleSearchBlur}
          showSearchResults={showSearchResults}
          isSearching={isSearching}
          searchResults={searchResults}
          onSelectService={handleServiceSelect}
          getPlatformIcon={getPlatformIcon}
          convertToSelectedCurrency={convertToSelectedCurrency}
          formatCurrency={formatCurrency}
          selectedCurrency={selectedCurrency}
          isMobile={isMobile}
        />

        {/* Category & Service */}
        <div className={`grid grid-cols-1 ${!isMobile && 'md:grid-cols-2'} ${isMobile ? 'gap-3' : 'gap-6'}`}>
          <div>
            <label className={`block ${isMobile ? 'text-sm sm:text-base' : 'text-lg'} font-medium text-gray-700 ${isMobile ? 'mb-2' : 'mb-3'}`}>
              Category
            </label>
            {loadingCategories ? (
              <div className={`${isMobile ? 'p-3' : 'p-4'} border border-gray-200 rounded-xl bg-gray-50 animate-pulse`}>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedCategory?.id || ""}
                  onChange={(e) => {
                    const cat = categories.find((c) => c.id.toString() === e.target.value)
                    setSelectedCategory(cat)
                  }}
                  className={`w-full ${isMobile ? 'pl-10 pr-4 py-3 text-sm' : 'pl-12 pr-4 py-4 text-lg'} border border-gray-200 rounded-xl appearance-none bg-gray-50`}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.category_title}
                    </option>
                  ))}
                </select>
                <div className={`absolute ${isMobile ? 'left-3' : 'left-4'} top-1/2 transform -translate-y-1/2`}>
                  {selectedCategory ? (
                    getPlatformIcon(selectedCategory.category_title)
                  ) : (
                    <Globe className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-500`} />
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className={`block ${isMobile ? 'text-sm sm:text-base' : 'text-lg'} font-medium text-gray-700 ${isMobile ? 'mb-2' : 'mb-3'}`}>
              Service
            </label>
            {loadingServices ? (
              <div className={`${isMobile ? 'p-3' : 'p-4'} border border-gray-200 rounded-xl bg-gray-50 animate-pulse`}>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ) : (
              <>
                <div className="relative">
                  <select
                    value={selectedService?.id || ""}
                    onChange={(e) => {
                      const srv = services.find((s) => s.id.toString() === e.target.value)
                      if (srv) {
                        setSelectedService(srv)
                        setQuantity(srv.min_amount.toString())
                      }
                    }}
                    className={`w-full ${isMobile ? 'pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base' : 'pl-12 pr-4 py-4 text-lg'} border border-gray-200 rounded-lg sm:rounded-xl appearance-none bg-gray-50`}
                    disabled={!selectedCategory || services.length === 0}
                  >
                    {services.length > 0 ? (
                      services.map((service) => (
                        <option key={service.id} value={service.id.toString()}>
                          {service.service_title} - {formatCurrency && typeof formatCurrency === 'function' ? formatCurrency(
                            convertToSelectedCurrency(service.price * 1000, "NGN"),
                            selectedCurrency
                          ) : `₦${(service.price * 1000).toLocaleString()}`} per 1k
                        </option>
                      ))
                    ) : (
                      <option value="">No services available</option>
                    )}
                  </select>
                  {/* Icon overlay for selected service */}
                  <div className={`absolute ${isMobile ? 'left-3' : 'left-4'} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
                    {selectedService && getPlatformIcon(selectedCategory?.category_title, selectedService.service_title)}
                  </div>
                </div>
                {selectedService && (
                  <div className={`${isMobile ? 'mt-3' : 'mt-3'} flex items-center gap-2`}>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(selectedCategory?.category_title, selectedService.service_title)}
                      <p className={`${isMobile ? 'text-sm sm:text-base' : 'text-sm'} text-gray-500`}>
                        Min: {selectedService.min_amount} - Max: {selectedService.max_amount}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Link & Quantity */}
        <div className={`grid grid-cols-1 ${!isMobile && 'md:grid-cols-2'} ${isMobile ? 'gap-4' : 'gap-6'}`}>
          <div>
            <label className={`block ${isMobile ? 'text-sm sm:text-base' : 'text-lg'} font-medium text-gray-700 ${isMobile ? 'mb-2' : 'mb-3'}`}>
              Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter your profile/post URL"
              className={`w-full px-3 sm:px-4 ${isMobile ? 'py-2.5 sm:py-3 text-sm sm:text-base' : 'py-4 text-lg'} border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50`}
              required
            />
          </div>

          <div>
            <label className={`block ${isMobile ? 'text-sm sm:text-base' : 'text-lg'} font-medium text-gray-700 ${isMobile ? 'mb-2' : 'mb-3'}`}>
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantityValue(e.target.value)}
              min={selectedService?.min_amount || 0}
              max={selectedService?.max_amount || 1000000}
              placeholder="Enter quantity"
              className={`w-full px-3 sm:px-4 ${isMobile ? 'py-2.5 sm:py-3 text-sm sm:text-base' : 'py-4 text-lg'} border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-gray-50`}
              required
            />
          </div>
        </div>

        {/* Cost Summary */}
        <div className={`bg-blue-50 rounded-lg sm:rounded-xl ${isMobile ? 'p-3 sm:p-4' : 'p-6'} border border-blue-100`}>
          <div className="text-center">
            <p className={`${isMobile ? 'text-sm sm:text-base' : 'text-xl'} text-gray-600 ${isMobile ? 'mb-1.5' : 'mb-3'}`}>
              Total Cost
            </p>
            <p className={`${isMobile ? 'text-2xl sm:text-3xl' : 'text-4xl'} font-bold text-gray-800 ${isMobile ? 'mb-2' : 'mb-3'}`}>
              {formattedTotalCost}
            </p>
            <p className={`${isMobile ? 'text-xs sm:text-sm' : 'text-lg'} text-gray-500`}>
              {quantity} units × {selectedService ? (formatCurrency && typeof formatCurrency === 'function' ? formatCurrency(convertToSelectedCurrency(selectedService.price * 1000, "NGN"), selectedCurrency) : `₦${(selectedService.price * 1000).toLocaleString()}`) : '0'} per 1k
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className={`w-full text-white font-semibold ${isMobile ? 'py-3 sm:py-4 text-sm sm:text-base' : 'py-5 text-xl'} rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center transition-all duration-200 active:opacity-90 disabled:opacity-70`}
          style={{ backgroundColor: CSS_COLORS.primary }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className={`${isMobile ? 'w-5 h-5 mr-2' : 'w-6 h-6 mr-3'} animate-spin`} />
              {isMobile ? 'Processing...' : 'Processing Order...'}
            </>
          ) : (
            "Submit Order"
          )}
        </button>
      </div>
    </div>
  )
}

export default OrderForm

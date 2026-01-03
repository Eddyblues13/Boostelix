"use client"
import React from "react"

const ServiceDetails = ({ selectedService, selectedCategory, getPlatformIcon, metrics, isMobile = false }) => {
  return (
    <div className={`bg-white ${isMobile ? 'rounded-xl p-3 sm:p-4 md:p-5' : 'rounded-2xl p-6'} shadow-sm border border-gray-100 ${!isMobile && 'sticky top-6'}`}>
      <h3 className={`${isMobile ? 'text-base sm:text-lg' : 'text-2xl'} font-semibold text-gray-800 ${isMobile ? 'mb-3 sm:mb-4' : 'mb-6'}`}>
        Service Details
      </h3>
      
      {/* Service Header */}
      <div className={`bg-blue-600 rounded-xl ${isMobile ? 'p-4' : 'p-4'} text-white ${isMobile ? 'mb-4' : 'mb-6'}`}>
        <div className={`flex items-center ${isMobile ? 'space-x-3 mb-2' : 'space-x-3 mb-2'}`}>
          {selectedService && selectedCategory ? (
            getPlatformIcon(selectedCategory.category_title, selectedService.service_title)
          ) : selectedCategory ? (
            getPlatformIcon(selectedCategory.category_title)
          ) : null}
          <h4 className={`font-medium ${isMobile ? '' : 'text-lg'}`}>Service</h4>
        </div>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} opacity-90 truncate`}>
          {selectedService?.service_title || "Select a service"}
        </p>
      </div>

      {/* Service Metrics */}
      <div className={`grid grid-cols-2 ${isMobile ? 'gap-3 mb-4' : 'gap-4 mb-6'}`}>
        <div className={`bg-gray-50 rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}>
          <h5 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 ${isMobile ? 'mb-1' : 'mb-2'}`}>
            Start Time
          </h5>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800`}>
            {metrics?.startTime || "--"}
          </p>
        </div>
        
        <div className={`bg-gray-50 rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}>
          <h5 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 ${isMobile ? 'mb-1' : 'mb-2'}`}>
            Speed
          </h5>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800`}>
            {metrics?.speed || "--"}
          </p>
        </div>
        
        <div className={`bg-gray-50 rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}>
          <h5 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 ${isMobile ? 'mb-1' : 'mb-2'}`}>
            Avg. Time
          </h5>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800 font-medium`}>
            {metrics?.avgTime || "--"}
          </p>
        </div>
        
        <div className={`bg-gray-50 rounded-xl ${isMobile ? 'p-3' : 'p-4'}`}>
          <h5 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-600 ${isMobile ? 'mb-1' : 'mb-2'}`}>
            Guarantee
          </h5>
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-800`}>
            {metrics?.guarantee || "--"}
          </p>
        </div>
      </div>

      {/* Service Description */}
      <div>
        <h5 className={`${isMobile ? 'text-sm' : 'text-lg'} font-medium text-gray-600 ${isMobile ? 'mb-3' : 'mb-4'}`}>
          Description
        </h5>
        <div className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-700 ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
          <p className="font-medium">
            {selectedService?.description || (isMobile ? "Select a service to view description" : "Select a service to view detailed description and features.")}
          </p>
          {!selectedService?.description && (
            <>
              <p>⚡ {isMobile ? "High-quality service delivery" : "High-quality service delivery with guaranteed results"}</p>
              <p>🛡️ {isMobile ? "30-day guarantee on all orders" : "30-day guarantee on all orders with free refills"}</p>
              <p>🚀 {isMobile ? "Fast and reliable results" : "Fast and reliable delivery with real-time updates"}</p>
              {!isMobile && <p>💯 100% customer satisfaction guaranteed</p>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServiceDetails

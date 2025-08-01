"use client"

import React, { useState } from "react"
import { Search, Info } from "lucide-react"
import { CSS_COLORS } from "../../components/constant/colors"

// UI Components
const Card = ({ className = "", style = {}, children }) => (
  <div className={`rounded-2xl border border-white/50 shadow-sm backdrop-blur-sm ${className}`} style={style}>
    {children}
  </div>
)

const CardHeader = ({ className = "", children }) => (
  <div className={`p-0 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ className = "", children }) => (
  <div className={`p-0 ${className}`}>
    {children}
  </div>
)

const Input = ({ 
  type = "text", 
  placeholder = "", 
  value = "", 
  onChange, 
  className = "", 
  style = {} 
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base ${className}`}
    style={style}
  />
)

const Button = ({ 
  onClick, 
  className = "", 
  style = {}, 
  children, 
  disabled = false, 
  variant = "default" 
}) => {
  const baseClasses = "font-semibold rounded-xl shadow-lg transition-opacity hover:opacity-90 text-base"
  const variantClasses = variant === "outline" 
    ? "bg-transparent border border-primary text-primary hover:bg-primary-veryLight" 
    : "text-white bg-primary"

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Select = ({ value, onValueChange, children }) => {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="relative">
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setOpen(!open),
            "aria-expanded": open
          })
        }
        if (child.type === SelectContent && open) {
          return React.cloneElement(child, {
            onClose: () => setOpen(false),
            onValueChange: (val) => {
              onValueChange(val)
              setOpen(false)
            }
          })
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = ({ className = "", children, ...props }) => (
  <div 
    className={`flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-base cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </div>
)

const SelectContent = ({ className = "", children, onClose, onValueChange }) => (
  <div 
    className={`${className}`}
    style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      zIndex: 50,
      minWidth: '100%',
      marginTop: '0.5rem',
      borderRadius: '0.5rem',
      backgroundColor: CSS_COLORS.background.muted,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}
  >
    {React.Children.map(children, child => {
      if (child.type === SelectItem) {
        return React.cloneElement(child, {
          onClick: () => onValueChange(child.props.value)
        })
      }
      return child
    })}
  </div>
)

const SelectValue = ({ placeholder = "Select..." }) => (
  <span className="truncate">{placeholder}</span>
)

const SelectItem = ({ value, children, onClick }) => (
  <div 
    className="px-4 py-2 hover:bg-primary-veryLight hover:text-primary cursor-pointer"
    onClick={onClick}
  >
    {children}
  </div>
)

// Main Updates Component
function Updates() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Mock data for updates
  const allUpdates = [
    {
      id: 1,
      service: "5712 - TikTok Video Views",
      details: "Max Unlimited | Instant Start | Day 10M | Cheap | Superfast",
      date: "2025-07-31",
      update: "Rate increased from NGN 22.23 to NGN 26.94",
      category: "TikTok",
    },
    {
      id: 2,
      service: "5623 - TikTok Video Views",
      details: "Superfast - Provider Service",
      date: "2025-07-31",
      update: "Service disabled",
      category: "TikTok",
    },
    {
      id: 3,
      service: "4894 - Twitter Tweet Views",
      details: "0 - 1Min Completed ⚡ - Superfast",
      date: "2025-07-28",
      update: "Rate increased from NGN 123.80 to NGN 123.87",
      category: "Twitter",
    },
    {
      id: 4,
      service: "5187 - YouTube Comments",
      details: "Custom | 1k / Day | R30",
      date: "2025-07-28",
      update: "Service disabled",
      category: "YouTube",
    },
    {
      id: 5,
      service: "5183 - Youtube Custom Comment",
      details: "Max 20K | No Refill | Provider Service",
      date: "2025-07-28",
      update: "Service disabled",
      category: "YouTube",
    },
    {
      id: 6,
      service: "6001 - Instagram Likes",
      details: "High Quality | Instant | Fast",
      date: "2025-07-27",
      update: "Rate decreased from NGN 10.00 to NGN 8.50",
      category: "Instagram",
    },
    {
      id: 7,
      service: "7002 - Facebook Page Followers",
      details: "Real Users | Lifetime Guarantee",
      date: "2025-07-26",
      update: "Service enabled",
      category: "Facebook",
    },
    {
      id: 8,
      service: "8003 - Spotify Plays",
      details: "Premium | Fast Delivery",
      date: "2025-07-25",
      update: "Rate increased from NGN 5.00 to NGN 6.20",
      category: "Spotify",
    },
  ]

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "TikTok", label: "TikTok" },
    { value: "Twitter", label: "Twitter" },
    { value: "YouTube", label: "YouTube" },
    { value: "Instagram", label: "Instagram" },
    { value: "Facebook", label: "Facebook" },
    { value: "Spotify", label: "Spotify" },
  ]

  const filteredUpdates = allUpdates.filter((update) => {
    const matchesSearch =
      update.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.update.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || update.category === selectedFilter
    return matchesSearch && matchesFilter
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredUpdates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentUpdates = filteredUpdates.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

return (
  <div className="w-full min-h-screen p-4 lg:p-6" style={{ backgroundColor: CSS_COLORS.background.page }}>
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Search and Filter Section */}
      <Card style={{ backgroundColor: CSS_COLORS.background.card }}>
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            
            {/* Filter Dropdown */}
            <div className="w-full lg:w-auto">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger style={{ backgroundColor: CSS_COLORS.background.muted }}>
                  <SelectValue placeholder={filterOptions.find(opt => opt.value === selectedFilter)?.label || "All"} />
                </SelectTrigger>
                <SelectContent className="bg-background-muted">
                  {filterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search updates..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ backgroundColor: CSS_COLORS.background.muted }}
                className="pl-12 pr-4 py-3"
              />
            </div>

            {/* Search Button */}
            <Button
              onClick={() => setCurrentPage(1)}
              className="w-full lg:w-auto py-3 px-6"
              style={{ backgroundColor: CSS_COLORS.primary }}
            >
              Search
            </Button>
          </div>
        </div>
      </Card>

      {/* Updates List */}
      <Card style={{ backgroundColor: CSS_COLORS.background.card }}>
        <div className="p-4 lg:p-6">
          <CardHeader className="mb-4">
            <div className="hidden lg:grid grid-cols-[2fr_1fr_2fr] gap-4 text-text-medium font-semibold border-b border-gray-200 pb-3">
              <div className="px-4">Service</div>
              <div className="px-4">Date</div>
              <div className="px-4">Update</div>
            </div>
          </CardHeader>

          <CardContent>
            {currentUpdates.length > 0 ? (
              <div className="space-y-4">
                {currentUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex flex-col lg:grid lg:grid-cols-[2fr_1fr_2fr] gap-3 p-4 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-medium text-text-DEFAULT">{update.service}</h3>
                      <p className="text-sm text-text-medium">{update.details}</p>
                    </div>
                    <div className="text-sm text-text-medium lg:self-center">{update.date}</div>
                    <div className="text-sm text-text-DEFAULT font-medium lg:self-center">
                      {update.update}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-text-medium">
                <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>No updates found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <>
          {/* Mobile Pagination */}
          <div className="lg:hidden flex justify-between items-center mt-6">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="px-4 py-2 rounded-lg"
            >
              Previous
            </Button>
            <span className="text-text-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="px-4 py-2 rounded-lg"
            >
              Next
            </Button>
          </div>

          {/* Desktop Pagination */}
          <div className="hidden lg:flex justify-center items-center space-x-2 mt-6">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              className="px-4 py-2 rounded-lg"
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3 && currentPage < totalPages - 2) {
                  page = currentPage - 2 + i;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                }
              }

              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === page ? "text-white shadow-md" : "text-text-medium"
                  }`}
                  style={{
                    backgroundColor: currentPage === page ? CSS_COLORS.primary : CSS_COLORS.background.muted,
                    color: currentPage === page ? "white" : CSS_COLORS.primary200,
                  }}
                >
                  {page}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-text-medium">...</span>
                <Button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-4 py-2 rounded-lg font-medium text-text-medium bg-background-muted"
                  style={{
                    backgroundColor: CSS_COLORS.background.muted,
                    color: CSS_COLORS.primary100,
                  }}
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              className="px-4 py-2 rounded-lg"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Footer Notice */}
      <Card>
        <div
          className="p-4 lg:p-6"
          style={{
            background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})`,
            color: "white",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/20 rounded-2xl flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg lg:text-xl font-bold mb-2">
                Service <span className="text-yellow-300">Updates</span>
              </h3>
              <div className="bg-white/10 rounded-2xl p-4">
                <h4 className="font-semibold mb-2 text-yellow-300">🚨 Important Notice</h4>
                <p className="text-sm lg:text-base text-white/90">
                  For any non-delivered orders, please contact our support team for immediate assistance and refund processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer Copyright */}
      <div className="text-center py-6">
        <p className="text-sm text-gray-500">
          © Copyright {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </div>
  </div>
);

}

export default Updates
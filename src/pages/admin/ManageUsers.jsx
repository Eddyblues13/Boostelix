"use client"

import { useState, useEffect } from "react"
import { Search, MoreVertical, X, UserPlus, Menu } from "lucide-react"
import UserDetailsCard from "./UserDetailsCard"
import UserForm from "./UserForm"
import SendEmailForm from "./SendEmailForm"
import BalanceForm from "./BalanceForm"
import CustomRateForm from "./CustomRateForm"
import UserTable from "./UserTable"
import UserStats from "./UserStats"
import { fetchUsers } from "../../services/adminService"; 

const ManageUsers = () => {
  // State management
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [selectedUser, setSelectedUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeUserAction, setActiveUserAction] = useState(null)
  const [users, setUsers] = useState({ data: [] });
  const [activeDropdownUserId, setActiveDropdownUserId] = useState(null);


useEffect(() => {
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetchUsers(); 
      setUsers(response); // Directly set array
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]); // Reset to empty array
    } finally {
      setIsLoading(false);
    }
  };
  loadUsers();
}, []);



  const [formData, setFormData] = useState({
    // Your existing form data
  })

  const [passwordData, setPasswordData] = useState({
    new_password: "",
    confirm_password: "",
  })

  // Utility functions
  const formatCurrency = (amount, currency = "NGN") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Handler functions
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingUser) {
      setUsers(prev =>
        prev.map(user => (user.id === editingUser.id ? { ...user, ...formData, id: editingUser.id } : user))
      )
      setEditingUser(null)
    } else {
      const newUser = {
        ...formData,
        id: Date.now(),
        balance: Number.parseFloat(formData.balance) || 0,
        api_key: generateApiKey(),
        avatar: null,
        joined_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        total_orders: 0,
        total_spent: 0,
      }
      setUsers(prev => [...prev, newUser])
    }

    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      address: "",
      preferred_language: "English",
      status: "active",
      email_verified: false,
      sms_verified: false,
      two_factor_enabled: false,
      balance: "",
      currency: "NGN",
      account_type: "standard",
    })
    setShowAddForm(false)
    setActiveUserAction(null)
  }

  const handlePasswordUpdate = (e) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Passwords do not match!")
      return
    }
    // Update password logic here
    setPasswordData({ new_password: "", confirm_password: "" })
    setShowPasswordChange(false)
    alert("Password updated successfully!")
  }

  const handleEdit = (user) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      preferred_language: user.preferred_language,
      status: user.status,
      email_verified: user.email_verified,
      sms_verified: user.sms_verified,
      two_factor_enabled: user.two_factor_enabled,
      balance: user.balance.toString(),
      currency: user.currency,
      account_type: user.account_type,
    })
    setEditingUser(user)
    setShowAddForm(true)
    setSelectedUser(null)
    setActiveUserAction("edit")
  }

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id))
    setSelectedUser(null)
  }

 const toggleUserStatus = (id) => {
  setUsers(prev =>
    prev.map(user => 
      user.id === id 
        ? { ...user, status: user.status === "active" ? "banned" : "active" } 
        : user
    )
  );
};

  const handleSyncServices = (id) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      alert(`Syncing services for user ID: ${id}`)
      setIsLoading(false)
    }, 1000)
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setActiveUserAction(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleActionSubmit = (action, data) => {
    switch (action) {
      case "add_subtract_balance":
        // Handle balance adjustment
        setUsers(prev =>
          prev.map(user =>
            user.id === data.userId
              ? {
                  ...user,
                  balance:
                    data.action === "add"
                      ? user.balance + data.amount
                      : user.balance - data.amount,
                }
              : user
          )
        )
        alert(`Balance ${data.action === "add" ? "added" : "subtracted"} successfully!`)
        break
      case "custom_rate":
         // Handle custom rate setting
        alert(`Custom rate set for ${data.service}: ${data.rate}${data.type === "percentage" ? "%" : ""}`)
        break
      default:
        break
    }
    setActiveUserAction(null)
  }


  const filteredUsers = users.data.filter(user => {
    const matchesSearch =
     user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All Status" ||
    (statusFilter === "Active" && user.status === "active") ||
    (statusFilter === "Banned" && user.status === "banned");

   return matchesSearch && matchesStatus;
   });


  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Users</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage user accounts, permissions, and activities
          </p>
        </div>

        {/* Conditional Rendering */}
       
        {activeUserAction === "edit" && showAddForm && (
          <UserForm
            formData={formData}
            editingUser={editingUser}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onClose={() => {
              setShowAddForm(false)
              setEditingUser(null)
              setActiveUserAction(null)
            }}
          />
        )}

        {activeUserAction === "send_email" && selectedUser && (
          <SendEmailForm
            user={selectedUser}
            onCancel={() => setActiveUserAction(null)}
            onSubmit={({ to, subject, message }) => {
              alert(`Sending email to ${to} with subject: ${subject} and message: ${message}`)
              setActiveUserAction(null)
            }}
          />
        )}

        {activeUserAction === "add_subtract_balance" && selectedUser && (
          <BalanceForm
            user={selectedUser}
            onCancel={() => setActiveUserAction(null)}
            onSubmit={(data) => handleActionSubmit("add_subtract_balance", data)}
          />
        )}

        {activeUserAction === "custom_rate" && selectedUser && (
          <CustomRateForm
            user={selectedUser}
            onCancel={() => setActiveUserAction(null)}
            onSubmit={(data) => handleActionSubmit("custom_rate", data)}
          />
        )}

        {/* Search and Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-4 sm:hidden">
            <h3 className="font-semibold text-gray-900">Filters & Actions</h3>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className={`${showMobileFilters ? "block" : "hidden"} sm:block`}>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                <div className="relative flex-1 max-w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[140px] transition-all duration-200 text-sm"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Banned</option>
                </select>

                <button className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-sm">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm)
                    setEditingUser(null)
                    setSelectedUser(null)
                    setFormData({
                      first_name: "",
                      last_name: "",
                      username: "",
                      email: "",
                      phone: "",
                      address: "",
                      preferred_language: "English",
                      status: "active",
                      email_verified: false,
                      sms_verified: false,
                      two_factor_enabled: false,
                      balance: "",
                      currency: "NGN",
                      account_type: "standard",
                    })
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Add User
                </button>

                <button className="w-full sm:w-auto px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-sm">
                  <MoreVertical className="w-4 h-4" />
                  Bulk Actions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          selectedUser={selectedUser}
          showAddForm={showAddForm}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onToggleStatus={toggleUserStatus}
          onSyncServices={handleSyncServices}
          onDelete={handleDelete}
          isLoading={isLoading}
          formatCurrency={formatCurrency}
          activeDropdownUserId={activeDropdownUserId}        
          setActiveDropdownUserId={setActiveDropdownUserId}  
        />

        {/* Stats Summary */}
   
        <UserStats users={users.data || []} formatCurrency={formatCurrency} />

      </div>
    </div>
  )
}

export default ManageUsers
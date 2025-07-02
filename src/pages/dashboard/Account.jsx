"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Shield,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
  Bell,
  Settings,
  Clock,
  Save,
  AlertCircle,
  Info,
} from "lucide-react"

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "pt", label: "Português" },
  { value: "ru", label: "Русский" },
  { value: "zh", label: "中文" },
]

const timezones = [
  { value: "utc+1", label: "(UTC +1:00) Central European Time, West Africa Time" },
  { value: "utc+0", label: "(UTC +0:00) Greenwich Mean Time" },
  { value: "utc-5", label: "(UTC -5:00) Eastern Standard Time" },
  { value: "utc-8", label: "(UTC -8:00) Pacific Standard Time" },
  { value: "utc+3", label: "(UTC +3:00) Moscow Time" },
  { value: "utc+8", label: "(UTC +8:00) China Standard Time" },
  { value: "utc+9", label: "(UTC +9:00) Japan Standard Time" },
]

const Account = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isChangingEmail, setIsChangingEmail] = useState(false)

  const [formData, setFormData] = useState({
    username: "blueswayne133",
    email: "blueswayne133@gmail.com",
    language: "en",
    timezone: "utc+1",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newEmail: "",
  })

  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPromotions: false,
    emailUpdates: true,
    pushOrders: true,
    pushPromotions: false,
    pushUpdates: false,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field, value) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const copyApiKey = async () => {
    const apiKey = "sk_live_51234567890abcdef1234567890abcdef12345678"
    try {
      await navigator.clipboard.writeText(apiKey)
      setApiKeyCopied(true)
      setTimeout(() => setApiKeyCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy API key:", err)
    }
  }

  const handlePasswordChange = async () => {
    setIsChangingPassword(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsChangingPassword(false)
    setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }))
  }

  const handleEmailChange = async () => {
    setIsChangingEmail(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsChangingEmail(false)
    setFormData((prev) => ({ ...prev, email: prev.newEmail, newEmail: "" }))
  }

  const generateNewApiKey = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-1">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("general")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "general"
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-blue-100 hover:text-white hover:bg-blue-500/30"
                }`}
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                General
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === "notifications"
                    ? "bg-white text-blue-700 shadow-md"
                    : "text-blue-100 hover:text-white hover:bg-blue-500/30"
                }`}
              >
                <Bell className="w-4 h-4 mr-2 inline" />
                Notifications
              </button>
            </div>
          </div>
        </div>

        {/* General Tab */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                  <p className="text-gray-600">Update your personal information and account details</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="w-full h-12 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 bg-gray-50 rounded-md"
                      disabled
                    />
                    <p className="text-xs text-gray-500">Username cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-1">
                      Language
                    </label>
                    <div className="flex gap-2">
                      <select
                        id="language"
                        value={formData.language}
                        onChange={(e) => handleInputChange("language", e.target.value)}
                        className="w-full h-12 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      >
                        {languages.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                      <button className="h-12 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center">
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        className="w-full h-12 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 bg-gray-50 rounded-md"
                        disabled
                      />
                      <button
                        onClick={() => setIsChangingEmail(!isChangingEmail)}
                        className="h-12 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center whitespace-nowrap"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Change Email
                      </button>
                    </div>
                  </div>

                  {isChangingEmail && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="space-y-2">
                        <label htmlFor="newEmail" className="block text-sm font-semibold text-gray-700 mb-1">
                          New Email Address
                        </label>
                        <input
                          id="newEmail"
                          type="email"
                          placeholder="Enter new email address"
                          value={formData.newEmail}
                          onChange={(e) => handleInputChange("newEmail", e.target.value)}
                          className="w-full h-12 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleEmailChange}
                          disabled={isChangingEmail}
                          className="h-12 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-70"
                        >
                          {isChangingEmail ? "Updating..." : "Update Email"}
                        </button>
                        <button
                          onClick={() => setIsChangingEmail(false)}
                          className="h-12 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                  <p className="text-gray-600">Update your password to keep your account secure</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      value={formData.currentPassword}
                      onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                      className="w-full h-12 px-4 py-2 pr-10 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-gray-50 rounded-r-md"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        className="w-full h-12 px-4 py-2 pr-10 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-gray-50 rounded-r-md"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="w-full h-12 px-4 py-2 pr-10 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-0 h-12 px-3 hover:bg-gray-50 rounded-r-md"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="w-full h-12 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-70"
                >
                  {isChangingPassword ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Two-Factor Authentication</h2>
                  <p className="text-gray-600">
                    Email-based option to add an extra layer of protection to your account. When signing in you'll need to
                    enter a code that will be sent to your email address.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Two-Factor Authentication is {twoFactorEnabled ? "Enabled" : "Disabled"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {twoFactorEnabled ? "Your account is protected" : "Add extra security to your account"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`h-11 px-4 py-2 rounded-md text-white ${
                    twoFactorEnabled ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {twoFactorEnabled ? "Disable" : "Enable"}
                </button>
              </div>
            </div>

            {/* Timezone Settings */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Timezone Settings</h2>
                  <p className="text-gray-600">Set your preferred timezone for accurate timestamps</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange("timezone", e.target.value)}
                  className="w-full h-12 px-4 py-2 border-2 border-gray-200 focus:border-blue-500 rounded-md"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
                <button className="h-12 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* API Key */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">API Key</h2>
                  <p className="text-gray-600">Use this key to integrate with our API services</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border border-blue-200 bg-blue-50 rounded-md p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-blue-800">
                      <p>
                        Keep your API key secure and never share it publicly. Regenerate it if you suspect it has been
                        compromised.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={generateNewApiKey}
                    className="h-11 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Generate New
                  </button>
                  <button
                    onClick={copyApiKey}
                    className="h-11 px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-50"
                  >
                    {apiKeyCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {apiKeyCopied ? "Copied!" : "Copy Key"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            {/* Email Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Email Notifications</h2>
                  <p className="text-gray-600">Choose what email notifications you'd like to receive</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Order Updates</h4>
                      <p className="text-sm text-gray-600">Get notified about order status changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.emailOrders}
                        onChange={(e) => handleNotificationChange("emailOrders", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Promotional Offers</h4>
                      <p className="text-sm text-gray-600">Receive emails about special offers and discounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.emailPromotions}
                        onChange={(e) => handleNotificationChange("emailPromotions", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Service Updates</h4>
                      <p className="text-sm text-gray-600">Get notified about new services and platform updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.emailUpdates}
                        onChange={(e) => handleNotificationChange("emailUpdates", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Push Notifications</h2>
                  <p className="text-gray-600">Manage your browser push notification preferences</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Order Updates</h4>
                      <p className="text-sm text-gray-600">Real-time notifications for order changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.pushOrders}
                        onChange={(e) => handleNotificationChange("pushOrders", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Promotional Offers</h4>
                      <p className="text-sm text-gray-600">Push notifications for special deals</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.pushPromotions}
                        onChange={(e) => handleNotificationChange("pushPromotions", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Service Updates</h4>
                      <p className="text-sm text-gray-600">Notifications about platform changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notifications.pushUpdates}
                        onChange={(e) => handleNotificationChange("pushUpdates", e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="border border-amber-200 bg-amber-50 rounded-md p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-amber-800">
                      <p>
                        Push notifications require browser permission. Click "Allow" when prompted to enable notifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">Notification Summary</h2>
                <p className="text-gray-600">Overview of your current notification settings</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order Updates</span>
                      <span className={notifications.emailOrders ? "text-green-600" : "text-gray-400"}>
                        {notifications.emailOrders ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Promotions</span>
                      <span className={notifications.emailPromotions ? "text-green-600" : "text-gray-400"}>
                        {notifications.emailPromotions ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Updates</span>
                      <span className={notifications.emailUpdates ? "text-green-600" : "text-gray-400"}>
                        {notifications.emailUpdates ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Push Notifications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order Updates</span>
                      <span className={notifications.pushOrders ? "text-green-600" : "text-gray-400"}>
                        {notifications.pushOrders ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Promotions</span>
                      <span className={notifications.pushPromotions ? "text-green-600" : "text-gray-400"}>
                        {notifications.pushPromotions ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Updates</span>
                      <span className={notifications.pushUpdates ? "text-green-600" : "text-gray-400"}>
                        {notifications.pushUpdates ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Account
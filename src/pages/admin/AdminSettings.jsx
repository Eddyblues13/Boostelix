"use client";

import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Activity,
  Check,
  X,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  getAdminSettings,
  updateAdminProfile,
  updateAdminSecurity,
  getAdminActivityLogs,
} from "../../services/adminService"; 

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // Global states
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingSecurity, setLoadingSecurity] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    type: "",
  });

  // Security state
  const [security, setSecurity] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  // Activity logs
  const [activities, setActivities] = useState([]);

  // Load profile + security info on mount
  useEffect(() => {
    loadProfileSettings();
  }, []);

  // Load profile and basic info
  const loadProfileSettings = async () => {
    try {
      setLoadingProfile(true);
      const data = await getAdminSettings();
      setProfile({
        name: data.profile.name,
        email: data.profile.email,
        type: data.profile.type,
      });
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load settings");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Load activity logs
  const loadActivityLogs = async () => {
    try {
      setLoadingActivity(true);
      const data = await getAdminActivityLogs();
      setActivities(data.activities || []);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load activity logs");
    } finally {
      setLoadingActivity(false);
    }
  };

  // Handle tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);

    if (tab === "activity") {
      loadActivityLogs();
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoadingProfile(true);
      await updateAdminProfile(profile);
      setSuccess("Profile updated successfully.");
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handle security update
  const handleSecurityUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoadingSecurity(true);
      await updateAdminSecurity(security);
      setSuccess("Password updated successfully.");
      setSecurity({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoadingSecurity(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "profile") {
      setProfile((prev) => ({ ...prev, [name]: value }));
    } else {
      setSecurity((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Admin Settings
        </h1>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto p-1.5 hover:bg-red-100 rounded-lg"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="ml-auto p-1.5 hover:bg-green-100 rounded-lg"
              >
                <X className="h-4 w-4 text-green-500" />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => handleTabChange("profile")}
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </button>
          <button
            onClick={() => handleTabChange("security")}
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === "security"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Lock className="w-4 h-4 mr-2" />
            Security
          </button>
          <button
            onClick={() => handleTabChange("activity")}
            className={`py-4 px-6 font-medium text-sm flex items-center ${
              activeTab === "activity"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            Activity Logs
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Profile Information
            </h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Admin Type
                  </label>
                  <input
                    type="text"
                    value={profile.type}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {loadingProfile && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  )}
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Security Settings
            </h2>
            <form onSubmit={handleSecurityUpdate}>
              <div className="space-y-4">
                {/* Current password */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="current_password"
                      value={security.current_password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={security.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={security.password_confirmation}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loadingSecurity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  {loadingSecurity && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  )}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activity Logs Tab */}
        {activeTab === "activity" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Activity Logs
            </h2>
            {loadingActivity ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      IP: {activity.ip_address}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No activity logs found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;

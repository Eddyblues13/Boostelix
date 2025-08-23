"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Loader2, Send, Info } from "lucide-react"
import { createServiceUpdate, ServiceUpdateHistory } from "../../services/adminService"

const AdminUpdates = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    service: "",
    details: "",
    date: "",
    update: "",
    category: "",
  })
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await createServiceUpdate(formData)
      toast.success(res.message || "Service update saved successfully")

      // Reset form
      setFormData({
        service: "",
        details: "",
        date: "",
        update: "",
        category: "",
      })

      // Refresh history after new update
      fetchHistory()

      onCancel?.()
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save update")
    } finally {
      setLoading(false)
    }
  }

  // Fetch history
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true)
      const res = await ServiceUpdateHistory()
      setHistory(res.data || [])
      setHistoryError(null)
    } catch (err) {
      setHistoryError(err?.message || "Failed to fetch history")
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Add Service Update</h1>
          <p className="text-gray-600 text-sm mt-1">
            Fill out the form below to create or update a service update entry.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
              Service
            </label>
            <input
              type="text"
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              placeholder="e.g. Instagram Followers | Slow Speed"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Details */}
          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              id="details"
              name="details"
              rows="3"
              value={formData.details}
              onChange={handleChange}
              placeholder="Describe the service update in detail..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Date & Update */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="update" className="block text-sm font-medium text-gray-700 mb-1">
                Update
              </label>
              <input
                type="text"
                id="update"
                name="update"
                value={formData.update}
                onChange={handleChange}
                placeholder="E.g Rate decreased from NGN 11309.27 to NGN 11299.25"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Save Update
                </>
              )}
            </button>
          </div>
        </form>

        {/* History */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Update History</h2>

          {historyLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : historyError ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-md">{historyError}</div>
          ) : history.length === 0 ? (
            <div className="text-gray-500 p-4 bg-gray-50 rounded-md flex items-center gap-2">
              <Info className="w-5 h-5" /> No service updates found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Service</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{item.service}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.category}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{item.date}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.update}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUpdates

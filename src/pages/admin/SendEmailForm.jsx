"use client"

import { useState } from "react"
import { X, Check, Menu, Link, Code, HelpCircle, ImageIcon } from "lucide-react"
import toast from "react-hot-toast"
import { sendEmailToUser } from "../../services/adminService"

const SendEmailForm = ({ user, onCancel }) => {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await sendEmailToUser(user.id, subject, message)
      toast.success(response.message || "Email sent successfully")
      setSubject("")
      setMessage("")
      onCancel?.()
    } catch (error) {
      if (error.response) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors
          Object.keys(errors).forEach((field) => {
            toast.error(`${field}: ${errors[field].join(', ')}`)
          })
        } else {
          toast.error(error.response.data.message || "Something went wrong.")
        }
      } else {
        toast.error("Network error. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Send Email To {user.username}
          </h2>
          <p className="text-gray-600 mt-1 text-sm">Compose and send an email to the user.</p>
        </div>
        <button
          onClick={onCancel}
          className="self-end sm:self-auto p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Write Subject"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-y text-sm"
            required
          />
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 mt-2 text-xs text-gray-500 flex flex-wrap gap-2 items-center">
            <span className="font-bold">B</span>
            <span className="italic">I</span>
            <span className="underline">U</span>
            <span>Rubik</span>
            <span className="text-purple-600">A</span>
            <span><Check /></span>
            <span><Menu /></span>
            <span><Link /></span>
            <span><ImageIcon /></span>
            <span><Code /></span>
            <span><HelpCircle /></span>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium text-sm disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>
    </div>
  )
}

export default SendEmailForm

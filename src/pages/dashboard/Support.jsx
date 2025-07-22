"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import toast from "react-hot-toast"
import { fetchUserData } from "../../services/userService"
import { CSS_COLORS } from "../../components/constant/colors"

const Support = () => {
  const [user, setUser] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("order")
  const [subject, setSubject] = useState("Order")
  const [request, setRequest] = useState("Refill")
  const [orderIds, setOrderIds] = useState("")
  const [message, setMessage] = useState("")
  const [expandedFaq, setExpandedFaq] = useState("why-choose")

  const categories = [
    { id: "order", label: "Order", icon: "📦" },
    { id: "payment", label: "Payment", icon: "💳" },
    { id: "child-panel", label: "Child Panel", icon: "👶" },
    { id: "api", label: "API", icon: "🔌" },
    { id: "bug", label: "Bug", icon: "⚠️" },
    { id: "request", label: "Request", icon: "🙋" },
    { id: "other", label: "Other", icon: "💬" },
  ]

  const subjectOptions = {
    order: ["Order", "Order Issue", "Order Status", "Order Cancellation"],
    payment: ["Payment", "Payment Issue", "Refund Request", "Payment Method"],
    "child-panel": ["Child Panel", "Panel Access", "Panel Setup", "Panel Issue"],
    api: ["API", "API Access", "API Documentation", "API Error"],
    bug: ["Bug", "Technical Issue", "System Error", "Feature Bug"],
    request: ["Request", "Feature Request", "Service Request", "General Request"],
    other: ["Other", "General Inquiry", "Feedback", "Complaint"],
  }

  const requestOptions = {
    order: ["Refill", "Speed Up", "Cancel", "Status Check"],
    payment: ["Refund", "Payment Proof", "Transaction Issue", "Method Change"],
    "child-panel": ["Access Request", "Setup Help", "Configuration", "Reset"],
    api: ["API Key", "Documentation", "Integration Help", "Error Fix"],
    bug: ["Report Bug", "Fix Request", "System Issue", "Feature Problem"],
    request: ["New Feature", "Service Addition", "Improvement", "Custom Request"],
    other: ["General Help", "Information", "Feedback", "Complaint"],
  }

  const faqItems = [
    {
      id: "why-choose",
      question: "Why choose smexploits.com?",
      answer:
        "Smexploits makes social media growth simple and affordable. We offer a wide range of services, fast delivery, real-time order tracking, and friendly support. Whether you're a beginner or a reseller, we've got what you need to succeed.",
    },
    {
      id: "beginner-friendly",
      question: "Is smexploits.com beginner friendly?",
      answer:
        "Absolutely! Our platform is designed with beginners in mind. We provide easy-to-use interfaces, detailed guides, step-by-step tutorials, and 24/7 support to help you get started with social media marketing.",
    },
    {
      id: "order-processing",
      question: "How fast are orders processed?",
      answer:
        "Most orders start processing within minutes of placement. Delivery times vary by service type, but we pride ourselves on fast and reliable service delivery. You can track your order progress in real-time.",
    },
    {
      id: "reseller-program",
      question: "Can I resell smexploits.com services?",
      answer:
        "Yes! We offer competitive reseller programs with API access, white-label solutions, and bulk pricing. Contact our support team to learn more about becoming a reseller and earning profits.",
    },
    {
      id: "support-types",
      question: "What kind of support does smexploits.com offer?",
      answer:
        "We provide comprehensive support including live chat, ticket system, email support, and detailed documentation. Our team is available 24/7 to help with orders, payments, technical issues, and general inquiries.",
    },
  ]

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetchUserData()
        setUser(response.data)
      } catch (err) {
        toast.error("Failed to fetch user info")
      }
    }
    fetchUser()
  }, [])

  // Update subject and request when category changes
  useEffect(() => {
    const subjects = subjectOptions[selectedCategory] || []
    const requests = requestOptions[selectedCategory] || []
    setSubject(subjects[0] || "")
    setRequest(requests[0] || "")
  }, [selectedCategory])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedCategory || !subject) {
      toast.error("Please fill in all required fields")
      return
    }
    toast.success("Ticket submitted successfully!")
    // Reset form
    setOrderIds("")
    setMessage("")
  }

  return (
    <div className="w-full" style={{ backgroundColor: "transparent" }}>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="w-full p-4 space-y-6">
          {/* Header */}
          <div
            className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
            style={{ backgroundColor: CSS_COLORS.background.card }}
          >
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Ticket Support</h1>
            <p className="text-gray-600 text-sm">
              At Smexploits, we understand what works and what doesn't in digital marketing. Our team is here to help
              with any issue you may have.
            </p>
          </div>

          {/* Create Ticket Button */}
          <button
            className="w-full text-white font-semibold py-4 px-6 rounded-full shadow-lg text-lg"
            style={{ backgroundColor: CSS_COLORS.primary }}
          >
            Create Ticket
          </button>

          {/* Ticket Form */}
          <div
            className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
            style={{ backgroundColor: CSS_COLORS.background.card }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter your details</h2>
            <p className="text-gray-600 text-sm mb-6">Please choose the category that best matches your issue:</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 p-3 rounded-xl border transition-all ${
                      selectedCategory === category.id
                        ? "border-teal-500 text-white shadow-lg"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category.id ? CSS_COLORS.primary : "white",
                    }}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium text-sm">{category.label}</span>
                  </button>
                ))}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Subject</label>
                <div className="relative">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors appearance-none"
                    style={{ backgroundColor: CSS_COLORS.background.muted }}
                  >
                    {(subjectOptions[selectedCategory] || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Order ID (for order category) */}
              {selectedCategory === "order" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Order ID: [For multiple orders, please separate them using comma. (example:
                    10867110,10867210,10867500)]
                  </label>
                  <textarea
                    value={orderIds}
                    onChange={(e) => setOrderIds(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                    style={{ backgroundColor: CSS_COLORS.background.muted }}
                    placeholder="Enter order IDs separated by commas"
                  />
                </div>
              )}

              {/* Request */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Request</label>
                <div className="relative">
                  <select
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors appearance-none"
                    style={{ backgroundColor: CSS_COLORS.background.muted }}
                  >
                    {(requestOptions[selectedCategory] || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Message (optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                  style={{ backgroundColor: CSS_COLORS.background.muted }}
                  placeholder="Provide additional details about your issue..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: CSS_COLORS.primary }}
              >
                Submit Ticket
              </button>
            </form>
          </div>

          {/* Support Info & FAQ */}
          <div
            className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
            style={{ backgroundColor: CSS_COLORS.background.card }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fast Support Response</h3>
            <p className="text-gray-600 text-sm mb-4">
              Need help? Our support team is always ready to assist you as quickly as possible. Whether you have a
              question about your order, payment, or how to use the panel, we're here to make it easy for you.
            </p>

            <div
              className="rounded-xl p-4 text-white mb-6 flex items-center space-x-3"
              style={{ background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})` }}
            >
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Ticket Support</h4>
                <p className="text-sm opacity-90">
                  Can't find what you're looking for? Create a support ticket and get professional help from our team.
                  We're here to resolve any issue you may have in no time.
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-3">
              {faqItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800 text-sm">{item.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                        expandedFaq === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === item.id && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mt-3">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="w-full p-4 xl:p-6 space-y-6">
          {/* Header */}
          <div
            className="rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm"
            style={{ backgroundColor: CSS_COLORS.background.card }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Ticket Support</h1>
            <p className="text-gray-600">
              At Smexploits, we understand what works and what doesn't in digital marketing. Our team is here to help
              with any issue you may have.
            </p>
          </div>

          {/* Create Ticket Button */}
          <button
            className="w-full text-white font-semibold py-5 px-8 rounded-full shadow-lg text-xl hover:opacity-90 transition-opacity"
            style={{ backgroundColor: CSS_COLORS.primary }}
          >
            Create Ticket
          </button>

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Left Column - Ticket Form */}
            <div className="flex-1">
              <div
                className="rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm"
                style={{ backgroundColor: CSS_COLORS.background.card }}
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter your details</h2>
                <p className="text-gray-600 mb-8">Please choose the category that best matches your issue:</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Category Selection */}
                  <div className="grid grid-cols-4 gap-4">
                    {categories.slice(0, 4).map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center space-x-2 p-4 rounded-xl border transition-all ${
                          selectedCategory === category.id
                            ? "border-teal-500 text-white shadow-lg"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category.id ? CSS_COLORS.primary : "white",
                        }}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {categories.slice(4).map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center space-x-2 p-4 rounded-xl border transition-all ${
                          selectedCategory === category.id
                            ? "border-teal-500 text-white shadow-lg"
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category.id ? CSS_COLORS.primary : "white",
                        }}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Subject</label>
                    <div className="relative">
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors appearance-none text-base"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                      >
                        {(subjectOptions[selectedCategory] || []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Order ID (for order category) */}
                  {selectedCategory === "order" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Order ID: [For multiple orders, please separate them using comma. (example:
                        10867110,10867210,10867500)]
                      </label>
                      <textarea
                        value={orderIds}
                        onChange={(e) => setOrderIds(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none text-base"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                        placeholder="Enter order IDs separated by commas"
                      />
                    </div>
                  )}

                  {/* Request */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Request</label>
                    <div className="relative">
                      <select
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors appearance-none text-base"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                      >
                        {(requestOptions[selectedCategory] || []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Message (optional)</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none text-base"
                      style={{ backgroundColor: CSS_COLORS.background.muted }}
                      placeholder="Provide additional details about your issue..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity text-lg"
                    style={{ backgroundColor: CSS_COLORS.primary }}
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Support Info & FAQ */}
            <div className="w-96">
              <div className="space-y-6">
                {/* Support Response Info */}
                <div
                  className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
                  style={{ backgroundColor: CSS_COLORS.background.card }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Fast Support Response</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Need help? Our support team is always ready to assist you as quickly as possible. Whether you have a
                    question about your order, payment, or how to use the panel, we're here to make it easy for you.
                  </p>

                  <div
                    className="rounded-xl p-6 text-white flex items-center space-x-3"
                    style={{ background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})` }}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3">Ticket Support</h4>
                      <p className="text-sm opacity-90 leading-relaxed">
                        Can't find what you're looking for? Create a support ticket and get professional help from our
                        team. We're here to resolve any issue you may have in no time.
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💬</span>
                    </div>
                  </div>
                </div>

                {/* FAQ */}
                <div
                  className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm sticky top-24"
                  style={{ backgroundColor: CSS_COLORS.background.card }}
                >
                  <div className="space-y-3">
                    {faqItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-800 text-sm">{item.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                              expandedFaq === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {expandedFaq === item.id && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="text-center py-6 rounded-2xl text-white"
            style={{ background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})` }}
          >
            © Copyright 2025 All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support

"use client"

import { useState } from "react"
import { Upload, Download, Info, CheckCircle, AlertCircle, Copy, FileText, Trash2 } from "lucide-react"

const formatExamples = [
  "1 | https://instagram.com/example | 1000",
  "2 | https://youtube.com/watch?v=example | 5000",
  "3 | https://tiktok.com/@example | 2500",
]

const validationRules = [
  "Each line must contain exactly 3 parts separated by ' | '",
  "Service ID must be a number",
  "Link must be a valid URL",
  "Quantity must be a positive number",
  "Maximum 100 orders per submission",
]

const MassOrder = () => {
  const [orderText, setOrderText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])
  const [validOrders, setValidOrders] = useState(0)

  const validateOrders = (text) => {
    const lines = text
      .trim()
      .split("\n")
      .filter((line) => line.trim())
    const errors = []
    let validCount = 0

    if (lines.length === 0) {
      setValidationErrors([])
      setValidOrders(0)
      return
    }

    if (lines.length > 100) {
      errors.push("Maximum 100 orders allowed per submission")
    }

    lines.forEach((line, index) => {
      const parts = line.split("|").map((part) => part.trim())

      if (parts.length !== 3) {
        errors.push(`Line ${index + 1}: Must have exactly 3 parts (service_id | link | quantity)`)
        return
      }

      const [serviceId, link, quantity] = parts

      // Validate service ID
      if (!serviceId || isNaN(Number(serviceId))) {
        errors.push(`Line ${index + 1}: Service ID must be a number`)
        return
      }

      // Validate link
      try {
        new URL(link)
      } catch {
        errors.push(`Line ${index + 1}: Invalid URL format`)
        return
      }

      // Validate quantity
      if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
        errors.push(`Line ${index + 1}: Quantity must be a positive number`)
        return
      }

      validCount++
    })

    setValidationErrors(errors)
    setValidOrders(validCount)
  }

  const handleTextChange = (value) => {
    setOrderText(value)
    validateOrders(value)
  }

  const handleSubmit = async () => {
    if (validationErrors.length > 0 || validOrders === 0) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)

    // Reset form on success
    setOrderText("")
    setValidOrders(0)
    setValidationErrors([])
  }

  const loadExample = () => {
    const exampleText = formatExamples.join("\n")
    setOrderText(exampleText)
    validateOrders(exampleText)
  }

  const clearAll = () => {
    setOrderText("")
    setValidationErrors([])
    setValidOrders(0)
  }

  const copyFormat = () => {
    navigator.clipboard.writeText("service_id | link | quantity")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Mass Order</h1>
          <p className="text-gray-600">Submit multiple orders at once using our bulk format</p>
        </div>

        {/* Format Information */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              <h2 className="text-xl font-bold">Order Format Instructions</h2>
            </div>
            <p className="text-blue-100 mt-1">Follow this exact format for each order line</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <code className="text-lg font-mono font-semibold text-blue-700">service_id | link | quantity</code>
                <button
                  onClick={copyFormat}
                  className="px-3 py-1.5 border border-blue-200 rounded-md text-blue-600 hover:bg-blue-50 flex items-center"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-600">One order per line, separated by pipe symbols (|)</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Example Orders:</h4>
                <div className="space-y-2">
                  {formatExamples.map((example, index) => (
                    <div key={index} className="bg-white p-3 rounded border font-mono text-sm">
                      {example}
                    </div>
                  ))}
                </div>
                <button
                  onClick={loadExample}
                  className="mt-3 px-3 py-1.5 border border-blue-200 rounded-md text-blue-600 hover:bg-blue-50 flex items-center"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Load Example
                </button>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Validation Rules:</h4>
                <ul className="space-y-2">
                  {validationRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Order Input Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Enter Your Orders</h2>
                <p className="text-gray-600">Paste or type your orders below, one per line</p>
              </div>
              <div className="flex items-center gap-2">
                {validOrders > 0 && (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
                    {validOrders} valid order{validOrders !== 1 ? "s" : ""}
                  </span>
                )}
                {validationErrors.length > 0 && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">
                    {validationErrors.length} error{validationErrors.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  placeholder="service_id | link | quantity&#10;1 | https://instagram.com/example | 1000&#10;2 | https://youtube.com/watch?v=example | 5000"
                  value={orderText}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="w-full min-h-[300px] p-4 font-mono text-sm border-2 border-gray-200 focus:border-blue-500 rounded-md resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {orderText.split("\n").filter((line) => line.trim()).length} / 100 lines
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="border border-red-200 bg-red-50 rounded-md p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div className="text-red-800">
                      <div className="font-semibold mb-2">Please fix the following errors:</div>
                      <ul className="space-y-1 text-sm">
                        {validationErrors.slice(0, 5).map((error, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-red-600">•</span>
                            {error}
                          </li>
                        ))}
                        {validationErrors.length > 5 && (
                          <li className="text-red-600 font-medium">... and {validationErrors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <hr className="border-t border-gray-200" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={validationErrors.length > 0 || validOrders === 0 || isSubmitting}
                  className="flex-1 h-12 px-4 py-2 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-md shadow-lg disabled:opacity-70 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing Orders...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Submit {validOrders > 0 ? `${validOrders} Order${validOrders !== 1 ? "s" : ""}` : "Orders"}
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={clearAll} 
                    disabled={!orderText}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Bulk Processing</h3>
              <p className="text-sm text-gray-600">Submit up to 100 orders at once for efficient processing</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Real-time Validation</h3>
              <p className="text-sm text-gray-600">Instant feedback on format errors before submission</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Order Tracking</h3>
              <p className="text-sm text-gray-600">All orders are tracked individually in your order history</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MassOrder
"use client"

import { useState, useEffect } from "react"
import { CreditCard, Bitcoin, ChevronDown, Plus, History, Clock, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { fetchUserData, initiatePayment, paymentHistory } from "../../services/userService"
import { CSS_COLORS } from "../../components/constant/colors"

const AddFunds = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState({ symbol: "₦", code: "NGN" })
  const [selectedMethod, setSelectedMethod] = useState("flutterwave")
  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("add-funds")
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [transactionHistory, setTransactionHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(true)

  const paymentMethods = [
    {
      id: "flutterwave",
      name: "Flutterwave",
      description: "Secure payments via cards, bank transfers, and mobile money. Minimum 100 NGN.",
      icon: <CreditCard className="w-5 h-5" style={{ color: CSS_COLORS.primary }} />,
      minAmount: 100,
      supportedCurrencies: ["NGN", "USD", "GHS", "KES"],
    },
    {
      id: "paystack",
      name: "Paystack",
      bonus: "Instant Deposits",
      description: "Deposit using Card, Bank Transfer. Minimum 100 NGN.",
      icon: <CreditCard className="w-5 h-5" style={{ color: CSS_COLORS.primary }} />,
      minAmount: 100,
      supportedCurrencies: ["NGN", "USD", "GHS"],
    },
    {
      id: "coinbase",
      name: "Coinbase Commerce",
      description: "Deposit with crypto worldwide. Supports BTC, ETH, LTC. Minimum 500 NGN.",
      icon: <Bitcoin className="w-5 h-5 text-orange-500" />,
      minAmount: 500,
      supportedCurrencies: ["NGN", "USD"],
    },
  ]

  const currencies = [
    { code: "NGN", symbol: "₦", name: "Naira" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "GHS", symbol: "₵", name: "Ghana Cedi" },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  ]

  const currentMethod = paymentMethods.find((method) => method.id === selectedMethod)
  const supportedCurrencies = currencies.filter(currency => 
    currentMethod?.supportedCurrencies?.includes(currency.code)
  )

  const faqItems = [
    {
      id: "payment-methods",
      title: "What payment methods are available?",
      content: "We support various payment methods including Flutterwave (cards, bank transfers), Paystackkk, and cryptocurrency options through Coinbase Commerce.",
    },
    {
      id: "deposit-time",
      title: "How long do deposits take?",
      content: "Card payments are instant. Bank transfers may take a few minutes. Cryptocurrency deposits require network confirmations and typically take 5-30 minutes.",
    },
    {
      id: "failed-payments",
      title: "What if my payment fails?",
      content: "Check your payment details and try again. If issues persist, contact support with your transaction reference. Funds from failed transactions are typically refunded within 24 hours.",
    },
  ]

  // Fetch user data and transaction history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetchingData(true)
        const [userResponse, historyResponse] = await Promise.all([
          fetchUserData(), 
          paymentHistory(),
        ])
        
        setUser(userResponse.data)
        setTransactionHistory(historyResponse.data || [])
        
        // Set user's currency if available
        if (userResponse.data?.currency) {
          const userCurrency = currencies.find(c => c.code === userResponse.data.currency)
          if (userCurrency) {
            setSelectedCurrency(userCurrency)
          }
        }
      } catch (err) {
        toast.error("Failed to fetch data. Please refresh the page.")
      } finally {
        setIsFetchingData(false)
      }
    }
    fetchData()
  }, [])

  const handlePayment = async () => {
    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid amount")
      return
    }

    const numericAmount = Number(amount)
    if (numericAmount < currentMethod?.minAmount) {
      toast.error(`Minimum amount is ${currentMethod?.minAmount} ${selectedCurrency.code}`)
      return
    }

    setIsLoading(true)

    try {
      const paymentData = {
        amount: numericAmount,
        currency: selectedCurrency.code,
        payment_method: selectedMethod,
      }

      const response = await initiatePayment(paymentData)
      
      if (response.payment_url) {
        localStorage.setItem('pendingTransaction', JSON.stringify({
          transactionRef: response.transaction_id,
          amount: numericAmount,
          currency: selectedCurrency.code,
          method: selectedMethod
        }))
        
        window.location.href = response.payment_url
      } else {
        throw new Error(response.message || 'Payment gateway error')
      }
    } catch (error) {
      console.error('Payment error:', {
        error: error,
        response: error.response,
        message: error.message
      })
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Payment initiation failed. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: "transparent" }}>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="w-full p-4 space-y-6">
          {/* Tab Navigation */}
          <div className="flex rounded-full p-1" style={{ backgroundColor: CSS_COLORS.background.muted }}>
            <button
              onClick={() => setActiveTab("add-funds")}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-full font-medium transition-all ${
                activeTab === "add-funds" ? "text-white shadow-lg" : "text-gray-600"
              }`}
              style={{
                backgroundColor: activeTab === "add-funds" ? CSS_COLORS.primary : "transparent",
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Funds</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-full font-medium transition-all ${
                activeTab === "history" ? "text-white shadow-lg" : "text-gray-600"
              }`}
              style={{
                backgroundColor: activeTab === "history" ? CSS_COLORS.primary : "transparent",
              }}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>
          </div>

          {activeTab === "add-funds" ? (
            <>
              {/* Deposit Form */}
              <div
                className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
                style={{ backgroundColor: CSS_COLORS.background.card }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Deposit Funds</h2>

                <div className="space-y-4">
                  {/* Currency Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Currency</label>
                    <div className="relative">
                      <select
                        value={selectedCurrency.code}
                        onChange={(e) => {
                          const currency = currencies.find(c => c.code === e.target.value)
                          setSelectedCurrency(currency || selectedCurrency)
                        }}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                        disabled={isLoading}
                      >
                        {supportedCurrencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.name} ({currency.symbol})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                    <div className="relative">
                      <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                        disabled={isLoading}
                      >
                        {paymentMethods.map((method) => (
                          <option 
                            key={method.id} 
                            value={method.id}
                            disabled={!method.supportedCurrencies.includes(selectedCurrency.code)}
                          >
                            {method.name} {method.bonus ? `(${method.bonus})` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{currentMethod?.description}</p>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Enter amount (min ${currentMethod?.minAmount} ${selectedCurrency.code})`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                        disabled={isLoading}
                        min={currentMethod?.minAmount}
                        step="any"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {selectedCurrency.symbol}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Minimum: {formatCurrency(currentMethod?.minAmount, selectedCurrency.code)}
                    </p>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={!amount || Number(amount) < currentMethod?.minAmount || isLoading}
                    className="w-full flex items-center justify-center text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: CSS_COLORS.primary }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${amount ? formatCurrency(amount, selectedCurrency.code) : ''}`
                    )}
                  </button>
                </div>
              </div>

              {/* FAQ Section */}
              <div
                className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
                style={{ backgroundColor: CSS_COLORS.background.card }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Deposit Help</h3>

                <div className="space-y-3">
                  {faqItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{item.title}</span>
                        <Plus
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedFaq === item.id ? "rotate-45" : ""
                          }`}
                        />
                      </button>
                      {expandedFaq === item.id && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-gray-600">{item.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Transaction History */
            <div
              className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
              style={{ backgroundColor: CSS_COLORS.background.card }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>

              <div className="space-y-3">
                {isFetchingData ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : transactionHistory.length > 0 ? (
                  transactionHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-800 capitalize">
                          {tx.transaction_id}
                        </p>
                        <p className="font-medium text-gray-800 capitalize">
                          {tx.transaction_type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(tx.created_at)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {tx.description || 'No description'}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold" style={{ color: CSS_COLORS.primary }}>
                          {formatCurrency(tx.amount, tx.currency || 'NGN')}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tx.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Fee: {formatCurrency(tx.charge)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="w-full p-4 xl:p-6">
          <div className="flex gap-6">
            {/* Left Column - Deposit Form */}
            <div className="flex-1 max-w-2xl">
              {/* Tab Navigation */}
              <div className="flex rounded-full p-1 mb-6" style={{ backgroundColor: CSS_COLORS.background.muted }}>
                <button
                  onClick={() => setActiveTab("add-funds")}
                  className={`flex items-center space-x-2 py-3 px-6 rounded-full font-medium transition-all ${
                    activeTab === "add-funds" ? "text-white shadow-lg" : "text-gray-600"
                  }`}
                  style={{
                    backgroundColor: activeTab === "add-funds" ? CSS_COLORS.primary : "transparent",
                  }}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Funds</span>
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center space-x-2 py-3 px-6 rounded-full font-medium transition-all ${
                    activeTab === "history" ? "text-white shadow-lg" : "text-gray-600"
                  }`}
                  style={{
                    backgroundColor: activeTab === "history" ? CSS_COLORS.primary : "transparent",
                  }}
                >
                  <History className="w-4 h-4" />
                  <span>History</span>
                </button>
              </div>

              {activeTab === "add-funds" ? (
                /* Deposit Form */
                <div
                  className="rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm"
                  style={{ backgroundColor: CSS_COLORS.background.card }}
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-8">Deposit Funds</h2>

                  <div className="space-y-6">
                    {/* Currency Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Currency</label>
                      <div className="relative">
                        <select
                          value={selectedCurrency.code}
                          onChange={(e) => {
                            const currency = currencies.find(c => c.code === e.target.value)
                            setSelectedCurrency(currency || selectedCurrency)
                          }}
                          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none text-base"
                          style={{ backgroundColor: CSS_COLORS.background.muted }}
                          disabled={isLoading}
                        >
                          {supportedCurrencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.name} ({currency.symbol})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
                      <div className="relative">
                        <select
                          value={selectedMethod}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none text-base"
                          style={{ backgroundColor: CSS_COLORS.background.muted }}
                          disabled={isLoading}
                        >
                          {paymentMethods.map((method) => (
                            <option 
                              key={method.id} 
                              value={method.id}
                              disabled={!method.supportedCurrencies.includes(selectedCurrency.code)}
                            >
                              {method.name} {method.bonus ? `(${method.bonus})` : ""}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{currentMethod?.description}</p>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder={`Enter amount (min ${currentMethod?.minAmount} ${selectedCurrency.code})`}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                          style={{ backgroundColor: CSS_COLORS.background.muted }}
                          disabled={isLoading}
                          min={currentMethod?.minAmount}
                          step="any"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {selectedCurrency.symbol}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Minimum: {formatCurrency(currentMethod?.minAmount, selectedCurrency.code)}
                      </p>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePayment}
                      disabled={!amount || Number(amount) < currentMethod?.minAmount || isLoading}
                      className="w-full flex items-center justify-center text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      style={{ backgroundColor: CSS_COLORS.primary }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ${amount ? formatCurrency(amount, selectedCurrency.code) : ''}`
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Transaction History */
                <div
                  className="rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm"
                  style={{ backgroundColor: CSS_COLORS.background.card }}
                >
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">Transaction History</h3>

                  <div className="overflow-hidden border border-gray-200 rounded-xl">
                    <table className="w-full">
                      <thead style={{ backgroundColor: CSS_COLORS.background.muted }}>
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Transaction ID</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Type</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                          <th className="text-right py-4 px-6 font-semibold text-gray-700">Amount</th>
                          <th className="text-right py-4 px-6 font-semibold text-gray-700">Charge</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isFetchingData ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            </td>
                          </tr>
                        ) : transactionHistory.length > 0 ? (
                          transactionHistory.map((tx) => (
                            <tr
                              key={tx.id}
                              className="border-t border-gray-200 hover:bg-gray-50"
                            >
                              <td className="py-4 px-6 font-medium text-gray-800 capitalize">
                                {tx.transaction_id}
                              </td>
                              <td className="py-4 px-6 font-medium text-gray-800 capitalize">
                                {tx.transaction_type}
                              </td>
                              <td className="py-4 px-6 text-gray-600">
                                {formatDate(tx.created_at)}
                              </td>
                              <td className="py-4 px-6 text-right font-semibold" style={{ color: CSS_COLORS.primary }}>
                                {formatCurrency(tx.amount, tx.currency || 'USD')}
                              </td>
                              <td className="py-4 px-6 text-right text-gray-600">
                                {formatCurrency(tx.charge)}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-12">
                              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500">No transactions found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - FAQ */}
            <div className="w-96">
              <div
                className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm sticky top-24"
                style={{ backgroundColor: CSS_COLORS.background.card }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Deposit Information</h3>

                <div className="space-y-3">
                  {faqItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === item.id ? null : item.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800 text-sm">{item.title}</span>
                        <Plus
                          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                            expandedFaq === item.id ? "rotate-45" : ""
                          }`}
                        />
                      </button>
                      {expandedFaq === item.id && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mt-3">{item.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFunds
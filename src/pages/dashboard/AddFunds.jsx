"use client"

import { useState, useEffect } from "react"
import { CreditCard, Bitcoin, ChevronDown, Plus, History, Clock } from "lucide-react"
import toast from "react-hot-toast"
import { fetchUserData } from "../../services/userService"
import { CSS_COLORS } from "../../components/constant/colors"

const AddFunds = () => {
  const [user, setUser] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState({ symbol: "₦", code: "NGN" })
  const [selectedMethod, setSelectedMethod] = useState("korapay")
  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("add-funds")
  const [expandedFaq, setExpandedFaq] = useState("payment-methods")
  const [transactionHistory, setTransactionHistory] = useState([])

  const paymentMethods = [
    {
      id: "korapay",
      name: "Korapay",
      bonus: "5% Bonus On Every Deposit",
      description: "Korapay allows Nigerian users to deposit using Card, Bank and Transfer. Minimum 100 NGN, max ∞.",
      icon: <CreditCard className="w-5 h-5" style={{ color: CSS_COLORS.primary }} />,
      minAmount: 100,
      currency: "NGN",
    },
    {
      id: "transactpay",
      name: "TransactPay",
      description: "Fast and secure payment processing. Minimum 200 NGN, max ∞.",
      icon: <CreditCard className="w-5 h-5" style={{ color: CSS_COLORS.primary }} />,
      minAmount: 200,
      currency: "NGN",
    },
    {
      id: "heleket",
      name: "Heleket",
      description: "Multiple payment options available. Minimum 150 NGN, max ∞.",
      icon: <CreditCard className="w-5 h-5" style={{ color: CSS_COLORS.primary }} />,
      minAmount: 150,
      currency: "NGN",
    },
    {
      id: "coinbase",
      name: "Coinbase Commerce",
      description: "Deposit with crypto worldwide. Supports BTC, ETH, LTC, etc. Minimum 500 NGN, max ∞.",
      icon: <Bitcoin className="w-5 h-5 text-orange-500" />,
      minAmount: 500,
      currency: "NGN",
    },
  ]

  const currentMethod = paymentMethods.find((method) => method.id === selectedMethod)

  const faqItems = [
    {
      id: "payment-methods",
      title: "What Are Payment Methods ?",
      content:
        "We support various payment methods to make funding easy and convenient. These include bank transfers, card payments, and cryptocurrency, depending on the payment provider you choose.",
    },
    {
      id: "korapay-deposit",
      title: "How To Deposit With Korapay",
      content:
        "Select Korapay as your payment method, enter the amount you want to deposit, and click Pay. You will be redirected to Korapay's secure payment page where you can complete your transaction using your preferred method.",
    },
    {
      id: "transactpay-deposit",
      title: "How To Deposit With TransactPay",
      content:
        "Choose TransactPay from the payment methods, specify your deposit amount, and proceed to payment. TransactPay offers multiple secure payment options for your convenience.",
    },
    {
      id: "heleket-deposit",
      title: "How To Deposit With Heleket",
      content:
        "Select Heleket as your payment provider, enter the desired amount, and complete the payment process through their secure platform.",
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

  // Mock transaction history
  useEffect(() => {
    // Simulate API call
    const mockTransactions = [
      { id: "TXN001", date: "2025-01-20", method: "Korapay", amount: "₦5,000", status: "Completed" },
      { id: "TXN002", date: "2025-01-18", method: "TransactPay", amount: "₦2,500", status: "Completed" },
      { id: "TXN003", date: "2025-01-15", method: "Heleket", amount: "₦1,000", status: "Pending" },
    ]
    setTransactionHistory(mockTransactions)
  }, [])

  const handlePayment = () => {
    if (!amount || Number(amount) < currentMethod?.minAmount) {
      toast.error(`Minimum amount is ${currentMethod?.minAmount} ${currentMethod?.currency}`)
      return
    }
    toast.success("Redirecting to payment gateway...")
  }

  return (
    <div className="w-full" style={{ backgroundColor: "transparent" }}>
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
                  {/* Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Method</label>
                    <div className="relative">
                      <select
                        value={selectedMethod}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                      >
                        {paymentMethods.map((method) => (
                          <option key={method.id} value={method.id}>
                            {method.name} {method.bonus ? `(${method.bonus})` : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder={`Minimum ${currentMethod?.minAmount}`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        style={{ backgroundColor: CSS_COLORS.background.muted }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Minimum: {currentMethod?.minAmount} {currentMethod?.currency}
                    </p>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={!amount || Number(amount) < currentMethod?.minAmount}
                    className="w-full text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: CSS_COLORS.primary }}
                  >
                    Pay
                  </button>
                </div>
              </div>

              {/* FAQ Section */}
              <div
                className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
                style={{ backgroundColor: CSS_COLORS.background.card }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How to deposit funds</h3>

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
                {transactionHistory.length > 0 ? (
                  transactionHistory.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{tx.id}</p>
                        <p className="text-sm text-gray-500">
                          {tx.date} • {tx.method}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: CSS_COLORS.primary }}>
                          {tx.amount}
                        </p>
                        <p className="text-sm text-gray-500">{tx.status}</p>
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
                    {/* Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Method</label>
                      <div className="relative">
                        <select
                          value={selectedMethod}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white text-base"
                          style={{ backgroundColor: CSS_COLORS.background.muted }}
                        >
                          {paymentMethods.map((method) => (
                            <option key={method.id} value={method.id}>
                              {method.name} {method.bonus ? `(${method.bonus})` : ""}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Amount</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder={`Minimum ${currentMethod?.minAmount}`}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base"
                          style={{ backgroundColor: CSS_COLORS.background.muted }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Minimum: {currentMethod?.minAmount} {currentMethod?.currency}
                      </p>
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePayment}
                      disabled={!amount || Number(amount) < currentMethod?.minAmount}
                      className="w-full text-white font-semibold py-4 px-6 rounded-full shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                      style={{ backgroundColor: CSS_COLORS.primary }}
                    >
                      Pay
                    </button>
                  </div>
                </div>
              ) : (
                /* Transaction History */
                <div
                  className="rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm"
                  style={{ backgroundColor: CSS_COLORS.background.card }}
                >
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recent Transactions</h3>

                  <div className="overflow-hidden border border-gray-200 rounded-xl">
                    <table className="w-full">
                      <thead style={{ backgroundColor: CSS_COLORS.background.muted }}>
                        <tr>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-4 px-6 font-semibold text-gray-700">Method</th>
                          <th className="text-right py-4 px-6 font-semibold text-gray-700">Amount</th>
                          <th className="text-center py-4 px-6 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionHistory.length > 0 ? (
                          transactionHistory.map((tx, index) => (
                            <tr
                              key={tx.id}
                              className={`border-t border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                            >
                              <td className="py-4 px-6 font-medium text-gray-800">{tx.id}</td>
                              <td className="py-4 px-6 text-gray-600">{tx.date}</td>
                              <td className="py-4 px-6 text-gray-600">{tx.method}</td>
                              <td className="py-4 px-6 text-right font-semibold" style={{ color: CSS_COLORS.primary }}>
                                {tx.amount}
                              </td>
                              <td className="py-4 px-6 text-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    tx.status === "Completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-12">
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
                <h3 className="text-lg font-semibold text-gray-800 mb-6">How to deposit funds</h3>

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

"use client"

import { useState } from "react"
import {
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Share2,
  Download,
  RefreshCw,
} from "lucide-react"

const affiliateStats = {
  visits: 0,
  registrations: 0,
  referrals: 0,
  conversionRate: 0.0,
  totalEarnings: 0.0,
  availableEarnings: 0.0,
}

const payoutHistory = [
  // Empty for now - would be populated with actual data
]

const socialPlatforms = [
  { name: "Facebook", icon: "📘", color: "bg-blue-600" },
  { name: "Twitter", icon: "🐦", color: "bg-sky-500" },
  { name: "Instagram", icon: "📷", color: "bg-pink-500" },
  { name: "WhatsApp", icon: "💬", color: "bg-green-500" },
  { name: "Telegram", icon: "✈️", color: "bg-blue-500" },
]

const Affiliate = () => {
  const [copiedLink, setCopiedLink] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  const referralLink = "https://smexploits.com/ref/75rfr"
  const commissionRate = 4
  const minimumPayout = 2000.0

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const shareToSocial = (platform) => {
    const message = `Join SmExploits and get amazing social media services! Use my referral link: ${referralLink}`
    const encodedMessage = encodeURIComponent(message)

    const urls = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      Twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      WhatsApp: `https://wa.me/?text=${encodedMessage}`,
      Telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodedMessage}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Program</h1>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow">
            <p className="text-lg leading-relaxed">
              <span className="font-semibold">
                Tell People About SmExploits And Earn By Simply Sharing Your Unique Affiliate Link.
              </span>
              <br />
              You Will Get A <span className="font-bold text-yellow-300">{commissionRate}% LIFETIME</span> Commission On
              Every Deposit Made By People That Sign Up With Your Link.
              <br />
              <span className="font-semibold">Happy Earning 🙌🤍</span>
            </p>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Referral Link Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <ExternalLink className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-700">Referral Link</h2>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded border">
                <code className="text-sm text-blue-600 break-all">{referralLink}</code>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyReferralLink}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
                >
                  {copiedLink ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedLink ? "Copied!" : "Copy Link"}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Commission Rate Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-700">Commission Rate</h2>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{commissionRate}%</div>
              <p className="text-sm text-gray-600">Lifetime commission on all deposits</p>
              <div className="mt-3 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${commissionRate * 10}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Minimum Payout Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-700">Minimum Payout</h2>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">₦{minimumPayout.toLocaleString()}</div>
              <p className="text-sm text-gray-600">Minimum amount for withdrawal</p>
              <div className="mt-3">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  Auto payout available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Share Your Link</h2>
              <p className="text-gray-600">Share your referral link on social media platforms</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.name}
                onClick={() => shareToSocial(platform.name)}
                className="h-16 flex flex-col items-center justify-center gap-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <span className="text-2xl">{platform.icon}</span>
                <span className="text-xs font-medium">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-gray-800">Performance Statistics</h2>
              <p className="text-gray-600">Track your affiliate performance and earnings</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium flex items-center hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{affiliateStats.visits}</div>
              <div className="text-sm text-gray-600">Visits</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{affiliateStats.registrations}</div>
              <div className="text-sm text-gray-600">Registrations</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{affiliateStats.referrals}</div>
              <div className="text-sm text-gray-600">Referrals</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{affiliateStats.conversionRate.toFixed(2)}%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>

            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">₦{affiliateStats.totalEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Earnings</div>
            </div>

            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">₦{affiliateStats.availableEarnings.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Available Earnings</div>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-gray-800">Payout History</h2>
                <p className="text-gray-600">Track your withdrawal history and status</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium flex items-center hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
                  disabled={affiliateStats.availableEarnings < minimumPayout}
                >
                  Request Payout
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-3 px-4 font-semibold text-gray-700">Payout Date</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Payout Amount</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Payout Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory.length > 0 ? (
                    payoutHistory.map((payout, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{payout.date}</td>
                        <td className="py-3 px-4 font-semibold text-green-600">{payout.amount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              payout.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {payout.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{payout.transactionId}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="text-gray-500">
                            <p className="font-medium">No payouts yet</p>
                            <p className="text-sm">Start referring users to earn commissions</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tips and Guidelines */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Affiliate Tips</h2>
            <p className="text-gray-600">Maximize your earnings with these proven strategies</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Best Practices:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Share your link on social media platforms regularly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Create engaging content about social media growth
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Target users interested in social media marketing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  Be transparent about using referral links
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Commission Structure:</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Commission Rate</span>
                  <span className="font-bold text-blue-600">{commissionRate}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="text-sm font-medium">Minimum Payout</span>
                  <span className="font-bold text-green-600">₦{minimumPayout.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="text-sm font-medium">Payment Schedule</span>
                  <span className="font-bold text-purple-600">Weekly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Affiliate
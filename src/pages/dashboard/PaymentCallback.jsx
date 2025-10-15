"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { verifyPayment } from "../../services/userService"
import { CSS_COLORS } from "../../components/constant/colors"

const PaymentCallback = () => {
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying your payment...')
  const searchParams = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        const transactionId = searchParams.get('transaction_id')
        const txRef = searchParams.get('tx_ref')
        const statusParam = searchParams.get('status')

        if (!transactionId && !txRef) {
          throw new Error('No transaction reference found')
        }

        // Use either transaction_id or tx_ref
        const reference = transactionId || txRef

        const response = await verifyPayment({
          transaction_id: reference,
          status: statusParam
        })

        if (response.success) {
          setStatus('success')
          setMessage('Payment completed successfully!')
          
          // Clear pending transaction from localStorage
          localStorage.removeItem('pendingTransaction')
          
          // Redirect to add funds page after delay
          setTimeout(() => {
            navigate('/add-funds')
          }, 3000)
        } else {
          throw new Error(response.message || 'Payment verification failed')
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('error')
        setMessage(error.response?.data?.message || error.message || 'Payment verification failed')
      }
    }

    verifyTransaction()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md rounded-2xl p-8 shadow-lg border border-white/50 backdrop-blur-sm text-center"
        style={{ backgroundColor: CSS_COLORS.background.card }}
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4" style={{ color: CSS_COLORS.primary }} />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Processing Payment</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting you back to wallet...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/add-funds')}
              className="w-full py-3 px-4 rounded-full text-white font-semibold"
              style={{ backgroundColor: CSS_COLORS.primary }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentCallback
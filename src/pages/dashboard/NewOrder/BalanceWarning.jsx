"use client"
import React from "react"
import { AlertCircle } from "lucide-react"

const BalanceWarning = ({ selectedService, quantity, totalCost, convertedBalance, formattedTotalCost, formattedBalance, formatCurrency, selectedCurrency }) => {
  if (!selectedService || !quantity || totalCost <= convertedBalance) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 mb-4 sm:mb-5">
      <div className="flex items-start sm:items-center">
        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="min-w-0 flex-1">
          <p className="text-red-700 font-medium text-sm sm:text-base">Insufficient Balance</p>
          <p className="text-red-600 text-xs sm:text-sm mt-1.5 break-words">
            Order cost: {formattedTotalCost} | Your balance: {formattedBalance}
          </p>
          <p className="text-red-600 text-xs sm:text-sm mt-1 break-words">
            You need {formatCurrency(totalCost - convertedBalance, selectedCurrency)} more to place this order.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BalanceWarning

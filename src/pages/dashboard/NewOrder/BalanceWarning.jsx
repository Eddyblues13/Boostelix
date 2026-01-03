"use client"
import React from "react"
import { AlertCircle } from "lucide-react"

const BalanceWarning = ({ selectedService, quantity, totalCost, convertedBalance, formattedTotalCost, formattedBalance, formatCurrency, selectedCurrency }) => {
  if (!selectedService || !quantity || totalCost <= convertedBalance) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
      <div className="flex items-start sm:items-center">
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="min-w-0 flex-1">
          <p className="text-red-700 font-medium text-xs sm:text-sm">Insufficient Balance</p>
          <p className="text-red-600 text-[10px] sm:text-xs mt-1 break-words">
            Order cost: {formattedTotalCost} | Your balance: {formattedBalance}
          </p>
          <p className="text-red-600 text-[10px] sm:text-xs break-words">
            You need {formatCurrency(totalCost - convertedBalance, selectedCurrency)} more to place this order.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BalanceWarning

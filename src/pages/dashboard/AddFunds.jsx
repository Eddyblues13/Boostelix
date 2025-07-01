import React, { useState, useEffect } from 'react';
import { CreditCard, Bitcoin, DollarSign, Play, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AddFunds = () => {
  const [selectedMethod, setSelectedMethod] = useState('korapay');
  const [amount, setAmount] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState([]);

  const paymentMethods = [
    {
      id: 'korapay',
      name: 'Korapay',
      bonus: '5% Bonus On Every Deposit',
      description: 'Korapay allows Nigerian users to deposit using Card, Bank and Transfer. Minimum 100 NGN, max ∞.',
      icon: <CreditCard className="w-6 h-6 text-blue-600" />,
      minAmount: 100,
      currency: 'NGN',
    },
    {
      id: 'coinbase',
      name: 'Coinbase Commerce',
      description: 'Deposit with crypto worldwide. Supports BTC, ETH, LTC, etc. Minimum 500 NGN, max ∞.',
      icon: <Bitcoin className="w-6 h-6 text-orange-500" />,
      minAmount: 500,
      currency: 'NGN',
    }
  ];

  const currentMethod = paymentMethods.find(method => method.id === selectedMethod);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactionHistory(response.data);
      } catch (err) {
        toast.error('Failed to fetch transactions');
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {showNotification && (
        <div className="bg-blue-600 text-white p-4 rounded-md flex justify-between items-start">
          <p className="text-sm">
            <strong>IF YOUR PAYMENT DOESN'T REFLECT AUTOMATICALLY</strong>, PLEASE FORWARD THE CONFIRMATION RECEIPT (FROM KORAPAY OR FLUTTERWAVE) <span className="line-through text-red-200">NOT YOUR BANK DEBIT RECEIPT</span> TO <strong>SUPPORT@SMEXPLOITS.COM</strong>.
          </p>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-4 underline text-blue-200 text-sm font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 shadow space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Add Funds</h2>

        <div>
          <label className="block mb-2 font-medium">Payment Method</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3"
          >
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>{method.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Amount ({currentMethod?.currency})</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="number"
              placeholder={`Minimum ${currentMethod?.minAmount}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Minimum: {currentMethod?.minAmount} {currentMethod?.currency}
          </p>
        </div>

        <button
          disabled={!amount || Number(amount) < currentMethod?.minAmount}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Pay Now
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-bold mb-4">How to Fund Your Account</h3>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center">
              <Play className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-bold mb-2">Recent Transactions</h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 font-semibold">ID</th>
              <th className="py-2 px-3 font-semibold">Date</th>
              <th className="py-2 px-3 font-semibold">Method</th>
              <th className="py-2 px-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactionHistory.length > 0 ? (
              transactionHistory.map(tx => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{tx.id}</td>
                  <td className="py-2 px-3">{tx.date}</td>
                  <td className="py-2 px-3">{tx.method}</td>
                  <td className="py-2 px-3 text-right text-green-600 font-semibold">{tx.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          <Info className="w-6 h-6" />
          <h4 className="text-lg font-bold">Important Notice</h4>
        </div>
        <p className="text-sm">For manual confirmation, contact support if your deposit doesn't reflect in time.</p>
      </div>
    </div>
  );
};

export default AddFunds;

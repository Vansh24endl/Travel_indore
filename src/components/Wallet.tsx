import { ArrowLeft, Wallet as WalletIcon, CreditCard, DollarSign, Plus, TrendingUp, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface WalletProps {
  onNavigate: (tab: 'home' | 'route' | 'destinations' | 'wallet') => void;
}

export function Wallet({ onNavigate }: WalletProps) {
  const [balance] = useState(2450);
  
  const paymentMethods = [
    { id: '1', type: 'Credit Card', last4: '4532', provider: 'Visa', isDefault: true },
    { id: '2', type: 'Debit Card', last4: '8765', provider: 'Mastercard', isDefault: false },
  ];

  const recentTransactions = [
    { id: '1', name: 'Rajwada Palace Tour', amount: -350, date: 'Mar 25, 2026', status: 'completed' },
    { id: '2', name: 'Wallet Top-up', amount: +1000, date: 'Mar 24, 2026', status: 'completed' },
    { id: '3', name: 'Food at Chappan Dukan', amount: -180, date: 'Mar 23, 2026', status: 'completed' },
  ];

  return (
    <div className="pb-24 overflow-y-auto h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 px-6 pt-12 pb-16 rounded-b-[3rem]">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-indigo-200 text-sm mb-1">TOTAL BALANCE</p>
            <h1 className="text-white text-4xl">₹{balance.toLocaleString()}</h1>
          </div>
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <WalletIcon className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button className="flex-1 bg-white text-indigo-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            Add Money
          </button>
          <button className="flex-1 bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-white/30 transition-all active:scale-95">
            <TrendingUp className="w-5 h-5" />
            History
          </button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg">Payment Methods</h2>
            <button className="text-indigo-600 text-sm">Add New</button>
          </div>
          
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-2xl border-2 ${
                  method.isDefault
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    method.isDefault ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}>
                    <CreditCard className={`w-6 h-6 ${method.isDefault ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{method.provider}</p>
                    <p className="text-sm text-gray-600">•••• {method.last4}</p>
                  </div>
                  {method.isDefault && (
                    <span className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 mt-6">
        <h2 className="text-lg mb-4">Recent Transactions</h2>
        
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200 overflow-hidden">
          {recentTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`p-4 flex items-center gap-4 ${
                index !== recentTransactions.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-900">{transaction.name}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                </p>
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="px-6 mt-6 mb-6">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 text-white">
          <h3 className="text-lg mb-4">Ready to Book?</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-indigo-200">Selected Places</span>
              <span>4 destinations</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-indigo-200">Estimated Duration</span>
              <span>6-8 hours</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex justify-between items-center">
              <span className="text-lg">Total Amount</span>
              <span className="text-2xl">₹850</span>
            </div>
          </div>

          <button className="w-full bg-white text-indigo-600 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all active:scale-95">
            Book Itinerary
          </button>
          
          <button className="w-full mt-3 bg-white/20 backdrop-blur-sm text-white py-4 rounded-xl font-medium hover:bg-white/30 transition-all active:scale-95">
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
}

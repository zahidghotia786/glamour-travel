
'use client';
import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Download, 
  Eye, 
  Filter, 
  Search,
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertCircle,
  Plus,
  Wallet,
  Receipt,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3
} from 'lucide-react';

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const paymentStats = {
    totalSpent: 2450,
    thisMonth: 320,
    lastMonth: 195,
    pendingAmount: 60,
    completedPayments: 15,
    savedAmount: 245
  };

  const paymentMethods = [
    {
      id: 1,
      type: 'Credit Card',
      last4: '4532',
      brand: 'Visa',
      expiry: '12/26',
      isDefault: true,
      icon: '💳'
    },
    {
      id: 2,
      type: 'Credit Card',
      last4: '8901',
      brand: 'Mastercard',
      expiry: '08/25',
      isDefault: false,
      icon: '💳'
    },
    {
      id: 3,
      type: 'Digital Wallet',
      name: 'PayPal',
      email: 'ahmed@email.com',
      isDefault: false,
      icon: '💰'
    }
  ];

  const transactions = [
    {
      id: 'PAY001',
      tourName: 'Burj Khalifa & Dubai Mall',
      bookingId: 'TKT001',
      amount: 89,
      status: 'completed',
      date: '2024-09-20',
      method: 'Visa •••• 4532',
      type: 'payment',
      refundable: true
    },
    {
      id: 'PAY002',
      tourName: 'Desert Safari with BBQ',
      bookingId: 'TKT002',
      amount: 60,
      status: 'completed',
      date: '2024-09-25',
      method: 'Visa •••• 4532',
      type: 'partial_payment',
      refundable: false
    },
    {
      id: 'PAY003',
      tourName: 'Dubai Marina Cruise',
      bookingId: 'TKT003',
      amount: 75,
      status: 'completed',
      date: '2024-09-28',
      method: 'PayPal',
      type: 'payment',
      refundable: true
    },
    {
      id: 'PAY004',
      tourName: 'Old Dubai Heritage Tour',
      bookingId: 'TKT004',
      amount: 45,
      status: 'completed',
      date: '2024-08-15',
      method: 'Mastercard •••• 8901',
      type: 'payment',
      refundable: false
    },
    {
      id: 'REF001',
      tourName: 'Atlantis Aquaventure',
      bookingId: 'TKT005',
      amount: 95,
      status: 'refunded',
      date: '2024-08-12',
      method: 'Visa •••• 4532',
      type: 'refund',
      refundable: false
    },
    {
      id: 'PAY005',
      tourName: 'Desert Safari with BBQ',
      bookingId: 'TKT002',
      amount: 60,
      status: 'pending',
      date: '2024-10-15',
      method: 'Pending',
      type: 'pending_payment',
      refundable: false
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'refunded': return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      completed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      failed: 'bg-red-100 text-red-700',
      refunded: 'bg-blue-100 text-blue-700'
    };
    return `px-3 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-700'}`;
  };

  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'payment': return '💰';
      case 'partial_payment': return '💳';
      case 'refund': return '↩️';
      case 'pending_payment': return '⏳';
      default: return '💰';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return transaction.status === 'completed';
    if (activeTab === 'pending') return transaction.status === 'pending';
    if (activeTab === 'refunded') return transaction.status === 'refunded';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Payments', count: transactions.length },
    { id: 'completed', label: 'Completed', count: transactions.filter(t => t.status === 'completed').length },
    { id: 'pending', label: 'Pending', count: transactions.filter(t => t.status === 'pending').length },
    { id: 'refunded', label: 'Refunded', count: transactions.filter(t => t.status === 'refunded').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
              <p className="text-gray-600 mt-1">Track your transactions and manage payment methods</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
              </select>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Total Spent</p>
            <p className="text-2xl font-bold text-purple-600">${paymentStats.totalSpent}</p>
            <div className="mt-2 flex items-center text-purple-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">This Month</p>
            <p className="text-2xl font-bold text-green-600">${paymentStats.thisMonth}</p>
            <div className="mt-2 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+64% vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <RefreshCw className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">${paymentStats.pendingAmount}</p>
            <div className="mt-2 flex items-center text-yellow-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Action required</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Completed</p>
            <p className="text-2xl font-bold text-blue-600">{paymentStats.completedPayments}</p>
            <div className="mt-2 flex items-center text-blue-600">
              <Receipt className="h-4 w-4 mr-1" />
              <span className="text-sm">Successful payments</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <PieChart className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Avg per Tour</p>
            <p className="text-2xl font-bold text-indigo-600">${Math.round(paymentStats.totalSpent / paymentStats.completedPayments)}</p>
            <div className="mt-2 flex items-center text-indigo-600">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span className="text-sm">Per booking</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Saved</p>
            <p className="text-2xl font-bold text-orange-600">${paymentStats.savedAmount}</p>
            <div className="mt-2 flex items-center text-orange-600">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span className="text-sm">With discounts</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Payment Methods</h2>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Method</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl">{method.icon}</div>
                    {method.isDefault && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{method.type}</p>
                    {method.last4 && (
                      <>
                        <p className="text-sm text-gray-600">{method.brand} •••• {method.last4}</p>
                        <p className="text-xs text-gray-500 mt-1">Expires {method.expiry}</p>
                      </>
                    )}
                    {method.email && (
                      <p className="text-sm text-gray-600">{method.email}</p>
                    )}
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Edit</button>
                    {!method.isDefault && (
                      <button className="text-xs text-gray-600 hover:text-gray-700 font-medium">Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    
                    {/* Left Side - Transaction Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-3xl">{getTransactionTypeIcon(transaction.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{transaction.tourName}</h3>
                            <p className="text-sm text-gray-500">
                              Transaction ID: {transaction.id} • Booking: {transaction.bookingId}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(transaction.status)}
                            <span className={getStatusBadge(transaction.status)}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{transaction.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span>{transaction.method}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Receipt className="h-4 w-4" />
                            <span className="capitalize">{transaction.type.replace('_', ' ')}</span>
                          </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
                                <p className={`text-lg font-bold ${
                                  transaction.type === 'refund' ? 'text-green-600' : 
                                  transaction.status === 'pending' ? 'text-yellow-600' : 'text-gray-800'
                                }`}>
                                  {transaction.type === 'refund' ? '+' : ''}${transaction.amount}
                                </p>
                              </div>
                              {transaction.refundable && transaction.status === 'completed' && (
                                <div>
                                  <p className="text-xs text-green-600 font-medium">✓ Refundable</p>
                                  <p className="text-xs text-gray-500">Until 24h before tour</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1">
                                <Eye className="h-4 w-4" />
                                <span>Details</span>
                              </button>
                              <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1">
                                <Download className="h-4 w-4" />
                                <span>Receipt</span>
                              </button>
                              {transaction.status === 'pending' && (
                                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                                  Pay Now
                                </button>
                              )}
                              {transaction.refundable && transaction.status === 'completed' && (
                                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                                  Request Refund
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 text-center">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-lg transition-colors">
                Load More Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
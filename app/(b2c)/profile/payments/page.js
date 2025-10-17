'use client';
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Download, 
  Eye, 
  Search,
  CheckCircle, 
  XCircle, 
  RefreshCw,
  AlertCircle,
  Receipt,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const PaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [paymentStats, setPaymentStats] = useState({
    totalSpent: 0,
    thisMonth: 0,
    lastMonth: 0,
    pendingAmount: 0,
    completedPayments: 0,
    averagePerBooking: 0
  });

  // Fetch payment data from backend
  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);

      const token =
        typeof window !== "undefined" &&
        (localStorage.getItem("token") || sessionStorage.getItem("token"));

      if (!token) {
        throw new Error("User not authenticated");
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const transactionsResponse = await fetch(`${baseUrl}/api/payment/transactions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const transactionsData = await transactionsResponse.json();
      console.log("📊 Transactions Data:", transactionsData); // Debug log

      if (transactionsResponse.ok && transactionsData.success) {
        setTransactions(transactionsData.data);
        calculateStats(transactionsData.data);
      } else {
        throw new Error(transactionsData.error || "Failed to load transactions");
      }
    } catch (err) {
      console.error("❌ Error loading payment data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactions) => {
    const completedPayments = transactions.filter(t => t.status === 'COMPLETED');
    const pendingPayments = transactions.filter(t => t.status === 'PENDING');
    
    const totalSpent = completedPayments.reduce((sum, t) => sum + t.amount, 0);
    const pendingAmount = pendingPayments.reduce((sum, t) => sum + t.amount, 0);
    
    const now = new Date();
    const thisMonth = completedPayments
      .filter(t => {
        const paymentDate = new Date(t.createdAt);
        return paymentDate.getMonth() === now.getMonth() && 
               paymentDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonth = completedPayments
      .filter(t => {
        const paymentDate = new Date(t.createdAt);
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
        return paymentDate.getMonth() === lastMonthDate.getMonth() && 
               paymentDate.getFullYear() === lastMonthDate.getFullYear();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    setPaymentStats({
      totalSpent,
      thisMonth,
      lastMonth,
      pendingAmount,
      completedPayments: completedPayments.length,
      averagePerBooking: completedPayments.length > 0 ? totalSpent / completedPayments.length : 0
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PENDING': return <RefreshCw className="h-5 w-5 text-yellow-500" />;
      case 'FAILED': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'REFUNDED': return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      COMPLETED: 'bg-green-100 text-green-700',
      PENDING: 'bg-yellow-100 text-yellow-700',
      FAILED: 'bg-red-100 text-red-700',
      REFUNDED: 'bg-blue-100 text-blue-700'
    };
    return `px-3 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-700'}`;
  };

  const getTransactionTypeIcon = (type) => {
    switch (type) {
      case 'PAYMENT': return '💰';
      case 'REFUND': return '↩️';
      case 'PARTIAL_PAYMENT': return '💳';
      default: return '💰';
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      'COMPLETED': 'Completed',
      'PENDING': 'Pending',
      'FAILED': 'Failed',
      'REFUNDED': 'Refunded'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTourType = (booking) => {
    if (!booking) return "Tour Booking";
    
    if (booking.tourDetails && booking.tourDetails.length > 0) {
      const tour = booking.tourDetails[0];
      return `Tour #${tour.tourId} - ${tour.pickup || 'Standard Tour'}`;
    }
    
    return "Tour Booking";
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return transaction.status === 'COMPLETED';
    if (activeTab === 'pending') return transaction.status === 'PENDING';
    if (activeTab === 'refunded') return transaction.status === 'REFUNDED';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Payments', count: transactions.length },
    { id: 'completed', label: 'Completed', count: transactions.filter(t => t.status === 'COMPLETED').length },
    { id: 'pending', label: 'Pending', count: transactions.filter(t => t.status === 'PENDING').length },
    { id: 'refunded', label: 'Refunded', count: transactions.filter(t => t.status === 'REFUNDED').length }
  ];

  // View transaction details
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
  };

  // Close details modal
  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Error loading payments: {error}</p>
          <button
            onClick={loadPaymentData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
              <p className="text-gray-600 mt-1">Track your payment transactions</p>
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
              <button 
                onClick={loadPaymentData}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Total Spent</p>
            <p className="text-2xl font-bold text-purple-600">AED {paymentStats.totalSpent}</p>
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
            <p className="text-2xl font-bold text-green-600">AED {paymentStats.thisMonth}</p>
            <div className="mt-2 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {paymentStats.lastMonth > 0 ? 
                  `+${Math.round(((paymentStats.thisMonth - paymentStats.lastMonth) / paymentStats.lastMonth) * 100)}% vs last month` : 
                  'First month'
                }
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <RefreshCw className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">AED {paymentStats.pendingAmount}</p>
            <div className="mt-2 flex items-center text-yellow-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Awaiting payment</span>
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
            <p className="text-gray-500 text-sm uppercase tracking-wide">Avg per Booking</p>
            <p className="text-2xl font-bold text-indigo-600">AED {Math.round(paymentStats.averagePerBooking)}</p>
            <div className="mt-2 flex items-center text-indigo-600">
              <BarChart3 className="h-4 w-4 mr-1" />
              <span className="text-sm">Per booking</span>
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
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No transactions found</p>
                <p className="text-gray-400 mt-2">
                  When you make payments, they will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction._id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      
                      {/* Left Side - Transaction Info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="text-3xl">{getTransactionTypeIcon(transaction.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {getTourType(transaction.bookingId)}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Transaction ID: {transaction.paymentIntentId} • 
                                Booking Ref: {transaction.bookingId?.reference}
                                {transaction.bookingId?.raynaBookingId && (
                                  <span className="ml-2">• Operator Ref: {transaction.bookingId.raynaBookingId}</span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(transaction.status)}
                              <span className={getStatusBadge(transaction.status)}>
                                {formatStatus(transaction.status)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(transaction.createdAt)} at {formatTime(transaction.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4" />
                              <span>{transaction.gateway}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Receipt className="h-4 w-4" />
                              <span>{transaction.type?.replace('_', ' ')}</span>
                            </div>
                          </div>

                          {/* Booking Summary */}
                          {transaction.bookingId && (
                            <div className="bg-white rounded-lg p-4 mb-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Booking Status:</p>
                                  <p className="font-medium">{transaction.bookingId.status}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Payment Status:</p>
                                  <p className="font-medium">{transaction.bookingId.paymentStatus}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Passengers:</p>
                                  <p className="font-medium">{transaction.bookingId.passengerCount}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Total Amount:</p>
                                  <p className="font-medium">{transaction.bookingId.currency} {transaction.bookingId.totalGross}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Transaction Details */}
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Payment Amount</p>
                                  <p className={`text-lg font-bold ${
                                    transaction.type === 'REFUND' ? 'text-green-600' : 
                                    transaction.status === 'PENDING' ? 'text-yellow-600' : 'text-gray-800'
                                  }`}>
                                    {transaction.type === 'REFUND' ? '+' : ''}{transaction.amount} {transaction.currency}
                                  </p>
                                </div>
                                
                                {/* Tour Details */}
                                {transaction.bookingId?.tourDetails?.[0] && (
                                  <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Tour Date: {formatDate(transaction.bookingId.tourDetails[0].tourDate)}</p>
                                    <p className="text-xs text-gray-500">Pickup: {transaction.bookingId.tourDetails[0].pickup}</p>
                                  </div>
                                )}

                                {/* Lead Passenger */}
                                {transaction.bookingId?.leadPassenger && (
                                  <div className="space-y-1">
                                    <p className="text-xs text-gray-500">
                                      Passenger: {transaction.bookingId.leadPassenger.firstName} {transaction.bookingId.leadPassenger.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500">Email: {transaction.bookingId.leadPassenger.email}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleViewDetails(transaction)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  <span>View Details</span>
                                </button>
                                {transaction.status === 'COMPLETED' && (
                                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1">
                                    <Download className="h-4 w-4" />
                                    <span>Receipt</span>
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
            )}

            {/* Load More */}
            {filteredTransactions.length > 0 && (
              <div className="mt-8 text-center">
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-lg transition-colors">
                  Load More Transactions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionDetailsModal 
          transaction={selectedTransaction} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

// Transaction Details Modal Component
const TransactionDetailsModal = ({ transaction, onClose }) => {
  const booking = transaction.bookingId;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Transaction Details</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaction Information */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transaction Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{transaction.paymentIntentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={getStatusBadge(transaction.status)}>
                      {formatStatus(transaction.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{transaction.amount} {transaction.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Gateway:</span>
                    <span className="font-medium">{transaction.gateway}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(transaction.createdAt)} at {formatTime(transaction.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              {booking && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reference:</span>
                      <span className="font-medium">{booking.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium">{booking.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className="font-medium">{booking.paymentStatus}</span>
                    </div>
                    {booking.raynaBookingId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operator Ref:</span>
                        <span className="font-medium text-blue-600">{booking.raynaBookingId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Tour & Passenger Details */}
            <div className="space-y-6">
              {/* Tour Details */}
              {booking?.tourDetails?.[0] && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tour Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tour ID:</span>
                      <span className="font-medium">{booking.tourDetails[0].tourId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tour Date:</span>
                      <span className="font-medium">{formatDate(booking.tourDetails[0].tourDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup Location:</span>
                      <span className="font-medium">{booking.tourDetails[0].pickup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passengers:</span>
                      <span className="font-medium">{booking.passengerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">{booking.currency} {booking.totalGross}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Lead Passenger */}
              {booking?.leadPassenger && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Lead Passenger</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">
                        {booking.leadPassenger.firstName} {booking.leadPassenger.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{booking.leadPassenger.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-medium">{booking.leadPassenger.mobile}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nationality:</span>
                      <span className="font-medium">{booking.leadPassenger.nationality}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for status badge in modal
const getStatusBadge = (status) => {
  const classes = {
    COMPLETED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    FAILED: 'bg-red-100 text-red-700',
    REFUNDED: 'bg-blue-100 text-blue-700'
  };
  return `px-3 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-700'}`;
};

// Helper function for formatting status
const formatStatus = (status) => {
  const statusMap = {
    'COMPLETED': 'Completed',
    'PENDING': 'Pending',
    'FAILED': 'Failed',
    'REFUNDED': 'Refunded'
  };
  return statusMap[status] || status;
};

// Helper function for formatting date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function for formatting time
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default PaymentsPage;
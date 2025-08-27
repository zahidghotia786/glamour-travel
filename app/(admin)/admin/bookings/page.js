"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Calendar, Clock, MapPin, Users, Star,
  CheckCircle, XCircle, AlertCircle, Eye, Edit, Trash2,
  Download, Mail, Phone, Globe, CreditCard, Printer,
  Plus, Upload, ArrowRight, ArrowLeft, MoreVertical,
  User, Building2, Package, DollarSign, TrendingUp,
  RefreshCw, FileText, Settings, Bell, Shield
} from "lucide-react";


export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table"); // table or cards

  // Sample booking data - would come from API
  const [bookings] = useState([
    {
      id: "BK001",
      bookingRef: "GT-2025-001",
      customerName: "Ahmed Al-Rashid",
      customerEmail: "ahmed@email.com",
      customerPhone: "+971501234567",
      customerType: "B2C",
      attraction: "Ferrari World Abu Dhabi",
      ticketType: "Premium Access",
      quantity: 4,
      totalAmount: "AED 1,140",
      originalPrice: "AED 1,280",
      markup: "15%",
      bookingDate: "2025-08-24",
      visitDate: "2025-08-30",
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "Credit Card",
      language: "en",
      country: "UAE",
      voucher: "VCH001234",
      created: "2025-08-24 10:30",
      lastModified: "2025-08-24 10:35"
    },
    {
      id: "BK002",
      bookingRef: "GT-2025-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      customerPhone: "+447912345678",
      customerType: "B2C",
      attraction: "Burj Khalifa At The Top",
      ticketType: "Standard Entry",
      quantity: 2,
      totalAmount: "AED 298",
      originalPrice: "AED 360",
      markup: "12%",
      bookingDate: "2025-08-24",
      visitDate: "2025-08-25",
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "Bank Transfer",
      language: "en",
      country: "UK",
      voucher: "VCH001235",
      created: "2025-08-24 11:15",
      lastModified: "2025-08-24 11:15"
    },
    {
      id: "BK003",
      bookingRef: "GT-2025-003",
      customerName: "Travel Co. LLC",
      customerEmail: "bookings@travelco.ae",
      customerPhone: "+97142345678",
      customerType: "B2B",
      attraction: "IMG Worlds of Adventure",
      ticketType: "Group Package",
      quantity: 25,
      totalAmount: "AED 6,250",
      originalPrice: "AED 7,875",
      markup: "8%",
      bookingDate: "2025-08-23",
      visitDate: "2025-08-28",
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "Corporate Account",
      language: "en",
      country: "UAE",
      voucher: "VCH001236",
      created: "2025-08-23 14:20",
      lastModified: "2025-08-23 15:45"
    },
    {
      id: "BK004",
      bookingRef: "GT-2025-004",
      customerName: "Мария Петрова",
      customerEmail: "maria.petrova@email.ru",
      customerPhone: "+79161234567",
      customerType: "B2C",
      attraction: "Atlantis Aquaventure",
      ticketType: "Full Day Access",
      quantity: 3,
      totalAmount: "AED 945",
      originalPrice: "AED 1,080",
      markup: "18%",
      bookingDate: "2025-08-24",
      visitDate: "2025-09-01",
      status: "cancelled",
      paymentStatus: "refunded",
      paymentMethod: "Credit Card",
      language: "ru",
      country: "Russia",
      voucher: "VCH001237",
      created: "2025-08-24 09:45",
      lastModified: "2025-08-24 16:20"
    }
  ]);

  const [stats] = useState({
    totalBookings: 847,
    confirmedBookings: 632,
    pendingBookings: 89,
    cancelledBookings: 126,
    totalRevenue: "AED 1,245,680",
    b2cBookings: 643,
    b2bBookings: 204
  });

  // Filter bookings based on active tab and search
  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === "all" || booking.status === activeTab;
    const matchesSearch = booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.attraction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: "all", label: "All Bookings", count: stats.totalBookings },
    { id: "confirmed", label: "Confirmed", count: stats.confirmedBookings },
    { id: "pending", label: "Pending", count: stats.pendingBookings },
    { id: "cancelled", label: "Cancelled", count: stats.cancelledBookings }
  ];

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Bookings Management</h1>
              <p className="text-lg text-gray-600">Manage all bookings, track payments, and handle customer requests</p>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                New Booking
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <Upload className="w-5 h-5" />
                Export
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <Package className="w-8 h-8 text-blue-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Confirmed</p>
                  <p className="text-2xl font-bold">{stats.confirmedBookings}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Cancelled</p>
                  <p className="text-2xl font-bold">{stats.cancelledBookings}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold">{stats.totalRevenue}</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">B2C Bookings</p>
                  <p className="text-2xl font-bold">{stats.b2cBookings}</p>
                </div>
                <User className="w-8 h-8 text-indigo-200" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">B2B Bookings</p>
                  <p className="text-2xl font-bold">{stats.b2bBookings}</p>
                </div>
                <Building2 className="w-8 h-8 text-orange-200" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl hover:bg-gray-200 transition-all duration-300"
              >
                <Filter className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
                className="bg-gray-100 text-gray-700 px-4 py-3 rounded-2xl hover:bg-gray-200 transition-all duration-300"
              >
                {viewMode === 'table' ? <Package className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select className="px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500">
                    <option>All Customer Types</option>
                    <option>B2C Customers</option>
                    <option>B2B Partners</option>
                  </select>
                  
                  <select className="px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500">
                    <option>All Attractions</option>
                    <option>Ferrari World</option>
                    <option>Burj Khalifa</option>
                    <option>IMG Worlds</option>
                  </select>
                  
                  <input
                    type="date"
                    className="px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <input
                    type="date"
                    className="px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bookings Table/Cards */}
          {/* <div className="w-[420px] sm:w-[700px] overflow-hidden h-max"> */}
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[400px]"> {/* Added min-width for small screens */}
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-900">Booking Info</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-900">Attraction</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-900">Visit Date</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">{booking.bookingRef}</div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {booking.customerType === 'B2B' ? (
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                B2B
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <User className="w-3 h-3" />
                                B2C
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{booking.customerName}</div>
                          <div className="text-xs sm:text-sm text-gray-600">{booking.customerEmail}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Globe className="w-3 h-3" />
                            {booking.country} | {booking.language.toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm sm:text-base">{booking.attraction}</div>
                          <div className="text-xs sm:text-sm text-gray-600">{booking.ticketType}</div>
                          <div className="text-xs text-gray-500">Qty: {booking.quantity}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-900">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          {booking.visitDate}
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">{booking.totalAmount}</div>
                          <div className="text-xs text-gray-500 line-through">{booking.originalPrice}</div>
                          <div className="text-xs text-green-600">Markup: {booking.markup}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                            booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            <CreditCard className="w-3 h-3" />
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedBooking(booking)}
                            className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
                            title="Download Voucher"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 sm:p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-all duration-200"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 sm:p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-all duration-200"
                            title="More Actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {booking.customerType === 'B2B' ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{booking.bookingRef}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2">{booking.customerName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{booking.attraction}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {booking.visitDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {booking.quantity} pax
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-lg text-gray-900">{booking.totalAmount}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                      booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      <CreditCard className="w-3 h-3" />
                      {booking.paymentStatus}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </motion.button>
                    
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
                        title="Download Voucher"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-all duration-200"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, filteredBookings.length)} of {filteredBookings.length} bookings
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </motion.button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <motion.button
                        key={i + 1}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          currentPage === i + 1
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </motion.button>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
          {/* </div> */}

        {/* Booking Detail Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedBooking(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Details</h2>
                      <p className="text-gray-600">Reference: {selectedBooking.bookingRef}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedBooking(null)}
                      className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                      <XCircle className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Customer Information */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          {selectedBooking.customerType === 'B2B' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                          Customer Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-lg font-semibold text-gray-900">{selectedBooking.customerName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-gray-900 flex items-center gap-2">
                              {selectedBooking.customerEmail}
                              <Mail className="w-4 h-4 text-gray-400" />
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Phone</label>
                            <p className="text-gray-900 flex items-center gap-2">
                              {selectedBooking.customerPhone}
                              <Phone className="w-4 h-4 text-gray-400" />
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Type & Location</label>
                            <div className="flex items-center gap-4 mt-1">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                selectedBooking.customerType === 'B2B' 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {selectedBooking.customerType}
                              </span>
                              <span className="flex items-center gap-1 text-gray-600">
                                <Globe className="w-4 h-4" />
                                {selectedBooking.country} | {selectedBooking.language.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Status */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Booking Status
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Booking Status</span>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                              {getStatusIcon(selectedBooking.status)}
                              {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Payment Status</span>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              selectedBooking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                              selectedBooking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              <CreditCard className="w-3 h-3" />
                              {selectedBooking.paymentStatus.charAt(0).toUpperCase() + selectedBooking.paymentStatus.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Payment Method</span>
                            <span className="text-gray-900">{selectedBooking.paymentMethod}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Voucher Code</span>
                            <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">{selectedBooking.voucher}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Booking Details
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Attraction</label>
                            <p className="text-lg font-semibold text-gray-900">{selectedBooking.attraction}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Ticket Type</label>
                            <p className="text-gray-900">{selectedBooking.ticketType}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Quantity</label>
                              <p className="text-gray-900 flex items-center gap-1">
                                <Users className="w-4 h-4 text-gray-400" />
                                {selectedBooking.quantity} pax
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Visit Date</label>
                              <p className="text-gray-900 flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {selectedBooking.visitDate}
                              </p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Booking Date</label>
                            <p className="text-gray-900 flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {selectedBooking.created}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Information */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <DollarSign className="w-5 h-5" />
                          Pricing Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Original Price</span>
                            <span className="text-gray-500 line-through">{selectedBooking.originalPrice}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Markup Applied</span>
                            <span className="text-green-600 font-medium">{selectedBooking.markup}</span>
                          </div>
                          <div className="flex items-center justify-between border-t pt-3">
                            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                            <span className="text-2xl font-bold text-blue-600">{selectedBooking.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 mt-8 pt-8 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Download className="w-5 h-5" />
                      Download Voucher
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Mail className="w-5 h-5" />
                      Send Email
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Printer className="w-5 h-5" />
                      Print Voucher
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Booking
                    </motion.button>
                    
                    {selectedBooking.status !== 'cancelled' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <XCircle className="w-5 h-5" />
                        Cancel Booking
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
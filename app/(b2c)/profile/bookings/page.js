
'use client';
import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Filter, 
  Search,
  Download,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Phone,
  Mail,
  Navigation,
  Users,
  Camera
} from 'lucide-react';

const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const bookings = [
    {
      id: 'TKT001',
      tour: 'Burj Khalifa & Dubai Mall Experience',
      date: '2024-10-15',
      time: '09:00 AM',
      duration: '4 hours',
      status: 'confirmed',
      price: 89,
      paid: 89,
      image: '🏗️',
      location: 'Downtown Dubai',
      guests: 2,
      bookingDate: '2024-09-20',
      tourGuide: 'Sarah Ahmed',
      includes: ['Skip-the-line tickets', 'Professional guide', 'Dubai Mall visit'],
      contact: '+971-4-123-4567'
    },
    {
      id: 'TKT002',
      tour: 'Desert Safari with BBQ Dinner',
      date: '2024-10-20',
      time: '03:00 PM',
      duration: '6 hours',
      status: 'pending',
      price: 120,
      paid: 60,
      image: '🏜️',
      location: 'Al Khaimah Desert',
      guests: 4,
      bookingDate: '2024-09-25',
      tourGuide: 'Omar Hassan',
      includes: ['Camel riding', 'BBQ dinner', 'Cultural show', 'Transportation'],
      contact: '+971-4-567-8901'
    },
    {
      id: 'TKT003',
      tour: 'Dubai Marina Luxury Cruise',
      date: '2024-10-25',
      time: '07:00 PM',
      duration: '2 hours',
      status: 'confirmed',
      price: 75,
      paid: 75,
      image: '🚢',
      location: 'Dubai Marina',
      guests: 2,
      bookingDate: '2024-09-28',
      tourGuide: 'Fatima Ali',
      includes: ['Luxury yacht', 'Refreshments', 'City views'],
      contact: '+971-4-234-5678'
    },
    {
      id: 'TKT004',
      tour: 'Old Dubai Heritage Walking Tour',
      date: '2024-09-10',
      time: '10:00 AM',
      duration: '3 hours',
      status: 'completed',
      price: 45,
      paid: 45,
      image: '🏛️',
      location: 'Al Fahidi District',
      guests: 2,
      bookingDate: '2024-08-15',
      tourGuide: 'Ahmed Mohamed',
      includes: ['Walking tour', 'Traditional boat ride', 'Cultural sites'],
      contact: '+971-4-345-6789'
    },
    {
      id: 'TKT005',
      tour: 'Atlantis Aquaventure Day Pass',
      date: '2024-08-20',
      time: '09:00 AM',
      duration: 'Full Day',
      status: 'cancelled',
      price: 95,
      paid: 0,
      image: '🏊‍♂️',
      location: 'Palm Jumeirah',
      guests: 3,
      bookingDate: '2024-08-10',
      tourGuide: 'N/A',
      includes: ['Water park access', 'Aquarium visit', 'Beach access'],
      contact: '+971-4-456-7890'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return `px-3 py-1 rounded-full text-xs font-medium ${classes[status] || 'bg-gray-100 text-gray-700'}`;
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return ['confirmed', 'pending'].includes(booking.status);
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    { id: 'upcoming', label: 'Upcoming', count: bookings.filter(b => ['confirmed', 'pending'].includes(b.status)).length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-gray-600 mt-1">Manage and track your Dubai tour experiences</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
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

          {/* Bookings List */}
          <div className="p-6 space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Side - Tour Info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-4xl">{booking.image}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{booking.tour}</h3>
                          <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <span className={getStatusBadge(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{booking.guests} Guests</span>
                        </div>
                      </div>

                      {/* Tour Details */}
                      <div className="bg-white rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Tour Includes</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.includes.map((item, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Price & Actions */}
                  <div className="lg:text-right space-y-3">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">${booking.price}</p>
                      <p className="text-sm text-gray-500">
                        Paid: <span className="font-medium text-green-600">${booking.paid}</span>
                        {booking.price > booking.paid && (
                          <span className="text-red-600 ml-1">
                            (${booking.price - booking.paid} due)
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap lg:flex-col gap-2">
                      {booking.status === 'confirmed' && (
                        <>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                          </button>
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>Contact Guide</span>
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'pending' && (
                        <>
                          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                            <RefreshCw className="h-4 w-4" />
                            <span>Complete Payment</span>
                          </button>
                          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                            Cancel Booking
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'completed' && (
                        <>
                          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                            <Star className="h-4 w-4" />
                            <span>Rate Tour</span>
                          </button>
                          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                            <Camera className="h-4 w-4" />
                            <span>View Photos</span>
                          </button>
                        </>
                      )}
                      
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tour Guide Info */}
                {booking.tourGuide !== 'N/A' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {booking.tourGuide.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Tour Guide: {booking.tourGuide}</p>
                          <p className="text-xs text-gray-500">Contact: {booking.contact}</p>
                        </div>
                      </div>
                      {booking.status === 'confirmed' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>Message</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
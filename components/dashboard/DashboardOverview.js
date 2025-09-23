import React from 'react';
import { 
  Calendar, 
  CreditCard, 
  MapPin, 
  Star, 
  TrendingUp, 
  Clock, 
  Gift,
  Eye,
  Heart,
  Sparkles,
  Crown,
  Users,
  Camera,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const DashboardOverview = () => {
  // Sample data
  const userStats = {
    totalBookings: 12,
    activeBookings: 3,
    totalSpent: 2450,
    loyaltyPoints: 1250,
    completedTours: 9,
    savedTours: 8
  };

  const recentBookings = [
    { 
      id: 1,
      tour: 'Burj Khalifa & Dubai Mall', 
      date: '2024-10-15', 
      time: '09:00 AM',
      status: 'confirmed', 
      price: 89,
      image: '🏗️',
      location: 'Downtown Dubai'
    },
    { 
      id: 2,
      tour: 'Desert Safari Adventure', 
      date: '2024-10-20', 
      time: '03:00 PM',
      status: 'pending', 
      price: 120,
      image: '🏜️',
      location: 'Al Khaimah Desert'
    },
    { 
      id: 3,
      tour: 'Dubai Marina Cruise', 
      date: '2024-10-25', 
      time: '07:00 PM',
      status: 'confirmed', 
      price: 75,
      image: '🚢',
      location: 'Dubai Marina'
    }
  ];

  const popularTours = [
    { name: 'Atlantis Aquaventure', price: 95, rating: 4.8, image: '🏊‍♂️' },
    { name: 'Dubai Frame Experience', price: 65, rating: 4.7, image: '🖼️' },
    { name: 'Global Village Tour', price: 45, rating: 4.6, image: '🌍' },
    { name: 'Ski Dubai Adventure', price: 85, rating: 4.9, image: '⛷️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-500/20">
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  Welcome back, Ahmed! 
                  <Sparkles className="h-8 w-8 ml-2 text-yellow-300" />
                </h1>
                <p className="text-blue-100 text-lg">Ready for your next Dubai adventure? 🏙️</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">

                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    Member since 2023
                  </span>
                </div>
              </div>
              <div className="text-center">
<div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
  <p className="text-sm text-white/80">Today’s Motivation</p>
  <p className="text-xl font-bold">“Small steps lead to big success.”</p>
  <p className="text-sm">Stay consistent 💡</p>
</div>

              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-800">{userStats.totalBookings}</p>
            <div className="mt-2 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+20% this month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Active Bookings</p>
            <p className="text-2xl font-bold text-green-600">{userStats.activeBookings}</p>
            <div className="mt-2 flex items-center text-blue-600">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">Upcoming</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Total Spent</p>
            <p className="text-2xl font-bold text-purple-600">${userStats.totalSpent}</p>
            <div className="mt-2 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">+15% savings</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl group-hover:bg-yellow-200 transition-colors">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Loyalty Points</p>
            <p className="text-2xl font-bold text-yellow-600">{userStats.loyaltyPoints}</p>
            <div className="mt-2 flex items-center text-yellow-600">
              <Crown className="h-4 w-4 mr-1" />
              <span className="text-sm">Gold Status</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Completed Tours</p>
            <p className="text-2xl font-bold text-indigo-600">{userStats.completedTours}</p>
            <div className="mt-2 flex items-center text-indigo-600">
              <Camera className="h-4 w-4 mr-1" />
              <span className="text-sm">Memories made</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-xl group-hover:bg-red-200 transition-colors">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Saved Tours</p>
            <p className="text-2xl font-bold text-red-600">{userStats.savedTours}</p>
            <div className="mt-2 flex items-center text-red-600">
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-sm">Wishlist</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Recent Bookings */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{booking.image}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{booking.tour}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {booking.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="font-bold text-gray-800 text-lg">${booking.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Tours */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Popular Tours</h2>
              <p className="text-sm text-gray-500 mt-1">Trending experiences</p>
            </div>
            <div className="p-6 space-y-4">
              {popularTours.map((tour, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{tour.image}</div>
                    <div>
                      <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">{tour.name}</h4>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-600">{tour.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${tour.price}</p>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group">
              <Calendar className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold">Book New Tour</h3>
              <p className="text-xs text-blue-100 mt-1">Discover amazing experiences</p>
            </button>
            
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 group">
              <Eye className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold">View Bookings</h3>
              <p className="text-xs text-green-100 mt-1">Manage your tours</p>
            </button>
            
            <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 group">
              <CreditCard className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold">Payment History</h3>
              <p className="text-xs text-purple-100 mt-1">Track your expenses</p>
            </button>
            
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group">
              <Gift className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold">Redeem Points</h3>
              <p className="text-xs text-orange-100 mt-1">Use your loyalty points</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
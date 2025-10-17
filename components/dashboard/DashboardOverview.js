import React, { useEffect, useState } from 'react';
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
  CheckCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardOverview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
    loadDashboardData();
  }, []);

  const loadUserData = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        setUser(null);
      }
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      // Load user bookings for stats
      const bookingsResponse = await fetch(`${baseUrl}/api/booking/my-bookings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!bookingsResponse.ok) {
        throw new Error('Failed to load bookings');
      }

      const bookingsData = await bookingsResponse.json();
      
      if (bookingsData.success) {
        const bookings = bookingsData.data || [];
        calculateStats(bookings);
        setRecentBookings(bookings.slice(0, 3)); // Show only 3 recent bookings
      }

    } catch (err) {
      console.error('Dashboard data error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings) => {
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(booking => 
      ['CONFIRMED', 'PENDING', 'AWAITING_PAYMENT'].includes(booking.status)
    ).length;
    
    const completedTours = bookings.filter(booking => 
      booking.status === 'CONFIRMED' || booking.status === 'SUCCESS'
    ).length;
    
    const totalSpent = bookings
      .filter(booking => booking.paymentStatus === 'PAID')
      .reduce((sum, booking) => sum + (booking.totalGross || 0), 0);

    // Calculate loyalty points (1 point per 10 AED spent)
    const loyaltyPoints = Math.floor(totalSpent / 10);

    setStats({
      totalBookings,
      activeBookings,
      totalSpent,
      loyaltyPoints,
      completedTours,
      savedTours: 0 // You can implement saved tours functionality later
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CONFIRMED': 'bg-green-100 text-green-700',
      'SUCCESS': 'bg-green-100 text-green-700',
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'AWAITING_PAYMENT': 'bg-blue-100 text-blue-700',
      'CANCELLED': 'bg-red-100 text-red-700',
      'FAILED': 'bg-red-100 text-red-700'
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      'CONFIRMED': 'Confirmed',
      'SUCCESS': 'Completed',
      'PENDING': 'Pending',
      'AWAITING_PAYMENT': 'Awaiting Payment',
      'CANCELLED': 'Cancelled',
      'FAILED': 'Failed'
    };

    return statusLabels[status] || status;
  };

  const getTourImage = (tourDetails) => {
    if (!tourDetails || tourDetails.length === 0) return '🏛️';
    
    const tour = tourDetails[0];
    // You can customize this based on tour types
    if (tour.tourId) {
      return '🏛️';
    }
    return '🎯';
  };

  const getTourName = (booking) => {
    if (booking.tourDetails && booking.tourDetails.length > 0) {
      const tour = booking.tourDetails[0];
      return `Tour #${tour.tourId}`;
    }
    return 'Tour Booking';
  };

  const getTourLocation = (booking) => {
    if (booking.tourDetails && booking.tourDetails.length > 0) {
      const tour = booking.tourDetails[0];
      return tour.pickup || 'Dubai';
    }
    return 'Dubai';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewBookings = () => {
    router.push('/profile/bookings');
  };

  const handleBookNewTour = () => {
    router.push('/');
  };

  const handleViewPayments = () => {
    router.push('/profile/payments');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Error loading dashboard: {error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Sample popular tours (you can replace this with real data from your API)
  const popularTours = [
    { name: 'Burj Khalifa Experience', price: 89, rating: 4.8, image: '🏗️' },
    { name: 'Desert Safari Adventure', price: 120, rating: 4.7, image: '🏜️' },
    { name: 'Dubai Marina Cruise', price: 75, rating: 4.6, image: '🚢' },
    { name: 'Atlantis Aquaventure', price: 95, rating: 4.9, image: '🏊‍♂️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-500/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  Welcome back, {user?.firstName || "Guest"}
                  <Sparkles className="h-8 w-8 ml-2 text-yellow-300" />
                </h1>
                <p className="text-blue-100 text-lg">Ready for your next Dubai adventure? 🏙️</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                    Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-sm text-white/80">Today's Motivation</p>
                  <p className="text-xl font-bold">"Adventure awaits around every corner"</p>
                  <p className="text-sm">Explore Dubai 🌟</p>
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
            <p className="text-2xl font-bold text-gray-800">{stats?.totalBookings || 0}</p>
            <div className="mt-2 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">All time</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Active Bookings</p>
            <p className="text-2xl font-bold text-green-600">{stats?.activeBookings || 0}</p>
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
            <p className="text-2xl font-bold text-purple-600">AED {stats?.totalSpent || 0}</p>
            <div className="mt-2 flex items-center text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm">All bookings</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-xl group-hover:bg-yellow-200 transition-colors">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Loyalty Points</p>
            <p className="text-2xl font-bold text-yellow-600">{stats?.loyaltyPoints || 0}</p>
            <div className="mt-2 flex items-center text-yellow-600">
              <Crown className="h-4 w-4 mr-1" />
              <span className="text-sm">Member</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Completed Tours</p>
            <p className="text-2xl font-bold text-indigo-600">{stats?.completedTours || 0}</p>
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
            <p className="text-2xl font-bold text-red-600">{stats?.savedTours || 0}</p>
            <div className="mt-2 flex items-center text-red-600">
              <Eye className="h-4 w-4 mr-1" />
              <span className="text-sm">Wishlist</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Recent Bookings */}
<div className="xl:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
  {/* Header */}
  <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
      Recent Bookings
    </h2>
    <button
      onClick={handleViewBookings}
      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
    >
      View All <ArrowRight className="h-4 w-4 ml-1" />
    </button>
  </div>

  {/* Body */}
  <div className="p-4 sm:p-6 space-y-4">
    {recentBookings.length === 0 ? (
      <div className="text-center py-8 px-2">
        <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
          No bookings yet
        </h3>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          Start your adventure by booking your first tour!
        </p>
        <button
          onClick={handleBookNewTour}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
        >
          Book Your First Tour
        </button>
      </div>
    ) : (
      recentBookings.map((booking) => (
        <div
          key={booking._id}
          className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer"
          onClick={() => router.push(`/my-bookings`)}
        >
          {/* Left section */}
          <div className="flex items-start md:items-center space-x-3 sm:space-x-4 mb-3 md:mb-0">
            <div className="text-2xl sm:text-3xl flex-shrink-0">
              {getTourImage(booking.tourDetails)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                {getTourName(booking)}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(booking.createdAt)}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(booking.createdAt)}
                </span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {getTourLocation(booking)}
                </span>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium text-center ${getStatusBadge(
                booking.status
              )}`}
            >
              {getStatusLabel(booking.status)}
            </span>
            <span className="font-bold text-gray-800 text-base sm:text-lg text-right">
              {booking.currency} {booking.totalGross}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
</div>


          {/* Popular Tours */}
          {/* <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Popular Tours</h2>
              <p className="text-sm text-gray-500 mt-1">Trending experiences</p>
            </div>
            <div className="p-6 space-y-4">
              {popularTours.map((tour, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                  onClick={handleBookNewTour}
                >
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
                    <p className="font-bold text-gray-800">AED {tour.price}</p>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleBookNewTour}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group"
            >
              <Calendar className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold">Book New Tour</h3>
              <p className="text-xs text-blue-100 mt-1">Discover amazing experiences</p>
            </button>
            
            <button 
              onClick={handleViewBookings}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 group"
            >
              <Eye className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold">View Bookings</h3>
              <p className="text-xs text-green-100 mt-1">Manage your tours</p>
            </button>
            
            <button 
              onClick={handleViewPayments}
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 group"
            >
              <CreditCard className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold">Payment History</h3>
              <p className="text-xs text-purple-100 mt-1">Track your expenses</p>
            </button>
            
            {/* <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 group">
              <Gift className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold">Redeem Points</h3>
              <p className="text-xs text-orange-100 mt-1">Use your loyalty points</p>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
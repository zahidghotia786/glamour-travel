import React, { useState } from "react";
import {
  Menu,
  Bell,
  User,
  ChevronDown,
  Sparkles,
  LogOut,
  Crown,
  Gift,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation"; 

const DashboardHeader = ({ setSidebarOpen, user }) => {
  const [notificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const router = useRouter();

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

    // 👇 Home navigation
  const goHome = () => {
    router.push("/");
    setShowProfile(false);
  };

  // 👇 Logout function
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/"); // homepage par bhejna
  };

  return (
    <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-500/20"></div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Mobile menu and Brand */}
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 rounded-2xl text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-lg">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-xl">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                  Dubai Tours
                </h1>
                <p className="text-white/80 text-sm font-medium">
                  Premium Experience
                </p>
              </div>
            </div>
          </div>

          {/* Center - Dynamic greeting with time */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center space-x-2 text-white/90">
                <Crown className="h-5 w-5 text-yellow-300" />
                <span className="text-lg font-semibold">
                  Good{" "}
                  {new Date().getHours() < 12
                    ? "Morning"
                    : new Date().getHours() < 18
                    ? "Afternoon"
                    : "Evening"}
                  !
                </span>
              </div>
              <p className="text-white/70 text-sm mt-1">
                Ready for your next adventure?
              </p>
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-2xl transition-all duration-300 group"
              >
                <Bell className="h-6 w-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg ring-4 ring-white/30">
                    {notificationCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                  {/* Notification Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      Notifications
                    </h3>
                  </div>

                  {/* Notification Items */}
                  <div className="max-h-64 overflow-y-auto">
                    {/* Example Notification */}
                    <div className="p-4 hover:bg-blue-50 border-b border-gray-100 cursor-pointer transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-xl">
                          <Gift className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            🎉 Booking Confirmed!
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Your Desert Safari adventure is ready
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
                    <button className="w-full text-center text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-white drop-shadow">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <div className="flex items-center justify-end space-x-1">
                    <Crown className="h-3 w-3 text-yellow-300" />
                    <span className="text-xs text-white/80 font-medium">
                      {user?.role || "Member"}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white/30 group-hover:ring-white/50 transition-all duration-300">
                    <span className="text-sm font-bold text-white drop-shadow">
                      {user ? getInitials(user?.firstName) : "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-gradient-to-br from-green-400 to-green-500 border-3 border-white rounded-full shadow-md"></div>
                </div>
                <ChevronDown className="h-4 w-4 text-white/70 hidden sm:block group-hover:text-white transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {showProfile && (
                <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-white">
                          {user ? getInitials(user?.firstName) : "U"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">
                          {user?.firstName + " " + user?.lastName|| "User"}
                        </p>
                        <p className="text-white/80 text-sm">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    {/* Home Button */}
                    <button
                      onClick={goHome}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300"
                    >
                      <Home className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Home</span>
                    </button>

                    <hr className="my-2 border-gray-200" />

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

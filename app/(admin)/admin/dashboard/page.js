"use client";
import { useState, useEffect } from "react";
import {
  Users, ShoppingBag, DollarSign, FileText,
  Globe, Mail, Percent, Network, CreditCard,
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Zap,
  UserCheck, Package, ShoppingCart, BarChart3, Eye,
  Settings, Calendar, UserCog, CreditCardIcon
} from "lucide-react";
import { adminApi } from "@/lib/api";
import Loader from "@/components/common/Loader";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getSummary();
        setSummaryData(data);
        
        // Transform data for KPI cards
        const transformedStats = [
          { 
            id: 1, 
            name: "Total Bookings", 
            value: data.totals.bookings.toString(), 
            change: "+12.5%", 
            trend: "up", 
            icon: FileText 
          },
          { 
            id: 2, 
            name: "Total Revenue", 
            value: `AED ${data.totals.revenue.toLocaleString()}`, 
            change: "+8.2%", 
            trend: "up", 
            icon: DollarSign 
          },
          { 
            id: 3, 
            name: "Active Products", 
            value: data.totals.activeProducts.toString(), 
            change: "+3.1%", 
            trend: "up", 
            icon: ShoppingBag 
          },
          { 
            id: 4, 
            name: "B2B Accounts", 
            value: data.totals.b2b.toString(), 
            change: "+5.7%", 
            trend: "up", 
            icon: Users 
          },
          { 
            id: 5, 
            name: "Total Users", 
            value: data.totals.users.toString(), 
            change: "+4.3%", 
            trend: "up", 
            icon: UserCheck 
          },
          { 
            id: 6, 
            name: "Today's Revenue", 
            value: `AED ${data.totals.todayRevenue.toLocaleString()}`, 
            change: "+8.2%", 
            trend: "up", 
            icon: CreditCardIcon 
          },
          { 
            id: 7, 
            name: "Active Users", 
            value: data.totals.activeUsers.toString(), 
            change: "+2.8%", 
            trend: "up", 
            icon: UserCog 
          },
          { 
            id: 8, 
            name: "Today's Bookings", 
            value: data.totals.todayBookings.toString(), 
            change: "+5.3%", 
            trend: "up", 
            icon: Calendar 
          }
        ];
        
        setStats(transformedStats);
        setRecentBookings(data.latestBookings || []);
        setTopProducts(data.topProducts || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const badge = (status) => {
    if (!status) return "bg-gray-100 text-gray-700 shadow-sm";
    
    return status === "CONFIRMED"
      ? "bg-emerald-100 text-emerald-700 shadow-sm"
      : status === "PENDING"
      ? "bg-amber-100 text-amber-700 shadow-sm"
      : status === "CANCELLED"
      ? "bg-rose-100 text-rose-700 shadow-sm"
      : "bg-gray-100 text-gray-700 shadow-sm";
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const formatCurrency = (amount) => {
    return `AED ${amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {stats.slice(0, 8).map((item, index) => (
          <div 
            key={item.id}
            className="group relative p-6 rounded-3xl bg-white shadow-lg hover:shadow-2xl border border-gray-100/50 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{item.name}</p>
                <p className="mt-2 text-2xl font-bold text-slate-800">{item.value}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                <item.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Additional Stats Row */}
      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Customers</p>
                <p className="text-2xl font-bold">{summaryData.totals.customers}</p>
              </div>
              <Users className="w-8 h-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total Admins</p>
                <p className="text-2xl font-bold">{summaryData.totals.admins}</p>
              </div>
              <UserCheck className="w-8 h-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Confirmed Bookings</p>
                <p className="text-2xl font-bold">{summaryData.totals.confirmedBookings}</p>
              </div>
              <ShoppingCart className="w-8 h-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Pending Bookings</p>
                <p className="text-2xl font-bold">{summaryData.totals.pendingBookings}</p>
              </div>
              <FileText className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {summaryData?.performanceMetrics && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100/50">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <p className="text-sm text-blue-600 font-semibold">Conversion Rate</p>
              <p className="text-2xl font-bold text-slate-800">{summaryData.performanceMetrics.conversionRate}%</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <p className="text-sm text-green-600 font-semibold">Avg Order Value</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(summaryData.performanceMetrics.averageOrderValue)}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-2xl">
              <p className="text-sm text-orange-600 font-semibold">User Engagement</p>
              <p className="text-2xl font-bold text-slate-800">{summaryData.performanceMetrics.userEngagementRate}%</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <p className="text-sm text-purple-600 font-semibold">Product Utilization</p>
              <p className="text-2xl font-bold text-slate-800">{summaryData.performanceMetrics.productUtilizationRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {[
            { label: "Add Product", href: "/admin/products", icon: Package },
            { label: "B2B Users", href: "/admin/b2b", icon: Users },
            { label: "Settings", href: "/admin/settings", icon: Settings },
            { label: "Bookings", href: "/admin/bookings", icon: FileText },
          ].map((action, index) => (
            <a
              key={action.href}
              href={action.href}
              className="group flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-sm font-medium"
            >
              <action.icon className="w-4 h-4 group-hover:animate-pulse" />
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent Bookings & Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
                <p className="text-sm text-gray-600">Latest customer activities</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                  {["Reference", "Customer", "Amount", "Status", "Time", "Actions"].map((header) => (
                    <th key={header} className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200"
                    >
                      <td className="p-4 font-mono text-sm font-semibold text-blue-600">
                        {booking.reference || 'N/A'}
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-slate-800">{booking.customer || 'Guest'}</p>
                          <p className="text-xs text-gray-500">{booking.email || 'No email'}</p>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-green-600">
                        {formatCurrency(booking.total)}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(booking.status)}`}>
                          {booking.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {formatTimeAgo(booking.createdAt)}
                      </td>
                      <td className="p-4">
                        <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No recent bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Top Products & System Status */}
        <div className="space-y-8">
          {/* Top Products */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100/50 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Top Performing Products</h3>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.totalQuantity} units sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{product.bookings} bookings</p>
                      <p className="text-xs text-green-600">{formatCurrency(product.totalRevenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No product data available</p>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100/50 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Database</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email Service</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-xs text-gray-500">
                  {summaryData?.timestamp ? formatTimeAgo(summaryData.timestamp) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
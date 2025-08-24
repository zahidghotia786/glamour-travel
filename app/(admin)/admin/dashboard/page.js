"use client";
import {
  Users, ShoppingBag, DollarSign, FileText,
  Globe, Mail, Percent, Network, CreditCard,
  TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Zap
} from "lucide-react";

export default function AdminDashboard() {
  // KPI cards with trends
  const stats = [
    { id: 1, name: "Total Bookings", value: "245", change: "+12.5%", trend: "up", icon: FileText },
    { id: 2, name: "Total Revenue", value: "AED 54,320", change: "+8.2%", trend: "up", icon: DollarSign },
    { id: 3, name: "Active Products", value: "32", change: "+3.1%", trend: "up", icon: ShoppingBag },
    { id: 4, name: "B2B Accounts", value: "18", change: "-2.3%", trend: "down", icon: Users },
  ];

  const ops = [
    { id: "A", name: "API Success", value: "98.7%", status: "excellent", icon: Network },
    { id: "B", name: "Refund Rate", value: "1.4%", status: "good", icon: Percent },
    { id: "C", name: "Avg API Latency", value: "420ms", status: "fair", icon: Globe },
    { id: "D", name: "Gateway Status", value: "Online", status: "excellent", icon: CreditCard },
  ];

  const bookings = [
    { id: "B001", user: "John Doe", product: "Dubai Safari Park", amount: "AED 250", status: "Confirmed", time: "2 min ago" },
    { id: "B002", user: "Olga Ivanova", product: "Ferrari World", amount: "AED 500", status: "Pending", time: "5 min ago" },
    { id: "B003", user: "Ahmed Ali", product: "IMG Worlds", amount: "AED 350", status: "Cancelled", time: "12 min ago" },
    { id: "B004", user: "Saeed Khan", product: "Burj Khalifa 124+125", amount: "AED 199", status: "Confirmed", time: "18 min ago" },
    { id: "B005", user: "Maria Garcia", product: "Global Village", amount: "AED 75", status: "Confirmed", time: "25 min ago" },
  ];

  const badge = (s) =>
    s === "Confirmed"
      ? "bg-emerald-100 text-emerald-700 shadow-sm"
      : s === "Pending"
      ? "bg-amber-100 text-amber-700 shadow-sm"
      : "bg-rose-100 text-rose-700 shadow-sm";

  const statusColor = (status) => {
    switch(status) {
      case "excellent": return "bg-emerald-500";
      case "good": return "bg-blue-500";
      case "fair": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div 
            key={item.id}
            className="group relative p-6 rounded-3xl bg-white shadow-lg hover:shadow-2xl border border-gray-100/50 transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{item.name}</p>
                <p className="mt-2 text-3xl font-bold text-slate-800">{item.value}</p>
                <div className={`mt-2 flex items-center gap-1 text-sm ${
                  item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {item.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="font-semibold">{item.change}</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                <item.icon className="w-7 h-7 text-white" />
              </div>
            </div>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-colors duration-300" />
          </div>
        ))}
      </div>

      {/* Operational Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {ops.map((o, index) => (
          <div 
            key={o.id} 
            className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-blue-100 group-hover:to-purple-100 transition-colors duration-300">
                <o.icon className="w-6 h-6 text-blue-600" />
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${statusColor(o.status)} animate-pulse`} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{o.name}</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{o.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

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
            { label: "Add Product", href: "/admin/products" },
            { label: "Update Markup", href: "/admin/markup" },
            { label: "Refresh Cache", href: "/admin/tickets-api" },
            { label: "Edit Templates", href: "/admin/emails" },
            { label: "Translations", href: "/admin/translations" },
          ].map((action, index) => (
            <a
              key={action.href}
              href={action.href}
              className="group flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-sm font-medium"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Activity className="w-4 h-4 group-hover:animate-pulse" />
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100/50 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
                <p className="text-sm text-gray-600">Latest customer activities</p>
              </div>
            </div>
            <div className="flex gap-3">
              <select className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
              <input 
                placeholder="Search booking/user…" 
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-48 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-scroll w-[370px] sm:w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-purple-50">
                {["Booking ID", "User", "Product", "Amount", "Status", "Time"].map((header) => (
                  <th key={header} className="p-4 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, index) => (
                <tr 
                  key={b.id} 
                  className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <td className="p-4 font-mono text-sm font-semibold text-blue-600">{b.id}</td>
                  <td className="p-4 font-medium text-slate-800">{b.user}</td>
                  <td className="p-4 text-slate-600">{b.product}</td>
                  <td className="p-4 font-bold text-green-600">{b.amount}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gateway & Email Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Payment Gateway</h3>
              <p className="text-sm text-gray-600">Financial operations</p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Provider:</span>
              <span className="font-semibold text-slate-800">UAE Gateway</span>
            </li>
            <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Currencies:</span>
              <span className="font-semibold text-slate-800">AED, USD, EUR</span>
            </li>
            <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-600">Online</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Email System</h3>
              <p className="text-sm text-gray-600">Communication hub</p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Provider:</span>
              <span className="font-semibold text-slate-800">SMTP Service</span>
            </li>
            <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Templates:</span>
              <span className="font-semibold text-slate-800">3 Active</span>
            </li>
            <li className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Last Send:</span>
              <span className="font-semibold text-blue-600">2 mins ago</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-8"></div>
    </div>
  );
}
"use client";
import { useState } from "react";
import {
  Menu, X, Users, ShoppingBag, FileText, Settings,
  Globe, Mail, ShieldCheck, Percent, Hotel, Network, BarChart3
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
<aside
  className={`fixed z-50 inset-y-0 left-0 w-72 max-w-[85%] sm:max-w-xs h-screen bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-transform duration-300 ease-out
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
  {/* Top section */}
  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100/80">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
        <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div>
        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Glamour Adventures</p>
        <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin
        </h2>
      </div>
    </div>

    {/* Close button */}
    <button
      onClick={() => setSidebarOpen(false)}
      className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
    >
      <X size={20} />
    </button>
  </div>

  {/* Navigation */}
  <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 text-sm overflow-y-auto h-[calc(100%-80px)]">
    {/* 👆 yahan height fix ki, 100% se upar ka header minus kar diya */}
    {[
      { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
      { href: "/admin/bookings", icon: FileText, label: "Bookings" },
      { href: "/admin/products", icon: ShoppingBag, label: "Products" },
      { href: "/admin/b2b", icon: Users, label: "B2B Users & Roles" },
      { href: "/admin/markup", icon: Percent, label: "Markup Rules" },
      { href: "/admin/tickets-api", icon: Network, label: "Tickets API" },
      { href: "/admin/hotels", icon: Hotel, label: "Hotels (later)", disabled: true },
      { href: "/admin/emails", icon: Mail, label: "Email Templates" },
      { href: "/admin/translations", icon: Globe, label: "Translations" },
      { href: "/admin/settings", icon: Settings, label: "Settings" },
    ].map((item, index) => {
      const isActive = pathname === item.href;

      return (
        <a
          key={item.href}
          href={item.href}
          className={`group flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] ${
            isActive
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : item.disabled
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <item.icon
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${
              isActive ? "text-white" : "text-blue-500"
            }`}
          />
          <span className="font-medium text-xs sm:text-sm">{item.label}</span>
          {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />}
        </a>
      );
    })}
  </nav>
</aside>


      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors transform hover:scale-105"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-white/80 text-sm">Real-time business overview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1 bg-white/15 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
              <span className="opacity-90">EN</span>
              <span className="opacity-60">/</span>
              <span className="opacity-90">AR</span>
              <span className="opacity-60">/</span>
              <span className="opacity-90">RU</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                A
              </div>
              <span className="text-sm font-medium"><span className="hidden sm:block">Welcome ,</span> Admin</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

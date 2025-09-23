"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  Calendar,
  CreditCard,
  User,
  MessageSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Overview", href: "/profile", icon: Home, gradient: "from-blue-500 to-blue-600" },
  { name: "My Bookings", href: "/profile/bookings", icon: Calendar, gradient: "from-green-500 to-green-600" },
  { name: "Payments", href: "/profile/payments", icon: CreditCard, gradient: "from-purple-500 to-purple-600" },
  { name: "Profile Settings", href: "/profile/settings", icon: User, gradient: "from-orange-500 to-orange-600" },
  { name: "Complaints", href: "/profile/complaints", icon: MessageSquare, gradient: "from-red-500 to-red-600" },
];

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Navigation */}
        <nav className="mt-8 px-6">
          <div className="space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    w-full flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 group relative overflow-hidden
                    ${isActive
                      ? "bg-gradient-to-r text-white shadow-lg transform scale-105 " + item.gradient
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md"}
                  `}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                  )}

                  <div className="relative z-10 flex items-center w-full">
                    <div
                      className={`
                        p-2 rounded-lg mr-4 transition-all duration-300
                        ${isActive
                          ? "bg-white/20 backdrop-blur-sm"
                          : "bg-gray-100 group-hover:bg-gray-200"}
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 transition-all duration-300 ${
                          isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>

                  {isActive && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-white rounded-l-full"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default DashboardSidebar;

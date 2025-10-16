"use client";
import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Users,
  ShoppingBag,
  FileText,
  Settings,
  ShieldCheck,
  Hotel,
  Network,
  BarChart3,
  Home,
  ChevronDown,
  LogOut,
  List,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { userApi } from "@/lib/api";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const data = await userApi.getAdminProfile();
        setAdminData(data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    router.push("/login");
    setUserDropdownOpen(false);
  };

  const navigateToHome = () => {
    router.push("/");
    setUserDropdownOpen(false);
  };

  const navigateToSettings = () => {
    router.push("/admin/settings");
    setUserDropdownOpen(false);
  };

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
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                Glamour Adventures
              </p>
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
          {[
            { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
            { href: "/admin/bookings", icon: FileText, label: "Bookings" },
            { href: "/admin/category", icon: List, label: "Add Categories" },
            { href: "/admin/products", icon: ShoppingBag, label: "Custom Products" },
            { href: "/admin/b2b", icon: Users, label: "B2B Users & Admins" },
            { href: "/admin/b2c", icon: Users, label: "B2C Users" },
            { href: "/admin/api-product", icon: Network, label: "API Products" },
            {
              href: "/admin/hotels",
              icon: Hotel,
              label: "Hotels (later)",
              disabled: true,
            },
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
                <span className="font-medium text-xs sm:text-sm">
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
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
              <p className="text-white/80 text-sm">
                Real-time business overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Home Button */}
            <button
              onClick={navigateToHome}
              className="hidden sm:flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition-colors"
              title="Go to Homepage"
            >
              <Home size={18} />
              <span className="text-sm">Home</span>
            </button>


            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                  {adminData
                    ? `${adminData.firstName?.[0]}${adminData.lastName?.[0]}`
                    : "A"}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-sm font-medium block">
                    {adminData
                      ? `${adminData.firstName} ${adminData.lastName}`
                      : "Admin User"}
                  </span>
                  <span className="text-xs opacity-80 block">
                    {adminData?.metadata?.position || "Administrator"}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {adminData
                        ? `${adminData.firstName} ${adminData.lastName}`
                        : "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {adminData?.email || "admin@example.com"}
                    </p>
                  </div>

                  <button
                    onClick={navigateToHome}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Home size={16} />
                    <span>Go to Homepage</span>
                  </button>

                  <button
                    onClick={navigateToSettings}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </main>
      </div>
    </div>
  );
}
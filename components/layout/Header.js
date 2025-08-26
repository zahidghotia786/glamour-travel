"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, User, LogOut, Settings, BarChart3, 
  Globe, ChevronDown, Sparkles, Home, Ticket, 
  Calendar, Shield, Building2
} from "lucide-react";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Tickets", icon: Ticket },
    { href: "/booking", label: "Bookings", icon: Calendar },
  ];

  const languages = [
    { code: "en", label: "EN", flag: "🇺🇸" },
    { code: "ar", label: "AR", flag: "🇦🇪" },
    { code: "ru", label: "RU", flag: "🇷🇺" },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto fetch from localStorage every 2 sec
  useEffect(() => {
    const interval = setInterval(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setMenuOpen(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "B2B") return "/b2b/dashboard";
    return "/"; // Customer → homepage
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case "ADMIN": return Shield;
      case "B2B": return Building2;
      default: return User;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case "ADMIN": return "bg-gradient-to-r from-red-500 to-pink-500";
      case "B2B": return "bg-gradient-to-r from-purple-500 to-indigo-500";
      default: return "bg-gradient-to-r from-blue-500 to-cyan-500";
    }
  };

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
          : "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 shadow-lg"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto relative">
        <div className="flex justify-between items-center py-4 px-6">
          {/* Logo Section */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image 
                  src="/images/logo.png" 
                  alt="Logo" 
                  className="bg-white/80 backdrop-blur-sm h-12 w-auto rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                  height={800}
                  width={800}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-bold ${scrolled ? 'text-gray-100' : 'text-white'}`}>
                  Glamour Adventures
                </h1>
                <p className={`text-xs ${scrolled ? 'text-gray-200' : 'text-white/80'}`}>
                  Premium Travel Experience
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navLinks.map((link, index) => {
              const IconComponent = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`group flex items-center gap-2 px-3 xl:px-4 py-2 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? scrolled
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-white/20 backdrop-blur-sm text-white shadow-lg"
                        : scrolled
                        ? "text-white hover:text-white hover:bg-white/10"
                        : "text-white hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 group-hover:animate-pulse" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            {/* Language Selector */}
            <div className="relative group">
              <button className={`flex items-center text-white gap-2 px-3 xl:px-4 py-2 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                scrolled 
                  ? "border-blue-200 hover:border-blue-500 hover:bg-blue-500/20" 
                  : "border-white/30 hover:border-white hover:bg-white/10"
              } `}>
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">🇺🇸 EN</span>
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              {/* Language Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    <span className="text-lg">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Section */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-3 px-3 xl:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-2xl transition-all duration-300 ${
                    scrolled 
                      ? " text-white hover:from-blue-100 hover:to-purple-100" 
                      : " text-white hover:bg-white/30"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getRoleBadgeColor(user.role)}`}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className={`text-xs ${scrolled ? 'text-white/70' : 'text-white/70'}`}>
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                      >
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold ${getRoleBadgeColor(user.role)}`}>
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleBadgeColor(user.role)}`}>
                                {(() => {
                                  const RoleIcon = getRoleIcon(user.role);
                                  return <RoleIcon className="w-3 h-3" />;
                                })()}
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          <Link
                            href={getDashboardLink()}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-2xl transition-all duration-200"
                          >
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                          <button
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-2xl transition-all duration-200"
                          >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                          </button>
                          <div className="h-px bg-gray-200 mx-4 my-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-all duration-200"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold px-4 xl:px-6 py-3 rounded-2xl hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:block">Login / Register</span>
                  <span className="sm:hidden">Login</span>
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Mobile Navigation (Language Switcher added here) */}
          <div className="flex items-center lg:hidden">
            {/* Language Selector for Mobile (in navbar) */}
            <div className="relative mr-3">
              <button 
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className={`flex items-center justify-center p-2 rounded-2xl border-2 transition-all duration-300 ${
                  scrolled 
                    ? "border-blue-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50" 
                    : "border-white/30 text-white hover:border-white hover:bg-white/10"
                }`}
              >
                <Globe className="w-5 h-5 text-white" />
              </button>
              
              {/* Language Dropdown for Mobile */}
              <AnimatePresence>
                {languageDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setLanguageDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 first:rounded-t-2xl last:rounded-b-2xl"
                          onClick={() => setLanguageDropdownOpen(false)}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          {lang.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-2xl transition-all duration-300 ${
                scrolled 
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200" 
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-2xl z-40 lg:hidden overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {navLinks.map((link, idx) => {
                    const IconComponent = link.icon;
                    const isActive = pathname === link.href;
                    
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                              : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* User Section for Mobile */}
                  {user ? (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-4 border-t border-gray-200 space-y-3"
                    >
                      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold ${getRoleBadgeColor(user.role)}`}>
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.role}</p>
                        </div>
                      </div>
                      
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 rounded-2xl transition-all duration-200"
                      >
                        <BarChart3 className="w-5 h-5" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-4 border-t border-gray-200"
                    >
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold px-6 py-3 rounded-2xl hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        Login / Register
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
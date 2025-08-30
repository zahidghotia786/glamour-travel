"use client";
import Link from "next/link";
import { 
  Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, 
  Youtube, Linkedin, Send, Star, Shield, CreditCard, 
  Clock, Users, Award, Plane, Building, Gift, 
  FileText, HelpCircle, MessageSquare, Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home", icon: Building },
    { href: "/search", label: "Browse Tickets", icon: Plane },
    { href: "/booking", label: "My Bookings", icon: FileText },
    { href: "/deals", label: "Special Deals", icon: Gift },
    { href: "/about", label: "About Us", icon: Users },
    { href: "/contact", label: "Contact", icon: MessageSquare },
  ];

  const destinations = [
    { name: "Dubai Safari Park", href: "/tickets/dubai-safari" },
    { name: "Ferrari World", href: "/tickets/ferrari-world" },
    { name: "IMG Worlds", href: "/tickets/img-worlds" },
    { name: "Burj Khalifa", href: "/tickets/burj-khalifa" },
    { name: "Global Village", href: "/tickets/global-village" },
    { name: "Atlantis Aquaventure", href: "/tickets/atlantis" },
  ];

  const businessLinks = [
    { href: "/b2b/register", label: "B2B Partnership" },
    { href: "/affiliate", label: "Affiliate Program" },
    { href: "/corporate", label: "Corporate Bookings" },
    { href: "/travel-agents", label: "Travel Agents" },
    { href: "/api-docs", label: "API Documentation" },
    { href: "/wholesale", label: "Wholesale Rates" },
  ];

  const supportLinks = [
    { href: "/help", label: "Help Center", icon: HelpCircle },
    { href: "/faq", label: "FAQ", icon: MessageSquare },
    { href: "/cancellation", label: "Cancellation Policy", icon: Shield },
    { href: "/booking-help", label: "Booking Support", icon: Users },
    { href: "/payment-help", label: "Payment Issues", icon: CreditCard },
    { href: "/refunds", label: "Refunds", icon: Award },
  ];

  const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/accessibility", label: "Accessibility" },
    { href: "/data-protection", label: "Data Protection" },
  ];

  const socialLinks = [
    { href: "https://facebook.com", icon: Facebook, label: "Facebook", color: "hover:text-blue-500" },
    { href: "https://twitter.com", icon: Twitter, label: "Twitter", color: "hover:text-sky-400" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram", color: "hover:text-pink-500" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube", color: "hover:text-red-500" },
    { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn", color: "hover:text-blue-600" },
  ];

  const features = [
    { icon: Shield, text: "100% Secure Booking" },
    { icon: CreditCard, text: "Multiple Payment Options" },
    { icon: Clock, text: "24/7 Customer Support" },
    { icon: Award, text: "Best Price Guarantee" },
  ];

  const stats = [
    { number: "500K+", label: "Happy Customers", icon: Users },
    { number: "1000+", label: "Destinations", icon: MapPin },
    { number: "50+", label: "Countries", icon: Globe },
    { number: "4.9", label: "Average Rating", icon: Star },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 text-gray-200 overflow-hidden">
      {/* Background Pattern */}
<div className="absolute inset-0 opacity-5">
  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"/>
</div>


      {/* Stats Section */}
      <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="flex items-center justify-center mb-2">
                    <IconComponent className="w-6 h-6 text-amber-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {stat.number}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Glamour Adventures</h3>
                <p className="text-sm text-gray-400">Premium Travel Experience</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Discover the {"world's"} most amazing destinations with our premium travel experiences. 
              We offer exclusive tickets, tours, and adventures across the globe.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <span>+971 50 123 4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <span>glamourtours.ae</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-400" />
                </div>
                <span>Dubai, UAE</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                    >
                      <IconComponent className="w-4 h-4 text-blue-400 group-hover:text-amber-400" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Popular Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Plane className="w-5 h-5 text-amber-400" />
              Popular Destinations
            </h4>
            <ul className="space-y-3">
              {destinations.map((destination) => (
                <li key={destination.href}>
                  <Link
                    href={destination.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                  >
                    {destination.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Business & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Business & Support
            </h4>
            <ul className="space-y-3">
              {businessLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {supportLinks.slice(0, 3).map((link) => {
                const IconComponent = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 group"
                    >
                      <IconComponent className="w-4 h-4 text-blue-400 group-hover:text-amber-400" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  <IconComponent className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-200">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl p-8 mb-8 backdrop-blur-sm border border-white/10"
        >
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-white mb-2">Stay Updated</h4>
            <p className="text-gray-300">Get the latest deals and travel inspiration delivered to your inbox</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold rounded-2xl hover:from-amber-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
<div className="relative border-t border-gray-700 bg-black/20 backdrop-blur-sm">
  <div className="container mx-auto px-6 py-6">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-center md:text-left">
        <p className="text-sm text-gray-400">
          © {currentYear} Glamour Adventures Tours. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Licensed Travel Agency | Dubai Tourism Licensed
        </p>
<p className="text-xs text-gray-500 mt-1">
  Developed by{" "}
  <a
    href="https://zahidghotia.vercel.app/" 
    target="_blank"
    rel="noopener noreferrer"
    className="text-white font-semibold hover:underline"
  >
    ZG.dev
  </a>
</p>

      </div>

      {/* Social Media */}
      <div className="flex items-center gap-4">
        {socialLinks.map((social) => {
          const IconComponent = social.icon;
          return (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:bg-white/20 backdrop-blur-sm`}
              aria-label={social.label}
            >
              <IconComponent className="w-5 h-5" />
            </a>
          );
        })}
      </div>

      {/* Legal Links */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        {legalLinks.slice(0, 3).map((link, index) => (
          <span key={link.href} className="flex items-center gap-4">
            <Link
              href={link.href}
              className="text-gray-400 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </Link>
            {index < 2 && <span className="text-gray-600">•</span>}
          </span>
        ))}
      </div>
    </div>
  </div>
</div>

    </footer>
  );
}
"use client";
import { motion } from "framer-motion";
import { Users, MapPin, Globe, Star } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { number: "500K+", label: "Happy Customers", icon: Users },
    { number: "150+", label: "Attractions", icon: MapPin },
    { number: "50+", label: "Destinations", icon: Globe },
    { number: "4.9", label: "Average Rating", icon: Star },
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Dubai Tourism License Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-18 border-t border-b border-gray-200"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Side - Logo and Text */}
            <div className="flex items-center gap-4">
              {/* Dubai Tourism Logo Placeholder */}
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">DTCM</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Official License</h3>
                <p className="text-sm text-gray-600">Department of Tourism & Commerce Marketing</p>
              </div>
            </div>
            
            {/* Middle - License Number */}
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                License Number
              </div>
              <div className="text-2xl font-bold text-gray-800 font-mono bg-gray-100 px-4 py-2 rounded-lg">
                #1277921
              </div>
            </div>
            
            {/* Right Side - Verification Badge */}
            <div className="flex items-center gap-3 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-semibold text-green-700">Verified Operator</span>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}
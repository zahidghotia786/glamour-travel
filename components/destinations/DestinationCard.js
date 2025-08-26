"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, Heart, ArrowRight, Star } from "lucide-react";
import Image from "next/image";

export default function DestinationCard({ destination, index }) {
  // 🎨 Category-based color schemes
  const categoryColors = {
"theme-parks": {
  text: "text-purple-600/80",
  hover: "group-hover:text-purple-700/80",
  badge: "bg-purple-100 text-purple-700/80",
  button: "from-purple-500/80 to-fuchsia-600/80 hover:from-purple-600/80 hover:to-fuchsia-700",
  cardBg: "bg-purple-50",
  icon: "text-purple-500",
  rating: "text-purple-500",
},

    landmarks: {
      text: "text-indigo-600",
      hover: "group-hover:text-indigo-700",
      badge: "bg-indigo-100 text-indigo-700",
      button:
        "from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700",
      cardBg: "bg-indigo-50",
      icon: "text-indigo-500",
      rating: "text-indigo-500",
    },
    "water-parks": {
      text: "text-sky-600",
      hover: "group-hover:text-sky-700",
      badge: "bg-sky-100 text-sky-700",
      button:
        "from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700",
      cardBg: "bg-sky-50",
      icon: "text-sky-500",
      rating: "text-sky-500",
    },
wildlife: {
  text: "text-teal-700",
  hover: "group-hover:text-teal-800",
  badge: "bg-teal-100 text-teal-700",
  button: "from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700",
  cardBg: "bg-teal-50",
  icon: "text-teal-500",
  rating: "text-teal-500",
},

    cultural: {
      text: "text-amber-700",
      hover: "group-hover:text-amber-800",
      badge: "bg-amber-100 text-amber-700",
      button:
        "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      cardBg: "bg-amber-50",
      icon: "text-amber-500",
      rating: "text-amber-500",
    },
  };

  // Pick colors for current category
  const colors =
    categoryColors[destination.category] || categoryColors["theme-parks"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group ${colors.cardBg}`}
    >
      {/* Image & top labels */}
      <div className="relative">
        <Image
          src={destination.image}
          alt={destination.name}
          width={800}
          height={800}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {destination.discount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {destination.discount}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Heart
            className={`w-5 h-5 ${colors.icon} hover:text-red-500 transition-colors cursor-pointer`}
          />
        </div>
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          <Clock className="w-4 h-4 inline mr-1" />
          {destination.duration}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3
              className={`text-xl font-bold mb-1 transition-colors ${colors.text} ${colors.hover}`}
            >
              {destination.name}
            </h3>
            <div
              className={`flex items-center text-sm ${colors.icon}`}
            >
              <MapPin className="w-4 h-4 mr-1" />
              {destination.location}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${colors.text}`}>
              {destination.price}
            </div>
            {destination.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                {destination.originalPrice}
              </div>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(destination.rating)
                  ? `${colors.rating} fill-current`
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            {destination.rating} ({destination.reviews.toLocaleString()} reviews)
          </span>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {destination.highlights.map((highlight, i) => (
            <span
              key={i}
              className={`px-3 py-1 rounded-full text-xs font-medium ${colors.badge}`}
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full text-white font-semibold py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r ${colors.button}`}
        >
          Book Now
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

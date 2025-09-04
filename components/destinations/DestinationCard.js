"use client";
import { motion } from "framer-motion";
import { MapPin, Clock, Heart, ArrowRight, Star, DollarSign } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function DestinationCard({ destination, index }) {
  // Router for navigation
  const router = useRouter();
  // 🎨 Category-based color schemes
  const categoryColors = {
    "Tour": {
      text: "text-blue-600",
      hover: "group-hover:text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      button: "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      cardBg: "bg-blue-50",
      icon: "text-blue-500",
      rating: "text-blue-500",
    },
    "Travel": {
      text: "text-green-600",
      hover: "group-hover:text-green-700",
      badge: "bg-green-100 text-green-700",
      button: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      cardBg: "bg-green-50",
      icon: "text-green-500",
      rating: "text-green-500",
    },
    "Water Activities": {
      text: "text-sky-600",
      hover: "group-hover:text-sky-700",
      badge: "bg-sky-100 text-sky-700",
      button: "from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700",
      cardBg: "bg-sky-50",
      icon: "text-sky-500",
      rating: "text-sky-500",
    },
    "Theme Parks": {
      text: "text-purple-600",
      hover: "group-hover:text-purple-700",
      badge: "bg-purple-100 text-purple-700",
      button: "from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700",
      cardBg: "bg-purple-50",
      icon: "text-purple-500",
      rating: "text-purple-500",
    },
    "Activities": {
      text: "text-orange-600",
      hover: "group-hover:text-orange-700",
      badge: "bg-orange-100 text-orange-700",
      button: "from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700",
      cardBg: "bg-orange-50",
      icon: "text-orange-500",
      rating: "text-orange-500",
    },
    "Landmarks": {
      text: "text-indigo-600",
      hover: "group-hover:text-indigo-700",
      badge: "bg-indigo-100 text-indigo-700",
      button: "from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700",
      cardBg: "bg-indigo-50",
      icon: "text-indigo-500",
      rating: "text-indigo-500",
    },
    "Cultural": {
      text: "text-amber-600",
      hover: "group-hover:text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      button: "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",
      cardBg: "bg-amber-50",
      icon: "text-amber-500",
      rating: "text-amber-500",
    }
  };

  // Get category name from product data
  const categoryName = destination.category?.name || "Activities";
  
  // Pick colors for current category
  const colors = categoryColors[categoryName] || categoryColors["Activities"];

  // Default values for missing data
  const imageUrl = destination.images?.[0]?.url || "/default-destination.jpg";
  const shortDescription = destination.shortDesc || "Experience this amazing destination";
  const rating = destination.rating || 4.5;
  const reviews = destination.reviews || 0;
  const price = destination.basePrice || 0;
  const currency = destination.baseCurrency || "AED";

  // Generate some sample highlights based on category
  const generateHighlights = (category) => {
    const highlightsMap = {
      "Tour": ["Guided Tour", "Local Expert", "Transport Included"],
      "Travel": ["All Inclusive", "Luxury Experience", "Flexible Dates"],
      "Water Activities": ["Safety Equipment", "Professional Guide", "Photos Included"],
      "Theme Parks": ["Fast Track", "All Rides Included", "Family Friendly"],
      "Activities": ["Beginner Friendly", "Equipment Provided", "Small Groups"],
      "Landmarks": ["Historical Site", "Photo Opportunities", "Cultural Experience"],
      "Cultural": ["Local Culture", "Traditional Experience", "Authentic"]
    };
    return highlightsMap[category] || ["Popular", "Best Value", "Highly Rated"];
  };

  const highlights = generateHighlights(categoryName);

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
          src={imageUrl}
          alt={destination.name}
          width={800}
          height={800}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Discount badge (optional - you can add this to your product data later) */}
        {destination.discount && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {destination.discount}
          </div>
        )}
        
        {/* Favorite button */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Heart
            className={`w-5 h-5 ${colors.icon} hover:text-red-500 transition-colors cursor-pointer`}
          />
        </div>
        
        {/* Duration (optional - you can add this to your product data) */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          <Clock className="w-4 h-4 inline mr-1" />
          {destination.duration || "4-6 hours"}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3
              className={`text-xl font-bold mb-1 transition-colors ${colors.text} ${colors.hover}`}
            >
              {destination.name}
            </h3>
            <div className={`flex items-center text-sm ${colors.icon}`}>
              <MapPin className="w-4 h-4 mr-1" />
              {destination.category?.name || "Destination"}
            </div>
          </div>
          <div className="text-right ml-4">
            <div className={`text-2xl font-bold ${colors.text} flex items-center gap-1`}>
              <DollarSign className="w-4 h-4" />
              {price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 uppercase">
              {currency}
            </div>
            {destination.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                {destination.originalPrice}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {shortDescription}
        </p>

        {/* Ratings */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? `${colors.rating} fill-current`
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            {rating} ({reviews.toLocaleString()} reviews)
          </span>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {highlights.map((highlight, i) => (
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
        onClick={() => router.push(`/booking/${destination.id}`)}
       >
          Book Now
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}
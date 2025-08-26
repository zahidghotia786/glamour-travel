"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Heart,
  Globe,
  Gift,
  Plane,
  Camera,
} from "lucide-react";
import DestinationCard from "@/components/destinations/DestinationCard";

export default function FeaturedDestinations() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Update categories to match your destination data
  const categories = [
    { id: "all", label: "All Attractions", icon: Globe, count: 150 },
    { id: "theme-parks", label: "Theme Parks", icon: Gift, count: 45 },
    { id: "landmarks", label: "Landmarks", icon: MapPin, count: 28 },
    { id: "water-parks", label: "Water Parks", icon: Plane, count: 12 },
    { id: "wildlife", label: "Wildlife", icon: Heart, count: 18 },
    { id: "cultural", label: "Cultural", icon: Camera, count: 35 },
  ];

  const featuredDestinations = [
    {
      id: 1,
      name: "Ferrari World Abu Dhabi",
      location: "Abu Dhabi, UAE",
      image:
        "https://static.myconnect.ae/-/media/yasconnect/project/b2b/yas-island/tab-listing/yicardimage970x545.png",
      rating: 4.8,
      reviews: 12847,
      price: "AED 285",
      originalPrice: "AED 320",
      discount: "11% OFF",
      category: "theme-parks",
      highlights: [
        "World&apos;s Fastest Roller Coaster",
        "Formula Rossa",
        "Family Friendly",
      ],
      duration: "Full Day",
    },
    {
      id: 2,
      name: "Burj Khalifa At The Top",
      location: "Dubai, UAE",
      image:
        "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrFmJSvYhr5sg6C9u_7WssghOaPGqv8-Du5G7_2NFdxK29XpT4sA0lMgLImdtl8E7HjmRyedMAu2IUy-9KX_AFRSxuvEi-FdBaqWe1WZp8S83qdEcjT0x5ioAfiKvlseDYlzP5F=w289-h312-n-k-no",
      rating: 4.9,
      reviews: 25639,
      price: "AED 149",
      originalPrice: "AED 180",
      discount: "17% OFF",
      category: "landmarks",
      highlights: ["124th & 125th Floor", "Sunset Views", "Skip the Line"],
      duration: "2-3 Hours",
    },
    {
      id: 3,
      name: "Dubai Safari Park",
      location: "Dubai, UAE",
      image:
        "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nq0lE8CZAWuupAgpgN78jQ3IatvqT3NKo3J4W2yEz2p23UUJaQqS1lEJB2Sj__aF3NwoSyntMQWFhBkJDQ2FkADtRN90yhM19nUVpgHyFLBPBxIOIWqjmXMjddGmfmyEoAZg83V=w270-h312-n-k-no",
      rating: 4.7,
      reviews: 8932,
      price: "AED 85",
      originalPrice: "AED 100",
      discount: "15% OFF",
      category: "wildlife",
      highlights: [
        "4 Different Villages",
        "Over 3000 Animals",
        "Educational Tours",
      ],
      duration: "4-6 Hours",
    },
    {
      id: 4,
      name: "IMG Worlds of Adventure",
      location: "Dubai, UAE",
      image:
        "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqzbLw_EdNRGNKZBrj3afxNPeWScLhPF1KYUjVNbEtkJPB3__pSlszBrLO3F2f-DlSB5igF8Kmqf6mVYBYZwY1uwI8zJFG5XKZaFBo76WRWm-fV5TZOlo4JkacOyIpp5fs5wmeP=w135-h156-n-k-no",
      rating: 4.6,
      reviews: 15478,
      price: "AED 275",
      originalPrice: "AED 315",
      discount: "13% OFF",
      category: "theme-parks",
      highlights: [
        "World&apos;s Largest Indoor Park",
        "Marvel Zone",
        "Cartoon Network Zone",
      ],
      duration: "Full Day",
    },
    {
      id: 5,
      name: "Atlantis Aquaventure",
      location: "Dubai, UAE",
      image:
        "https://assets.kerzner.com/api/public/content/e53428bc97cf4084a45601bc510c769b?v=0798ded8&t=w2880",
      rating: 4.8,
      reviews: 19265,
      price: "AED 315",
      originalPrice: "AED 360",
      discount: "12% OFF",
      category: "water-parks",
      highlights: ["Water Slides", "Private Beach Access", "Aquarium Visit"],
      duration: "Full Day",
    },
    {
      id: 6,
      name: "Global Village",
      location: "Dubai, UAE",
      image:
        "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_862/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/vkn935ewtrt2dqu88xhy/GlobalVillageTicketinDubai.jpg",
      rating: 4.5,
      reviews: 11023,
      price: "AED 25",
      originalPrice: "AED 30",
      discount: "17% OFF",
      category: "cultural",
      highlights: ["Cultural Pavilions", "Shopping", "Street Food"],
      duration: "3-5 Hours",
    },
  ];

  // Update sections to match your destination categories
  const sections = {
    "theme-parks": {
      title: "Theme Parks",
      bg: "bg-gradient-to-r from-purple-50 to-purple-100",
    },
    "landmarks": {
      title: "Landmarks",
      bg: "bg-gradient-to-r from-blue-50 to-blue-100",
    },
    "water-parks": {
      title: "Water Parks",
      bg: "bg-gradient-to-r from-sky-50 to-sky-100",
    },
    "wildlife": {
      title: "Wildlife",
      bg: "bg-gradient-to-r from-green-50 to-green-100",
    },
    "cultural": {
      title: "Cultural",
      bg: "bg-gradient-to-r from-amber-50 to-orange-100",
    },
  };

  const filteredDestinations =
    selectedCategory === "all"
      ? featuredDestinations
      : featuredDestinations.filter((dest) => dest.category === selectedCategory);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most popular attractions with exclusive deals and instant booking
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto whitespace-nowrap space-x-4 pb-3 mb-12 no-scrollbar justify-center">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.label}
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Render Sections */}
        {selectedCategory === "all" ? (
          // Show all sections one by one
          Object.entries(sections).map(([key, section]) => {
            const filtered = featuredDestinations.filter(
              (dest) => dest.category === key
            );
            
            // Only show section if there are items
            if (filtered.length === 0) return null;
            
            return (
              <section key={key} className={`${section.bg} py-16 mb-12 rounded-3xl`}>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                  {section.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map((destination, index) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          // Show only the selected category section
          <section
            className={`${sections[selectedCategory]?.bg || "bg-gray-50"} py-16 rounded-3xl`}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              {sections[selectedCategory]?.title || selectedCategory}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
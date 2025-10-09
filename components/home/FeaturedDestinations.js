"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { fetchFromAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TicketsPage() {
  const [groupedTours, setGroupedTours] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFromAPI("Tour/dubai/tours/public");
        if (data?.result?.length) {
          // Group tours by cityTourType
          const grouped = data.result.reduce((acc, tour) => {
            const type = tour.cityTourType || "Other Experiences";
            if (!acc[type]) acc[type] = [];
            acc[type].push(tour);
            return acc;
          }, {});
          setGroupedTours(grouped);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

// 🖼️ 20 high-quality Dubai travel placeholders
const placeholderImages = [
  "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=800",
  "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800",
  "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
  "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
  "https://images.unsplash.com/photo-1558449028-b52d2f7f0d9f?w=800",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
  "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800",
  "https://images.unsplash.com/photo-1549887534-3db1bd59dcca?w=800",
  "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=800",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
  "https://images.unsplash.com/photo-1559589689-577aabd1e7f3?w=800",
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800",
];

// 🔁 Automatically repeat if data exceeds image count
const getPlaceholder = (idx) =>
  placeholderImages[idx % placeholderImages.length];


  const viewProductDetails = (tourId, contractId) => {
    router.push(`/booking/${tourId}?contractId=${contractId}`);
  };



  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 lg:px-20 py-8">
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="w-full h-40 bg-gray-300"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-3"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        Object.entries(groupedTours).map(([category, tours], sectionIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: sectionIdx * 0.2 }}
            className="mb-10"
          >
            {/* ===== Section Header ===== */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {category === "City Tours"
                  ? "Top Experiences in Dubai"
                  : category}
              </h2>
              <button className="text-blue-600 text-sm font-semibold hover:underline">
                See all
              </button>
            </div>

            {/* ===== Tours Cards ===== */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tours.map((tour, idx) => (
                <motion.div
                  key={tour.tourId}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={getPlaceholder(idx)}
                      alt={tour.tourName}
                      className="w-full h-40 object-cover"
                    />

                    {tour.recommended && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Recommended
                      </div>
                    )}
                    {/* Rating Badge */}
                    {tour.rating > 0 && (
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                        {tour.rating} ★
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                      {tour.tourName}
                    </h3>

                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <MapPin size={12} className="mr-1" />
                      {tour.cityName}, {tour.countryName}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {tour.duration || "Flexible"}
                      </div>
                      <span className="text-gray-500">
                        {tour.reviewCount || 0} reviews
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-blue-600">
                          AED {tour.price || "120"}
                        </p>
                      </div>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                           onClick={() => viewProductDetails(tour.tourId, tour.contractId)}

                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

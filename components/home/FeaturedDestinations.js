"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { fetchFromAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function TicketsPage() {
  const [groupedTours, setGroupedTours] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const sectionRefs = useRef({});
  const router = useRouter();

  // ✅ Fetch Data & Group by cityTourType
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchFromAPI("tourtickets/public/dubai-tours");
        if (res?.data?.length) {
          const tours = res.data;

          // ✅ Top Experiences (Top 6 tours by rating & reviews)
          const topExperiences = [...tours]
            .sort((a, b) => {
              const ratingA = a.rating ?? 0;
              const ratingB = b.rating ?? 0;
              const reviewsA = a.reviewCount ?? 0;
              const reviewsB = b.reviewCount ?? 0;

              // Score formula: rating weighted + reviews
              const scoreA = ratingA * 100 + reviewsA;
              const scoreB = ratingB * 100 + reviewsB;

              return scoreB - scoreA; // ✅ highest score first
            })
            .slice(0, 6);

          // ✅ Top Things to Do (next 6 after top experiences)
          const topThingsToDo = [...tours]
            .sort((a, b) => {
              const ratingA = a.rating ?? 0;
              const ratingB = b.rating ?? 0;
              const reviewsA = a.reviewCount ?? 0;
              const reviewsB = b.reviewCount ?? 0;

              const scoreA = ratingA * 100 + reviewsA;
              const scoreB = ratingB * 100 + reviewsB;

              return scoreB - scoreA;
            })
            .slice(6, 12);

          // ✅ Group by cityTourType dynamically
          const groupedByType = tours.reduce((acc, tour) => {
            const type =
              tour.cityTourType?.trim() ||
              tour.rawJson?.cityTourType?.trim() ||
              "Other Experiences";
            if (!acc[type]) acc[type] = [];
            acc[type].push(tour);
            return acc;
          }, {});

          // ✅ Combine Top + Grouped categories
          const finalData = {
            "Top Experiences": topExperiences,
            "Top Things to Do in Dubai": topThingsToDo,
            ...groupedByType,
          };

          setGroupedTours(finalData);
          setActiveCategory(Object.keys(finalData)[0]);
        }
      } catch (err) {
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Dynamic section title
  const getSectionTitle = (category) => {
    if (category === "Top Experiences") return "Top Experiences in Dubai";
    if (category === "Top Things to Do in Dubai")
      return "Top Things to Do in Dubai";
    return `${category} in Dubai`;
  };

  // Scroll behavior
  const scrollToSection = (category) => {
    const section = sectionRefs.current[category];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveCategory(category);
    }
  };

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const positions = Object.entries(sectionRefs.current).map(
        ([category, ref]) => {
          const rect = ref.getBoundingClientRect();
          return { category, offset: Math.abs(rect.top) };
        }
      );
      const active = positions.sort((a, b) => a.offset - b.offset)[0];
      if (active && active.category !== activeCategory) {
        setActiveCategory(active.category);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory]);

const viewProductDetails = (tourId, contractId, cityId, countryId) => {
  router.push(
    `/booking/${tourId}?contractId=${contractId}&cityId=${cityId}&countryId=${countryId}`
  );
};


  // ✅ Placeholder images
  const placeholderImages = [
    "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?w=800",
    "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800",
    "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    "https://images.unsplash.com/photo-1576085898323-218337e3e43c?w=800",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  ];
  const getPlaceholder = (i) => placeholderImages[i % placeholderImages.length];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ===== Sticky Tabs ===== */}
      {!loading && (
        <div className="sticky top-[80px] z-30 bg-white shadow-sm border-b border-gray-200 overflow-x-auto no-scrollbar">
          <div className="flex space-x-4 px-4 py-3">
            {Object.keys(groupedTours)
              .slice(2) // 👈 First 2 categories skip kar di
              .map((category) => (
                <button
                  key={category}
                  onClick={() => scrollToSection(category)}
                  className={`text-sm font-semibold whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 ${
                    activeCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category} {/* 👈 Direct category name, no "in Dubai" */}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* ===== Sections ===== */}
      <div className="px-4 md:px-10 lg:px-20 py-8">
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
          Object.entries(groupedTours).map(([category, tours], idx) => (
            <motion.div
              key={category}
              ref={(el) => (sectionRefs.current[category] = el)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="mb-12 scroll-mt-24"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {getSectionTitle(category)}
                </h2>
              </div>

              <div className="flex md:grid gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-2">
                {tours.map((tour, i) => (
                  <motion.div
                    key={tour.rawJson.tourId}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="bg-white min-w-[250px] sm:min-w-0 snap-start rounded-xl shadow-sm hover:shadow-md overflow-hidden border border-gray-200 cursor-pointer transition-all duration-200"
                  >
                    <div className="relative">
                      <img
                        src={getPlaceholder(i)}
                        alt={tour.tourName}
                        className="w-full h-40 object-cover"
                      />
                      {tour.rawJson.rating > 0 && (
                        <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                          {tour.rawJson.rating} ★
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">
                        {tour.rawJson.tourName}
                      </h3>

                      <div className="flex items-center text-gray-500 text-xs mb-2">
                        <MapPin size={12} className="mr-1" />
                        {tour.rawJson.cityName}, {tour.rawJson.countryName}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {tour.rawJson.duration || "Flexible"}
                        </div>
                        <span className="text-gray-500">
                          {tour.rawJson.reviewCount || 0} reviews
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-base font-bold text-blue-600">
                          AED{" "}
                          {tour.priceByAdmin !== undefined
                            ? tour.priceByAdmin
                            : tour.originalPrice}
                        </p>
                        <button
                          onClick={() =>
                            viewProductDetails(tour.rawJson.tourId, tour.rawJson.contractId, tour.rawJson.cityId, tour.rawJson.countryId )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
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
    </div>
  );
}

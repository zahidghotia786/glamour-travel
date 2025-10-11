"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X, Star } from "lucide-react";
import { Inter } from "next/font/google";
import MapLocation from "./MapLocation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function Highlights({ product }) {
  const sections = [
    { title: "Highlights", key: "highlights" },
    { title: "Inclusions", key: "inclusions" },
    { title: "Cancellation Policy", key: "cancellation" },
    { title: "Reviews", key: "reviews" },
    { title: "Your Experience", key: "experience" },
    { title: "Know Before You Go", key: "know" },
    { title: "My Tickets", key: "tickets" },
    { title: "Where?", key: "where" },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].key);
  const sectionRefs = useRef({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize refs for each section
  sections.forEach((sec) => {
    if (!sectionRefs.current[sec.key]) {
      sectionRefs.current[sec.key] = React.createRef();
    }
  });

  // Observe scroll to update active nav
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -50% 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll to section
  const handleScroll = (key) => {
    const ref = sectionRefs.current[key];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Fake reviews array — replace with product.reviews if available
  const reviews = product?.tourReview || [
    {
      reviewId: 1,
      guestName: "Ali Khan",
      rating: 5,
      reviewContent: "Amazing experience! The guide was very professional.",
      visitMonth: "September 2025",
    },
    {
      reviewId: 2,
      guestName: "Sana Ahmed",
      rating: 4,
      reviewContent: "Good tour, but pick-up was a bit delayed.",
      visitMonth: "August 2025",
    },
    {
      reviewId: 3,
      guestName: "John Doe",
      rating: 5,
      reviewContent: "Fantastic views and well organized tour. Highly recommended!",
      visitMonth: "July 2025",
    },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={`${inter.variable} font-sans relative`}>
      {/* Sticky Nav */}
      <div className="sticky top-34 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex overflow-x-auto no-scrollbar gap-4 px-4 py-3 text-sm font-medium">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => handleScroll(sec.key)}
              className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                activeSection === sec.key
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-blue-600"
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-16">
        {/* Highlights */}
        <section id="highlights" ref={sectionRefs.current.highlights} className="scroll-mt-28">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Highlights</h2>
          <p className="text-gray-600">{product?.tourDescription || "Discover the best of Dubai."}</p>
        </section>

        {/* Inclusions */}
        <section id="inclusions" ref={sectionRefs.current.inclusions} className="scroll-mt-28">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Inclusions</h2>
          <div
            className="prose prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product?.tourInclusion || "" }}
          />
        </section>

        {/* Cancellation Policy */}
        <section id="cancellation" ref={sectionRefs.current.cancellation} className="scroll-mt-28">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Cancellation Policy</h2>
          <div
            className="prose prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product?.cancellationPolicyDescription || "" }}
          />
        </section>

        {/* Reviews */}
        <section id="reviews" ref={sectionRefs.current.reviews} className="scroll-mt-28">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-900">Reviews</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              See all
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="min-w-[250px] max-w-xs border border-blue-100 rounded-2xl p-4 bg-gradient-to-br from-white to-blue-50/40 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {getInitials(review.guestName)}
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">{review.guestName}</p>
                    <div className="flex gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < Number(review.rating) ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-4">{review.reviewContent}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Your Experience */}
        <section id="experience" ref={sectionRefs.current.experience} className="scroll-mt-28">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Your Experience</h2>
          <div
            className="prose prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product?.itenararyDescription || "" }}
          />
        </section>

        {/* Know Before You Go */}
        <section id="know" ref={sectionRefs.current.know} className="scroll-mt-28">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">Know Before You Go</h2>
          <div
            className="prose prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product?.usefulInformation || "" }}
          />
        </section>

        {/* My Tickets */}
        <section id="tickets" ref={sectionRefs.current.tickets} className="scroll-mt-28">
          <h2 className="text-2xl font-bold mb-4 text-blue-900">My Tickets</h2>
          <div
            className="prose prose-sm sm:prose max-w-none"
            dangerouslySetInnerHTML={{ __html: product?.howToRedeem || "" }}
          />
        </section>

{/* Where */}
<section id="where" ref={sectionRefs.current.where} className="scroll-mt-28">
  <h2 className="text-2xl font-bold mb-4 text-blue-900">Where?</h2>
  <MapLocation
    latitude={product?.latitude}
    longitude={product?.longitude}
    googleMapUrl={product?.googleMapUrl}
  />
</section>

      </div>

      {/* Reviews Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-hidden bg-blue-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg sm:max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border-2 border-blue-100">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-white">
              <h4 className="font-bold text-lg sm:text-xl text-blue-900">
                All Reviews ({reviews.length})
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-blue-600" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
              {reviews.map((review, idx) => (
                <div
                  key={`modal-${review.reviewId || idx}`}
                  className="border-2 border-blue-200 rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                      {getInitials(review.guestName)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm text-blue-900">{review.guestName}</p>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < Number(review.rating) ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-blue-500 font-medium">
                        {review.visitMonth || "Verified booking"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {review.reviewContent}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

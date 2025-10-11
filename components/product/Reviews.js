"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Reviews({ product }) {
  const reviews = product?.tourReview || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewsPerSlide, setReviewsPerSlide] = useState(2);

  // Adjust reviews per slide based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setReviewsPerSlide(1); // Mobile
      } else {
        setReviewsPerSlide(2); // Tablet & Desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);

  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  const getCurrentReviews = () => {
    const startIndex = currentSlide * reviewsPerSlide;
    return reviews.slice(startIndex, startIndex + reviewsPerSlide);
  };

  const getReviewKey = (review, index) =>
    `review-${review.reviewId || index}-${currentSlide}`;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl shadow-xl border border-blue-100 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-blue-100 w-fit">
          <div className="text-xs text-blue-600 font-medium">Duration</div>
          <div className="font-bold text-blue-900">4 hr</div>
        </div>
        {reviews.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg w-full sm:w-auto text-center"
          >
            Show all {reviews.length.toLocaleString()} reviews
          </button>
        )}
      </div>

      {/* Average rating */}
      <div className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-bold gap-2 px-4 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-lg w-fit">
        <span className="text-2xl">★</span>
        <span>{product?.averageRating || "4.8"}/5</span>
        <span className="text-blue-100 text-sm font-medium">
          ({reviews.length.toLocaleString()} reviews)
        </span>
      </div>

      {/* Reviews Carousel */}
      {reviews.length > 0 ? (
        <div className="relative">
          <div
            className="flex flex-col sm:flex-row gap-4 transition-all duration-300 ease-in-out cursor-pointer"
            onClick={nextSlide}
          >
            {getCurrentReviews().map((review, index) => (
              <div
                key={getReviewKey(review, index)}
                className="border-2 border-blue-200 rounded-2xl p-4 sm:p-5 bg-white hover:shadow-xl transition-all duration-300 flex-1 min-w-0 hover:border-blue-400"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg">
                    {getInitials(review.guestName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-blue-900 truncate">
                      {review.guestName}
                    </p>
                    <p className="text-xs text-blue-500 font-medium">
                      {review.visitMonth || "Verified booking"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`star-${getReviewKey(review, index)}-${i}`}
                      size={16}
                      fill={i < Number(review.rating) ? "currentColor" : "none"}
                      color={i < Number(review.rating) ? "currentColor" : "#dbeafe"}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">
                  {review.reviewContent}
                </p>
              </div>
            ))}
            {getCurrentReviews().length === 1 && (
              <div className="hidden sm:flex flex-1" />
            )}
          </div>

          {/* Navigation */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg p-1.5 sm:p-2 hover:from-blue-700 hover:to-blue-600 transition-all z-10 border-2 border-white"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-lg p-1.5 sm:p-2 hover:from-blue-700 hover:to-blue-600 transition-all z-10 border-2 border-white"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex justify-center mt-3 sm:mt-4 space-x-2">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <button
                    key={`indicator-${idx}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentSlide(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide ? "w-6 sm:w-8 bg-blue-600" : "w-2 bg-blue-200"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No reviews yet.</p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg sm:max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border-2 border-blue-100">
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
                  key={`modal-${review.reviewId || idx}-${Date.now()}`}
                  className="border-2 border-blue-200 rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                      {getInitials(review.guestName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-sm text-blue-900">
                          {review.guestName}
                        </p>
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={`modal-star-${review.reviewId || idx}-${i}`}
                              size={14}
                              fill={i < Number(review.rating) ? "currentColor" : "none"}
                              color={i < Number(review.rating) ? "currentColor" : "#dbeafe"}
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

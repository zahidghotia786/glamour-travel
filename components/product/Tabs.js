"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronDown, ChevronUp, Clock, Mail, MapPin, Phone, Shield, Sparkles, Star, User, X } from "lucide-react";


export default function Tabs({ product, renderStars }) {
  const [activeTab, setActiveTab] = useState("overview");
    const [showAllReviews, setShowAllReviews] = useState(false);
  
  const parseHtml = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 mb-12"
      >
        {/* Tab Navigation */}
        <div className="border-b border-gray-200/50">
          <nav className="flex flex-wrap space-x-2 sm:space-x-8 px-4 sm:px-8">
            {[
              { id: "overview", label: "Overview", icon: Sparkles },
              { id: "itinerary", label: "Itinerary", icon: Clock },
              { id: "inclusion", label: "Inclusions", icon: CheckCircle },
              { id: "reviews", label: "Reviews", icon: Star },
              { id: "location", label: "Location", icon: MapPin },
              { id: "policies", label: "Policies", icon: Shield },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 sm:px-8 mt-2 shadow-lg rounded border-b-2 font-medium text-sm flex items-center gap-2 transition-all bg-transparent focus:outline-none ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Experience Overview
                </h3>
                <div
                  className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={parseHtml(product.tourDescription)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      What's Included
                    </h4>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={parseHtml(product.tourInclusion)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                      What's Not Included
                    </h4>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={parseHtml(product.tourExclusion)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Important Information
                  </h4>
                  <div
                    className="prose prose-sm max-w-none bg-yellow-50 p-4 rounded-xl"
                    dangerouslySetInnerHTML={parseHtml(
                      product.importantInformation
                    )}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === "itinerary" && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Tour Itinerary
                </h3>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={parseHtml(
                    product.itenararyDescription
                  )}
                />
              </motion.div>
            )}

            {activeTab === "inclusion" && (
              <motion.div
                key="inclusion"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Inclusions & Exclusions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      What's Included
                    </h4>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={parseHtml(product.tourInclusion)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500" />
                      What's Not Included
                    </h4>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={parseHtml(product.tourExclusion)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Customer Reviews
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold text-gray-900">
                    {product.rating}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating)}
                    </div>
                    <p className="text-gray-600">
                      Based on {product.reviewCount} reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {product.tourReview
                    .slice(0, showAllReviews ? product.tourReview.length : 5)
                    .map((review, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-200 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {review.guestName}
                              </h4>
                              <div className="flex items-center gap-1">
                                {renderStars(parseInt(review.rating))}
                              </div>
                            </div>
                            <h5 className="font-medium text-gray-800 mb-1">
                              {review.reviewTitle}
                            </h5>
                            <p className="text-gray-700">
                              {review.reviewContent}
                            </p>
                            {review.visitMonth && (
                              <p className="text-sm text-gray-500 mt-2">
                                Visited in {review.visitMonth}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {product.tourReview.length > 5 && (
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
                  >
                    {showAllReviews ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Show Less Reviews
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show All {product.reviewCount} Reviews
                      </>
                    )}
                  </button>
                )}

                <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Can't find what you're looking for?
                  </h4>
                  <p className="text-gray-700 mb-4">
                    If you have questions about this tour, feel free to contact
                    us.
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Call Us
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Us
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "location" && (
              <motion.div
                key="location"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Tour Location
                </h3>

                <div className="bg-gray-100 rounded-xl p-4 h-96">
                  <iframe
                    src={product.googleMapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      Departure Point
                    </h4>
                    <p className="text-gray-700">{product.departurePoint}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      Reporting Time
                    </h4>
                    <p className="text-gray-700">{product.reportingTime}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "policies" && (
              <motion.div
                key="policies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  Policies & Information
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Cancellation Policy
                    </h4>
                    <div
                      className="prose prose-sm max-w-none bg-red-50 p-4 rounded-xl"
                      dangerouslySetInnerHTML={parseHtml(
                        product.cancellationPolicyDescription
                      )}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Child Policy
                    </h4>
                    <div
                      className="prose prose-sm max-w-none bg-blue-50 p-4 rounded-xl"
                      dangerouslySetInnerHTML={parseHtml(
                        product.childCancellationPolicyDescription
                      )}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Terms & Conditions
                    </h4>
                    <div
                      className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-xl"
                      dangerouslySetInnerHTML={parseHtml(
                        product.termsAndConditions
                      )}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      How to Redeem
                    </h4>
                    <div
                      className="prose prose-sm max-w-none bg-green-50 p-4 rounded-xl"
                      dangerouslySetInnerHTML={parseHtml(product.howToRedeem)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

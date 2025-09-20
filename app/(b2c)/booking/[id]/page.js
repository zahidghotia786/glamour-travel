"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Shield,
  CreditCard,
  Globe,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Crown,
  Camera,
  Navigation,
  Wifi,
  Utensils,
  Car,
  ChevronLeft,
  ChevronRight,
  X,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { productsApi } from "@/lib/api";

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [quantity, setQuantity] = useState({ adult: 1, child: 0, infant: 0 });
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingStep, setBookingStep] = useState(1);
  const [showAllReviews, setShowAllReviews] = useState(false);
  console.log(price);

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        const productData = await productsApi.getProductById(
          params.id,
          contractId
        );
        setProduct(productData.result.result[0]);
        setPrice(productData.result.price || 0);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, contractId]);

  const handleBooking = () => {
    if (bookingStep === 1) {
      setBookingStep(2);
    } else {
      // Handle booking confirmation
      router.push(`/booking/confirmation/${Date.now()}`);
    }
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.tourName,
          text: product.tourDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % (product.tourImages?.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.tourImages?.length - 1 || 0 : prev - 1
    );
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const parseHtml = (htmlString) => {
    return { __html: htmlString };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentImage =
    product.tourImages?.[currentImageIndex]?.imagePath || product.imagePath;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-[80px] w-full z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={shareProduct}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="pt-16"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src={currentImage}
                alt={product.tourName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Navigation Arrows */}
              {product.tourImages?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {product.tourImages?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {product.tourImages.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.tourImages?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.tourImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 rounded-xl overflow-hidden transition-all ${
                      index === currentImageIndex
                        ? "ring-2 ring-blue-500 ring-offset-2 transform scale-105"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image.imagePath}
                      alt={`${product.tourName} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-medium">
                {product.cityTourType}
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                {product.tourName}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 flex-wrap">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>
                    {product.cityName}, {product.countryName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span>{product.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span>Starts at {product.startTime}</span>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm flex-wrap">
              <div className="flex items-center gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">
                {product.rating} ⭐ ({product.reviewCount} reviews)
              </span>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <p className="text-gray-700">
                price from{" "}
                {price?.discount > 0 ? (
                  <>
                    <span className="font-bold text-lg text-gray-900">
                      AED {(price.amount - price.discount).toFixed(2)}
                    </span>{" "}
                    <span className="line-through text-gray-500 ml-2">
                      AED {price.amount.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-lg text-gray-900">
                    AED {price?.amount?.toFixed(2)}
                  </span>
                )}{" "}
                per adult
              </p>
            </div>

            {/* Description */}
            <div className="p-4 bg-white rounded-2xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Tour Description
              </h3>
              <div
                className="text-gray-700 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.tourDescription }}
              />
            </div>

            {/* Quick Booking Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                Reserve Your Spot
              </h3>

              <AnimatePresence mode="wait">
                {bookingStep === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          📅 Select Date
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ⏰ Select Time
                        </label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">Choose time</option>
                          {product?.startTime && (
                            <option value={product.startTime}>
                              {product.startTime}
                            </option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        👥 Number of Guests
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Adults</p>
                            <p className="text-sm text-gray-500">Age 11+</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setQuantity({
                                  ...quantity,
                                  adult: Math.max(1, quantity.adult - 1),
                                })
                              }
                              className="p-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 border-2 border-gray-200 rounded-xl min-w-[40px] text-center font-semibold">
                              {quantity.adult}
                            </span>
                            <button
                              onClick={() =>
                                setQuantity({
                                  ...quantity,
                                  adult: quantity.adult + 1,
                                })
                              }
                              className="p-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Children</p>
                            <p className="text-sm text-gray-500">
                              {product.childAge}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setQuantity({
                                  ...quantity,
                                  child: Math.max(0, quantity.child - 1),
                                })
                              }
                              className="p-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 border-2 border-gray-200 rounded-xl min-w-[40px] text-center font-semibold">
                              {quantity.child}
                            </span>
                            <button
                              onClick={() =>
                                setQuantity({
                                  ...quantity,
                                  child: quantity.child + 1,
                                })
                              }
                              className="p-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Infants</p>
                            <p className="text-sm text-gray-500">
                              {product.infantAge}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setQuantity({
                                  ...quantity,
                                  infant: Math.max(0, quantity.infant - 1),
                                })
                              }
                              className="p-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              -
                            </button>
                            <span className="px-4 py-2 border-2 border-gray-200 rounded-xl min-w-[40px] text-center font-semibold">
                              {quantity.infant}
                            </span>
                            <button
                              onClick={() =>
                                setQuantity({
                                  ...quantity,
                                  infant: quantity.infant + 1,
                                })
                              }
                              className="p-2 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBooking}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                      Continue to Booking →
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-3">
                        Booking Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p>📅 Date: {selectedDate}</p>
                        <p>⏰ Time: {selectedTime}</p>
                        <p>
                          👥 Guests: {quantity.adult} adult(s), {quantity.child}{" "}
                          child(ren), {quantity.infant} infant(s)
                        </p>
                        <p className="font-semibold text-lg mt-3">
                          💰 Total:{" "}
                          {price?.discount > 0 ? (
                            <>
                              {/* Original amount (cut/strikethrough) */}
                              <span className="text-gray-500 line-through mr-2">
                                AED{" "}
                                {(
                                  quantity.adult * price.amount +
                                  quantity.child * price.amount
                                ).toFixed(2)}
                              </span>

                              {/* Discounted amount */}
                              <span className="text-green-600 font-bold">
                                AED{" "}
                                {(
                                  quantity.adult *
                                    (price.amount - price.discount) +
                                  quantity.child *
                                    (price.amount - price.discount)
                                ).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            // Normal amount if no discount
                            <span className="text-gray-900 font-bold">
                              AED{" "}
                              {(
                                quantity.adult * price.amount +
                                quantity.child * price.amount
                              ).toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Your Information
                      </h4>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email Address *"
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={handleBooking}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-colors"
                      >
                        Confirm Booking ✅
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* Product Details Tabs */}
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
                        dangerouslySetInnerHTML={parseHtml(
                          product.tourInclusion
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        What's Not Included
                      </h4>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={parseHtml(
                          product.tourExclusion
                        )}
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
                        dangerouslySetInnerHTML={parseHtml(
                          product.tourInclusion
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <X className="w-5 h-5 text-red-500" />
                        What's Not Included
                      </h4>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={parseHtml(
                          product.tourExclusion
                        )}
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
                      If you have questions about this tour, feel free to
                      contact us.
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

        {/* Trust & Safety Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Shield,
              title: "Safety First",
              desc: "COVID-19 safety measures",
              color: "text-green-500",
            },
            {
              icon: CreditCard,
              title: "Secure Booking",
              desc: "SSL encrypted payments",
              color: "text-blue-500",
            },
            {
              icon: Phone,
              title: "24/7 Support",
              desc: "Always here to help",
              color: "text-purple-500",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-lg border border-white/20 text-center hover:shadow-xl transition-shadow"
            >
              <item.icon className={`w-12 h-12 ${item.color} mx-auto mb-4`} />
              <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import Image from "next/image";
import { productsApi } from "@/lib/api";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedTime, setSelectedTime] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingStep, setBookingStep] = useState(1);

  const availableTimes = ["09:00", "11:00", "14:00", "16:00", "18:00"];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productsApi.getProductById(params.id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleBooking = () => {
    if (bookingStep === 1) {
      setBookingStep(2);
    } else {
      toast.success("🎉 Booking confirmed successfully!");
      router.push(`/booking/confirmation/${Date.now()}`);
    }
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDesc,
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        console.log("Sharing cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (product.images?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images?.length - 1 || 0 : prev - 1
    );
  };

  if (loading) {
    return <Loader />;
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

  const totalPrice = product.basePrice * quantity;
  const currentImage =
    product.images?.[currentImageIndex]?.url || "/default-image.jpg";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 fixed top-10 w-full z-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Explore</span>
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

      <div className="h-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Navigation Arrows */}
              {product.images?.length > 1 && (
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
              {product.images?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
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
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
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
                {product.category?.name}
              </span>
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span>Dubai, UAE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span>4-6 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-green-500" />
                  <span>Photo Opportunities</span>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">4.8 ⭐ (1,234 reviews)</span>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <span className="text-green-600 font-semibold">
                🔥 500+ Booked Today
              </span>
            </div>

            {/* Price */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {product.baseCurrency} {product.basePrice.toFixed(2)}
                <span className="text-lg font-normal text-gray-600 ml-2">
                  per person
                </span>
              </div>
              <p className="text-green-600 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Free cancellation • Best price guarantee
              </p>
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
                          {availableTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        👥 Number of Guests
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-6 py-3 border-2 border-gray-200 rounded-xl min-w-[60px] text-center font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
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
                        <p>👥 Guests: {quantity} person(s)</p>
                        <p className="font-semibold text-lg mt-3">
                          💰 Total: {product.baseCurrency}{" "}
                          {totalPrice.toFixed(2)}
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
          className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20"
        >
          {/* Tab Navigation */}
          <div className="border-b border-gray-200/50">
            <nav className="flex flex-wrap space-x-2 sm:space-x-8 px-4 sm:px-8">
              {[
                { id: "overview", label: "Overview", icon: Sparkles },
                { id: "highlights", label: "Highlights", icon: Star },
                { id: "itinerary", label: "Itinerary", icon: Clock },
                { id: "reviews", label: "Reviews", icon: Heart },
                { id: "location", label: "Location", icon: MapPin },
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
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.longDesc ||
                      product.shortDesc ||
                      "Discover the magic of Dubai with our exclusive tour experience."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        What's Included
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Professional bilingual guide",
                          "All entrance fees",
                          "Luxury transportation",
                          "Gourmet lunch",
                          "Photo service",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-3 text-gray-700"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                        What to Bring
                      </h4>
                      <ul className="space-y-3">
                        {[
                          "Comfortable walking shoes",
                          "Camera or smartphone",
                          "Sunscreen and hat",
                          "Water bottle",
                          "Valid ID",
                        ].map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-3 text-gray-700"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "highlights" && (
                <motion.div
                  key="highlights"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900">
                    Tour Highlights
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        icon: Crown,
                        title: "Burj Khalifa Access",
                        desc: "Skip-the-line entry to the world's tallest building",
                      },
                      {
                        icon: Camera,
                        title: "Professional Photos",
                        desc: "Stunning photos at iconic locations included",
                      },
                      {
                        icon: Car,
                        title: "Luxury Transport",
                        desc: "Travel in comfort with AC vehicles",
                      },
                      {
                        icon: Utensils,
                        title: "Local Cuisine",
                        desc: "Authentic Emirati lunch experience",
                      },
                      {
                        icon: Wifi,
                        title: "Free WiFi",
                        desc: "Stay connected throughout the tour",
                      },
                      {
                        icon: Navigation,
                        title: "Expert Guide",
                        desc: "Local guide with insider knowledge",
                      },
                    ].map((highlight, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl text-center"
                      >
                        <highlight.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {highlight.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {highlight.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Add other tab contents here... */}
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

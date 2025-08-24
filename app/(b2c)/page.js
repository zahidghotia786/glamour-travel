"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  MapPin,
  Clock,
  Users,
  Shield,
  Plane,
  Calendar,
  Gift,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Globe,
  Zap,
  Heart,
  Camera,
  Sparkles,
  Filter,
  User,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [direction, setDirection] = useState(1);

  const heroSlides = [
    {
      id: 1,
      title: `Experience Dubai&apos;s Wonders`,
      subtitle: "Premium Theme Parks & Adventures",
      description:
        "Discover world-class attractions with exclusive deals and instant bookings",
      image:
        "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/0a/87/4d/a7.jpg",
      cta: "Explore Now",
      gradient: "from-blue-600 via-purple-600 to-cyan-500",
    },
    {
      id: 2,
      title: "Family Adventures",
      subtitle: "Create Magical Memories",
      description:
        "From thrilling rides to cultural experiences - something for everyone",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLscESZ5XN8zaaQRRW7aPu7Qu2JS21xVXJhg&s",
      cta: "Book Today",
      gradient: "from-purple-600 via-pink-600 to-orange-500",
    },
    {
      id: 3,
      title: "Exclusive B2B Solutions",
      subtitle: "Partner With Industry Leaders",
      description:
        "Wholesale rates and premium support for travel professionals",
      image: "/api/placeholder/1200/600",
      cta: "Join Now",
      gradient: "from-emerald-600 via-teal-600 to-blue-500",
    },
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

  const categories = [
    { id: "all", label: "All Attractions", icon: Globe, count: 150 },
    { id: "theme-parks", label: "Theme Parks", icon: Gift, count: 45 },
    { id: "landmarks", label: "Landmarks", icon: MapPin, count: 28 },
    { id: "water-parks", label: "Water Parks", icon: Plane, count: 12 },
    { id: "wildlife", label: "Wildlife", icon: Heart, count: 18 },
    { id: "cultural", label: "Cultural", icon: Camera, count: 35 },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      country: "United Kingdom",
      rating: 5,
      comment:
        "Absolutely fantastic experience! The booking process was seamless and the customer service was exceptional. Our family had an amazing time at Ferrari World.",
      image:
        "https://images.openai.com/thumbnails/url/4Af_bXicu1mSUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw5OTIws9k0qMo7PNTcK8Ap2LPE09vUsTzJ3NjY1jC8MCQt38g0wNzJyjTBw9CurjHcPcfVy9sipSArPK1crBgDzFijH",
      verified: true,
    },
    {
      id: 2,
      name: "Ahmed Al Rashid",
      country: "Saudi Arabia",
      rating: 5,
      comment:
        "As a travel agent, I have been using their B2B platform for months. The wholesale rates are competitive and the support team is always responsive.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      verified: true,
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      country: "Spain",
      rating: 5,
      comment:
        "Best prices guaranteed! I compared with other platforms and Glamour Adventures offered the best deals. Highly recommended for Dubai attractions.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      verified: true,
    },
  ];

  const stats = [
    { number: "500K+", label: "Happy Customers", icon: Users },
    { number: "150+", label: "Attractions", icon: MapPin },
    { number: "50+", label: "Destinations", icon: Globe },
    { number: "4.9", label: "Average Rating", icon: Star },
  ];

  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "SSL encrypted payments with 100% money back guarantee",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Zap,
      title: "Instant Confirmation",
      description: "Get your tickets immediately via email and SMS",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Award,
      title: "Best Price Promise",
      description: "Find a lower price elsewhere? We shall match it plus 5% off",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Expert customer service team available round the clock",
      color: "from-amber-400 to-orange-500",
    },
  ];

  // Auto slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const filteredDestinations =
    selectedCategory === "all"
      ? featuredDestinations
      : featuredDestinations.filter(
          (dest) => dest.category === selectedCategory
        );

  // Slide animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1, // 👈 no fade
      scale: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 1, // 👈 no fade
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeIn",
      },
    }),
  };

  // Text animation variants
  const textVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      rotateX: 90,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
  };

  const handleSlideChange = (newSlide) => {
    if (newSlide !== currentSlide) {
      setDirection(newSlide > currentSlide ? 1 : -1);
      setCurrentSlide(newSlide);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-max  flex items-center justify-center overflow-hidden pt-10 pb-10">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={`absolute inset-0 bg-gradient-to-br ${heroSlides[currentSlide].gradient}`}
          >
            <div className="absolute inset-0 bg-black/30" />
            <motion.div
              className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto ">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSlide}`}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center gap-2 mb-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </motion.div>
                <span className="text-amber-400 font-semibold text-lg">
                  Premium Travel Experience
                </span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {heroSlides[currentSlide].title}
              </motion.h1>

              <motion.h2
                className="text-2xl md:text-3xl font-light mb-4 text-gray-100"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {heroSlides[currentSlide].subtitle}
              </motion.h2>

              <motion.p
                className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {heroSlides[currentSlide].description}
              </motion.p>

              {/* Hero CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 flex items-center gap-3"
                >
                  <Search className="w-5 h-5" />
                  {heroSlides[currentSlide].cta}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-3"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Hero Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search destinations, theme parks, attractions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-lg"
                  />
                </div>
                <select className="px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white">
                  <option>Select Date</option>
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This Weekend</option>
                </select>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleSlideChange(index)}
              whileHover={{ scale: 1.2 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Featured Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most popular attractions with exclusive deals and
              instant booking
            </p>
          </motion.div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
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

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group"
              >
                <div className="relative">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    width={64} // 16 * 4 (Tailwind w-16 = 64px)
                    height={64}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {destination.discount}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors cursor-pointer" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {destination.duration}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {destination.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {destination.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {destination.price}
                      </div>
                      <div className="text-sm text-gray-500 line-through">
                        {destination.originalPrice}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(destination.rating)
                            ? "text-amber-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {destination.rating} (
                      {destination.reviews.toLocaleString()} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold px-8 py-4 rounded-2xl hover:from-gray-900 hover:to-black transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              View All Attractions
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose Glamour Adventures?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our premium service and exclusive
              benefits
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Read genuine reviews from thousands of satisfied travelers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                    width={64} // 16 * 4 (Tailwind w-16 = 64px)
                    height={64}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-800">
                        {testimonial.name}
                      </h4>
                      {testimonial.verified && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {testimonial.country}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed italic">
                   &quot;{testimonial.comment}&quot;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl mb-12 opacity-90">
              Join over 500,000 happy travelers and book your perfect experience
              today
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-300 flex items-center gap-3"
              >
                <Search className="w-5 h-5" />
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center gap-3"
              >
                <Users className="w-5 h-5" />
                B2B Partnership
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

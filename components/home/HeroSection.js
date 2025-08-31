"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Sparkles, ArrowRight, Play } from "lucide-react";
import Image from "next/image";


export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Auto slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Slide animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
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
      opacity: 1,
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
    <section className="relative h-max flex items-center justify-center overflow-hidden pt-10 pb-10">
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

      <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
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

              {/* <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center gap-3"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </motion.button> */}
            </motion.div>
          </motion.div>
        </AnimatePresence>


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
  );
}
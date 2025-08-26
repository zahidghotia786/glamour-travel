"use client";
import { motion } from "framer-motion";
import { Search, Users, ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
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
  );
}
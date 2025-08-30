"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center overflow-hidden">
      <motion.div
        className="w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg"
        animate={{ 
          scale: [1, 1.2, 1], 
          rotate: [0, 180, 360]  // 👈 rotation added
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
    </div>
  );
}

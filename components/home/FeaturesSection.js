"use client";
import { motion } from "framer-motion";
import { Shield, Zap, Award, Users, Globe, Star } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Safe and protected transactions every time you book",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: Globe,
      title: "Wide Destination Coverage",
      description: "Explore a variety of destinations across the UAE and beyond",
      color: "from-blue-400 to-cyan-500",
    },
    {
      icon: Star,
      title: "Trusted by Thousands",
      description: "Highly rated tours with satisfied travelers worldwide",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Friendly experts ready to assist you anytime, anywhere",
      color: "from-amber-400 to-orange-500",
    },
  ];

  return (
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
  );
}

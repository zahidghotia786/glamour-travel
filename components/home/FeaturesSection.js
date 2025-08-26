"use client";
import { motion } from "framer-motion";
import { Shield, Zap, Award, Users } from "lucide-react";

export default function FeaturesSection() {
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
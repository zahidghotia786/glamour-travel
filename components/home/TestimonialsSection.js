"use client";
import { motion } from "framer-motion";
import { Star, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
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

  return (
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
                  width={64}
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
  );
}
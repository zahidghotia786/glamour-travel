"use client";
import { MapPin, Clock, Calendar, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";


export default function ProductInfo({ product, price, renderStars }) {
    const [bookingStep, setBookingStep] = useState(1);
      const [selectedDate, setSelectedDate] = useState("");
      const [quantity, setQuantity] = useState({ adult: 1, child: 0, infant: 0 });
  const [selectedTime, setSelectedTime] = useState("");


    const handleBooking = () => {
    if (bookingStep === 1) {
      setBookingStep(2);
    } else {
      // Handle booking confirmation
      router.push(`/booking/confirmation/${Date.now()}`);
    }
  };
  
  return (
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


          </div>
  );
}

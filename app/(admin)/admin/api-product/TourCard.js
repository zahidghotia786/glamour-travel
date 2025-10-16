"use client";

import React, { useState } from "react";
import { MapPin, Star, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { fetchFromAPI } from "@/lib/api";

const TourCard = ({ tour, index, handleApprove, getTourData, fetchDubaiTours }) => {
  const tourData = getTourData(tour);
  const imageUrl = tourData.localImageUrl;

  const price = tourData.priceAmount || tourData.price?.amount || 0;
  const discount = tourData.discount || 0;
  const discountedPrice = discount > 0 ? price - discount : price;

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [markupType, setMarkupType] = useState("percentage");
  const [markupValue, setMarkupValue] = useState("");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

const handleConfirmApprove = () => {
  if (!markupValue || markupValue <= 0) {
    toast.error("Please enter a valid markup value");
    return;
  }
  
  if (markupType === "percentage" && markupValue > 100) {
    toast.error("Percentage markup cannot exceed 100%");
    return;
  }
  handleApprove(tourData.tourId, tourData.contractId, markupType, markupValue);
  closeModal();
};



const handleCancelApproval = async (tourId, contractId) => {
  try {
    const response = await fetchFromAPI("tourtickets/cancel-approval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tourId, contractId }),
    });

    // Assuming the API returns { success: true, message: "..." }
    if (response?.success) {
      toast.success(response.message || "Approval cancelled successfully");
      fetchDubaiTours()
      setTimeout(() => {
        window.location.reload();
      }, 1000); // short delay so toast shows
    } else {
      toast.error(response?.message || "Failed to cancel approval");
    }
  } catch (error) {
    console.error("Error cancelling approval:", error);
    toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <>
      {/* Tour Card */}
      <div
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group relative"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {/* Tour Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={tourData.tourName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

          {/* Tags */}
          <div className="absolute top-4 right-4 flex gap-2">
            {tourData.recommended && (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
                Recommended
              </span>
            )}
            {tourData.isPrivate && (
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Private
              </span>
            )}
          </div>

          {/* Tour Name & Location */}
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold mb-1">{tourData.tourName}</h3>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} />
              <span>
                {tourData.cityName}, {tourData.countryName}
              </span>
            </div>
          </div>
        </div>

        {/* Tour Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <Star className="fill-yellow-400 text-yellow-400" size={16} />
              <span className="font-semibold">{tourData.rating || 0}</span>
              <span className="text-gray-500 text-sm">
                ({tourData.reviewCount || 0} reviews)
              </span>
            </div>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
              {tourData.cityTourType}
            </span>
          </div>

          {/* Tour Description (HTML) */}
          <p
            className="text-gray-600 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{
              __html:
                tourData.tourShortDescription || "No description available",
            }}
          ></p>

{/* Price Info */}
<div className="mb-3 flex items-center gap-3">
  {tourData.priceByAdmin && tourData.priceByAdmin > 0 ? (
    <span className="font-bold text-lg text-green-600">
      AED {tourData.priceByAdmin.toFixed(2)}
      {tourData.markupType &&
        ` (${tourData.markupType === "percentage" ? "+" + tourData.markupValue + "%" : "+AED " + tourData.markupValue})`}
    </span>
  ) : price > 0 ? (
    discount > 0 ? (
      <>
        <span className="text-red-600 font-bold text-lg">
          AED {discountedPrice.toFixed(2)}
        </span>
        <span className="line-through text-gray-400">
          AED {price.toFixed(2)}
        </span>
      </>
    ) : (
      <span className="font-bold text-lg">AED {price.toFixed(2)}</span>
    )
  ) : (
    <span className="text-gray-500 italic">Contact for price</span>
  )}
</div>

{/* Duration & Approve Button */}
<div className="flex items-center justify-between text-sm">
  <div className="flex items-center gap-1 text-gray-500">
    <Clock size={14} />
    <span>{tourData.duration || "Duration not specified"}</span>
  </div>

  {/* Approve Button */}
  {tourData.approvedByAdmin ? (
    <button onClick={()=> handleCancelApproval(tourData.tourId , tourData.contractId)} className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg">
      Approved
    </button>
  ) : (
    <button
      onClick={openModal}
      className="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105"
    >
      Mark Approve
    </button>
  )}
</div>

        </div>

        {/* Modal - Card ke andar fixed position mein */}
        {showModal && (
          <div className="absolute inset-0 z-50 bg-white rounded-xl shadow-2xl animate-slideDown">
            <div className="p-6 h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  Approve Tour & Set Markup
                </h2>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Markup Type
                  </label>
                  <select
                    value={markupType}
                    onChange={(e) => setMarkupType(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Markup by %</option>
                    <option value="fixed">Markup by Fixed Amount</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Markup Value
                  </label>
                  <input
                    type="number"
                    value={markupValue}
                    onChange={(e) => setMarkupValue(e.target.value)}
                    placeholder="Enter markup"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tour Preview in Modal */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Tour Preview:
                  </h3>
                  <p className="text-sm text-gray-600">{tourData.tourName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {tourData.cityName}, {tourData.countryName}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApprove}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Confirm & Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default TourCard;

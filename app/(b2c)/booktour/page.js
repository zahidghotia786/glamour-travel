"use client";
import React, { useState, useEffect } from "react";
import B2CPageLayout from "../B2CPageLayout";
import BookingReferenceSection from "./BookingReferenceSection";
import BookingSummarySection from "./BookingSummarySection";
import PaymentMethodSection from "./PaymentMethodSection";
import { createBookingWithPayment } from "@/lib/bookingService";
import toast from "react-hot-toast";
import { Mail, Phone, Users } from "lucide-react";

// ✅ Helper to generate uniqueNo
function generateUniqueNo(clientName, prefix = "GLAMOUR") {
  const cleanName = clientName.replace(/\s+/g, "").toUpperCase();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${cleanName}-${randomNum}`;
}

export default function TourBookingPage() {
  const [urlParams, setUrlParams] = useState({});
  const [formData, setFormData] = useState({
    uniqueNo: generateUniqueNo("CLIENT"),
    adult: 1,
    pickup: "",
    clientReferenceNo: `REF-${Date.now()}`,
    paymentMethod: "applepay",
    promoCode: "",
    showPromoInput: false,
    weight: "",
    passenger: {
      serviceType: "tour",
      prefix: "Mr.",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      nationality: "",
      message: "",
      leadPassenger: 1,
      paxType: "Adult",
    },
  });

  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // ✅ Update uniqueNo when lead passenger name changes
  useEffect(() => {
    const lead = formData.passenger;
    if (lead?.firstName) {
      setFormData((prev) => ({
        ...prev,
        uniqueNo: generateUniqueNo(lead.firstName),
      }));
    }
  }, [formData.passenger?.firstName]);

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = {
      tourId: urlSearchParams.get("tourId") || "",
      optionId: urlSearchParams.get("optionId") || "",
      tourDate: urlSearchParams.get("tourDate") || "",
      startTime: decodeURIComponent(urlSearchParams.get("startTime") || ""),
      transferId: urlSearchParams.get("transferId") || "",
      adultprice: urlSearchParams.get("adultprice") || "0",
      timeSlot: urlSearchParams.get("timeSlot") || "",
    };
    setUrlParams(params);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePassengerChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      passenger: {
        ...prev.passenger,
        [field]: value,
      },
    }));
  };

  const calculateTotal = () => {
    return formData.adult * parseFloat(urlParams.adultprice || 0);
  };

  const prepareBookingData = () => {
    const generateServiceUniqueId = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    // Create passengers array based on quantity
    const passengers = [];
    for (let i = 0; i < formData.adult; i++) {
      passengers.push({
        serviceType: "tour",
        prefix: i === 0 ? formData.passenger.prefix : "Mr.",
        firstName: i === 0 ? formData.passenger.firstName : `Passenger ${i + 1}`,
        lastName: i === 0 ? formData.passenger.lastName : "",
        email: formData.passenger.email,
        mobile: formData.passenger.mobile,
        nationality: formData.passenger.nationality,
        message: i === 0 ? "Lead passenger" : `Additional passenger ${i}`,
        leadPassenger: i === 0 ? 1 : 0,
        paxType: "Adult",
        clientReferenceNo: formData.clientReferenceNo
      });
    }

    const totalAmount = calculateTotal();
    
    return {
      uniqueNo: formData.uniqueNo,
      TourDetails: [
        {
          serviceUniqueId: generateServiceUniqueId(),
          tourId: parseInt(urlParams.tourId) || 0,
          optionId: parseInt(urlParams.optionId) || 0,
          adult: parseInt(formData.adult) || 0,
          child: 0,
          infant: 0,
          tourDate: urlParams.tourDate || "",
          timeSlotId: parseInt(urlParams.timeSlot) || 0,
          startTime: urlParams.startTime || "",
          transferId: parseInt(urlParams.transferId) || 0,
          pickup: formData.pickup || "",
          adultRate: parseFloat(urlParams.adultprice) || 0,
          childRate: 0,
          serviceTotal: totalAmount.toString()
        }
      ],
      passengers: passengers,
      clientReferenceNo: formData.clientReferenceNo,
      paymentMethod: formData.paymentMethod === 'applepay' ? 'ziina' : formData.paymentMethod,
      totalGross: calculateTotal(),
      passengerCount: formData.adult,
      leadPassenger: formData.passenger,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leadPassenger = formData.passenger;
    if (
      !leadPassenger.firstName ||
      !leadPassenger.lastName ||
      !leadPassenger.email ||
      !leadPassenger.mobile ||
      !leadPassenger.nationality
    ) {
      toast.error("Please fill all required fields for lead passenger");
      return;
    }

    setLoading(true);
    let toastId;

    try {
      toastId = toast.loading("Processing your booking and payment...");

      const bookingData = prepareBookingData();
      
      console.log("=== DEBUG PASSENGER DATA ===");
      bookingData.passengers.forEach((passenger, index) => {
        console.log(`Passenger[${index}]:`, {
          firstName: passenger.firstName,
          lastName: passenger.lastName,
          leadPassenger: passenger.leadPassenger,
          type: typeof passenger.leadPassenger,
          paxType: passenger.paxType
        });
      });
      
      const result = await createBookingWithPayment(bookingData);
      setBookingResult(result);

      if (result.statuscode === 200 && result.result) {
        toast.dismiss(toastId);
        
        if (result.result.payment && result.result.payment.paymentRedirectUrl) {
          toast.success("🎉 Booking created! Redirecting to payment...");
          
          setTimeout(() => {
            window.location.href = result.result.payment.paymentRedirectUrl;
          }, 1500);
        } else if (result.result.booking) {
          toast.success("🎉 Booking created! Please complete payment from your bookings page.");
        } else {
          toast.success("🎉 Booking submitted successfully!");
        }
        
      } else {
        const errorMessage = result.error?.description || result.error || 'Booking failed';
        toast.dismiss(toastId);
        toast.error(`❌ ${errorMessage}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
      
      if (toastId) {
        toast.dismiss(toastId);
      }
      
      let userFriendlyMessage = 'Booking failed. Please try again.';
      
      if (error.message.includes('network') || error.message.includes('Network')) {
        userFriendlyMessage = '🌐 Network error: Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        userFriendlyMessage = '⏰ Request timeout: Please try again.';
      } else if (error.message.includes('session expired') || error.message.includes('unauthorized')) {
        userFriendlyMessage = '🔐 Session expired. Please login again.';
      } else {
        userFriendlyMessage = error.message || 'Booking failed. Please try again.';
      }

      toast.error(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralSection = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-1">General</h2>
          <p className="text-xs text-gray-500">18 yrs or above</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => handleInputChange('adult', Math.max(1, formData.adult - 1))}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
            >
              -
            </button>
            <span className="px-4 py-2 text-gray-800 font-medium">{formData.adult}</span>
            <button
              type="button"
              onClick={() => handleInputChange('adult', formData.adult + 1)}
              className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
            >
              +
            </button>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">
              AED {(formData.adult * parseFloat(urlParams.adultprice || 0)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPickupSection = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Pickup Location</h3>
      <div className="relative">
        <input
          type="text"
          placeholder="Search or enter pickup location..."
          value={formData.pickup}
          onChange={(e) => handleInputChange('pickup', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input
            type="number"
            placeholder="Enter weight in kg"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </div>
  );

  const renderPromoCodeSection = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-6">
      <button
        type="button"
        onClick={() => handleInputChange('showPromoInput', !formData.showPromoInput)}
        className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
      >
        + Add Promo Code
      </button>
      
      {formData.showPromoInput && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter promo code"
            value={formData.promoCode}
            onChange={(e) => handleInputChange('promoCode', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <button
            type="button"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Apply Code
          </button>
        </div>
      )}
    </div>
  );

  const renderPassengerForm = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
        <Users className="mr-3 text-blue-600 w-6 h-6" />
        Lead Passenger Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            value={formData.passenger.firstName}
            onChange={(e) => handlePassengerChange('firstName', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            value={formData.passenger.lastName}
            onChange={(e) => handlePassengerChange('lastName', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Mail className="w-4 h-4 mr-1" /> Email *
          </label>
          <input
            type="email"
            value={formData.passenger.email}
            onChange={(e) => handlePassengerChange('email', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Phone className="w-4 h-4 mr-1" /> Mobile *
          </label>
          <input
            type="tel"
            value={formData.passenger.mobile}
            onChange={(e) => handlePassengerChange('mobile', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
          <input
            type="text"
            value={formData.passenger.nationality}
            onChange={(e) => handlePassengerChange('nationality', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderBookingForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderGeneralSection()}
      {renderPassengerForm()}
      {renderPickupSection()}
      {renderPromoCodeSection()}

      <PaymentMethodSection
        paymentMethod={formData.paymentMethod}
        onPaymentMethodChange={(method) => handleInputChange("paymentMethod", method)}
      />

      <BookingReferenceSection
        clientReferenceNo={formData.clientReferenceNo}
        onReferenceChange={(value) =>
          handleInputChange("clientReferenceNo", value)
        }
      />

      {/* Submit Button for Mobile */}
      <div className="lg:hidden bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? "Processing..." : `Book Now - AED ${calculateTotal().toFixed(2)}`}
        </button>
      </div>
    </form>
  );

  return (
    <B2CPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              Complete Your Booking
            </h1>
            <p className="text-center text-blue-100 text-sm md:text-base">
              Just a few more steps to confirm your amazing tour experience
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Side - Details and Form */}
              <div className="lg:col-span-2">
                {renderBookingForm()}
              </div>

              {/* Right Side - Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <BookingSummarySection
                    formData={formData}
                    urlParams={urlParams}
                    calculateTotal={calculateTotal}
                    onSubmit={handleSubmit}
                    loading={loading}
                    paymentMethod={formData.paymentMethod}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </B2CPageLayout>
  );
}
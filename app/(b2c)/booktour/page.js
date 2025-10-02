"use client";
import React, { useState, useEffect } from "react";
import B2CPageLayout from "../B2CPageLayout";
import TourSummarySection from "./TourSummarySection";
import PassengerInfoSection from "./PassengerInfoSection";
import BookingReferenceSection from "./BookingReferenceSection";
import BookingSummarySection from "./BookingSummarySection";
import PaymentMethodSection from "./PaymentMethodSection";
import { createBookingWithPayment } from "@/lib/bookingService"; // 🛠️ Use the new function
import toast from "react-hot-toast";

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
    child: 0,
    infant: 0,
    pickup: "",
    clientReferenceNo: `REF-${Date.now()}`,
    paymentMethod: "ziina",
    passengers: [
      {
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
    ],
  });

  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // ✅ Update uniqueNo when lead passenger name changes
  useEffect(() => {
    const lead = formData.passengers[0];
    if (lead?.firstName) {
      setFormData((prev) => ({
        ...prev,
        uniqueNo: generateUniqueNo(lead.firstName),
      }));
    }
  }, [formData.passengers[0]?.firstName]);

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
      childprice: urlSearchParams.get("childprice") || "0",
      timeSlot: urlSearchParams.get("timeSlot") || "",
    };
    setUrlParams(params);
  }, []);

  // Update passengers when counts change
  useEffect(() => {
    updatePassengers();
  }, [formData.adult, formData.child, formData.infant]);

  const updatePassengers = () => {
    const totalPassengers = formData.adult + formData.child + formData.infant;
    const currentPassengers = [...formData.passengers];

    if (currentPassengers.length < totalPassengers) {
      for (let i = currentPassengers.length; i < totalPassengers; i++) {
        let paxType = "Adult";
        let prefix = "Mr.";

        if (i >= formData.adult && i < formData.adult + formData.child) {
          paxType = "Child";
          prefix = "Master";
        } else if (i >= formData.adult + formData.child) {
          paxType = "Infant";
          prefix = "Baby";
        }

        currentPassengers.push({
          serviceType: "tour",
          prefix: prefix,
          firstName: "",
          lastName: "",
          email: i === 0 ? formData.passengers[0]?.email : "",
          mobile: i === 0 ? formData.passengers[0]?.mobile : "",
          nationality: i === 0 ? formData.passengers[0]?.nationality : "",
          message: "",
          leadPassenger: i === 0 ? 1 : 0,
          paxType: paxType,
        });
      }
    } else if (currentPassengers.length > totalPassengers) {
      currentPassengers.splice(totalPassengers);
    }

    setFormData((prev) => ({
      ...prev,
      passengers: currentPassengers,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePassengerChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      passengers: prev.passengers.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      ),
    }));
  };

  const calculateTotal = () => {
    const adultTotal = formData.adult * parseFloat(urlParams.adultprice || 0);
    const childTotal = formData.child * parseFloat(urlParams.childprice || 0);
    return adultTotal + childTotal;
  };

  const prepareBookingData = () => {
    const generateServiceUniqueId = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const passengersWithReference = formData.passengers.map((passenger, index) => {
      const isLeadPassenger = index === 0 ? 1 : 0;
      
      return {
        serviceType: "tour",
        prefix: passenger.prefix,
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        email: formData.passengers[0].email,
        mobile: formData.passengers[0].mobile,
        nationality: formData.passengers[0].nationality,
        message: passenger.message || (index === 0 ? "Lead passenger" : `Additional ${passenger.paxType.toLowerCase()} passenger`),
        leadPassenger: isLeadPassenger,
        paxType: passenger.paxType,
        clientReferenceNo: formData.clientReferenceNo
      };
    });

    const totalAmount = calculateTotal();
    
    return {
      uniqueNo: formData.uniqueNo,
      TourDetails: [
        {
          serviceUniqueId: generateServiceUniqueId(),
          tourId: parseInt(urlParams.tourId) || 0,
          optionId: parseInt(urlParams.optionId) || 0,
          adult: parseInt(formData.adult) || 0,
          child: parseInt(formData.child) || 0,
          infant: parseInt(formData.infant) || 0,
          tourDate: urlParams.tourDate || "",
          timeSlotId: parseInt(urlParams.timeSlot) || 0,
          startTime: urlParams.startTime || "",
          transferId: parseInt(urlParams.transferId) || 0,
          pickup: formData.pickup || "",
          adultRate: parseFloat(urlParams.adultprice) || 0,
          childRate: parseFloat(urlParams.childprice) || 0,
          serviceTotal: totalAmount.toString()
        }
      ],
      passengers: passengersWithReference,
      clientReferenceNo: formData.clientReferenceNo,
      paymentMethod: formData.paymentMethod
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leadPassenger = formData.passengers[0];
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

    const invalidPassengers = formData.passengers
      .slice(1)
      .filter((p) => !p.firstName || !p.lastName);

    if (invalidPassengers.length > 0) {
      toast.error("Please fill first name and last name for all additional passengers");
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
      
      // 🛠️ FIXED: Use the new integrated function
      const result = await createBookingWithPayment(bookingData);
      setBookingResult(result);

      if (result.statuscode === 200 && result.result) {
        toast.dismiss(toastId);
        
        // 🛠️ FIXED: Check for payment redirect URL in the new response structure
        if (result.result.payment && result.result.payment.paymentRedirectUrl) {
          toast.success("🎉 Booking created! Redirecting to payment...");
          
          // Auto-redirect to payment
          setTimeout(() => {
            window.location.href = result.result.payment.paymentRedirectUrl;
          }, 1500);
        } else if (result.result.booking) {
          // Backward compatibility - booking succeeded but payment setup failed
          toast.success("🎉 Booking created! Please complete payment from your bookings page.");
        } else {
          // Original response structure
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
      
      if (error.message.includes('Child are not allowed')) {
        userFriendlyMessage = '🚫 Children are not allowed for this tour. Please remove child passengers and try again.';
      } else if (error.message.includes('network') || error.message.includes('Network')) {
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

  const renderBookingForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TourSummarySection
        urlParams={urlParams}
        pickup={formData.pickup}
        onPickupChange={(value) => handleInputChange("pickup", value)}
      />

      <PassengerInfoSection
        formData={formData}
        onInputChange={handleInputChange}
        onPassengerChange={handlePassengerChange}
      />

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
          {loading ? "Processing..." : `Book Now - $${calculateTotal().toFixed(2)}`}
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
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Main Booking Form */}
              <div className="lg:col-span-2">
                {renderBookingForm()}
              </div>

              {/* Booking Summary Sidebar */}
              <div className="lg:col-span-1">
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
    </B2CPageLayout>
  );
}
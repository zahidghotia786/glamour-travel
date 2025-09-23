"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import B2CPageLayout from "../B2CPageLayout";

export default function AvailabilityPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [participants, setParticipants] = useState(1);

  // Get parameters from URL
  const tourId = searchParams.get("tourId");
  const travelDate = searchParams.get("date");
  const contractId = searchParams.get("contractId");

  // 🔥 API call to backend
  const fetchAvailability = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tour/dubai/availability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tourId,
            contractId,
            travelDate,
          }),
        }
      );

      const data = await response.json();
      console.log("Fetched availability data:", data);

      if (data.statuscode === 0) {
        // 🛠 Map backend response into frontend-friendly format
        const transformedData = {
          tourId,
          contractId,
          travelDate,
          tourName: data.result.tourName || "Dubai Tour",
          duration: data.result.duration || "N/A",
          location: data.result.location || "Dubai",
          rating: data.result.rating || 4.5,
          totalReviews: data.result.totalReviews || 100,
          availableSlots: (data.result.slots || []).map((slot) => ({
            time: slot.time,
            available: slot.available,
            price: slot.price,
            maxParticipants: slot.maxParticipants,
          })),
          inclusions: data.result.inclusions || [
            "Professional guide",
            "Transportation",
            "Refreshments",
          ],
        };

        setAvailabilityData(transformedData);
      } else {
        console.error("❌ API Error:", data.error);
        setAvailabilityData(null);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setAvailabilityData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tourId && travelDate && contractId) {
      fetchAvailability();
    }
  }, [tourId, travelDate, contractId]);

  const handleBookNow = () => {
    if (!selectedTimeSlot) {
      alert("Please select a time slot");
      return;
    }

    const bookingParams = new URLSearchParams({
      tourId,
      travelDate,
      contractId,
      time: selectedTimeSlot.time,
      participants: participants.toString(),
    });

    window.location.href = `/booking?${bookingParams.toString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Checking Availability...
          </h2>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch available slots
          </p>
        </div>
      </div>
    );
  }

  if (!tourId || !travelDate || !contractId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Missing Information
          </h2>
          <p className="text-gray-600 mb-6">
            Required parameters are missing. Please go back and try again.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <B2CPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tour
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check Availability
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(travelDate)}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {availabilityData?.location}
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                {availabilityData?.rating} ({availabilityData?.totalReviews}{" "}
                reviews)
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Availability Section */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Available Time Slots
                </h2>

                <div className="space-y-4">
                  {availabilityData?.availableSlots.length > 0 ? (
                    availabilityData.availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                          selectedTimeSlot?.time === slot.time
                            ? "border-blue-500 bg-blue-50"
                            : slot.available
                            ? "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                            : "border-gray-100 bg-gray-50 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          slot.available && setSelectedTimeSlot(slot)
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <Clock className="w-5 h-5 text-gray-500" />
                            <span className="font-semibold text-lg">
                              {slot.time}
                            </span>
                            {!slot.available && (
                              <span className="text-red-500 text-sm font-medium">
                                Sold Out
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              ${slot.price}
                            </div>
                            <div className="text-sm text-gray-500">
                              Max: {slot.maxParticipants} people
                            </div>
                          </div>
                        </div>

                        {slot.available && (
                          <div className="flex items-center mt-2 text-green-600">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm">Available</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No slots available for this date.
                    </p>
                  )}
                </div>
              </div>

              {/* Participants Selector */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Number of Participants
                </h3>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() =>
                      participants > 1 && setParticipants(participants - 1)
                    }
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    disabled={participants <= 1}
                  >
                    -
                  </button>

                  <span className="text-xl font-semibold w-8 text-center">
                    {participants}
                  </span>

                  <button
                    onClick={() => {
                      const maxParticipants =
                        selectedTimeSlot?.maxParticipants || 10;
                      if (participants < maxParticipants) {
                        setParticipants(participants + 1);
                      }
                    }}
                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    disabled={
                      participants >= (selectedTimeSlot?.maxParticipants || 10)
                    }
                  >
                    +
                  </button>

                  <span className="text-gray-600 ml-4">
                    Max: {selectedTimeSlot?.maxParticipants || 10} participants
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Booking Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tour:</span>
                    <span className="font-medium">
                      {availabilityData?.tourName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(travelDate)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {selectedTimeSlot
                        ? selectedTimeSlot.time
                        : "Not selected"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{participants}</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-blue-600">
                        $
                        {selectedTimeSlot
                          ? selectedTimeSlot.price * participants
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  disabled={!selectedTimeSlot}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Now
                </button>

                {/* Inclusions */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {availabilityData?.inclusions.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </B2CPageLayout>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import {
  XCircle,
  Loader2,
  Calendar,
  Clock,
  CheckCircle,
  X,
  MapPin,
  Users,
  Star,
  Award,
  Info,
  ArrowRight,
  Shield,
  Timer,
  Gift,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Heart,
  Share,
  Camera,
  Zap,
  Crown,
  Check,
} from "lucide-react";
import B2CPageLayout from "../B2CPageLayout";

export default function AvailabilityPage({ searchParams }) {
  const [loading, setLoading] = useState(true);
  const [tourData, setTourData] = useState(null);
  const [availability, setAvailability] = useState({});
  const [availabilityLoading, setAvailabilityLoading] = useState({});
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // URL parameters
  const tourId = searchParams.get("tourId");
  const travelDate = searchParams.get("date");
  const contractId = searchParams.get("contractId");

  // Default participants (fixed values)
  const participants = { adult: 1, child: 0, infant: 0 };

  // Get selected tour from localStorage
  useEffect(() => {
    const storedTour = localStorage.getItem("selectedTour");
    if (storedTour) {
      try {
        setSelectedTour(JSON.parse(storedTour));
      } catch (error) {
        console.error("Error parsing selected tour:", error);
      }
    }
  }, []);

  // Extract unique time slots from all options
  const extractTimeSlots = (options) => {
    if (!options || options.length === 0) return [];

    const timeSlots = [
      ...new Set(options.map((option) => option.startTime)),
    ].sort();

    return timeSlots.map((time) => ({
      time,
      formattedTime: formatTime(time),
      availableOptions: options.filter((option) => option.startTime === time),
    }));
  };

  // Check if option is available based on API response
  const isOptionAvailable = (availabilityData) => {
    if (!availabilityData) return false;
    return availabilityData.status === 1;
  };

  // Fetch Tour Options
  const fetchTourOptions = async () => {
    try {
      setLoading(true);
      setTourData(null);
      setAvailability({});
      setAvailabilityLoading({});
      setSelectedTimeSlot(null);
      setAvailableTimeSlots([]);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tour/dubai/tour-options`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tourId,
            contractId,
            travelDate,
            noOfAdult: participants.adult,
            noOfChild: participants.child,
            noOfInfant: participants.infant,
          }),
        }
      );

      const data = await response.json();
      console.log("✅ Tour Options API Response:", data);

      if (data.statuscode === 0 && data.result?.length > 0) {
        const timeSlots = extractTimeSlots(data.result);

        const transformedData = {
          tourId,
          contractId,
          travelDate,
          tourName: selectedTour?.tourName || "Tour Experience",
          availableOptions: data.result,
          timeSlots: timeSlots,
        };

        setTourData(transformedData);
        setAvailableTimeSlots(timeSlots);

        // Auto-select first time slot if available
        if (timeSlots.length > 0) {
          setSelectedTimeSlot(timeSlots[0]);
        }
      } else {
        setTourData(null);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setTourData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Availability for specific option
  const fetchAvailability = async (option) => {
    if (!option) return;

    const optionKey = option.tourOptionId;

    try {
      setAvailabilityLoading(prev => ({ ...prev, [optionKey]: true }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tour/dubai/availability`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tourId: option.tourId,
            tourOptionId: option.tourOptionId,
            transferId: option.transferId,
            travelDate,
            contractId,
            adult: participants.adult,
            child: participants.child,
            infant: participants.infant,
          }),
        }
      );

      const data = await response.json();
      console.log("✅ Availability API Response:", data);

      setAvailability(prev => ({ 
        ...prev, 
        [optionKey]: data.result || null 
      }));
    } catch (error) {
      console.error("❌ Availability Fetch Error:", error);
      setAvailability(prev => ({ 
        ...prev, 
        [optionKey]: { status: 0, message: "Failed to check availability" } 
      }));
    } finally {
      setAvailabilityLoading(prev => ({ ...prev, [optionKey]: false }));
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Handle booking for specific option
  const handleBookNow = (option) => {
    const optionKey = option.tourOptionId;
    const optionAvailability = availability[optionKey];

    if (!optionAvailability) {
      alert("Please wait for availability check to complete");
      return;
    }

    if (!isOptionAvailable(optionAvailability)) {
      alert("This option is not available. Please select another option.");
      return;
    }

    // Navigate to book tour page with required parameters
    const bookingParams = new URLSearchParams({
      tourId: option.tourId.toString(),
      optionId: option.tourOptionId.toString(),
      tourDate: travelDate,
      startTime: option.startTime,
      transferId: option.transferId.toString(),
      adultprice: option.adultPrice.toString(),
      childprice: option.childPrice.toString(),
    });

    window.location.href = `/booktour?${bookingParams.toString()}`;
  };



  // Formatting helpers
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (time) => {
    if (!time) return "Flexible";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Get transfer type styling with enhanced gradients
  const getTransferStyling = (transferName) => {
    switch (transferName) {
      case "Sharing Transfers":
        return {
          gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
          badgeGradient: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
          icon: Users,
          badge: "Sharing",
        };
      case "Private Transfers":
        return {
          gradient: "bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700",
          badgeGradient: "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
          icon: Shield,
          badge: "Private",
        };
      case "Luxury Transfers":
        return {
          gradient: "bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-700",
          badgeGradient: "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
          icon: Crown,
          badge: "Luxury",
        };
      default:
        return {
          gradient: "bg-gradient-to-br from-gray-500 via-gray-600 to-slate-700",
          badgeGradient: "bg-gradient-to-r from-gray-500 to-slate-600 text-white",
          icon: MapPin,
          badge: "Standard",
        };
    }
  };

  // Get all options for current time slot (unified list)
  const getCurrentOptions = () => {
    if (!tourData || !selectedTimeSlot) return [];
    return selectedTimeSlot.availableOptions;
  };


   // Check availability when option comes into view or on mount
  const handleOptionVisible = (option) => {
    const optionKey = option.tourOptionId;
    if (!availability[optionKey] && !availabilityLoading[optionKey]) {
      fetchAvailability(option);
    }
  };
  
  const currentOptions = getCurrentOptions();


  // Parent component ke andar
useEffect(() => {
  if (!currentOptions) return;

  currentOptions.forEach((option) => {
    handleOptionVisible(option); // availability check trigger
  });
}, [currentOptions]);

  // Initial load
  useEffect(() => {
    if (tourId && travelDate && contractId) {
      fetchTourOptions();
    }
  }, [tourId, travelDate, contractId]);

  

  // Loading State with beautiful animation
  if (loading) {
    return (
      <B2CPageLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-12 h-12 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-blue-200 animate-ping"></div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Finding Perfect Options
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Curating the best experiences just for you...
              </p>
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </B2CPageLayout>
    );
  }

  // No Data State
  if (!tourData) {
    return (
      <B2CPageLayout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-2xl mb-8">
                <AlertCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Oops! No Adventures Available
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We couldn't find any magical experiences for your selected date.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Calendar className="w-5 h-5 inline mr-2" />
                  Try Different Date
                </button>
                <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                  <Heart className="w-5 h-5 inline mr-2" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </B2CPageLayout>
    );
  }


  return (
    <B2CPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stunning Header Section */}
          <div className="mb-12">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">
                Tours
              </span>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              <span className="hover:text-blue-600 cursor-pointer transition-colors">
                {selectedTour?.cityName || "City"}
              </span>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              <span className="text-gray-900 font-medium">
                {selectedTour?.tourName || "Tour"}
              </span>
            </div>

            {/* Hero Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32">
                  <div className="w-full h-full rounded-full bg-white/10 animate-pulse"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-48 h-48 transform -translate-x-24 translate-y-24">
                  <div className="w-full h-full rounded-full bg-white/5"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <h1 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                        {selectedTour?.tourName || tourData.tourName}
                      </h1>

                      <div className="flex flex-wrap items-center gap-6 text-blue-100 mb-6">
                        {selectedTour?.rating && (
                          <div className="flex items-center bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                            <span className="font-semibold text-white">
                              {selectedTour.rating}
                            </span>
                            {selectedTour.reviewCount && (
                              <span className="ml-1 text-blue-100">
                                ({selectedTour.reviewCount})
                              </span>
                            )}
                          </div>
                        )}

                        {selectedTour?.duration && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{selectedTour.duration}</span>
                          </div>
                        )}

                        {selectedTour?.cityTourType && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{selectedTour.cityTourType}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-blue-100">
                        <div className="flex items-center bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium text-white">
                            {formatDate(travelDate)}
                          </span>
                        </div>
                        <div className="flex items-center bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-white">
                            {participants.adult +
                              participants.child +
                              participants.infant}{" "}
                            Traveler(s)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {selectedTour?.cancellationPolicyName && (
                        <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 backdrop-blur-sm">
                          <div className="flex items-center text-green-100">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span className="font-medium text-white">
                              {selectedTour.cancellationPolicyName}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all">
                          <Heart className="w-5 h-5 text-white" />
                        </button>
                        <button className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all">
                          <Share className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          {availableTimeSlots.length > 0 && (
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Select Your Preferred Time
                    </h3>
                    <p className="text-gray-600">
                      Choose a time slot to see available options
                    </p>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedTimeSlot ? selectedTimeSlot.time : ""}
                      onChange={(e) => {
                        const selected = availableTimeSlots.find(
                          (slot) => slot.time === e.target.value
                        );
                        if (selected) handleTimeSlotSelect(selected);
                      }}
                      className="appearance-none bg-white border-2 border-gray-200 rounded-xl py-3 px-6 pr-12 text-lg font-semibold text-gray-900 focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      {availableTimeSlots.map((slot, index) => (
                        <option key={slot.time} value={slot.time}>
                          {slot.formattedTime}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                      <Clock className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Time Slot Options Summary */}
                {selectedTimeSlot && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-blue-800">
                      <span className="font-semibold">
                        Available for {selectedTimeSlot.formattedTime}:
                      </span>
                      <span className="bg-blue-100 px-3 py-1 rounded-full font-medium">
                        {currentOptions.length} options available
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Options Selection - Unified List */}
          <div className="space-y-8">
            {selectedTimeSlot ? (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                    Available Options for {selectedTimeSlot.formattedTime}
                  </h2>
                  <p className="text-lg text-gray-600">
                    Select the option that matches your style and preferences
                  </p>
                </div>

                {/* Single unified grid for all options */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Choose Your Experience</h3>
                    <p className="text-blue-100">All available options for your selected time</p>
                  </div>

                  <div className="p-6">
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {currentOptions.map((option) => {
                        const optionKey = option.tourOptionId;
                        const isCheckingAvailability = availabilityLoading[optionKey];
                        const optionAvailability = availability[optionKey];
                        const optionAvailable = optionAvailability ? isOptionAvailable(optionAvailability) : null;
                        const styling = getTransferStyling(option.transferName);


                        return (
                          <div
                            key={option.tourOptionId}
                            className="relative border-2 rounded-2xl p-6 transition-all hover:scale-105 transform border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
                          >
                            {/* Transfer type badge */}
                            <div className="absolute top-3 right-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${styling.badgeGradient}`}>
                                {styling.badge}
                              </span>
                            </div>

                            {/* Price Section */}
                            <div className="mb-4">
                              <div className="text-2xl font-bold text-gray-900">
                                ${option.adultPrice}
                                <span className="text-sm text-gray-500 font-normal">/adult</span>
                              </div>
                              {option.childPrice > 0 && (
                                <div className="text-sm text-gray-600">
                                  Child: ${option.childPrice}
                                </div>
                              )}
                            </div>

                            {/* Transfer Details */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                {option.transferName}
                              </h4>
                              
                              {/* Departure Time Details */}
                              {option.departureTime && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                  <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Schedule Details
                                  </div>
                                  <div className="text-xs text-gray-600 whitespace-pre-line">
                                    {option.departureTime}
                                  </div>
                                </div>
                              )}

                              {/* Key Details */}
                              <div className="space-y-1 mb-4">
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  Min {option.minimumPax} guests
                                </div>
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Starts: {formatTime(option.startTime)}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                  <Timer className="w-4 h-4" />
                                  Booking cutoff: {option.cutOff} hours
                                </div>
                              </div>

                              {/* Same day booking indicator */}
                              {!option.allowTodaysBooking && (
                                <div className="mb-4 text-xs text-amber-600 flex items-center gap-1">
                                  <Info className="w-3 h-3" />
                                  Advance booking required
                                </div>
                              )}
                            </div>

                            {/* Availability Status */}
                            <div className="mb-4">
                              {isCheckingAvailability ? (
                                <div className="flex items-center text-blue-600">
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Checking availability...
                                </div>
                              ) : optionAvailable === true ? (
                                <div className="flex items-center text-green-600 font-semibold">
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Available
                                </div>
                              ) : optionAvailable === false ? (
                                <div className="flex items-center text-red-600 font-semibold">
                                  <X className="w-4 h-4 mr-2" />
                                  Sold Out
                                </div>
                              ) : null}
                            </div>

                            {/* Book Now Button */}
                            <button
                              onClick={() => handleBookNow(option)}
                              disabled={!optionAvailable || isCheckingAvailability}
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                            >
                              {isCheckingAvailability ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Checking...
                                </>
                              ) : optionAvailable === false ? (
                                <>
                                  <X className="w-4 h-4" />
                                  Sold Out
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4" />
                                  Book Now
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600">
                  Please select a time slot to see available options
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </B2CPageLayout>
  );
}
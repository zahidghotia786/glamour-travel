"use client";
import React, { useState, useEffect } from "react";
import {
  Loader2,
  Calendar,
  Clock,
  CheckCircle,
  X,
  MapPin,
  Users,
  Star,
  Info,
  ArrowRight,
  Shield,
  Timer,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Heart,
  Share,
  Zap,
  Crown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import B2CPageLayout from "../B2CPageLayout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export default function AvailabilityPage({ searchParams }) {
  const [loading, setLoading] = useState(true);
  const [tourData, setTourData] = useState(null);
  const [availability, setAvailability] = useState({});
  const [availabilityLoading, setAvailabilityLoading] = useState({});
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // ✅ FIXED: Correct date formatting function
  const formatDateForURL = (date) => {
    if (!date) return "";

    // Local time mein date ko format karenge
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  // ✅ FIXED: Correct date selection handler
  const handleDateSelect = (date) => {
    if (!date) return;

    const formattedDate = formatDateForURL(date);
    console.log("Selected Date:", date);
    console.log("Formatted Date for URL:", formattedDate);

    setShowCalendarModal(false);

    // Navigate to the selected date
    window.location.href = `/availability?tourId=${tourId}&date=${formattedDate}&contractId=${contractId}`;
  };

  // ✅ FIXED: Correct date comparison for selection
  const isDateSelected = (date) => {
    if (!date || !travelDate) return false;

    const dateToCheck = formatDateForURL(date);
    return dateToCheck === travelDate;
  };

  const isDateToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return formatDateForURL(date) === formatDateForURL(today);
  };

  const isDatePast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today;
  };

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/tourtickets/dubai/tour-options`,
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
      setAvailabilityLoading((prev) => ({ ...prev, [optionKey]: true }));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tourtickets/dubai/availability`,
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

      setAvailability((prev) => ({
        ...prev,
        [optionKey]: data.result || null,
      }));
    } catch (error) {
      console.error("❌ Availability Fetch Error:", error);
      setAvailability((prev) => ({
        ...prev,
        [optionKey]: { status: 0, message: "Failed to check availability" },
      }));
    } finally {
      setAvailabilityLoading((prev) => ({ ...prev, [optionKey]: false }));
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

    const timeSlotIndex =
      availableTimeSlots.findIndex(
        (slot) => slot.time === selectedTimeSlot.time
      ) + 1;

    // Navigate to book tour page with required parameters
    const bookingParams = new URLSearchParams({
      tourId: option.tourId.toString(),
      optionId: option.tourOptionId.toString(),
      tourDate: travelDate,
      startTime: option.startTime,
      transferId: option.transferId.toString(),
      adultprice: option.adultPrice.toString(),
      childprice: option.childPrice.toString(),
      timeSlot: timeSlotIndex.toString(),
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
          gradient:
            "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
          badgeGradient:
            "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
          icon: Users,
          badge: "Sharing",
        };
      case "Private Transfers":
        return {
          gradient:
            "bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700",
          badgeGradient:
            "bg-gradient-to-r from-purple-500 to-pink-600 text-white",
          icon: Shield,
          badge: "Private",
        };
      case "Luxury Transfers":
        return {
          gradient:
            "bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-700",
          badgeGradient:
            "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
          icon: Crown,
          badge: "Luxury",
        };
      default:
        return {
          gradient: "bg-gradient-to-br from-gray-500 via-gray-600 to-slate-700",
          badgeGradient:
            "bg-gradient-to-r from-gray-500 to-slate-600 text-white",
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

  // Calendar Modal Component
  const CalendarModal = () => {
    if (!showCalendarModal) return null;

    const days = getDaysInMonth(currentMonth);
    const monthName = currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Select Date</h3>
            <button
              onClick={() => setShowCalendarModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Calendar Navigation */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <h4 className="text-lg font-semibold text-gray-900">{monthName}</h4>

            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const isDisabled = date && isDatePast(date);
                const isSelected = date && isDateSelected(date);
                const isToday = date && isDateToday(date);

                return (
                  <button
                    key={index}
                    onClick={() => !isDisabled && handleDateSelect(date)}
                    disabled={isDisabled}
                    className={`
                      h-12 rounded-lg text-sm font-medium transition-all duration-200
                      ${!date ? "invisible" : ""}
                      ${
                        isDisabled
                          ? "text-gray-300 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : isToday
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                  >
                    {date ? date.getDate() : ""}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-sm text-gray-600">Selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                <button
                  onClick={() => setShowCalendarModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
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
        <CalendarModal />
      </B2CPageLayout>
    );
  }

  return (
    <>
      <Header />
      <main className="sm:min-h-screen">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="container max-w-[90%] sm:max-w-[600px] md:max-w-[750px] lg:max-w-[850px] mx-auto mt-10 sm:mt-16">
          {/* 📅 DATE SELECTOR SECTION */}
          <div className="mb-8">
            <h2 className="text-base sm:text-lg font-semibold mb-1 text-gray-900">
              Select a date
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              All prices are in AED (AED)
            </p>

            <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {Array.from({ length: 7 }).map((_, idx) => {
                const date = new Date();
                date.setDate(date.getDate() + idx);

                const day = date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase();
                const displayDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
                const formattedDate = formatDateForURL(date);
                const isSelected = formattedDate === travelDate;

                return (
                  <div
                    key={idx}
                    onClick={() =>
                      (window.location.href = `/availability?tourId=${tourId}&date=${formattedDate}&contractId=${contractId}`)
                    }
                    className={`flex flex-col items-center justify-center min-w-[70px] sm:min-w-[75px] px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-blue-600 text-blue-600 bg-blue-50 font-semibold"
                        : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs">{day}</span>
                    <span className="text-sm">{displayDate}</span>
                  </div>
                );
              })}

              {/* More dates button */}
              <button
                onClick={() => setShowCalendarModal(true)}
                className="flex flex-col items-center justify-center min-w-[70px] sm:min-w-[75px] text-gray-500 hover:text-blue-600 transition"
              >
                <Calendar className="w-5 h-5 mb-1" />
                <span className="text-[11px] sm:text-xs font-medium">
                  More dates
                </span>
              </button>
            </div>
          </div>

          {/* 🕒 TIME PICKER SECTION */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
              Pick a time
            </h3>
            <div className="relative w-full sm:max-w-xs">
              <select
                value={selectedTimeSlot ? selectedTimeSlot.time : ""}
                onChange={(e) => {
                  const selected = availableTimeSlots.find(
                    (slot) => slot.time === e.target.value
                  );
                  if (selected) handleTimeSlotSelect(selected);
                }}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 pl-4 pr-10 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {availableTimeSlots.map((slot) => (
                  <option key={slot.time} value={slot.time}>
                    {slot.formattedTime}
                  </option>
                ))}
              </select>
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* 📝 SUMMARY SECTION */}
          {selectedTimeSlot && (
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h4 className="text-sm text-gray-800 font-medium">
                    {selectedTour?.tourName || "Tour Experience"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(travelDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "2-digit",
                    })}{" "}
                    • {selectedTimeSlot.formattedTime}
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Get current time slot's available options
                    const options = selectedTimeSlot?.availableOptions || [];

                    if (options.length === 0) {
                      alert(
                        "No option found for this time slot. Please select another."
                      );
                      return;
                    }

                    // Pick first option (or you could let user select one)
                    const selectedOption = options[0];

                    // Call handleBookNow with selected option
                    handleBookNow(selectedOption);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 px-5 sm:px-6 text-sm sm:text-base transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Calendar Modal */}
        <CalendarModal />
      </main>
      <Footer />
    </>
  );
}

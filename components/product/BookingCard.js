"use client";
import React, { useState, useEffect } from "react";
import { Check, Calendar as CalendarIcon } from "lucide-react";
import Calendarpage from "./CalendarPage";
import { useRouter } from "next/navigation";

export default function BookingCard({ price }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
   const router = useRouter();

  // Handle scroll to make card sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


    // Format date for display and URL
const formatDate = (date) => {
  if (!date) return null;
  
  let actualDate;
  if (date instanceof Date) {
    actualDate = date;
  } else if (Array.isArray(date) && date[0]) {
    actualDate = date[0];
  } else {
    return null;
  }

    const year = actualDate.getFullYear();
  const month = String(actualDate.getMonth() + 1).padStart(2, '0');
  const day = String(actualDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`; // YYYY-MM-DD format
};

  // Format date for display only
const formatDisplayDate = (date) => {
  if (!date) return null;
  
  let actualDate;
  if (date instanceof Date) {
    actualDate = date;
  } else if (Array.isArray(date) && date[0]) {
    actualDate = date[0];
  } else {
    return null;
  }
    return actualDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};



    const handleCheckAvailability = () => {
    if (!date) {
      alert("Please select a date first");
      return;
    }

    // Extract tourId and contractId from price object
    const tourId = price?.tourId;
    const contractId = price?.contractId;
    const formattedDate = formatDate(date);

    if (!tourId || !contractId) {
      alert("Tour information is missing. Please try again.");
      return;
    }

    // Navigate to availability page with parameters
    router.push(`/availability?tourId=${tourId}&date=${formattedDate}&contractId=${contractId}`);
  };


  return (
    <>
      <div 
        className={`w-full max-w-md mx-auto h-max bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 backdrop-blur-sm shadow-2xl rounded-3xl p-6 overflow-hidden space-y-5 border border-white/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl ${
          isSticky ? 'sticky top-[140px] right-10 z-25 max-w-sm scale-95' : 'relative'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.8) 50%, rgba(243,244,246,0.7) 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
        
        {/* Price Section */}
        <div className="relative">
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          <div className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent border-b border-gray-200 pb-2">
            ${price?.amount}
            <span className="text-lg font-normal text-gray-500 ml-2">/ per person</span>
          </div>
        </div>

        {/* Select Date Section */}
        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full border-2 border-gray-200 rounded-xl py-3 px-5 text-left text-gray-700 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300 flex items-center justify-between group bg-white/60 backdrop-blur-sm"
          >
            <span className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              {date ? (
                <span className="font-medium">{formatDisplayDate(date)}</span>
              ) : (
                <span>Select Your Date</span>
              )}
            </span>
            <div className={`transform transition-transform duration-300 ${showCalendar ? 'rotate-180' : ''}`}>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Check Availability Button */}
        <button
         onClick={handleCheckAvailability}
        className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white font-semibold py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative">Check Availability</span>
        </button>

        {/* Why Glamour Adventures */}
        <div className="pt-2 border-t border-gray-200">
          <h3 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Why Glamour Adventures?
          </h3>
          <ul className="space-y-1 text-gray-600">
            {[
              "Trusted platform used by 100K+ people, each month",
              "Get the lowest prices and last minute availability", 
              "Discover and connect with 10,000+ experiences",
              "Browse verified reviews and professional photographs",
              "Have a question? Live chat with our experts 24/7",
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                  <Check className="w-4 h-4 mt-1 text-green-600" />
                <span className="text-sm leading-relaxed group-hover:text-gray-800 transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fixed Calendar Overlay */}
      {showCalendar && (
        <Calendarpage setShowCalendar={setShowCalendar} setDate={setDate} date={date} />
      )}

      {/* CSS Styles */}
      <style jsx global>{`
        .custom-calendar {
          width: 100% !important;
          border: none !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
        }
        
        .custom-calendar .react-calendar__navigation {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          border-radius: 12px 12px 0 0 !important;
          padding: 16px !important;
          margin-bottom: 0 !important;
        }
        
        .custom-calendar .react-calendar__navigation button {
          color: white !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          background: transparent !important;
          border: none !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
        
        .custom-calendar .react-calendar__navigation button:hover {
          background: rgba(255,255,255,0.2) !important;
          transform: scale(1.05) !important;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays {
          background: rgba(59, 130, 246, 0.1) !important;
          padding: 12px 0 !important;
          margin: 0 !important;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          color: #4f46e5 !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        
        .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important;
        }
        
        .custom-calendar .react-calendar__tile {
          background: transparent !important;
          border: none !important;
          padding: 12px 8px !important;
          margin: 2px !important;
          border-radius: 10px !important;
          transition: all 0.3s ease !important;
          font-weight: 500 !important;
          position: relative !important;
          overflow: hidden !important;
        }
        
        .custom-calendar .react-calendar__tile:hover {
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%) !important;
          transform: scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
        }
        
        .custom-calendar .react-calendar__tile--active {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          color: white !important;
          transform: scale(1.1) !important;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5) !important;
        }
        
        .custom-calendar .react-calendar__tile--now {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: white !important;
          font-weight: bold !important;
        }
        
        .custom-calendar .past-date {
          color: #d1d5db !important;
          background: #f9fafb !important;
          cursor: not-allowed !important;
        }
        
        .custom-calendar .past-date:hover {
          background: #f9fafb !important;
          transform: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </>
  );
}
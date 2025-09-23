"use client";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { X } from "lucide-react";
import React from "react";

export default function Calendarpage({ setShowCalendar, setDate, date }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize

  // current aur next month ke dates
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  // disable past dates
  const tileClassName = ({ date: tileDate, view }) => {
    if (view === "month") {
      const normalizedTileDate = new Date(tileDate);
      normalizedTileDate.setHours(0, 0, 0, 0);

      if (normalizedTileDate < today) {
        return "opacity-30 cursor-not-allowed";
      }
    }
    return "";
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={() => setShowCalendar(false)}
    >
      <div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowCalendar(false)}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Choose Your Perfect Date
          </h2>
          <p className="text-gray-600">Select a date to check availability</p>
        </div>

        {/* Two Calendars */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center items-stretch">
          {/* Current Month */}
          <div className="flex-1 w-full max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              {currentMonthStart.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Calendar
              onChange={(value) => {
                setDate(value);
                setShowCalendar(false);
              }}
              value={date}
              minDate={today}
              maxDate={currentMonthEnd}
              tileClassName={tileClassName}
              showNeighboringMonth={false}
              activeStartDate={currentMonthStart}
              className="custom-calendar"
            />
          </div>

          {/* Next Month */}
         <div className="flex-1 w-full max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              {nextMonthStart.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <Calendar
              onChange={(value) => {
                setDate(value);
                setShowCalendar(false);
              }}
              value={date}
              minDate={nextMonthStart}
              maxDate={nextMonthEnd}
              tileClassName={tileClassName}
              showNeighboringMonth={false}
              activeStartDate={nextMonthStart}
              className="custom-calendar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

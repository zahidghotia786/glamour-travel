"use client";
import React, { useState } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const SearchWithCalendar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (date) => {
    return date ? date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }) : 'Select Date';
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSameDate = (date1, date2) => {
    return date1 && date2 &&
           date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className=" pt-10 pb-10 bg-white flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full border border-gray-200 p-4 md:p-6 rounded-3xl shadow-lg bg-white">
        {/* Main Search Container */}

<div className="text-center max-w-3xl mx-auto px-4 py-12">
 
  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
    Find and book the best tickets for attractions, tours, and activities in Dubai. 
    Select your date and explore the wonders of this magnificent city.
  </p>
</div>


        <div className="bg-white rounded-3xl p-4 md:p-8 shadow-md border border-gray-200">
          <div className="flex flex-col lg:flex-row items-center gap-4 md:gap-6">
            {/* Search Input */}
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations, theme parks, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 md:py-4 outline-none rounded-2xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base transition-all duration-300"
              />
            </div>
            
            {/* Date Picker */}
            <div className="relative w-full lg:w-auto">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 md:py-4 rounded-2xl bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-400 hover:bg-gray-100 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">{formatDate(selectedDate)}</span>
              </button>

              {/* Calendar Dropdown */}
              {showCalendar && (
                <>
                  {/* Backdrop overlay */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCalendar(false)}
                  />
                  
                  {/* Calendar */}
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6 z-50 w-full max-w-xs md:w-[300px]">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4 text-gray-800">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h3 className="font-bold text-base md:text-lg">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map(day => (
                        <div key={day} className="p-1 text-center text-xs font-semibold text-gray-500">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1 text-gray-800">
                      {getDaysInMonth(currentMonth).map((date, index) => (
                        <button
                          key={index}
                          onClick={() => date && handleDateSelect(date)}
                          disabled={!date || date < new Date().setHours(0,0,0,0)}
                          className={`
                            p-1 md:p-2 text-xs md:text-sm rounded-lg transition-all duration-200 relative font-medium
                            ${!date ? 'invisible' : ''}
                            ${date && date < new Date().setHours(0,0,0,0) 
                              ? 'text-gray-300 blur-[1px] cursor-not-allowed' 
                              : 'hover:bg-blue-50 cursor-pointer hover:scale-105 text-gray-700'
                            }
                            ${isSameDate(date, selectedDate) 
                              ? 'bg-blue-500 text-white shadow-md scale-105' 
                              : ''
                            }
                            ${isToday(date) && !isSameDate(date, selectedDate)
                              ? 'bg-blue-100 text-blue-600 font-bold border border-blue-300' 
                              : ''
                            }
                          `}
                        >
                          {date && date.getDate()}
                        </button>
                      ))}
                    </div>

                    {/* Quick Select Options */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleDateSelect(new Date())}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200 border border-blue-200"
                        >
                          Today
                        </button>
                        <button
                          onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            handleDateSelect(tomorrow);
                          }}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all duration-200 border border-purple-200"
                        >
                          Tomorrow
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Search Button */}
            <button className="w-full lg:w-auto bg-blue-500 text-white font-medium px-6 py-3 md:py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:bg-blue-600">
              <Search className="w-4 h-4 md:w-5 md:h-5" />
              Search
            </button>
          </div>
        </div>

        {/* Display Selected Information */}
        {(searchQuery || selectedDate) && (
          <div className="mt-4 md:mt-6 bg-gray-50 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-2 md:mb-4 text-base md:text-lg">Search Parameters:</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {searchQuery && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                  <span className="font-semibold">Query:</span> {searchQuery}
                </span>
              )}
              {selectedDate && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200">
                  <span className="font-semibold">Date:</span> {formatDate(selectedDate)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchWithCalendar;
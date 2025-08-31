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
<div className="h-max pt-10 pb-10 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto w-full border border-white/10 p-6 rounded-3xl shadow-2xl bg-gradient-to-r from-cyan-700/10 via-blue-700/10 to-purple-700/10 backdrop-blur-lg">
        {/* Main Search Container */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 " />
              <input
                type="text"
                placeholder="Search destinations, theme parks, attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 outline-none rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-lg transition-all duration-300"
              />
            </div>
            
            {/* Date Picker */}
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 focus:ring-2 focus:ring-cyan-400  hover:bg-white/20 transition-all duration-300 min-w-[200px]"
              >
                <Calendar className="w-5 h-5 text-cyan-300" />
                <span className="">{formatDate(selectedDate)}</span>
              </button>

              {/* Calendar Dropdown - Fixed positioning */}
              {showCalendar && (
                <>
                  {/* Backdrop overlay */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowCalendar(false)}
                  />
                  
                  {/* Calendar */}
                  <div className="absolute top-full mt-3 right-0 bg-gradient-to-r from-cyan-700/90 via-blue-700/90 to-purple-700 rounded-3xl shadow-2xl border border-white/20 p-6 z-50 min-w-[350px]">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6  text-white">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 /80 hover:"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h3 className="font-bold text-lg ">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                      </h3>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 /80 hover:"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-2 mb-3">
                      {dayNames.map(day => (
                        <div key={day} className="p-2 text-center text-sm font-semibold text-cyan-300">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2 text-white">
                      {getDaysInMonth(currentMonth).map((date, index) => (
                        <button
                          key={index}
                          onClick={() => date && handleDateSelect(date)}
                          disabled={!date || date < new Date().setHours(0,0,0,0)}
                          className={`
                            p-2 text-sm rounded-xl transition-all duration-200 relative font-medium
                            ${!date ? 'invisible' : ''}
                            ${date && date < new Date().setHours(0,0,0,0) 
                              ? '/30 cursor-not-allowed' 
                              : 'hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30 cursor-pointer /90 hover: hover:scale-105'
                            }
                            ${isSameDate(date, selectedDate) 
                              ? 'bg-gradient-to-r from-cyan-500 to-purple-500  shadow-lg scale-105' 
                              : ''
                            }
                            ${isToday(date) && !isSameDate(date, selectedDate)
                              ? 'bg-white/20 text-cyan-300 font-bold border border-cyan-400/50' 
                              : ''
                            }
                          `}
                        >
                          {date && date.getDate()}
                        </button>
                      ))}
                    </div>

                    {/* Quick Select Options */}
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleDateSelect(new Date())}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-200 border border-cyan-400/30 hover:scale-105"
                        >
                          Today
                        </button>
                        <button
                          onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            handleDateSelect(tomorrow);
                          }}
                          className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 border border-purple-400/30 hover:scale-105"
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
            <button className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-3 hover:scale-105 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>

        {/* Display Selected Information */}
        {(searchQuery || selectedDate) && (
          <div className="mt-6 bg-white/10 backdrop-blur-2xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="font-bold  mb-4 text-lg">Search Parameters:</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              {searchQuery && (
                <span className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-600 font-bold px-4 py-2 rounded-full border border-cyan-400/30 backdrop-blur-xl">
                  <span className="text-cyan-700">Query :</span> {searchQuery}
                </span>
              )}
              {selectedDate && (
                <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 font-bold px-4 py-2 rounded-full border border-purple-400/30 backdrop-blur-xl">
                  <span className="text-purple-700 font-bold">Date :</span> {formatDate(selectedDate)}
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
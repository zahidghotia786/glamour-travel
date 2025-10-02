import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

const TourSummarySection = ({ urlParams, pickup, onPickupChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="mr-3 text-blue-600 w-5 h-5 md:w-6 md:h-6" />
        Tour Details
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600 text-sm md:text-base">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500" />
            <span>Date: {urlParams.tourDate}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm md:text-base">
            <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-500" />
            <span>Time: {urlParams.startTime}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600 text-sm md:text-base">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2 text-red-500" />
            <span>Tour ID: {urlParams.tourId}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm md:text-base">
            <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-purple-500" />
            <span>Transfer ID: {urlParams.transferId}</span>
          </div>
        </div>
      </div>

      {/* Pickup Location */}
      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Pickup Location (Optional)
        </label>
        <input
          type="text"
          value={pickup}
          onChange={(e) => onPickupChange(e.target.value)}
          className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
          placeholder="Enter pickup location if required"
        />
      </div>
    </div>
  );
};

export default TourSummarySection;
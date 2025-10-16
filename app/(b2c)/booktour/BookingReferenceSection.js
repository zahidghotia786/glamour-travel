  import React from 'react';

  const BookingReferenceSection = ({ clientReferenceNo, onReferenceChange }) => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Booking Reference
        </h2>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Client Reference Number
          </label>
          <input
            type="text"
            value={clientReferenceNo}
            onChange={(e) => onReferenceChange(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
            required
          />
        </div>
      </div>
    );
  };

  export default BookingReferenceSection;
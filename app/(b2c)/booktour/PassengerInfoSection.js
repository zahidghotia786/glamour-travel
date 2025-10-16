import React from 'react';
import { Mail, Phone, Users } from 'lucide-react';

const PassengerInfoSection = ({ formData, onInputChange, onPassengerChange }) => {
  const getPassengerLabel = (index) => {
    if (index === 0) return "Lead Passenger (Primary Contact)";
    return `Passenger ${index + 1}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
        <Users className="mr-3 text-blue-600 w-6 h-6" />
        Passenger Details
      </h2>


      {/* Passenger fields */}
      {formData.passengers.map((passenger, index) => (
        <div
          key={index}
          className={`rounded-xl p-5 mb-5 ${
            index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <h3 className="font-semibold text-lg text-gray-800 mb-4">
            {getPassengerLabel(index)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                value={passenger.firstName}
                onChange={(e) => onPassengerChange(index, 'firstName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={passenger.lastName}
                onChange={(e) => onPassengerChange(index, 'lastName', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {index === 0 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Mail className="w-4 h-4 mr-1" /> Email *
                  </label>
                  <input
                    type="email"
                    value={passenger.email}
                    onChange={(e) => onPassengerChange(index, 'email', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Phone className="w-4 h-4 mr-1" /> Mobile *
                  </label>
                  <input
                    type="tel"
                    value={passenger.mobile}
                    onChange={(e) => onPassengerChange(index, 'mobile', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                  <input
                    type="text"
                    value={passenger.nationality}
                    onChange={(e) => onPassengerChange(index, 'nationality', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PassengerInfoSection;
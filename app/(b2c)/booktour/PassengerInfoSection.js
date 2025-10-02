import React from 'react';
import { User, Mail, Phone, Users } from 'lucide-react';

const PassengerInfoSection = ({ formData, onInputChange, onPassengerChange }) => {
  const getPassengerLabel = (index) => {
    if (index === 0) return "Lead Passenger (Primary Contact)";
    
    const adultCount = formData.adult;
    const childCount = formData.child;
    
    if (index < adultCount) return `Adult Passenger ${index + 1}`;
    if (index < adultCount + childCount) return `Child Passenger ${index - adultCount + 1}`;
    return `Infant Passenger ${index - adultCount - childCount + 1}`;
  };

  const getPassengerType = (index) => {
    if (index === 0) return "Adult (Lead)";
    
    const adultCount = formData.adult;
    const childCount = formData.child;
    
    if (index < adultCount) return "Adult";
    if (index < adultCount + childCount) return "Child";
    return "Infant";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-6">
        <Users className="mr-3 text-blue-600 w-5 h-5 md:w-6 md:h-6" />
        Passenger Information
      </h2>

      {/* Passenger Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Adults</label>
          <input
            type="number"
            min="1"
            value={formData.adult}
            onChange={(e) => onInputChange('adult', parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Children</label>
          <input
            type="number"
            min="0"
            value={formData.child}
            onChange={(e) => onInputChange('child', parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Infants</label>
          <input
            type="number"
            min="0"
            value={formData.infant}
            onChange={(e) => onInputChange('infant', parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
          />
        </div>
      </div>

      {/* Individual Passenger Forms */}
      <div className="space-y-6">
        {formData.passengers.map((passenger, index) => (
          <div key={index} className={`bg-${index === 0 ? 'blue' : 'gray'}-50 rounded-xl p-4 md:p-5 border ${index === 0 ? 'border-blue-200' : 'border-gray-200'}`}>
            <h3 className="font-semibold text-base md:text-lg text-gray-800 mb-3 md:mb-4">
              {getPassengerLabel(index)}
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium">
                {getPassengerType(index)}
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
                <select
                  value={passenger.prefix}
                  onChange={(e) => onPassengerChange(index, 'prefix', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  required
                >
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Master">Master</option>
                  <option value="Baby">Baby</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={passenger.firstName}
                  onChange={(e) => onPassengerChange(index, 'firstName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={passenger.lastName}
                  onChange={(e) => onPassengerChange(index, 'lastName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Enter last name"
                  required
                />
              </div>

              {index === 0 && ( // Only show email/mobile/nationality for lead passenger
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="inline w-4 h-4 mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={passenger.email}
                      onChange={(e) => onPassengerChange(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="inline w-4 h-4 mr-1" />
                      Mobile
                    </label>
                    <input
                      type="tel"
                      value={passenger.mobile}
                      onChange={(e) => onPassengerChange(index, 'mobile', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={passenger.nationality}
                      onChange={(e) => onPassengerChange(index, 'nationality', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      placeholder="Enter nationality"
                      required
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message/Notes</label>
                <textarea
                  value={passenger.message}
                  onChange={(e) => onPassengerChange(index, 'message', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  placeholder="Any special requests or information"
                  rows="2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerInfoSection;
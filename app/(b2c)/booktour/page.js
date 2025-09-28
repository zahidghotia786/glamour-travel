"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Phone, Mail, User, CreditCard, Check } from 'lucide-react';
import B2CPageLayout from '../B2CPageLayout';

export default function TourBookingPage() {
  const [urlParams, setUrlParams] = useState({});
  const [formData, setFormData] = useState({
    uniqueNo: Math.floor(Math.random() * 1000000),
    adult: 1,
    child: 0,
    infant: 0,
    pickup: '',
    clientReferenceNo: `REF-${Date.now()}`,
    leadPassenger: {
      serviceType: 'tour',
      prefix: 'Mr.',
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      nationality: '',
      message: '',
      leadPassenger: 1,
      paxType: 'Adult'
    }
  });

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = {
      tourId: urlSearchParams.get('tourId') || '',
      optionId: urlSearchParams.get('optionId') || '',
      tourDate: urlSearchParams.get('tourDate') || '',
      startTime: decodeURIComponent(urlSearchParams.get('startTime') || ''),
      transferId: urlSearchParams.get('transferId') || '',
      adultprice: urlSearchParams.get('adultprice') || '0',
      childprice: urlSearchParams.get('childprice') || '0'
    };
    setUrlParams(params);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeadPassengerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      leadPassenger: {
        ...prev.leadPassenger,
        [field]: value
      }
    }));
  };

  const calculateTotal = () => {
    const adultTotal = formData.adult * parseFloat(urlParams.adultprice || 0);
    const childTotal = formData.child * parseFloat(urlParams.childprice || 0);
    return adultTotal + childTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate passenger array based on counts but only with lead passenger details
    const passengers = [];
    
    // Add lead passenger
    passengers.push(formData.leadPassenger);
    
    // Add remaining passengers with minimal info
    for (let i = 1; i < formData.adult; i++) {
      passengers.push({
        serviceType: 'tour',
        prefix: 'Mr.',
        firstName: `Adult ${i + 1}`,
        lastName: 'Passenger',
        email: formData.leadPassenger.email,
        mobile: formData.leadPassenger.mobile,
        nationality: formData.leadPassenger.nationality,
        message: '',
        leadPassenger: 0,
        paxType: 'Adult'
      });
    }
    
    for (let i = 0; i < formData.child; i++) {
      passengers.push({
        serviceType: 'tour',
        prefix: 'Master',
        firstName: `Child ${i + 1}`,
        lastName: 'Passenger',
        email: formData.leadPassenger.email,
        mobile: formData.leadPassenger.mobile,
        nationality: formData.leadPassenger.nationality,
        message: '',
        leadPassenger: 0,
        paxType: 'Child'
      });
    }
    
    for (let i = 0; i < formData.infant; i++) {
      passengers.push({
        serviceType: 'tour',
        prefix: 'Baby',
        firstName: `Infant ${i + 1}`,
        lastName: 'Passenger',
        email: formData.leadPassenger.email,
        mobile: formData.leadPassenger.mobile,
        nationality: formData.leadPassenger.nationality,
        message: '',
        leadPassenger: 0,
        paxType: 'Infant'
      });
    }
    
    const bookingData = {
      uniqueNo: formData.uniqueNo,
      TourDetails: [{
        serviceUniqueId: Math.floor(Math.random() * 999999),
        tourId: parseInt(urlParams.tourId),
        optionId: parseInt(urlParams.optionId),
        adult: formData.adult,
        child: formData.child,
        infant: formData.infant,
        tourDate: urlParams.tourDate,
        timeSlotId: 1,
        startTime: urlParams.startTime,
        transferId: parseInt(urlParams.transferId),
        pickup: formData.pickup,
        adultRate: parseFloat(urlParams.adultprice),
        childRate: parseFloat(urlParams.childprice),
        serviceTotal: calculateTotal().toString()
      }],
      passengers: passengers,
      clientReferenceNo: formData.clientReferenceNo
    };

    console.log('Booking Data:', bookingData);
    // Here you would typically send the data to your booking API
    alert('Booking submitted successfully! Check console for data structure.');
  };

  return (
          <B2CPageLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center mb-2">Complete Your Booking</h1>
          <p className="text-center text-blue-100">Just a few more steps to confirm your amazing tour experience</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Booking Form */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                
                {/* Tour Summary Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Calendar className="mr-3 text-blue-600" />
                    Tour Details
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        <span>Date: {urlParams.tourDate}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-2 text-green-500" />
                        <span>Time: {urlParams.startTime}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-2 text-red-500" />
                        <span>Tour ID: {urlParams.tourId}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-5 h-5 mr-2 text-purple-500" />
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
                      value={formData.pickup}
                      onChange={(e) => handleInputChange('pickup', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter pickup location if required"
                    />
                  </div>
                </div>

                {/* Passenger Information */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
                    <User className="mr-3 text-blue-600" />
                    Lead Passenger Information
                  </h2>

                  {/* Passenger Counts */}
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Adults</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.adult}
                        onChange={(e) => handleInputChange('adult', parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Children</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.child}
                        onChange={(e) => handleInputChange('child', parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Infants</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.infant}
                        onChange={(e) => handleInputChange('infant', parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Lead Passenger Details */}
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">
                      Lead Passenger Details
                      <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Primary Contact
                      </span>
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
                        <select
                          value={formData.leadPassenger.prefix}
                          onChange={(e) => handleLeadPassengerChange('prefix', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="Mr.">Mr.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Mrs.">Mrs.</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          value={formData.leadPassenger.firstName}
                          onChange={(e) => handleLeadPassengerChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter first name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={formData.leadPassenger.lastName}
                          onChange={(e) => handleLeadPassengerChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter last name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <Mail className="inline w-4 h-4 mr-1" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.leadPassenger.email}
                          onChange={(e) => handleLeadPassengerChange('email', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          value={formData.leadPassenger.mobile}
                          onChange={(e) => handleLeadPassengerChange('mobile', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter mobile number"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                        <input
                          type="text"
                          value={formData.leadPassenger.nationality}
                          onChange={(e) => handleLeadPassengerChange('nationality', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter nationality"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message/Notes</label>
                        <textarea
                          value={formData.leadPassenger.message}
                          onChange={(e) => handleLeadPassengerChange('message', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Any special requests or information"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passenger Summary */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Booking Summary:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>• {formData.adult} Adult(s) - Lead passenger details will be used for primary contact</div>
                      {formData.child > 0 && <div>• {formData.child} Child(ren) - Will be registered under lead passenger</div>}
                      {formData.infant > 0 && <div>• {formData.infant} Infant(s) - Will be registered under lead passenger</div>}
                    </div>
                  </div>
                </div>

                {/* Booking Reference */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Booking Reference
                  </h2>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Client Reference Number
                    </label>
                    <input
                      type="text"
                      value={formData.clientReferenceNo}
                      onChange={(e) => handleInputChange('clientReferenceNo', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CreditCard className="mr-3 text-blue-600" />
                    Booking Summary
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Adults ({formData.adult})</span>
                      <span className="font-semibold">${(formData.adult * parseFloat(urlParams.adultprice || 0)).toFixed(2)}</span>
                    </div>
                    
                    {formData.child > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Children ({formData.child})</span>
                        <span className="font-semibold">${(formData.child * parseFloat(urlParams.childprice || 0)).toFixed(2)}</span>
                      </div>
                    )}

                    {formData.infant > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Infants ({formData.infant})</span>
                        <span className="font-semibold">FREE</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      Free cancellation up to 24 hours
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      Instant confirmation
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      Mobile ticket accepted
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Complete Booking
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By completing this booking, you agree to our terms and conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </B2CPageLayout>
  );
}
import React from 'react';
import { CreditCard, Check, Users } from 'lucide-react';

const BookingSummarySection = ({ formData, urlParams, calculateTotal, onSubmit, loading, paymentMethod }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <CreditCard className="mr-2 text-blue-600 w-5 h-5" />
        Booking Summary
      </h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between py-1 border-b border-gray-100">
          <span className="text-sm text-gray-600 flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Passengers
          </span>
          <span className="text-sm font-semibold">{formData.adult}</span>
        </div>

        <div className="flex justify-between py-1 border-b border-gray-100">
          <span className="text-sm text-gray-600">Price per person</span>
          <span className="text-sm font-semibold">
            AED {parseFloat(urlParams.adultprice || 0).toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between py-1 border-b border-gray-100">
          <span className="text-sm text-gray-600">Payment Method</span>
          <span className="text-sm font-semibold">Apple Pay</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-bold text-gray-800">Total Amount</span>
          <span className="text-lg font-bold text-blue-600">
            AED {calculateTotal().toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-xs text-gray-600">
        <div className="flex items-center">
          <Check className="w-3 h-3 text-green-500 mr-1" />
          Free cancellation up to 24 hours
        </div>
        <div className="flex items-center">
          <Check className="w-3 h-3 text-green-500 mr-1" />
          Instant confirmation
        </div>
        <div className="flex items-center">
          <Check className="w-3 h-3 text-green-500 mr-1" />
          Mobile ticket accepted
        </div>
      </div>

      {/* Desktop Submit Button */}
      <div className="hidden lg:block">
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-base hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `Pay $${calculateTotal().toFixed(2)}`
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        By completing this booking, you agree to our terms and conditions
      </p>
    </div>
  );
};

export default BookingSummarySection;
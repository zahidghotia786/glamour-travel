import React from 'react';
import { CreditCard, Check, Smartphone, Building } from 'lucide-react';

const BookingSummarySection = ({ formData, urlParams, calculateTotal, onSubmit, loading, paymentMethod }) => {
  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'ziina':
        return <Smartphone className="w-4 h-4" />;
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank':
        return <Building className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case 'ziina':
        return 'Ziina Pay';
      case 'card':
        return 'Credit/Debit Card';
      case 'bank':
        return 'Bank Transfer';
      default:
        return 'Payment';
    }
  };

  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <CreditCard className="mr-3 text-blue-600 w-6 h-6" />
          Booking Summary
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Adults ({formData.adult})</span>
            <span className="font-semibold">
              ${(formData.adult * parseFloat(urlParams.adultprice || 0)).toFixed(2)}
            </span>
          </div>
          
          {formData.child > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Children ({formData.child})</span>
              <span className="font-semibold">
                ${(formData.child * parseFloat(urlParams.childprice || 0)).toFixed(2)}
            </span>
            </div>
          )}

          {formData.infant > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Infants ({formData.infant})</span>
              <span className="font-semibold">FREE</span>
            </div>
          )}

          {/* 🆕 Payment Method Display */}
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              {getPaymentMethodIcon()}
              <span className="ml-2">Payment Method</span>
            </span>
            <span className="font-semibold text-sm">
              {getPaymentMethodText()}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total Amount</span>
            <span className="text-2xl font-bold text-blue-600">
              ${calculateTotal().toFixed(2)}
            </span>
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
          <div className="flex items-center">
            <Check className="w-4 h-4 text-green-500 mr-2" />
            Secure payment processing
          </div>
        </div>

        {/* Desktop Submit Button */}
        <div className="hidden lg:block">
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              `Pay $${calculateTotal().toFixed(2)}`
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          By completing this booking, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default BookingSummarySection;
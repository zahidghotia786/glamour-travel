import React from 'react';
import { Apple } from 'lucide-react';

const PaymentMethodSection = ({ paymentMethod, onPaymentMethodChange }) => {

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>

      <div className="flex items-center justify-between border rounded-xl p-4 cursor-not-allowed bg-gray-50 border-blue-500">
        <div className="flex items-center">
          <Apple className="w-6 h-6 text-blue-600 mr-2" />
          <span className="font-semibold text-gray-800">Apple Pay</span>
        </div>
        <input
          type="radio"
          checked={paymentMethod === 'applepay'}
          onChange={() => onPaymentMethodChange('applepay')}
          className="text-blue-600 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default PaymentMethodSection;
import React from 'react';
import { CreditCard, Smartphone, Building } from 'lucide-react';

const PaymentMethodSection = ({ paymentMethod, onPaymentMethodChange }) => {
  const paymentMethods = [
    {
      id: "ziina",
      name: "Ziina Pay",
      description: "Secure digital wallet payment",
      icon: Smartphone,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Pay with Visa, Mastercard, or Amex",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Direct bank transfer",
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-6">
        <CreditCard className="mr-3 text-blue-600 w-6 h-6" />
        Payment Method
      </h2>

      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          const isSelected = paymentMethod === method.id;
          
          return (
            <div
              key={method.id}
              onClick={() => onPaymentMethodChange(method.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? `${method.bgColor} ${method.borderColor} border-2 transform scale-105`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${method.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${method.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                
                <div className={`w-5 h-5 rounded-full border-2 ${
                  isSelected 
                    ? `bg-blue-600 border-blue-600` 
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Method Info */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your booking will be created first, then you'll be redirected to complete payment securely.
        </p>
      </div>
    </div>
  );
};

export default PaymentMethodSection;
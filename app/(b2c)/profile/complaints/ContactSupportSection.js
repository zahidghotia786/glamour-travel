// components/ContactSupportSection.jsx
import React from 'react';
import { Phone, Mail, MessageCircle, Clock, Globe } from 'lucide-react';

const ContactSupportSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-blue-100 mb-6">
            Our support team is available to help you with urgent issues and emergencies.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5" />
              <div>
                <p className="font-semibold">Emergency Hotline</p>
                <p className="text-blue-100">+971 4 123 4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">WhatsApp Support</p>
                <p className="text-blue-100">+971 50 123 4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5" />
              <div>
                <p className="font-semibold">Email Support</p>
                <p className="text-blue-100">support@tourism.ae</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold">Support Hours</h3>
          </div>
          
          <div className="space-y-2 text-blue-100">
            <div className="flex justify-between">
              <span>Sunday - Thursday</span>
              <span>8:00 AM - 8:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Friday - Saturday</span>
              <span>9:00 AM - 6:00 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Emergency Support</span>
              <span>24/7 Available</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-blue-500">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm text-blue-100">GST UAE Support Center</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportSection;
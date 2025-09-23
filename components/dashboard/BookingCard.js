'use client';
import { useState } from 'react';

export default function BookingCard() {
  const [bookings] = useState([
    {
      id: 1,
      attraction: "Burj Khalifa - At the Top",
      date: "2024-01-15",
      time: "14:00",
      tickets: 2,
      total: "AED 350",
      status: "confirmed",
      image: "/images/burj-khalifa.jpg"
    },
    {
      id: 2,
      attraction: "Dubai Desert Safari",
      date: "2024-01-20",
      time: "16:00",
      tickets: 4,
      total: "AED 600",
      status: "upcoming",
      image: "/images/desert-safari.jpg"
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
      
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏙️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{booking.attraction}</h3>
                <p className="text-gray-600">
                  {booking.date} at {booking.time} • {booking.tickets} tickets
                </p>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-xl font-bold text-gray-900">{booking.total}</p>
              <div className="flex space-x-2 mt-2">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Details
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Download Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
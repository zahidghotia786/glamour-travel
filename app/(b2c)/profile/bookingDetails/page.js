'use client';
import React, { useState } from 'react';
import { 
  Download, 
  QrCode, 
  Calendar, 
  Clock, 
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Printer,
  Copy,
  ExternalLink
} from 'lucide-react';

const TicketDetailsModal = ({ booking, onClose }) => {
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTicketDetails = async () => {
    if (!booking?.apiResponse?.result?.details?.[0]) {
      setError('No booking details available');
      return;
    }

    const bookingDetail = booking.apiResponse.result.details[0];
    
    const ticketRequest = {
      uniqueNo: parseInt(bookingDetail.serviceUniqueId) || 0,
      referenceNo: bookingDetail.referenceNo || booking.reference,
      bookedOption: [
        {
          serviceUniqueId: bookingDetail.serviceUniqueId,
          bookingId: bookingDetail.bookingId
        }
      ]
    };

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/booking/tickets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketRequest),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch ticket details');
      }

      setTicketData(result.result);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ticket details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = () => {
    if (ticketData?.ticketURL) {
      window.open(ticketData.ticketURL, '_blank');
    }
  };

  const handlePrintTicket = () => {
    const printContent = document.getElementById('ticket-content');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${ticketData?.referenceNo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .ticket { border: 2px solid #000; padding: 20px; max-width: 400px; }
            .header { text-align: center; margin-bottom: 20px; }
            .barcode { text-align: center; margin: 20px 0; }
            .details { margin: 10px 0; }
            .section { margin: 15px 0; padding: 10px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
    alert('Copied to clipboard!');
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ticket Details</h2>
            <p className="text-gray-600 text-sm mt-1">
              Booking Reference: {booking?.reference}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!ticketData && !loading && (
            <div className="text-center py-8">
              <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Ticket Details Not Loaded
              </h3>
              <p className="text-gray-500 mb-6">
                Click the button below to fetch ticket information from the tour operator.
              </p>
              <button
                onClick={fetchTicketDetails}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Fetch Ticket Details
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading ticket details...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          {ticketData && (
            <div id="ticket-content">
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{ticketData.optionName || 'Tour Ticket'}</h1>
                    <div className="flex items-center space-x-4 text-blue-100">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(ticketData.BookingStatus)}
                        <span>{ticketData.BookingStatus}</span>
                      </div>
                      <div>•</div>
                      <div>Ref: {ticketData.referenceNo}</div>
                      {ticketData.pnrNumber && (
                        <>
                          <div>•</div>
                          <div>PNR: {ticketData.pnrNumber}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{ticketData.bookingId}</div>
                    <div className="text-blue-100 text-sm">Booking ID</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Ticket Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Validity Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Validity Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Validity</label>
                        <p className="font-medium">{ticketData.validity || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Extra Details</label>
                        <p className="font-medium">{ticketData.validityExtraDetails || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Tour Slot</label>
                        <p className="font-medium">{ticketData.slot || 'Not specified'}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Print Type</label>
                        <p className="font-medium">{ticketData.printType || 'Standard'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Passenger Details */}
                  {ticketData.ticketDetails && ticketData.ticketDetails.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Ticket Details</h3>
                      <div className="space-y-3">
                        {ticketData.ticketDetails.map((detail, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-medium">{detail.type}</span>
                                {detail.barCode && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    Barcode: {detail.barCode}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="flex space-x-4 text-sm">
                                  {detail.noOfAdult > 0 && (
                                    <span>Adults: {detail.noOfAdult}</span>
                                  )}
                                  {detail.noOfchild > 0 && (
                                    <span>Children: {detail.noOfchild}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Booking Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Created: {new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>Time: {new Date(booking.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>Passengers: {booking.passengerCount}</span>
                      </div>
                      {booking.leadPassenger && (
                        <div className="md:col-span-2">
                          <span className="text-gray-500">Lead Passenger: </span>
                          <span className="font-medium">
                            {booking.leadPassenger.firstName} {booking.leadPassenger.lastName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Actions & Barcode */}
                <div className="space-y-6">
                  {/* Download Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Ticket Actions</h3>
                    <div className="space-y-2">
                      {ticketData.ticketURL && (
                        <button
                          onClick={handleDownloadTicket}
                          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Ticket</span>
                        </button>
                      )}
                      
                      <button
                        onClick={handlePrintTicket}
                        className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Print Ticket</span>
                      </button>

                      {ticketData.referenceNo && (
                        <button
                          onClick={() => copyToClipboard(ticketData.referenceNo)}
                          className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy Reference</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Barcode/QR Section */}
                  {ticketData.ticketDetails?.[0]?.barCode && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                      <h3 className="font-semibold text-gray-800 mb-3">Ticket Barcode</h3>
                      <div className="bg-white p-4 border border-gray-300 rounded">
                        <div className="font-mono text-lg tracking-widest">
                          {ticketData.ticketDetails[0].barCode}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">Present this barcode at entry</div>
                      </div>
                    </div>
                  )}

                  {/* Quick Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Important Notes</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Arrive 15 minutes before your scheduled slot</li>
                      <li>• Bring valid ID for verification</li>
                      <li>• Keep this ticket accessible during the tour</li>
                      {ticketData.printType === 'QR Code' && (
                        <li>• QR code will be scanned at entry points</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="text-sm text-gray-500">
            {ticketData ? 'Ticket details loaded successfully' : 'Ready to fetch ticket details'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            {ticketData && (
              <button
                onClick={handleDownloadTicket}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open Ticket</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
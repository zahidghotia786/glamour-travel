"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Download,
  Eye,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { getUserBookings, cancelBooking } from "@/lib/bookingService";
import TicketDetailsModal from "../bookingDetails/page";

const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Fetch bookings from backend API
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button click
  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setCancellationReason("");
    setShowCancelConfirm(true);
  };

  // Confirm cancellation
const handleConfirmCancel = async () => {
  if (!bookingToCancel || !cancellationReason.trim()) {
    alert("Please provide a cancellation reason");
    return;
  }

  try {
    setCancelling(true);
    
    // Prepare cancellation data
    const cancellationData = {
      bookingId: bookingToCancel.apiResponse?.result?.details?.[0]?.bookingId,
      referenceNo: bookingToCancel.reference,
      cancellationReason: cancellationReason.trim()
    };

    // Call cancellation API
    const result = await cancelBooking(cancellationData);

    if (result.statuscode === 200) {
      // Success - update local state to reflect cancelled status
      setBookings(prev => prev.map(booking => 
        booking.id === bookingToCancel.id 
          ? { ...booking, status: 'CANCELLED' }
          : booking
      ));
      
      // Show success message
      alert("Booking cancelled successfully!");
      
      // Close modal
      setShowCancelConfirm(false);
      setBookingToCancel(null);
      setCancellationReason("");
    } else {
      throw new Error(result.error || "Failed to cancel booking");
    }
  } catch (error) {
    console.error("Cancellation error:", error);
    alert(`Cancellation failed: ${error.message}`);
  } finally {
    setCancelling(false);
  }
};



  // Cancel the cancellation process
  const handleCancelCancellation = () => {
    setShowCancelConfirm(false);
    setBookingToCancel(null);
    setCancellationReason("");
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "failed":
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const classes = {
      confirmed: "bg-green-100 text-green-700",
      success: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return `px-3 py-1 rounded-full text-xs font-medium ${
      classes[statusLower] || "bg-gray-100 text-gray-700"
    }`;
  };

  const formatStatus = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "success") return "Confirmed";
    return status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTourType = (apiResponse) => {
    if (!apiResponse) return "Tour Booking";

    if (apiResponse.error?.includes("6 Emirates")) {
      return "6 Emirates in a Day Tour with Lunch";
    }

    if (apiResponse.result?.details?.[0]?.servicetype) {
      return apiResponse.result.details[0].servicetype;
    }

    return "Tour Booking";
  };

  // Check if booking can be cancelled
  const canCancelBooking = (booking) => {
    const status = booking.status?.toLowerCase();
    return (status === "confirmed" || status === "pending" || status === "success") ||
           booking.paymentStatus === "PAID" &&
           booking.apiResponse?.result?.details?.[0]?.bookingId;
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming")
      return ["pending", "confirmed"].includes(booking.status?.toLowerCase());
    if (activeTab === "completed")
      return booking.status?.toLowerCase() === "success";
    if (activeTab === "cancelled")
      return ["failed", "cancelled"].includes(booking.status?.toLowerCase());
    return true;
  });

  const tabs = [
    { id: "all", label: "All Bookings", count: bookings.length },
    {
      id: "upcoming",
      label: "Upcoming",
      count: bookings.filter((b) =>
        ["pending", "confirmed"].includes(b.status?.toLowerCase())
      ).length,
    },
    {
      id: "completed",
      label: "Completed",
      count: bookings.filter((b) => b.status?.toLowerCase() === "success")
        .length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: bookings.filter((b) =>
        ["failed", "cancelled"].includes(b.status?.toLowerCase())
      ).length,
    },
  ];

  const handleDownloadTicket = async (booking) => {
    if (booking.apiResponse?.result?.details?.[0]?.downloadRequired) {
      // Implement download functionality
      console.log("Download ticket for:", booking.reference);
    } else {
      alert("Ticket download not available for this booking");
    }
  };

  const handleContactSupport = (booking) => {
    const message = `Booking Reference: ${booking.reference}\nStatus: ${
      booking.status
    }\nIssue: ${booking.apiResponse?.error || "Need assistance"}`;
    console.log("Contact support:", message);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Error loading bookings: {error}</p>
          <button
            onClick={loadBookings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-gray-600 mt-1">
                View and manage your tour bookings
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadBookings}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          <div className="p-6 space-y-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No bookings found</p>
                <p className="text-gray-400 mt-2">
                  When you make bookings, they will appear here.
                </p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Left Side - Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {getTourType(booking.apiResponse)}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Reference: {booking.reference}
                            {booking.apiResponse?.result?.details?.[0]
                              ?.bookingId && (
                              <span className="ml-4">
                                Booking ID:{" "}
                                {
                                  booking.apiResponse.result.details[0]
                                    .bookingId
                                }
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <span className={getStatusBadge(booking.status)}>
                            {formatStatus(booking.status)}
                          </span>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Booked: {formatDate(booking.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>At: {formatTime(booking.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{booking.passengerCount} Passenger(s)</span>
                        </div>
                      </div>

                      {/* Lead Passenger Info */}
                      {booking.leadPassenger && (
                        <div className="bg-white rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Lead Passenger
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Name: </span>
                              <span className="font-medium">
                                {booking.leadPassenger.firstName}{" "}
                                {booking.leadPassenger.lastName}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Email: </span>
                              <span className="font-medium">
                                {booking.leadPassenger.email}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Mobile: </span>
                              <span className="font-medium">
                                {booking.leadPassenger.mobile}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                Nationality:{" "}
                              </span>
                              <span className="font-medium">
                                {booking.leadPassenger.nationality}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment & API Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Payment Details
                          </h4>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Amount:</span>
                              <span className="font-medium">
                                {booking.currency} {booking.totalGross}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Status:</span>
                              <span
                                className={`font-medium ${
                                  booking.paymentStatus === "PAID"
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {booking.paymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            API Response
                          </h4>
                          <div className="space-y-1">
                            {booking.apiResponse?.error ? (
                              <div className="text-red-600 text-sm">
                                <strong>Error:</strong>{" "}
                                {booking.apiResponse.error}
                              </div>
                            ) : booking.apiResponse?.result?.details?.[0] ? (
                              <div className="text-green-600 text-sm">
                                <strong>Status:</strong>{" "}
                                {booking.apiResponse.result.details[0].status}
                              </div>
                            ) : (
                              <div className="text-gray-500 text-sm">
                                No API response data
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="lg:w-48 space-y-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          {booking.currency} {booking.totalGross}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.paymentStatus === "PAID"
                            ? "Paid"
                            : "Payment Pending"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleDownloadTicket(booking)}
                          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>

                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>

                        {/* Cancel Button - Only show for cancellable bookings */}
                        {canCancelBooking(booking) && (
                          <button
                            onClick={() => handleCancelClick(booking)}
                            className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Cancel Booking</span>
                          </button>
                         )} 

                        {booking.apiResponse?.error && (
                          <button
                            onClick={() => handleContactSupport(booking)}
                            className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                            <span>Contact Support</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Last updated: {formatDate(booking.updatedAt)} at{" "}
                      {formatTime(booking.updatedAt)}
                      {booking.syncedAt &&
                        ` • Synced: ${formatDate(booking.syncedAt)}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Ticket Details Modal */}
      {selectedBooking && (
        <TicketDetailsModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
        />
      )}

      {/* Cancellation Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Cancel Booking
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason *
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelCancellation}
                disabled={cancelling}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={cancelling || !cancellationReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
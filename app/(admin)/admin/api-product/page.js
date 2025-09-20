"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  Clock,
  MapPin,
  Users,
  Eye,
  Filter,
  Grid,
  List,
  RefreshCw,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import Loader from "@/components/common/Loader";

export default function DubaiToursAdmin() {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchDubaiTours();
  }, []);

  useEffect(() => {
    // Filter tours based on search term and filters
    let filtered = tours.filter((tour) => {
      const matchesSearch =
        tour.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.tourShortDescription
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        tour.cityTourType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterType === "all" ||
        (filterType === "recommended" && tour.recommended) ||
        (filterType === "private" && tour.isPrivate) ||
        tour.cityTourType?.toLowerCase().includes(filterType.toLowerCase());

      return matchesSearch && matchesFilter;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.tourName?.localeCompare(b.tourName || "") || 0;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "duration":
          return parseInt(a.duration || 0) - parseInt(b.duration || 0);
        default:
          return 0;
      }
    });

    setFilteredTours(filtered);
  }, [searchTerm, tours, filterType, sortBy]);

  const fetchDubaiTours = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDubaiTours();

      if (data.statuscode === 0) {
        setTours(data.result || []);
        setError(null);
      } else {
        setError(data.error || "Failed to fetch tours");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching tours");
      console.error("Error fetching Dubai tours:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleApprove = async (tourId) => {
  try {
    const res = await adminApi.approveTour(tourId);

    if (res.success) {
      setTours((prev) =>
        prev.map((t) =>
          t.tourId === tourId ? { ...t, approved: true } : t
        )
      );
      window.location.reload();
    } else {
      console.error("Approval failed:", res.message);
    }
  } catch (err) {
    console.error("❌ Error approving tour:", err);
  }
};


  const TourCard = ({ tour, index }) => (
    <div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-4 right-4 flex gap-2">
          {tour.recommended && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
              Recommended
            </span>
          )}
          {tour.isPrivate && (
            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Private
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-bold mb-1">{tour.tourName}</h3>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={14} />
            <span>
              {tour.cityName}, {tour.countryName}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="fill-yellow-400 text-yellow-400" size={16} />
            <span className="font-semibold">{tour.rating}</span>
            <span className="text-gray-500 text-sm">
              ({tour.reviewCount} reviews)
            </span>
          </div>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            {tour.cityTourType}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tour.tourShortDescription}
        </p>

<div className="flex items-center justify-between text-sm">
  <div className="flex items-center gap-1 text-gray-500">
    <Clock size={14} />
    <span>{tour.duration}</span>
  </div>

  {!tour.isApproved ? (
    <button
      onClick={() => handleApprove(tour.tourId)}
      className="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105"
    >
      Mark Approve
    </button>
  ) : (
    <button
    onClick={() => handleApprove(tour.tourId)}
      className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg"
    >
      Approved
    </button>
  )}
</div>

      </div>
    </div>
  );



  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="text-red-600 text-center mb-4">
            <div className="text-6xl mb-2">⚠️</div>
            <h2 className="text-xl font-bold">Error Loading Tours</h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
          <button
            onClick={fetchDubaiTours}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
          >
            <RefreshCw size={16} className="inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dubai Tours Admin
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor your tour catalog
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDubaiTours}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw size={16} className="inline mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Tours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tours.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MapPin className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Recommended</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tours.filter((t) => t.recommended).length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Star className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Private Tours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tours.filter((t) => t.isPrivate).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tours.length > 0
                    ? (
                        tours.reduce((acc, t) => acc + (t.rating || 0), 0) /
                        tours.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Star className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tours by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
              >
                <option value="all">All Tours</option>
                <option value="recommended">Recommended</option>
                <option value="private">Private</option>
                <option value="city">City Tours</option>
                <option value="adventure">Adventure</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredTours.length}</span> of{" "}
            <span className="font-semibold">{tours.length}</span> tours
            {searchTerm && (
              <span>
                {" "}
                for "<span className="font-semibold">{searchTerm}</span>"
              </span>
            )}
          </div>
        </div>

        {/* Tours Display */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredTours.map((tour, index) => (
              <TourCard key={tour.tourId || index} tour={tour} index={index} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tours found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? `No tours match your search criteria "${searchTerm}"`
                : "No tours available at the moment"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

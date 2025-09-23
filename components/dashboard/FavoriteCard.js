'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function FavoriteCard({ favorite, isSelected, onSelect, onRemove }) {
  const [imageError, setImageError] = useState(false);

  const getCategoryIcon = (category) => {
    const icons = {
      attraction: '🏙️',
      tour: '🚗',
      activity: '🎯',
      default: '❤️'
    };
    return icons[category] || icons.default;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageError = () => {
    setImageError(true);
  };
  

  return (
    <div className={`
      bg-white rounded-lg shadow border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md
      ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''}
    `}>
      {/* Image Section */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative">
          {imageError ? (
            <div className="text-white text-6xl">
              {getCategoryIcon(favorite.category)}
            </div>
          ) : (
            <img
              src={favorite.image}
              alt={favorite.name}
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          {/* Selection Checkbox */}
          <div className="absolute top-3 left-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white bg-opacity-95 rounded-full px-3 py-1 flex items-center space-x-1">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-sm font-semibold text-gray-900">{favorite.rating}</span>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
            {favorite.type}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 mb-1">
            {favorite.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📍</span>
            {favorite.location}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {favorite.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {favorite.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
          <div className="flex items-center">
            <span className="mr-1">⏱️</span>
            <span>{favorite.duration}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">🌤️</span>
            <span>Best: {favorite.bestTime}</span>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {favorite.currency} {favorite.price}
            </p>
            <p className="text-xs text-gray-500">
              per person
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onRemove}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove from favorites"
            >
              <span className="text-lg">❤️</span>
            </button>
            <Link
              href={`/booking?attraction=${favorite.id}`}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Added Date */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Added on {formatDate(favorite.addedDate)}
          </p>
        </div>
      </div>
    </div>
  );
}
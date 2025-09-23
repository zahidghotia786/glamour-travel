'use client';
import { useState, useEffect } from 'react';
import FavoriteCard from '@/components/dashboard/FavoriteCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [selectedFavorites, setSelectedFavorites] = useState(new Set());

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockFavorites = [
      {
        id: 1,
        name: "Burj Khalifa - At the Top",
        type: "Landmark",
        category: "attraction",
        price: 149,
        currency: "AED",
        rating: 4.8,
        reviewCount: 1247,
        location: "Downtown Dubai",
        image: "/images/burj-khalifa.jpg",
        description: "Experience breathtaking views from the world's tallest building",
        tags: ["Popular", "Iconic", "City Views"],
        addedDate: "2024-01-10",
        duration: "1-2 hours",
        bestTime: "Sunset"
      },
      {
        id: 2,
        name: "Dubai Desert Safari",
        type: "Adventure",
        category: "tour",
        price: 120,
        currency: "AED",
        rating: 4.6,
        reviewCount: 892,
        location: "Dubai Desert",
        image: "/images/desert-safari.jpg",
        description: "Thrilling desert adventure with dune bashing and cultural experiences",
        tags: ["Adventure", "Cultural", "Family-Friendly"],
        addedDate: "2024-01-08",
        duration: "6 hours",
        bestTime: "Evening"
      },
      {
        id: 3,
        name: "Dubai Aquarium & Underwater Zoo",
        type: "Aquarium",
        category: "attraction",
        price: 110,
        currency: "AED",
        rating: 4.5,
        reviewCount: 567,
        location: "The Dubai Mall",
        image: "/images/aquarium.jpg",
        description: "Walk through the underwater tunnel and see amazing marine life",
        tags: ["Family", "Indoor", "Educational"],
        addedDate: "2024-01-05",
        duration: "2-3 hours",
        bestTime: "Morning"
      },
      {
        id: 4,
        name: "Miracle Garden Dubai",
        type: "Garden",
        category: "attraction",
        price: 55,
        currency: "AED",
        rating: 4.3,
        reviewCount: 423,
        location: "Dubai Land",
        image: "/images/miracle-garden.jpg",
        description: "World's largest natural flower garden featuring stunning floral arrangements",
        tags: ["Nature", "Photography", "Seasonal"],
        addedDate: "2024-01-02",
        duration: "2 hours",
        bestTime: "Winter Season"
      },
      {
        id: 5,
        name: "Atlantis Aquaventure Waterpark",
        type: "Waterpark",
        category: "attraction",
        price: 299,
        currency: "AED",
        rating: 4.7,
        reviewCount: 1563,
        location: "Palm Jumeirah",
        image: "/images/aquaventure.jpg",
        description: "Middle East's largest waterpark with thrilling slides and marine experiences",
        tags: ["Thrilling", "Water Activities", "Family"],
        addedDate: "2023-12-28",
        duration: "Full day",
        bestTime: "All day"
      },
      {
        id: 6,
        name: "Dubai Frame",
        type: "Landmark",
        category: "attraction",
        price: 50,
        currency: "AED",
        rating: 4.2,
        reviewCount: 389,
        location: "Zabeel Park",
        image: "/images/dubai-frame.jpg",
        description: "Iconic structure connecting Dubai's past and future with panoramic views",
        tags: ["Architecture", "Views", "Historical"],
        addedDate: "2023-12-25",
        duration: "1 hour",
        bestTime: "Daytime"
      }
    ];
    
    setFavorites(mockFavorites);
    setLoading(false);
  }, []);

  // Filter favorites based on category
  const filteredFavorites = favorites.filter(favorite => {
    if (filter === 'all') return true;
    return favorite.category === filter;
  });

  // Sort favorites
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return new Date(b.addedDate) - new Date(a.addedDate);
    }
  });

  // Select/deselect all
  const toggleSelectAll = () => {
    if (selectedFavorites.size === sortedFavorites.length) {
      setSelectedFavorites(new Set());
    } else {
      setSelectedFavorites(new Set(sortedFavorites.map(fav => fav.id)));
    }
  };

  // Toggle individual selection
  const toggleFavoriteSelection = (id) => {
    const newSelected = new Set(selectedFavorites);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFavorites(newSelected);
  };

  // Remove selected favorites
  const removeSelectedFavorites = () => {
    const newFavorites = favorites.filter(fav => !selectedFavorites.has(fav.id));
    setFavorites(newFavorites);
    setSelectedFavorites(new Set());
  };

  // Remove single favorite
  const removeFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    setSelectedFavorites(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 mt-2">Your saved attractions and experiences</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <span className="text-2xl">❤️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Favorites</p>
              <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <span className="text-2xl">🏙️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attractions</p>
              <p className="text-2xl font-bold text-gray-900">
                {favorites.filter(f => f.category === 'attraction').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <span className="text-2xl">🚗</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tours</p>
              <p className="text-2xl font-bold text-gray-900">
                {favorites.filter(f => f.category === 'tour').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {(favorites.reduce((sum, f) => sum + f.rating, 0) / favorites.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            {/* Selection Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedFavorites.size === sortedFavorites.length && sortedFavorites.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Select all ({selectedFavorites.size} selected)
                </label>
              </div>

              {selectedFavorites.size > 0 && (
                <button
                  onClick={removeSelectedFavorites}
                  className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center"
                >
                  <span className="mr-2">🗑️</span>
                  Remove Selected ({selectedFavorites.size})
                </button>
              )}
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="attraction">Attractions</option>
                <option value="tour">Tours</option>
                <option value="activity">Activities</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Favorites Grid */}
        <div className="p-6">
          {sortedFavorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❤️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No favorites yet' : 'No favorites in this category'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Start saving your favorite attractions and experiences!'
                  : `No ${filter} items in your favorites.`
                }
              </p>
              {filter === 'all' ? (
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Explore Attractions
                </button>
              ) : (
                <button 
                  onClick={() => setFilter('all')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  View All Favorites
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedFavorites.map((favorite) => (
                <FavoriteCard 
                  key={favorite.id} 
                  favorite={favorite}
                  isSelected={selectedFavorites.has(favorite.id)}
                  onSelect={() => toggleFavoriteSelection(favorite.id)}
                  onRemove={() => removeFavorite(favorite.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Book?</h3>
        <p className="text-blue-800 mb-4">
          Turn your favorite experiences into unforgettable memories. Book now and get the best prices!
        </p>
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Book Selected ({selectedFavorites.size})
          </button>
          <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100">
            Explore More Attractions
          </button>
        </div>
      </div>
    </div>
  );
}
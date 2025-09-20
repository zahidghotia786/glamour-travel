'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  Heart,
  Globe,
  Gift,
  Plane,
  Camera,
  Search,
  Grid,
  List,
  Star,
  Users,
  CheckCircle
} from 'lucide-react';
import { fetchFromAPI } from '@/lib/api';
import Loader from '../common/Loader';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, categoryFilter, sortBy]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchFromAPI('Tour/dubai/tours/public');
      
      if (response.statuscode === 0 && response.result) {
        setProducts(response.result);
      } else {
        throw new Error(response.error || 'Failed to fetch products');
      }

    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tourShortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.cityTourType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product =>
        product.cityTourType?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (a.startingPrice || 0) - (b.startingPrice || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'name':
          return (a.tourName || '').localeCompare(b.tourName || '');
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const formatPrice = (price) => {
    if (!price) return 'Price available';
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED'
    }).format(price);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80';
    return `https://cdn.raynatours.com/${imagePath}`;
  };

  const getUniqueCategories = () => {
    const categories = products
      .map(product => product.cityTourType)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    
    return categories;
  };

const viewProductDetails = (tourId, contractId) => {
  router.push(`/booking/${tourId}?contractId=${contractId}`);
};



  const getRatingStars = (rating) => {
    return Math.floor(rating || 5);
  };

  // Helper function to get icon component from category name
  const getIconComponent = (categoryName) => {
    const iconMap = {
      'City Tours': Plane,
      'Desert Safari': MapPin,
      'Water Sports': Globe,
      'Theme Parks': Gift,
      'Adventure Tours': MapPin,
      'Cultural Tours': Camera,
      'Dhow Cruise': Globe,
      'Shopping Tours': Gift,
      'Food Tours': Heart,
      'Entertainment': Star,
      'Sightseeing': Camera,
      'Day Tours': Clock,
      'Half Day Tours': Clock
    };
    
    return iconMap[categoryName] || Globe;
  };

  // Get background color based on category
  const getCategoryBg = (categoryName) => {
    const bgMap = {
      'City Tours': 'bg-gradient-to-r from-blue-50 to-blue-100',
      'Desert Safari': 'bg-gradient-to-r from-amber-50 to-orange-100',
      'Water Sports': 'bg-gradient-to-r from-sky-50 to-sky-100',
      'Theme Parks': 'bg-gradient-to-r from-pink-50 to-pink-100',
      'Adventure Tours': 'bg-gradient-to-r from-green-50 to-green-100',
      'Cultural Tours': 'bg-gradient-to-r from-purple-50 to-purple-100',
      'Dhow Cruise': 'bg-gradient-to-r from-teal-50 to-cyan-100',
      'Shopping Tours': 'bg-gradient-to-r from-rose-50 to-pink-100',
      'Food Tours': 'bg-gradient-to-r from-emerald-50 to-teal-100',
      'Entertainment': 'bg-gradient-to-r from-indigo-50 to-purple-100',
      'Sightseeing': 'bg-gradient-to-r from-violet-50 to-purple-100',
      'Day Tours': 'bg-gradient-to-r from-cyan-50 to-blue-100',
      'Half Day Tours': 'bg-gradient-to-r from-lime-50 to-green-100'
    };
    return bgMap[categoryName] || 'bg-gradient-to-r from-gray-50 to-gray-100';
  };

  // Map categories to filter options
  const categoryFilters = [
    { 
      id: "all", 
      label: "All Tours", 
      icon: Globe, 
      count: products.length 
    },
    ...getUniqueCategories().map(category => ({
      id: category,
      label: category,
      icon: getIconComponent(category),
      count: products.filter(p => p.cityTourType === category).length
    }))
  ];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-4">
          <div className="text-8xl mb-6">😢</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6 text-lg">{error}</p>
          <button 
            onClick={fetchAllProducts}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Dubai Tours & Activities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing experiences in Dubai with our curated selection of tours
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Tours
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 flex-1 py-2 px-4 rounded-xl transition-all duration-300 text-sm font-medium ${
                    viewMode === 'grid'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 flex-1 py-2 px-4 rounded-xl transition-all duration-300 text-sm font-medium ${
                    viewMode === 'list'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto whitespace-nowrap space-x-4 pb-3 mb-12 no-scrollbar justify-center">
          {categoryFilters.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategoryFilter(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  categoryFilter === category.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  categoryFilter === category.id
                    ? "bg-white/20"
                    : "bg-gray-100"
                }`}>
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-600">
            Showing <span className="font-bold text-blue-600">{filteredProducts.length}</span> of {products.length} tours
          </p>
        </div>

        {/* Render Sections */}
        {categoryFilter === "all" ? (
          // Show all sections one by one
          getUniqueCategories().map((category) => {
            const categoryProducts = products.filter(
              (product) => product.cityTourType === category
            );
            
            if (categoryProducts.length === 0) return null;
            
            return (
              <motion.section 
                key={category} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`${getCategoryBg(category)} py-16 mb-12 rounded-3xl`}
              >
                <div className="flex items-center justify-center gap-3 mb-8">
                  {(() => {
                    const IconComponent = getIconComponent(category);
                    return <IconComponent className="w-8 h-8 text-gray-700" />;
                  })()}
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {category}
                  </h3>
                  <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                    {categoryProducts.length} tours
                  </span>
                </div>
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6"
                    : "space-y-6 px-6"
                }>
                  {categoryProducts.map((product, index) => (
                    <ProductCard
                      key={product.tourId}
                      product={product}
                      index={index}
                      viewMode={viewMode}
                      onViewDetails={viewProductDetails}
                      formatPrice={formatPrice}
                      getImageUrl={getImageUrl}
                      getRatingStars={getRatingStars}
                    />
                  ))}
                </div>
              </motion.section>
            );
          })
        ) : (
          // Show only the selected category section
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`${getCategoryBg(categoryFilter)} py-16 rounded-3xl`}
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              {(() => {
                const IconComponent = getIconComponent(categoryFilter);
                return <IconComponent className="w-8 h-8 text-gray-700" />;
              })()}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                {categoryFilter}
              </h3>
              <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                {filteredProducts.length} tours
              </span>
            </div>
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6"
                : "space-y-6 px-6"
            }>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.tourId}
                  product={product}
                  index={index}
                  viewMode={viewMode}
                  onViewDetails={viewProductDetails}
                  formatPrice={formatPrice}
                  getImageUrl={getImageUrl}
                  getRatingStars={getRatingStars}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-3xl shadow-xl"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No tours found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search filters to find amazing Dubai experiences
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 bg-white rounded-3xl shadow-xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Our Dubai Tours?
            </h3>
            <p className="text-xl text-gray-600">Experience the magic with confidence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">Free Cancellation</h4>
              <p className="text-gray-600">Cancel up to 24 hours before for a full refund</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">5-Star Rated</h4>
              <p className="text-gray-600">Thousands of satisfied customers</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-gray-800">Secure Booking</h4>
              <p className="text-gray-600">Your information is safe with us</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ product, index, viewMode, onViewDetails, formatPrice, getImageUrl, getRatingStars }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${
        viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
      }`}
    >
      {/* Product Image */}
      <div className={`relative overflow-hidden ${
        viewMode === 'list' ? 'md:w-80 h-64 md:h-auto' : 'h-64'
      }`}>
        <img
          src={getImageUrl(product.imagePath)}
          alt={product.tourName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80';
          }}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-lg">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-bold text-gray-800">
              {product.rating || '5.0'}
            </span>
            {product.reviewCount > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviewCount})
              </span>
            )}
          </div>
        </div>
        
        {/* Category Badge */}
        {product.cityTourType && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-2xl text-sm font-medium shadow-lg">
            {product.cityTourType}
          </div>
        )}
        
        {/* Recommended Badge */}
        {product.recommended && (
          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-2 rounded-2xl text-sm font-bold shadow-lg">
            RECOMMENDED
          </div>
        )}

        {/* Private Badge */}
        {product.isPrivate && (
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-2xl text-xs font-medium shadow-lg">
            PRIVATE
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className={`p-6 flex flex-col ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {product.tourName}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {product.tourShortDescription || `Discover the magic of ${product.cityName || 'Dubai'} with this amazing ${product.cityTourType?.toLowerCase() || 'tour'} experience. Create unforgettable memories with our expertly guided adventure.`}
          </p>

          <div className="space-y-2 mb-4">
            {/* Duration */}
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{product.duration || '4 Hours (Approx)'}</span>
            </div>
            
            {/* Reviews */}
            {product.reviewCount > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{product.reviewCount.toLocaleString()} reviews</span>
              </div>
            )}
            
            {/* Cancellation Policy */}
            {product.cancellationPolicyName && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span>{product.cancellationPolicyName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {product.startingPrice ? (
              <div>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.startingPrice)}
                </span>
                <span className="text-sm text-gray-500 block">per person</span>
              </div>
            ) : (
              <span className="text-green-600 font-semibold">Price available</span>
            )}
          </div>

          <button
           onClick={() => onViewDetails(product.tourId, product.contractId)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl transition-all duration-300 font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
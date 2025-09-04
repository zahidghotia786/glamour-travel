"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Heart,
  Globe,
  Gift,
  Plane,
  Camera,
} from "lucide-react";
import DestinationCard from "@/components/destinations/DestinationCard";
import { productsApi } from "@/lib/api";
import Loader from "@/components/common/Loader";

export default function FeaturedDestinations() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productsApi.getProducts({ isActive: true }),
          productsApi.getCategories()
        ]);
        
        setProducts(productsData);
        // FIXED: categoriesData is already the array, no need for .data.categories
        setCategories(categoriesData.data.categories || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to get icon component from string
  const getIconComponent = (iconString) => {
    const iconMap = {
      '✈️': Plane,
      '🏜️': MapPin,
      '📂': Globe,
      '🎢': Gift,
      '📸': Camera,
      '⏰': Clock,
      '❤️': Heart
    };
    
    // Default to Globe if icon not found
    return iconMap[iconString] || Globe;
  };

  // Map categories to filter options
  const categoryFilters = [
    { 
      id: "all", 
      label: "All Destinations", 
      icon: Globe, 
      count: products.length 
    },
    ...categories.map(category => ({
      id: category.id,
      label: category.name,
      icon: getIconComponent(category.icon), // Convert string to component
      count: products.filter(p => p.categoryId === category.id).length
    }))
  ];

  // Get background color based on category
  const getCategoryBg = (categoryName) => {
    const bgMap = {
      'Tour': 'bg-gradient-to-r from-blue-50 to-blue-100',
      'Travel': 'bg-gradient-to-r from-green-50 to-green-100',
      'Water Activities': 'bg-gradient-to-r from-sky-50 to-sky-100',
      'Theme Parks': 'bg-gradient-to-r from-purple-50 to-purple-100',
      'Activities': 'bg-gradient-to-r from-amber-50 to-orange-100',
      'Landmarks': 'bg-gradient-to-r from-emerald-50 to-teal-100',
      'Cultural': 'bg-gradient-to-r from-rose-50 to-pink-100'
    };
    return bgMap[categoryName] || 'bg-gradient-to-r from-gray-50 to-gray-100';
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.categoryId === selectedCategory);

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Featured Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most popular attractions with exclusive deals and instant booking
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto whitespace-nowrap space-x-4 pb-3 mb-12 no-scrollbar justify-center">
          {categoryFilters.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {category.label}
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Render Sections */}
        {selectedCategory === "all" ? (
          // Show all sections one by one
          categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.categoryId === category.id
            );
            
            // Only show section if there are products
            if (categoryProducts.length === 0) return null;
            
            return (
              <section key={category.id} className={`${getCategoryBg(category.name)} py-16 mb-12 rounded-3xl`}>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryProducts.map((product, index) => (
                    <DestinationCard
                      key={product.id}
                      destination={product}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          // Show only the selected category section
          <section
            className={`${getCategoryBg(categories.find(c => c.id === selectedCategory)?.name)} py-16 rounded-3xl`}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <DestinationCard
                  key={product.id}
                  destination={product}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏜️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No destinations available
            </h3>
            <p className="text-gray-600">
              Check back later for new destinations and experiences.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
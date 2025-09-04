"use client";

import { useEffect, useState } from "react";
import {
  adminListProducts, adminDeleteProduct,
} from "@/lib/api";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";
import { Eye, Pencil, Trash, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Loader from "@/components/common/Loader";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  async function load() {
    setLoading(true);
    try {
      const [p, m, b2b] = await Promise.all([
        adminListProducts(), 
      ]);
      setProducts(p);
      setFilteredProducts(p); // Initialize filtered products with all products
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    load(); 
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = products;

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => 
        product.category?.name === categoryFilter
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(product =>
        statusFilter === "active" ? product.isActive : !product.isActive
      );
    }

    // Apply price filters
    if (minPrice) {
      filtered = filtered.filter(product => 
        product.basePrice >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(product => 
        product.basePrice <= parseFloat(maxPrice)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, categoryFilter, statusFilter, minPrice, maxPrice]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];

  function openCreateForm() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  function openDetails(product) {
    setSelectedProduct(product);
    setShowDetails(true);
  }

  function closeDetails() {
    setShowDetails(false);
    setSelectedProduct(null);
  }

  async function removeProduct(id) {
    if (!confirm("Delete product?")) return;
    await adminDeleteProduct(id);
    await load();
  }

  function onFormSuccess() {
    closeForm();
    load();
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden">
      <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Products & Pricing Dashboard
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
              Manage products, Add , edit and remove products
            </p>
          </div>
          <button
            onClick={openCreateForm}
            className="px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg w-full sm:w-auto text-sm md:text-base hover:shadow-xl transition-shadow"
          >
            <span className="flex items-center justify-center gap-2">
              ✨ New Product
            </span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm md:text-base border-b-2 border-violet-600 text-violet-700`}
          >
            📦 Products ({filteredProducts.length})
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/20 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Search & Filter Products</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search by Name */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            {/* Min Price */}
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full p-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              min="0"
            />

            {/* Max Price */}
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full p-2 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              min="0"
            />
          </div>
        </div>

        {/* Products Tab */}
        <div className="overflow-hidden grid grid-cols-1">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Products Collection
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {Math.min(filteredProducts.length, productsPerPage)} of {filteredProducts.length} products
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["Name", "Category", "Base Price", "Status", "Images", "Actions"].map((header) => (
                        <th
                          key={header}
                          className="py-3 px-2 md:py-4 md:px-3 text-left text-xs md:text-sm font-semibold text-gray-700"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-all duration-300"
                      >
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <div className="font-semibold text-gray-900 text-sm md:text-base">{p.name}</div>
                          <div className="text-xs md:text-sm text-gray-500 truncate max-w-[120px] md:max-w-xs">
                            {p.shortDesc}
                          </div>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <span 
                            className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${
                              p.type === 'THEME_PARK' ? 'bg-purple-100 text-purple-700' :
                              p.type === 'TOUR' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}
                          >
                            {p.category?.name}
                          </span>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <div className="font-mono font-semibold text-gray-900 text-sm md:text-base">
                            {p.baseCurrency} {Number(p.basePrice).toFixed(2)}
                          </div>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <span 
                            className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${
                              p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {p.isActive ? "✅ Active" : "⏸ Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <div className="flex items-center gap-1">
                            <span className="text-xs md:text-sm text-gray-600">{p.images?.length || 0}</span>
                            <span>📸</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <div className="flex gap-1 md:gap-2">
                            <button
                              onClick={() => openDetails(p)}
                              className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-gray-500 text-white text-xs md:text-sm font-medium hover:bg-gray-600 transition-colors flex items-center gap-1"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditForm(p)}
                              className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-blue-500 text-white text-xs md:text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
                              title="Edit Product"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeProduct(p.id)}
                              className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-red-500 text-white text-xs md:text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
                              title="Delete Product"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredProducts.length > productsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-6 border-t border-gray-200 gap-4">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <ProductForm 
          product={editingProduct}
          onClose={closeForm}
          onSuccess={onFormSuccess}
        />
      )}

      {showDetails && (
        <ProductDetails 
          product={selectedProduct}
          onClose={closeDetails}
          onEdit={() => {
            closeDetails();
            openEditForm(selectedProduct);
          }}
        />
      )}
    </div>
  );
}
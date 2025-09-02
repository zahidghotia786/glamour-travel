"use client";

import { useEffect, useState } from "react";
import {
  adminListProducts, adminDeleteProduct,
  adminListMarkups, adminUpsertMarkup, adminDeleteMarkup,
  adminGetB2BUsers // ADDED: Get B2B users with markup info
} from "@/lib/api";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";
import MarkupQuickAdd from "./MarkupQuickAdd";
import { Eye, Pencil, Trash, Users, Tag, Percent } from "lucide-react";
import Loader from "@/components/common/Loader";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [markups, setMarkups] = useState([]);
  const [b2bUsers, setB2bUsers] = useState([]); // ADDED: B2B users state
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("products"); // ADDED: Tab state
console.log(products, "products")
  async function load() {
    setLoading(true);
    try {
      const [p, m, b2b] = await Promise.all([
        adminListProducts(), 
        adminListMarkups(),
        adminGetB2BUsers() // ADDED: Fetch B2B users
      ]);
      setProducts(p);
      setMarkups(m);
      setB2bUsers(b2b.users || b2b); // Handle different response formats
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Helper function to get markups for a specific product
  const getProductMarkups = (productId) => {
    return markups.filter(markup => markup.productId === productId);
  };

  // Helper function to get markups for a specific B2B user
  const getB2BUserMarkups = (b2bAccountId) => {
    return markups.filter(markup => markup.b2bAccountId === b2bAccountId);
  };

  // Helper function to get global markups (no specific product or B2B user)
  const getGlobalMarkups = () => {
    return markups.filter(markup => !markup.productId && !markup.b2bAccountId);
  };

  // Helper function to check if a product has any markups
  const hasProductMarkups = (productId) => {
    return markups.some(markup => markup.productId === productId);
  };

  // Helper function to check if a B2B user has any markups
  const hasB2BUserMarkups = (b2bAccountId) => {
    return markups.some(markup => markup.b2bAccountId === b2bAccountId);
  };

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

  async function addMarkup({ b2bAccountId = null, productId = null, percentage }) {
    await adminUpsertMarkup({ b2bAccountId, productId, percentage: Number(percentage) });
    await load();
  }

  async function delMarkup(id) {
    await adminDeleteMarkup(id);
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
              Manage products, B2B users, and pricing strategies
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
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium text-sm md:text-base ${
              activeTab === "products"
                ? "border-b-2 border-violet-600 text-violet-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📦 Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("markups")}
            className={`px-4 py-2 font-medium text-sm md:text-base ${
              activeTab === "markups"
                ? "border-b-2 border-violet-600 text-violet-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            💰 Markup Rules ({markups.length})
          </button>
          <button
            onClick={() => setActiveTab("b2b")}
            className={`px-4 py-2 font-medium text-sm md:text-base ${
              activeTab === "b2b"
                ? "border-b-2 border-violet-600 text-violet-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            👥 B2B Users ({b2bUsers.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="overflow-hidden grid grid-cols-1">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
                  Products Collection
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {["Name", "Category", "Base Price", "Markups", "Status", "Images", "Actions"].map((header) => (
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
                      {products.map((p) => {
                        const productMarkups = getProductMarkups(p.id);
                        const hasMarkups = productMarkups.length > 0;
                        
                        return (
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
                                {p.category.name}
                              </span>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <div className="font-mono font-semibold text-gray-900 text-sm md:text-base">
                                {p.baseCurrency} {Number(p.basePrice).toFixed(2)}
                              </div>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              {hasMarkups ? (
                                <div className="flex flex-col gap-1">
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                    <Tag className="w-3 h-3 inline mr-1" />
                                    {productMarkups.length} markup(s)
                                  </span>
                                  {productMarkups.slice(0, 2).map((m, index) => (
                                    <span key={index} className="text-xs text-gray-600">
                                      +{m.percentage}%{m.b2bAccount ? ` for ${m.b2bAccount.name}` : ''}
                                    </span>
                                  ))}
                                  {productMarkups.length > 2 && (
                                    <span className="text-xs text-gray-400">
                                      +{productMarkups.length - 2} more...
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No markups</span>
                              )}
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Markup Rules Tab */}
        {activeTab === "markups" && (
          <div className="overflow-hidden grid grid-cols-1">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Markup Rules</h2>
                    <p className="text-gray-600 text-sm md:text-base">Configure pricing strategies</p>
                  </div>
                  <MarkupQuickAdd onAdd={addMarkup} products={products} b2bUsers={b2bUsers} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {["Type", "B2B Account", "Product", "Markup %", "Actions"].map((header) => (
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
                      {markups.map((m) => {
                        let ruleType = "Global";
                        if (m.b2bAccountId && m.productId) ruleType = "B2B + Product";
                        else if (m.b2bAccountId) ruleType = "B2B Specific";
                        else if (m.productId) ruleType = "Product Specific";

                        return (
                          <tr
                            key={m.id}
                            className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300"
                          >
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ruleType === "Global" ? "bg-gray-100 text-gray-700" :
                                ruleType === "B2B Specific" ? "bg-blue-100 text-blue-700" :
                                ruleType === "Product Specific" ? "bg-green-100 text-green-700" :
                                "bg-purple-100 text-purple-700"
                              }`}>
                                {ruleType}
                              </span>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <span className="font-medium text-gray-900 text-sm md:text-base">
                                {m.b2bAccount ? `${m.b2bAccount.name} (${m.b2bAccount.code})` : "🌐 All B2B Users"}
                              </span>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <span className="text-gray-700 text-sm md:text-base">
                                {m.product?.name || "🎯 All Products"}
                              </span>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <span 
                                className="px-2 py-1 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 font-mono font-semibold text-xs md:text-sm"
                              >
                                {m.percentage}%
                              </span>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <button
                                onClick={() => delMarkup(m.id)}
                                className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-red-500 text-white text-xs md:text-sm font-medium hover:bg-red-600 transition-colors"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B2B Users Tab */}
        {activeTab === "b2b" && (
          <div className="overflow-hidden grid grid-cols-1">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">
                  B2B Users ({b2bUsers.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {["Name", "Company", "Email", "Discount Rate", "Markups", "Status", "Account Manager"].map((header) => (
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
                      {b2bUsers.map((user) => {
                        const userMarkups = getB2BUserMarkups(user.id);
                        const hasMarkups = userMarkups.length > 0;
                        
                        return (
                          <tr
                            key={user.id}
                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300"
                          >
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <div className="font-semibold text-gray-900 text-sm md:text-base">
                                {user.firstName} {user.lastName}
                              </div>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <div className="text-sm text-gray-700">{user.companyName}</div>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                {user.b2bDiscountRate || 15}% off
                              </span>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              {hasMarkups ? (
                                <div className="flex flex-col gap-1">
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                    <Percent className="w-3 h-3 inline mr-1" />
                                    {userMarkups.length} custom markup(s)
                                  </span>
                                  {userMarkups.slice(0, 2).map((m, index) => (
                                    <span key={index} className="text-xs text-gray-600">
                                      {m.percentage}%{m.product ? ` on ${m.product.name}` : ''}
                                    </span>
                                  ))}
                                  {userMarkups.length > 2 && (
                                    <span className="text-xs text-gray-400">
                                      +{userMarkups.length - 2} more...
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No custom markups</span>
                              )}
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <span 
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {user.isActive ? "✅ Active" : "⏸ Inactive"}
                              </span>
                            </td>
                            <td className="py-3 px-2 md:py-4 md:px-3">
                              <span className="text-xs text-gray-500">
                                {user.accountManager ? 
                                  `${user.accountManager.firstName} ${user.accountManager.lastName}` : 
                                  "Not assigned"
                                }
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
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
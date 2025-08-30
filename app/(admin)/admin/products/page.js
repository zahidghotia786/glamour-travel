"use client";

import { useEffect, useState } from "react";
import {
  adminListProducts, adminDeleteProduct,
  adminListMarkups, adminUpsertMarkup, adminDeleteMarkup,
} from "@/lib/api";
import ProductForm from "./ProductForm";
import ProductDetails from "./ProductDetails";
import MarkupQuickAdd from "./MarkupQuickAdd";
import { Eye, Pencil, Trash } from "lucide-react";
import Loader from "@/components/common/Loader";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [markups, setMarkups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  async function load() {
    setLoading(true);
    const [p, m] = await Promise.all([adminListProducts(), adminListMarkups()]);
    setProducts(p);
    setMarkups(m);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

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
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden">
      <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Products Dashboard
            </h1>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Manage your products and pricing rules</p>
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

        {/* Products Grid */}
        <div className="overflow-hidden grid grid-cols-1 ">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Products Collection</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["Name", "Type", "Base Price", "Status", "Images", "Actions"].map((header) => (
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
                    {products.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-all duration-300"
                      >
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <div className="font-semibold text-gray-900 text-sm md:text-base">{p.name}</div>
                          <div className="text-xs md:text-sm text-gray-500 truncate max-w-[120px] md:max-w-xs">{p.shortDesc}</div>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <span 
                            className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${
                              p.type === 'THEME_PARK' ? 'bg-purple-100 text-purple-700' :
                              p.type === 'TOUR' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}
                          >
                            {p.type.replace('_', ' ')}
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
    <Eye className="w-4 h-4" /> {/* 👁 Icon */}
  </button>

  <button
    onClick={() => openEditForm(p)}
    className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-blue-500 text-white text-xs md:text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
    title="Edit Product"
  >
    <Pencil className="w-4 h-4" /> {/* ✏ Icon */}
  </button>

  <button
    onClick={() => removeProduct(p.id)}
    className="px-2 py-1 md:px-3 md:py-1 rounded-lg bg-red-500 text-white text-xs md:text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-1"
    title="Delete Product"
  >
    <Trash className="w-4 h-4" /> {/* 🗑 Icon */}
  </button>
</div>
                        </td>
                      </tr>
                    ))}
                    {!products.length && (
                      <tr>
                        <td colSpan="6" className="py-8 md:py-12 text-center">
                          <div className="text-gray-500">
                            <div className="text-4xl md:text-6xl mb-2 md:mb-4">📦</div>
                            <div className="text-base md:text-lg">No products yet</div>
                            <div className="text-xs md:text-sm">Create your first product to get started!</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Markup Rules */}
        <div className="overflow-hidden grid grid-cols-1">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Markup Rules</h2>
                  <p className="text-gray-600 text-sm md:text-base">Configure pricing strategies</p>
                </div>
                <MarkupQuickAdd onAdd={addMarkup} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["B2B Account", "Product", "Markup %", "Actions"].map((header) => (
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
                    {markups.map((m) => (
                      <tr
                        key={m.id}
                        className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300"
                      >
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <span className="font-medium text-gray-900 text-sm md:text-base">
                            {m.b2bAccount ? `${m.b2bAccount.name} (${m.b2bAccount.code})` : "🌐 All B2C / Any"}
                          </span>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <span className="text-gray-700 text-sm md:text-base">
                            {m.product?.name || "🎯 Any Product"}
                          </span>
                        </td>
                        <td className="py-3 px-2 md:py-4 md:px-3">
                          <span 
                            className="px-2 py-1 md:px-3 md:py-1 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 font-mono font-semibold text-xs md:text-sm"
                          >
                            +{m.percentage}%
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
                    ))}
                    {!markups.length && (
                      <tr>
                        <td colSpan="4" className="py-8 md:py-12 text-center">
                          <div className="text-gray-500">
                            <div className="text-4xl md:text-6xl mb-2 md:mb-4">💰</div>
                            <div className="text-base md:text-lg">No markup rules yet</div>
                            <div className="text-xs md:text-sm">Add pricing rules to get started!</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
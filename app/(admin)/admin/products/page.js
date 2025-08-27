"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminListMarkups, adminUpsertMarkup, adminDeleteMarkup,
} from "@/lib/api";

const emptyForm = {
  name: "", type: "THEME_PARK", shortDesc: "", longDesc: "",
  baseCurrency: "AED", basePrice: 0, isActive: true,
  images: [{ url: "", alt: "" }],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 200
    }
  },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 400
    }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 400
    }
  },
  tap: { scale: 0.95 }
};

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [markups, setMarkups] = useState([]);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const [p, m] = await Promise.all([adminListProducts(), adminListMarkups()]);
    setProducts(p);
    setMarkups(m);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function saveProduct() {
    const payload = { ...form, basePrice: Number(form.basePrice), images: form.images.filter(i => i.url) };
    if (editingId) await adminUpdateProduct(editingId, payload);
    else await adminCreateProduct(payload);
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    await load();
  }

  async function editProduct(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      type: p.type,
      shortDesc: p.shortDesc || "",
      longDesc: p.longDesc || "",
      baseCurrency: p.baseCurrency,
      basePrice: p.basePrice,
      isActive: p.isActive,
      images: (p.images?.length ? p.images : [{ url: "", alt: "" }]).map(i => ({ url: i.url, alt: i.alt || "" })),
    });
    setShowForm(true);
  }

  async function removeProduct(id) {
    if (!confirm("Delete product?")) return;
    await adminDeleteProduct(id);
    await load();
  }

  // MARKUP helpers
  async function addMarkup({ b2bAccountId = null, productId = null, percentage }) {
    await adminUpsertMarkup({ b2bAccountId, productId, percentage: Number(percentage) });
    await load();
  }
  async function delMarkup(id) {
    await adminDeleteMarkup(id);
    await load();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <motion.div 
        className="p-6 space-y-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between"
          variants={itemVariants}
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Products Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your products and pricing rules</p>
          </motion.div>
          <motion.button
            onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 0.3 }}
              >
                ✨
              </motion.span>
              New Product
            </span>
          </motion.button>
        </motion.div>

        {/* Products Grid */}
        <motion.div variants={itemVariants}>
          <motion.div 
            className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Products Collection</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["Name", "Type", "Base Price", "Status", "Images", "Actions"].map((header, i) => (
                        <motion.th
                          key={header}
                          className="py-4 px-3 text-left text-sm font-semibold text-gray-700"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {header}
                        </motion.th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {products.map((p, index) => (
                        <motion.tr
                          key={p.id}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 50, opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-all duration-300"
                        >
                          <td className="py-4 px-3">
                            <div className="font-semibold text-gray-900">{p.name}</div>
                            <div className="text-sm text-gray-500 truncate">{p.shortDesc}</div>
                          </td>
                          <td className="py-4 px-3">
                            <motion.span 
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                p.type === 'THEME_PARK' ? 'bg-purple-100 text-purple-700' :
                                p.type === 'TOUR' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {p.type.replace('_', ' ')}
                            </motion.span>
                          </td>
                          <td className="py-4 px-3">
                            <div className="font-mono font-semibold text-gray-900">
                              {p.baseCurrency} {Number(p.basePrice).toFixed(2)}
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <motion.span 
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                p.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                              }`}
                              animate={{ scale: p.isActive ? [1, 1.05, 1] : 1 }}
                              transition={{ duration: 2, repeat: p.isActive ? Infinity : 0 }}
                            >
                              {p.isActive ? "✅ Active" : "⏸ Inactive"}
                            </motion.span>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-600">{p.images?.length || 0}</span>
                              <motion.span
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                📸
                              </motion.span>
                            </div>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => editProduct(p)}
                                className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm font-medium"
                                whileHover={{ scale: 1.05, backgroundColor: "#3B82F6" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Edit
                              </motion.button>
                              <motion.button
                                onClick={() => removeProduct(p.id)}
                                className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-medium"
                                whileHover={{ scale: 1.05, backgroundColor: "#EF4444" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Delete
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {!products.length && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td colSpan="6" className="py-12 text-center">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-gray-500"
                          >
                            <div className="text-6xl mb-4">📦</div>
                            <div className="text-lg">No products yet</div>
                            <div className="text-sm">Create your first product to get started!</div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Markup Rules */}
        <motion.div variants={itemVariants}>
          <motion.div 
            className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Markup Rules</h2>
                  <p className="text-gray-600">Configure pricing strategies</p>
                </div>
                <MarkupQuickAdd onAdd={addMarkup} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {["B2B Account", "Product", "Markup %", "Actions"].map((header, i) => (
                        <motion.th
                          key={header}
                          className="py-4 px-3 text-left text-sm font-semibold text-gray-700"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {header}
                        </motion.th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <AnimatePresence>
                      {markups.map((m, index) => (
                        <motion.tr
                          key={m.id}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 50, opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300"
                        >
                          <td className="py-4 px-3">
                            <span className="font-medium text-gray-900">
                              {m.b2bAccount ? `${m.b2bAccount.name} (${m.b2bAccount.code})` : "🌐 All B2C / Any"}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <span className="text-gray-700">
                              {m.product?.name || "🎯 Any Product"}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <motion.span 
                              className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 font-mono font-semibold"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              +{m.percentage}%
                            </motion.span>
                          </td>
                          <td className="py-4 px-3">
                            <motion.button
                              onClick={() => delMarkup(m.id)}
                              className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-medium"
                              whileHover={{ scale: 1.05, backgroundColor: "#EF4444" }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Remove
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {!markups.length && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td colSpan="4" className="py-12 text-center">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-gray-500"
                          >
                            <div className="text-6xl mb-4">💰</div>
                            <div className="text-lg">No markup rules yet</div>
                            <div className="text-sm">Add pricing rules to get started!</div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Product Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
              >
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{editingId ? "Edit Product" : "Create New Product"}</h3>
                      <p className="opacity-90">Fill in the details below</p>
                    </div>
                    <motion.button 
                      onClick={() => setShowForm(false)}
                      className="text-white/80 hover:text-white text-2xl"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Text name="name" label="Product Name" value={form.name} onChange={handleChange} />
                    <Select name="type" label="Product Type" value={form.type} onChange={handleChange}
                      options={["THEME_PARK", "TOUR", "ACTIVITY"]} />
                    <Select name="baseCurrency" label="Currency" value={form.baseCurrency} onChange={handleChange}
                      options={["AED","USD","EUR"]} />
                    <Text name="basePrice" type="number" label="Base Price (net)" value={form.basePrice} onChange={handleChange} />
                    <Text name="shortDesc" label="Short Description" value={form.shortDesc} onChange={handleChange} />
                    <div className="flex items-center">
                      <Toggle name="isActive" label="Active Product" checked={form.isActive} onChange={handleChange} />
                    </div>
                    <Textarea name="longDesc" label="Long Description" value={form.longDesc} onChange={handleChange} className="md:col-span-2" />
                  </div>

                  {/* Images Section */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      <span>📷</span> Product Images
                    </div>
                    <AnimatePresence>
                      {form.images.map((img, idx) => (
                        <motion.div 
                          key={idx}
                          className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-gray-50 rounded-2xl"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <input
                            className="border-2 border-gray-200 rounded-xl p-3 md:col-span-4 focus:border-violet-500 transition-colors"
                            placeholder="https://example.com/image.jpg"
                            value={img.url}
                            onChange={(e) => {
                              const v = e.target.value; setForm(f => {
                                const arr = [...f.images]; arr[idx] = { ...arr[idx], url: v }; return { ...f, images: arr };
                              });
                            }}
                          />
                          <input
                            className="border-2 border-gray-200 rounded-xl p-3 md:col-span-2 focus:border-violet-500 transition-colors"
                            placeholder="Alt text"
                            value={img.alt}
                            onChange={(e) => {
                              const v = e.target.value; setForm(f => {
                                const arr = [...f.images]; arr[idx] = { ...arr[idx], alt: v }; return { ...f, images: arr };
                              });
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="flex gap-3">
                      <motion.button 
                        className="text-sm text-blue-600 font-medium flex items-center gap-2"
                        onClick={() => setForm(f => ({ ...f, images: [...f.images, { url: "", alt: "" }] }))}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>➕</span> Add Image
                      </motion.button>
                      {form.images.length > 1 && (
                        <motion.button 
                          className="text-sm text-red-600 font-medium flex items-center gap-2"
                          onClick={() => setForm(f => ({ ...f, images: f.images.slice(0, -1) }))}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>🗑</span> Remove Last
                        </motion.button>
                      )}
                    </div>
                  </motion.div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <motion.button 
                      className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium"
                      onClick={() => setShowForm(false)}
                      whileHover={{ scale: 1.05, borderColor: "#9CA3AF" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg"
                      onClick={saveProduct}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {editingId ? "💾 Save Changes" : "✨ Create Product"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Enhanced form components with animations
function Text({ label, name, value, onChange, type="text", className="" }) {
  return (
    <motion.label 
      className={`space-y-2 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200" 
      />
    </motion.label>
  );
}

function Textarea({ label, name, value, onChange, className="" }) {
  return (
    <motion.label 
      className={`space-y-2 ${className}`}
      whileHover={{ scale: 1.01 }}
    >
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <textarea 
        name={name} 
        value={value} 
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-xl p-3 min-h-[120px] focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200" 
      />
    </motion.label>
  );
}

function Select({ label, name, value, onChange, options, className="" }) {
  return (
    <motion.label 
      className={`space-y-2 ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <span className="text-sm font-semibold text-gray-700">{label}</span>
      <select 
        name={name} 
        value={value} 
        onChange={onChange}
        className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200"
      >
        {options.map(o => <option key={o} value={o}>{o.replace('_', ' ')}</option>)}
      </select>
    </motion.label>
  );
}

function Toggle({ label, name, checked, onChange }) {
  return (
    <motion.label 
      className="flex items-center gap-3 cursor-pointer"
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-violet-500' : 'bg-gray-300'
        }`}
        animate={{ backgroundColor: checked ? '#8B5CF6' : '#D1D5DB' }}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        />
      </motion.div>
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange}
        className="sr-only"
      />
      <span className="text-sm font-semibold text-gray-700">{label}</span>
    </motion.label>
  );
}

// Enhanced Markup Quick Add component
function MarkupQuickAdd({ onAdd }) {
  const [pct, setPct] = useState("");
  const [productId, setProductId] = useState("");
  const [b2bId, setB2bId] = useState("");

  return (
    <motion.div 
      className="flex gap-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <input 
        placeholder="B2B Account ID (optional)" 
        className="border-2 border-orange-200 rounded-xl p-2 text-sm focus:border-orange-400 transition-colors" 
        value={b2bId} 
        onChange={e => setB2bId(e.target.value)} 
      />
      <input 
        placeholder="Product ID (optional)" 
        className="border-2 border-orange-200 rounded-xl p-2 text-sm focus:border-orange-400 transition-colors" 
        value={productId} 
        onChange={e => setProductId(e.target.value)} 
      />
      <input 
        placeholder="% Markup" 
        className="border-2 border-orange-200 rounded-xl p-2 w-28 text-sm focus:border-orange-400 transition-colors" 
        value={pct} 
        onChange={e => setPct(e.target.value)} 
      />
      <motion.button 
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium shadow-md text-sm"
        onClick={() => onAdd({ b2bAccountId: b2bId || null, productId: productId || null, percentage: pct })}
        whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
        whileTap={{ scale: 0.95 }}
      >
        ➕ Add Rule
      </motion.button>
    </motion.div>
  );
}
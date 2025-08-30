"use client";

import { useState, useEffect } from "react";
import { adminCreateProduct, adminUpdateProduct } from "@/lib/api";

const emptyForm = {
  name: "", type: "THEME_PARK", shortDesc: "", longDesc: "",
  baseCurrency: "AED", basePrice: 0, isActive: true,
  images: [{ url: "", alt: "" }],
};

export default function ProductForm({ product, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        type: product.type,
        shortDesc: product.shortDesc || "",
        longDesc: product.longDesc || "",
        baseCurrency: product.baseCurrency,
        basePrice: product.basePrice,
        isActive: product.isActive,
        images: (product.images?.length ? product.images : [{ url: "", alt: "" }]).map(i => ({ url: i.url, alt: i.alt || "" })),
      });
    } else {
      setForm(emptyForm);
    }
  }, [product]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function saveProduct() {
    setLoading(true);
    try {
      const payload = { 
        ...form, 
        basePrice: Number(form.basePrice), 
        images: form.images.filter(i => i.url) 
      };
      
      if (product) {
        await adminUpdateProduct(product.id, payload);
      } else {
        await adminCreateProduct(payload);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4 overflow-hidden">
      <div className="w-full max-w-4xl bg-white rounded-xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">
                {product ? "Edit Product" : "Create New Product"}
              </h3>
              <p className="opacity-90 text-sm md:text-base">Fill in the details below</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Text 
              name="name" 
              label="Product Name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
            <Select 
              name="type" 
              label="Product Type" 
              value={form.type} 
              onChange={handleChange}
              options={["THEME_PARK", "TOUR", "ACTIVITY"]} 
            />
            <Select 
              name="baseCurrency" 
              label="Currency" 
              value={form.baseCurrency} 
              onChange={handleChange}
              options={["AED","USD","EUR"]} 
            />
            <Text 
              name="basePrice" 
              type="number" 
              label="Base Price (net)" 
              value={form.basePrice} 
              onChange={handleChange} 
              required
            />
            <Text 
              name="shortDesc" 
              label="Short Description" 
              value={form.shortDesc} 
              onChange={handleChange} 
            />
            <div className="flex items-center md:col-span-2">
              <Toggle 
                name="isActive" 
                label="Active Product" 
                checked={form.isActive} 
                onChange={handleChange} 
              />
            </div>
            <Textarea 
              name="longDesc" 
              label="Long Description" 
              value={form.longDesc} 
              onChange={handleChange} 
              className="md:col-span-2" 
            />
          </div>

          {/* Images Section */}
          <div className="space-y-3 md:space-y-4">
            <div className="font-semibold text-gray-800 flex items-center gap-2 text-sm md:text-base">
              <span>📷</span> Product Images
            </div>
            {form.images.map((img, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-3 p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl"
              >
                <input
                  className="border-2 border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 md:col-span-4 focus:border-violet-500 transition-colors text-sm md:text-base"
                  placeholder="https://example.com/image.jpg"
                  value={img.url}
                  onChange={(e) => {
                    const v = e.target.value; 
                    setForm(f => {
                      const arr = [...f.images]; 
                      arr[idx] = { ...arr[idx], url: v }; 
                      return { ...f, images: arr };
                    });
                  }}
                />
                <input
                  className="border-2 border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 md:col-span-2 focus:border-violet-500 transition-colors text-sm md:text-base"
                  placeholder="Alt text"
                  value={img.alt}
                  onChange={(e) => {
                    const v = e.target.value; 
                    setForm(f => {
                      const arr = [...f.images]; 
                      arr[idx] = { ...arr[idx], alt: v }; 
                      return { ...f, images: arr };
                    });
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2 md:gap-3">
              <button 
                className="text-xs md:text-sm text-blue-600 font-medium flex items-center gap-1 md:gap-2 hover:text-blue-700 transition-colors"
                onClick={() => setForm(f => ({ ...f, images: [...f.images, { url: "", alt: "" }] }))}
              >
                <span>➕</span> Add Image
              </button>
              {form.images.length > 1 && (
                <button 
                  className="text-xs md:text-sm text-red-600 font-medium flex items-center gap-1 md:gap-2 hover:text-red-700 transition-colors"
                  onClick={() => setForm(f => ({ ...f, images: f.images.slice(0, -1) }))}
                >
                  <span>🗑</span> Remove Last
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 md:gap-4 pt-4 md:pt-6 border-t border-gray-200">
            <button 
              className="px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl border-2 border-gray-300 text-gray-700 font-medium text-sm md:text-base hover:bg-gray-50 transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-lg text-sm md:text-base hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={saveProduct}
              disabled={loading || !form.name || form.basePrice <= 0}
            >
              {loading ? "⏳ Saving..." : product ? "💾 Save Changes" : "✨ Create Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Form Components
function Text({ label, name, value, onChange, type="text", className="", required = false }) {
  return (
    <label className={`space-y-1 md:space-y-2 ${className}`}>
      <span className="text-xs md:text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange}
        required={required}
        className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 text-sm md:text-base" 
      />
    </label>
  );
}

function Textarea({ label, name, value, onChange, className="", required = false }) {
  return (
    <label className={`space-y-1 md:space-y-2 ${className}`}>
      <span className="text-xs md:text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <textarea 
        name={name} 
        value={value} 
        onChange={onChange}
        required={required}
        className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 min-h-[100px] md:min-h-[120px] focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 text-sm md:text-base" 
      />
    </label>
  );
}

function Select({ label, name, value, onChange, options, className="", required = false }) {
  return (
    <label className={`space-y-1 md:space-y-2 ${className}`}>
      <span className="text-xs md:text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <select 
        name={name} 
        value={value} 
        onChange={onChange}
        required={required}
        className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl p-2 md:p-3 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 text-sm md:text-base"
      >
        {options.map(o => (
          <option key={o} value={o}>{o.replace('_', ' ')}</option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative w-10 h-5 md:w-12 md:h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-violet-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 md:top-1 md:left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'
          }`}
        />
      </div>
      <input 
        type="checkbox" 
        name={name} 
        checked={checked} 
        onChange={onChange}
        className="sr-only"
      />
      <span className="text-xs md:text-sm font-semibold text-gray-700">{label}</span>
    </label>
  );
}
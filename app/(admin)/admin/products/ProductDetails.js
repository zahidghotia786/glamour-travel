"use client";

import { useState } from "react";

export default function ProductDetails({ product, onClose, onEdit }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!product) return null;

  async function copyToClipboard(text, fieldName) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4 overflow-hidden">
      <div className="w-full max-w-5xl bg-white rounded-xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-gray-800 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-bold">Product Details</h3>
              <p className="opacity-90 text-sm md:text-base">View complete product information</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onEdit}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                ✏️ Edit
              </button>
              <button 
                onClick={onClose}
                className="text-white/80 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                📋 Basic Information
              </h4>
              
              <DetailField
                label="Product ID"
                value={product.id}
                onCopy={() => copyToClipboard(product.id, 'id')}
                copied={copiedField === 'id'}
                copyable
              />
              
              <DetailField
                label="Name"
                value={product.name}
                onCopy={() => copyToClipboard(product.name, 'name')}
                copied={copiedField === 'name'}
                copyable
              />
              
              <DetailField
                label="Category"
                value={product.category.name || 'N/A'}
              />
              
              <DetailField
                label="Status"
                value={product.isActive ? '✅ Active' : '⏸ Inactive'}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                💰 Pricing
              </h4>
              
              <DetailField
                label="Base Currency"
                value={product.baseCurrency || 'N/A'}
              />
              
              <DetailField
                label="Base Price"
                value={`${product.baseCurrency || ''} ${Number(product.basePrice || 0).toFixed(2)}`}
                onCopy={() => copyToClipboard(product.basePrice?.toString(), 'price')}
                copied={copiedField === 'price'}
                copyable
              />
              
              <DetailField
                label="Created"
                value={formatDate(product.createdAt)}
              />
              
              <DetailField
                label="Updated"
                value={formatDate(product.updatedAt)}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              📝 Descriptions
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <DetailField
                  label="Short Description"
                  value={product.shortDesc || 'No short description provided'}
                  multiline
                  onCopy={() => copyToClipboard(product.shortDesc, 'shortDesc')}
                  copied={copiedField === 'shortDesc'}
                  copyable={!!product.shortDesc}
                />
              </div>
              
              <div>
                <DetailField
                  label="Long Description"
                  value={product.longDesc || 'No long description provided'}
                  multiline
                  onCopy={() => copyToClipboard(product.longDesc, 'longDesc')}
                  copied={copiedField === 'longDesc'}
                  copyable={!!product.longDesc}
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              📸 Images ({product.images?.length || 0})
            </h4>
            
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={image.alt || `Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: image.url ? 'none' : 'flex' }}>
                        🖼️ No Image
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">URL</span>
                        {image.url && (
                          <button
                            onClick={() => copyToClipboard(image.url, `image-${index}-url`)}
                            className={`text-xs px-2 py-1 rounded transition-colors ${
                              copiedField === `image-${index}-url`
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {copiedField === `image-${index}-url` ? '✓ Copied' : '📋 Copy'}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-700 break-all">
                        {image.url || 'No URL provided'}
                      </p>
                      
                      {image.alt && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600">Alt Text</span>
                            <button
                              onClick={() => copyToClipboard(image.alt, `image-${index}-alt`)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                copiedField === `image-${index}-alt`
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              {copiedField === `image-${index}-alt` ? '✓ Copied' : '📋 Copy'}
                            </button>
                          </div>
                          <p className="text-xs text-gray-700">
                            {image.alt}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📷</div>
                <div>No images available</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="px-4 py-2 md:px-6 md:py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-medium text-sm md:text-base hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={onEdit}
              className="px-4 py-2 md:px-6 md:py-3 rounded-lg bg-blue-600 text-white font-medium text-sm md:text-base hover:bg-blue-700 transition-colors"
            >
              ✏️ Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Detail Field Component
function DetailField({ label, value, onCopy, copied, copyable = false, multiline = false }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-600">{label}</label>
        {copyable && (
          <button
            onClick={onCopy}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        )}
      </div>
      {multiline ? (
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 min-h-[80px] max-h-[120px] overflow-y-auto">
          {value}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 font-mono">
          {value}
        </div>
      )}
    </div>
  );
}
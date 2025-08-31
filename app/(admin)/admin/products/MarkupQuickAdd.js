"use client";

import { useState } from "react";

export default function MarkupQuickAdd({ onAdd }) {
  const [pct, setPct] = useState("");
  const [productId, setProductId] = useState("");
  const [b2bId, setB2bId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!pct || isNaN(pct) ) {
      alert('Please enter a valid percentage');
      return;
    }

    setLoading(true);
    try {
      await onAdd({ 
        b2bAccountId: b2bId || null, 
        productId: productId || null, 
        percentage: pct 
      });
      
      // Reset form
      setPct("");
      setProductId("");
      setB2bId("");
    } catch (error) {
      console.error('Error adding markup:', error);
      alert('Failed to add markup rule. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-3 p-3 md:p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl md:rounded-2xl border border-orange-200">
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 flex-1">
        <input 
          placeholder="B2B Account ID (optional)" 
          className="border-2 border-orange-200 rounded-lg md:rounded-xl p-2 text-xs md:text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all flex-1" 
          value={b2bId} 
          onChange={e => setB2bId(e.target.value)}
          disabled={loading}
        />
        <input 
          placeholder="Product ID (optional)" 
          className="border-2 border-orange-200 rounded-lg md:rounded-xl p-2 text-xs md:text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all flex-1" 
          value={productId} 
          onChange={e => setProductId(e.target.value)}
          disabled={loading}
        />
        <input 
          placeholder="% Markup *" 
          type="number"
          step="0.5"
          className="border-2 border-orange-200 rounded-lg md:rounded-xl p-2 w-full md:w-28 text-xs md:text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" 
          value={pct} 
          onChange={e => setPct(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <button 
        className="px-3 py-2 md:px-4 md:py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-medium shadow-md text-xs md:text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAdd}
        disabled={loading || !pct}
      >
        {loading ? "⏳ Adding..." : "➕ Add Rule"}
      </button>
      
      <div className="text-xs text-gray-600 mt-2 md:mt-0 md:ml-2 md:self-center">
        <div>💡 <strong>Tip:</strong></div>
        <div>Leave fields empty for global rules</div>
      </div>
    </div>
  );
}
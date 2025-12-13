// components/PaymentSettings.js → FINAL 2025 (DYNAMIC CURRENCY + API SAVE + INR)

"use client";

import { useState, useEffect } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CURRENCY_OPTIONS = [
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export default function PaymentSettings() {
  const [currency, setCurrency] = useState('SAR');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load currency from API
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/settings/currency');
        if (res.ok) {
          const data = await res.json();
          setCurrency(data.currency || 'SAR');
        }
      } catch (err) {
        console.error('Failed to load currency');
      } finally {
        setLoading(false);
      }
    };
    loadCurrency();
  }, []);

  const handleCurrencyChange = async (newCurrency) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings/currency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: newCurrency }),
      });

      if (!res.ok) throw new Error('Failed to save');
      setCurrency(newCurrency);
      toast.success(`Currency updated to ${newCurrency}`);
    } catch (err) {
      toast.error('Failed to update currency');
    } finally {
      setSaving(false);
    }
  };

  const currentCurrency = CURRENCY_OPTIONS.find(c => c.code === currency) || CURRENCY_OPTIONS[0];

  return (
    <div className="min-h-screen bg-gray-50 pb-32">

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-900">Payment & Currency</h1>
          <p className="text-sm text-gray-500 mt-1">Manage payouts and store currency</p>
        </div>
      </div>

      {/* CURRENCY SELECTOR */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Globe className="text-gray-600" size={28} />
            <h2 className="text-xl font-bold text-gray-900">Store Currency</h2>
          </div>
          <p className="text-gray-600 mb-5">All prices and payouts will use this currency</p>

          {loading ? (
            <div className="py-8 text-center">
              <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
            </div>
          ) : (
            <>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                disabled={saving}
                className="w-full px-6 py-5 bg-gray-50 rounded-2xl border border-gray-200 text-xl font-medium focus:outline-none focus:ring-4 focus:ring-orange-500 transition"
              >
                {CURRENCY_OPTIONS.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>

              <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                <p className="text-emerald-800 font-medium text-lg">
                  Current currency: <span className="text-3xl font-bold">{currentCurrency.code}</span>
                </p>
                <p className="text-emerald-700 mt-2">
                  Symbol: {currentCurrency.symbol} • {currentCurrency.name}
                </p>
                {saving && (
                  <p className="text-sm text-emerald-600 mt-3 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} />
                    Saving changes...
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* PAYMENT INTEGRATION — COMING SOON */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg text-center">
          <Globe className="mx-auto text-blue-600 mb-6" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Integration Coming Soon</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-md mx-auto">
            We're building secure, fast payouts with Stripe, PayPal, Razorpay (for INR), and local banks.
          </p>
          <div className="bg-white/70 rounded-2xl p-5 inline-block">
            <p className="text-3xl font-bold text-indigo-600">Launching Q1 2026</p>
            <p className="text-sm text-indigo-600 mt-2">Instant payouts • Zero fees on launch</p>
          </div>
        </div>
      </div>

      {/* FIXED SAVE BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl">
        <button 
          disabled={saving}
          className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold text-xl hover:shadow-xl transition shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Saving...
            </>
          ) : (
            'Settings Saved'
          )}
        </button>
      </div>
    </div>
  );
}
// components/PaymentSettings.js → UPDATED 2025 (CONTROLLED COMPONENT – NO SEPARATE SAVE)

"use client";

import { Globe, Loader2 } from 'lucide-react';

const CURRENCY_OPTIONS = [
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

export default function PaymentSettings({ currency, setCurrency }) {
  // We no longer need local state, loading or saving flags for currency
  // (parent handles state + saving)

  const currentCurrency = CURRENCY_OPTIONS.find(c => c.code === currency) || CURRENCY_OPTIONS[0];

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    // Optional: you can add a small toast here if you want instant feedback
    // toast.success(`Currency set to ${newCurrency}`);
  };

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

          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
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
          </div>
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

      {/* NO FIXED SAVE BUTTON HERE ANYMORE */}
      {/* The main page's "Save All Changes" button now handles everything */}

    </div>
  );
}
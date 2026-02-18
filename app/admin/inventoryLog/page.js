'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, PlusCircle, Loader2, Search, Download, X, Save, Package } from 'lucide-react';
import { format } from 'date-fns';

export default function InventoryLogPage() {
  const router = useRouter();

  const [logs, setLogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [showAddLogModal, setShowAddLogModal] = useState(false);
  const [submittingLog, setSubmittingLog] = useState(false);
  const [logForm, setLogForm] = useState({
    productId: '',
    type: 'manual-adjustment',
    quantity: '',
    reason: '',
    notes: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchInventoryLogs();
  }, [typeFilter, startDate, endDate]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products`);
      if (!res.ok) return;
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.warn('Failed to load products');
    }
  };

  const fetchInventoryLogs = async () => {
    setLoading(true);
    try {
      let url = `/api/inventory-log`;
      if (typeFilter !== 'all') url += `?type=${typeFilter}`;
      if (startDate) url += `${url.includes('?') ? '&' : '?'}startDate=${startDate}`;
      if (endDate) url += `${url.includes('?') ? '&' : '?'}endDate=${endDate}`;

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to load logs');
      }

      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      toast.error(err.message || 'Could not load inventory logs');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogInputChange = (e) => {
    const { name, value } = e.target;
    setLogForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    if (!logForm.productId) return toast.error('Please select a product');
    if (!logForm.quantity || isNaN(logForm.quantity) || Number(logForm.quantity) === 0) {
      return toast.error('Enter a valid non-zero quantity');
    }

    setSubmittingLog(true);

    try {
      const res = await fetch('/api/inventory-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: logForm.productId,
          type: logForm.type,
          quantity: Number(logForm.quantity),
          reason: logForm.reason.trim() || undefined,
          notes: logForm.notes.trim() || undefined,
          performedBy: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save log entry');

      toast.success('Inventory log entry created');
      setShowAddLogModal(false);
      setLogForm({ productId: '', type: 'manual-adjustment', quantity: '', reason: '', notes: '' });
      fetchInventoryLogs();
    } catch (err) {
      toast.error(err.message || 'Failed to create log entry');
    } finally {
      setSubmittingLog(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      search === '' ||
      log.productId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.reason?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const exportCSV = () => {
    if (!filteredLogs.length) return toast.info('No logs to export');

    const headers = ['Date', 'Product', 'Type', 'Quantity', 'Value', 'Reason', 'Performed By'];
    const rows = filteredLogs.map(log => [
      format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm'),
      log.productId?.name || '—',
      log.type.replace('-', ' '),
      log.quantity,
      log.totalValue ? `₹${log.totalValue.toFixed(2)}` : '—',
      log.reason || '—',
      log.performedBy?.name || 'System'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory-log-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading inventory log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inventory Log</h1>
              <p className="text-sm text-gray-600">
                Track stock movements, sales, restocks, waste & adjustments
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddLogModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              <PlusCircle size={18} /> Manual Adjustment / Waste
            </button>

            <button
              onClick={exportCSV}
              disabled={!filteredLogs.length}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                !filteredLogs.length
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Download size={18} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Product name or reason..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="w-full md:w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="sale">Sales</option>
                <option value="restock">Restock</option>
                <option value="manual-adjustment">Manual Adjustment</option>
                <option value="waste">Waste</option>
                <option value="theft">Theft</option>
                <option value="damage">Damage</option>
                <option value="return">Return</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('all');
                setStartDate('');
                setEndDate('');
              }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Logs Table */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 text-lg font-medium">{error}</p>
            <button
              onClick={() => {
                setError('');
                setLoading(true);
                fetchInventoryLogs();
              }}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No inventory movements found</p>
            <p className="mt-2">
              {search || typeFilter !== 'all' || startDate || endDate
                ? 'Try adjusting filters'
                : 'No stock movements recorded yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map(log => (
                    <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {format(new Date(log.createdAt), 'dd MMM yyyy • hh:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {log.productId?.name || '—'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.productId?.category || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          log.type === 'sale' ? 'bg-red-100 text-red-800' :
                          log.type === 'restock' ? 'bg-green-100 text-green-800' :
                          log.type.includes('waste') || log.type.includes('theft') || log.type.includes('damage')
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.type.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className={log.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {log.quantity > 0 ? '+' : ''}{log.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {log.totalValue ? (
                          <span className="font-medium">₹{log.totalValue.toFixed(2)}</span>
                        ) : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {log.reason || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {log.performedBy?.name || 'System'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t bg-gray-50 text-sm text-gray-500 text-center">
              Showing {filteredLogs.length} of {logs.length} movements
            </div>
          </div>
        )}
      </div>

      {/* Manual Log Modal */}
      {showAddLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Log Stock Movement</h2>
              <button
                onClick={() => setShowAddLogModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitLog} className="p-6 space-y-6">
              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product <span className="text-red-500">*</span>
                </label>
                <select
                  name="productId"
                  value={logForm.productId}
                  onChange={handleLogInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select product</option>
                  {products.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.category || '—'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movement Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={logForm.type}
                  onChange={handleLogInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="manual-adjustment">Manual Adjustment</option>
                  <option value="restock">Restock / Received</option>
                  <option value="waste">Waste / Spoilage</option>
                  <option value="theft">Theft / Loss</option>
                  <option value="damage">Damage / Breakage</option>
                  <option value="return">Customer Return</option>
                  <option value="correction">Stock Correction</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={logForm.quantity}
                  onChange={handleLogInputChange}
                  placeholder="Positive = add, Negative = remove"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use negative number for removals (e.g. -5 for waste)
                </p>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={logForm.reason}
                  onChange={handleLogInputChange}
                  placeholder="e.g. Expired items, Manual count correction..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  name="notes"
                  value={logForm.notes}
                  onChange={handleLogInputChange}
                  rows={3}
                  placeholder="Any extra details..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLog}
                  className={`px-6 py-3 rounded-xl font-medium text-white flex items-center gap-2 transition ${
                    submittingLog ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {submittingLog ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Log Entry
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

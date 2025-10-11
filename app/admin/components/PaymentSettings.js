import { CreditCard } from 'lucide-react';

const PaymentSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
      
      <div className="space-y-4">
        <div className="p-4 border-2 border-orange-500 rounded-lg bg-orange-50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Visa ending in 4242</p>
                <p className="text-sm text-gray-600">Expires 12/2025</p>
                <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                  Primary
                </span>
              </div>
            </div>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Edit
            </button>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="text-white" size={24} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Mastercard ending in 8888</p>
                <p className="text-sm text-gray-600">Expires 06/2026</p>
              </div>
            </div>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Edit
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium">
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;
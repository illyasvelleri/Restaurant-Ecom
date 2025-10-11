const TopProducts = ({ topProducts }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Top Products</h3>
      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sales} sales</p>
              </div>
            </div>
            <span className="font-bold text-gray-900">{product.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
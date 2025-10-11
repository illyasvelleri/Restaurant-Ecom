"use client";

import { Package, Eye, Edit2, Trash2, Star } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        <Package size={64} className="text-orange-500 opacity-50" />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(product)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-blue-50 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-green-50 text-green-600 transition-colors"
            title="Edit Product"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 text-red-600 transition-colors"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {product.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
          <span className="text-xl font-bold text-orange-600">${product.price}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
            {product.category}
          </span>
          <div className="flex items-center text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-medium text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{product.description}</p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Stock</p>
            <p className={`text-sm font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {product.stock} units
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Sales</p>
            <p className="text-sm font-semibold text-gray-900">{product.sales}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
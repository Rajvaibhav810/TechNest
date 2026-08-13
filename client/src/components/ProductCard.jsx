import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group block h-full">
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10 h-full flex flex-col relative">
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-900/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg transform -rotate-12">OUT OF STOCK</span>
          </div>
        )}
        <div className="relative aspect-square overflow-hidden bg-gray-900">
          <img
            src={product.image || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-gray-950/80 backdrop-blur text-cyan-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-cyan-500/30">
              {product.category}
            </span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-cyan-400 transition-colors">{product.name}</h3>
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2.5 rounded-lg flex items-center justify-center transition-colors ${
                isOutOfStock
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500 text-gray-950 hover:bg-cyan-400'
              }`}
              aria-label="Add to cart"
            >
              <ShoppingCart size={20} className={!isOutOfStock ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

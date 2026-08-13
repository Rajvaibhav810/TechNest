import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronRight, Package, ShieldCheck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<Package size={64} className="text-gray-600" />}
          title="Product not found"
          description={error || "The product you're looking for doesn't exist."}
          action={{ label: "Back to Shop", to: "/products" }}
        />
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addItem(product, qty);
    toast.success(`${qty} ${product.name} added to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-400 mb-8">
        <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to="/products" className="hover:text-cyan-400 transition-colors">Shop</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to={`/products?category=${product.category}`} className="hover:text-cyan-400 transition-colors">{product.category}</Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-200 truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 aspect-square flex items-center justify-center group">
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-950/60 z-10 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-red-600 text-white text-xl font-bold px-6 py-3 rounded-xl transform -rotate-12 shadow-2xl">
                OUT OF STOCK
              </span>
            </div>
          )}
          <img
            src={product.image || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20 mb-4">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
            <div className="text-3xl font-extrabold text-white">
              ${product.price.toFixed(2)}
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-300 font-medium">Availability:</span>
              {isOutOfStock ? (
                <span className="text-red-400 font-semibold bg-red-400/10 px-3 py-1 rounded-full">Out of Stock</span>
              ) : (
                <span className="text-green-400 font-semibold bg-green-400/10 px-3 py-1 rounded-full">{product.stock} in stock</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-300 font-medium">Quantity:</span>
              <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={isOutOfStock || qty <= 1}
                  className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-white font-medium">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  disabled={isOutOfStock || qty >= product.stock}
                  className="px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                isOutOfStock
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500 text-gray-950 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              }`}
            >
              <ShoppingCart className="mr-2" size={24} />
              {isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center p-4 bg-gray-900 rounded-xl border border-gray-800">
              <Package className="text-cyan-400 mr-3" size={24} />
              <div>
                <h4 className="text-white font-medium text-sm">Free Shipping</h4>
                <p className="text-gray-500 text-xs">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-900 rounded-xl border border-gray-800">
              <ShieldCheck className="text-cyan-400 mr-3" size={24} />
              <div>
                <h4 className="text-white font-medium text-sm">1 Year Warranty</h4>
                <p className="text-gray-500 text-xs">Full protection included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

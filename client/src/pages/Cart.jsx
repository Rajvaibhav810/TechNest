import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map(item => ({
      productId: item.product._id,
      quantity: item.quantity
      }));

      const { data } = await api.post('/orders', { items: orderItems });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<ShoppingCart size={64} className="text-gray-600" />}
          title="Your cart is empty"
          description="Looks like you haven't added any products to your cart yet."
          action={{ label: "Start Shopping", to: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow lg:w-2/3">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="hidden sm:grid sm:grid-cols-12 bg-gray-950 border-b border-gray-800 p-4 text-sm font-medium text-gray-400">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
              <div className="col-span-1"></div>
            </div>
            
            <ul className="divide-y divide-gray-800">
              {items.map((item) => (
                <li key={item.product._id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 sm:col-span-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
                    <div className="w-24 h-24 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-700">
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center sm:text-left flex-grow">
                      <Link to={`/products/${item.product._id}`} className="text-lg font-semibold text-white hover:text-cyan-400 transition-colors line-clamp-2">
                        {item.product.name}
                      </Link>
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded border border-gray-700">
                        {item.product.category}
                      </span>
                      <div className="mt-2 text-cyan-400 font-medium sm:hidden">${item.product.price.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 sm:col-span-3 flex justify-center">
                    <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700">
                      <button
                        onClick={() => updateQty(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1.5 text-gray-400 hover:text-white disabled:opacity-50"
                      >-</button>
                      <span className="w-10 text-center text-white text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-3 py-1.5 text-gray-400 hover:text-white disabled:opacity-50"
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 sm:col-span-2 text-center sm:text-right font-bold text-white text-lg">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <div className="col-span-1 flex justify-center sm:justify-end">
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <Link to="/products" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center">
              Continue Shopping
            </Link>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-gray-400 hover:text-red-400 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-green-400">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-white">Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-white">Total</span>
                <span className="text-2xl font-bold text-white">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="w-6 h-6 border-2 border-gray-950/20 border-t-gray-950 rounded-full animate-spin"></span>
              ) : (
                <>Checkout <ArrowRight size={20} className="ml-2" /></>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center">
               Secure checkout powered by TechNest
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        onConfirm={() => {
          clearCart();
          setShowClearConfirm(false);
          toast.success('Cart cleared');
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}

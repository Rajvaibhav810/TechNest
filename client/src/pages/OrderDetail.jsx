import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, Truck, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<Package size={64} className="text-gray-600" />}
          title="Order not found"
          description={error || "We couldn't find the order you're looking for."}
          action={{ label: "Back to Orders", to: "/orders" }}
        />
      </div>
    );
  }

  const getStatusStep = (status) => {
    switch (status) {
      case 'Order Placed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const currentStep = getStatusStep(order.status);
  const steps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/orders" className="inline-flex items-center text-sm text-gray-400 hover:text-cyan-400 transition-colors mb-6">
        <ArrowLeft size={16} className="mr-2" /> Back to Orders
      </Link>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Order #{order._id.substring(0, 8).toUpperCase()}
          </h1>
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar size={14} className="mr-2" />
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
          </div>
        </div>
        <div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Progress Stepper */}
      {currentStep !== -1 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-cyan-500 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = currentStep >= stepNumber;
                const isCurrent = currentStep === stepNumber;
                
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors ${
                      isCompleted ? 'bg-cyan-500 text-gray-950' : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                    }`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : stepNumber}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium mt-3 text-center ${
                      isCurrent ? 'text-cyan-400' : isCompleted ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {order.status === 'Cancelled' && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Order Cancelled</h3>
          <p className="text-gray-400 text-sm">This order has been cancelled and will not be fulfilled.</p>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-8">
        <div className="p-4 sm:p-6 border-b border-gray-800 bg-gray-950">
          <h2 className="text-lg font-semibold text-white">Order Items</h2>
        </div>
        <ul className="divide-y divide-gray-800">
          {order.items.map((item) => (
            <li key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                <img src={item.product?.imageUrl || 'https://via.placeholder.com/150'} alt={item.product?.name || 'Product'} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <Link to={item.product ? `/products/${item.product._id}` : '#'} className="text-white font-medium hover:text-cyan-400 transition-colors">
                  {item.product?.name || 'Product unavailable'}
                </Link>
                <div className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</div>
              </div>
              <div className="text-white font-bold mt-2 sm:mt-0">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Payment Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Shipping</span>
            <span className="text-green-400">Free</span>
          </div>
          <div className="border-t border-gray-800 pt-3 mt-3 flex justify-between items-center text-white font-bold text-lg">
            <span>Total</span>
            <span className="text-cyan-400">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

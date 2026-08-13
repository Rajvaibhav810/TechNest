import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Calendar, DollarSign } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
  try {
    const response = await api.get('/orders');

    const rawOrders =
      response.data?.data?.orders ||
      response.data?.data ||
      response.data?.orders ||
      response.data ||
      [];

    const normalizedOrders = Array.isArray(rawOrders)
      ? rawOrders.map((order) => ({
          ...order,
          status: order.status || order.orderStatus || 'Pending',
          items: order.items || order.products || [],
          total: order.total ?? order.totalAmount ?? 0,
          createdAt: order.createdAt || order.orderDate || new Date().toISOString()
        }))
      : [];

    setOrders(normalizedOrders);
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    setOrders([]);
  } finally {
    setLoading(false);
  }
};
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<Package size={64} className="text-gray-600" />}
          title="No orders yet"
          description="When you place orders, they will appear here."
          action={{ label: "Start Shopping", to: "/products" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Order History</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block bg-gray-900 border border-gray-800 hover:border-cyan-500/50 rounded-xl p-5 sm:p-6 transition-all group"
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={14} className="mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:w-1/3">
                <StatusBadge status={order.status} />
                <ChevronRight size={20} className="text-gray-600 group-hover:text-cyan-400 ml-4 hidden sm:block" />
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="text-sm text-gray-400">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </div>
              <div className="flex items-center text-white font-bold">
                <DollarSign size={16} className="text-gray-500 mr-1" />
                {order.total.toFixed(2)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

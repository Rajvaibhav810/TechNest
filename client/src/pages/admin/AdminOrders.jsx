import React, { useState, useEffect } from 'react';
import { Filter, Eye } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = statusFilter 
    ? orders.filter(o => o.status === statusFilter)
    : orders;

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Manage Orders</h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-gray-800 bg-gray-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center text-gray-300">
              <Filter size={18} className="mr-2" />
              <span className="text-sm font-medium mr-3">Filter by status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="">All Orders</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="text-sm text-gray-400">
              Showing {filteredOrders.length} orders
            </div>
          </div>

          <div className="overflow-x-auto flex-grow">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-950 text-xs uppercase text-gray-500 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Customer (Email)</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Status Update</th>
                    <th className="px-6 py-4 font-medium text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">#{order._id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <span className="block text-gray-300">{order.user?.email || 'Unknown User'}</span>
                      </td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-white">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={order.status} />
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updatingId === order._id}
                            className="bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                          >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {updatingId === order._id && <span className="w-3 h-3 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={`/orders/${order._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-cyan-400 p-2 transition-colors inline-block"
                          title="View Order Details"
                        >
                          <Eye size={18} />
                        </a>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

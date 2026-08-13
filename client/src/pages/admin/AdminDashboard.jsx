import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center pt-16">
        <LoadingSpinner />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || '0'}`,
      icon: <DollarSign size={24} />,
      color: 'green',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart size={24} />,
      color: 'blue',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <Package size={24} />,
      color: 'purple',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Users size={24} />,
      color: 'cyan',
    },
  ];

  const colorMap = {
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4"
            >
              <div className={`p-4 rounded-xl border ${colorMap[card.color]}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center"
              >
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-950 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {(stats?.recentOrders || []).map((order) => (
                    <tr key={order._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-white">
                        {order.orderId || order._id?.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {order.userId?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.orderStatus} />
                      </td>
                    </tr>
                  ))}
                  {(stats?.recentOrders || []).length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        No orders yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/admin/products"
                className="flex items-center p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center mr-4 group-hover:bg-cyan-500 group-hover:text-gray-950 transition-colors">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium">Manage Products</h3>
                  <p className="text-xs text-gray-400">Add, edit, or delete items</p>
                </div>
              </Link>
              <Link
                to="/admin/orders"
                className="flex items-center p-4 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-colors group"
              >
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-500 group-hover:text-gray-950 transition-colors">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <h3 className="text-white font-medium">Manage Orders</h3>
                  <p className="text-xs text-gray-400">Update fulfillment status</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

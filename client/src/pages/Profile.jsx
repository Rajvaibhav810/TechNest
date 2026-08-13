import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, Calendar, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ orderCount: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const fetchProfileData = async () => {
    try {
      const ordersRes = await api.get('/orders');

      setProfile(user);

      const ordersData =
        ordersRes.data?.data?.orders ||
        ordersRes.data?.data ||
        ordersRes.data ||
        [];

      setStats({
        orderCount: Array.isArray(ordersData) ? ordersData.length : 0
      });
    } catch (err) {
      console.error('Failed to load profile data:', err);
      setProfile(user);
      setStats({ orderCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    fetchProfileData();
  } else {
    setLoading(false);
  }
}, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-4xl font-bold border-2 border-cyan-500/30 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
             {profile.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700 mt-2">
              {profile.role === 'admin' ? (
                <><Shield size={12} className="mr-1 text-cyan-400" /> Admin</>
              ) : (
                <><User size={12} className="mr-1" /> Customer</>
              )}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-800 pb-3">Personal Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 mr-4">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-white font-medium">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 mr-4">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="text-white font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 mr-4">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-white font-medium">{new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mr-4">
                <Package size={24} />
              </div>
              <div>
                <p className="text-white font-semibold">Total Orders</p>
                <p className="text-2xl font-bold text-cyan-400">{stats.orderCount}</p>
              </div>
            </div>
            <Link to="/orders" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg transition-colors text-sm font-medium">
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

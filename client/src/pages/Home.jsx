import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Monitor, Laptop, Keyboard, Mouse, Headphones, Cpu, Zap, Star, Users, Truck } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?limit=8');
        setFeatured(data.data?.products || []);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Gaming', icon: <Monitor size={32} />, path: '/products?category=Gaming' },
    { name: 'Laptops', icon: <Laptop size={32} />, path: '/products?category=Laptops' },
    { name: 'Keyboards', icon: <Keyboard size={32} />, path: '/products?category=Keyboards' },
    { name: 'Mouse', icon: <Mouse size={32} />, path: '/products?category=Mouse' },
    { name: 'Headphones', icon: <Headphones size={32} />, path: '/products?category=Headphones' },
    { name: 'Accessories', icon: <Cpu size={32} />, path: '/products?category=Accessories' },
  ];

  const stats = [
    { label: 'Products', value: '500+', icon: <Zap size={24} className="text-cyan-400" /> },
    { label: 'Customers', value: '10K+', icon: <Users size={24} className="text-cyan-400" /> },
    { label: 'Rating', value: '4.9★', icon: <Star size={24} className="text-cyan-400" /> },
    { label: 'Shipping', value: 'Free', icon: <Truck size={24} className="text-cyan-400" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Next-Gen</span> Tech,
            <br /> Delivered.
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Elevate your setup with premium gear. From high-performance gaming rigs to minimalist accessories, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center">
              Shop Now <ArrowRight size={20} className="ml-2" />
            </Link>
            <a href="#categories" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Browse Categories
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-950 border-b border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center">
                <div className="bg-gray-900 p-3 rounded-full mb-3 border border-gray-800">{stat.icon}</div>
                <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Products</h2>
            <p className="text-gray-400">Handpicked gear for maximum performance.</p>
          </div>
          <Link to="/products" className="hidden sm:flex text-cyan-400 hover:text-cyan-300 font-medium items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featured.map((product) => <ProductCard key={product._id} product={product} />)
          }
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Shop by Category</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Find exactly what you're looking for by browsing our curated collections.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link key={i} to={cat.path} className="bg-gray-800 border border-gray-700 hover:border-cyan-500 hover:bg-gray-800/80 rounded-2xl p-6 flex flex-col items-center justify-center transition-all group">
                <div className="text-gray-400 group-hover:text-cyan-400 transition-colors mb-4">
                  {cat.icon}
                </div>
                <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-900/20"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to upgrade your setup?</h2>
          <p className="text-xl text-gray-300 mb-10">Join thousands of satisfied gamers and professionals who trust TechNest for their gear.</p>
          <Link to="/products" className="inline-flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold py-4 px-10 rounded-lg transition-colors text-lg">
            Shop the Collection <Zap size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}

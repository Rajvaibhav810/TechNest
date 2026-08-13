import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, Frown } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || '';

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['Gaming', 'Laptops', 'Keyboards', 'Mouse', 'Headphones', 'Accessories'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/products?';
        if (currentCategory) url += `category=${currentCategory}&`;
        if (currentSearch) url += `search=${currentSearch}&`;
        if (currentSort) url += `sort=${currentSort}&`;
        
        const { data } = await api.get(url);
        setProducts(data.data?.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentCategory, currentSearch, currentSort]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput) params.set('search', searchInput);
    else params.delete('search');
    setSearchParams(params);
  };

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === currentCategory) params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    if (e.target.value) params.set('sort', e.target.value);
    else params.delete('sort');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Shop All Gear</h1>
          <p className="text-gray-400">Discover top-tier tech for your setup.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          </form>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg"
          >
            <Filter size={18} className="mr-2" /> Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`w-full md:w-64 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center"><Filter size={18} className="mr-2 text-cyan-500"/> Filters</h3>
              {(currentCategory || currentSearch || currentSort) && (
                <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-cyan-400">Clear All</button>
              )}
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Categories</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentCategory === cat}
                      onChange={() => handleCategoryChange(cat)}
                      className="form-checkbox h-4 w-4 text-cyan-500 rounded border-gray-600 bg-gray-900 focus:ring-cyan-500 focus:ring-offset-gray-800"
                    />
                    <span className={`ml-3 text-sm ${currentCategory === cat ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Sort By</h4>
              <select
                value={currentSort}
                onChange={handleSortChange}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Recommended</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-400">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<Frown size={48} />}
              title="No products found"
              description="We couldn't find any products matching your current filters or search query."
              action={{ label: "Clear Filters", to: "/products", onClick: clearFilters }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

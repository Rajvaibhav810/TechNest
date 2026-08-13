import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Zap, ShoppingCart, Menu, X, User, Package, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="text-cyan-500" size={28} />
            <span className="text-xl font-bold text-white tracking-tight">TechNest</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-cyan-400 ${
                    isActive ? 'text-cyan-500 border-b-2 border-cyan-500 py-5' : 'text-gray-300 py-5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-cyan-400 transition-colors">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-cyan-600 rounded-full border-2 border-gray-950 transform translate-x-1 -translate-y-1">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <HeadlessMenu as="div" className="relative">
                <HeadlessMenu.Button className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-white transition-colors focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center border border-cyan-500/30">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </HeadlessMenu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-gray-800 border border-gray-700 shadow-lg py-1 focus:outline-none">
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <Link to="/profile" className={`${active ? 'bg-gray-700 text-white' : 'text-gray-300'} flex items-center px-4 py-2 text-sm`}>
                          <User size={16} className="mr-3" /> Profile
                        </Link>
                      )}
                    </HeadlessMenu.Item>
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <Link to="/orders" className={`${active ? 'bg-gray-700 text-white' : 'text-gray-300'} flex items-center px-4 py-2 text-sm`}>
                          <Package size={16} className="mr-3" /> Orders
                        </Link>
                      )}
                    </HeadlessMenu.Item>
                    {user.role === 'admin' && (
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <Link to="/admin" className={`${active ? 'bg-gray-700 text-white' : 'text-gray-300'} flex items-center px-4 py-2 text-sm text-cyan-400`}>
                            <Zap size={16} className="mr-3" /> Admin Panel
                          </Link>
                        )}
                      </HeadlessMenu.Item>
                    )}
                    <div className="border-t border-gray-700 my-1"></div>
                    <HeadlessMenu.Item>
                      {({ active }) => (
                        <button onClick={logout} className={`${active ? 'bg-red-500/10 text-red-400' : 'text-red-400'} flex w-full items-center px-4 py-2 text-sm`}>
                          <LogOut size={16} className="mr-3" /> Logout
                        </button>
                      )}
                    </HeadlessMenu.Item>
                  </HeadlessMenu.Items>
                </Transition>
              </HeadlessMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Log in</Link>
                <Link to="/register" className="text-sm font-medium bg-cyan-500 text-gray-950 px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-300">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-cyan-600 rounded-full border-2 border-gray-950 transform translate-x-1 -translate-y-1">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <div className="border-t border-gray-800 my-2 pt-2"></div>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Profile</Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:bg-gray-800">Admin Panel</Link>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-800">Logout</button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-800 my-2 pt-2"></div>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Log in</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-cyan-400 hover:bg-gray-800">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <AlertCircle size={64} className="text-cyan-500 mb-6" />
      <h1 className="text-5xl font-bold text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-300 mb-8">Page Not Found</h2>
      <p className="text-gray-400 max-w-md text-center mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold py-3 px-8 rounded-lg transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 animate-pulse">
      <div className="w-full aspect-square bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

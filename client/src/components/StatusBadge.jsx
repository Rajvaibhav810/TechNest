import React from 'react';

export default function StatusBadge({ status }) {
  const getColors = (s) => {
    switch (s) {
      case 'Order Placed': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Shipped': return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
      case 'Delivered': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'Cancelled': return 'bg-red-600/20 text-red-400 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getColors(status)}`}>
      {status}
    </span>
  );
}

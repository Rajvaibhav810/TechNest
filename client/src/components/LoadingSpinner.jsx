import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-10 h-10 border-4 border-gray-700 border-t-cyan-500 rounded-full animate-spin"></div>
    </div>
  );
}

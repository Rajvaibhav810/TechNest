import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-gray-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-md mb-6">{description}</p>
      {action && (
        <Link
          to={action.to}
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

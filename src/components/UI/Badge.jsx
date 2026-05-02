import React from 'react';

const colors = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  submitted: 'bg-purple-100 text-purple-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  paused: 'bg-orange-100 text-orange-700',
};

const Badge = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
    {status?.replace('_', ' ').toUpperCase()}
  </span>
);

export default Badge;
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const adminLinks = [
  { path: '/admin/dashboard', label: '🏠 Dashboard' },
  { path: '/admin/projects', label: '📁 Projects' },
  { path: '/admin/users', label: '👥 Users' },
  { path: '/admin/datasets', label: '📂 Datasets' },
  { path: '/admin/reports', label: '📊 Reports' },
];

const annotatorLinks = [
  { path: '/annotator/dashboard', label: '🏠 Dashboard' },
  { path: '/annotator/tasks', label: '✅ My Tasks' },
  { path: '/annotator/performance', label: '📈 Performance' },
];

const reviewerLinks = [
  { path: '/reviewer/dashboard', label: '🏠 Dashboard' },
  { path: '/reviewer/reviews', label: '🔍 Reviews' },
  { path: '/reviewer/feedback', label: '💬 Feedback' },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'annotator'
      ? annotatorLinks
      : reviewerLinks;

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 pt-6 px-3">
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const roleBadgeColor = {
    admin: 'bg-purple-100 text-purple-700',
    annotator: 'bg-blue-100 text-blue-700',
    reviewer: 'bg-green-100 text-green-700',
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <span className="font-bold text-gray-800 text-lg">AnnotateAI</span>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeColor[user?.role]}`}>
          {user?.role?.toUpperCase()}
        </span>
        <span className="text-sm text-gray-600">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
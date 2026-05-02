import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/slices/userSlice';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Loader from '../../components/UI/Loader';
import Badge from '../../components/UI/Badge';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);

  useEffect(() => { dispatch(fetchUsers()); }, []);

  const toggleActive = async (id, isActive) => {
    await axiosInstance.put(`/users/${id}`, { isActive: !isActive });
    toast.success('User status updated!');
    dispatch(fetchUsers());
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
      {loading ? <Loader /> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Action'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800">{user.name}</td>
                  <td className="px-5 py-3 text-gray-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <Badge status={user.role} />
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleActive(user._id, user.isActive)}
                      className={`text-xs font-medium px-3 py-1 rounded-lg ${user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserManagement;
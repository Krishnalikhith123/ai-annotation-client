import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (password.newPass !== password.confirm) return toast.error('Passwords do not match');
    try {
      await axiosInstance.put(`/users/${user.id}`, { password: password.newPass });
      toast.success('Password updated!');
      setPassword({ current: '', newPass: '', confirm: '' });
    } catch {
      toast.error('Failed to update password');
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      <div className="max-w-xl space-y-6">
        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">Profile Info</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm font-medium text-gray-800">{user?.name}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-800">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Role</span>
              <span className="text-sm font-medium text-indigo-600 capitalize">{user?.role}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: 'New Password', key: 'newPass' },
              { label: 'Confirm Password', key: 'confirm' },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-sm font-medium text-gray-700 block mb-1">{f.label}</label>
                <input
                  type="password"
                  value={password[f.key]}
                  onChange={(e) => setPassword({ ...password, [f.key]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Update Password
            </button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
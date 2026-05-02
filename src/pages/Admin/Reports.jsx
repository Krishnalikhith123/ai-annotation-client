import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Loader from '../../components/UI/Loader';
import axiosInstance from '../../utils/axiosConfig';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/analytics/overview'),
      axiosInstance.get('/users'),
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reports & Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">📊 Platform Overview</h2>
          {[
            { label: 'Total Projects', value: stats?.overview?.totalProjects },
            { label: 'Total Tasks', value: stats?.overview?.totalTasks },
            { label: 'Total Users', value: stats?.overview?.totalUsers },
            { label: 'Total Annotations', value: stats?.overview?.totalAnnotations },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="font-bold text-indigo-600">{item.value}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">👥 Users by Role</h2>
          {['admin', 'annotator', 'reviewer'].map((role) => {
            const count = users.filter((u) => u.role === role).length;
            return (
              <div key={role} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-600 capitalize">{role}</span>
                <span className="font-bold text-gray-800">{count}</span>
              </div>
            );
          })}
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">✅ Task Stats</h2>
          {stats?.taskStats?.map((s) => (
            <div key={s._id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600 capitalize">{s._id?.replace('_', ' ')}</span>
              <span className="font-bold text-gray-800">{s.count}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">📁 Project Stats</h2>
          {stats?.projectStats?.map((s) => (
            <div key={s._id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-600 capitalize">{s._id}</span>
              <span className="font-bold text-gray-800">{s.count}</span>
            </div>
          ))}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
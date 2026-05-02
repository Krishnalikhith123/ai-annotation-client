import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Loader from '../../components/UI/Loader';
import axiosInstance from '../../utils/axiosConfig';

const StatCard = ({ label, value, icon, color }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/analytics/overview').then((res) => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard label="Total Projects" value={stats?.overview?.totalProjects} icon="📁" color="text-indigo-600" />
        <StatCard label="Total Tasks" value={stats?.overview?.totalTasks} icon="✅" color="text-blue-600" />
        <StatCard label="Total Users" value={stats?.overview?.totalUsers} icon="👥" color="text-green-600" />
        <StatCard label="Annotations" value={stats?.overview?.totalAnnotations} icon="🖊️" color="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">Task Status Breakdown</h2>
          <div className="space-y-3">
            {stats?.taskStats?.map((s) => (
              <div key={s._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{s._id?.replace('_', ' ')}</span>
                <span className="font-semibold text-gray-800">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">Project Status Breakdown</h2>
          <div className="space-y-3">
            {stats?.projectStats?.map((s) => (
              <div key={s._id} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{s._id}</span>
                <span className="font-semibold text-gray-800">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
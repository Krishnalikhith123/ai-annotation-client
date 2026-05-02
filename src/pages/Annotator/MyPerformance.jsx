import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Loader from '../../components/UI/Loader';
import axiosInstance from '../../utils/axiosConfig';

const MyPerformance = () => {
  const { user } = useSelector((state) => state.auth);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get(`/analytics/annotator/${user.id}`).then((res) => {
      setPerformance(res.data.performance);
      setLoading(false);
    });
  }, [user.id]);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  const stats = [
    { label: 'Total Tasks', value: performance?.totalTasks, icon: '📋', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Submitted', value: performance?.submittedTasks, icon: '📤', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Approved', value: performance?.approvedTasks, icon: '✅', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rejected', value: performance?.rejectedTasks, icon: '❌', color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Accuracy Rate', value: `${performance?.accuracyRate}%`, icon: '🎯', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg Quality Score', value: performance?.avgQualityScore || 'N/A', icon: '⭐', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Performance</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center text-xl`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold text-gray-700 mb-4">Performance Summary</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium">{performance?.accuracyRate}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-indigo-500 rounded-full"
                style={{ width: `${performance?.accuracyRate}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Submission Rate</span>
              <span className="font-medium">
                {performance?.totalTasks > 0
                  ? Math.round((performance?.submittedTasks / performance?.totalTasks) * 100)
                  : 0}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{
                  width: `${performance?.totalTasks > 0
                    ? Math.round((performance?.submittedTasks / performance?.totalTasks) * 100)
                    : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default MyPerformance;
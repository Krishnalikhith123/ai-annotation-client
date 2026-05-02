import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Loader from '../../components/UI/Loader';
import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';

const ReviewerDashboard = () => {
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/annotations').then((res) => {
      setAnnotations(res.data.annotations.filter((a) => a.status === 'submitted').slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reviewer Dashboard</h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700">Pending Reviews</h2>
          <Link to="/reviewer/reviews" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        <div className="space-y-3">
          {annotations.map((a) => (
            <div key={a._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">{a.annotatedBy?.name}</p>
                <p className="text-xs text-gray-400">Label: {a.data?.label}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={a.status} />
                <Link
                  to="/reviewer/reviews"
                  className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                >
                  Review
                </Link>
              </div>
            </div>
          ))}
          {annotations.length === 0 && (
            <p className="text-center text-gray-400 py-6">No pending reviews 🎉</p>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default ReviewerDashboard;
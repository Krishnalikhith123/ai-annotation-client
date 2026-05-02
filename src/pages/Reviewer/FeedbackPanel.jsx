import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Loader from '../../components/UI/Loader';
import axiosInstance from '../../utils/axiosConfig';

const FeedbackPanel = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/reviews').then((res) => {
      setReviews(res.data.reviews);
      setLoading(false);
    });
  }, []);

  const statusColor = { approved: 'text-green-600', rejected: 'text-red-600', rework: 'text-yellow-600' };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Feedback History</h1>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review._id}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">
                  Reviewed by: {review.reviewedBy?.name}
                </p>
                <p className={`text-sm font-semibold mt-1 ${statusColor[review.status]}`}>
                  {review.status?.toUpperCase()}
                </p>
                {review.feedback && (
                  <p className="text-sm text-gray-500 mt-2">💬 {review.feedback}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                {review.qualityScore && (
                  <p className="text-lg font-bold text-indigo-600 mt-1">{review.qualityScore}/100</p>
                )}
              </div>
            </div>
          </Card>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <p>No reviews yet</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FeedbackPanel;
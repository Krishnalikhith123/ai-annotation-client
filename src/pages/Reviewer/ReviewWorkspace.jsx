import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Loader from '../../components/UI/Loader';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const ReviewWorkspace = () => {
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(80);
  const [submitting, setSubmitting] = useState(false);

  const loadAnnotations = () => {
    axiosInstance.get('/annotations').then((res) => {
      setAnnotations(res.data.annotations.filter((a) => a.status === 'submitted'));
      setLoading(false);
    });
  };

  useEffect(() => { loadAnnotations(); }, []);

  const handleReview = async (status) => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await axiosInstance.post('/reviews', {
        annotationId: selected._id,
        status,
        feedback,
        qualityScore: score,
      });
      toast.success(`Annotation ${status}!`);
      setSelected(null);
      setFeedback('');
      setScore(80);
      loadAnnotations();
    } catch {
      toast.error('Review failed');
    }
    setSubmitting(false);
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Review Workspace</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">Submitted Annotations ({annotations.length})</h2>
          <div className="space-y-3">
            {annotations.map((a) => (
              <div
                key={a._id}
                onClick={() => setSelected(a)}
                className={`p-3 rounded-lg cursor-pointer border transition ${selected?._id === a._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'}`}
              >
                <p className="text-sm font-medium text-gray-800">{a.annotatedBy?.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Label: <span className="font-medium text-indigo-600">{a.data?.label}</span></p>
                {a.data?.notes && <p className="text-xs text-gray-400 mt-0.5">Notes: {a.data.notes}</p>}
              </div>
            ))}
            {annotations.length === 0 && (
              <p className="text-center text-gray-400 py-6">No annotations to review 🎉</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-gray-700 mb-4">Review Panel</h2>
          {selected ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-700">Annotator: {selected.annotatedBy?.name}</p>
                <p className="text-sm text-gray-600 mt-1">Label: <span className="text-indigo-600 font-semibold">{selected.data?.label}</span></p>
                {selected.data?.notes && <p className="text-sm text-gray-500 mt-1">Notes: {selected.data.notes}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Quality Score: {score}</label>
                <input
                  type="range" min="0" max="100" value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  placeholder="Leave feedback for the annotator..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleReview('approved')}
                  disabled={submitting}
                  className="bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-60"
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => handleReview('rework')}
                  disabled={submitting}
                  className="bg-yellow-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition disabled:opacity-60"
                >
                  🔄 Rework
                </button>
                <button
                  onClick={() => handleReview('rejected')}
                  disabled={submitting}
                  className="bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60"
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">👈</div>
              <p>Select an annotation to review</p>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReviewWorkspace;
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Loader from '../../components/UI/Loader';
import Badge from '../../components/UI/Badge';
import axiosInstance from '../../utils/axiosConfig';

const AnnotatorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/tasks'),
      axiosInstance.get(`/analytics/annotator/${user.id}`),
    ]).then(([tasksRes, perfRes]) => {
      setTasks(tasksRes.data.tasks.slice(0, 5));
      setPerformance(perfRes.data.performance);
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}! 👋</h1>
      <p className="text-gray-500 mb-6">Here's your annotation overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Tasks', value: performance?.totalTasks, color: 'text-indigo-600' },
          { label: 'Submitted', value: performance?.submittedTasks, color: 'text-blue-600' },
          { label: 'Approved', value: performance?.approvedTasks, color: 'text-green-600' },
          { label: 'Accuracy', value: `${performance?.accuracyRate}%`, color: 'text-purple-600' },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700">Recent Tasks</h2>
          <Link to="/annotator/tasks" className="text-sm text-indigo-600 hover:underline">View all →</Link>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">{task.dataset?.fileName}</p>
                <p className="text-xs text-gray-400">{task.project?.title}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge status={task.status} />
                {task.status === 'pending' || task.status === 'in_progress' ? (
                  <Link
                    to={`/annotator/tasks/${task._id}`}
                    className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
                  >
                    Annotate
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No tasks assigned yet</p>}
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default AnnotatorDashboard;
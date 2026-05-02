import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Badge from '../../components/UI/Badge';
import Loader from '../../components/UI/Loader';

const TaskQueue = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [filter, setFilter] = useState('all');

  useEffect(() => { dispatch(fetchTasks()); }, []);

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Task Queue</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'in_progress', 'submitted', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <div key={task._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{task.dataset?.fileName}</p>
                <p className="text-sm text-gray-400 mt-0.5">{task.project?.title} • {task.project?.type}</p>
                {task.deadline && (
                  <p className="text-xs text-red-400 mt-1">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge status={task.status} />
                {(task.status === 'pending' || task.status === 'in_progress') && (
                  <Link
                    to={`/annotator/tasks/${task._id}`}
                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                  >
                    Start
                  </Link>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📭</div>
              <p>No tasks found</p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TaskQueue;
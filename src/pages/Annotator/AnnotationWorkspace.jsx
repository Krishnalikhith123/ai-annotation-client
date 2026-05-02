import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { saveAnnotation } from '../../redux/slices/annotationSlice';
import { updateTaskStatus } from '../../redux/slices/taskSlice';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Loader from '../../components/UI/Loader';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const AnnotationWorkspace = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/tasks/${id}`).then((res) => {
      setTask(res.data.task);
      setSelectedLabel(res.data.task?.project?.labels?.[0] || '');
      setLoading(false);
    });
    dispatch(updateTaskStatus({ id, status: 'in_progress' }));
  }, [id]);

  const handleSave = async (submitFinal = false) => {
    setSaving(true);
    await dispatch(saveAnnotation({
      taskId: id,
      data: { label: selectedLabel, notes },
      status: submitFinal ? 'submitted' : 'draft',
      timeSpent: 0,
    }));
    if (submitFinal) {
      await dispatch(updateTaskStatus({ id, status: 'submitted' }));
      toast.success('Annotation submitted for review!');
      navigate('/annotator/tasks');
    } else {
      toast.success('Draft saved!');
    }
    setSaving(false);
  };

  if (loading) return <DashboardLayout><Loader /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">← Back</button>
        <h1 className="text-xl font-bold text-gray-800">Annotation Workspace</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-700 mb-3">File: {task?.dataset?.fileName}</h2>
          {task?.dataset?.fileType?.includes('png') || task?.dataset?.fileType?.includes('jpg') || task?.dataset?.fileType?.includes('jpeg') ? (
            <img
              src={`http://localhost:5000/${task?.dataset?.filePath}`}
              alt="annotation target"
              className="w-full rounded-lg border border-gray-200 max-h-96 object-contain bg-gray-50"
            />
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-gray-500 text-sm">File: {task?.dataset?.fileName}</p>
              <p className="text-gray-400 text-xs mt-1">Type: {task?.dataset?.fileType}</p>
            </div>
          )}
        </div>

        {/* Annotation Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Select Label</h3>
            <div className="flex flex-wrap gap-2">
              {task?.project?.labels?.map((label) => (
                <button
                  key={label}
                  onClick={() => setSelectedLabel(label)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${selectedLabel === label ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add annotation notes..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
            <h3 className="font-semibold text-gray-700">Selected: <span className="text-indigo-600">{selectedLabel || 'None'}</span></h3>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-60"
            >
              💾 Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !selectedLabel}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              ✅ Submit for Review
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnnotationWorkspace;
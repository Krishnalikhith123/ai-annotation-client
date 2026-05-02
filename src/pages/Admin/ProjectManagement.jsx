import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProject, deleteProject } from '../../redux/slices/projectSlice';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import Loader from '../../components/UI/Loader';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';
import { PROJECT_TYPES } from '../../utils/constants';

const ProjectManagement = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);

  // Project Modal
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'image', labels: '' });

  // Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [annotators, setAnnotators] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [taskForm, setTaskForm] = useState({
    projectId: '',
    datasetId: '',
    assignedTo: '',
    priority: 'medium',
    deadline: '',
  });

  useEffect(() => {
    dispatch(fetchProjects());
    axiosInstance.get('/users?role=annotator').then((r) => setAnnotators(r.data.users));
    axiosInstance.get('/datasets').then((r) => setDatasets(r.data.datasets));
  }, [dispatch]);

  // ── Create Project ──
  const handleCreateProject = async (e) => {
    e.preventDefault();
    const labelsArray = form.labels.split(',').map((l) => l.trim()).filter(Boolean);
    await dispatch(createProject({ ...form, labels: labelsArray }));
    toast.success('Project created!');
    setShowProjectModal(false);
    setForm({ title: '', description: '', type: 'image', labels: '' });
  };

  // ── Delete Project ──
  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      await dispatch(deleteProject(id));
      toast.success('Project deleted!');
    }
  };

  // ── Open Task Modal ──
  const openTaskModal = (project) => {
    setSelectedProject(project);
    setTaskForm({
      projectId: project._id,
      datasetId: '',
      assignedTo: '',
      priority: 'medium',
      deadline: '',
    });
    setShowTaskModal(true);
  };

  // ── Assign Task ──
  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!taskForm.datasetId) return toast.error('Please select a dataset');
    if (!taskForm.assignedTo) return toast.error('Please select an annotator');
    try {
      await axiosInstance.post('/tasks', taskForm);
      toast.success('Task assigned successfully!');
      setShowTaskModal(false);
      axiosInstance.get('/datasets').then((r) => setDatasets(r.data.datasets));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign task');
    }
  };

  // Filter datasets for selected project
  const projectDatasets = datasets.filter(
    (d) => d.project?._id === taskForm.projectId || d.project === taskForm.projectId
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => setShowProjectModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
        >
          + New Project
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <Card key={project._id}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">{project.title}</h3>
                <Badge status={project.status} />
              </div>
              <p className="text-sm text-gray-500 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.labels?.map((l) => (
                  <span key={l} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{l}</span>
                ))}
              </div>
              <div className="text-xs text-gray-400 mb-4">Type: {project.type}</div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openTaskModal(project)}
                  className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition"
                >
                  📋 Assign Task
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg text-xs font-semibold hover:bg-red-100 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📁</div>
              <p>No projects yet. Create your first one!</p>
            </div>
          )}
        </div>
      )}

      {/* ── Create Project Modal ── */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Project Title</label>
                <input
                  type="text" required placeholder="e.g. Cat vs Dog Classifier"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                <textarea
                  placeholder="Describe the project..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Project Type</label>
                <select
                  value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Labels</label>
                <input
                  type="text" placeholder="cat, dog, other (comma separated)"
                  value={form.labels} onChange={(e) => setForm({ ...form, labels: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition">
                  Create Project
                </button>
                <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Assign Task Modal ── */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Assign Task</h2>
                <p className="text-xs text-gray-400 mt-0.5">Project: {selectedProject?.title}</p>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-4">

              {/* Dataset Dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Select Dataset File
                </label>
                <select
                  value={taskForm.datasetId}
                  onChange={(e) => setTaskForm({ ...taskForm, datasetId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose a file --</option>
                  {projectDatasets.length > 0 ? (
                    projectDatasets.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.fileName} ({d.status})
                      </option>
                    ))
                  ) : (
                    <option disabled>No datasets uploaded for this project</option>
                  )}
                </select>
                {projectDatasets.length === 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    ⚠️ Upload a dataset for this project first in the Datasets page
                  </p>
                )}
              </div>

              {/* Annotator Dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Assign To Annotator
                </label>
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose an annotator --</option>
                  {annotators.length > 0 ? (
                    annotators.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.email})
                      </option>
                    ))
                  ) : (
                    <option disabled>No annotators registered yet</option>
                  )}
                </select>
                {annotators.length === 0 && (
                  <p className="text-xs text-red-400 mt-1">
                    ⚠️ No annotators found. Register a user with Annotator role first
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Priority</label>
                <div className="flex gap-2">
                  {['low', 'medium', 'high'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskForm({ ...taskForm, priority: p })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition capitalize ${
                        taskForm.priority === p
                          ? p === 'high' ? 'bg-red-500 text-white'
                            : p === 'medium' ? 'bg-yellow-500 text-white'
                            : 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Deadline <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="date"
                  value={taskForm.deadline}
                  onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  ✅ Assign Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProjectManagement;
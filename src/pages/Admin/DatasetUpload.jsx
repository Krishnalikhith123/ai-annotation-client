import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import Card from '../../components/UI/Card';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-toastify';

const DatasetUpload = () => {
  const [projects, setProjects] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    axiosInstance.get('/projects').then((r) => setProjects(r.data.projects));
    loadDatasets();
  }, []);

  const loadDatasets = () => {
    axiosInstance.get('/datasets').then((r) => setDatasets(r.data.datasets));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !projectId) return toast.error('Select a project and file');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    try {
      await axiosInstance.post('/datasets', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded!');
      loadDatasets();
      setFile(null);
    } catch (err) {
      toast.error('Upload failed');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dataset Upload</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h2 className="font-semibold text-gray-700 mb-4">Upload File</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <select
              value={projectId} onChange={(e) => setProjectId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Project</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
            </select>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" id="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              <label htmlFor="file" className="cursor-pointer">
                <div className="text-3xl mb-2">📂</div>
                <p className="text-sm text-gray-500">{file ? file.name : 'Click to select file'}</p>
              </label>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <h2 className="font-semibold text-gray-700 mb-4">Uploaded Datasets</h2>
            <div className="space-y-3">
              {datasets.map((d) => (
                <div key={d._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{d.fileName}</p>
                    <p className="text-xs text-gray-400">{d.project?.title} • {d.fileType}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.status === 'completed' ? 'bg-green-100 text-green-700' : d.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {d.status}
                  </span>
                </div>
              ))}
              {datasets.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No datasets uploaded yet</p>}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DatasetUpload;
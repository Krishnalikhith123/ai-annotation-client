import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

import PrivateRoute from './components/Layout/PrivateRoute';
import RoleBasedRoute from './components/Layout/RoleBasedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProjectManagement from './pages/Admin/ProjectManagement';
import UserManagement from './pages/Admin/UserManagement';
import DatasetUpload from './pages/Admin/DatasetUpload';
import Reports from './pages/Admin/Reports';

// Annotator Pages
import AnnotatorDashboard from './pages/Annotator/AnnotatorDashboard';
import TaskQueue from './pages/Annotator/TaskQueue';
import AnnotationWorkspace from './pages/Annotator/AnnotationWorkspace';
import MyPerformance from './pages/Annotator/MyPerformance';

// Reviewer Pages
import ReviewerDashboard from './pages/Reviewer/ReviewerDashboard';
import ReviewWorkspace from './pages/Reviewer/ReviewWorkspace';
import FeedbackPanel from './pages/Reviewer/FeedbackPanel';

// Shared
import LandingPage from './pages/Shared/LandingPage';
import Settings from './pages/Shared/Settings';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<RoleBasedRoute roles={['admin']}><AdminDashboard /></RoleBasedRoute>} />
            <Route path="/admin/projects" element={<RoleBasedRoute roles={['admin']}><ProjectManagement /></RoleBasedRoute>} />
            <Route path="/admin/users" element={<RoleBasedRoute roles={['admin']}><UserManagement /></RoleBasedRoute>} />
            <Route path="/admin/datasets" element={<RoleBasedRoute roles={['admin']}><DatasetUpload /></RoleBasedRoute>} />
            <Route path="/admin/reports" element={<RoleBasedRoute roles={['admin']}><Reports /></RoleBasedRoute>} />

            {/* Annotator */}
            <Route path="/annotator/dashboard" element={<RoleBasedRoute roles={['annotator']}><AnnotatorDashboard /></RoleBasedRoute>} />
            <Route path="/annotator/tasks" element={<RoleBasedRoute roles={['annotator']}><TaskQueue /></RoleBasedRoute>} />
            <Route path="/annotator/tasks/:id" element={<RoleBasedRoute roles={['annotator']}><AnnotationWorkspace /></RoleBasedRoute>} />
            <Route path="/annotator/performance" element={<RoleBasedRoute roles={['annotator']}><MyPerformance /></RoleBasedRoute>} />

            {/* Reviewer */}
            <Route path="/reviewer/dashboard" element={<RoleBasedRoute roles={['reviewer']}><ReviewerDashboard /></RoleBasedRoute>} />
            <Route path="/reviewer/reviews" element={<RoleBasedRoute roles={['reviewer']}><ReviewWorkspace /></RoleBasedRoute>} />
            <Route path="/reviewer/feedback" element={<RoleBasedRoute roles={['reviewer']}><FeedbackPanel /></RoleBasedRoute>} />

            {/* Shared */}
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import { getDashboardPath } from '../../utils/roleHelpers';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../utils/axiosConfig';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'annotator' });

  useEffect(() => {
    if (user) navigate(getDashboardPath(user.role));
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [user, error, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form));
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post('/auth/google', {
        credential: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = getDashboardPath(res.data.user.role);
    } catch (err) {
      toast.error('Google signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join AnnotateAI today</p>
        </div>

        {/* Google Signup Button */}
        <div className="flex justify-center mb-5">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google signup failed')}
            width="350"
            text="signup_with"
            shape="rectangular"
            theme="outline"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="annotator">Annotator</option>
              <option value="reviewer">Reviewer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
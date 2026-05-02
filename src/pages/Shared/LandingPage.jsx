import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
    <nav className="flex items-center justify-between px-8 py-5">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
          <span className="text-indigo-700 font-bold">AI</span>
        </div>
        <span className="text-white font-bold text-xl">AnnotateAI</span>
      </div>
      <div className="flex gap-3">
        <Link to="/login" className="text-white px-5 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition text-sm font-medium">
          Sign In
        </Link>
        <Link to="/register" className="bg-white text-indigo-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition">
          Get Started
        </Link>
      </div>
    </nav>

    <div className="text-center px-6 pt-20 pb-16">
      <span className="bg-white bg-opacity-10 text-white text-xs font-semibold px-4 py-1.5 rounded-full inline-block mb-6">
        🚀 AI-Powered Data Annotation
      </span>
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
        Annotate Data.<br />
        <span className="text-yellow-400">Train Better AI.</span>
      </h1>
      <p className="text-indigo-200 text-lg max-w-xl mx-auto mb-10">
        A collaborative platform for teams to label images, text, and audio with quality review workflows built in.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/register" className="bg-yellow-400 text-indigo-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition">
          Start Free
        </Link>
        <Link to="/login" className="border border-white border-opacity-30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:bg-opacity-10 transition">
          Sign In
        </Link>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-6 pb-20">
      {[
        { icon: '🖊️', title: 'Smart Annotation', desc: 'Label images, text, audio and video with intuitive tools' },
        { icon: '🔍', title: 'Quality Review', desc: 'Built-in review workflow with approve, reject and rework' },
        { icon: '📊', title: 'Analytics', desc: 'Track annotator performance and project progress in real time' },
      ].map((f) => (
        <div key={f.title} className="bg-white bg-opacity-10 rounded-2xl p-6 text-white">
          <div className="text-3xl mb-3">{f.icon}</div>
          <h3 className="font-bold text-lg mb-2">{f.title}</h3>
          <p className="text-indigo-200 text-sm">{f.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default LandingPage;
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../lib/auth';
import ThemeToggle from '../components/ThemeToggle';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setError(result.error);
      return;
    }

    // Success, redirect
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080510] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Background Blur */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-700/20 rounded-full blur-[120px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[400px] bg-white/90 dark:bg-[#181625]/90 border border-gray-200 dark:border-white/10 rounded-3xl px-8 py-10 backdrop-blur-xl shadow-xl dark:shadow-2xl transition-colors"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">Welcome Back</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign in to your account</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#252239] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
            placeholder="aditi@demo.com"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#252239] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-indigo-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-600 dark:to-purple-600 hover:scale-[1.02] text-white font-medium text-lg transition-all duration-300 shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          Sign In
        </button>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Demo accounts (password: demo123):</p>
          <ul className="mt-2 space-y-1">
            <li>aditi@demo.com (admin)</li>
            <li>rohan@demo.com (editor)</li>
            <li>simran@demo.com (viewer)</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

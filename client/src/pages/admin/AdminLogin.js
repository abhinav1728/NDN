import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      // Navigation will be handled by the redirect above
    }
    
    setLoginLoading(false);
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'admin@cgsfarms.com',
      password: 'admin123'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src="/assets/IMG-20250817-WA0002.jpg" 
            alt="Cozy Glory Shed" 
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access the Cozy Glory Shed management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Demo Credentials Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h3>
            <p className="text-xs text-blue-700 mb-3">
              Use these credentials to access the admin dashboard:
            </p>
            <div className="text-xs text-blue-800 space-y-1 mb-3">
              <div><strong>Email:</strong> admin@cgsfarms.com</div>
              <div><strong>Password:</strong> admin123</div>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Fill Demo Credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loginLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loginLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <LogIn className="h-5 w-5 text-primary-500 group-hover:text-primary-400" />
                  )}
                </span>
                {loginLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Security Notice</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                This is a secure admin area. All login attempts are logged and monitored.
              </p>
            </div>
          </div>

          {/* Back to Site Link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              ← Back to Cozy Glory Shed Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

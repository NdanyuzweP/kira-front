import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'customer' as 'customer' | 'agent',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 mobile-container safe-area-top safe-area-bottom py-8">
      <div className="w-full max-w-sm space-y-8 px-4">
        {/* Logo and Header */}
        <div className="text-center space-mobile-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-mobile-lg float-animation">
            <Smartphone className="text-white w-12 h-12" />
          </div>
          <h2 className="text-mobile-3xl font-bold text-white mb-2">Join P2P Trading</h2>
          <p className="text-indigo-200 text-mobile-sm">Create your mobile trading account</p>
        </div>

        {/* Registration Form */}
        <div className="glass-card rounded-3xl p-8 shadow-mobile-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-mobile-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-mobile-xs font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all duration-200 input-glow text-mobile-sm"
                    placeholder="First"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-mobile-xs font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="block w-full px-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all duration-200 input-glow text-mobile-sm"
                  placeholder="Last"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-mobile-sm font-medium text-slate-700 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all duration-200 input-glow text-mobile-base"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-mobile-sm font-medium text-slate-700 mb-3">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all duration-200 input-glow text-mobile-base"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-mobile-sm font-medium text-slate-700 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all duration-200 input-glow text-mobile-base"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center touch-target"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-mobile-sm font-medium text-slate-700 mb-3">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                className="block w-full px-4 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all duration-200 input-glow text-mobile-base"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="agent">Agent</option>
              </select>
            </div>

            <div className="space-mobile-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl text-mobile-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 btn-mobile ripple transition-all duration-200 shadow-mobile-lg touch-target"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center space-mobile-4">
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 text-mobile-sm"
              >
                Already have an account? <span className="underline font-bold">Sign in</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="text-center space-mobile-4">
          <div className="grid grid-mobile-3 gap-6 text-white/80">
            <div className="text-center">
              <div className="text-mobile-2xl mb-2">🚀</div>
              <div className="text-mobile-xs font-medium">Quick Setup</div>
            </div>
            <div className="text-center">
              <div className="text-mobile-2xl mb-2">💎</div>
              <div className="text-mobile-xs font-medium">Premium</div>
            </div>
            <div className="text-center">
              <div className="text-mobile-2xl mb-2">🎯</div>
              <div className="text-mobile-xs font-medium">Easy Trading</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
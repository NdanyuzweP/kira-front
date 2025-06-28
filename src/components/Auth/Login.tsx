import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 mobile-container safe-area-top safe-area-bottom">
      <div className="w-full max-w-sm space-y-8 px-4">
        {/* Logo and Header */}
        <div className="text-center space-mobile-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-mobile-lg float-animation">
            <Smartphone className="text-white w-12 h-12" />
          </div>
          <h2 className="text-mobile-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-indigo-200 text-mobile-sm">Sign in to your mobile trading account</p>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-3xl p-8 shadow-mobile-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all duration-200 input-glow text-mobile-base"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-4 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm transition-all duration-200 input-glow text-mobile-base"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="space-mobile-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-2xl text-mobile-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 btn-mobile ripple transition-all duration-200 shadow-mobile-lg touch-target"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            <div className="text-center space-mobile-4">
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 text-mobile-sm"
              >
                Don't have an account? <span className="underline font-bold">Sign up</span>
              </Link>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="text-center space-mobile-4">
          <div className="grid grid-mobile-3 gap-6 text-white/80">
            <div className="text-center">
              <div className="text-mobile-2xl mb-2">🔒</div>
              <div className="text-mobile-xs font-medium">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-mobile-2xl mb-2">⚡</div>
              <div className="text-mobile-xs font-medium">Fast</div>
            </div>
            <div className="text-center">
              <div className="text-mobile-2xl mb-2">🌍</div>
              <div className="text-mobile-xs font-medium">Global</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
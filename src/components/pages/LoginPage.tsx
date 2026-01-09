import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginPageProps {
  onLoginSuccess: (userName: string) => void;
  onSwitchToRegister: () => void;
  onBackToHome: () => void;
  isModal?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onLoginSuccess, 
  onSwitchToRegister,
  onBackToHome 
  , isModal = false
}) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const { login, isLoading, error: authError } = useAuth();

  // Demo users for quick testing (optional, remove if not needed)
  const demoUsers = [
    { employeeCode: 'EMP001', password: 'demo123', name: 'Rajesh Kumar', role: 'Project Director' },
    { employeeCode: 'EMP002', password: 'demo123', name: 'Priya Sharma', role: 'Programme Director' },
    { employeeCode: 'EMP003', password: 'demo123', name: 'Vikram Singh', role: 'Chairman' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!employeeCode.trim() || !password.trim()) {
      setLocalError('Please fill in all fields');
      return;
    }

    const success = await login(employeeCode, password);
    
    if (success) {
      onLoginSuccess(employeeCode);
    } else {
      setLocalError(authError || 'Invalid employee code or password');
    }
  };

  const handleDemoUserClick = async (demoUser: typeof demoUsers[0]) => {
    setEmployeeCode(demoUser.employeeCode);
    setLocalError('');
    const success = await login(demoUser.employeeCode, demoUser.password);
    if (success) {
      onLoginSuccess(demoUser.name);
    } else {
      setLocalError(authError || 'Login failed');
    }
  };

  const displayError = authError || localError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-500/50">
              P
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-indigo-200">Sign in to your PMS account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employee Code Field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Employee Code</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                <input
                  type="text"
                  value={employeeCode}
                  onChange={(e) => setEmployeeCode(e.target.value)}
                  placeholder="EMP001"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {displayError && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-200">{displayError}</p>
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10" />
                <span className="text-indigo-200 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-indigo-300 hover:text-indigo-100 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/5 text-indigo-200">Demo Credentials</span>
            </div>
          </div>

          {/* Demo Users */}
          <div className="space-y-2 mb-6">
            {demoUsers.map((user, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDemoUserClick(user)}
                disabled={isLoading}
                className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="text-sm font-semibold text-white group-hover:text-indigo-300">{user.name}</p>
                <p className="text-xs text-indigo-200">{user.role}</p>
              </button>
            ))}
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-indigo-200">
              New to PMS?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Create account
              </button>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <button
          onClick={onBackToHome}
          className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-indigo-200 hover:text-white border border-white/10 rounded-lg font-semibold transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

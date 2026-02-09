import React, { useState, useEffect } from 'react';
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
  const { login, loginWithCAS, isLoading, error: authError } = useAuth();

  // CAS Response Handler
  useEffect(() => {
    const processCASResponse = async () => {
      const url = new URL(window.location.href);
      
      if (url.search.trim().length > 0) {
        try {
          const cauthResponse = url.searchParams.get('cauthresponse');
          
          if (cauthResponse) {
            // Decode the base64 response
            const _ujson = JSON.parse(atob(cauthResponse));
            
            if (_ujson.login_status === 'success') {
              const _loginUserID = _ujson['emp_staffcode']; // Username like IS03651
              console.log('CAS Login successful for user:', _loginUserID);
              
              // Call login with the CAS-provided user ID
              const result = await loginWithCAS(_loginUserID);
              
              if (result) {
                console.log('User logged in successfully via CAS');
                onLoginSuccess(_loginUserID);
              } else {
                setLocalError('CAS login failed. Please try again.');
              }
            } else {
              setLocalError('Invalid CAS Login. ' + (_ujson.msg || ''));
            }
            
            // Clean up the URL by removing the cauthresponse parameter
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          console.error('Error processing CAS response:', error);
          setLocalError('Error processing authentication response. Please try again.');
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    
    processCASResponse();
  }, [loginWithCAS, onLoginSuccess]);

  // Generate CAS Login URL
  const generateCASLoginURL = () => {
    const redirectURL = `${window.location.origin}${window.location.pathname}`;
    const casLoginURL = `https://central-authentication.isro.dos.gov.in/CASClient/userauthentication.html?redirectURL=${encodeURIComponent(redirectURL)}`;
    return casLoginURL;
  };

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
                  Log In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* CAS Login Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="text-sm text-indigo-200 font-semibold">Or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* CAS Login Button */}
            <a
              href={generateCASLoginURL()}
              className={`w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/50 block text-center no-underline ${
                isLoading ? 'opacity-75 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              <span>🔐</span>
              Login via CAS
            </a>
          </form>

          {/* CAS Links Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="space-y-2 text-xs text-center">
              <div>
                <a
                  href="https://central-authentication.isro.dos.gov.in/CASClient/forgotpass.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-100 font-semibold transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div>
                <span className="text-indigo-300">Don't have CAS account?</span>{' '}
                <a
                  href="https://central-authentication.isro.dos.gov.in/CASClient/signup.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-300 hover:text-indigo-100 font-semibold transition-colors"
                >
                  Sign Up Here
                </a>
              </div>
            </div>
          </div>


      
          {/* Sign Up Link */}
          {/* <div className="text-center">
            <p className="text-indigo-200" style={{paddingTop: '25px'}}>
              New to PMS?{' '}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                Create account
              </button>
            </p>
          </div> */}
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

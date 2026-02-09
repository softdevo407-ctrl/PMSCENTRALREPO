import React, { useState, useEffect } from 'react';
import { Satellite, Globe, Zap, ArrowRight } from 'lucide-react';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { useAuth } from '../hooks/useAuth';

interface StartPageProps {
  onGetStarted: () => void;
  onLoginSuccess?: (userName: string, role: string) => void;
}

type PageView = 'home' | 'login' | 'register';

const StartPage: React.FC<StartPageProps> = ({ onGetStarted, onLoginSuccess }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const { user, logout, isAuthenticated } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user && user.fullName && user.role && onLoginSuccess) {
      onLoginSuccess(user.fullName, user.role);
    }
  }, [isAuthenticated, user, onLoginSuccess]);

  const handleLoginSuccess = (employeeCode: string) => {
    // Empty function for API compatibility
  };

  const handleRegistrationSuccess = (userName: string) => {
    if (user && onLoginSuccess) {
      onLoginSuccess(user.fullName, user.role);
    }
  };

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setCurrentPage('register')}
        onBackToHome={() => setCurrentPage('home')}
      />
    );
  }

  if (currentPage === 'register') {
    return (
      <RegistrationPage
        onRegistrationSuccess={handleRegistrationSuccess}
        onSwitchToLogin={() => setCurrentPage('login')}
        onBackToHome={() => setCurrentPage('home')}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse" ></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-300 rounded-full opacity-50 animate-pulse" ></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse" ></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-blue-200 rounded-full opacity-40 animate-pulse"></div>
      </div>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(100, 150, 255, 0.1) 25%, rgba(100, 150, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(100, 150, 255, 0.1) 75%, rgba(100, 150, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(100, 150, 255, 0.1) 25%, rgba(100, 150, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(100, 150, 255, 0.1) 75%, rgba(100, 150, 255, 0.1) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Floating Satellite Elements */}
      <div className="absolute top-20 right-10 opacity-20 animate-pulse">
        <Satellite className="w-32 h-32 text-cyan-400" />
      </div>
      <div className="absolute bottom-32 left-20 opacity-15 animate-pulse">
        <Globe className="w-40 h-40 text-blue-300" />
      </div>
      <div className="absolute top-1/2 right-1/4 opacity-10 animate-bounce">
        <Zap className="w-24 h-24 text-yellow-300" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Header Logo */}
        <div className="mb-8 text-center">
          <div className="inline-block p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl mb-6">
            <Satellite className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-3xl">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Project Management 
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"> System</span>
          </h1>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <button
              onClick={() => setCurrentPage('login')}
              className="group px-8 sm:px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-sm text-slate-400">
            Powered by Advanced Project Management Intelligence
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { Workflow } from './Workflow';
import { AnalyticsPreview } from './AnalyticsPreview';
import { CTA } from './CTA';
import { Footer } from './Footer';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { useAuth } from '../hooks/useAuth';

interface StartPageProps {
  onGetStarted: () => void;
  onLoginSuccess?: (userName: string, role: string) => void;
}

type PageView = 'home' | 'login' | 'register';

const StartPage: React.FC<StartPageProps> = ({ onGetStarted, onLoginSuccess }) => {
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (onLoginSuccess) {
        onLoginSuccess(user.fullName, user.role);
      }
    }
  }, [isAuthenticated, user, onLoginSuccess]);

  const handleLoginSuccess = (employeeCode: string) => {
    if (user && onLoginSuccess) {
      onLoginSuccess(user.fullName, user.role);
    }
  };

  const handleRegistrationSuccess = (userName: string) => {
    if (user && onLoginSuccess) {
      onLoginSuccess(user.fullName, user.role);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentPage('home');
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
    <div className="min-h-screen flex flex-col">
      <Header 
        scrolled={scrolled} 
        onLoginClick={() => setCurrentPage('login')}
        onSignUpClick={() => setCurrentPage('register')}
      />
      <main className="flex-grow pt-20">
        <Hero 
          onGetStarted={() => setCurrentPage('login')}
          onSignUp={() => setCurrentPage('register')}
        />
        <Features />
        <Workflow />
        <AnalyticsPreview />
        <CTA onGetStarted={() => setCurrentPage('login')} />
      </main>
      <Footer />
    </div>
  );
};

export default StartPage;

import React from 'react';

interface HeaderProps {
  scrolled: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ scrolled, onLoginClick, onSignUpClick }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
            P
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-slate-900">PMS</span>
        </div>
        
        {/* <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Support</a>
        </nav> */}

        <div className="flex items-center gap-4">
          {/* <button 
            onClick={onLoginClick}
            className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
          >
            Log in
          </button> */}
          {/* <button 
            onClick={onSignUpClick}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Sign up
          </button> */}
        </div>
      </div>
    </header>
  );
};

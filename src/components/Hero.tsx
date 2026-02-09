
import React from 'react';
import { ArrowRight, BarChart3, ShieldCheck, Users } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onSignUp?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onSignUp }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
             <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-600">Project Management System</span>
          </h1>
          {/* <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Comprehensive project management system for satellite and space technology initiatives. Monitor budgets, phases, and execution across all project directors and programmes.
          </p> */}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200"
            >
              Log In <ArrowRight className="w-5 h-5" />
            </button>
            {/* <button 
              onClick={onSignUp}
              className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              Create Account <ArrowRight className="w-5 h-5" />
            </button> */}
          </div>
        </div>

 
      </div>
    </section>
  );
};

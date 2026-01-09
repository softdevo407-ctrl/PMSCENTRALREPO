
import React from 'react';

interface CTAProps {
  onGetStarted: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onGetStarted }) => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-600 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent -z-10"></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Start managing your satellite programmes today</h2>
        <p className="text-xl text-indigo-100 mb-10 leading-relaxed max-w-2xl mx-auto">
          Get complete visibility over satellite project budgets, schedules, and execution. Make informed decisions with comprehensive analytics and reporting.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-xl"
          >
            Launch Dashboard
          </button>
          <button className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
            View Documentation
          </button>
        </div>
        <p className="mt-8 text-sm text-indigo-200 font-medium">Enterprise-grade project management for space programmes</p>
      </div>
    </section>
  );
};
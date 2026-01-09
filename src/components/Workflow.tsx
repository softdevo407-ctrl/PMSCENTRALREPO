
import React from 'react';

export const Workflow: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Define Mission Parameters",
      description: "Establish satellite project scope, budget allocation, and mission objectives with complete specifications."
    },
    {
      number: "02",
      title: "Structure Execution Phases",
      description: "Organize projects into development phases, testing milestones, and deployment activities with dependencies."
    },
    {
      number: "03",
      title: "Monitor & Control",
      description: "Real-time tracking of budget spending, schedule adherence, and risk indicators across all missions."
    },
    {
      number: "04",
      title: "Executive Reporting",
      description: "Generate comprehensive portfolio analytics with performance metrics for strategic decision-making."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-indigo-600 font-bold tracking-widest text-sm uppercase mb-3 text-left">Execution Model</h3>
            <h4 className="text-4xl font-display font-bold text-slate-900 mb-8">Structured control over satellite programmes</h4>
            
            <div className="space-y-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-lg font-bold text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-colors">
                    {step.number}
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h5>
                    <p className="text-slate-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square bg-indigo-50 rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src="https://picsum.photos/seed/pbems-workflow/800/800" 
                alt="Workflow Interface" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
              
              {/* Floating UI Elements */}
              <div className="absolute top-10 left-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-[200px] animate-bounce-slow">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget Status</div>
                <div className="text-lg font-bold text-slate-900">74% Utilized</div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="w-[74%] h-full bg-indigo-600"></div>
                </div>
              </div>

              <div className="absolute bottom-10 right-10 bg-white p-4 rounded-xl shadow-lg border border-slate-100 max-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Phase 3 Active</span>
                </div>
                <div className="text-sm font-bold text-slate-800">Review Required</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

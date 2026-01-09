
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Phase 1', budget: 4000, actual: 2400 },
  { name: 'Phase 2', budget: 3000, actual: 1398 },
  { name: 'Phase 3', budget: 2000, actual: 9800 },
  { name: 'Phase 4', budget: 2780, actual: 3908 },
  { name: 'Phase 5', budget: 1890, actual: 4800 },
  { name: 'Phase 6', budget: 2390, actual: 3800 },
];

export const AnalyticsPreview: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h3 className="text-indigo-400 font-bold tracking-widest text-sm uppercase mb-3">Portfolio Analytics</h3>
            <h4 className="text-4xl font-display font-bold mb-6">Complete Visibility Across Missions</h4>
            <p className="text-slate-400 text-lg mb-8">
              Monitor satellite project portfolios with comprehensive analytics. Track budget utilization, schedule adherence, and risk indicators across all programmes to support strategic decision-making.
            </p>
            <ul className="space-y-4">
              {['Budget vs Actual Spending', 'Phase-wise Progress Tracking', 'Risk & Delay Alerts', 'Portfolio Health Metrics'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-sm h-[400px]">
               <div className="flex items-center justify-between mb-6">
                  <h5 className="font-bold text-slate-200">Portfolio Performance</h5>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Planned</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Actual</span>
                    </div>
                  </div>
               </div>
               <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="actual" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

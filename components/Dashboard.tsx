
import React from 'react';
import { Project, ProjectCategory, ProjectStatus } from '../types';
import { CATEGORY_ICONS, STATUS_COLORS } from '../constants';
import { 
  Plus, 
  BarChart3, 
  PieChart as PieChartIcon, 
  DollarSign, 
  Target, 
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import KPI from './KPI';

interface DashboardProps {
  projects: Project[];
  onCategoryClick: (category: ProjectCategory) => void;
  onAddProject: (category: ProjectCategory) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onCategoryClick, onAddProject }) => {
  const categories = Object.values(ProjectCategory);

  const statsByCat = categories.map(cat => {
    const catProjects = projects.filter(p => p.category === cat);
    return {
      name: cat.split(' ').slice(0, 2).join(' '),
      budget: catProjects.reduce((s, p) => s + p.totalBudget, 0) / 1000000,
      expenditure: catProjects.reduce((s, p) => s + p.expenditure, 0) / 1000000,
    };
  });

  const statusData = [
    { name: 'On Track', value: projects.filter(p => p.status === ProjectStatus.ON_TRACK).length, color: '#10b981' },
    { name: 'At Risk', value: projects.filter(p => p.status === ProjectStatus.AT_RISK).length, color: '#f59e0b' },
    { name: 'Delayed', value: projects.filter(p => p.status === ProjectStatus.DELAYED).length, color: '#ef4444' },
    { name: 'Completed', value: projects.filter(p => p.status === ProjectStatus.COMPLETED).length, color: '#3b82f6' },
  ];

  const totalBudget = projects.reduce((s, p) => s + p.totalBudget, 0);
  const totalExp = projects.reduce((s, p) => s + p.expenditure, 0);
  const utilization = Math.round((totalExp / totalBudget) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI 
          label="Total Budget Allocation" 
          value={`$${(totalBudget / 1000000).toFixed(1)}M`} 
          icon={DollarSign} 
          color="bg-blue-50 text-blue-600"
          trend="+4.2%"
        />
        <KPI 
          label="Actual Expenditure" 
          value={`$${(totalExp / 1000000).toFixed(1)}M`} 
          icon={Briefcase} 
          color="bg-indigo-50 text-indigo-600"
        />
        <KPI 
          label="Budget Utilization" 
          value={`${utilization}%`} 
          icon={Target} 
          color="bg-emerald-50 text-emerald-600"
        />
        <KPI 
          label="On-Track Projects" 
          value={projects.filter(p => p.status === ProjectStatus.ON_TRACK).length} 
          icon={BarChart3} 
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Main Visuals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Budget vs Expenditure by Sector ($M)
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsByCat} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="budget" name="Planned Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenditure" name="Actual Expenditure" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
            <PieChartIcon className="w-4 h-4 text-blue-600" />
            Project Status Health
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600">{s.name}: <span className="font-bold text-slate-900">{s.value}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catProjects = projects.filter(p => p.category === cat);
          const catBudget = catProjects.reduce((s, p) => s + p.totalBudget, 0);
          const catExp = catProjects.reduce((s, p) => s + p.expenditure, 0);
          const progress = catBudget > 0 ? Math.round((catExp / catBudget) * 100) : 0;

          return (
            <div 
              key={cat}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all cursor-pointer shadow-sm group"
              onClick={() => onCategoryClick(cat)}
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {CATEGORY_ICONS[cat]}
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{cat}</h4>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAddProject(cat); }}
                    className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400" />
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Utilization</p>
                    <p className="text-xl font-bold text-slate-900">{progress}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Active</p>
                    <p className="text-xl font-bold text-slate-900">{catProjects.length}</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Exp: ${(catExp / 1000000).toFixed(1)}M</span>
                  <span>Bud: ${(catBudget / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

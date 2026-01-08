
import React, { useState, useEffect } from 'react';
import { Project, Milestone, ProjectStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  ArrowLeft, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BrainCircuit,
  Save,
  Activity,
  DollarSign
} from 'lucide-react';
import { getProjectHealthInsight } from '../geminiService';
import { STATUS_COLORS } from '../constants';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onUpdate: (updatedProject: Project) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, onUpdate }) => {
  const [insight, setInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [remarks, setRemarks] = useState(project.delayRemarks || '');
  const [isEditingRemarks, setIsEditingRemarks] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const text = await getProjectHealthInsight(project);
      setInsight(text);
      setLoadingInsight(false);
    };
    fetchInsight();
  }, [project.id]);

  const budgetData = [
    { name: 'Expended', value: project.expenditure, color: '#3b82f6' },
    { name: 'Remaining', value: Math.max(0, project.totalBudget - project.expenditure), color: '#f1f5f9' }
  ];

  const handleSaveRemarks = () => {
    onUpdate({ ...project, delayRemarks: remarks });
    setIsEditingRemarks(false);
  };

  const addMilestone = () => {
    const title = prompt("Enter milestone title:");
    if (!title) return;
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      title,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    onUpdate({ ...project, milestones: [...project.milestones, newMilestone] });
  };

  const toggleMilestoneStatus = (id: string) => {
    const updatedMilestones = project.milestones.map(m => {
      if (m.id === id) {
        const nextStatus: any = m.status === 'Pending' ? 'In Progress' : m.status === 'In Progress' ? 'Completed' : 'Pending';
        return { ...m, status: nextStatus, completedDate: nextStatus === 'Completed' ? new Date().toISOString().split('T')[0] : undefined };
      }
      return m;
    });
    onUpdate({ ...project, milestones: updatedMilestones });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white transition-all text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
              <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase tracking-tighter border ${STATUS_COLORS[project.status]}`}>
                {project.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1 uppercase font-semibold tracking-wider">{project.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 divide-x divide-slate-100">
          <div className="pl-6">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Budget Utilization</p>
            <p className="text-xl font-bold text-slate-900">{Math.round((project.expenditure/project.totalBudget)*100)}%</p>
          </div>
          <div className="pl-6 text-right">
             <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Planned End</p>
             <p className="text-xl font-bold text-slate-900">Dec 2025</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              Executive AI Intelligence
            </h3>
            {loadingInsight ? (
               <div className="space-y-3 animate-pulse">
                 <div className="h-4 bg-slate-100 rounded w-full"></div>
                 <div className="h-4 bg-slate-100 rounded w-2/3"></div>
               </div>
            ) : (
              <div className="bg-indigo-50/50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
                <p className="text-slate-700 italic leading-relaxed">
                  "{insight || 'Analyzing project telemetry...'}"
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Financial Distribution
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={budgetData} innerRadius={40} outerRadius={60} dataKey="value">
                      {budgetData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Expended</span>
                  <span className="font-bold text-slate-900">${(project.expenditure/1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Remaining</span>
                  <span className="font-bold text-slate-900">${((project.totalBudget - project.expenditure)/1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-blue-600" />
                Operational Status
              </h3>
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-2">
                    <span>Overall Progress</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-[72%]" />
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                   <p className="text-xs text-slate-500">Current Phase</p>
                   <p className="text-lg font-bold text-slate-800">Integration & Testing</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Management Remarks
                </h3>
                <button 
                  onClick={() => isEditingRemarks ? handleSaveRemarks() : setIsEditingRemarks(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {isEditingRemarks ? <><Save className="w-3 h-3" /> Save</> : 'Edit'}
                </button>
             </div>
             {isEditingRemarks ? (
                <textarea 
                  className="w-full h-24 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
             ) : (
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                  {project.delayRemarks || 'No delay remarks for this reporting period.'}
                </p>
             )}
          </div>
        </div>

        {/* Right Column (Milestones) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Project Milestones</h3>
              <button onClick={addMilestone} className="text-blue-600 hover:bg-blue-50 p-1 rounded-md transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {project.milestones.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => toggleMilestoneStatus(m.id)}
                  className="p-4 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex gap-3">
                    <div className="mt-1">
                      {m.status === 'Completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : m.status === 'In Progress' ? (
                        <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${m.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {m.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-bold uppercase text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{m.status === 'Completed' ? `Done ${m.completedDate}` : `Due ${m.dueDate}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

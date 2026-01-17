import React, { useState, useEffect } from 'react';
import { Layers, Flag, Clock, Calendar } from 'lucide-react';
import { PhaseFormData, ProjectPhase } from './ProjectConfigurationMatrix';

interface PhaseFormProps {
  initialData?: ProjectPhase;
  onSubmit: (data: PhaseFormData) => void;
  onCancel: () => void;
}

const PhaseForm: React.FC<PhaseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PhaseFormData>({
    name: '',
    milestoneTitle: '',
    milestoneMonths: 1,
    milestoneStartDate: '',
    milestoneEndDate: '',
    sortOrder: 1,
  });

  useEffect(() => {
    if (initialData) {
      const { id, activities, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-4 py-3 text-sm transition-all outline-none font-medium text-slate-700 shadow-sm placeholder:text-slate-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Phase Meta */}
        <div className="col-span-full space-y-4">
           <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Lifecycle Context</h3>
           </div>
           <div className="flex gap-4">
              <div className="flex-1">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phase Name</label>
                 <input 
                    required name="name" value={formData.name} onChange={handleChange}
                    className={inputClasses} placeholder="e.g. Discovery & Definition"
                 />
              </div>
              <div className="w-24">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Order</label>
                 <input 
                    required type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange}
                    className={`${inputClasses} text-center`}
                 />
              </div>
           </div>
        </div>

        {/* Milestone Detail */}
        <div className="col-span-full space-y-4">
           <div className="flex items-center gap-3 border-b border-slate-100 pb-2">
              <Flag className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Milestone Objectives</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Milestone Goal</label>
                 <input 
                    required name="milestoneTitle" value={formData.milestoneTitle} onChange={handleChange}
                    className={inputClasses} placeholder="e.g. Architectural Approval"
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Months
                 </label>
                 <input 
                    required type="number" step="0.5" name="milestoneMonths" value={formData.milestoneMonths} onChange={handleChange}
                    className={inputClasses}
                 />
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Start Date
                 </label>
                 <input 
                    required type="date" name="milestoneStartDate" value={formData.milestoneStartDate} onChange={handleChange}
                    className={inputClasses}
                 />
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> End Date
                 </label>
                 <input 
                    required type="date" name="milestoneEndDate" value={formData.milestoneEndDate} onChange={handleChange}
                    className={inputClasses}
                 />
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-colors"
        >
          Dismiss
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          {initialData ? 'Update Matrix' : 'Commit Phase'}
        </button>
      </div>
    </form>
  );
};

export default PhaseForm;

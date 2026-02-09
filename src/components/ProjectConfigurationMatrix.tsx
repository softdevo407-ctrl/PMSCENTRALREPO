import React, { useState } from 'react';
import { 
  Edit2, 
  Trash2, 
  Clock, 
  Hash, 
  Check, 
  X, 
  Plus, 
  Flag,
  Activity as ActivityIcon,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { SearchableSelect } from './SearchableSelect';

// Utility function to format dates as DD-MM-YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
};

export interface Activity {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
}

export interface ActivityFormData {
  title: string;
  startDate: string;
  endDate: string;
  sortOrder: number;
}

export interface Milestone {
  id: string;
  code: string;
  title: string;
  startDate: string;
  endDate: string;
  months: number;
  sortOrder: number;
  activities: Activity[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  milestones: Milestone[];
  sortOrder: number;
}

export interface PhaseFormData {
  name: string;
  sortOrder: number;
}

export interface MilestoneFormData {
  code: string;
  title: string;
  startDate: string;
  endDate: string;
}

interface ProjectMatrixProps {
  phases: ProjectPhase[];
  onEditPhase: (phaseId: string, updates: Partial<ProjectPhase>) => void;
  onDeletePhase: (id: string) => void;
  onAddActivity: (phaseId: string, milestoneId: string, data: ActivityFormData) => void;
  onDeleteActivity: (phaseId: string, milestoneId: string, activityId: string) => void;
  onUpdateActivitySort: (phaseId: string, milestoneId: string, activityId: string, newSort: number) => void;
  onUpdateMilestoneSort?: (phaseId: string, milestoneId: string, newSort: number) => void;
  onEditMilestone?: (phaseId: string, milestone: Milestone) => void;
  onEditActivity?: (phaseId: string, milestoneId: string, activity: Activity) => void;
  milestoneOptions?: any[];
  activityOptions?: any[];
  onAddMilestoneClick?: (phaseId: string) => void;
  onDeleteMilestone?: (phaseId: string, milestoneId: string) => void;
  projectStartDate?: string;
  projectEndDate?: string;
  searchTerm?: string;
}

const ProjectMatrix: React.FC<ProjectMatrixProps> = ({ 
  phases, 
  onEditPhase, 
  onDeletePhase,
  onAddActivity,
  onDeleteActivity,
  onUpdateActivitySort,
  onUpdateMilestoneSort = () => {},
  onEditMilestone = () => {},
  onEditActivity = () => {},
  milestoneOptions = [],
  activityOptions = [],
  onAddMilestoneClick = () => {},
  onDeleteMilestone = () => {},
  projectStartDate = '',
  projectEndDate = '',
  searchTerm = ''
}) => {
  // Filter phases based on search term
  const filterPhases = (): ProjectPhase[] => {
    if (!searchTerm.trim()) return phases;
    
    const search = searchTerm.toLowerCase();
    return phases.filter(phase => {
      // Check if phase name matches
      if (phase.name.toLowerCase().includes(search)) return true;
      
      // Check if any milestone matches
      if (phase.milestones.some(milestone => 
        milestone.title.toLowerCase().includes(search) ||
        milestone.code.toLowerCase().includes(search)
      )) return true;
      
      // Check if any activity matches
      if (phase.milestones.some(milestone =>
        milestone.activities.some(activity =>
          activity.title.toLowerCase().includes(search) ||
          activity.id.toLowerCase().includes(search)
        )
      )) return true;
      
      return false;
    });
  };

  const filteredPhases = filterPhases();

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            {/* <th className="p-3 w-16 text-[9px] font-black text-slate-400 uppercase tracking-widest">Order</th> */}
            <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest flex-1 min-w-[300px]">Phase / Milestone / Activity Details</th>
            <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-32">Timeline</th>
            <th className="p-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-24 text-center sticky right-0 bg-slate-50/80 z-10">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredPhases.map((phase) => (
            <PhaseGroup 
              key={phase.id} 
              phase={phase} 
              onEditPhase={onEditPhase}
              onDeletePhase={onDeletePhase}
              onAddActivity={onAddActivity}
              onDeleteActivity={onDeleteActivity}
              onUpdateActivitySort={onUpdateActivitySort}
              onUpdateMilestoneSort={onUpdateMilestoneSort}
              onEditActivity={onEditActivity}
              milestoneOptions={milestoneOptions}
              activityOptions={activityOptions}
              onAddMilestoneClick={onAddMilestoneClick}
              onDeleteMilestone={onDeleteMilestone}
            />
          ))}
        </tbody>
      </table>
      {filteredPhases.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No phases, milestones, or activities match your search.</p>
        </div>
      )}
    </div>
  );
};

const PhaseGroup: React.FC<{
  phase: ProjectPhase;
  onEditPhase: (phaseId: string, updates: Partial<ProjectPhase>) => void;
  onDeletePhase: (id: string) => void;
  onAddActivity: (phaseId: string, milestoneId: string, d: ActivityFormData) => void;
  onDeleteActivity: (phaseId: string, milestoneId: string, aid: string) => void;
  onUpdateActivitySort: (phaseId: string, milestoneId: string, aid: string, s: number) => void;
  onUpdateMilestoneSort?: (phaseId: string, milestoneId: string, s: number) => void;
  onEditActivity?: (phaseId: string, milestoneId: string, activity: Activity) => void;
  milestoneOptions?: any[];
  activityOptions?: any[];
  onAddMilestoneClick?: (phaseId: string) => void;
  onDeleteMilestone?: (phaseId: string, milestoneId: string) => void;
  projectStartDate?: string;
  projectEndDate?: string;
}> = ({ phase, onEditPhase, onDeletePhase, onAddActivity, onDeleteActivity, onUpdateActivitySort, onUpdateMilestoneSort = () => {}, onEditActivity = () => {}, milestoneOptions = [], activityOptions = [], onAddMilestoneClick = () => {}, onDeleteMilestone = () => {}, projectStartDate = '', projectEndDate = '' }) => {
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set(phase.milestones.map(m => m.id)));
  const [newActivityByMilestone, setNewActivityByMilestone] = useState<{ [key: string]: ActivityFormData }>({});
  const [visibleAddRowMilestone, setVisibleAddRowMilestone] = useState<Set<string>>(new Set());

  const calculateMonths = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(0, Math.round(months));
  };

  const toggleMilestoneExpanded = (milestoneId: string) => {
    setExpandedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneId)) {
        newSet.delete(milestoneId);
      } else {
        newSet.add(milestoneId);
      }
      return newSet;
    });
  };

  const getNewActivityForm = (milestoneId: string): ActivityFormData => {
    if (!newActivityByMilestone[milestoneId]) {
      newActivityByMilestone[milestoneId] = {
        title: '',
        startDate: '',
        endDate: '',
        sortOrder: 1
      };
    }
    return newActivityByMilestone[milestoneId];
  };

  const handleAddActivitySubmit = (phaseId: string, milestoneId: string) => {
    const form = getNewActivityForm(milestoneId);
    if (!form.title) return;
    onAddActivity(phaseId, milestoneId, form);
    const newState = { ...newActivityByMilestone };
    delete newState[milestoneId];
    setNewActivityByMilestone(newState);
    // Hide the add row after successful save
    setVisibleAddRowMilestone(prev => {
      const newSet = new Set(prev);
      newSet.delete(milestoneId);
      return newSet;
    });
  };

  return (
    <>
      {/* PHASE HEADER ROW */}
      <tr className="bg-gradient-to-r from-indigo-50 to-blue-50/50 group/phase border-b-2 border-indigo-200">
        <td className="p-3 align-top hidden">
          {/* Hidden phase sort order column */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-[9px] font-black text-white shadow-lg shadow-indigo-200">
            {phase.sortOrder}
          </div>
        </td>
        <td className="p-3 align-top" colSpan={2}>
           <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="text-base font-black text-slate-900 tracking-tight">{phase.name}</span>
           </div>
        </td>
        <td className="p-3 align-top sticky right-0 bg-gradient-to-r from-indigo-50 to-blue-50/50 z-10 text-center">
           <div className="flex items-center justify-center gap-1">
              <button 
                onClick={() => onAddMilestoneClick(phase.id)}
                title="Add milestone"
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 text-green-600 hover:text-white hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-600 hover:border-green-600 shadow-sm transition-all flex items-center justify-center font-bold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => onDeletePhase(phase.id)}
                title="Delete phase"
                className="w-7 h-7 rounded-lg bg-white border border-rose-100 text-slate-400 hover:text-rose-600 hover:border-rose-300 shadow-sm transition-all flex items-center justify-center text-xs"
              >
                <Trash2 className="w-3 h-3" />
              </button>
           </div>
        </td>
      </tr>

      {/* MILESTONES WITH INTEGRATED ACTIVITIES */}
      {[...phase.milestones].sort((a, b) => a.sortOrder - b.sortOrder).map((milestone, milestoneIdx) => (
        <React.Fragment key={milestone.id}>
          {/* MILESTONE ROW - SHOWING ALL DETAILS + ACTIVITIES */}
          <tr className="bg-gradient-to-r from-purple-50 to-purple-25 border-b border-purple-200 group/milestone hover:from-purple-100/50 hover:to-purple-50/50 transition-all">
            <td className="p-3 pl-8 bg-gradient-to-r from-purple-50/60 to-transparent hidden">
              {/* Hidden milestone sort order column */}
              <div className="flex flex-col items-center gap-1">
                <Check className="w-3.5 h-3.5 text-purple-600" />
                <input 
                  type="number"
                  value={milestone.sortOrder}
                  onChange={(e) => onUpdateMilestoneSort(phase.id, milestone.id, parseInt(e.target.value) || 0)}
                  className="w-10 bg-purple-100/60 border border-purple-300 rounded px-1 py-0.5 text-center text-[8px] font-black text-purple-700 hover:text-purple-900 focus:text-purple-900 outline-none focus:ring-1 focus:ring-purple-500/30 transition-colors"
                  min="1"
                  title="Milestone sort order"
                />
              </div>
            </td>
            <td className="p-3 bg-gradient-to-r from-transparent to-purple-50/20">
              <div className="space-y-3">
                {/* MILESTONE TITLE & INFO */}
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-slate-800">{milestone.title}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 font-mono mt-1">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold">{milestone.months} months</span>
                    </div>
                  </div>
                </div>

                {/* ACTIVITIES INTEGRATED BELOW MILESTONE */}
                {milestone.activities && milestone.activities.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-200/40 space-y-2">
                    {[...milestone.activities].sort((a, b) => a.sortOrder - b.sortOrder).map((activity, actIdx) => (
                      <div key={activity.id} className="pl-3 border-l-2 border-emerald-400 py-2 bg-emerald-50/60 px-3 rounded flex items-start justify-between gap-2 group/act">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <ActivityIcon className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{activity.title}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                              <span className="font-mono text-slate-600">{formatDate(activity.startDate)} → {formatDate(activity.endDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button 
                            onClick={() => onEditActivity(phase.id, milestone.id, activity)}
                            title="Edit activity"
                            className="p-1.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onDeleteActivity(phase.id, milestone.id, activity.id)}
                            title="Delete activity"
                            className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ADD ACTIVITY BUTTON INTEGRATED */}
                {!visibleAddRowMilestone.has(milestone.id) && (
                  <button 
                    onClick={() => {
                      setVisibleAddRowMilestone(prev => {
                        const newSet = new Set(prev);
                        newSet.add(milestone.id);
                        return newSet;
                      });
                      setNewActivityByMilestone(prev => ({
                        ...prev,
                        [milestone.id]: { title: '', startDate: '', endDate: '', sortOrder: (milestone.activities?.length || 0) + 1 }
                      }));
                    }}
                    className="mt-2 flex items-center justify-center gap-2 text-emerald-700 hover:text-white bg-emerald-50 hover:bg-emerald-600 font-semibold text-sm transition-all duration-150 px-3 py-2 rounded border border-emerald-300 hover:border-emerald-600 w-full"
                  >
                    <Plus className="w-4 h-4" />
                    Add Activity
                  </button>
                )}
              </div>
            </td>
            <td className="p-3 bg-gradient-to-r from-purple-50/20 to-transparent">
              <div className="text-center">
                <div className="text-xs font-black text-purple-600 uppercase tracking-widest mb-1">Timeline</div>
                <div className="text-sm font-bold text-slate-800 mb-1">{formatDate(milestone.startDate)}</div>
                <div className="text-xs text-slate-500">↓</div>
                <div className="text-sm font-bold text-slate-800">{formatDate(milestone.endDate)}</div>
              </div>
            </td>
            <td className="p-3 sticky right-0 bg-gradient-to-l from-purple-50 to-purple-25 z-10 text-center border-l border-purple-200 group-hover/milestone:from-purple-100/50 group-hover/milestone:to-purple-50/50 transition-all">
              <div className="flex items-center justify-center gap-1">
                <button 
                  onClick={() => onAddMilestoneClick(phase.id)}
                  title="Add another milestone"
                  className="p-1.5 rounded bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDeleteMilestone(phase.id, milestone.id)}
                  className="p-1.5 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  title="Delete milestone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>

          {/* ADD ACTIVITY ROW FOR THIS MILESTONE - ONLY IF VISIBLE */}
          {visibleAddRowMilestone.has(milestone.id) && (
            <tr className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-500 border-dashed shadow-inner group/addrow">
              <td className="px-3 py-2 pl-8 bg-gradient-to-r from-emerald-50/60 to-transparent hidden">
                {/* Hidden new activity sort order */}
                <div className="flex items-center gap-1">
                  <Plus className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="text-[7px] font-black text-emerald-700 uppercase tracking-widest">NEW</span>
                </div>
              </td>
              <td className="px-3 py-2 bg-gradient-to-r from-transparent to-emerald-50/20">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <ActivityIcon className="w-3 h-3 text-emerald-600" />
                    <select 
                      value={getNewActivityForm(milestone.id).title}
                      onChange={(e) => setNewActivityByMilestone(prev => ({
                        ...prev,
                        [milestone.id]: { ...getNewActivityForm(milestone.id), title: e.target.value }
                      }))}
                      className="flex-1 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/50 rounded px-2 py-1 text-[8px] outline-none font-medium text-slate-800 cursor-pointer hover:from-emerald-100 hover:to-emerald-150"
                    >
                      <option value="">Select Activity...</option>
                      {activityOptions.map(a => (
                        <option key={a.projectActivityCode} value={a.projectActivityFullName}>
                          {a.projectActivityFullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="hidden">
                    {/* Hidden order field - stored in state but not displayed */}
                    <input 
                      type="number"
                      value={getNewActivityForm(milestone.id).sortOrder}
                      onChange={(e) => setNewActivityByMilestone(prev => ({
                        ...prev,
                        [milestone.id]: { ...getNewActivityForm(milestone.id), sortOrder: parseInt(e.target.value) || 0 }
                      }))}
                      className="hidden"
                      min="1"
                    />
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 bg-gradient-to-r from-emerald-50/20 to-transparent">
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <div className="flex-1 relative">
                      <label className="absolute -top-3 left-0 text-[6px] font-bold text-slate-500 uppercase">Start</label>
                      <input 
                        type="date"
                        value={getNewActivityForm(milestone.id).startDate}
                        onChange={(e) => setNewActivityByMilestone(prev => ({
                          ...prev,
                          [milestone.id]: { ...getNewActivityForm(milestone.id), startDate: e.target.value }
                        }))}
                        min={milestone.startDate}
                        max={milestone.endDate}
                        className="w-full bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 rounded px-1 py-0.5 text-[7px] font-bold text-slate-700 outline-none"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <label className="absolute -top-3 left-0 text-[6px] font-bold text-slate-500 uppercase">End</label>
                      <input 
                        type="date"
                        value={getNewActivityForm(milestone.id).endDate}
                        onChange={(e) => setNewActivityByMilestone(prev => ({
                          ...prev,
                          [milestone.id]: { ...getNewActivityForm(milestone.id), endDate: e.target.value }
                        }))}
                        min={milestone.startDate}
                        max={milestone.endDate}
                        className="w-full bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded px-1 py-0.5 text-[7px] font-bold text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2 sticky right-0 bg-gradient-to-l from-emerald-50 to-green-50 z-10 text-center border-l border-emerald-400">
                <div className="flex items-center justify-center gap-0.5">
                  <button 
                    onClick={() => handleAddActivitySubmit(phase.id, milestone.id)}
                    className="flex items-center gap-0.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-2 py-1 rounded text-[7px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                  >
                    <CheckCircle2 className="w-2 h-2" />
                    Save
                  </button>
                  <button 
                    onClick={() => {
                      setVisibleAddRowMilestone(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(milestone.id);
                        return newSet;
                      });
                      const newState = { ...newActivityByMilestone };
                      delete newState[milestone.id];
                      setNewActivityByMilestone(newState);
                    }}
                    className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-all shadow-sm text-[7px]"
                    title="Cancel"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ProjectMatrix;

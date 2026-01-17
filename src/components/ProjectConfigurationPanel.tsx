import React, { useState } from 'react';
import { Plus, Trash2, Edit, Save, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  description: string;
  isEditing?: boolean;
}

interface Milestone {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  noOfMonths: number;
  activities: Activity[];
  isExpanded: boolean;
  isEditing?: boolean;
}

interface Phase {
  id: string;
  name: string;
  milestones: Milestone[];
  isExpanded: boolean;
  isEditing?: boolean;
}

interface ProjectConfigurationPanelProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectConfigurationPanel: React.FC<ProjectConfigurationPanelProps> = ({
  projectId,
  projectName,
  isOpen,
  onClose,
}) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newMilestoneName, setNewMilestoneName] = useState('');
  const [newMilestoneStartDate, setNewMilestoneStartDate] = useState('');
  const [newMilestoneEndDate, setNewMilestoneEndDate] = useState('');
  const [newActivityName, setNewActivityName] = useState('');
  const [newActivityDesc, setNewActivityDesc] = useState('');

  const calculateMonths = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    return Math.max(0, months);
  };

  const addPhase = () => {
    if (newPhaseName.trim()) {
      const newPhase: Phase = {
        id: Date.now().toString(),
        name: newPhaseName,
        milestones: [],
        isExpanded: true,
      };
      setPhases([...phases, newPhase]);
      setNewPhaseName('');
      setSelectedPhaseId(newPhase.id);
    }
  };

  const editPhase = (phaseId: string, newName: string) => {
    setPhases(phases.map(p => 
      p.id === phaseId ? { ...p, name: newName, isEditing: false } : p
    ));
  };

  const deletePhase = (phaseId: string) => {
    setPhases(phases.filter(p => p.id !== phaseId));
    if (selectedPhaseId === phaseId) setSelectedPhaseId(null);
  };

  const togglePhase = (phaseId: string) => {
    setPhases(phases.map(p => 
      p.id === phaseId ? { ...p, isExpanded: !p.isExpanded } : p
    ));
  };

  const addMilestone = (phaseId: string) => {
    if (newMilestoneName.trim() && newMilestoneStartDate && newMilestoneEndDate) {
      const months = calculateMonths(newMilestoneStartDate, newMilestoneEndDate);
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        name: newMilestoneName,
        startDate: newMilestoneStartDate,
        endDate: newMilestoneEndDate,
        noOfMonths: months,
        activities: [],
        isExpanded: true,
      };
      setPhases(phases.map(p => 
        p.id === phaseId ? { ...p, milestones: [...p.milestones, newMilestone] } : p
      ));
      setNewMilestoneName('');
      setNewMilestoneStartDate('');
      setNewMilestoneEndDate('');
    }
  };

  const deleteMilestone = (phaseId: string, milestoneId: string) => {
    setPhases(phases.map(p => 
      p.id === phaseId 
        ? { ...p, milestones: p.milestones.filter(m => m.id !== milestoneId) }
        : p
    ));
  };

  const toggleMilestone = (phaseId: string, milestoneId: string) => {
    setPhases(phases.map(p => 
      p.id === phaseId 
        ? { 
            ...p, 
            milestones: p.milestones.map(m => 
              m.id === milestoneId ? { ...m, isExpanded: !m.isExpanded } : m
            )
          }
        : p
    ));
  };

  const addActivity = (phaseId: string, milestoneId: string) => {
    if (newActivityName.trim()) {
      const newActivity: Activity = {
        id: Date.now().toString(),
        name: newActivityName,
        description: newActivityDesc,
      };
      setPhases(phases.map(p => 
        p.id === phaseId 
          ? { 
              ...p, 
              milestones: p.milestones.map(m => 
                m.id === milestoneId 
                  ? { ...m, activities: [...m.activities, newActivity] }
                  : m
              )
            }
          : p
      ));
      setNewActivityName('');
      setNewActivityDesc('');
    }
  };

  const deleteActivity = (phaseId: string, milestoneId: string, activityId: string) => {
    setPhases(phases.map(p => 
      p.id === phaseId 
        ? { 
            ...p, 
            milestones: p.milestones.map(m => 
              m.id === milestoneId 
                ? { ...m, activities: m.activities.filter(a => a.id !== activityId) }
                : m
            )
          }
        : p
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 px-8 py-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Project Configuration</h2>
          <p className="text-slate-200 text-sm mt-1">{projectName}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Add Phase Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Add Phase
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter phase name (e.g., Requirements, Development, Testing)"
              value={newPhaseName}
              onChange={(e) => setNewPhaseName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPhase()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={addPhase}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Phase
            </button>
          </div>
        </div>

        {/* Phases List */}
        <div className="space-y-4">
          {phases.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No phases added yet. Create your first phase above.</p>
            </div>
          ) : (
            phases.map((phase) => (
              <div key={phase.id} className="border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Phase Header */}
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 flex items-center justify-between border-b border-gray-300">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => togglePhase(phase.id)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      {phase.isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      )}
                    </button>
                    {phase.isEditing ? (
                      <input
                        type="text"
                        defaultValue={phase.name}
                        onBlur={(e) => editPhase(phase.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            editPhase(phase.id, e.currentTarget.value);
                          }
                        }}
                        autoFocus
                        className="flex-1 px-3 py-1 border border-blue-400 rounded outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <h4 className="text-lg font-bold text-gray-900">{phase.name}</h4>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPhases(phases.map(p => p.id === phase.id ? { ...p, isEditing: !p.isEditing } : p))}
                      className="p-2 hover:bg-white rounded transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => deletePhase(phase.id)}
                      className="p-2 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Phase Content */}
                {phase.isExpanded && (
                  <div className="p-6 bg-white space-y-6">
                    {/* Add Milestone Section */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 p-5">
                      <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        Add Milestone to "{phase.name}"
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <input
                          type="text"
                          placeholder="Milestone name"
                          value={newMilestoneName}
                          onChange={(e) => setNewMilestoneName(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        />
                        <input
                          type="date"
                          value={newMilestoneStartDate}
                          onChange={(e) => setNewMilestoneStartDate(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        />
                        <input
                          type="date"
                          value={newMilestoneEndDate}
                          onChange={(e) => setNewMilestoneEndDate(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        />
                        <input
                          type="number"
                          value={calculateMonths(newMilestoneStartDate, newMilestoneEndDate)}
                          disabled
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-600"
                          placeholder="Months"
                        />
                        <button
                          onClick={() => addMilestone(phase.id)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Milestones List */}
                    <div className="space-y-4">
                      {phase.milestones.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-gray-500 text-sm">No milestones added yet</p>
                        </div>
                      ) : (
                        phase.milestones.map((milestone) => (
                          <div key={milestone.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            {/* Milestone Header - Table Style */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-4 flex-1">
                                <button
                                  onClick={() => toggleMilestone(phase.id, milestone.id)}
                                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                  {milestone.isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                  )}
                                </button>
                                <div className="grid grid-cols-4 gap-4 flex-1">
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Milestone</p>
                                    <p className="font-semibold text-gray-900">{milestone.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Start Date</p>
                                    <p className="font-semibold text-gray-900">{new Date(milestone.startDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">End Date</p>
                                    <p className="font-semibold text-gray-900">{new Date(milestone.endDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Duration</p>
                                    <p className="font-semibold text-gray-900">{milestone.noOfMonths} months</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => deleteMilestone(phase.id, milestone.id)}
                                  className="p-2 hover:bg-red-100 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </div>

                            {/* Milestone Content */}
                            {milestone.isExpanded && (
                              <div className="p-6 bg-white space-y-5 border-t border-gray-200">
                                {/* Add Activity Section */}
                                <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-lg border border-orange-200 p-4">
                                  <h6 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                    <span className="w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                                    Add Activity to "{milestone.name}"
                                  </h6>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input
                                      type="text"
                                      placeholder="Activity name"
                                      value={newActivityName}
                                      onChange={(e) => setNewActivityName(e.target.value)}
                                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Description"
                                      value={newActivityDesc}
                                      onChange={(e) => setNewActivityDesc(e.target.value)}
                                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    />
                                    <button
                                      onClick={() => addActivity(phase.id, milestone.id)}
                                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                                    >
                                      <Plus className="w-4 h-4" />
                                      Add Activity
                                    </button>
                                  </div>
                                </div>

                                {/* Activities Table */}
                                {milestone.activities.length === 0 ? (
                                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <p className="text-gray-500 text-sm">No activities added yet</p>
                                  </div>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="bg-gray-100 border-b border-gray-300">
                                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Activity Name</th>
                                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Description</th>
                                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {milestone.activities.map((activity) => (
                                          <tr key={activity.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                              <p className="font-semibold text-gray-900">{activity.name}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                              <p className="text-gray-600 text-sm">{activity.description || '-'}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                              <div className="flex gap-2 justify-center">
                                                <button className="p-2 hover:bg-blue-100 rounded transition-colors">
                                                  <Edit className="w-4 h-4 text-blue-600" />
                                                </button>
                                                <button
                                                  onClick={() => deleteActivity(phase.id, milestone.id, activity.id)}
                                                  className="p-2 hover:bg-red-100 rounded transition-colors"
                                                >
                                                  <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Phases: <span className="font-bold">{phases.length}</span> | 
          Milestones: <span className="font-bold">{phases.reduce((sum, p) => sum + p.milestones.length, 0)}</span> | 
          Activities: <span className="font-bold">{phases.reduce((sum, p) => sum + p.milestones.reduce((msum, m) => msum + m.activities.length, 0), 0)}</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { SAMPLE_PROJECT_SCHEDULING, SAMPLE_PROJECT_DEFINITIONS } from '../../pbemData';
import { Calendar, CheckCircle2, AlertCircle, Clock, Plus, Edit2, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

interface ProjectSchedulingPageProps {
  userName: string;
}

export const ProjectSchedulingPage: React.FC<ProjectSchedulingPageProps> = ({ userName }) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [showAddMilestone, setShowAddMilestone] = useState<string | null>(null);
  const [phaseProgress, setPhaseProgress] = useState<{ [key: string]: number }>({});

  const myProjects = SAMPLE_PROJECT_DEFINITIONS.filter(p => p.projectDirectorName === userName);
  const mySchedulings = SAMPLE_PROJECT_SCHEDULING.filter(s => 
    myProjects.some(p => p.id === s.projectDefinitionId)
  );

  const togglePhase = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  const handleProgressChange = (phaseId: string, value: number) => {
    setPhaseProgress({ ...phaseProgress, [phaseId]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Scheduling</h1>
        <p className="text-gray-600 mt-2">Manage phases, milestones, and activities with advanced controls</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Total Phases</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {mySchedulings.reduce((sum, s) => sum + s.phases.length, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Total Milestones</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {mySchedulings.reduce((sum, s) => sum + s.phases.reduce((ps, p) => ps + p.milestones.length, 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Avg Completion</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Math.round(mySchedulings.reduce((sum, s) => sum + s.overallCompletionPercentage, 0) / (mySchedulings.length || 1))}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mySchedulings.map(scheduling => {
          const project = SAMPLE_PROJECT_DEFINITIONS.find(p => p.id === scheduling.projectDefinitionId);
          return (
            <div key={scheduling.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-900">{project?.projectName}</h3>
                <p className="text-sm text-gray-600 mt-1">End Date: {new Date(project?.endDate || '').toLocaleDateString()}</p>
              </div>

              {/* Phases */}
              <div className="space-y-4 p-6">
                {scheduling.phases.map((phase, phaseIdx) => {
                  const isExpanded = expandedPhases.has(phase.id);
                  const progressValue = phaseProgress[phase.id] || phase.completionPercentage;

                  return (
                    <div key={phase.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {/* Phase Header - Expandable */}
                      <div
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center gap-4"
                        onClick={() => togglePhase(phase.id)}
                      >
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{phase.type}</h4>
                              <p className="text-xs text-gray-600 mt-1">{phase.milestones.length} milestones • {phase.milestones.reduce((sum, m) => sum + m.activities.length, 0)} activities</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {/* Progress Percentage - Draggable */}
                              <div className="text-right">
                                <p className="text-xs text-gray-600 uppercase tracking-wide">Progress</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progressValue}
                                    onChange={(e) => handleProgressChange(phase.id, parseInt(e.target.value))}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-20 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${progressValue}%, #E5E7EB ${progressValue}%, #E5E7EB 100%)`
                                    }}
                                  />
                                  <span className="font-bold text-gray-900 text-sm w-12 text-right">{progressValue}%</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                              style={{ width: `${progressValue}%` }}
                            />
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Expanded Content - Milestones & Activities */}
                      {isExpanded && (
                        <div className="p-6 border-t border-gray-200 space-y-6 bg-white">
                          {/* Milestones List */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Milestones
                              </h5>
                              <button
                                onClick={() => setShowAddMilestone(phase.id === showAddMilestone ? null : phase.id)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-1"
                              >
                                <Plus className="w-4 h-4" />
                                Add
                              </button>
                            </div>

                            {phase.milestones.map((milestone, mIdx) => (
                              <div key={milestone.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-start gap-3 flex-1">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900">{milestone.name}</p>
                                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          Start: {new Date(milestone.startDate).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          End: {new Date(milestone.endDate).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {milestone.completionPercentage}% done
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <button className="p-2 text-gray-500 hover:bg-white rounded-lg transition-colors">
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-gray-500 hover:bg-white rounded-lg transition-colors">
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {/* Milestone Progress */}
                                <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${milestone.completionPercentage}%` }}
                                  />
                                </div>

                                {/* Activities under Milestone */}
                                {milestone.activities && milestone.activities.length > 0 && (
                                  <div className="mt-4 ml-8 space-y-2 pt-4 border-t border-gray-200">
                                    <p className="text-xs uppercase font-semibold text-gray-600">Activities ({milestone.activities.length})</p>
                                    {milestone.activities.map((activity, aIdx) => (
                                      <div key={aIdx} className="flex items-center gap-2 text-sm text-gray-700 p-2 bg-white rounded border border-gray-100 hover:border-gray-300">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="flex-1">{activity.name}</span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                          {activity.completionPercentage}%
                                        </span>
                                      </div>
                                    ))}
                                    <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2 flex items-center justify-center gap-1 mt-2 border border-blue-200 rounded-lg hover:bg-blue-50">
                                      <Plus className="w-4 h-4" />
                                      Add Activity
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Add Milestone Form */}
                          {showAddMilestone === phase.id && (
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <p className="text-sm font-semibold text-blue-900 mb-3">Add New Milestone</p>
                              <div className="space-y-3">
                                <input type="text" placeholder="Milestone name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                                <div className="grid grid-cols-2 gap-3">
                                  <input type="date" placeholder="Start date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                                  <input type="date" placeholder="End date" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                                </div>
                                <div className="flex gap-2">
                                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    Save Milestone
                                  </button>
                                  <button
                                    onClick={() => setShowAddMilestone(null)}
                                    className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {mySchedulings.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No schedules available</p>
        </div>
      )}
    </div>
  );
};

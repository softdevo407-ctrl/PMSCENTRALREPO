import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, Edit2, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { projectPhaseService, ProjectPhaseResponse, MilestoneResponse } from '../services/projectPhaseService';

interface ProjectPhasesPanelProps {
  projectId: number;
  isOpen: boolean;
  refreshKey?: number;
  onEditPhase?: (phaseId: number) => void;
}

export const ProjectPhasesPanel: React.FC<ProjectPhasesPanelProps> = ({ projectId, isOpen, refreshKey, onEditPhase }) => {
  const [phases, setPhases] = useState<ProjectPhaseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchPhases();
    }
  }, [isOpen, projectId, refreshKey]);

  const fetchPhases = async () => {
    try {
      setLoading(true);
      setError(null);
      const phasesData = await projectPhaseService.getPhasesByProject(projectId);
      setPhases(phasesData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch phases';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (phaseId: number) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const toggleMilestone = (milestoneId: number) => {
    setExpandedMilestones(prev =>
      prev.includes(milestoneId)
        ? prev.filter(id => id !== milestoneId)
        : [...prev, milestoneId]
    );
  };

  const handleDeletePhase = async (phaseId: number) => {
    if (confirm('Are you sure you want to delete this phase? This will also delete all milestones and activities.')) {
      try {
        await projectPhaseService.deletePhase(projectId, phaseId);
        setPhases(phases.filter(p => p.id !== phaseId));
      } catch (err) {
        alert(`Failed to delete phase: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Project Phases</h3>
        <button
          onClick={fetchPhases}
          disabled={loading}
          className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      {!loading && phases.length === 0 && (
        <p className="text-center text-gray-600 py-8">No phases added yet. Click "Add Phase" to get started.</p>
      )}

      <div className="space-y-3">
        {phases.map(phase => (
          <div key={phase.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Phase Header */}
            <div className="bg-gray-50 px-4 py-3 flex items-center justify-between hover:bg-gray-100 cursor-pointer"
              onClick={() => togglePhase(phase.id)}>
              <div className="flex items-center gap-3 flex-1">
                <button className="text-gray-600 hover:text-gray-900">
                  {expandedPhases.includes(phase.id) ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{phase.phaseName}</p>
                  <p className="text-xs text-gray-600">Weight: {phase.phaseWeight}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700 bg-gray-200 px-2 py-1 rounded">
                  {phase.milestones?.length || 0} Milestones
                </span>
                {onEditPhase && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPhase(phase.id);
                    }}
                    className="text-blue-600 hover:text-blue-700 p-1"
                    title="Edit phase"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePhase(phase.id);
                  }}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Milestones */}
            {expandedPhases.includes(phase.id) && (
              <div className="bg-white p-4 border-t border-gray-200 space-y-3">
                {phase.milestones && phase.milestones.length > 0 ? (
                  phase.milestones
                    .sort((a, b) => (a.milestoneOrder || 0) - (b.milestoneOrder || 0))
                    .map(milestone => (
                    <div key={milestone.id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                      {/* Milestone Header */}
                      <div className="px-4 py-2 flex items-center justify-between hover:bg-gray-100 cursor-pointer"
                        onClick={() => toggleMilestone(milestone.id)}>
                        <div className="flex items-center gap-2 flex-1">
                          <button className="text-gray-600 hover:text-gray-900">
                            {expandedMilestones.includes(milestone.id) ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{milestone.milestoneName}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(milestone.startDate).toLocaleDateString()} - {new Date(milestone.endDate).toLocaleDateString()}
                              </span>
                              {milestone.revisedEndDate && (
                                <span className="text-yellow-700 font-semibold">
                                  (Revised: {new Date(milestone.revisedEndDate).toLocaleDateString()})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 rounded border border-gray-200">
                            {milestone.milestoneWeight}%
                          </span>
                          <span className="text-xs text-gray-600">
                            {milestone.activities?.length || 0} Activities
                          </span>
                        </div>
                      </div>

                      {/* Activities */}
                      {expandedMilestones.includes(milestone.id) && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200 space-y-2">
                          {milestone.activities && milestone.activities.length > 0 ? (
                            milestone.activities.map((activity, idx) => (
                              <div key={idx} className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900">{activity.activityName}</p>
                                    {activity.description && (
                                      <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                                    )}
                                  </div>
                                  <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded ml-2">
                                    {activity.activityWeight}%
                                  </span>
                                </div>
                                {activity.startDate && activity.endDate && (
                                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {new Date(activity.startDate).toLocaleDateString()} - {new Date(activity.endDate).toLocaleDateString()}
                                    </span>
                                    {activity.revisedEndDate && (
                                      <span className="text-yellow-700 font-semibold">
                                        (Revised: {new Date(activity.revisedEndDate).toLocaleDateString()})
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-600 italic">No activities</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600 italic">No milestones</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

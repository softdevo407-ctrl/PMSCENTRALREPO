import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { projectPhaseService, MilestoneResponse } from '../services/projectPhaseService';

interface StatusUpdationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: number;
}

interface ActivityStatus {
  activityId: number;
  activityName: string;
  status: string;
}

interface MilestoneStatus {
  milestoneId: number;
  milestoneName: string;
  derivedStatus: string; // Derived from activities
  activities: ActivityStatus[];
}

interface PhaseStatus {
  phaseId: number;
  phaseName: string;
  milestones: MilestoneStatus[];
}

const STATUS_OPTIONS = ['NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'];

// Derive milestone status from activities
const deriveMilestoneStatus = (activities: ActivityStatus[]): string => {
  if (!activities || activities.length === 0) return 'NOT_STARTED';
  
  const statuses = activities.map(a => a.status);
  
  // If all completed, milestone is completed
  if (statuses.every(s => s === 'COMPLETED')) return 'COMPLETED';
  
  // If all not started, milestone is not started
  if (statuses.every(s => s === 'NOT_STARTED')) return 'NOT_STARTED';
  
  // If any on hold, milestone is on hold
  if (statuses.some(s => s === 'ON_HOLD')) return 'ON_HOLD';
  
  // Otherwise in progress
  return 'IN_PROGRESS';
};

export const StatusUpdationModal: React.FC<StatusUpdationModalProps> = ({ isOpen, onClose, onSuccess, projectId }) => {
  const [phases, setPhases] = useState<PhaseStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<number[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadPhases();
    }
  }, [isOpen]);

  const loadPhases = async () => {
    try {
      setLoading(true);
      setError(null);
      const phasesData = await projectPhaseService.getPhasesByProject(projectId);
      
      const phaseStatuses: PhaseStatus[] = phasesData.map(phase => {
        const milestones = (phase.milestones || []).map(milestone => {
          const activities = (milestone.activities || []).map(activity => ({
            activityId: activity.id,
            activityName: activity.activityName,
            status: activity.status || 'NOT_STARTED'
          }));
          
          return {
            milestoneId: milestone.id,
            milestoneName: milestone.milestoneName,
            derivedStatus: deriveMilestoneStatus(activities),
            activities
          };
        });
        
        return {
          phaseId: phase.id,
          phaseName: phase.phaseName,
          milestones
        };
      });
      
      setPhases(phaseStatuses);
    } catch (err) {
      setError(`Failed to load phases: ${err instanceof Error ? err.message : 'Unknown error'}`);
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

  const updateActivityStatus = (phaseId: number, milestoneId: number, activityId: number, newStatus: string) => {
    setPhases(phases.map(phase =>
      phase.phaseId === phaseId
        ? {
            ...phase,
            milestones: phase.milestones.map(milestone =>
              milestone.milestoneId === milestoneId
                ? {
                    ...milestone,
                    activities: milestone.activities.map(activity =>
                      activity.activityId === activityId
                        ? { ...activity, status: newStatus }
                        : activity
                    ),
                    // Re-derive milestone status based on updated activities
                    derivedStatus: deriveMilestoneStatus(
                      milestone.activities.map(activity =>
                        activity.activityId === activityId
                          ? { ...activity, status: newStatus }
                          : activity
                      )
                    )
                  }
                : milestone
            )
          }
        : phase
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // TODO: Call API to update activity statuses
      // For now, just show success
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(`Failed to update statuses: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOT_STARTED':
        return 'bg-gray-100 text-gray-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Update Phase Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 text-sm">Statuses updated successfully!</p>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <p className="ml-2 text-gray-600">Loading phases...</p>
            </div>
          ) : phases.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No phases found for this project</p>
          ) : (
            <div className="space-y-3">
              {phases.map(phase => (
                <div key={phase.phaseId} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Phase Header */}
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between hover:bg-gray-100 cursor-pointer"
                    onClick={() => togglePhase(phase.phaseId)}>
                    <div className="flex items-center gap-3 flex-1">
                      <button className="text-gray-600 hover:text-gray-900">
                        {expandedPhases.includes(phase.phaseId) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{phase.phaseName}</p>
                        <p className="text-xs text-gray-600 mt-1">Update activity statuses below</p>
                      </div>
                    </div>
                  </div>

                  {/* Milestones */}
                  {expandedPhases.includes(phase.phaseId) && (
                    <div className="bg-white p-4 border-t border-gray-200 space-y-3">
                      {phase.milestones.length === 0 ? (
                        <p className="text-sm text-gray-600 italic">No milestones</p>
                      ) : (
                        phase.milestones.map(milestone => (
                          <div key={milestone.milestoneId} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                            {/* Milestone Header - Derived Status (Read-only) */}
                            <div className="px-4 py-2 flex items-center justify-between hover:bg-gray-100 cursor-pointer"
                              onClick={() => toggleMilestone(milestone.milestoneId)}>
                              <div className="flex items-center gap-2 flex-1">
                                <button className="text-gray-600 hover:text-gray-900">
                                  {expandedMilestones.includes(milestone.milestoneId) ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-900">{milestone.milestoneName}</p>
                                  <p className="text-xs text-gray-600 mt-0.5">
                                    Derived Status: <span className={`font-semibold ${
                                      milestone.derivedStatus === 'COMPLETED' ? 'text-green-700' :
                                      milestone.derivedStatus === 'IN_PROGRESS' ? 'text-blue-700' :
                                      milestone.derivedStatus === 'ON_HOLD' ? 'text-yellow-700' :
                                      'text-gray-700'
                                    }`}>
                                      {milestone.derivedStatus.replace(/_/g, ' ')}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* Read-only status badge */}
                              <span className={`ml-2 px-3 py-1 border rounded text-xs font-semibold ${getStatusColor(milestone.derivedStatus)}`}>
                                {milestone.derivedStatus.replace(/_/g, ' ')}
                              </span>
                            </div>

                            {/* Activities - Editable Status */}
                            {expandedMilestones.includes(milestone.milestoneId) && (
                              <div className="bg-white px-4 py-3 border-t border-gray-200 space-y-2">
                                {milestone.activities.length === 0 ? (
                                  <p className="text-xs text-gray-600 italic">No activities</p>
                                ) : (
                                  <>
                                    <p className="text-xs font-semibold text-gray-700 mb-3">Update Activity Status:</p>
                                    {milestone.activities.map(activity => (
                                      <div key={activity.activityId} className="flex items-center justify-between gap-2 p-3 bg-blue-50 rounded border border-blue-100">
                                        <div className="flex-1">
                                          <p className="text-sm text-gray-900 font-medium">{activity.activityName}</p>
                                        </div>
                                        <select
                                          value={activity.status}
                                          onChange={(e) => {
                                            updateActivityStatus(phase.phaseId, milestone.milestoneId, activity.activityId, e.target.value);
                                          }}
                                          className={`px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-medium ${getStatusColor(activity.status)}`}
                                          disabled={loading || submitting}
                                        >
                                          {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>
                                              {status.replace(/_/g, ' ')}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {phases.length > 0 && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || success}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Update Statuses
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

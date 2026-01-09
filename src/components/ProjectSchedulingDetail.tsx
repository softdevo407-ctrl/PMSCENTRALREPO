import React, { useState } from 'react';
import { ProjectScheduling, ProjectPhase, Milestone, Activity, PhaseType } from '../pbemTypes';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';

interface ProjectSchedulingDetailProps {
  scheduling: ProjectScheduling;
  projectName: string;
}

const ProjectSchedulingDetail: React.FC<ProjectSchedulingDetailProps> = ({ scheduling, projectName }) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Track':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'At Risk':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'Delayed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'At Risk':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Delayed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompletionBarColor = (completion: number) => {
    if (completion >= 75) return 'bg-emerald-500';
    if (completion >= 50) return 'bg-blue-500';
    if (completion >= 25) return 'bg-amber-500';
    return 'bg-orange-500';
  };

  const calculatePhaseWeightedCompletion = (phase: ProjectPhase): number => {
    if (phase.milestones.length === 0) return 0;
    const totalActivities = phase.milestones.reduce((sum, m) => sum + m.activities.length, 0);
    if (totalActivities === 0) return 0;

    const weighted = phase.milestones.reduce((sum, milestone) => {
      const milestoneContribution = (milestone.completionPercentage / 100) * milestone.activities.length;
      return sum + milestoneContribution;
    }, 0);

    return Math.round((weighted / totalActivities) * 100);
  };

  const phaseOrder = [PhaseType.PLANNING, PhaseType.INTEGRATION, PhaseType.TESTING];
  const sortedPhases = [...scheduling.phases].sort(
    (a, b) => phaseOrder.indexOf(a.type) - phaseOrder.indexOf(b.type)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Project Scheduling</h2>
        <p className="text-gray-600 mt-1">Project: <span className="font-semibold">{projectName}</span></p>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Overall Project Completion</p>
            <h3 className="text-4xl font-bold text-blue-900 mt-2">{scheduling.overallCompletionPercentage}%</h3>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon(scheduling.status)}
            <span className={`px-3 py-1 rounded-full font-semibold border ${getStatusColor(scheduling.status)}`}>
              {scheduling.status}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getCompletionBarColor(
              scheduling.overallCompletionPercentage
            )}`}
            style={{ width: `${scheduling.overallCompletionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-blue-700 mt-3">Last updated: {new Date(scheduling.lastUpdated).toLocaleDateString('en-IN')}</p>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {sortedPhases.map((phase) => {
          const phaseWeightedCompletion = calculatePhaseWeightedCompletion(phase);
          const isExpanded = expandedPhase === phase.id;

          return (
            <div key={phase.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                className="w-full p-6 flex items-start justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{phase.type}</h3>
                    <span className={`px-3 py-1 rounded text-xs font-semibold border ${getStatusColor(phase.status)}`}>
                      {phase.status}
                    </span>
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
                      Weight: {phase.weight}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700">Completion</span>
                      <span className="text-sm font-bold text-gray-900">{phaseWeightedCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getCompletionBarColor(phaseWeightedCompletion)}`}
                        style={{ width: `${phaseWeightedCompletion}%` }}
                      />
                    </div>
                  </div>

                  {/* Weighted Calculation Info */}
                  <p className="text-xs text-gray-600">
                    {phase.milestones.length} milestone{phase.milestones.length !== 1 ? 's' : ''} • Weighted contribution: {Math.round((phaseWeightedCompletion * phase.weight) / 100)}%
                  </p>
                </div>

                <button className="ml-4 text-gray-600 hover:text-gray-900 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </button>

              {/* Phase Content */}
              {isExpanded && (
                <div className="bg-gray-50 border-t border-gray-200 p-6 space-y-4">
                  {phase.milestones.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">No milestones defined for this phase</p>
                  ) : (
                    phase.milestones.map((milestone) => {
                      const isMilestoneExpanded = expandedMilestone === milestone.id;

                      return (
                        <div key={milestone.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          {/* Milestone Header */}
                          <button
                            onClick={() => setExpandedMilestone(isMilestoneExpanded ? null : milestone.id)}
                            className="w-full p-5 flex items-start justify-between hover:bg-gray-50 transition-colors text-left"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-gray-900">{milestone.name}</h4>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(
                                    milestone.status
                                  )}`}
                                >
                                  {milestone.status}
                                </span>
                              </div>

                              {/* Milestone Progress */}
                              <div className="mb-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-gray-700">Milestone Progress</span>
                                  <span className="text-xs font-bold text-gray-900">{milestone.completionPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${getCompletionBarColor(
                                      milestone.completionPercentage
                                    )}`}
                                    style={{ width: `${milestone.completionPercentage}%` }}
                                  />
                                </div>
                              </div>

                              {/* Dates */}
                              <div className="flex gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Start: {new Date(milestone.startDate).toLocaleDateString('en-IN')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  End: {new Date(milestone.endDate).toLocaleDateString('en-IN')}
                                </div>
                              </div>
                            </div>

                            <button className="ml-4 text-gray-600 hover:text-gray-900 flex-shrink-0">
                              {isMilestoneExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </button>

                          {/* Activities */}
                          {isMilestoneExpanded && (
                            <div className="bg-gray-100 border-t border-gray-200 p-5 space-y-3">
                              {milestone.activities.length === 0 ? (
                                <p className="text-gray-600 text-center py-3 text-sm">No activities defined</p>
                              ) : (
                                milestone.activities.map((activity) => (
                                  <div key={activity.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h5 className="font-semibold text-gray-900">{activity.name}</h5>
                                        <p className="text-xs text-gray-600 mt-1">Weight: {activity.weight}% of milestone</p>
                                      </div>
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-semibold border flex-shrink-0 ${getStatusColor(
                                          activity.status
                                        )}`}
                                      >
                                        {activity.status}
                                      </span>
                                    </div>

                                    {/* Activity Progress */}
                                    <div className="mb-3">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-gray-700">Progress</span>
                                        <span className="text-xs font-bold text-gray-900">{activity.completionPercentage}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all ${getCompletionBarColor(
                                            activity.completionPercentage
                                          )}`}
                                          style={{ width: `${activity.completionPercentage}%` }}
                                        />
                                      </div>
                                    </div>

                                    {/* Activity Dates & Contribution */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex gap-3 text-xs text-gray-600">
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(activity.startDate).toLocaleDateString('en-IN')}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(activity.endDate).toLocaleDateString('en-IN')}
                                        </div>
                                      </div>
                                      <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                                        Phase contribution: {Math.round((activity.completionPercentage * activity.weight * phase.weight) / 10000)}%
                                      </div>
                                    </div>

                                    {activity.remarks && (
                                      <div className="mt-3 p-2.5 bg-orange-50 rounded border border-orange-200">
                                        <p className="text-xs text-orange-800">{activity.remarks}</p>
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectSchedulingDetail;

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle, Calendar } from 'lucide-react';
import { projectPhaseService, ProjectPhaseRequest, MilestoneRequest } from '../services/projectPhaseService';
import { projectService, ProjectDefinitionResponse } from '../services/projectService';
import { authService } from '../services/authService';

interface AddPhaseModalProps {
  projectId: number;
  phaseId?: number; // For edit mode
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PHASE_OPTIONS = [
  'Concept Studies',
  'Preliminary Design',
  'Detailed Design',
  'Development',
  'Integration',
  'Testing',
  'Deployment',
  'Operations'
];

export const AddPhaseModal: React.FC<AddPhaseModalProps> = ({ projectId, phaseId, isOpen, onClose, onSuccess }) => {
  const [phaseName, setPhaseName] = useState('');
  const [phaseWeight, setPhaseWeight] = useState(0);
  const [milestones, setMilestones] = useState<MilestoneRequest[]>([
    {
      milestoneName: '',
      startDate: '',
      endDate: '',
      revisedEndDate: '',
      milestoneWeight: 0,
      milestoneOrder: 0,
      activities: [{ activityName: '', activityWeight: 0, description: '', startDate: '', endDate: '', revisedEndDate: '' }]
    }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectDefinitionResponse | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  // Helper function to format date to YYYY-MM-DD for HTML date input
  const formatDateForInput = (date: Date | string): string => {
    if (typeof date === 'string') {
      return date.split('T')[0]; // Handle ISO strings
    }
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  // Fetch project details to get timeline
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setProjectLoading(true);
        setIsEditMode(!!phaseId);
        
        if (phaseId) {
          // Load existing phase for editing
          const phase = await projectPhaseService.getPhaseById(projectId, phaseId);
          setPhaseName(phase.phaseName);
          setPhaseWeight(phase.phaseWeight);
          
          // Load project data for validation
          const project = await projectService.getProjectById(projectId);
          setProjectData(project);
          
          // Sort milestones by milestoneOrder and populate
          const sortedMilestones = (phase.milestones || [])
            .sort((a, b) => (a.milestoneOrder || 0) - (b.milestoneOrder || 0))
            .map(milestone => ({
              id: milestone.id,
              milestoneName: milestone.milestoneName,
              startDate: formatDateForInput(milestone.startDate),
              endDate: formatDateForInput(milestone.endDate),
              revisedEndDate: milestone.revisedEndDate ? formatDateForInput(milestone.revisedEndDate) : '',
              milestoneWeight: milestone.milestoneWeight,
              milestoneOrder: milestone.milestoneOrder || 0,
              activities: (milestone.activities || []).map(activity => ({
                id: activity.id,
                activityName: activity.activityName,
                activityWeight: activity.activityWeight,
                description: activity.description || '',
                startDate: formatDateForInput(activity.startDate),
                endDate: formatDateForInput(activity.endDate),
                revisedEndDate: activity.revisedEndDate ? formatDateForInput(activity.revisedEndDate) : ''
              }))
            }));
          
          setMilestones(sortedMilestones);
        } else {
          // Load project for new phase creation
          const project = await projectService.getProjectById(projectId);
          setProjectData(project);
        }
      } catch (err) {
        console.error('Failed to fetch project:', err);
        if (phaseId) {
          setErrors({ submit: `Failed to load phase: ${err instanceof Error ? err.message : 'Unknown error'}` });
        }
      } finally {
        setProjectLoading(false);
      }
    };

    if (isOpen && projectId) {
      fetchProject();
    }
  }, [isOpen, projectId, phaseId]);

  const validateWeights = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!phaseName) {
      newErrors.phaseName = 'Phase name is required';
    }
    if (phaseWeight <= 0 || phaseWeight > 100) {
      newErrors.phaseWeight = 'Phase weight must be between 1 and 100';
    }

    if (!projectData) {
      newErrors.project = 'Unable to validate against project timeline';
      setErrors(newErrors);
      return false;
    }

    const projectStart = new Date(projectData.createdDate);
    const projectEnd = new Date(projectData.endDate);

    // Validate milestones
    let milestoneWeightSum = 0;
    milestones.forEach((milestone, idx) => {
      if (!milestone.milestoneName) {
        newErrors[`milestone_${idx}_name`] = 'Milestone name is required';
      }
      if (!milestone.startDate) {
        newErrors[`milestone_${idx}_start`] = 'Start date is required';
      }
      if (!milestone.endDate) {
        newErrors[`milestone_${idx}_end`] = 'End date is required';
      }

      if (milestone.startDate && milestone.endDate) {
        const start = new Date(milestone.startDate);
        const end = new Date(milestone.endDate);

        // Validate dates are within project timeline
        if (start < projectStart) {
          newErrors[`milestone_${idx}_start`] = `Cannot be before project start date (${projectStart.toLocaleDateString()})`;
        }
        if (end > projectEnd) {
          newErrors[`milestone_${idx}_end`] = `Cannot be after project end date (${projectEnd.toLocaleDateString()})`;
        }

        if (end <= start) {
          newErrors[`milestone_${idx}_dates`] = 'End date must be after start date';
        }
      }

      if (milestone.milestoneWeight <= 0 || milestone.milestoneWeight > 100) {
        newErrors[`milestone_${idx}_weight`] = 'Weight must be between 1 and 100';
      }
      milestoneWeightSum += milestone.milestoneWeight;

      // Validate activities
      let activityWeightSum = 0;
      milestone.activities.forEach((activity, actIdx) => {
        if (!activity.activityName) {
          newErrors[`activity_${idx}_${actIdx}_name`] = 'Activity name is required';
        }
        if (!activity.startDate) {
          newErrors[`activity_${idx}_${actIdx}_start`] = 'Start date is required';
        }
        if (!activity.endDate) {
          newErrors[`activity_${idx}_${actIdx}_end`] = 'End date is required';
        }

        if (activity.activityWeight <= 0 || activity.activityWeight > 100) {
          newErrors[`activity_${idx}_${actIdx}_weight`] = 'Weight must be between 1 and 100';
        }

        // Validate activity dates are within milestone dates
        if (activity.startDate && activity.endDate && milestone.startDate && milestone.endDate) {
          const actStart = new Date(activity.startDate);
          const actEnd = new Date(activity.endDate);
          const milStart = new Date(milestone.startDate);
          const milEnd = new Date(milestone.endDate);

          if (actStart < milStart) {
            newErrors[`activity_${idx}_${actIdx}_start`] = `Cannot be before milestone start (${milStart.toLocaleDateString()})`;
          }
          if (actEnd > milEnd) {
            newErrors[`activity_${idx}_${actIdx}_end`] = `Cannot be after milestone end (${milEnd.toLocaleDateString()})`;
          }

          if (actEnd <= actStart) {
            newErrors[`activity_${idx}_${actIdx}_dates`] = 'End date must be after start date';
          }
        }

        activityWeightSum += activity.activityWeight;
      });

      if (activityWeightSum > 100) {
        newErrors[`milestone_${idx}_activities_sum`] = `Activity weights sum (${activityWeightSum}) cannot exceed 100`;
      }
    });

    if (milestoneWeightSum > 100) {
      newErrors.milestones_sum = `Milestone weights sum (${milestoneWeightSum}) cannot exceed 100`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        milestoneName: '',
        startDate: '',
        endDate: '',
        revisedEndDate: '',
        milestoneWeight: 0,
        milestoneOrder: milestones.length,
        activities: [{ activityName: '', activityWeight: 0, description: '', startDate: '', endDate: '', revisedEndDate: '' }]
      }
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleAddActivity = (milestoneIndex: number) => {
    const newMilestones = [...milestones];
    newMilestones[milestoneIndex].activities.push({
      activityName: '',
      activityWeight: 0,
      description: '',
      startDate: '',
      endDate: '',
      revisedEndDate: ''
    });
    setMilestones(newMilestones);
  };

  const handleRemoveActivity = (milestoneIndex: number, activityIndex: number) => {
    const newMilestones = [...milestones];
    newMilestones[milestoneIndex].activities = newMilestones[milestoneIndex].activities.filter(
      (_, i) => i !== activityIndex
    );
    setMilestones(newMilestones);
  };

  const handleMilestoneChange = (index: number, field: string, value: any) => {
    const newMilestones = [...milestones];
    (newMilestones[index] as any)[field] = value;
    setMilestones(newMilestones);
  };

  const handleActivityChange = (milestoneIndex: number, activityIndex: number, field: string, value: any) => {
    const newMilestones = [...milestones];
    (newMilestones[milestoneIndex].activities[activityIndex] as any)[field] = value;
    setMilestones(newMilestones);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateWeights()) {
      return;
    }

    // Check if token exists
    const token = authService.getToken();
    if (!token) {
      setErrors({ submit: 'Authentication token not found. Please login again.' });
      return;
    }

    try {
      setLoading(true);
      const request: ProjectPhaseRequest = {
        phaseName,
        phaseWeight,
        milestones: milestones.map((m, idx) => ({
          id: m.id,
          milestoneName: m.milestoneName,
          startDate: m.startDate,
          endDate: m.endDate,
          revisedEndDate: m.revisedEndDate,
          milestoneWeight: m.milestoneWeight,
          milestoneOrder: idx,
          activities: m.activities.map(a => ({
            id: a.id,
            activityName: a.activityName,
            activityWeight: a.activityWeight,
            description: a.description,
            startDate: a.startDate,
            endDate: a.endDate,
            revisedEndDate: a.revisedEndDate
          }))
        }))
      };

      console.log(`${isEditMode ? 'Updating' : 'Creating'} phase with token:`, token ? 'present' : 'missing');
      
      if (isEditMode && phaseId) {
        // Edit mode: update existing phase
        await projectPhaseService.updatePhase(projectId, phaseId, request);
      } else {
        // Create mode: create new phase
        await projectPhaseService.createPhase(projectId, request);
      }
      
      setLoading(false);
      onSuccess();
      onClose();
    } catch (error) {
      let errorMsg = error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} phase`;
      
      // Provide specific error messages for common issues
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        errorMsg = 'Unauthorized: Your session may have expired. Please login again.';
      } else if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
        errorMsg = `Forbidden: You do not have permission to ${isEditMode ? 'update' : 'create'} phases for this project.`;
      }
      
      setErrors({ submit: errorMsg });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const milestoneWeightSum = milestones.reduce((sum, m) => sum + (m.milestoneWeight || 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Phase' : 'Add Phase'}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Project Timeline Info */}
        {projectLoading ? (
          <div className="p-6 text-center text-gray-600">Loading project details...</div>
        ) : projectData ? (
          <div className="bg-blue-50 border-b border-blue-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Project Timeline</h3>
            </div>
            <p className="text-sm text-blue-800">
              Project runs from <span className="font-bold">{new Date(projectData.createdDate).toLocaleDateString()}</span> to <span className="font-bold">{new Date(projectData.endDate).toLocaleDateString()}</span>
            </p>
            <p className="text-xs text-blue-700 mt-1">All milestones and activities must fall within this timeline</p>
          </div>
        ) : null}

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {errors.project && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-700">{errors.project}</p>
            </div>
          )}

          {/* Phase Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phase Name *
              </label>
              <select
                value={phaseName}
                onChange={(e) => {
                  setPhaseName(e.target.value);
                  if (errors.phaseName) {
                    setErrors({ ...errors, phaseName: '' });
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.phaseName ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a phase</option>
                {PHASE_OPTIONS.map(phase => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </select>
              {errors.phaseName && (
                <p className="text-red-600 text-sm mt-1">{errors.phaseName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phase Weight (%) *
              </label>
              <input
                type="number"
                value={phaseWeight}
                onChange={(e) => {
                  setPhaseWeight(parseInt(e.target.value) || 0);
                  if (errors.phaseWeight) {
                    setErrors({ ...errors, phaseWeight: '' });
                  }
                }}
                min="1"
                max="100"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                  errors.phaseWeight ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phaseWeight && (
                <p className="text-red-600 text-sm mt-1">{errors.phaseWeight}</p>
              )}
            </div>
          </div>

          {/* Milestones Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Milestones</h3>
              <div className="text-sm text-gray-600">
                Weight Sum: <span className={milestoneWeightSum > 100 ? 'text-red-600 font-bold' : 'font-semibold'}>{milestoneWeightSum}%</span>
              </div>
            </div>

            {errors.milestones_sum && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-red-700 text-sm">{errors.milestones_sum}</p>
              </div>
            )}

            {milestones.map((milestone, milestoneIdx) => (
              <div key={milestoneIdx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
                {/* Milestone Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">Milestone {milestoneIdx + 1}</h4>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(milestoneIdx)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Milestone Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={milestone.milestoneName}
                      onChange={(e) => handleMilestoneChange(milestoneIdx, 'milestoneName', e.target.value)}
                      placeholder="e.g., Design Phase Kickoff"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                        errors[`milestone_${milestoneIdx}_name`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`milestone_${milestoneIdx}_name`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`milestone_${milestoneIdx}_name`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Weight (%) *
                    </label>
                    <input
                      type="number"
                      value={milestone.milestoneWeight}
                      onChange={(e) => handleMilestoneChange(milestoneIdx, 'milestoneWeight', parseInt(e.target.value) || 0)}
                      min="0"
                      max="100"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm ${
                        errors[`milestone_${milestoneIdx}_weight`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`milestone_${milestoneIdx}_weight`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`milestone_${milestoneIdx}_weight`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={milestone.startDate}
                      onChange={(e) => handleMilestoneChange(milestoneIdx, 'startDate', e.target.value)}
                      min={projectData ? formatDateForInput(projectData.createdDate) : undefined}
                      max={projectData ? formatDateForInput(projectData.endDate) : undefined}
                      disabled={!projectData}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors[`milestone_${milestoneIdx}_start`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`milestone_${milestoneIdx}_start`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`milestone_${milestoneIdx}_start`]}</p>
                    )}
                    {!projectData && (
                      <p className="text-gray-500 text-xs mt-1">Loading project timeline...</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={milestone.endDate}
                      onChange={(e) => handleMilestoneChange(milestoneIdx, 'endDate', e.target.value)}
                      min={projectData ? formatDateForInput(projectData.createdDate) : undefined}
                      max={projectData ? formatDateForInput(projectData.endDate) : undefined}
                      disabled={!projectData}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors[`milestone_${milestoneIdx}_end`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`milestone_${milestoneIdx}_end`] && (
                      <p className="text-red-600 text-xs mt-1">{errors[`milestone_${milestoneIdx}_end`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Revised End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={milestone.revisedEndDate || ''}
                      onChange={(e) => handleMilestoneChange(milestoneIdx, 'revisedEndDate', e.target.value)}
                      min={milestone.endDate || (projectData ? formatDateForInput(projectData.createdDate) : undefined)}
                      max={projectData ? formatDateForInput(projectData.endDate) : undefined}
                      disabled={!projectData}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    <p className="text-gray-500 text-xs mt-1">For tracking timeline adjustments</p>
                  </div>
                </div>

                {errors[`milestone_${milestoneIdx}_dates`] && (
                  <p className="text-red-600 text-sm">{errors[`milestone_${milestoneIdx}_dates`]}</p>
                )}

                {/* Activities */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-gray-800 text-sm">Activities</h5>
                    <div className="text-xs text-gray-600">
                      Sum: <span className={milestone.activities.reduce((s, a) => s + (a.activityWeight || 0), 0) > 100 ? 'text-red-600 font-bold' : 'font-semibold'}>{milestone.activities.reduce((s, a) => s + (a.activityWeight || 0), 0)}%</span>
                    </div>
                  </div>

                  {errors[`milestone_${milestoneIdx}_activities_sum`] && (
                    <p className="text-red-600 text-xs">{errors[`milestone_${milestoneIdx}_activities_sum`]}</p>
                  )}

                  {milestone.activities.map((activity, actIdx) => (
                    <div key={actIdx} className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">Activity {actIdx + 1}</span>
                        {milestone.activities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveActivity(milestoneIdx, actIdx)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={activity.activityName}
                            onChange={(e) => handleActivityChange(milestoneIdx, actIdx, 'activityName', e.target.value)}
                            placeholder="Activity name"
                            className={`w-full px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                              errors[`activity_${milestoneIdx}_${actIdx}_name`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`activity_${milestoneIdx}_${actIdx}_name`] && (
                            <p className="text-red-600 text-xs mt-0.5">{errors[`activity_${milestoneIdx}_${actIdx}_name`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Weight (%) *
                          </label>
                          <input
                            type="number"
                            value={activity.activityWeight}
                            onChange={(e) => handleActivityChange(milestoneIdx, actIdx, 'activityWeight', parseInt(e.target.value) || 0)}
                            min="0"
                            max="100"
                            className={`w-full px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                              errors[`activity_${milestoneIdx}_${actIdx}_weight`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`activity_${milestoneIdx}_${actIdx}_weight`] && (
                            <p className="text-red-600 text-xs mt-0.5">{errors[`activity_${milestoneIdx}_${actIdx}_weight`]}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={activity.startDate}
                            onChange={(e) => handleActivityChange(milestoneIdx, actIdx, 'startDate', e.target.value)}
                            min={milestone.startDate ? formatDateForInput(milestone.startDate) : undefined}
                            max={milestone.endDate ? formatDateForInput(milestone.endDate) : undefined}
                            disabled={!milestone.startDate || !milestone.endDate}
                            className={`w-full px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                              errors[`activity_${milestoneIdx}_${actIdx}_start`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`activity_${milestoneIdx}_${actIdx}_start`] && (
                            <p className="text-red-600 text-xs mt-0.5">{errors[`activity_${milestoneIdx}_${actIdx}_start`]}</p>
                          )}
                          {(!milestone.startDate || !milestone.endDate) && (
                            <p className="text-gray-500 text-xs mt-0.5">Set milestone dates first</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            End Date *
                          </label>
                          <input
                            type="date"
                            value={activity.endDate}
                            onChange={(e) => handleActivityChange(milestoneIdx, actIdx, 'endDate', e.target.value)}
                            min={milestone.startDate ? formatDateForInput(milestone.startDate) : undefined}
                            max={milestone.endDate ? formatDateForInput(milestone.endDate) : undefined}
                            disabled={!milestone.startDate || !milestone.endDate}
                            className={`w-full px-2 py-1 border rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${
                              errors[`activity_${milestoneIdx}_${actIdx}_end`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`activity_${milestoneIdx}_${actIdx}_end`] && (
                            <p className="text-red-600 text-xs mt-0.5">{errors[`activity_${milestoneIdx}_${actIdx}_end`]}</p>
                          )}
                          {(!milestone.startDate || !milestone.endDate) && (
                            <p className="text-gray-500 text-xs mt-0.5">Set milestone dates first</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Revised End Date (Optional)
                          </label>
                          <input
                            type="date"
                            value={activity.revisedEndDate || ''}
                            onChange={(e) => handleActivityChange(milestoneIdx, actIdx, 'revisedEndDate', e.target.value)}
                            min={activity.endDate || (milestone.startDate ? formatDateForInput(milestone.startDate) : undefined)}
                            max={milestone.endDate ? formatDateForInput(milestone.endDate) : undefined}
                            disabled={!milestone.startDate || !milestone.endDate}
                            className="w-full px-2 py-1 border border-yellow-300 rounded text-xs focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          />
                          <p className="text-gray-500 text-xs mt-0.5">For tracking timeline adjustments</p>
                        </div>
                      </div>

                      {errors[`activity_${milestoneIdx}_${actIdx}_dates`] && (
                        <p className="text-red-600 text-xs">{errors[`activity_${milestoneIdx}_${actIdx}_dates`]}</p>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Description (Optional)
                        </label>
                        <textarea
                          value={activity.description || ''}
                          onChange={(e) => handleActivityChange(milestoneIdx, actIdx, 'description', e.target.value)}
                          placeholder="Brief description"
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddActivity(milestoneIdx)}
                    className="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Activity
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddMilestone}
              className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Milestone
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium disabled:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Phase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

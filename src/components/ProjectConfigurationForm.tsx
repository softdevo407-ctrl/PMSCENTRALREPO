import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown } from 'lucide-react';
import { PhaseConfigurationService, PhaseOption, MilestoneOption, ActivityOption, MilestoneEntry, ActivityEntry, PhaseConfiguration } from '../services/phaseConfigurationService';

interface ProjectConfigurationFormProps {
  onConfigurationChange: (config: PhaseConfiguration[]) => void;
}

export const ProjectConfigurationForm: React.FC<ProjectConfigurationFormProps> = ({ onConfigurationChange }) => {
  const [phaseOptions, setPhaseOptions] = useState<PhaseOption[]>([]);
  const [milestoneOptions, setMilestoneOptions] = useState<MilestoneOption[]>([]);
  const [activityOptions, setActivityOptions] = useState<ActivityOption[]>([]);
  const [configurations, setConfigurations] = useState<PhaseConfiguration[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string>('');
  const [selectedMilestone, setSelectedMilestone] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [milestoneStartDate, setMilestoneStartDate] = useState<string>('');
  const [milestoneEndDate, setMilestoneEndDate] = useState<string>('');
  const [activityStartDate, setActivityStartDate] = useState<string>('');
  const [activityEndDate, setActivityEndDate] = useState<string>('');
  const [activitySortOrder, setActivitySortOrder] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all options on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        const [phases, milestones, activities] = await Promise.all([
          PhaseConfigurationService.getAllPhaseOptions(),
          PhaseConfigurationService.getAllMilestoneOptions(),
          PhaseConfigurationService.getAllActivityOptions()
        ]);
        
        setPhaseOptions(phases);
        setMilestoneOptions(milestones);
        setActivityOptions(activities);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load options';
        setError(errorMsg);
        console.error('Error loading options:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  // Notify parent of changes
  useEffect(() => {
    onConfigurationChange(configurations);
  }, [configurations, onConfigurationChange]);

  const getPhaseName = (code: string) => phaseOptions.find(p => p.code === code)?.fullName || code;
  const getMilestoneName = (code: string) => milestoneOptions.find(m => m.code === code)?.fullName || code;
  const getActivityName = (code: string) => activityOptions.find(a => a.code === code)?.fullName || code;

  const calculateMonths = (startDate: string, endDate: string): number => {
    return PhaseConfigurationService.calculateMonths(startDate, endDate);
  };

  const handleAddMilestone = () => {
    if (!selectedPhase || !selectedMilestone || !milestoneStartDate || !milestoneEndDate) {
      alert('Please select phase, milestone, and dates');
      return;
    }

    const months = calculateMonths(milestoneStartDate, milestoneEndDate);

    const newMilestoneEntry: MilestoneEntry = {
      id: Math.random().toString(),
      milestoneCode: selectedMilestone,
      milestoneName: getMilestoneName(selectedMilestone),
      startDate: milestoneStartDate,
      endDate: milestoneEndDate,
      months,
      activities: []
    };

    // Check if phase already exists in configurations
    const existingPhaseIndex = configurations.findIndex(c => c.phaseCode === selectedPhase);

    if (existingPhaseIndex >= 0) {
      // Add milestone to existing phase
      const updated = [...configurations];
      updated[existingPhaseIndex].milestones.push(newMilestoneEntry);
      setConfigurations(updated);
    } else {
      // Create new phase with milestone
      const newPhase: PhaseConfiguration = {
        phaseCode: selectedPhase,
        phaseName: getPhaseName(selectedPhase),
        sortOrder: configurations.length + 1,
        milestones: [newMilestoneEntry]
      };
      setConfigurations([...configurations, newPhase]);
    }

    // Reset milestone form
    setSelectedMilestone('');
    setMilestoneStartDate('');
    setMilestoneEndDate('');
  };

  const handleAddActivity = (phaseIndex: number, milestoneIndex: number) => {
    if (!selectedActivity || !activityStartDate || !activityEndDate) {
      alert('Please select activity and dates');
      return;
    }

    const months = calculateMonths(activityStartDate, activityEndDate);

    const newActivityEntry: ActivityEntry = {
      id: Math.random().toString(),
      activityCode: selectedActivity,
      activityName: getActivityName(selectedActivity),
      startDate: activityStartDate,
      endDate: activityEndDate,
      months,
      sortOrder: activitySortOrder
    };

    const updated = [...configurations];
    updated[phaseIndex].milestones[milestoneIndex].activities.push(newActivityEntry);
    setConfigurations(updated);

    // Reset activity form
    setSelectedActivity('');
    setActivityStartDate('');
    setActivityEndDate('');
    setActivitySortOrder(1);
  };

  const handleDeleteMilestone = (phaseIndex: number, milestoneIndex: number) => {
    const updated = [...configurations];
    updated[phaseIndex].milestones.splice(milestoneIndex, 1);

    // If no milestones left, remove phase
    if (updated[phaseIndex].milestones.length === 0) {
      updated.splice(phaseIndex, 1);
    }

    setConfigurations(updated);
  };

  const handleDeleteActivity = (phaseIndex: number, milestoneIndex: number, activityIndex: number) => {
    const updated = [...configurations];
    updated[phaseIndex].milestones[milestoneIndex].activities.splice(activityIndex, 1);
    setConfigurations(updated);
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-600">Loading options...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Phase Selection Section */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Select Phase & Add Milestone</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phase</label>
            <select
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select a Phase...</option>
              {phaseOptions.map(phase => (
                <option key={phase.code} value={phase.code}>
                  {phase.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Milestone</label>
            <select
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select a Milestone...</option>
              {milestoneOptions.map(milestone => (
                <option key={milestone.code} value={milestone.code}>
                  {milestone.fullName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={milestoneStartDate}
              onChange={(e) => setMilestoneStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={milestoneEndDate}
              onChange={(e) => setMilestoneEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Months</label>
            <input
              type="number"
              value={calculateMonths(milestoneStartDate, milestoneEndDate)}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 font-semibold"
            />
          </div>
        </div>

        <button
          onClick={handleAddMilestone}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Milestone
        </button>
      </div>

      {/* Configuration Display */}
      <div className="space-y-4">
        {configurations.map((phase, phaseIndex) => (
          <div key={phase.phaseCode} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Phase Header */}
            <div className="bg-slate-100 px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-bold text-gray-900">{phase.phaseName}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {phase.milestones.length} milestone{phase.milestones.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Milestones */}
            <div className="divide-y">
              {phase.milestones.map((milestone, milestoneIndex) => (
                <div key={milestone.id} className="p-6 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900">{milestone.milestoneName}</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {milestone.startDate} to {milestone.endDate} ({milestone.months} months)
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMilestone(phaseIndex, milestoneIndex)}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Activities for this Milestone */}
                  {milestone.activities.length > 0 && (
                    <div className="mb-4 space-y-2 bg-white rounded-lg p-4 border border-gray-200">
                      {milestone.activities.map((activity, activityIndex) => (
                        <div key={activity.id} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">{activity.activityName}</p>
                            <p className="text-gray-600">
                              {activity.startDate} to {activity.endDate} ({activity.months} months) • Order: {activity.sortOrder}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteActivity(phaseIndex, milestoneIndex, activityIndex)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Activity Form */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Add Activity</p>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div>
                        <select
                          value={selectedActivity}
                          onChange={(e) => setSelectedActivity(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option value="">Activity...</option>
                          {activityOptions.map(activity => (
                            <option key={activity.code} value={activity.code}>
                              {activity.fullName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <input
                          type="date"
                          value={activityStartDate}
                          onChange={(e) => setActivityStartDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <input
                          type="date"
                          value={activityEndDate}
                          onChange={(e) => setActivityEndDate(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          value={activitySortOrder}
                          onChange={(e) => setActivitySortOrder(parseInt(e.target.value) || 1)}
                          placeholder="Order"
                          min="1"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        onClick={() => handleAddActivity(phaseIndex, milestoneIndex)}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {configurations.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">No phases added yet. Select a phase and milestone to get started.</p>
        </div>
      )}
    </div>
  );
};

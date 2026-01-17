import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Calendar,
  AlertCircle,
  Search,
  X,
} from 'lucide-react';
import {
  ProjectMilestoneService,
  ProjectMilestone,
} from '../services/projectMilestoneService';
import {
  ProjectActivityService,
  ProjectActivity,
} from '../services/projectActivityService';

interface PhaseData {
  projectPhaseCode?: string;
  projectPhaseFullName: string;
  projectPhaseShortName?: string;
}

interface MilestoneRow {
  id: string;
  milestoneCode: string;
  milestoneName: string;
  startDate: string;
  endDate: string;
  months: number;
  activities: ActivityRow[];
  isExpanded: boolean;
}

interface ActivityRow {
  id: string;
  activityCode: string;
  activityName: string;
  startDate: string;
  endDate: string;
  months: number;
}

interface PhaseRow {
  id: string;
  phaseCode: string;
  phaseName: string;
  milestones: MilestoneRow[];
  isExpanded: boolean;
}

interface ProjectConfigurationHierarchyProps {
  projectName: string;
}

export const ProjectConfigurationHierarchy: React.FC<
  ProjectConfigurationHierarchyProps
> = ({ projectName }) => {
  const [phases, setPhases] = useState<PhaseData[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [phaseRows, setPhaseRows] = useState<PhaseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search states
  const [phaseSearch, setPhaseSearch] = useState('');
  const [milestoneSearch, setMilestoneSearch] = useState('');
  const [activitySearch, setActivitySearch] = useState('');

  // Selection states
  const [selectedPhaseForAdd, setSelectedPhaseForAdd] = useState<PhaseData | null>(null);
  const [selectedMilestoneForAdd, setSelectedMilestoneForAdd] = useState<ProjectMilestone | null>(null);
  const [selectedActivityForAdd, setSelectedActivityForAdd] = useState<ProjectActivity | null>(null);
  const [selectedPhaseRowForMilestone, setSelectedPhaseRowForMilestone] = useState<string | null>(null);
  const [selectedMilestoneRowForActivity, setSelectedMilestoneRowForActivity] = useState<string | null>(null);

  // Date states
  const [milestoneStartDate, setMilestoneStartDate] = useState('');
  const [milestoneEndDate, setMilestoneEndDate] = useState('');
  const [activityStartDate, setActivityStartDate] = useState('');
  const [activityEndDate, setActivityEndDate] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch phases
      const phasesResponse = await fetch('http://localhost:7080/api/project-phases-generic', {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        },
      });
      if (phasesResponse.ok) {
        const phasesData = await phasesResponse.json();
        setPhases(Array.isArray(phasesData) ? phasesData : []);
      }

      // Fetch milestones
      const milestonesData = await ProjectMilestoneService.getAllMilestones();
      setMilestones(milestonesData);

      // Fetch activities
      const activitiesData = await ProjectActivityService.getAllProjectActivities();
      setActivities(activitiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonths = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(0, months);
  };

  // Filtered dropdowns with search
  const filteredPhases = useMemo(
    () =>
      phases.filter((p) =>
        p.projectPhaseFullName.toLowerCase().includes(phaseSearch.toLowerCase())
      ),
    [phases, phaseSearch]
  );

  const filteredMilestones = useMemo(
    () =>
      milestones.filter((m) =>
        m.projectMilestoneFullName.toLowerCase().includes(milestoneSearch.toLowerCase())
      ),
    [milestones, milestoneSearch]
  );

  const filteredActivities = useMemo(
    () =>
      activities.filter((a) =>
        a.projectActivityFullName.toLowerCase().includes(activitySearch.toLowerCase())
      ),
    [activities, activitySearch]
  );

  const handleAddPhase = () => {
    if (!selectedPhaseForAdd) {
      setError('Please select a phase');
      return;
    }

    const newPhaseRow: PhaseRow = {
      id: Date.now().toString(),
      phaseCode: selectedPhaseForAdd.projectPhaseCode || '',
      phaseName: selectedPhaseForAdd.projectPhaseFullName,
      milestones: [],
      isExpanded: true,
    };

    setPhaseRows([...phaseRows, newPhaseRow]);
    setSelectedPhaseForAdd(null);
    setPhaseSearch('');
    setError(null);
  };

  const handleAddMilestone = (phaseRowId: string) => {
    if (!selectedMilestoneForAdd || !milestoneStartDate || !milestoneEndDate) {
      setError('Please select milestone and enter dates');
      return;
    }

    if (new Date(milestoneStartDate) > new Date(milestoneEndDate)) {
      setError('Start date cannot be after end date');
      return;
    }

    const months = calculateMonths(milestoneStartDate, milestoneEndDate);

    const newMilestoneRow: MilestoneRow = {
      id: Date.now().toString(),
      milestoneCode: selectedMilestoneForAdd.projectMilestoneCode,
      milestoneName: selectedMilestoneForAdd.projectMilestoneFullName,
      startDate: milestoneStartDate,
      endDate: milestoneEndDate,
      months,
      activities: [],
      isExpanded: true,
    };

    setPhaseRows(
      phaseRows.map((p) =>
        p.id === phaseRowId
          ? { ...p, milestones: [...p.milestones, newMilestoneRow] }
          : p
      )
    );

    setSelectedMilestoneForAdd(null);
    setMilestoneStartDate('');
    setMilestoneEndDate('');
    setMilestoneSearch('');
    setSelectedPhaseRowForMilestone(null);
    setError(null);
  };

  const handleAddActivity = (phaseRowId: string, milestoneRowId: string) => {
    if (!selectedActivityForAdd || !activityStartDate || !activityEndDate) {
      setError('Please select activity and enter dates');
      return;
    }

    if (new Date(activityStartDate) > new Date(activityEndDate)) {
      setError('Start date cannot be after end date');
      return;
    }

    const months = calculateMonths(activityStartDate, activityEndDate);

    const newActivityRow: ActivityRow = {
      id: Date.now().toString(),
      activityCode: selectedActivityForAdd.projectActivityCode,
      activityName: selectedActivityForAdd.projectActivityFullName,
      startDate: activityStartDate,
      endDate: activityEndDate,
      months,
    };

    setPhaseRows(
      phaseRows.map((p) =>
        p.id === phaseRowId
          ? {
              ...p,
              milestones: p.milestones.map((m) =>
                m.id === milestoneRowId
                  ? { ...m, activities: [...m.activities, newActivityRow] }
                  : m
              ),
            }
          : p
      )
    );

    setSelectedActivityForAdd(null);
    setActivityStartDate('');
    setActivityEndDate('');
    setActivitySearch('');
    setSelectedMilestoneRowForActivity(null);
    setError(null);
  };

  const handleDeletePhase = (phaseRowId: string) => {
    setPhaseRows(phaseRows.filter((p) => p.id !== phaseRowId));
    setError(null);
  };

  const handleDeleteMilestone = (phaseRowId: string, milestoneRowId: string) => {
    setPhaseRows(
      phaseRows.map((p) =>
        p.id === phaseRowId
          ? { ...p, milestones: p.milestones.filter((m) => m.id !== milestoneRowId) }
          : p
      )
    );
    setError(null);
  };

  const handleDeleteActivity = (phaseRowId: string, milestoneRowId: string, activityRowId: string) => {
    setPhaseRows(
      phaseRows.map((p) =>
        p.id === phaseRowId
          ? {
              ...p,
              milestones: p.milestones.map((m) =>
                m.id === milestoneRowId
                  ? { ...m, activities: m.activities.filter((a) => a.id !== activityRowId) }
                  : m
              ),
            }
          : p
      )
    );
    setError(null);
  };

  const togglePhaseExpanded = (phaseRowId: string) => {
    setPhaseRows(
      phaseRows.map((p) =>
        p.id === phaseRowId ? { ...p, isExpanded: !p.isExpanded } : p
      )
    );
  };

  const toggleMilestoneExpanded = (phaseRowId: string, milestoneRowId: string) => {
    setPhaseRows(
      phaseRows.map((p) =>
        p.id === phaseRowId
          ? {
              ...p,
              milestones: p.milestones.map((m) =>
                m.id === milestoneRowId ? { ...m, isExpanded: !m.isExpanded } : m
              ),
            }
          : p
      )
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <p className="text-center text-gray-500">Loading configuration options...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-800 text-white p-6">
        <h2 className="text-2xl font-bold">{projectName}</h2>
        <p className="text-violet-100 mt-1">Hierarchical Phase → Milestone → Activity Configuration</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Add Phase Section */}
        <div className="mb-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
          <h3 className="text-lg font-bold text-violet-900 mb-4">Add New Phase</h3>
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search phases..."
                  value={phaseSearch}
                  onChange={(e) => setPhaseSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              {phaseSearch && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-violet-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {filteredPhases.map((phase) => (
                    <button
                      key={phase.projectPhaseCode}
                      onClick={() => {
                        setSelectedPhaseForAdd(phase);
                        setPhaseSearch('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-violet-100 transition-colors border-b border-violet-100 last:border-b-0"
                    >
                      {phase.projectPhaseFullName}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedPhaseForAdd && (
              <div className="flex items-center gap-2 px-3 py-2 bg-violet-100 rounded-lg border border-violet-300">
                <span className="text-violet-900 font-semibold">{selectedPhaseForAdd.projectPhaseFullName}</span>
                <button
                  onClick={() => setSelectedPhaseForAdd(null)}
                  className="text-violet-600 hover:text-violet-800"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <button
              onClick={handleAddPhase}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Plus size={18} /> Add Phase
            </button>
          </div>
        </div>

        {/* Phase Rows */}
        <div className="space-y-4">
          {phaseRows.length > 0 ? (
            phaseRows.map((phaseRow) => (
              <div key={phaseRow.id} className="border border-violet-200 rounded-lg overflow-hidden">
                {/* Phase Header */}
                <div className="bg-violet-50 p-4 flex items-center justify-between hover:bg-violet-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePhaseExpanded(phaseRow.id)}
                      className="text-violet-600 hover:text-violet-800"
                    >
                      {phaseRow.isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <div>
                      <h4 className="text-lg font-bold text-violet-900">{phaseRow.phaseName}</h4>
                      <p className="text-sm text-violet-600">
                        {phaseRow.milestones.length} milestone{phaseRow.milestones.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePhase(phaseRow.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Phase Content */}
                {phaseRow.isExpanded && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* Add Milestone Section */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-bold text-blue-900 mb-3">Add Milestone to {phaseRow.phaseName}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Search milestones..."
                            value={
                              selectedPhaseRowForMilestone === phaseRow.id ? milestoneSearch : ''
                            }
                            onChange={(e) => {
                              setSelectedPhaseRowForMilestone(phaseRow.id);
                              setMilestoneSearch(e.target.value);
                            }}
                            onFocus={() => setSelectedPhaseRowForMilestone(phaseRow.id)}
                            className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          {selectedPhaseRowForMilestone === phaseRow.id && milestoneSearch && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-300 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                              {filteredMilestones.map((m) => (
                                <button
                                  key={m.projectMilestoneCode}
                                  onClick={() => {
                                    setSelectedMilestoneForAdd(m);
                                    setMilestoneSearch('');
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-blue-100 transition-colors border-b border-blue-100 last:border-b-0 text-sm"
                                >
                                  {m.projectMilestoneFullName}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div>
                          <input
                            type="date"
                            value={milestoneStartDate}
                            onChange={(e) => setMilestoneStartDate(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Start Date"
                          />
                        </div>
                        <div>
                          <input
                            type="date"
                            value={milestoneEndDate}
                            onChange={(e) => setMilestoneEndDate(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="End Date"
                          />
                        </div>
                        <div className="flex items-center px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-semibold text-blue-900">
                          {calculateMonths(milestoneStartDate, milestoneEndDate)} months
                        </div>
                        <button
                          onClick={() => handleAddMilestone(phaseRow.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors text-sm"
                        >
                          <Plus size={16} /> Add
                        </button>
                      </div>
                    </div>

                    {/* Milestone Rows */}
                    {phaseRow.milestones.length > 0 ? (
                      <div className="space-y-3 mt-4">
                        {phaseRow.milestones.map((milestoneRow) => (
                          <div
                            key={milestoneRow.id}
                            className="border border-blue-200 rounded-lg overflow-hidden"
                          >
                            {/* Milestone Header */}
                            <div className="bg-blue-50 p-3 flex items-center justify-between hover:bg-blue-100 transition-colors">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleMilestoneExpanded(phaseRow.id, milestoneRow.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  {milestoneRow.isExpanded ? (
                                    <ChevronDown size={18} />
                                  ) : (
                                    <ChevronRight size={18} />
                                  )}
                                </button>
                                <div>
                                  <h6 className="font-bold text-blue-900">{milestoneRow.milestoneName}</h6>
                                  <p className="text-xs text-blue-600">
                                    <Calendar className="inline mr-1" size={12} />
                                    {milestoneRow.months} months | {new Date(milestoneRow.startDate).toLocaleDateString()} -{' '}
                                    {new Date(milestoneRow.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteMilestone(phaseRow.id, milestoneRow.id)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Milestone Content */}
                            {milestoneRow.isExpanded && (
                              <div className="p-3 space-y-3 bg-white">
                                {/* Add Activity Section */}
                                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                  <h6 className="font-bold text-emerald-900 mb-2 text-sm">Add Activity</h6>
                                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                                    <div className="relative">
                                      <Search className="absolute left-3 top-2 text-gray-400" size={16} />
                                      <input
                                        type="text"
                                        placeholder="Search activities..."
                                        value={
                                          selectedMilestoneRowForActivity === milestoneRow.id ? activitySearch : ''
                                        }
                                        onChange={(e) => {
                                          setSelectedMilestoneRowForActivity(milestoneRow.id);
                                          setActivitySearch(e.target.value);
                                        }}
                                        onFocus={() => setSelectedMilestoneRowForActivity(milestoneRow.id)}
                                        className="w-full pl-9 pr-2 py-1.5 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs"
                                      />
                                      {selectedMilestoneRowForActivity === milestoneRow.id && activitySearch && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-emerald-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                                          {filteredActivities.map((a) => (
                                            <button
                                              key={a.projectActivityCode}
                                              onClick={() => {
                                                setSelectedActivityForAdd(a);
                                                setActivitySearch('');
                                              }}
                                              className="w-full text-left px-3 py-1.5 hover:bg-emerald-100 transition-colors border-b border-emerald-100 last:border-b-0 text-xs"
                                            >
                                              {a.projectActivityFullName}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <input
                                        type="date"
                                        value={activityStartDate}
                                        onChange={(e) => setActivityStartDate(e.target.value)}
                                        className="w-full px-2 py-1.5 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs"
                                      />
                                    </div>
                                    <div>
                                      <input
                                        type="date"
                                        value={activityEndDate}
                                        onChange={(e) => setActivityEndDate(e.target.value)}
                                        className="w-full px-2 py-1.5 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs"
                                      />
                                    </div>
                                    <div className="flex items-center px-2 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900">
                                      {calculateMonths(activityStartDate, activityEndDate)} mo
                                    </div>
                                    <button
                                      onClick={() => handleAddActivity(phaseRow.id, milestoneRow.id)}
                                      className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors text-xs"
                                    >
                                      <Plus size={14} /> Add
                                    </button>
                                  </div>
                                </div>

                                {/* Activity Rows */}
                                {milestoneRow.activities.length > 0 && (
                                  <div className="space-y-2 mt-3">
                                    {milestoneRow.activities.map((activityRow) => (
                                      <div
                                        key={activityRow.id}
                                        className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between"
                                      >
                                        <div>
                                          <p className="font-semibold text-emerald-900 text-sm">{activityRow.activityName}</p>
                                          <p className="text-xs text-emerald-600">
                                            {activityRow.months} months | {new Date(activityRow.startDate).toLocaleDateString()} -{' '}
                                            {new Date(activityRow.endDate).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() =>
                                            handleDeleteActivity(phaseRow.id, milestoneRow.id, activityRow.id)
                                          }
                                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4 text-sm">No milestones added yet</p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No phases configured yet. Add one above to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          <span className="font-bold text-violet-600">{phaseRows.length}</span> phases
          {phaseRows.length > 0 && (
            <>
              {' • '}
              <span className="font-bold text-blue-600">
                {phaseRows.reduce((sum, p) => sum + p.milestones.length, 0)}
              </span>{' '}
              milestones
              {' • '}
              <span className="font-bold text-emerald-600">
                {phaseRows.reduce((sum, p) => sum + p.milestones.reduce((ms, m) => ms + m.activities.length, 0), 0)}
              </span>{' '}
              activities
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectConfigurationHierarchy;

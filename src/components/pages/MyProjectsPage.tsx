import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Calendar, Plus, Filter, Loader2, Edit, Zap, X, Code, Layers, TrendingDown, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { projectDetailService, ProjectDetailResponse } from '../../services/projectDetailService';
import { projectStatusCodeService } from '../../services/projectStatusCodeService';
import { projectTypeService } from '../../services/projectTypeService';
import { ProgrammeTypeService } from '../../services/programmeTypeService';
import { ProjectCategoryService } from '../../services/projectCategoryService';
import { ProjectPhaseGenericService } from '../../services/projectPhaseGenericService';
import { ProjectMilestoneService } from '../../services/projectMilestoneService';
import { ProjectActivityService } from '../../services/projectActivityService';
import { ProjectScheduleService } from '../../services/projectScheduleService';
import { AddPhaseModal } from '../AddPhaseModal';
import { ProjectPhasesPanel } from '../ProjectPhasesPanel';
import { AddProjectDefinitionModal } from '../AddProjectDefinitionModal';
import { StatusUpdationModal } from '../StatusUpdationModal';
import ProjectMatrix from '../ProjectConfigurationMatrix';
import CoreUISearchableSelect from '../CoreUISearchableSelect';
import type { ProjectPhase, Activity, ActivityFormData } from '../ProjectConfigurationMatrix';

interface MyProjectsPageProps {
  userName: string;
  selectedCategory?: string;
  onCollapseSidebar?: () => void;
}

interface StatusMap {
  [key: string]: string;
}

interface TypeMap {
  [key: string]: string;
}

interface CategoryMap {
  [key: string]: string;
}

export const MyProjectsPage: React.FC<MyProjectsPageProps> = ({ userName, selectedCategory, onCollapseSidebar }) => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>(selectedCategory || 'all');
  const [myProjects, setMyProjects] = useState<ProjectDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isStatusUpdationModalOpen, setIsStatusUpdationModalOpen] = useState(false);
  const [isConfigurationPanelOpen, setIsConfigurationPanelOpen] = useState(false);
  const [phasesRefreshKey, setPhasesRefreshKey] = useState(0);
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [editingProjectCode, setEditingProjectCode] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [typeMap, setTypeMap] = useState<TypeMap>({});
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({});
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);
  const [phaseOptions, setPhaseOptions] = useState<any[]>([]);
  const [milestoneOptions, setMilestoneOptions] = useState<any[]>([]);
  const [activityOptions, setActivityOptions] = useState<any[]>([]);
  const [isPhaseSelectionOpen, setIsPhaseSelectionOpen] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [isMilestoneConfigOpen, setIsMilestoneConfigOpen] = useState(false);
  const [selectedPhaseForMilestone, setSelectedPhaseForMilestone] = useState<string>('');
  const [milestonesToAdd, setMilestonesToAdd] = useState<Array<{ code: string; title: string; startDate: string; endDate: string; months: number }>>([]);
  const [milestoneForm, setMilestoneForm] = useState({ milestoneCode: '', startDate: '', endDate: '' });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isActivityEditOpen, setIsActivityEditOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<{ phaseId: string; milestoneId: string; activityId: string } | null>(null);
  const [editActivityForm, setEditActivityForm] = useState<ActivityFormData>({ title: '', startDate: '', endDate: '', sortOrder: 0 });
  const [phaseNameMap, setPhaseNameMap] = useState<{ [key: string]: string }>({});
  const [milestoneNameMap, setMilestoneNameMap] = useState<{ [key: string]: string }>({});
  const [activityNameMap, setActivityNameMap] = useState<{ [key: string]: string }>({});
  const [configSearchTerm, setConfigSearchTerm] = useState<string>('');

  // Fetch projects for current user
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch projects where current user is project director or programme director
        let myProjectsData: ProjectDetailResponse[] = [];
        
        if (user?.employeeCode) {
          console.log('Fetching projects for director:', user.employeeCode);
          myProjectsData = await projectDetailService.getProjectDetailsByDirector(user.employeeCode);
        } else {
          console.log('No employee code, trying getMyProjects');
          myProjectsData = await projectDetailService.getMyProjects();
        }
        
        setMyProjects(myProjectsData || []);
        
        // Fetch all status codes and build map
        const allStatusCodes = await projectStatusCodeService.getAllProjectStatusCodes();
        const newStatusMap: StatusMap = {};
        allStatusCodes.forEach(status => {
          newStatusMap[status.projectStatusCode] = status.projectStatusFullName;
        });
        setStatusMap(newStatusMap);
        
        // Fetch all project types and build map
        const allProjectTypes = await projectTypeService.getAllProjectTypes();
        const newTypeMap: TypeMap = {};
        allProjectTypes.forEach(type => {
          newTypeMap[type.projectTypesCode] = type.projectTypesFullName;
        });
        setTypeMap(newTypeMap);
        
        // Fetch all project categories and build map
        const allProjectCategories = await ProjectCategoryService.getAllProjectCategories();
        const newCategoryMap: CategoryMap = {};
        allProjectCategories.forEach(category => {
          newCategoryMap[category.projectCategoryCode] = category.projectCategoryFullName;
        });
        setCategoryMap(newCategoryMap);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch projects';
        setError(errorMsg);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id, user?.employeeCode]);

  // Load existing project schedule data when configuration panel opens
  useEffect(() => {
    const loadProjectSchedules = async () => {
      if (!isConfigurationPanelOpen || !selectedProject) {
        setPhases([]);
        return;
      }

      try {
        setConfigLoading(true);
        setConfigError(null);
        
        // Load API options first to build name maps
        const [phases, milestones, activities] = await Promise.all([
          ProjectPhaseGenericService.getAllPhases(),
          ProjectMilestoneService.getAllMilestones(),
          ProjectActivityService.getAllProjectActivities()
        ]);
        
        // Build name maps
        const phaseMap: { [key: string]: string } = {};
        const milestoneMap: { [key: string]: string } = {};
        const activityMap: { [key: string]: string } = {};
        
        phases.forEach(p => {
          phaseMap[p.projectPhaseCode] = p.projectPhaseFullName;
        });
        
        milestones.forEach(m => {
          milestoneMap[m.projectMilestoneCode] = m.projectMilestoneFullName;
        });
        
        activities.forEach(a => {
          activityMap[a.projectActivityCode] = a.projectActivityFullName;
        });
        
        setPhaseNameMap(phaseMap);
        setMilestoneNameMap(milestoneMap);
        setActivityNameMap(activityMap);
        
        // Fetch existing schedules from database
        const schedules = await ProjectScheduleService.getSchedulesByProjectCode(selectedProject);
        console.log('schedules loaded:', schedules);
        if (!schedules || schedules.length === 0) {
          setPhases([]);
          return;
        }

        // Parse schedules into phases/milestones/activities structure
        const phasesMap = new Map<string, ProjectPhase>();
        
        schedules.forEach(schedule => {
          const scheduleCode = schedule.id.scheduleCode;
          const missionProjectCode = schedule.id.missionProjectCode;
          
          // Determine the hierarchy level
          if (schedule.scheduleLevel === 1) {
            // Phase level
            if (!phasesMap.has(scheduleCode)) {
              phasesMap.set(scheduleCode, {
                id: scheduleCode,
                name: phaseMap[scheduleCode] || scheduleCode, // Use name from API map
                milestones: [],
                sortOrder: schedule.hierarchyOrder || 1
              });
            }
          } else if (schedule.scheduleLevel === 2) {
            // Milestone level
            const phaseCode = schedule.scheduleParentCode || '';
            if (!phasesMap.has(phaseCode)) {
              phasesMap.set(phaseCode, {
                id: phaseCode,
                name: phaseMap[phaseCode] || phaseCode,
                milestones: [],
                sortOrder: 1
              });
            }
            
            const phase = phasesMap.get(phaseCode)!;
            if (!phase.milestones.find(m => m.id === scheduleCode)) {
              phase.milestones.push({
                id: scheduleCode,
                code: scheduleCode,
                title: milestoneMap[scheduleCode] || scheduleCode, // Use name from API map
                startDate: schedule.scheduleStartDate || '',
                endDate: schedule.scheduleEndDate || '',
                months: 0,
                sortOrder: schedule.hierarchyOrder || 1,
                activities: []
              });
            }
          } else if (schedule.scheduleLevel === 3) {
            // Activity level
            const parentCode = schedule.scheduleParentCode || '';
            
            // Find phase that contains this milestone
            let foundPhase: ProjectPhase | null = null;
            let foundMilestone: any = null;
            
            for (const phase of phasesMap.values()) {
              const milestone = phase.milestones.find(m => m.code === parentCode);
              if (milestone) {
                foundPhase = phase;
                foundMilestone = milestone;
                break;
              }
            }
            
            // If phase doesn't exist, create it
            if (!foundPhase) {
              foundPhase = {
                id: `PHASE-${parentCode}`,
                name: `PHASE-${parentCode}`,
                milestones: [],
                sortOrder: 1
              };
              phasesMap.set(foundPhase.id, foundPhase);
            }
            
            // If milestone doesn't exist, create it
            if (!foundMilestone) {
              foundMilestone = {
                id: parentCode,
                code: parentCode,
                title: milestoneMap[parentCode] || parentCode,
                startDate: '',
                endDate: '',
                months: 0,
                sortOrder: 1,
                activities: []
              };
              foundPhase.milestones.push(foundMilestone);
            }
            
            // Add activity to milestone
            if (!foundMilestone.activities.find((a: Activity) => a.id === scheduleCode)) {
              foundMilestone.activities.push({
                id: scheduleCode,
                title: activityMap[scheduleCode] || scheduleCode, // Use name from API map
                startDate: schedule.scheduleStartDate || '',
                endDate: schedule.scheduleEndDate || '',
                sortOrder: schedule.hierarchyOrder || 1
              });
            }
          }
        });

        // Convert map to array and sort
        const loadedPhases = Array.from(phasesMap.values())
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        
        setPhases(loadedPhases);
      } catch (error) {
        console.error('Error loading project schedules:', error);
        setConfigError('Failed to load project configuration');
        setPhases([]);
      } finally {
        setConfigLoading(false);
      }
    };

    loadProjectSchedules();
  }, [isConfigurationPanelOpen, selectedProject]);

  const filteredProjects = myProjects.filter(p => {
    const matchStatus = filterStatus === 'all' || p.currentStatus === filterStatus;
    const matchType = filterType === 'all' || p.projectTypesCode === filterType;
    const matchCategory = filterCategory === 'all' || p.projectCategoryCode === filterCategory;
    return matchStatus && matchType && matchCategory;
  });

  // Determine if project is delayed using schedule date
  const isProjectDelayed = (project: ProjectDetailResponse) => {
    try {
      // If timeOverrunApproval = 'YES' and revisedCompletionDate exists, use that instead
      const scheduleToCheck = project.timeOverrunApproval === 'YES' && project.revisedCompletionDate 
        ? project.revisedCompletionDate 
        : project.originalSchedule;
      
      if (scheduleToCheck) {
        const sched = new Date(scheduleToCheck);
        if (!isNaN(sched.getTime())) {
          const now = new Date();
          return sched.getTime() < now.getTime();
        }
      }
    } catch (e) {
      // ignore parse errors and fall back
    }

    // fallback: if durationInMonths > 0 treat as delayed (legacy behavior)
    return (project.durationInMonths || 0) > 0;
  };

  const totalBudget = myProjects.reduce((sum, p) => {
    return sum + (p.sanctionedCost || 0);
  }, 0);
  
  const statusCounts = {
    onTrack: myProjects.filter(p => !isProjectDelayed(p)).length,
    atRisk: 0,
    delayed: myProjects.filter(p => isProjectDelayed(p)).length,
  };

  const selectedProjectData = myProjects.find(p => p.missionProjectCode === selectedProject);

  const budgetBreakup = selectedProjectData ? {
    planning: (selectedProjectData.sanctionedCost || 0) * 0.15,
    development: (selectedProjectData.sanctionedCost || 0) * 0.45,
    testing: (selectedProjectData.sanctionedCost || 0) * 0.25,
    deployment: (selectedProjectData.sanctionedCost || 0) * 0.15
  } : null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ON_TRACK': return 'bg-green-100 text-green-700';
      case 'AT_RISK': return 'bg-orange-100 text-orange-700';
      case 'DELAYED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700';
      case 'ON_HOLD': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string | undefined) => {
    const labels: Record<string, string> = {
      'ON_TRACK': 'On Track',
      'AT_RISK': 'At Risk',
      'DELAYED': 'Delayed',
      'COMPLETED': 'Completed',
      'ON_HOLD': 'On Hold'
    };
    return status ? labels[status] || status : 'Unknown';
  };

  // Phase Management Handlers
  const handleDeletePhase = (phaseId: string) => {
    setPhases(phases.filter(p => p.id !== phaseId));
  };

  const handleUpdatePhase = (phaseId: string, updates: Partial<ProjectPhase>) => {
    setPhases(phases.map(p => 
      p.id === phaseId 
        ? { ...p, ...updates }
        : p
    ));
  };

  const handleAddActivity = async (phaseId: string, milestoneId: string, activityData: ActivityFormData) => {
    try {
      // Update local state
      const newActivityId = Math.random().toString();
      setPhases(phases.map(p =>
        p.id === phaseId
          ? {
              ...p,
              milestones: p.milestones.map(m =>
                m.id === milestoneId
                  ? {
                      ...m,
                      activities: [...(m.activities || []), {
                        id: newActivityId,
                        title: activityData.title,
                        startDate: activityData.startDate,
                        endDate: activityData.endDate,
                        sortOrder: activityData.sortOrder
                      }]
                    }
                  : m
              )
            }
          : p
      ));
      
      // Save to backend ProjectSchedule table
      if (selectedProject) {
        let milestoneCode = '';
        let phaseData = phases.find(p => p.id === phaseId);
        if (phaseData) {
          let foundMilestone = phaseData.milestones.find(m => m.id === milestoneId);
          if (foundMilestone) {
            milestoneCode = foundMilestone.code;
          }
        }
        
        // Generate activity schedule code (SA001, SA002, etc.)
        const activityCode = `SA${String(activityData.sortOrder).padStart(3, '0')}`;
        
        const projectSchedule = {
          id: {
            missionProjectCode: selectedProject,
            scheduleCode: activityCode
          },
          scheduleLevel: 3, // Activity level
          scheduleParentCode: milestoneCode,
          scheduleStartDate: activityData.startDate,
          scheduleEndDate: activityData.endDate,
          hierarchyOrder: activityData.sortOrder,
          userId: user?.employeeCode || 'SYSTEM',
          regStatus: 'R'
        };
        
        await ProjectScheduleService.saveProjectSchedule(projectSchedule);
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Activity added locally but failed to save to database. Please retry.');
    }
  };

  const handleDeleteActivity = (phaseId: string, milestoneId: string, activityId: string) => {
    setPhases(phases.map(p =>
      p.id === phaseId
        ? {
            ...p,
            milestones: p.milestones.map(m =>
              m.id === milestoneId
                ? {
                    ...m,
                    activities: (m.activities || []).filter(a => a.id !== activityId)
                  }
                : m
            )
          }
        : p
    ));
  };

  const handleUpdateActivitySort = async (phaseId: string, milestoneId: string, activityId: string, sortOrder: number) => {
    try {
      // Update local state
      setPhases(phases.map(p =>
        p.id === phaseId
          ? {
              ...p,
              milestones: p.milestones.map(m =>
                m.id === milestoneId
                  ? {
                      ...m,
                      activities: (m.activities || []).map(a =>
                        a.id === activityId
                          ? { ...a, sortOrder }
                          : a
                      )
                    }
                  : m
              )
            }
          : p
      ));
      
      // Save to backend ProjectSchedule table with new sort order
      if (selectedProject) {
        let milestoneCode = '';
        let phaseData = phases.find(p => p.id === phaseId);
        if (phaseData) {
          let foundMilestone = phaseData.milestones.find(m => m.id === milestoneId);
          if (foundMilestone) {
            milestoneCode = foundMilestone.code;
            let foundActivity = foundMilestone.activities?.find(a => a.id === activityId);
            if (foundActivity) {
              const activityCode = `SA${String(sortOrder).padStart(3, '0')}`;
              
              const projectSchedule = {
                id: {
                  missionProjectCode: selectedProject,
                  scheduleCode: activityCode
                },
                scheduleLevel: 3,
                scheduleParentCode: milestoneCode,
                scheduleStartDate: foundActivity.startDate,
                scheduleEndDate: foundActivity.endDate,
                hierarchyOrder: sortOrder,
                userId: user?.employeeCode || 'SYSTEM',
                regStatus: 'R'
              };
              
              await ProjectScheduleService.updateProjectSchedule(projectSchedule);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating activity sort order:', error);
    }
  };

  const handleUpdateMilestoneSort = (phaseId: string, milestoneId: string, sortOrder: number) => {
    setPhases(phases.map(p =>
      p.id === phaseId
        ? {
            ...p,
            milestones: p.milestones.map(m =>
              m.id === milestoneId
                ? { ...m, sortOrder }
                : m
            )
          }
        : p
    ));
  };

  const handleDeleteMilestone = (phaseId: string, milestoneId: string) => {
    setPhases(phases.map(p =>
      p.id === phaseId
        ? {
            ...p,
            milestones: p.milestones.filter(m => m.id !== milestoneId)
          }
        : p
    ));
  };

  const handleEditActivityOpen = (phaseId: string, milestoneId: string, activity: Activity) => {
    setEditingActivity({ phaseId, milestoneId, activityId: activity.id });
    setEditActivityForm({
      title: activity.title,
      startDate: activity.startDate,
      endDate: activity.endDate,
      sortOrder: activity.sortOrder
    });
    setIsActivityEditOpen(true);
  };

  const handleUpdateActivity = async () => {
    if (!editingActivity || !editActivityForm.title || !selectedProject) return;
    
    try {
      // First, update the local state
      setPhases(phases.map(p =>
        p.id === editingActivity.phaseId
          ? {
              ...p,
              milestones: p.milestones.map(m =>
                m.id === editingActivity.milestoneId
                  ? {
                      ...m,
                      activities: (m.activities || []).map(a =>
                        a.id === editingActivity.activityId
                          ? {
                              ...a,
                              title: editActivityForm.title,
                              startDate: editActivityForm.startDate,
                              endDate: editActivityForm.endDate,
                              sortOrder: editActivityForm.sortOrder
                            }
                          : a
                      )
                    }
                  : m
              )
            }
          : p
      ));
      
      // Then, save to backend ProjectSchedule table
      const projectData = myProjects.find(p => p.missionProjectCode === selectedProject);
      if (projectData) {
        // Find the milestone to get its code
        let milestoneCode = '';
        let phaseData = phases.find(p => p.id === editingActivity.phaseId);
        if (phaseData) {
          let foundMilestone = phaseData.milestones.find(m => m.id === editingActivity.milestoneId);
          if (foundMilestone) {
            milestoneCode = foundMilestone.code; // Use the milestone's actual code (SM001, SM002, etc.)
          }
        }
        
        // Generate activity schedule code (SA001, SA002, etc.) based on activity position
        const activityCountInMilestone = phaseData?.milestones
          .find(m => m.id === editingActivity.milestoneId)?.activities?.length || 0;
        const activityCode = `SA${String(editActivityForm.sortOrder).padStart(3, '0')}`;
        
        const projectSchedule = {
          id: {
            missionProjectCode: selectedProject,
            scheduleCode: activityCode
          },
          scheduleLevel: 3, // Activity level
          scheduleParentCode: milestoneCode, // Use actual milestone code
          scheduleStartDate: editActivityForm.startDate,
          scheduleEndDate: editActivityForm.endDate,
          hierarchyOrder: editActivityForm.sortOrder,
          userId: user?.employeeCode || 'SYSTEM',
          regStatus: 'R' // Changed to 'R' to match your data
        };
        
        await ProjectScheduleService.saveProjectSchedule(projectSchedule);
      }
      
      setIsActivityEditOpen(false);
      setEditingActivity(null);
      setEditActivityForm({ title: '', startDate: '', endDate: '', sortOrder: 0 });
    } catch (error) {
      console.error('Error updating activity:', error);
      alert('Failed to save activity. Please try again.');
    }
  };

  // Load API options
  const loadApiOptions = async () => {
    try {
      setOptionsLoading(true);
      const [phases, milestones, activities] = await Promise.all([
        ProjectPhaseGenericService.getAllPhases(),
        ProjectMilestoneService.getAllMilestones(),
        ProjectActivityService.getAllProjectActivities()
      ]);
      
      setPhaseOptions(phases);
      setMilestoneOptions(milestones);
      setActivityOptions(activities);
    } catch (error) {
      console.error('Error loading API options:', error);
    } finally {
      setOptionsLoading(false);
    }
  };

  // Open phase selection modal and load options
  const handleAddNewPhase = () => {
    loadApiOptions();
    setIsPhaseSelectionOpen(true);
  };

  // Handle phase selection - open milestone modal
  const handlePhaseSelected = (phaseCode: string) => {
    const selectedPhase = phaseOptions.find(p => p.projectPhaseCode === phaseCode);
    
    if (selectedPhase) {
      setSelectedPhaseForMilestone(phaseCode);
      setMilestonesToAdd([]);
      setMilestoneForm({ milestoneCode: '', startDate: '', endDate: '' });
      setValidationErrors([]);
      setIsPhaseSelectionOpen(false);
      setIsMilestoneConfigOpen(true);
    }
  };

  // Calculate months between dates
  const calculateMonths = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(0, Math.round(months));
  };

  // Validate milestone data with industry standards
  const validateMilestone = (milestone: typeof milestoneForm, existingMilestones: typeof milestonesToAdd): string[] => {
    const errors: string[] = [];
    
    // Basic field validation
    if (!milestone.milestoneCode || !milestone.milestoneCode.trim()) {
      errors.push('Milestone is required');
    }
    
    if (!milestone.startDate) {
      errors.push('Start date is required');
    }
    
    if (!milestone.endDate) {
      errors.push('End date is required');
    }
    
    // Date validation
    if (milestone.startDate && milestone.endDate) {
      const startDate = new Date(milestone.startDate);
      const endDate = new Date(milestone.endDate);
      
      // End date must be after start date
      if (endDate <= startDate) {
        errors.push('End date must be after start date');
      }
      
      // Minimum duration: 1 month (industry standard)
      const months = calculateMonths(milestone.startDate, milestone.endDate);
      if (months < 1) {
        errors.push('Minimum milestone duration is 1 month');
      }
      
      // Maximum duration: 48 months (4 years - industry standard for phase milestones)
      if (months > 48) {
        errors.push('Milestone duration should not exceed 48 months (4 years)');
      }
      
      // Check for overlapping milestones (industry standard)
      for (const existing of existingMilestones) {
        const existingStart = new Date(existing.startDate);
        const existingEnd = new Date(existing.endDate);
        
        // Overlapping condition: new start is before existing end AND new end is after existing start
        if (startDate < existingEnd && endDate > existingStart) {
          errors.push(`Milestone overlaps with existing milestone (${existing.code}) from ${existing.startDate} to ${existing.endDate}`);
          break;
        }
      }
    }
    
    return errors;
  };

  // Add milestone to temporary list (not to phase yet)
  const handleAddMilestoneToModal = () => {
    const currentPhase = phases.find(p => p.id === selectedPhaseForMilestone);
    const existingMilestones = currentPhase?.milestones || [];
    const errors = validateMilestone(milestoneForm, existingMilestones);
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    const selectedMilestone = milestoneOptions.find(m => m.projectMilestoneCode === milestoneForm.milestoneCode);
    
    if (selectedMilestone) {
      const months = calculateMonths(milestoneForm.startDate, milestoneForm.endDate);
      
      const newMilestone = {
        id: `${selectedPhaseForMilestone}-milestone-${Date.now()}`,
        code: milestoneForm.milestoneCode,
        title: selectedMilestone.projectMilestoneFullName,
        startDate: milestoneForm.startDate,
        endDate: milestoneForm.endDate,
        months: months,
        sortOrder: 1,
        activities: []
      };
      
      // If phase doesn't exist yet (first milestone), create phase
      if (!currentPhase) {
        const selectedPhase = phaseOptions.find(p => p.projectPhaseCode === selectedPhaseForMilestone);
        if (selectedPhase) {
          const newPhase: ProjectPhase = {
            id: selectedPhaseForMilestone,
            name: selectedPhase.projectPhaseFullName,
            milestones: [newMilestone],
            sortOrder: phases.length + 1
          };
          setPhases([...phases, newPhase]);
        }
      } else {
        // Add milestone to existing phase
        setPhases(phases.map(p => {
          if (p.id === selectedPhaseForMilestone) {
            return {
              ...p,
              milestones: [...p.milestones, newMilestone]
            };
          }
          return p;
        }));
      }
      
      // Close modal and reset form
      setIsMilestoneConfigOpen(false);
      setSelectedPhaseForMilestone('');
      setMilestoneForm({ milestoneCode: '', startDate: '', endDate: '' });
      setValidationErrors([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all your assigned satellite projects</p>
        </div>
        <button 
          onClick={() => {
            setEditingProjectCode(null);
            setIsAddProjectModalOpen(true);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Portfolio Overview Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{myProjects.length}</p>
          <p className="text-xs text-gray-500 mt-2">Active assignments</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-green-600 uppercase tracking-wide font-semibold">On Track</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.onTrack}</p>
          <p className="text-xs text-gray-500 mt-2">Performing well</p>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-orange-600 uppercase tracking-wide font-semibold">Delayed</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{statusCounts.delayed}</p>
          <p className="text-xs text-gray-500 mt-2">Needs attention</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-blue-600 uppercase tracking-wide font-semibold">Total Budget</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{totalBudget.toFixed(2)}Cr</p>
          <p className="text-xs text-gray-500 mt-2">Portfolio-wide</p>
        </div>
      </div> */}

      <div className="grid grid-cols-1 gap-6">
        {/* Projects List - Full Width */}
        <div>
          {/* Filters */}
          {/* <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-gray-500" />
              <CoreUISearchableSelect
                label=""
                placeholder="Select Status..."
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'ON_TRACK', label: 'On Track' },
                  { value: 'AT_RISK', label: 'At Risk' },
                  { value: 'DELAYED', label: 'Delayed' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'ON_HOLD', label: 'On Hold' }
                ]}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value as string)}
              />
              <CoreUISearchableSelect
                label=""
                placeholder="Select Programme Type..."
                options={[
                  { value: 'all', label: 'All Programme Types' },
                  ...Array.from(new Set(myProjects.map(p => p.projectTypesCode).filter(Boolean))).map(type => ({
                    value: type,
                    label: typeMap[type] || type
                  }))
                ]}
                value={filterType}
                onChange={(value) => setFilterType(value as string)}
              />
              <CoreUISearchableSelect
                label=""
                placeholder="Select Category..."
                options={[
                  { value: 'all', label: 'All Categories' },
                  ...Array.from(new Set(myProjects.map(p => p.projectCategoryCode).filter(Boolean))).map(category => ({
                    value: category,
                    label: categoryMap[category] || category
                  }))
                ]}
                value={filterCategory}
                onChange={(value) => setFilterCategory(value as string)}
              />
            </div>
          </div> */}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map(project => (
              <div
                key={project.missionProjectCode}
                onClick={() => setSelectedProject(project.missionProjectCode)}
                className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedProject === project.missionProjectCode
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.budgetCode} - {project.missionProjectFullName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{typeMap[project.projectTypesCode] || project.projectTypesCode}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.currentStatus)}`}>
                    {statusMap[project.currentStatus] || getStatusLabel(project.currentStatus)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">Sanctioned Cost</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">₹{project.sanctionedCost}Cr</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">Expenditure Till Date</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">₹{project.cumExpUpToPrevFy}Cr</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">Current Year Exp</p>
                    </div>
                    <p className="text-lg font-bold text-orange-600">₹{project.curYrExp}Cr</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">
                        {project.costOverrunApproval === 'YES' ? 'Revised Sanctioned Cost' : 'Sanctioned Date'}
                      </p>
                      {project.costOverrunApproval === 'YES' && (
                        <AlertCircle className="w-3 h-3 text-red-600" title="Cost overrun approved" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {project.costOverrunApproval === 'YES' && project.revisedSanctionedCost 
                        ? `₹${project.revisedSanctionedCost}Cr` 
                        : (project.dateOffs ? new Date(project.dateOffs).toLocaleDateString() : '-')}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">
                        {project.timeOverrunApproval === 'YES' ? 'Revised Schedule' : 'Schedule'}
                      </p>
                      {project.timeOverrunApproval === 'YES' && (
                        <AlertCircle className="w-3 h-3 text-red-600" title="Time overrun approved" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {project.timeOverrunApproval === 'YES' && project.revisedCompletionDate 
                        ? new Date(project.revisedCompletionDate).toLocaleDateString() 
                        : (project.originalSchedule ? new Date(project.originalSchedule).toLocaleDateString() : '-')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProjectCode(project.missionProjectCode);
                      setIsAddProjectModalOpen(true);
                    }}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project.missionProjectCode);
                      setIsConfigurationPanelOpen(true);
                      setConfigSearchTerm(''); // Reset search
                      if (onCollapseSidebar) {
                        onCollapseSidebar();
                      }
                      // Auto-scroll to configuration panel after a brief delay
                      setTimeout(() => {
                        const configPanel = document.getElementById('project-configuration-panel');
                        if (configPanel) {
                          configPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    className="flex-1 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Code className="w-4 h-4" />
                    Configure
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project.missionProjectCode);
                      setIsStatusUpdationModalOpen(true);
                    }}
                    className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Zap className="w-4 h-4" />
                    Status Update
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No projects match the selected filter</p>
            </div>
          )}
        </div>

        {/* Project Configuration Matrix - Below Grid */}
        {isConfigurationPanelOpen && selectedProjectData && (
          <div id="project-configuration-panel" className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden relative shadow-lg">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Project Configuration</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedProjectData.missionProjectFullName}</p>
                </div>
                <button
                  onClick={() => {
                    setIsConfigurationPanelOpen(false);
                    setConfigSearchTerm('');
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Close configuration"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search and Add Phase */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search phases, milestones, activities..."
                    value={configSearchTerm}
                    onChange={(e) => setConfigSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <button
                  onClick={() => {
                    handleAddNewPhase();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Phase
                </button>
              </div>
            </div>

            {/* Phase Selection Modal - Now uses Dropdown */}
            {isPhaseSelectionOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
                  <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Select Phase</h3>
                    <button
                      onClick={() => setIsPhaseSelectionOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    {optionsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                        <p className="text-gray-600">Loading phases...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <CoreUISearchableSelect
                          label="Select a Phase"
                          placeholder="Search and select a phase..."
                          options={phaseOptions
                            .filter(p => !phases.some(phase => phase.name === p.projectPhaseFullName))
                            .map(phase => ({
                              value: phase.projectPhaseCode,
                              label: phase.projectPhaseFullName
                            }))}
                          value={null}
                          onChange={(value) => {
                            if (value) {
                              handlePhaseSelected(value as string);
                            }
                          }}
                        />
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Already Added Phases:</h4>
                          <div className="space-y-2">
                            {phases.map(p => (
                              <div key={p.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-700">{p.name}</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Added</span>
                              </div>
                            ))}
                            {phases.length === 0 && (
                              <p className="text-sm text-gray-500 italic">No phases added yet</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setIsPhaseSelectionOpen(false)}
                          className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Milestone Configuration Modal */}
            {isMilestoneConfigOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
                  <div className="border-b border-gray-200 p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Add Milestone</h3>
                      <p className="text-sm text-gray-500 mt-1">Configure milestone details for {phaseOptions.find(p => p.projectPhaseCode === selectedPhaseForMilestone)?.projectPhaseFullName}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsMilestoneConfigOpen(false);
                        setSelectedPhaseForMilestone('');
                        setMilestoneForm({ milestoneCode: '', startDate: '', endDate: '' });
                        setValidationErrors([]);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-900 mb-2">Validation Errors</h4>
                            <ul className="space-y-1">
                              {validationErrors.map((error, idx) => (
                                <li key={idx} className="text-sm text-red-700">• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Milestone Form */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-blue-50">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Milestone</label>
                          <CoreUISearchableSelect
                            label=""
                            placeholder="Search and select a milestone..."
                            options={milestoneOptions.map(milestone => ({
                              value: milestone.projectMilestoneCode,
                              label: milestone.projectMilestoneFullName
                            }))}
                            value={milestoneForm.milestoneCode || null}
                            onChange={(value) => setMilestoneForm({ ...milestoneForm, milestoneCode: (value as string) || '' })}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                            <input
                              type="date"
                              value={milestoneForm.startDate}
                              onChange={(e) => setMilestoneForm({ ...milestoneForm, startDate: e.target.value })}
                              min={selectedProjectData?.dateOffs}
                              max={selectedProjectData?.originalSchedule}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              title={`Valid range: ${selectedProjectData?.dateOffs} to ${selectedProjectData?.originalSchedule}`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                            <input
                              type="date"
                              value={milestoneForm.endDate}
                              onChange={(e) => setMilestoneForm({ ...milestoneForm, endDate: e.target.value })}
                              min={selectedProjectData?.dateOffs}
                              max={selectedProjectData?.originalSchedule}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              title={`Valid range: ${selectedProjectData?.dateOffs} to ${selectedProjectData?.originalSchedule}`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Months)</label>
                            <input
                              type="number"
                              value={calculateMonths(milestoneForm.startDate, milestoneForm.endDate)}
                              disabled
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddMilestoneToModal}
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Milestone
                      </button>
                      <button
                        onClick={() => {
                          setIsMilestoneConfigOpen(false);
                          setSelectedPhaseForMilestone('');
                          setMilestoneForm({ milestoneCode: '', startDate: '', endDate: '' });
                          setValidationErrors([]);
                        }}
                        className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {configError && (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900">Error Loading Configuration</h4>
                  <p className="text-sm text-red-700 mt-1">{configError}</p>
                </div>
              </div>
            )}

            {configLoading ? (
              <div className="flex items-center justify-center py-12 p-6">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-gray-600">Loading configuration data...</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[calc(100vh-400px)]">
                <ProjectMatrix
                  phases={phases}
                  onEditPhase={handleUpdatePhase}
                  onDeletePhase={handleDeletePhase}
                  onAddActivity={handleAddActivity}
                  onDeleteActivity={handleDeleteActivity}
                  onUpdateActivitySort={handleUpdateActivitySort}
                  onUpdateMilestoneSort={handleUpdateMilestoneSort}
                  onDeleteMilestone={handleDeleteMilestone}
                  onEditActivity={handleEditActivityOpen}
                  milestoneOptions={milestoneOptions}
                  activityOptions={activityOptions}
                  projectStartDate={selectedProjectData?.dateOffs}
                  projectEndDate={selectedProjectData?.originalSchedule}
                  onAddMilestoneClick={(phaseId) => {
                    setSelectedPhaseForMilestone(phaseId);
                    setMilestoneForm({ milestoneCode: '', startDate: '', endDate: '' });
                    setValidationErrors([]);
                    setIsMilestoneConfigOpen(true);
                  }}
                  searchTerm={configSearchTerm}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Phase Modal */}
      <AddPhaseModal
        projectId={selectedProject ? parseInt(selectedProject) : 0}
        phaseId={editingPhaseId || undefined}
        isOpen={isAddPhaseModalOpen}
        onClose={() => {
          setIsAddPhaseModalOpen(false);
          setEditingPhaseId(null);
        }}
        onSuccess={() => {
          // Refresh phases by incrementing the refresh key
          setPhasesRefreshKey(prev => prev + 1);
          // Clear edit state
          setEditingPhaseId(null);
          // Refetch projects
          projectDetailService.getAllProjectDetails()
            .then(projects => setMyProjects(projects || []))
            .catch(err => console.error('Failed to refetch projects:', err));
        }}
      />

      {/* Add/Edit Project Definition Modal */}
      <AddProjectDefinitionModal
        isOpen={isAddProjectModalOpen}
        projectCode={editingProjectCode || undefined}
        onClose={() => {
          setIsAddProjectModalOpen(false);
          setEditingProjectCode(null);
        }}
        onSuccess={() => {
          // Refetch project definitions
          projectDetailService.getAllProjectDetails()
            .then(projects => setMyProjects(projects || []))
            .catch(err => console.error('Failed to refetch projects:', err));
        }}
      />
      {/* Status Updation Modal */}
      {selectedProject && selectedProjectData && (
        <StatusUpdationModal
          isOpen={isStatusUpdationModalOpen}
          projectId={parseInt(selectedProject) || 0}
          onClose={() => setIsStatusUpdationModalOpen(false)}
          onSuccess={() => {
            // Refresh phases
            setPhasesRefreshKey(prev => prev + 1);
            // Refetch projects
            projectDetailService.getAllProjectDetails()
              .then(projects => setMyProjects(projects || []))
              .catch(err => console.error('Failed to refetch projects:', err));
          }}
        />
      )}

      {/* Edit Activity Modal */}
      {isActivityEditOpen && editingActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Edit Activity</h2>
              <button
                onClick={() => {
                  setIsActivityEditOpen(false);
                  setEditingActivity(null);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Activity Title
                </label>
                <CoreUISearchableSelect
                  label=""
                  placeholder="Search and select an activity..."
                  options={activityOptions.map(a => ({
                    value: a.projectActivityFullName,
                    label: a.projectActivityFullName
                  }))}
                  value={editActivityForm.title || null}
                  onChange={(value) => setEditActivityForm(prev => ({ ...prev, title: (value as string) || '' }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editActivityForm.startDate}
                    onChange={(e) => setEditActivityForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-2 text-sm transition-all outline-none font-medium text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={editActivityForm.endDate}
                    onChange={(e) => setEditActivityForm(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-2 text-sm transition-all outline-none font-medium text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Activity Order
                </label>
                <input
                  type="number"
                  value={editActivityForm.sortOrder}
                  onChange={(e) => setEditActivityForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-2 text-sm transition-all outline-none font-medium text-slate-700"
                  min="1"
                  placeholder="Enter order number"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsActivityEditOpen(false);
                  setEditingActivity(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateActivity}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors font-black uppercase text-[10px] tracking-widest"
              >
                Update Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

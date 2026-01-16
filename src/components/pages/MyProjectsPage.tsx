import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Calendar, Plus, Filter, Loader2, Edit, Zap, X, Code, Layers, TrendingDown, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { projectDetailService, ProjectDetailResponse } from '../../services/projectDetailService';
import { projectStatusCodeService } from '../../services/projectStatusCodeService';
import { projectTypeService } from '../../services/projectTypeService';
import { ProgrammeTypeService } from '../../services/programmeTypeService';
import { ProjectCategoryService } from '../../services/projectCategoryService';
import { AddPhaseModal } from '../AddPhaseModal';
import { ProjectPhasesPanel } from '../ProjectPhasesPanel';
import { AddProjectDefinitionModal } from '../AddProjectDefinitionModal';
import { StatusUpdationModal } from '../StatusUpdationModal';

interface MyProjectsPageProps {
  userName: string;
  selectedCategory?: string;
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

export const MyProjectsPage: React.FC<MyProjectsPageProps> = ({ userName, selectedCategory }) => {
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
  const [phasesRefreshKey, setPhasesRefreshKey] = useState(0);
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [editingProjectCode, setEditingProjectCode] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [typeMap, setTypeMap] = useState<TypeMap>({});
  const [categoryMap, setCategoryMap] = useState<CategoryMap>({});

  // Fetch projects for current user
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch projects where current user is project director or programme director
        const myProjectsData = await projectDetailService.getMyProjects();
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
        
        // Fetch all programme types to get category codes, then fetch categories
        const allProgrammeTypes = await ProgrammeTypeService.getAllProgrammeTypes();
        const newCategoryMap: CategoryMap = {};
        
        // Get unique category codes from programme types
        const uniqueCategoryCodes = Array.from(new Set(allProgrammeTypes.map(pt => pt.projectCategoryCode)));
        
        // Fetch each category and build map
        for (const categoryCode of uniqueCategoryCodes) {
          try {
            const category = await ProjectCategoryService.getProjectCategoryByCode(categoryCode);
            newCategoryMap[categoryCode] = category.projectCategoryFullName;
          } catch (err) {
            console.error(`Failed to fetch category ${categoryCode}:`, err);
          }
        }
        setCategoryMap(newCategoryMap);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch projects';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id]);

  const filteredProjects = myProjects.filter(p => {
    const matchStatus = filterStatus === 'all' || p.currentStatus === filterStatus;
    const matchType = filterType === 'all' || p.projectTypesCode === filterType;
    const matchCategory = filterCategory === 'all' || p.projectCategoryCode === filterCategory;
    return matchStatus && matchType && matchCategory;
  });

  const totalBudget = myProjects.reduce((sum, p) => {
    return sum + (p.sanctionedCost || 0);
  }, 0);
  
  const statusCounts = {
    onTrack: myProjects.filter(p => p.currentStatus === 'ON_TRACK').length,
    atRisk: myProjects.filter(p => p.currentStatus === 'AT_RISK').length,
    delayed: myProjects.filter(p => p.currentStatus === 'DELAYED').length,
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <p className="text-sm text-orange-600 uppercase tracking-wide font-semibold">At Risk</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{statusCounts.atRisk}</p>
          <p className="text-xs text-gray-500 mt-2">Needs attention</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-blue-600 uppercase tracking-wide font-semibold">Total Budget</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹{(totalBudget / 10000000).toFixed(1)}Cr</p>
          <p className="text-xs text-gray-500 mt-2">Portfolio-wide</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="ON_TRACK">On Track</option>
                <option value="AT_RISK">At Risk</option>
                <option value="DELAYED">Delayed</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Programme Types</option>
                {Array.from(new Set(myProjects.map(p => p.projectTypesCode))).map(type => (
                  <option key={type} value={type}>{typeMap[type] || type}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(myProjects.map(p => p.projectCategoryCode))).map(category => (
                  <option key={category} value={category}>{categoryMap[category] || category}</option>
                ))}
              </select>
            </div>
          </div>

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
                    <p className="text-lg font-bold text-gray-900">₹{project.sanctionedCost}L</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">Expenditure Till Date</p>
                    </div>
                    <p className="text-lg font-bold text-green-600">₹{project.cumExpUpToPrevFy}L</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">Current Year Exp</p>
                    </div>
                    <p className="text-lg font-bold text-orange-600">₹0L</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">Sanctioned Date</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{project.dateOffs ? new Date(project.dateOffs).toLocaleDateString() : '-'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-orange-600" />
                      <p className="text-xs text-gray-500 titlecase tracking-wide">Schedule</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{project.originalSchedule ? new Date(project.originalSchedule).toLocaleDateString() : '-'}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project.missionProjectCode);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
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

        {/* Details Sidebar */}
        <div className="space-y-4">
          {selectedProjectData ? (
            <>
              {/* Project Details */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Project Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Project Code</p>
                    <p className="font-mono text-gray-900 font-semibold">{selectedProjectData.missionProjectCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">{selectedProjectData.missionProjectFullName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Budget Code</p>
                    <p className="font-mono text-gray-900 font-semibold">{selectedProjectData.budgetCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900">{categoryMap[selectedProjectData.projectCategoryCode] || selectedProjectData.projectCategoryCode}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600">Sanctioned Cost</p>
                    <p className="text-xl font-bold text-blue-600">₹{selectedProjectData.sanctionedCost}L</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedProjectData.currentStatus)}`}>
                      {getStatusLabel(selectedProjectData.currentStatus)}
                    </span>
                  </div>
                </div>
              </div>

            

              {/* Project Phases */}
              <ProjectPhasesPanel 
                projectId={selectedProject ? parseInt(selectedProject) : 0} 
                isOpen={true}
                refreshKey={phasesRefreshKey}
                onEditPhase={(phaseId) => {
                  setEditingPhaseId(phaseId);
                  setIsAddPhaseModalOpen(true);
                }}
              />
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-sm">Select a project to view details</p>
            </div>
          )}

          {/* Action Buttons */}
          {selectedProjectData && (
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setEditingPhaseId(null);
                  setIsAddPhaseModalOpen(true);
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Phase
              </button>
              <button 
                onClick={() => setIsStatusUpdationModalOpen(true)}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Status Updation
              </button>
              <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Request Revision
              </button>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

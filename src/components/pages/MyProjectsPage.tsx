import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Calendar, Plus, Filter, Loader2, Edit, Zap, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { projectService, ProjectDefinitionResponse } from '../../services/projectService';
import { AddPhaseModal } from '../AddPhaseModal';
import { ProjectPhasesPanel } from '../ProjectPhasesPanel';
import { AddProjectModal } from '../AddProjectModal';
import { StatusUpdationModal } from '../StatusUpdationModal';

interface MyProjectsPageProps {
  userName: string;
}

export const MyProjectsPage: React.FC<MyProjectsPageProps> = ({ userName }) => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [myProjects, setMyProjects] = useState<ProjectDefinitionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isStatusUpdationModalOpen, setIsStatusUpdationModalOpen] = useState(false);
  const [phasesRefreshKey, setPhasesRefreshKey] = useState(0);
  const [editingPhaseId, setEditingPhaseId] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Fetch projects for current user
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const projects = await projectService.getProjectsByDirector(user.id);
        setMyProjects(projects);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch projects';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.id]);

  const filteredProjects = filterStatus === 'all' 
    ? myProjects 
    : myProjects.filter(p => p.status === filterStatus);

  const totalBudget = myProjects.reduce((sum, p) => sum + p.sanctionedAmount, 0);
  const statusCounts = {
    onTrack: myProjects.filter(p => p.status === 'ON_TRACK').length,
    atRisk: myProjects.filter(p => p.status === 'AT_RISK').length,
    delayed: myProjects.filter(p => p.status === 'DELAYED').length,
  };

  const selectedProjectData = myProjects.find(p => p.id === selectedProject);

  const budgetBreakup = selectedProjectData ? {
    planning: selectedProjectData.sanctionedAmount * 0.15,
    development: selectedProjectData.sanctionedAmount * 0.45,
    testing: selectedProjectData.sanctionedAmount * 0.25,
    deployment: selectedProjectData.sanctionedAmount * 0.15
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'ON_TRACK': 'On Track',
      'AT_RISK': 'At Risk',
      'DELAYED': 'Delayed',
      'COMPLETED': 'Completed',
      'ON_HOLD': 'On Hold'
    };
    return labels[status] || status;
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
            setEditingProjectId(null);
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
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Projects</option>
              <option value="ON_TRACK">On Track</option>
              <option value="AT_RISK">At Risk</option>
              <option value="DELAYED">Delayed</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-4">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedProject === project.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{project.projectName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.shortName} • {project.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Budget</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">₹{(project.sanctionedAmount / 10000000).toFixed(1)}Cr</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Programme</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">{project.programmeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project.id);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProjectId(project.id);
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
                    <p className="text-gray-600">Programme</p>
                    <p className="font-semibold text-gray-900">{selectedProjectData.programmeName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lead Centre</p>
                    <p className="font-semibold text-gray-900">{selectedProjectData.leadCentre}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Budget Code</p>
                    <p className="font-mono text-gray-900 font-semibold">{selectedProjectData.budgetCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900">{selectedProjectData.category}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600">Total Budget</p>
                    <p className="text-xl font-bold text-blue-600">₹{(selectedProjectData.sanctionedAmount / 10000000).toFixed(1)}Cr</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedProjectData.status)}`}>
                      {getStatusLabel(selectedProjectData.status)}
                    </span>
                  </div>
                </div>
              </div>

            

              {/* Project Phases */}
              <ProjectPhasesPanel 
                projectId={selectedProject || 0} 
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
            projectId={selectedProject || 0}
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
              // Optionally refetch projects too
              if (user?.id) {
                projectService.getProjectsByDirector(user.id)
                  .then(projects => setMyProjects(projects))
                  .catch(err => console.error('Failed to refetch projects:', err));
              }
            }}
          />

          {/* Add/Edit Project Modal */}
          <AddProjectModal
            isOpen={isAddProjectModalOpen}
            projectId={editingProjectId || undefined}
            onClose={() => {
              setIsAddProjectModalOpen(false);
              setEditingProjectId(null);
            }}
            onSuccess={() => {
              // Refetch projects
              if (user?.id) {
                projectService.getProjectsByDirector(user.id)
                  .then(projects => setMyProjects(projects))
                  .catch(err => console.error('Failed to refetch projects:', err));
              }
            }}
          />

          {/* Status Updation Modal */}
          {selectedProject && (
            <StatusUpdationModal
              isOpen={isStatusUpdationModalOpen}
              projectId={selectedProject}
              onClose={() => setIsStatusUpdationModalOpen(false)}
              onSuccess={() => {
                // Refresh phases
                setPhasesRefreshKey(prev => prev + 1);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

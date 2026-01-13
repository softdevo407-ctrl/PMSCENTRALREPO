import React, { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  ClipboardList,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectService, ProjectDefinitionResponse } from '../services/projectService';
import { SAMPLE_PROJECT_SCHEDULING, SAMPLE_REVISION_REQUESTS } from '../pbemData';
import CoreUIForm from './CoreUIForm';
import { CategoryStatsCards } from './CategoryStatsCards';

interface ProjectDirectorDashboardProps {
  userName: string;
  onNavigate: (page: string, category?: string) => void;
}

const ProjectDirectorDashboard: React.FC<ProjectDirectorDashboardProps> = ({ userName, onNavigate }) => {
  const { user } = useAuth();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [myProjects, setMyProjects] = useState<ProjectDefinitionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projects = await projectService.getProjectsByDirector(user!.id);
      setMyProjects(projects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const mySchedulings = SAMPLE_PROJECT_SCHEDULING.filter((s) => {
    return myProjects.some((p) => p.id === s.projectDefinitionId);
  });
  const myRevisions = SAMPLE_REVISION_REQUESTS.filter((r) => r.requestedBy === userName);

  const stats = {
    total: myProjects.length,
    onTrack: myProjects.filter((p) => p.status === 'ON_TRACK').length,
    atRisk: myProjects.filter((p) => p.status === 'AT_RISK').length,
    delayed: myProjects.filter((p) => p.status === 'DELAYED').length,
    pendingRevisions: myRevisions.filter((r) => r.status === 'PENDING').length,
  };

  const handleNewProject = async (data: Record<string, string>) => {
    try {
      setError(null);
      
      // Parse sanctioned amount to number
      const sanctionedAmount = parseFloat(data.sanctionedAmount) || 0;
      
      const projectData = {
        projectName: data.projectName,
        shortName: data.shortName,
        programmeName: data.programmeName,
        category: data.category,
        budgetCode: data.budgetCode,
        leadCentre: data.leadCentre,
        sanctionedAmount: sanctionedAmount * 1000000, // Convert to actual amount
        endDate: data.endDate,
      };

      await projectService.createProject(projectData, user?.token);
      
      setShowNewProjectForm(false);
      alert('Project created successfully!');
      
      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      alert(`Error creating project: ${errorMessage}`);
    }
  };

  const newProjectFields = [
    { name: 'projectName', label: 'Project Name', type: 'text' as const, placeholder: 'Enter project name', required: true },
    { name: 'shortName', label: 'Short Name', type: 'text' as const, placeholder: 'e.g., ALVD-2024', required: true },
    { name: 'programmeName', label: 'Programme Name', type: 'text' as const, placeholder: 'Enter programme name', required: true },
    { name: 'budgetCode', label: 'Budget Code', type: 'text' as const, placeholder: 'e.g., LV-2024-001', required: true },
    { name: 'leadCentre', label: 'Lead Centre', type: 'text' as const, placeholder: 'Enter lead centre', required: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Launch Vehicles', label: 'Launch Vehicles' },
        { value: 'Satellite Communication', label: 'Satellite Communication' },
        { value: 'Infrastructure', label: 'Infrastructure & R&D' },
      ],
    },
    { name: 'sanctionedAmount', label: 'Sanctioned Amount (₹)', type: 'number' as const, required: true },
    { name: 'endDate', label: 'End Date', type: 'date' as const, required: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header with CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-gray-600 mt-2">Manage your projects and track progress</p>
        </div>
     
      </div>

      {/* Category-wise Stats Cards */}
      <CategoryStatsCards onNavigate={onNavigate} />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold uppercase">Total Projects</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-semibold uppercase">On Track</p>
              <p className="text-4xl font-bold text-emerald-900 mt-2">{stats.onTrack}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-semibold uppercase">At Risk</p>
              <p className="text-4xl font-bold text-orange-900 mt-2">{stats.atRisk}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-orange-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-semibold uppercase">Delayed</p>
              <p className="text-4xl font-bold text-red-900 mt-2">{stats.delayed}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold uppercase">Pending Revisions</p>
              <p className="text-4xl font-bold text-purple-900 mt-2">{stats.pendingRevisions}</p>
            </div>
            <CheckSquare className="w-12 h-12 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Your Projects</h3>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading your projects...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border-t border-red-200">
            <p className="text-red-700 font-semibold">Error loading projects</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm"
            >
              Retry
            </button>
          </div>
        ) : myProjects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-4">No projects yet. Create your first project!</p>
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Project Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Budget</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">End Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myProjects.map((project) => {
                  const scheduling = mySchedulings.find((s) => s.projectDefinitionId === project.id);
                  const statusColor =
                    project.status === 'ON_TRACK'
                      ? 'bg-emerald-100 text-emerald-800'
                      : project.status === 'AT_RISK'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-red-100 text-red-800';

                  return (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{project.projectName}</p>
                        <p className="text-sm text-gray-500">{project.shortName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">₹{(project.sanctionedAmount / 1000000).toFixed(1)}M</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                              style={{ width: `${scheduling?.overallCompletionPercentage || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{scheduling?.overallCompletionPercentage || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(project.revisedEndDate || project.endDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onNavigate('my-projects')}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('scheduling')}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all text-left group"
        >
          <ClipboardList className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-gray-900 mb-1">Project Scheduling</h4>
          <p className="text-sm text-gray-600">Manage phases and milestones</p>
        </button>

        <button
          onClick={() => onNavigate('revisions')}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all text-left group"
        >
          <Calendar className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-gray-900 mb-1">Revision Requests</h4>
          <p className="text-sm text-gray-600">Request date extensions</p>
        </button>

        <button
          onClick={() => onNavigate('my-projects')}
          className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all text-left group"
        >
          <TrendingUp className="w-8 h-8 text-emerald-600 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-gray-900 mb-1">Track Progress</h4>
          <p className="text-sm text-gray-600">Monitor all your projects</p>
        </button>
      </div>

      {/* New Project Form Modal */}
      {showNewProjectForm && (
        <CoreUIForm
          title="Create New Project"
          description="Define a new project with budget and timeline"
          fields={newProjectFields}
          onSubmit={handleNewProject}
          onCancel={() => setShowNewProjectForm(false)}
          submitText="Create Project"
        />
      )}
    </div>
  );
};

export default ProjectDirectorDashboard;

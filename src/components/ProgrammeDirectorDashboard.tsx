import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectDetailService, ProjectDetailResponse } from '../services/projectDetailService';
import { CategoryStatsCards } from './CategoryStatsCards';

interface ProgrammeDirectorDashboardProps {
  userName: string;
  onNavigate: (page: string, projectCode?: string, additionalData?: any) => void;
}

const ProgrammeDirectorDashboard: React.FC<ProgrammeDirectorDashboardProps> = ({ userName, onNavigate }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all projects and filter by programme director
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allProjects = await projectDetailService.getAllProjectDetails();
        
        // Filter projects where current user is the programme director
        const programmeProjects = allProjects.filter(p => 
          p.programmeDirector === user?.employeeCode
        );
        
        setProjects(programmeProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    if (user?.employeeCode) {
      fetchProjects();
    }
  }, [user?.employeeCode]);

  // Calculate progress and map status
  const getProjectStatus = (project: ProjectDetailResponse) => {
    if (!project.currentStatus) return 'ON_TRACK';
    const status = project.currentStatus.toUpperCase();
    if (status === 'ON_TRACK') return 'ON_TRACK';
    if (status === 'AT_RISK') return 'AT_RISK';
    if (status === 'DELAYED') return 'DELAYED';
    return 'ON_TRACK';
  };

  const computeProgress = (project: ProjectDetailResponse) => {
    const done = project.cumExpUpToPrevFy || 0;
    const total = project.sanctionedCost || 1;
    const pct = Math.round(Math.min(100, Math.max(0, (done / total) * 100)));
    return isFinite(pct) ? pct : 0;
  };

  // Calculate stats from real data
  const stats = {
    total: projects.length,
    onTrack: projects.filter((p) => getProjectStatus(p) === 'ON_TRACK').length,
    atRisk: projects.filter((p) => getProjectStatus(p) === 'AT_RISK').length,
    delayed: projects.filter((p) => getProjectStatus(p) === 'DELAYED').length,
    avgCompletion: Math.round(
      projects.reduce((sum, p) => sum + computeProgress(p), 0) / (projects.length || 1)
    ),
    pendingRevisions: 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programme Director Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage all programme projects</p>
        </div>
      </div>

      {/* Category Stats */}
      <CategoryStatsCards onNavigate={onNavigate} employeeCode={user?.employeeCode} userRole={user?.role} />

      {/* Portfolio Overview Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <p className="text-xs text-gray-600 font-semibold uppercase">Total Projects</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Managed</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-emerald-200 hover:shadow-md transition-all">
            <p className="text-xs text-emerald-600 font-semibold uppercase">On Track</p>
            <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.onTrack}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              <span>Healthy</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-orange-200 hover:shadow-md transition-all">
            <p className="text-xs text-orange-600 font-semibold uppercase">At Risk</p>
            <p className="text-3xl font-bold text-orange-900 mt-2">{stats.atRisk}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>Alert</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-red-200 hover:shadow-md transition-all">
            <p className="text-xs text-red-600 font-semibold uppercase">Delayed</p>
            <p className="text-3xl font-bold text-red-900 mt-2">{stats.delayed}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <Clock className="w-4 h-4" />
              <span>Critical</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-blue-200 hover:shadow-md transition-all">
            <p className="text-xs text-blue-600 font-semibold uppercase">Avg Progress</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{stats.avgCompletion}%</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
              <TrendingUp className="w-4 h-4" />
              <span>Overall</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <p className="text-lg text-gray-600">Loading projects...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* No Projects State */}
      {!loading && projects.length === 0 && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-semibold text-lg">No projects assigned yet</p>
          <p className="text-blue-600 text-sm mt-2">Projects will appear in Assigned Projects page once they are created.</p>
        </div>
      )}

      {/* Project Charts and Insights */}
      {!loading && projects.length > 0 && (
        <>
          {/* Status Distribution Chart */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Project Status Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Pie-like Cards */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{stats.onTrack}</p>
                      <p className="text-xs">Projects</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase">On Track</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-2">{Math.round((stats.onTrack / stats.total) * 100)}%</p>
                    <p className="text-xs text-gray-500 mt-1">of total portfolio</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{stats.atRisk}</p>
                      <p className="text-xs">Projects</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase">At Risk</p>
                    <p className="text-2xl font-bold text-orange-600 mt-2">{Math.round((stats.atRisk / stats.total) * 100)}%</p>
                    <p className="text-xs text-gray-500 mt-1">of total portfolio</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{stats.delayed}</p>
                      <p className="text-xs">Projects</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold uppercase">Delayed</p>
                    <p className="text-2xl font-bold text-red-600 mt-2">{Math.round((stats.delayed / stats.total) * 100)}%</p>
                    <p className="text-xs text-gray-500 mt-1">of total portfolio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Utilization */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Utilization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget Breakdown */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-600 font-semibold uppercase mb-4">Budget Allocation</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">Total Budget</p>
                      <p className="text-lg font-bold text-gray-900">₹{(projects.reduce((sum, p) => sum + (p.sanctionedCost || 0), 0) / 1000000).toFixed(1)}Cr</p>
                    </div>
                    <div className="w-full h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">Spent</p>
                      <p className="text-lg font-bold text-green-600">₹{(projects.reduce((sum, p) => sum + (p.cumExpUpToPrevFy || 0), 0) / 1000000).toFixed(1)}Cr</p>
                    </div>
                    <div className="w-full h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">Remaining</p>
                      <p className="text-lg font-bold text-amber-600">₹{((projects.reduce((sum, p) => sum + (p.sanctionedCost || 0), 0) - projects.reduce((sum, p) => sum + (p.cumExpUpToPrevFy || 0), 0)) / 1000000).toFixed(1)}Cr</p>
                    </div>
                    <div className="w-full h-3 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Utilization Rate */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <p className="text-sm text-gray-600 font-semibold uppercase mb-4">Portfolio Overview</p>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">Average Progress</p>
                      <p className="text-lg font-bold text-blue-600">{stats.avgCompletion}%</p>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                        style={{ width: `${stats.avgCompletion}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{stats.onTrack}</p>
                      <p className="text-xs text-gray-600 mt-1">Healthy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{stats.atRisk}</p>
                      <p className="text-xs text-gray-600 mt-1">At Risk</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
                      <p className="text-xs text-gray-600 mt-1">Delayed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View All Projects Button */}
          <div className="flex justify-center">
            <button
              onClick={() => onNavigate('assigned-projects')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View All Assigned Projects
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgrammeDirectorDashboard;

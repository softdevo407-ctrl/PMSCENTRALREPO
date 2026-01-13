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
import { projectService, ProjectDefinitionResponse } from '../services/projectService';

interface ProgrammeDirectorDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const ProgrammeDirectorDashboard: React.FC<ProgrammeDirectorDashboardProps> = ({ userName, onNavigate }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectDefinitionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects by programme ID
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user?.assignedProgrammeId) {
          setError('No programme assigned to this user');
          setLoading(false);
          return;
        }

        const fetchedProjects = await projectService.getProjectsByProgrammeId(user.assignedProgrammeId);
        setProjects(fetchedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user?.assignedProgrammeId]);

  // Calculate stats from real data
  const stats = {
    total: projects.length,
    onTrack: projects.filter((p) => p.status === 'ON_TRACK').length,
    atRisk: projects.filter((p) => p.status === 'AT_RISK').length,
    delayed: projects.filter((p) => p.status === 'DELAYED').length,
    avgCompletion: 0, // Will be calculated from project scheduling data if available
    pendingRevisions: 0, // Will be calculated from revision requests if available
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Programme Director Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage assigned projects</p>
      </div>

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
          {!user?.assignedProgrammeId && (
            <p className="text-red-600 text-sm mt-2">Please ensure your programme is assigned during registration.</p>
          )}
        </div>
      )}

      {/* No Projects State */}
      {!loading && projects.length === 0 && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-semibold">No projects assigned yet</p>
          <p className="text-blue-600 text-sm mt-2">Projects will appear here once they are created for your assigned programme.</p>
        </div>
      )}

      {/* Key Metrics */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-xs text-gray-600 font-semibold uppercase">Total Assigned</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              Projects
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-xs text-emerald-600 font-semibold uppercase">On Track</p>
            <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.onTrack}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              Healthy
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-xs text-orange-600 font-semibold uppercase">At Risk</p>
            <p className="text-3xl font-bold text-orange-900 mt-2">{stats.atRisk}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-orange-600">
              <AlertCircle className="w-4 h-4" />
              Alert
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-xs text-red-600 font-semibold uppercase">Delayed</p>
            <p className="text-3xl font-bold text-red-900 mt-2">{stats.delayed}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <Clock className="w-4 h-4" />
              Critical
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-xs text-blue-600 font-semibold uppercase">Avg Progress</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{stats.avgCompletion}%</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
              <TrendingUp className="w-4 h-4" />
              Overall
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
            <p className="text-xs text-purple-600 font-semibold uppercase">Pending Approvals</p>
            <p className="text-3xl font-bold text-purple-900 mt-2">{stats.pendingRevisions}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-purple-600">
              <BarChart3 className="w-4 h-4" />
              Revision
            </div>
          </div>
        </div>
      )}

      {/* Project Status Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Assigned Projects Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Director</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Budget</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => {
                const statusColor =
                  project.status === 'ON_TRACK'
                    ? 'bg-emerald-100 text-emerald-800'
                    : project.status === 'AT_RISK'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800';

                const statusDisplay =
                  project.status === 'ON_TRACK'
                    ? 'On Track'
                    : project.status === 'AT_RISK'
                    ? 'At Risk'
                    : 'Delayed';

                return (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{project.projectName}</p>
                        <p className="text-xs text-gray-500">{project.programmeName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{project.projectDirectorName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {statusDisplay}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${0}%` }}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-900">0%</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">₹{(project.revisedSanctionedAmount / 1000000).toFixed(1)}M</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onNavigate('monitoring')}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onNavigate('approvals')}
          className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
            {stats.pendingRevisions > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {stats.pendingRevisions} pending
              </span>
            )}
          </div>
          <h4 className="font-bold text-gray-900 mb-1">Review Approvals</h4>
          <p className="text-sm text-gray-600">Check revision requests and approvals</p>
        </button>

        <button
          onClick={() => onNavigate('monitoring')}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all text-left group"
        >
          <TrendingUp className="w-8 h-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-gray-900 mb-1">Project Monitoring</h4>
          <p className="text-sm text-gray-600">Real-time progress and performance</p>
        </button>
      </div>
    </div>
  );
};

export default ProgrammeDirectorDashboard;

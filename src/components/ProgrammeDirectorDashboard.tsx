import React from 'react';
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
} from 'lucide-react';
import { SAMPLE_PROJECT_DEFINITIONS, SAMPLE_PROJECT_SCHEDULING, SAMPLE_REVISION_REQUESTS } from '../pbemData';

interface ProgrammeDirectorDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const ProgrammeDirectorDashboard: React.FC<ProgrammeDirectorDashboardProps> = ({ userName, onNavigate }) => {
  const assignedProjects = SAMPLE_PROJECT_DEFINITIONS.filter((p) => p.programmeDirectorName === userName);
  const assignedSchedulings = SAMPLE_PROJECT_SCHEDULING.filter((s) => {
    const def = SAMPLE_PROJECT_DEFINITIONS.find((d) => d.id === s.projectDefinitionId);
    return def?.programmeDirectorName === userName;
  });
  const assignedRevisions = SAMPLE_REVISION_REQUESTS.filter((r) => {
    const def = SAMPLE_PROJECT_DEFINITIONS.find((d) => d.id === r.projectDefinitionId);
    return def?.programmeDirectorName === userName;
  });

  const stats = {
    total: assignedProjects.length,
    onTrack: assignedProjects.filter((p) => p.status === 'On Track').length,
    atRisk: assignedProjects.filter((p) => p.status === 'At Risk').length,
    delayed: assignedProjects.filter((p) => p.status === 'Delayed').length,
    avgCompletion: Math.round(
      assignedSchedulings.reduce((sum, s) => sum + s.overallCompletionPercentage, 0) /
        (assignedSchedulings.length || 1)
    ),
    pendingRevisions: assignedRevisions.filter((r) => r.status === 'PENDING').length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Programme Director Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor and manage assigned projects</p>
      </div>

      {/* Key Metrics */}
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
              {assignedProjects.map((project) => {
                const scheduling = assignedSchedulings.find((s) => s.projectDefinitionId === project.id);
                const statusColor =
                  project.status === 'On Track'
                    ? 'bg-emerald-100 text-emerald-800'
                    : project.status === 'At Risk'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800';

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
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${scheduling?.overallCompletionPercentage || 0}%` }}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-900">{scheduling?.overallCompletionPercentage || 0}%</p>
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

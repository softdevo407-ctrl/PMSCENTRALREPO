import React from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
} from 'lucide-react';
import { SAMPLE_PROJECT_DEFINITIONS, SAMPLE_PROJECT_SCHEDULING, SAMPLE_REVISION_REQUESTS } from '../pbemData';

interface ChairmanDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const ChairmanDashboard: React.FC<ChairmanDashboardProps> = ({ userName, onNavigate }) => {
  const allProjects = SAMPLE_PROJECT_DEFINITIONS;
  const allSchedulings = SAMPLE_PROJECT_SCHEDULING;
  const allRevisions = SAMPLE_REVISION_REQUESTS;

  const stats = {
    total: allProjects.length,
    onTrack: allProjects.filter((p) => p.status === 'On Track').length,
    atRisk: allProjects.filter((p) => p.status === 'At Risk').length,
    delayed: allProjects.filter((p) => p.status === 'Delayed').length,
    completed: allProjects.filter((p) => p.status === 'Completed').length,
    totalBudget: allProjects.reduce((sum, p) => sum + p.revisedSanctionedAmount, 0),
    avgCompletion: Math.round(
      allSchedulings.reduce((sum, s) => sum + s.overallCompletionPercentage, 0) /
        (allSchedulings.length || 1)
    ),
    pendingApprovals: allRevisions.filter((r) => r.status === 'PENDING').length,
  };

  const criticalProjects = allProjects.filter((p) => p.status === 'At Risk' || p.status === 'Delayed');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Strategic Dashboard</h1>
        <p className="text-gray-600 mt-2">Enterprise-wide project oversight and analytics</p>
      </div>

      {/* Executive Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Total Projects</h4>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
          <p className="text-xs text-blue-700 mt-2">Active & completed projects</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6 border border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">On Track</h4>
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-4xl font-bold text-emerald-900">{stats.onTrack}</p>
          <p className="text-xs text-emerald-700 mt-2">{Math.round((stats.onTrack / stats.total) * 100)}% of portfolio</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">At Risk</h4>
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-4xl font-bold text-orange-900">{stats.atRisk}</p>
          <p className="text-xs text-orange-700 mt-2">Requires attention</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Delayed</h4>
            <Clock className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-4xl font-bold text-red-900">{stats.delayed}</p>
          <p className="text-xs text-red-700 mt-2">Critical priority</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Total Budget</h4>
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ₹{(stats.totalBudget / 1000000).toFixed(1)}M
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              Allocated across {stats.total} projects
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Portfolio Progress</h4>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.avgCompletion}%</p>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                style={{ width: `${stats.avgCompletion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900">Pending Approvals</h4>
            <Zap className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.pendingApprovals}</p>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              Revision requests awaiting approval
            </p>
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      {criticalProjects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
          <div className="p-6 border-b border-red-200 bg-red-50">
            <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Issues - {criticalProjects.length} Projects
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {criticalProjects.map((project) => (
              <div key={project.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{project.projectName}</p>
                    <p className="text-sm text-gray-600 mt-1">Director: {project.projectDirectorName}</p>
                    <p className="text-sm text-gray-600">Programme: {project.programmeDirectorName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'At Risk'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {project.status}
                    </span>
                    <button
                      onClick={() => onNavigate('oversight')}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Projects Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Portfolio Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Project</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Programme Director</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Completion</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allProjects.map((project) => {
                const scheduling = allSchedulings.find((s) => s.projectDefinitionId === project.id);
                const statusColor =
                  project.status === 'On Track'
                    ? 'bg-emerald-100 text-emerald-800'
                    : project.status === 'At Risk'
                    ? 'bg-orange-100 text-orange-800'
                    : project.status === 'Delayed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800';

                return (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{project.projectName}</p>
                        <p className="text-xs text-gray-500">{project.shortName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{project.programmeDirectorName}</p>
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
                      <button
                        onClick={() => onNavigate('oversight')}
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
      </div>
    </div>
  );
};

export default ChairmanDashboard;

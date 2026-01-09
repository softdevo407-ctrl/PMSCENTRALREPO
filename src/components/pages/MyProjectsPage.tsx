import React, { useState } from 'react';
import { SAMPLE_PROJECT_DEFINITIONS } from '../../pbemData';
import { Eye, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Calendar, Plus, Filter } from 'lucide-react';

interface MyProjectsPageProps {
  userName: string;
}

export const MyProjectsPage: React.FC<MyProjectsPageProps> = ({ userName }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const myProjects = SAMPLE_PROJECT_DEFINITIONS.filter(p => p.projectDirectorName === userName);
  const filteredProjects = filterStatus === 'all' 
    ? myProjects 
    : myProjects.filter(p => p.status === filterStatus);

  const totalBudget = myProjects.reduce((sum, p) => sum + p.sanctionedAmount, 0);
  const totalSpent = totalBudget * 0.58;
  const budgetUtilization = ((totalSpent / totalBudget) * 100).toFixed(1);

  const selectedProjectData = myProjects.find(p => p.id === selectedProject);

  const budgetBreakup = selectedProjectData ? {
    planning: selectedProjectData.sanctionedAmount * 0.15,
    development: selectedProjectData.sanctionedAmount * 0.45,
    testing: selectedProjectData.sanctionedAmount * 0.25,
    deployment: selectedProjectData.sanctionedAmount * 0.15
  } : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all your assigned satellite projects</p>
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
          <p className="text-3xl font-bold text-green-600 mt-2">{myProjects.filter(p => p.status === 'On Track').length}</p>
          <p className="text-xs text-gray-500 mt-2">Performing well</p>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-orange-600 uppercase tracking-wide font-semibold">At Risk</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{myProjects.filter(p => p.status === 'At Risk').length}</p>
          <p className="text-xs text-gray-500 mt-2">Needs attention</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-blue-600 uppercase tracking-wide font-semibold">Budget Utilization</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{budgetUtilization}%</p>
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
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Delayed">Delayed</option>
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
                    <p className="text-sm text-gray-600 mt-1">{project.shortName} • {project.categoryName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'On Track' ? 'bg-green-100 text-green-700' :
                    project.status === 'At Risk' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Budget</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">₹{(project.sanctionedAmount / 100000).toFixed(1)}L</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Progress</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">65%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Phase Progress</span>
                    <span className="font-semibold text-gray-900">65%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                    <Eye className="w-4 h-4" />
                    Details
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
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
                    <p className="font-semibold text-gray-900">{selectedProjectData.leadCentreName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Budget Code</p>
                    <p className="font-mono text-gray-900 font-semibold">{selectedProjectData.budgetCode}</p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-gray-600">Total Budget</p>
                    <p className="text-xl font-bold text-blue-600">₹{(selectedProjectData.sanctionedAmount / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              </div>

              {/* Budget Breakup */}
              {budgetBreakup && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                    Budget Breakup
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Planning', amount: budgetBreakup.planning, pct: 15, color: 'bg-blue-500' },
                      { label: 'Development', amount: budgetBreakup.development, pct: 45, color: 'bg-indigo-500' },
                      { label: 'Testing', amount: budgetBreakup.testing, pct: 25, color: 'bg-purple-500' },
                      { label: 'Deployment', amount: budgetBreakup.deployment, pct: 15, color: 'bg-pink-500' }
                    ].map((phase, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1 text-xs">
                          <span className="font-semibold text-gray-700">{phase.label}</span>
                          <span className="text-gray-900 font-bold">₹{(phase.amount / 100000).toFixed(1)}L ({phase.pct}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${phase.color} rounded-full`} style={{ width: `${phase.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Key Metrics
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Budget Spent</span>
                    <span className="font-bold text-gray-900">₹{(selectedProjectData.sanctionedAmount * 0.58 / 100000).toFixed(1)}L (58%)</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Remaining</span>
                    <span className="font-bold text-green-600">₹{(selectedProjectData.sanctionedAmount * 0.42 / 100000).toFixed(1)}L (42%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Burn Rate</span>
                    <span className="font-bold text-gray-900">₹45L/month</span>
                  </div>
                </div>
              </div>
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
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Phase
              </button>
              <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Request Revision
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

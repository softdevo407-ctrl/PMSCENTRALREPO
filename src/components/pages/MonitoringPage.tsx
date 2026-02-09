import React from 'react';
import { SAMPLE_PROJECT_DEFINITIONS } from '../../pbemData';
import { AlertCircle, TrendingDown } from 'lucide-react';

interface MonitoringPageProps {
  userName: string;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ userName }) => {
  const allProjects = SAMPLE_PROJECT_DEFINITIONS;
  const atRiskProjects = allProjects.filter(p => p.status === 'At Risk' || p.status === 'Delayed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Project Monitoring</h1>
        <p className="text-gray-600 mt-2">Track and manage at-risk and delayed projects</p>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{allProjects.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-6">
          <p className="text-sm text-orange-600 uppercase tracking-wide">At Risk</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {allProjects.filter(p => p.status === 'At Risk').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <p className="text-sm text-red-600 uppercase tracking-wide">Delayed</p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {allProjects.filter(p => p.status === 'Delayed').length}
          </p>
        </div>
      </div>

      {/* At-Risk Projects */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-600" />
          Projects Requiring Attention
        </h2>

        <div className="space-y-4">
          {atRiskProjects.map(project => (
            <div key={project.id} className={`rounded-lg border p-6 ${
              project.status === 'Delayed' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{project.projectName}</h3>
                  <p className="text-sm text-gray-600">{project.shortName} • {project.categoryName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'Delayed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {project.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-300/30">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Director</p>
                  <p className="font-medium text-gray-900 mt-1">{project.projectDirectorName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Budget</p>
                  <p className="font-bold text-gray-900 mt-1">₹{(project.sanctionedAmount / 10000000).toFixed(1)}Cr</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Progress</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-grow h-2 bg-gray-300 rounded-full">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '55%' }} />
                    </div>
                    <span className="text-sm font-bold text-gray-900">55%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Action</p>
                  <button className={`mt-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    project.status === 'Delayed'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}>
                    Review Risk
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {atRiskProjects.length === 0 && (
        <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
          <TrendingDown className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <p className="text-green-700 text-lg font-medium">All Projects On Track</p>
          <p className="text-green-600 text-sm mt-1">No monitoring alerts needed</p>
        </div>
      )}
    </div>
  );
};

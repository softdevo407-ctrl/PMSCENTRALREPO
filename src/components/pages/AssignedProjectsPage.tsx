import React from 'react';
import { SAMPLE_PROJECT_DEFINITIONS } from '../../pbemData';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AssignedProjectsPageProps {
  userName: string;
}

export const AssignedProjectsPage: React.FC<AssignedProjectsPageProps> = ({ userName }) => {
  // For a Programme Director, they oversee projects assigned to their programmes
  const allProjects = SAMPLE_PROJECT_DEFINITIONS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assigned Projects</h1>
        <p className="text-gray-600 mt-2">Monitor all projects in your assigned programmes</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{allProjects.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <p className="text-sm text-green-600 uppercase tracking-wide">On Track</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {allProjects.filter(p => p.status === 'On Track').length}
          </p>
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

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Director</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allProjects.map(project => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{project.projectName}</p>
                  <p className="text-sm text-gray-600">{project.shortName}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{project.projectDirectorName}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'On Track' ? 'bg-green-100 text-green-700' :
                    project.status === 'At Risk' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium">₹{(project.sanctionedAmount / 100000).toFixed(1)}L</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">65%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

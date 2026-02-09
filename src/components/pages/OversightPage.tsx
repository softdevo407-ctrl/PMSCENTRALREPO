import React from 'react';
import { SAMPLE_PROJECT_DEFINITIONS } from '../../pbemData';
import { Eye, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

interface OversightPageProps {
  userName: string;
}

export const OversightPage: React.FC<OversightPageProps> = ({ userName }) => {
  const allProjects = SAMPLE_PROJECT_DEFINITIONS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Oversight</h1>
        <p className="text-gray-600 mt-2">Executive-level view of all organization projects</p>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <p className="text-sm text-blue-700 uppercase tracking-wide font-semibold">Total Portfolio Value</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            ₹{(allProjects.reduce((sum, p) => sum + p.sanctionedAmount, 0) / 10000000).toFixed(1)}Cr
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <p className="text-sm text-green-700 uppercase tracking-wide font-semibold">On Track</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {allProjects.filter(p => p.status === 'On Track').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6">
          <p className="text-sm text-orange-700 uppercase tracking-wide font-semibold">At Risk</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">
            {allProjects.filter(p => p.status === 'At Risk').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6">
          <p className="text-sm text-red-700 uppercase tracking-wide font-semibold">Delayed</p>
          <p className="text-3xl font-bold text-red-900 mt-2">
            {allProjects.filter(p => p.status === 'Delayed').length}
          </p>
        </div>
      </div>

      {/* Portfolio Details Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Portfolio Summary</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Director</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">End Date</th>
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
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit ${
                    project.status === 'On Track' ? 'bg-green-100 text-green-700' :
                    project.status === 'At Risk' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {project.status === 'On Track' && <CheckCircle2 className="w-4 h-4" />}
                    {project.status === 'At Risk' && <AlertCircle className="w-4 h-4" />}
                    {project.status === 'Delayed' && <AlertCircle className="w-4 h-4" />}
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">₹{(project.sanctionedAmount / 10000000).toFixed(1)}Cr</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden" style={{ width: '80px' }}>
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '65%' }} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium whitespace-nowrap">65%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(project.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-1">
                    <Eye className="w-4 h-4" />
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

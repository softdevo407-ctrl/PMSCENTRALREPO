import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, BarChart3, Loader2, Search, ArrowUpDown } from 'lucide-react';
import { projectDetailService, ProjectDetailResponse } from '../../services/projectDetailService';

interface AllProjectsPageProps {
  userName: string;
  onNavigate?: (page: string, projectCode?: string, additionalData?: any) => void;
}

export const AllProjectsPage: React.FC<AllProjectsPageProps> = ({ userName, onNavigate = (page: string, projectCode?: string, additionalData?: any) => {} }) => {
  const [projects, setProjects] = useState<ProjectDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Fetch all projects for Chairman
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allProjects = await projectDetailService.getAllProjectDetails();
        setProjects(allProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

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

  const handleSort = (key: string) => {
    if (sortBy === key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setSortDir('asc'); }
  };

  // Filtered and sorted projects
  const filteredProjects = projects
    .filter(p => {
      const q = query.trim().toLowerCase();
      if (q) {
        const inName = (p.missionProjectFullName || '').toLowerCase().includes(q);
        const inShort = (p.missionProjectShortName || '').toLowerCase().includes(q);
        const inCode = (p.missionProjectCode || '').toLowerCase().includes(q);
        if (!inName && !inShort && !inCode) return false;
      }
      if (statusFilter === 'on-track') return getProjectStatus(p) === 'ON_TRACK';
      if (statusFilter === 'at-risk') return getProjectStatus(p) === 'AT_RISK';
      if (statusFilter === 'delayed') return getProjectStatus(p) === 'DELAYED';
      return true;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      let av: any = '';
      let bv: any = '';
      switch (sortBy) {
        case 'name': av = a.missionProjectFullName || ''; bv = b.missionProjectFullName || ''; break;
        case 'budget': av = a.sanctionedCost || 0; bv = b.sanctionedCost || 0; break;
        case 'endDate': av = new Date(a.originalSchedule || '').getTime() || 0; bv = new Date(b.originalSchedule || '').getTime() || 0; break;
        case 'status': av = getProjectStatus(a); bv = getProjectStatus(b); break;
        default: break;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate stats from real data
  const stats = {
    total: projects.length,
    onTrack: projects.filter((p) => getProjectStatus(p) === 'ON_TRACK').length,
    atRisk: projects.filter((p) => getProjectStatus(p) === 'AT_RISK').length,
    delayed: projects.filter((p) => getProjectStatus(p) === 'DELAYED').length,
    avgCompletion: Math.round(
      projects.reduce((sum, p) => sum + computeProgress(p), 0) / (projects.length || 1)
    ),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
        <p className="text-gray-600 mt-2">Complete portfolio overview and management</p>
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
          <p className="text-blue-800 font-semibold text-lg">No projects found</p>
          <p className="text-blue-600 text-sm mt-2">Projects will appear here once they are created.</p>
        </div>
      )}

      {/* Search and Filter - Enhanced */}
      {!loading && projects.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects by name or code..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-gray-700 font-medium"
              >
                <option value="all">All Status</option>
                <option value="on-track">On Track</option>
                <option value="at-risk">At Risk</option>
                <option value="delayed">Delayed</option>
              </select>
              <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
                <ArrowUpDown className="w-4 h-4" />
                <span>Sort</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Table - Enhanced */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-2xl font-bold text-gray-900">All Projects</h3>
            <p className="text-sm text-gray-600 mt-1">Total: {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</p>
          </div>
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">No projects found matching your filters</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th onClick={() => handleSort('name')} className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">Project Name <ArrowUpDown className="w-4 h-4 opacity-0 group-hover:opacity-100" /></div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Director</th>
                    <th onClick={() => handleSort('status')} className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Progress</th>
                    <th onClick={() => handleSort('budget')} className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">Budget</th>
                    <th onClick={() => handleSort('endDate')} className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors">End Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const status = getProjectStatus(project);
                    const statusColor =
                      status === 'ON_TRACK'
                        ? 'bg-emerald-100 text-emerald-800 border-l-4 border-emerald-500'
                        : status === 'AT_RISK'
                        ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500'
                        : 'bg-red-100 text-red-800 border-l-4 border-red-500';

                    const statusDisplay =
                      status === 'ON_TRACK'
                        ? 'On Track'
                        : status === 'AT_RISK'
                        ? 'At Risk'
                        : 'Delayed';

                    const progress = computeProgress(project);

                    return (
                      <tr key={project.missionProjectCode} className="hover:bg-blue-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{project.missionProjectFullName}</p>
                            <p className="text-xs text-gray-500 mt-1">{project.missionProjectShortName}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {project.missionProjectDirector || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                            {statusDisplay}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-900 w-10 text-right">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">₹{((project.sanctionedCost || 0) / 1000000).toFixed(1)}M</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {new Date(project.originalSchedule).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => onNavigate('oversight', project.missionProjectCode, { project })}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-bold text-sm px-3 py-1 rounded transition-all"
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
          )}
        </div>
      )}
    </div>
  );
};

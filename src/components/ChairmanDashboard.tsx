import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Loader2,
  PieChart,
} from 'lucide-react';
import { projectDetailService, ProjectDetailResponse } from '../services/projectDetailService';
import { CategoryStatsCards } from './CategoryStatsCards';
import { SAMPLE_REVISION_REQUESTS } from '../pbemData';

interface ChairmanDashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

const ChairmanDashboard: React.FC<ChairmanDashboardProps> = ({ userName, onNavigate }) => {
  const [allProjects, setAllProjects] = useState<ProjectDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchAllProjects();
  }, []);
  
  const fetchAllProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projects = await projectDetailService.getAllProjectDetails();
      setAllProjects(projects || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
      setAllProjects([]);
    } finally {
      setLoading(false);
    }
  };
  
  const allRevisions = SAMPLE_REVISION_REQUESTS;

  const getProjectStatus = (project: ProjectDetailResponse) => {
    if (!project.currentStatus) return 'On Track';
    const status = project.currentStatus.toUpperCase();
    if (status === 'ON_TRACK') return 'On Track';
    if (status === 'AT_RISK') return 'At Risk';
    if (status === 'DELAYED') return 'Delayed';
    if (status === 'COMPLETED') return 'Completed';
    return 'On Track';
  };

  const computeProgress = (project: ProjectDetailResponse) => {
    const done = project.cumExpUpToPrevFy || 0;
    const total = project.sanctionedCost || 1;
    const pct = Math.round(Math.min(100, Math.max(0, (done / total) * 100)));
    return isFinite(pct) ? pct : 0;
  };

  const stats = {
    total: allProjects.length,
    onTrack: allProjects.filter((p) => getProjectStatus(p) === 'On Track').length,
    atRisk: allProjects.filter((p) => getProjectStatus(p) === 'At Risk').length,
    delayed: allProjects.filter((p) => getProjectStatus(p) === 'Delayed').length,
    completed: allProjects.filter((p) => getProjectStatus(p) === 'Completed').length,
    totalBudget: allProjects.reduce((sum, p) => sum + (p.sanctionedCost || 0), 0),
    avgCompletion: Math.round(
      allProjects.reduce((sum, p) => sum + computeProgress(p), 0) /
        (allProjects.length || 1)
    ),
    pendingApprovals: allRevisions.filter((r) => r.status === 'PENDING').length,
  };

  const criticalProjects = allProjects.filter((p) => getProjectStatus(p) === 'At Risk' || getProjectStatus(p) === 'Delayed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="space-y-6 p-8">
      {/* Premium Header Section */}
      <div className="relative mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-black text-white mb-2">
                Executive Dashboard
              </h1>
              <p className="text-blue-100 text-lg font-semibold">
                Real-time portfolio health & strategic insights
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center w-20 h-20 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center bg-white rounded-2xl shadow-md border border-gray-200">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-700 text-lg font-semibold">Loading portfolio data...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-300 rounded-2xl shadow-md">
          <p className="text-red-700 font-bold text-lg">Error loading projects</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
          <button
            onClick={fetchAllProjects}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all"
          >
            Retry
          </button>
        </div>
      ) : null}
 {/* Category Stats Cards */}
      <CategoryStatsCards onNavigate={onNavigate} employeeCode={'CHAIRMAN'} />


      {/* Executive Overview - Power BI Style Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Projects Card */}
        <div className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-700 text-sm">Total Projects</h4>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 mb-2">{stats.total}</p>
            <p className="text-blue-600 text-sm font-semibold">Active & Completed</p>
          </div>
        </div>

        {/* On Track Card */}
        <div className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-700 text-sm">On Track</h4>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 mb-2">{stats.onTrack}</p>
            <p className="text-emerald-600 text-sm font-semibold">{Math.round((stats.onTrack / stats.total) * 100)}% of Portfolio</p>
          </div>
        </div>

        {/* At Risk Card */}
        <div className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-700 text-sm">At Risk</h4>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 mb-2">{stats.atRisk}</p>
            <p className="text-orange-600 text-sm font-semibold">Requires Attention</p>
          </div>
        </div>

        {/* Delayed Card */}
        <div className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-700 text-sm">Delayed</h4>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 mb-2">{stats.delayed}</p>
            <p className="text-red-600 text-sm font-semibold">Critical Priority</p>
          </div>
        </div>
      </div>

     
      {/* KPI Cards - Power BI Light Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budget Card */}
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 p-8 group overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-gray-800 text-lg">Total Budget</h4>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 mb-3">
              ₹{(stats.totalBudget / 1000000).toFixed(1)}M
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 text-sm">
              Allocated across <span className="text-blue-600 font-bold">{stats.total}</span> projects
            </p>
          </div>
        </div>

        {/* Portfolio Progress Card */}
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 p-8 group overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-gray-800 text-lg">Portfolio Progress</h4>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 mb-4">{stats.avgCompletion}%</p>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${stats.avgCompletion}%` }}
              />
            </div>
            <p className="text-gray-600 text-sm mt-4">Average completion rate</p>
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 p-8 group overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-100 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-gray-800 text-lg">Pending Approvals</h4>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
            <p className="text-5xl font-black text-gray-900 mb-3">{stats.pendingApprovals}</p>
            <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-transparent rounded-full mb-4"></div>
            <p className="text-gray-600 text-sm">
              Revision requests awaiting <span className="text-amber-600 font-bold">approval</span>
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Analytics - Power BI Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Completion Status */}
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 p-8 overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <h4 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            Project Status Summary
          </h4>
          
          <div className="space-y-5 relative z-10">
            {/* On Track */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-md"></div>
                  <p className="text-gray-700 font-semibold">On Track</p>
                </div>
                <p className="text-gray-900 font-black text-lg">{stats.onTrack} ({Math.round((stats.onTrack / stats.total) * 100)}%)</p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 shadow-md" style={{ width: `${(stats.onTrack / stats.total) * 100}%` }} />
              </div>
            </div>

            {/* At Risk */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500 shadow-md"></div>
                  <p className="text-gray-700 font-semibold">At Risk</p>
                </div>
                <p className="text-gray-900 font-black text-lg">{stats.atRisk} ({Math.round((stats.atRisk / stats.total) * 100)}%)</p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 shadow-md" style={{ width: `${(stats.atRisk / stats.total) * 100}%` }} />
              </div>
            </div>

            {/* Delayed */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-md"></div>
                  <p className="text-gray-700 font-semibold">Delayed</p>
                </div>
                <p className="text-gray-900 font-black text-lg">{stats.delayed} ({Math.round((stats.delayed / stats.total) * 100)}%)</p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 shadow-md" style={{ width: `${(stats.delayed / stats.total) * 100}%` }} />
              </div>
            </div>

            {/* Completed */}
            <div className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md"></div>
                  <p className="text-gray-700 font-semibold">Completed</p>
                </div>
                <p className="text-gray-900 font-black text-lg">{stats.completed} ({Math.round((stats.completed / stats.total) * 100)}%)</p>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 shadow-md" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Pie Chart Visualization */}
          <div className="mt-10 flex items-center justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200" className="drop-shadow-lg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#e5e7eb" strokeWidth="30" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#10b981"
                strokeWidth="30"
                strokeDasharray={`${(stats.onTrack / stats.total) * 565} 565`}
                transform="rotate(-90 100 100)"
                strokeLinecap="round"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#f97316"
                strokeWidth="30"
                strokeDasharray={`${(stats.atRisk / stats.total) * 565} 565`}
                transform={`rotate(${((stats.onTrack / stats.total) * 360) - 90} 100 100)`}
                strokeLinecap="round"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#ef4444"
                strokeWidth="30"
                strokeDasharray={`${(stats.delayed / stats.total) * 565} 565`}
                transform={`rotate(${(((stats.onTrack + stats.atRisk) / stats.total) * 360) - 90} 100 100)`}
                strokeLinecap="round"
              />
              <text x="100" y="100" textAnchor="middle" dy="0.3em" className="text-xl font-bold fill-gray-900">
                {stats.total}
              </text>
              <text x="100" y="120" textAnchor="middle" dy="0.3em" className="text-xs fill-gray-500">
                Total
              </text>
            </svg>
          </div>
        </div>

        {/* Project Distribution by Director */}
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 p-8 overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
          <h4 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            Project Distribution by Director
          </h4>

          {(() => {
            const directorMap = new Map<string, number>();
            allProjects.forEach((p) => {
              const director = p.missionProjectDirector || 'Unassigned';
              directorMap.set(director, (directorMap.get(director) || 0) + 1);
            });

            const directors = Array.from(directorMap.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8);

            const maxProjects = Math.max(...Array.from(directorMap.values()));

            return (
              <div className="space-y-6 relative z-10">
                {directors.map(([director, count], index) => (
                  <div key={director} className="group">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-gray-800 font-semibold text-sm truncate max-w-xs">{director}</p>
                        <p className="text-gray-500 text-xs">Director Lead</p>
                      </div>
                      <p className="text-gray-900 font-black text-xl">{count}</p>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-600 shadow-md rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxProjects) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Critical Insights - Power BI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Assessment Dashboard */}
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 p-8 overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-30"></div>
          <h4 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            Risk Assessment Dashboard
          </h4>

          <div className="space-y-6 relative z-10">
            {/* Budget Risk */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 hover:border-red-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-bold text-gray-900 text-lg">Budget Utilization</h5>
                <span className="text-4xl font-black text-red-600">
                  {Math.round(
                    (allProjects.reduce((sum, p) => sum + (p.cumExpUpToPrevFy || 0), 0) / stats.totalBudget) * 100
                  )}%
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-3">Spent: <span className="text-red-600 font-bold">₹{(allProjects.reduce((sum, p) => sum + (p.cumExpUpToPrevFy || 0), 0) / 1000000).toFixed(1)}M</span> of ₹{(stats.totalBudget / 1000000).toFixed(1)}M</p>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 shadow-md rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      (allProjects.reduce((sum, p) => sum + (p.cumExpUpToPrevFy || 0), 0) / stats.totalBudget) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Schedule Risk */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200 hover:border-orange-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-bold text-gray-900 text-lg">Schedule Compliance</h5>
                <span className="text-4xl font-black text-orange-600">{stats.delayed}</span>
              </div>
              <p className="text-gray-700 text-sm mb-3">Projects behind schedule requiring <span className="text-orange-600 font-bold">immediate attention</span></p>
              <div className="space-y-2 mt-3">
                {allProjects
                  .filter((p) => getProjectStatus(p) === 'Delayed')
                  .slice(0, 3)
                  .map((p) => (
                    <p key={p.missionProjectCode} className="text-gray-600 text-xs truncate flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      {p.missionProjectShortName}
                    </p>
                  ))}
              </div>
            </div>

            {/* Quality Risk */}
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:border-yellow-300 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-bold text-gray-900 text-lg">At-Risk Projects</h5>
                <span className="text-4xl font-black text-yellow-600">{stats.atRisk}</span>
              </div>
              <p className="text-gray-700 text-sm mb-3">Intervention required to prevent escalation</p>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 shadow-md rounded-full"
                  style={{ width: `${(stats.atRisk / stats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Metrics */}
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 p-8 overflow-hidden transition-all">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-30"></div>
          <h4 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            Achievement Metrics
          </h4>

          <div className="space-y-7 relative z-10">
            {/* Completion Rate */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-bold text-gray-900 text-lg">Portfolio Completion Rate</h5>
                <span className="text-4xl font-black text-emerald-600">{stats.avgCompletion}%</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-md rounded-full transition-all duration-500"
                  style={{ width: `${stats.avgCompletion}%` }}
                />
              </div>
              <p className="text-gray-600 text-sm mt-3">Average project progress across entire portfolio</p>
            </div>

            {/* Health Score */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-bold text-gray-900 text-lg">Portfolio Health Score</h5>
                <span className="text-4xl font-black text-blue-600">
                  {Math.round(((stats.onTrack + stats.completed) / stats.total) * 100)}%
                </span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-md rounded-full transition-all duration-500"
                  style={{ width: `${((stats.onTrack + stats.completed) / stats.total) * 100}%` }}
                />
              </div>
              <p className="text-gray-600 text-sm mt-3">On-Track + Completed projects indicator</p>
            </div>

            {/* Key Statistics Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:border-blue-300 transition-all">
                <p className="text-3xl font-black text-blue-600 mb-2">{stats.completed}</p>
                <p className="text-gray-700 font-semibold text-sm">Completed</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200 hover:border-emerald-300 transition-all">
                <p className="text-3xl font-black text-emerald-600 mb-2">{stats.onTrack}</p>
                <p className="text-gray-700 font-semibold text-sm">In Progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons - Power BI Style */}
      {!loading && !error && allProjects.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 pt-4">
          <button
            onClick={() => onNavigate('all-projects')}
            className="flex-1 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <BarChart3 className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="relative">View All Projects</span>
          </button>
          <button
            onClick={() => onNavigate('oversight')}
            className="flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <AlertTriangle className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="relative">Critical Review</span>
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default ChairmanDashboard;


import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  FileText,
  ClipboardList,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  Loader2,
  Download,
  Printer,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUpIcon,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectDetailService, ProjectDetailResponse, ProjectDetailRequest } from '../services/projectDetailService';
import { SAMPLE_PROJECT_SCHEDULING, SAMPLE_REVISION_REQUESTS } from '../pbemData';
import CoreUIForm from './CoreUIForm';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';

interface ProjectDirectorDashboardProps {
  userName: string;
  onNavigate: (page: string, categoryOrProjectCode?: string, additionalData?: any) => void;
}

const ProjectDirectorDashboard: React.FC<ProjectDirectorDashboardProps> = ({ userName, onNavigate }) => {
  const { user } = useAuth();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [myProjects, setMyProjects] = useState<ProjectDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  
  // Refs for chart containers
  const chartsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch projects on mount and when user changes
  useEffect(() => {
    if (user?.id || user?.employeeCode) {
      fetchProjects();
    }
  }, [user?.id, user?.employeeCode]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try to get projects by director using employee code
      if (user?.employeeCode) {
        console.log('Fetching projects for director:', user.employeeCode);
        const projects = await projectDetailService.getProjectDetailsByDirector(user.employeeCode);
        console.log('Projects fetched:', projects);
        setMyProjects(projects || []);
      } else {
        console.log('No employee code found, falling back to getMyProjects');
        const projects = await projectDetailService.getMyProjects();
        setMyProjects(projects || []);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
      setMyProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Using sample data for scheduling - can be enhanced with API call
  const mySchedulings = SAMPLE_PROJECT_SCHEDULING;
  const myRevisions = SAMPLE_REVISION_REQUESTS.filter((r) => r.requestedBy === userName);

  // Determine if project is delayed using schedule date
  const isProjectDelayed = (project: ProjectDetailResponse) => {
    try {
      // If timeOverrunApproval = 'YES' and revisedCompletionDate exists, use that instead
      const scheduleToCheck = project.timeOverrunApproval === 'YES' && project.revisedCompletionDate 
        ? project.revisedCompletionDate 
        : project.originalSchedule;
      
      if (scheduleToCheck) {
        const sched = new Date(scheduleToCheck);
        if (!isNaN(sched.getTime())) {
          const now = new Date();
          return sched.getTime() < now.getTime();
        }
      }
    } catch (e) {
      // ignore parse errors and fall back
    }

    // fallback: if durationInMonths > 0 treat as delayed (legacy behavior)
    return (project.durationInMonths || 0) > 0;
  };

  const stats = {
    total: myProjects.length,
    onTrack: myProjects.filter((p) => !isProjectDelayed(p)).length,
    atRisk: 0,
    delayed: myProjects.filter((p) => isProjectDelayed(p)).length,
    pendingRevisions: myRevisions.filter((r) => r.status === 'PENDING').length,
    sanctionedCost: myProjects.reduce((sum, p) => sum + (p.sanctionedCost || 0), 0)
  };

  // Enhanced utilities - Define before using in data calculations
  const computeProgress = (project: ProjectDetailResponse) => {
    const done = project.cumExpUpToPrevFy || 0;
    const total = project.sanctionedCost || 1;
    const pct = Math.round(Math.min(100, Math.max(0, (done / total) * 100)));
    return isFinite(pct) ? pct : 0;
  };

  const makeSparklinePoints = (pct: number) => {
    // generate 6 small points around pct for a simple sparkline
    const base = Math.max(5, pct);
    const pts = [base - 10, base - 4, base - 2, base, base + 6, base + 12].map(v => Math.max(0, Math.min(100, v)));
    return pts;
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#7C3AED'];

  const pieData = [
    { name: 'On Track', value: stats.onTrack },
    { name: 'Delayed', value: stats.delayed }
  ];

  const topBudgetProjects = [...myProjects]
    .sort((a, b) => (b.sanctionedCost || 0) - (a.sanctionedCost || 0))
    .slice(0, 6)
    .map((p) => ({ 
      name: p.missionProjectFullName || p.missionProjectCode || 'Untitled', 
      sanctionedCost: p.sanctionedCost || 0,
      cumExpUpToPrevFy: (p.cumulativeExpenditureToDate || p.cumExpUpToPrevFy || 0),
      curYrExp: p.curYrExp || 0,
    }));

  const progressLineData = myProjects.map((p, idx) => ({ name: p.missionProjectShortName || `P${idx + 1}`, progress: computeProgress(p) }));

  const handleExportCSV = () => {
    const rows = filteredProjects.map(p => ({
      projectCode: p.missionProjectCode,
      name: p.missionProjectFullName,
      shortName: p.missionProjectShortName,
      status: p.regStatus === 'R' ? 'Active' : 'Inactive',
      sanctionedCost: p.sanctionedCost,
      endDate: p.originalSchedule
    }));
    const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map(r => Object.values(r).map(v => `"${String(v ?? '')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(key); setSortDir('asc'); }
  };

  const handlePrintDashboard = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Project Director Dashboard - ${new Date().toLocaleDateString()}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #1a1a1a; text-align: center; }
              .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
              .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
              .stat-value { font-size: 24px; font-weight: bold; margin: 10px 0; }
              .stat-label { color: #666; font-size: 12px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              th { background-color: #f0f0f0; font-weight: bold; }
              .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <h1>Project Director Dashboard</h1>
            <p style="text-align: center; color: #666;">Generated on ${new Date().toLocaleString()}</p>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total Projects</div>
                <div class="stat-value">${stats.total}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">On Track</div>
                <div class="stat-value" style="color: #10B981;">${stats.onTrack}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Delayed</div>
                <div class="stat-value" style="color: #EF4444;">${stats.delayed}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Total Budget</div>
                <div class="stat-value" style="color: #7C3AED;">₹${(stats.sanctionedCost || 0).toLocaleString()}</div>
              </div>
            </div>

            <h2>Projects Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Budget (₹)</th>
                  <th>Progress</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                ${filteredProjects.map((p) => `
                  <tr>
                    <td>${p.missionProjectFullName} (${p.missionProjectShortName})</td>
                    <td>${p.regStatus === 'R' ? 'Active' : 'Inactive'}</td>
                    <td>${p.sanctionedCost}Cr</td>
                    <td>${computeProgress(p)}%</td>
                    <td>${new Date(p.originalSchedule).toLocaleDateString('en-IN')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>This is a confidential document. © Project Management System ${new Date().getFullYear()}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const handleExportChartsPNG = async () => {
    if (!chartsContainerRef.current) return;
    try {
      // Simple approach: use SVG export or trigger browser print
      const chartHTML = chartsContainerRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=600,width=1200');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Project Director Charts - ${new Date().toLocaleDateString()}</title>
              <style>
                body { margin: 20px; font-family: Arial, sans-serif; }
                .charts-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                svg { max-width: 100%; height: auto; }
              </style>
            </head>
            <body>
              <h1>Project Director Dashboard - Charts & Analytics</h1>
              <p>Generated on ${new Date().toLocaleString()}</p>
              <div class="charts-container">${chartHTML}</div>
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (err) {
      console.error('Error exporting charts:', err);
      alert('Could not export charts. Try using your browser\'s print functionality.');
    }
  };

  // Derived list after search, filter and sort
  const filteredProjects = myProjects
    .filter(p => {
      const q = query.trim().toLowerCase();
      if (q) {
        const inName = (p.missionProjectFullName || '').toLowerCase().includes(q);
        const inShort = (p.missionProjectShortName || '').toLowerCase().includes(q);
        const inCode = (p.missionProjectCode || '').toLowerCase().includes(q);
        if (!inName && !inShort && !inCode) return false;
      }
      if (statusFilter === 'active') return p.regStatus === 'R';
      if (statusFilter === 'inactive') return p.regStatus !== 'R';
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
        case 'status': av = a.regStatus || ''; bv = b.regStatus || ''; break;
        default: break;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const handleNewProject = async (data: Record<string, string>) => {
    try {
      setError(null);
      
      // Parse sanctioned amount to number
      const sanctionedAmount = parseFloat(data.sanctionedAmount) || 0;
      
      const projectData: ProjectDetailRequest = {
        missionProjectFullName: data.projectName,
        missionProjectShortName: data.shortName,
        budgetCode: data.budgetCode,
        projectTypesCode: 'DEFAULT',
        programmeTypeCode: 'DEFAULT',
        leadCentreCode: 'DEFAULT',
        sanctionedAuthority: 'Not Specified',
        individualCombinedSanctionCost: sanctionedAmount.toString(),
        sanctionedCost: sanctionedAmount * 1000000,
        dateOffs: new Date().toISOString().split('T')[0],
        originalSchedule: data.endDate,
        missionProjectDirector: user?.employeeCode || '',
        programmeDirector: user?.employeeCode || '',
      };

      await projectDetailService.createProjectDetail(projectData);
      
      setShowNewProjectForm(false);
      alert('Project created successfully!');
      
      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      alert(`Error creating project: ${errorMessage}`);
    }
  };

  const newProjectFields = [
    { name: 'projectName', label: 'Project Name', type: 'text' as const, placeholder: 'Enter project name', required: true },
    { name: 'shortName', label: 'Short Name', type: 'text' as const, placeholder: 'e.g., ALVD-2024', required: true },
    { name: 'programmeName', label: 'Programme Name', type: 'text' as const, placeholder: 'Enter programme name', required: true },
    { name: 'budgetCode', label: 'Budget Code', type: 'text' as const, placeholder: 'e.g., LV-2024-001', required: true },
    { name: 'leadCentre', label: 'Lead Centre', type: 'text' as const, placeholder: 'Enter lead centre', required: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Launch Vehicles', label: 'Launch Vehicles' },
        { value: 'Satellite Communication', label: 'Satellite Communication' },
        { value: 'Infrastructure', label: 'Infrastructure & R&D' },
      ],
    },
    { name: 'sanctionedAmount', label: 'Sanctioned Amount (₹)', type: 'number' as const, required: true },
    { name: 'endDate', label: 'End Date', type: 'date' as const, required: true },
  ];

  return (
    <div className="space-y-8">
      {/* Header with CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-gray-600 mt-2">Manage your projects and track progress</p>
        </div>
     
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-semibold uppercase">Total Projects</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <FileText className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-semibold uppercase">On Track</p>
              <p className="text-4xl font-bold text-emerald-900 mt-2">{stats.onTrack}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

       

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-semibold uppercase">Delayed</p>
              <p className="text-4xl font-bold text-red-900 mt-2">{stats.delayed}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold uppercase">Total Budget</p>
              <p className="text-4xl font-bold text-purple-900 mt-2">₹{(stats.sanctionedCost || 0).toLocaleString()}</p>
            </div>
            <CheckSquare className="w-12 h-12 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Charts with Export/Print Options */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Analytics & Insights</h3>
            <p className="text-sm text-gray-600 mt-1">Real-time project metrics and performance indicators</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDashboard}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              title="Print Dashboard"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleExportChartsPNG}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              title="Export Charts"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div ref={chartsContainerRef} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Status Breakdown Chart */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <PieChartIcon className="w-5 h-5 text-slate-600" />
              <h4 className="text-sm font-semibold text-gray-700">Status Breakdown</h4>
            </div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={40} 
                    outerRadius={75} 
                    paddingAngle={2}
                    animationBegin={0}
                    animationDuration={600}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip 
                    formatter={(value) => `${value} projects`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-xs text-gray-600 flex justify-around">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Budgets & Expenditure Analysis */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-lg border border-blue-200 p-5 hover:shadow-lg transition-all">
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Budget vs Expenditure</h4>
                  <p className="text-xs text-gray-600">Sanctioned, Cumulative & Current Year Costs</p>
                </div>
              </div>
            </div>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={topBudgetProjects} margin={{ top: 15, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10, fill: '#475569' }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    label={{ value: 'Amount (₹Cr)', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } }}
                  />
                  <ReTooltip 
                    formatter={(value: any) => {
                      const formatted = (value).toFixed(2);
                      return `₹${formatted}Cr`;
                    }}
                    contentStyle={{ 
                      borderRadius: '10px', 
                      border: '2px solid #3b82f6',
                      backgroundColor: '#f0f9ff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    labelStyle={{ color: '#1e40af', fontWeight: 'bold', fontSize: '12px' }}
                  />
                 
                  <Bar 
                    dataKey="sanctionedCost" 
                    fill="#3b82f6" 
                    name="📊 Sanctioned Budget"
                    radius={[8, 8, 0, 0]} 
                    animationDuration={600}
                  />
                  <Bar 
                    dataKey="cumExpUpToPrevFy" 
                    fill="#10b981" 
                    name="✓ Cumulative Exp"
                    radius={[8, 8, 0, 0]} 
                    animationDuration={600}
                  />
                  <Bar 
                    dataKey="curYrExp" 
                    fill="#f59e0b" 
                    name="⚡ Current Year Exp"
                    radius={[8, 8, 0, 0]} 
                    animationDuration={600}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
         
          </div>

          {/* Project Progress Chart */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUpIcon className="w-5 h-5 text-slate-600" />
              <h4 className="text-sm font-semibold text-gray-700">Progress Trend</h4>
            </div>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={progressLineData.slice(0, 8)} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <ReTooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#06b6d4" 
                    strokeWidth={2.5}
                    dot={{ fill: '#06b6d4', r: 3 }}
                    activeDot={{ r: 5 }}
                    animationDuration={600}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="flex items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="px-4 py-2 border border-gray-200 rounded-lg w-full max-w-sm"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={handleExportCSV} className="ml-auto px-4 py-2 bg-slate-800 text-white rounded-lg text-sm">Export CSV</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Your Projects</h3>
        </div>
        
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading your projects...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border-t border-red-200">
            <p className="text-red-700 font-semibold">Error loading projects</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={fetchProjects}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold text-sm"
            >
              Retry
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600 mb-4">No projects yet. Create your first project!</p>
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer">Project Name</th>
                  <th onClick={() => handleSort('status')} className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer">Status</th>
                  <th onClick={() => handleSort('budget')} className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer">Budget</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
                  <th onClick={() => handleSort('endDate')} className="px-6 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer">End Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => {
                  return (
                    <tr key={project.missionProjectCode} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{project.missionProjectFullName}</p>
                        <p className="text-sm text-gray-500">{project.missionProjectShortName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.regStatus === 'R' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>
                          {project.regStatus === 'R' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">₹{project.sanctionedCost}Cr</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                              style={{ width: `${computeProgress(project)}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-900">{computeProgress(project)}%</span>
                            <svg width="60" height="20" viewBox="0 0 60 20" className="inline-block">
                              <polyline
                                fill="none"
                                stroke="#60A5FA"
                                strokeWidth={2}
                                points={makeSparklinePoints(computeProgress(project)).map((v, i) => `${(i * 10)},${20 - (v / 5)}`).join(' ')}
                              />
                            </svg>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(project.originalSchedule).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onNavigate('my-projects', project.missionProjectCode, { project })}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Project Form Modal */}
      {showNewProjectForm && (
        <CoreUIForm
          title="Create New Project"
          description="Define a new project with budget and timeline"
          fields={newProjectFields}
          onSubmit={handleNewProject}
          onCancel={() => setShowNewProjectForm(false)}
          submitText="Create Project"
        />
      )}
    </div>
  );
};

export default ProjectDirectorDashboard;

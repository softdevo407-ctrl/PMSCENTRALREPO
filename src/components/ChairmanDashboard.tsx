import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  DollarSign,
  CheckCircle,
  Clock,
  BarChart3,
  LogOut,
  Loader2,
  Layout,
  LayoutDashboard,
  Rocket,
  Globe,
  Search,
  Bell,
  Sparkles,
  Filter,
  ReceiptIndianRupee,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { projectDetailService, ProjectDetailResponse } from '../services/projectDetailService';
import { categoryStatsService } from '../services/categoryStatsService';
import { ProjectCategoryService } from '../services/projectCategoryService';
import { projectActualsService, ProjectActuals } from '../services/projectActualsService';
import { CategoryStatsCards } from './CategoryStatsCards';
import { SAMPLE_REVISION_REQUESTS } from '../pbemData';
import ProjectListModal from './ProjectListModal';

interface ChairmanDashboardProps {
  userName: string;
  onNavigate: (page: string, category?: string, filter?: 'all' | 'on-track' | 'delayed') => void;
  onLogout?: () => void;
}

const ChairmanDashboard: React.FC<ChairmanDashboardProps> = ({ userName, onNavigate, onLogout }) => {
  const [allProjects, setAllProjects] = useState<ProjectDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [categories, setCategories] = useState<Map<string, any>>(new Map());
  const [chartData, setChartData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalProjects, setModalProjects] = useState<ProjectDetailResponse[]>([]);
  const [projectActualsData, setProjectActualsData] = useState<any[]>([]);
  const [enrichedActualsData, setEnrichedActualsData] = useState<any[]>([]);
  const [selectedProjectForCashFlow, setSelectedProjectForCashFlow] = useState<string>('');
  
  useEffect(() => {
    fetchAllProjects();
    fetchCategoryData();
    fetchProjectActuals();
  }, []);

  // Enrich actuals data with project names
  useEffect(() => {
    if (projectActualsData.length > 0 && allProjects.length > 0) {
      const enriched = projectActualsData.map(actual => {
        const project = allProjects.find(p => p.missionProjectCode === actual.missionProjectCode);
        return {
          ...actual,
          projectFullName: project?.missionProjectFullName || 'Unknown Project',
          projectShortName: project?.missionProjectShortName || 'N/A'
        };
      });
      setEnrichedActualsData(enriched);
      
      // Set default selected project to first available
      if (!selectedProjectForCashFlow && enriched.length > 0) {
        const firstProjectCode = [...new Set(enriched.map(a => a.missionProjectCode))][0];
        setSelectedProjectForCashFlow(firstProjectCode);
      }
      
      console.log('✅ Enriched actuals data:', enriched);
      console.log('📊 Total enriched records:', enriched.length);
      console.log('🔍 Unique project codes:', [...new Set(enriched.map(a => a.missionProjectCode))]);
      
      // Debug: Show breakdown by project
      const projectBreakdown = enriched.reduce((acc: any, item: any) => {
        const key = item.missionProjectCode;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item.year);
        return acc;
      }, {});
      console.log('📈 Years per project:', projectBreakdown);
      



      // Check for duplicates
      const uniqueRecords = new Set(enriched.map(item => `${item.missionProjectCode}-${item.year}`));
      console.log('🔎 Unique (code-year) combinations:', uniqueRecords.size);
      console.log('⚠️ Total records received:', enriched.length);
      if (uniqueRecords.size !== enriched.length) {
        console.warn('⚠️ DUPLICATE RECORDS DETECTED!');
        enriched.forEach((item, index) => {
          const key = `${item.missionProjectCode}-${item.year}`;
          const occurrences = enriched.filter(i => `${i.missionProjectCode}-${i.year}` === key).length;
          if (occurrences > 1) {
            console.warn(`  Duplicate: ${key} appears ${occurrences} times at index ${index}`);
          }
        });
      }
    }
  }, [projectActualsData, allProjects]);
  
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

  const fetchCategoryData = async () => {
    try {
      // Fetch all categories
      const allCategories = await ProjectCategoryService.getAllProjectCategories();
      const categoryMap = new Map<string, any>();
      allCategories.forEach((cat) => {
        categoryMap.set(cat.projectCategoryCode, {
          code: cat.projectCategoryCode,
          fullName: cat.projectCategoryFullName
        });
      });
      setCategories(categoryMap);

      // Fetch category stats - same as CategoryStatsCards
      console.log('🔍 Fetching category stats...');
      const stats = await categoryStatsService.getCategoryStats();
      console.log('📊 Category Stats Response:', stats);
      
      if (stats && Array.isArray(stats)) {
        setCategoryStats(stats);
        console.log('✅ Category stats loaded:', stats);
      } else {
        console.log('⚠️ Category stats not an array:', stats);
        setCategoryStats([]);
      }
    } catch (err) {
      console.error('Error fetching category data:', err);
      setCategoryStats([]);
    }
  };

  const fetchProjectActuals = async () => {
    try {
      console.log('📊 Fetching project actuals...');
      const actuals = await projectActualsService.getAllProjectActuals();
      console.log('✅ Project actuals loaded:', actuals);
      
      if (actuals && Array.isArray(actuals)) {
        setProjectActualsData(actuals);
      } else {
        console.log('⚠️ Project actuals not an array:', actuals);
        setProjectActualsData([]);
      }
    } catch (err) {
      console.error('Error fetching project actuals:', err);
      setProjectActualsData([]);
    }
  };

  // Compute category distribution from categoryStats service data
  const computeCategoryDistribution = () => {
    if (!categoryStats || categoryStats.length === 0) {
      console.log('❌ No categoryStats data available');
      return [];
    }

    console.log('📊 Processing categoryStats:', categoryStats);

    const result = categoryStats.map((stat: any) => ({
      name: categories.get(stat.projectCategoryCode)?.fullName || stat.projectCategoryCode || 'Uncategorized',
      value: stat.projectCount || 0,
      code: stat.projectCategoryCode
    })).filter(item => item.value > 0);

    console.log('✅ Final Distribution Data:', result);
    return result;
  };

  // Compute category breakdown with On Track vs Delayed counts
  const computeCategoryBreakdown = () => {
    if (!allProjects || allProjects.length === 0) {
      console.log('❌ No projects data available for category breakdown');
      return [];
    }

    // Group projects by category
    const categoryMap = new Map<string, any[]>();
    
    allProjects.forEach((project) => {
      const categoryCode = project.projectCategoryCode || 'UNCATEGORIZED';
      if (!categoryMap.has(categoryCode)) {
        categoryMap.set(categoryCode, []);
      }
      categoryMap.get(categoryCode)?.push(project);
    });

    // Compute status breakdown for each category
    const breakdown: any[] = [];
    
    categoryMap.forEach((projects, categoryCode) => {
      const onTrackCount = projects.filter((p) => !isProjectDelayed(p)).length;
      const delayedCount = projects.filter((p) => isProjectDelayed(p)).length;
      const totalCount = projects.length;

      breakdown.push({
        code: categoryCode,
        name: categories.get(categoryCode)?.fullName || categoryCode || 'Uncategorized',
        total: totalCount,
        onTrack: onTrackCount,
        delayed: delayedCount,
        projects: projects
      });
    });

    console.log('✅ Category Breakdown:', breakdown);
    return breakdown.sort((a, b) => b.total - a.total);
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

  // Determine delay using originalSchedule from backend. If originalSchedule is a valid date
  // and it is before now, we consider the project delayed. Fall back to durationInMonths
  // logic if originalSchedule is missing or invalid.
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

  const computeProgress = (project: ProjectDetailResponse) => {
    const done = project.cumExpUpToPrevFy || 0;
    const total = project.sanctionedCost || 1;
    const pct = Math.round(Math.min(100, Math.max(0, (done / total) * 100)));
    return isFinite(pct) ? pct : 0;
  };

  // Calculate total sanctioned and expenditure costs
  const totalSanctionedCost = allProjects.reduce((sum, p) => {
    const sanctionedCost = typeof p.sanctionedCost === 'number' ? p.sanctionedCost : parseFloat(String(p.sanctionedCost || 0));
    return sum + (isFinite(sanctionedCost) ? sanctionedCost : 0);
  }, 0);

  const totalExpenditureCost = allProjects.reduce((sum, p) => {
    const expenditure = typeof p.cumulativeExpenditureToDate === 'number' ? p.cumulativeExpenditureToDate : parseFloat(String(p.cumulativeExpenditureToDate || 0));
    return sum + (isFinite(expenditure) ? expenditure : 0);
  }, 0);

  const stats = {
    total: allProjects.length,
    onTrack: allProjects.filter((p) => !isProjectDelayed(p)).length,
    delayed: allProjects.filter((p) => isProjectDelayed(p)).length,
    completed: allProjects.filter((p) => getProjectStatus(p) === 'Completed').length,
    totalBudget: totalSanctionedCost,
    totalExpenditure: totalExpenditureCost,
    avgCompletion: Math.round(
      allProjects.reduce((sum, p) => sum + computeProgress(p), 0) /
        (allProjects.length || 1)
    ),
    pendingApprovals: allRevisions.filter((r) => r.status === 'PENDING').length,
  };

  const criticalProjects = allProjects.filter((p) => getProjectStatus(p) === 'At Risk' || getProjectStatus(p) === 'Delayed');

  const handleOpenModal = (title: string, projects: ProjectDetailResponse[]) => {
    setModalTitle(title);
    setModalProjects(projects);
    setModalOpen(true);
  };
const prevMonthLabel = new Date(
  new Date().getFullYear(),
  new Date().getMonth() - 1,
  1
).toLocaleString("en-US", { month: "short", year: "numeric" });
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
    

      {/* Main Content */}
      <main className="w-full px-3 py-3 md:px-4 md:py-4">
        {loading ? (
          <div className="p-8 md:p-12 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border border-slate-200" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-800 text-center font-bold text-lg">Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-300 rounded-2xl shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
            <p className="text-red-800 font-bold text-lg">Error loading projects</p>
            <p className="text-red-700 text-base mt-2 font-semibold">{error}</p>
            <button
              onClick={fetchAllProjects}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-base transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* <div className="bg-gradient-to-r  mb-5 shadow-xl border border-blue-300/50 backdrop-blur-sm"> */}
            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
                {/* Left Logo */}
                <div className="flex items-center justify-center">
                  <img src="photos/IndianEmblem.jpg" alt="Indian Emblem" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
                </div>

                {/* Center Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-center gap-4 mb-2">

                    <h2 className="text-4xl md:text-5xl font-bold text-blue " style={{ fontFamily: 'Arial, sans-serif', color: 'black', marginLeft: '155px' }}>Project Management System</h2>
                  </div>
                  {/* <p className="text-white/90 text-sm font-semibold ml-12">Executive Overview & Real-time Project Analytics</p> */}
                </div>

                {/* Right Logo and Logout Button */}
                <div className="flex items-center justify-center gap-6">
                  <img src="/photos/isroLogo.svg" alt="ISRO Logo" className="h-30 w-30 md:h-20 md:w-25 object-contain" />
                  
                  {/* Logout Button */}
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                      title="Logout from system"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5" style={{paddingTop:'10px'}}>
              {/* Total Projects Card */}
              <div 
                onClick={() => handleOpenModal('All Projects', allProjects)}
className="bg-gradient-to-br from-blue-600 to-blue-600 p-2 border border-blue-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 bg-blue-200 group-hover:bg-blue-300 transition-colors">
                    <BarChart3 className="w-4 h-4 text-blue-700" />
                  </div>
                  <h4 className="text-3xl font-bold text-white uppercase tracking-wide">Total Projects</h4>
                </div>
                <div className="text-bottom" style={{paddingTop: '12px',textAlign: 'end',paddingRight: '16px'}}>
                  <span className="text-7xl font-bold text-white" style={{paddingLeft: '85px'}}>{stats.total}</span>
                </div>
              </div>

              {/* On Track Card */}
              <div 
                onClick={() => {
                  const onTrackProjects = allProjects.filter(p => !isProjectDelayed(p));
                  handleOpenModal('Projects On Track', onTrackProjects);
                }}
                className="bg-gradient-to-br from-blue-600 to-blue-600 p-2 border border-blue-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 bg-green-200 group-hover:bg-green-300 transition-colors">
                    <CheckCircle className="w-4 h-4 text-green-700" />
                  </div>
                  <h4 className="text-3xl font-bold text-white uppercase tracking-wide">On Track</h4>
                </div>
                <div className="text-bottom" style={{paddingTop: '12px',textAlign: 'end',paddingRight: '16px'}}>
                  <span className="text-7xl font-bold text-green-500" style={{paddingLeft: '85px'}}>{stats.onTrack}</span>
                </div>
              </div>

              {/* Delayed Card */}
            <div 
  onClick={() => {
    const delayedProjects = allProjects.filter(p => isProjectDelayed(p));
    handleOpenModal('Projects Delayed', delayedProjects);
  }}
  className="bg-gradient-to-br from-blue-600 to-blue-600 p-2 border border-blue-200 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
>
  {/* Header Row */}
  <div className="flex items-center gap-2 mb-1">
    <div className="p-1 bg-red-200 group-hover:bg-red-300 transition-colors" style={{marginTop: '-15px'}}>
      <AlertCircle className="w-4 h-4 text-red-700" />
    </div>

    {/* Text Column */}
    <div className="flex flex-col leading-tight">
      <h4 className="text-3xl font-bold text-white uppercase tracking-wide">
        Delayed
      </h4>
      <span className="text-xs text-white">
        Based on Schedule
      </span>
    </div>
  </div>

  {/* Number */}
  <div className="pt-3 text-end pr-4">
    <span className="text-7xl font-bold text-red-500">
      {stats.delayed}
    </span>
  </div>
</div>


              {/* Budget Card */}
              <div 
                onClick={() => handleOpenModal('Budget Analysis', allProjects.sort((a, b) => (b.sanctionedCost || 0) - (a.sanctionedCost || 0)))}
                className="p-2 transition-all cursor-pointer group border border-green-300 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#1cb876' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="p-1 bg-[rgb(253,219,85)] group-hover:bg-[rgb(245,205,70)] transition-colors">
                    <ReceiptIndianRupee className="w-4 h-4 text-orange" />
                  </div>
                  <h4 className="text-3xl font-bold text-white uppercase tracking-wide">Budget</h4>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white text-lg">Sanctioned</span>
                    <span className="font-bold text-white text-xl">₹{(stats.totalBudget).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-lg">Expenditure</span>
                      <span className="text-xs text-white">as on {prevMonthLabel}</span>
                    </div>
                    <span className="font-bold text-white text-xl">
                      ₹{stats.totalExpenditure.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} Cr
                    </span>
                  </div>
                  
                  {/* Budget Utilization Progress Bar */}
                  <div className="pt-1 border-t border-white/30">
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="font-bold text-white text-sm">Utilized</span>
                      <span className="font-bold text-white text-sm">
                        {stats.totalBudget > 0 ? ((stats.totalExpenditure / stats.totalBudget) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 transition-all duration-300 rounded-full shadow-lg"
                        style={{ width: `${Math.min(100, stats.totalBudget > 0 ? (stats.totalExpenditure / stats.totalBudget) * 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Cards Section */}
            {/* Category Cards Section */}
            <div className="mb-4">
              <CategoryStatsCards 
                onNavigate={onNavigate}
                employeeCode="CHAIRMAN"
                userRole="CHAIRMAN"
              />
            </div>

            {/* Analytics Section - Cash Flow Chart */}
            {/* <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50" style={{ fontFamily: 'Arial, sans-serif' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h3 className="text-3xl font-black text-black">Cash Flow Analysis</h3>
                </div>
                <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest">
                   <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">Planned</span>
                   <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full">Actual</span>
                </div>
              </div>

              {/* Project Selector */}
              {/* <div className="mb-3 flex items-center gap-2">
                <label className="font-black text-black text-sm">Select Project:</label>
                <select
                  value={selectedProjectForCashFlow}
                  onChange={(e) => setSelectedProjectForCashFlow(e.target.value)}
                  className="px-3 py-2 font-black rounded-lg border border-slate-200 bg-white text-black hover:border-blue-400 transition-all text-sm"
                >
                  <option value="">-- All Projects --</option>
                  {[...new Set(enrichedActualsData.map(a => a.missionProjectCode))].map(code => {
                    const projectData = enrichedActualsData.find(a => a.missionProjectCode === code);
                    return (
                      <option key={code} value={code}>
                        {code} - {projectData?.projectFullName || 'Unknown'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {projectActualsData.length === 0 ? (
                <div className="w-full h-48 flex items-center justify-center">
                  <p className="text-black text-sm font-bold">Loading Cash Flow data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart
                    data={(() => {
                      const chartData = selectedProjectForCashFlow
                        ? enrichedActualsData
                            .filter(a => a.missionProjectCode === selectedProjectForCashFlow)
                            .sort((a, b) => a.year - b.year)
                            .map(a => ({
                              year: a.year,
                              planned: parseFloat(a.planned) || 0,
                              actuals: parseFloat(a.actuals) || 0,
                              projectCode: a.missionProjectCode,
                              projectName: a.projectFullName
                            }))
                        : enrichedActualsData
                            .sort((a, b) => {
                              if (a.missionProjectCode !== b.missionProjectCode) {
                                return a.missionProjectCode.localeCompare(b.missionProjectCode);
                              }
                              return a.year - b.year;
                            })
                            .map(a => ({
                              year: a.year,
                              planned: parseFloat(a.planned) || 0,
                              actuals: parseFloat(a.actuals) || 0,
                              projectCode: a.missionProjectCode,
                              projectName: a.projectFullName
                            }));
                      
                      return chartData;
                    })()}
                    margin={{ top: 15, right: 30, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={true} />
                    <XAxis 
                      dataKey="year" 
                      stroke="#4b5563" 
                      tick={{ fontSize: 13, fontWeight: 'bold' }}
                      label={{ value: 'Year', position: 'insideBottomRight', offset: -5, fontWeight: 'bold', fontSize: 14 }}
                    />
                    <YAxis 
                      stroke="#4b5563" 
                      tick={{ fontSize: 13, fontWeight: 'bold' }}
                      label={{ value: 'Amount (₹ Cr)', angle: -90, position: 'insideLeft', fontWeight: 'bold' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#f5f5dc', 
                        border: '2px solid #16a34a', 
                        borderRadius: '8px', 
                        fontWeight: 'bold'
                      }}
                      labelStyle={{ color: '#333', fontWeight: 'bold' }}
                      cursor={{ stroke: '#16a34a', strokeWidth: 2 }}
                      content={({ payload, label }) => {
                        if (!payload || !payload.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-green-100/95 rounded-lg border border-green-700 shadow-xl">
                            <p className="text-sm font-bold text-green-900 mb-1">🏢 {data.projectName}</p>
                            <p className="text-xs font-semibold text-slate-700 mb-2">📅 Year: {data.year}</p>
                            <div className="space-y-1 text-xs font-semibold text-slate-800">
                              <p>📊 Planned: <span className="text-blue-700 font-black">₹{data.planned.toFixed(2)} Cr</span></p>
                              <p>✓ Actuals: <span className="text-green-700 font-black">₹{data.actuals.toFixed(2)} Cr</span></p>
                              <p>📈 Variance: <span className={data.planned - data.actuals >= 0 ? 'text-red-700 font-black' : 'text-blue-700 font-black'}>₹{Math.abs(data.planned - data.actuals).toFixed(2)} Cr {data.planned - data.actuals >= 0 ? '(Underspend)' : '(Overspend)'}</span></p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        color: '#4b5563', 
                        fontSize: '13px', 
                        paddingTop: '12px', 
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        borderRadius: '6px',
                        padding: '8px'
                      }} 
                      verticalAlign="bottom" 
                      height={25}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="planned" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      name="Planned Amount" 
                      dot={{ fill: '#3b82f6', r: 5 }}
                      activeDot={{ r: 7 }}
                      isAnimationActive={true}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actuals" 
                      stroke="#16a34a" 
                      strokeWidth={3} 
                      name="Actuals Amount" 
                      dot={{ fill: '#16a34a', r: 5 }}
                      activeDot={{ r: 7 }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div> */} 

          
          </>
        )}
      </main>

      {/* Project List Modal */}
      <ProjectListModal 
        isOpen={modalOpen}
        title={modalTitle}
        projects={modalProjects}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ChairmanDashboard;


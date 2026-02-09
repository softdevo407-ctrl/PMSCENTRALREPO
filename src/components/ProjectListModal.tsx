import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { ProjectDetailResponse } from '../services/projectDetailService';
import { projectStatusCodeService, ProjectStatusCodeResponse } from '../services/projectStatusCodeService';
import { ProjectCategoryService } from '../services/projectCategoryService';
import { ProgrammeTypeService } from '../services/programmeTypeService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// 1. Import the service
import { employeeDetailsService } from '../services/employeeDetailsService';
import { projectActualsService } from '../services/projectActualsService';

// --- 2. Helper Component for fetching Director Name ---
const ProjectDirectorDisplay = ({ code }: { code: string }) => {
  const [directorName, setDirectorName] = useState<string>(code || "N/A");

  useEffect(() => {
    let isMounted = true;

    const fetchDirectorName = async () => {
      if (!code) return;

      try {
        const details = await employeeDetailsService.getEmployeeDetailsByCode(code);
        if (isMounted && details && details.name) {
          setDirectorName(details.name);
        }
      } catch (error) {
        // If fetch fails, we simply keep displaying the code as fallback
        console.error(`Error fetching director name for code ${code}`, error);
      }
    };

    fetchDirectorName();

    return () => {
      isMounted = false;
    };
  }, [code]);

  return <span className="text-black-600 font-bold">{directorName} - {code}</span>;
};
// --------------------------------------------------

interface ProjectListModalProps {
  isOpen: boolean;
  title: string;
  projects: ProjectDetailResponse[];
  onClose: () => void;
  categoryName?: string;
  categoryCode?: string;
}

const ProjectListModal: React.FC<ProjectListModalProps> = ({ isOpen, title, projects, onClose, categoryName, categoryCode }) => {
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({}); // programmeTypeCode → categoryFullName
  const [showCashFlowModal, setShowCashFlowModal] = useState(false);
  const [selectedProjectForCashFlow, setSelectedProjectForCashFlow] = useState<ProjectDetailResponse | null>(null);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [loadingCashFlow, setLoadingCashFlow] = useState(false);
  const [projectCashFlowMap, setProjectCashFlowMap] = useState<Record<string, any[]>>({}); // Preloaded cash flow data for all projects

  useEffect(() => {
    if (isOpen) {
      loadStatusCodes();
      loadCategoryNames();
      preloadAllCashFlowData(); // Preload cash flow for all projects
    }
  }, [isOpen, projects]);

  const loadStatusCodes = async () => {
    try {
      const statuses = await projectStatusCodeService.getAllProjectStatusCodes();
      const map: Record<string, string> = {};
      statuses.forEach((status: ProjectStatusCodeResponse) => {
        map[status.projectStatusCode] = status.projectStatusFullName;
      });
      setStatusMap(map);
    } catch (error) {
      console.error('Error loading status codes:', error);
    }
  };

  const loadCategoryNames = async () => {
    try {
      console.log('📊 loadCategoryNames called with projects:', projects.length);
      
      if (!projects || projects.length === 0) {
        console.log('⚠️ No projects available, skipping category loading');
        return;
      }

      // Collect all unique programmeTypeCodes from projects
      const uniqueProgrammeTypeCodes = new Set<string>();
      projects.forEach((project) => {
        if (project.programmeTypeCode) {
          uniqueProgrammeTypeCodes.add(project.programmeTypeCode);
        }
      });

      console.log('🔍 Unique programmeTypeCodes found:', Array.from(uniqueProgrammeTypeCodes));

      if (uniqueProgrammeTypeCodes.size === 0) {
        console.warn('⚠️ No programme type codes found in projects');
        return;
      }

      // For each programmeTypeCode, do two-step lookup:
      // Step 1: getProgrammeTypeByCode() → projectCategoryCode
      // Step 2: getProjectCategoryByCode() → projectCategoryFullName
      const map: Record<string, string> = {};
      for (const programmeTypeCode of uniqueProgrammeTypeCodes) {
        try {
          // console.log(`🔄 Step 1: Fetching programme type for ${programmeTypeCode}`);
          const programmeType = await ProgrammeTypeService.getProgrammeTypeByCode(programmeTypeCode);
          const projectCategoryCode = programmeType.projectCategoryCode;
          // console.log(`  ✓ Found projectCategoryCode: ${projectCategoryCode}`);

          // console.log(`🔄 Step 2: Fetching category for ${projectCategoryCode}`);
          const category = await ProjectCategoryService.getProjectCategoryByCode(projectCategoryCode);
          // console.log(`  ✓ Found category name: ${category.projectCategoryFullName}`);
          
          map[programmeTypeCode] = category.projectCategoryFullName;
        } catch (err) {
          console.warn(`⚠️ Could not fetch category for ${programmeTypeCode}:`, err);
          map[programmeTypeCode] = programmeTypeCode; // Fallback to code itself
        }
      }
      
      console.log('✅ Final Category Map loaded (programmeTypeCode → categoryFullName):', map);
      setCategoryMap(map);
    } catch (error) {
      console.error('❌ Error loading category names:', error);
    }
  };

  const preloadAllCashFlowData = async () => {
    try {
      const map: Record<string, any[]> = {};
      
      // Fetch cash flow data for all projects
      for (const project of projects) {
        if (project.missionProjectCode) {
          try {
            const actuals = await projectActualsService.getProjectActuals(project.missionProjectCode);
            map[project.missionProjectCode] = actuals && actuals.length > 0 ? actuals : [];
            console.log(`✅ Cash flow data preloaded for ${project.missionProjectCode}:`, actuals?.length || 0, 'items');
          } catch (error) {
            console.warn(`⚠️ Could not fetch cash flow for ${project.missionProjectCode}:`, error);
            map[project.missionProjectCode] = [];
          }
        }
      }
      
      setProjectCashFlowMap(map);
      console.log('✅ All project cash flow data preloaded:', map);
    } catch (error) {
      console.error('❌ Error preloading cash flow data:', error);
    }
  };

  const handleShowCashFlow = async (project: ProjectDetailResponse) => {
    console.log('🔍 DEBUG - Opening cash flow for project:', project.missionProjectCode);
    console.log('📊 Project expenditure:', project.cumulativeExpenditureToDate);
    
    setSelectedProjectForCashFlow(project);
    setShowCashFlowModal(true);
    setLoadingCashFlow(false);

    // Use preloaded data instead of fetching again
    const preloadedData = projectCashFlowMap[project.missionProjectCode];
    if (preloadedData && preloadedData.length > 0) {
      // Filter to show records where plannedCashFlow > 0 OR actualExpenditure > 0
      const filteredData = preloadedData.filter((item: any) => ((item.plannedCashFlow || 0) > 0) || ((item.actualExpenditure || 0) > 0));
      console.log('✅ Using preloaded cash flow data:', filteredData.length, 'items (filtered from', preloadedData.length, ')');
      setCashFlowData(filteredData);
    } else {
      console.warn('⚠️ No preloaded data available for project:', project.missionProjectCode);
      setCashFlowData([]);
    }
  };

  const exportCashFlowToExcel = () => {
    if (!selectedProjectForCashFlow || cashFlowData.length === 0) {
      alert('No cash flow data to export');
      return;
    }

    // Create CSV data
    const headers = ['Budget Year', 'Planned Cash Flow (₹ Cr)', 'Revised Estimates (₹ Cr)', 'Actual Expenditure (₹ Cr)', 'Variance (₹ Cr)'];
    const rows = cashFlowData.map((item: any) => {
      const variance = (item.actualExpenditure || 0) - (item.plannedCashFlow || 0);
      return [
        item.budgetYear || '',
        item.plannedCashFlow || 0,
        item.revisedEstimates || 0,
        item.actualExpenditure || 0,
        variance
      ];
    });

    // Create CSV string
    const csv = [
      `Project: ${selectedProjectForCashFlow.missionProjectFullName}`,
      `Code: ${selectedProjectForCashFlow.missionProjectCode}`,
      '',
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `CashFlow_${selectedProjectForCashFlow.missionProjectCode}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('✅ Cash flow data exported to Excel successfully');
  };

  // Helper functions - defined before use
  const isProjectDelayed = (project?: ProjectDetailResponse) => {
    try {
      if (!project) return false;
      
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
      // ignore
    }
    return (project?.durationInMonths || 0) > 0;
  };

  const getDelayDurationInDays = (project?: ProjectDetailResponse): number => {
    if (!project) return 0;
    
    // If timeOverrunApproval = 'YES' and revisedCompletionDate exists, use that instead
    const scheduleToCheck = project.timeOverrunApproval === 'YES' && project.revisedCompletionDate 
      ? project.revisedCompletionDate 
      : project.originalSchedule;
    
    if (!scheduleToCheck) return 0;
    try {
      const schedDate = new Date(scheduleToCheck);
      if (isNaN(schedDate.getTime())) return 0;
      
      const now = new Date();
      const diffMs = now.getTime() - schedDate.getTime();
      
      if (diffMs <= 0) return 0;
      
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 0;
    }
  };

  const calculateDelayDuration = (project?: ProjectDetailResponse): string => {
    if (!project) return 'N/A';
    
    // If timeOverrunApproval = 'YES' and revisedCompletionDate exists, use that instead
    const scheduleToCheck = project.timeOverrunApproval === 'YES' && project.revisedCompletionDate 
      ? project.revisedCompletionDate 
      : project.originalSchedule;
    
    if (!scheduleToCheck) return 'N/A';
    try {
      const schedDate = new Date(scheduleToCheck);
      if (isNaN(schedDate.getTime())) return 'N/A';
      
      const now = new Date();
      const diffMs = now.getTime() - schedDate.getTime();
      
      if (diffMs <= 0) return 'N/A';
      
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffMonths = parseFloat((diffDays / 30.44).toFixed(1)); // Average days per month
      const diffYears = parseFloat((diffDays / 365.25).toFixed(1));
      
      if (diffMonths < 12) {
        const monthsInt = Math.round(diffMonths);
        return `${monthsInt} ${monthsInt === 1 ? 'month' : 'months'}`;
      } else {
        return `${diffYears} ${diffYears === 1 ? 'yr' : 'yrs'}`;
      }
    } catch (e) {
      return 'N/A';
    }
  };

  const formatCurrency = (value: number): string => {
    if (!value) return '₹0 Cr';
    const formatted = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `₹${formatted} Cr`;
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-slate-50 text-slate-600 border-slate-100';
    const statusUpper = status.toUpperCase();
    if (statusUpper === 'Yet to Start') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (statusUpper === 'DELAYED') return 'bg-rose-50 text-rose-600 border-rose-100';
    if (statusUpper === 'AT_RISK') return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Export to Excel function
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = filteredProjects.map((project) => ({
        'Project Name': project.missionProjectFullName,
        'Short Name': project.missionProjectShortName,
        'Sanctioned Cost (Cr)': project.sanctionedCost || 0,
        'Expenditure (Cr)': project.cumulativeExpenditureToDate || 0,
        'Utilization %': project.sanctionedCost && project.sanctionedCost > 0 
          ? Math.round((project.cumulativeExpenditureToDate || 0) / project.sanctionedCost * 100)
          : 0,
        'Sanctioned Date': project.dateOffs
          ? new Date(project.dateOffs).toLocaleDateString('en-IN')
          : 'N/A',
          'Revised Sanctioned Date': project.revisedCompletionDate
            ? new Date(project.revisedCompletionDate).toLocaleDateString('en-IN')
            : 'N/A',
        'Original Schedule': project.originalSchedule 
          ? new Date(project.originalSchedule).toLocaleDateString('en-IN')
          : 'N/A',
        'Delay Duration': isProjectDelayed(project) 
          ? calculateDelayDuration(project)
          : 'On Track',
      }));

      // Create CSV content
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value);
            return stringValue.includes(',') ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
          }).join(',')
        )
      ].join('\n');

      // Create Blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `Projects_${title}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ Export successful! Downloaded CSV file');
    } catch (error) {
      console.error('❌ Error exporting to Excel:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  if (!isOpen) return null;

  // Filter projects by category if categoryCode is provided
  let filteredProjects = projects;
  if (categoryCode) {
    filteredProjects = projects.filter(p => p.projectCategoryCode === categoryCode);
  }

  // Sort delayed projects by longest waiting period first (descending)
  if (title.toLowerCase().includes('delayed')) {
    filteredProjects = [...filteredProjects].sort((a, b) => {
      const delayDaysA = getDelayDurationInDays(a);
      const delayDaysB = getDelayDurationInDays(b);
      return delayDaysB - delayDaysA; // Descending order (longest delay first)
    });
  }

  // Get category name by programmeTypeCode
  // This returns the projectCategoryFullName
  const getCategoryName = (code: string): string => {
    if (code === 'UNCATEGORIZED') return 'Uncategorized';
    
    // Look up in the pre-built categoryMap (which has already done the two-step lookup)
    const categoryFullName = categoryMap[code];
    
    if (categoryFullName) {
      return categoryFullName;
    }
    
    // console.warn(`⚠️ Category not found in map for ${code}. Available codes:`, Object.keys(categoryMap));
    return code; // Return code if full name not found
  };

  // Group projects by category name (full category) - sorts by project count descending
  const groupByCategory = (projectList: ProjectDetailResponse[]) => {
    const grouped = new Map<string, ProjectDetailResponse[]>();
    projectList.forEach((project) => {
      const programmeTypeCode = project.programmeTypeCode || 'UNCATEGORIZED';
      const categoryFullName = getCategoryName(programmeTypeCode);
      
      if (!grouped.has(categoryFullName)) {
        grouped.set(categoryFullName, []);
      }
      grouped.get(categoryFullName)?.push(project);
    });
    return Array.from(grouped.entries()).sort((a, b) => b[1].length - a[1].length);
  };

  // Render project card component
  const renderProjectCard = (project: ProjectDetailResponse, showCategory: boolean = false) => {
    const utilization = project.sanctionedCost && project.sanctionedCost > 0 
      ? Math.round((project.cumulativeExpenditureToDate || 0) / project.sanctionedCost * 100)
       : 0;



    return (
      <div
        key={project.missionProjectCode}
        className="bg-gradient-to-br from-slate-50 to-white border border-slate-300 p-4 rounded-lg hover:border-blue-400 transition-all hover:shadow-lg hover:shadow-blue-200"
      >
        {/* Title and Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
              {project.missionProjectFullName || project.missionProjectCode}
            </h3>
            <p className="text-xs text-slate-600 mt-1">{project.missionProjectShortName}</p>
          </div>
        </div>

        {/* Category - show for Delayed and Budget Analysis views */}
        {showCategory && (
          <div className="mb-3">
            <p className="text-xs text-slate-600 font-medium">Category: <span className="text-blue-600 font-bold">{getCategoryName(project.programmeTypeCode)}</span></p>
          </div>
        )}

        {/* 3. Updated Project Director Section */}
        <div className="mb-3">
          <p className="text-xs text-slate-600 font-medium">
            Project Director: <ProjectDirectorDisplay code={project.missionProjectDirector} />
          </p>
        </div>

        {/* Budget Info */}
        <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-600">💰 Sanctioned</span>
            <span className="text-sm font-bold text-blue-600">{formatCurrency(project.sanctionedCost || 0)}</span>
          </div>
          
          {/* Revised Sanctioned Cost - Show only if costOverrunApproval is YES */}
          {project.costOverrunApproval === 'YES' && project.revisedSanctionedCost !== null && project.revisedSanctionedCost !== undefined && project.revisedSanctionedCost > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-600">💰 Revised Sanctioned</span>
              <span className="text-sm font-bold text-purple-600">{formatCurrency(project.revisedSanctionedCost)}</span>
            </div>
          )}
          
          {(() => {
            const hasValidCashFlowData = projectCashFlowMap[project.missionProjectCode] && 
              projectCashFlowMap[project.missionProjectCode].some((item: any) => ((item.plannedCashFlow || 0) > 0) || ((item.actualExpenditure || 0) > 0));
            
            return (
              <div className={`flex justify-between items-center mb-3 relative group ${hasValidCashFlowData ? 'cursor-pointer hover:bg-green-100 p-2 rounded transition-all' : ''}`}
                   onClick={() => {
                     console.log('💬 Expenditure clicked! Project:', project.missionProjectCode, 'Exp:', project.cumulativeExpenditureToDate);
                     if (hasValidCashFlowData) {
                       handleShowCashFlow(project);
                     }
                   }}>
                <span className="text-xs text-slate-600">✓ Expenditure</span>
                <span className={`text-sm font-bold ${hasValidCashFlowData ? 'text-green-600 hover:text-green-700' : 'text-green-600'}`}>
                  {formatCurrency(project.cumulativeExpenditureToDate || 0)}
                </span>
                {/* Tooltip - Show if cash flow data with plannedCashFlow > 0 exists */}
                {hasValidCashFlowData && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                    💡 Click for Planned Cash Flow and Actual Expenditure
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-blue-600"></div>
                  </div>
                )}
                {/* Message - Show if no valid cash flow data available */}
                {!hasValidCashFlowData && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                    📊 Planned Cash Flow and Actual Expenditure Not Available
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-amber-600"></div>
                  </div>
                )}
              </div>
            );
          })()}
          
          {/* Utilization Bar */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-600">Utilization</span>
              <span className={`text-xs font-bold ${getUtilizationColor(utilization)}`}>
                {utilization}%
              </span>
            </div>
            <div className="w-full bg-slate-300 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  utilization >= 80 ? 'bg-green-500' : utilization >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(utilization, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Duration and Dates */}
        <div className="space-y-2 text-xs">
          {project.dateOffs && (
            <div className="flex justify-between">
              <span className="text-slate-600">📅 Sanctioned:</span>
              <span className="text-slate-800">
                {new Date(project.dateOffs).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: '2-digit' })}
              </span>
            </div>
          )}

          {/* Revised Sanctioned Date - Show only if timeOverrunApproval is YES */}
          {project.timeOverrunApproval === 'YES' && project.revisedDateOffs && (
            <div className="flex justify-between">
              <span className="text-slate-600">📅 Revised Sanctioned:</span>
              <span className="text-purple-600 font-semibold">
                {new Date(project.revisedDateOffs).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: '2-digit' })}
              </span>
            </div>
          )}

          {project.originalSchedule && (
            <div className="flex justify-between">
              <span className="text-slate-600">📅 Original Schedule:</span>
              <span className="text-slate-800">
                {new Date(project.originalSchedule).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: '2-digit' })}
              </span>
            </div>
          )}

          {/* Revised Schedule - Show only if timeOverrunApproval is YES */}
          {project.timeOverrunApproval === 'YES' && project.revisedCompletionDate && (
            <div className="flex justify-between">
              <span className="text-slate-600">📅 Revised Schedule:</span>
              <span className="text-purple-600 font-semibold">
                {new Date(project.revisedCompletionDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: '2-digit' })}
              </span>
            </div>
          )}

          {/* Delay Duration - Based on revised schedule if available, otherwise original schedule */}
          {isProjectDelayed(project) && (
            <div className="flex justify-between">
              <span className="text-slate-600">⏱️ Delay Duration:</span>
              <span className="text-red-600 font-semibold">
                {calculateDelayDuration(project)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-600/50 backdrop-blur-md">
      <div className="bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200 w-full max-w-6xl max-h-[90vh] flex flex-col rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-blue-50 via-slate-100 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 100 2H6a1 1 0 000 2H4a2 2 0 00-2 2v3a2 2 0 002 2h1a1 1 0 100-2H4v-3h10v3h-1a1 1 0 100 2h1a2 2 0 002-2V7a2 2 0 00-2-2h-2a1 1 0 100-2h2a2 2 0 012 2v1a1 1 0 102 0V5a4 4 0 00-4-4H8a4 4 0 00-4 4v1a1 1 0 102 0V5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
              {categoryName && (
                <p className="text-sm text-blue-600 font-bold mt-0.5">📁 {categoryName}</p>
              )}
              <p className="text-xs text-slate-600 mt-1">Total: {filteredProjects.length} projects</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-all border border-green-300 font-semibold flex items-center gap-2"
            >
               <Download className="w-5 h-5" />
              Export to Excel
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all border border-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-slate-600 text-center">No projects found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category-wise grouped view for Total, On Track, Budget Analysis, and Delayed */}
              {(title.toLowerCase().includes('total') || 
                title.toLowerCase().includes('all projects') ||
                title.toLowerCase().includes('on track') || 
                title.toLowerCase().includes('budget') ||
                title.toLowerCase().includes('delayed')) ? (
                groupByCategory(filteredProjects).map(([categoryFullName, categoryProjects]) => (
                  <div key={categoryFullName} className="border-l-4 border-blue-500 pl-4">
                    {/* Category Header */}
                    <div className="mb-4 pb-3 border-b-2 border-blue-200">
                      <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                        📁 {categoryFullName}
                        <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                          {categoryProjects.length} projects
                        </span>
                      </h3>
                    </div>

                    {/* Projects in category - Grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryProjects.map((project) => renderProjectCard(project, false))}
                    </div>
                  </div>
                ))
              ) : (
                /* Flat grid view for other types */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => renderProjectCard(project, true))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cash Flow Analysis Modal */}
      {showCashFlowModal && selectedProjectForCashFlow && cashFlowData.length > 0 && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-600/50 backdrop-blur-md">
          <div className="bg-gradient-to-br from-white via-slate-50 to-white border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col rounded-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-green-50 via-slate-100 to-blue-50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">📊 Cash Flow Analysis</h2>
                <p className="text-sm text-slate-600 mt-1">{selectedProjectForCashFlow.missionProjectFullName}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportCashFlowToExcel}
                  className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-all border border-green-300 flex items-center gap-2 px-3"
                  title="Export to Excel"
                >
                  <Download className="w-5 h-5" />
                  <span className="text-sm font-bold">Export</span>
                </button>
                <button
                  onClick={() => setShowCashFlowModal(false)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all border border-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingCashFlow ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-slate-600 text-lg">Loading cash flow data...</p>
                </div>
              ) : cashFlowData.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-slate-600 text-lg font-semibold mb-2">No Cash Flow Data Available</p>
                    <p className="text-slate-500 text-sm">Cash flow analysis data is not available for this project</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cash Flow Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <p className="text-sm text-green-600 font-bold mb-1">Sanctioned Cost</p>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(selectedProjectForCashFlow.sanctionedCost || 0)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600 font-bold mb-1">Total Expenditure</p>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(selectedProjectForCashFlow.cumulativeExpenditureToDate || 0)}
                      </p>
                    </div>
                  
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-600 font-bold mb-1">Utilization %</p>
                      <p className="text-2xl font-bold text-amber-700">
                        {selectedProjectForCashFlow.sanctionedCost && selectedProjectForCashFlow.sanctionedCost > 0 
                          ? Math.round((selectedProjectForCashFlow.cumulativeExpenditureToDate || 0) / selectedProjectForCashFlow.sanctionedCost * 100)
                          : 0}%
                      </p>
                    </div>
                  </div>

                  {/* Cash Flow LineChart */}
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-slate-900">📈 Cash Flow Trend</h4>
                      <div className="flex gap-2 text-xs font-bold">
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          Planned Cash Flow
                        </span>
                        {/* <span className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                          Revised Estimates
                        </span> */}
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          Actual Expenditure
                        </span>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={cashFlowData.map((item: any) => ({
                          budgetYearLabel: item.budgetYear ? `${item.budgetYear}-${item.budgetYear + 1}` : 'N/A',
                          budgetYear: item.budgetYear,
                          plannedCashFlow: parseFloat(item.plannedCashFlow) || 0,
                          revisedEstimates: parseFloat(item.revisedEstimates) || 0,
                          actualExpenditure: parseFloat(item.actualExpenditure) || 0,
                        })).sort((a: any, b: any) => a.budgetYear - b.budgetYear)}
                        margin={{ top: 15, right: 30, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={true} />
                        <XAxis 
                          dataKey="budgetYearLabel" 
                          stroke="#4b5563" 
                          tick={{ fontSize: 12, fontWeight: 'bold' }}
                          label={{ value: 'Budget Year', position: 'insideBottomRight', offset: -5, fontWeight: 'bold' }}
                        />
                        <YAxis 
                          stroke="#4b5563" 
                          tick={{ fontSize: 12, fontWeight: 'bold' }}
                          label={{ value: 'Amount (₹ Cr)', angle: -90, position: 'insideLeft', fontWeight: 'bold' }}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#f1f5f9', border: '2px solid #cbd5e1', borderRadius: '8px' }}
                          formatter={(value: any) => formatCurrency(value)}
                          cursor={{ stroke: '#94a3b8', strokeWidth: 2 }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border-2 border-slate-300 rounded-lg shadow-lg">
                                  <p className="font-bold text-slate-900 mb-2">{payload[0].payload.budgetYearLabel}</p>
                                  {payload.map((entry: any, index: number) => {
                                    if (entry.dataKey === 'plannedCashFlow') {
                                      return <p key={index} style={{ color: '#16a34a' }} className="font-semibold">Planned Cash Flow: {formatCurrency(entry.value)}</p>;
                                    }
                                    if (entry.dataKey === 'actualExpenditure') {
                                      return <p key={index} style={{ color: '#2563eb' }} className="font-semibold">Actual Expenditure: {formatCurrency(entry.value)}</p>;
                                    }
                                    return null;
                                  }).filter(Boolean)}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                          iconType="line"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="plannedCashFlow" 
                          stroke="#16a34a" 
                          strokeWidth={3}
                          dot={{ fill: '#16a34a', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Planned Cash Flow"
                        />
                        {/* <Line 
                          type="monotone" 
                          dataKey="revisedEstimates" 
                          stroke="#ea580c" 
                          strokeWidth={3}
                          dot={{ fill: '#ea580c', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Revised Estimates"
                        /> */}
                        <Line 
                          type="monotone" 
                          dataKey="actualExpenditure" 
                          stroke="#2563eb" 
                          strokeWidth={3}
                          dot={{ fill: '#2563eb', r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Actual Expenditure"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Cash Flow Summary Table */}
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2 text-left font-bold text-slate-700">Budget Year</th>
                          <th className="px-4 py-2 text-right font-bold text-slate-700">Planned Cash Flow (₹ Cr)</th>
                          {/* <th className="px-4 py-2 text-right font-bold text-slate-700">Revised Estimates (₹ Cr)</th> */}
                          <th className="px-4 py-2 text-right font-bold text-slate-700">Actual Expenditure (₹ Cr)</th>
                          <th className="px-4 py-2 text-right font-bold text-slate-700">Variance (₹ Cr)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cashFlowData.map((item: any, idx) => {
                          const variance = (item.actualExpenditure || 0) - (item.plannedCashFlow || 0);
                          
                          return (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                              <td className="px-4 py-2 font-semibold text-slate-900">{item.budgetYear ? `${item.budgetYear}-${item.budgetYear + 1}` : 'N/A'}</td>
                              <td className="px-4 py-2 text-right text-green-600 font-semibold">
                                {formatCurrency(item.plannedCashFlow || 0)}
                              </td>
                              {/* <td className="px-4 py-2 text-right text-orange-600 font-semibold">
                                {formatCurrency(item.revisedEstimates || 0)}
                              </td> */}
                              <td className="px-4 py-2 text-right text-blue-600 font-semibold">
                                {formatCurrency(item.actualExpenditure || 0)}
                              </td>
                              <td className="px-4 py-2 text-right font-semibold" style={{color: variance >= 0 ? '#16a34a' : '#dc2626'}}>
                                {formatCurrency(variance)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListModal;
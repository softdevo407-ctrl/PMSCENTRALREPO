import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Award, Loader2, Zap, Rocket, Satellite, Users, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { ProjectCategoryService } from '../services/projectCategoryService';
import { categoryStatsService } from '../services/categoryStatsService';
import { projectDetailService, ProjectDetailResponse } from '../services/projectDetailService';
import ProjectListModal from './ProjectListModal';
import ProjectCategoryWiseListModal from './ProjectCategoryWiseListModal';

interface CategoryStatData {
  projectCategoryCode: string;
  projectCategoryFullName: string;
  projectCategoryShortName: string;
  projectCount: number;
  onTrackCount: number;
  delayedCount: number;
  totalSanctionedCost: number;
  totalCumulativeExpenditure: number;
}

interface CategoryInfo {
  code: string;
  fullName: string;
}

interface CategoryStatsCardsProps {
  onNavigate?: (page: string, category?: string, filter?: 'all' | 'on-track' | 'delayed') => void;
  employeeCode?: string;
  userRole?: string;
  navigationData?: any;
}

// Bright color palette matching executive dashboard theme
const CATEGORY_COLORS = [
  { 
    bg: '#2563EB', 
    border: 'border-blue-800', 
    accent: 'text-white',
    shadow: 'shadow-blue-500',
    pattern: '#2563EB',
    bgColor: '#2563EB'
    
  },
  { 
    bg: '#2563EB', 
    border: 'border-purple-800', 
    accent: 'text-white',
    shadow: 'shadow-purple-500',
    pattern: '#2563EB',
    bgColor: '#2563EB'
  },
  { 
    bg: 'from-green-500 via-green-600 to-green-700', 
    border: 'border-green-800', 
    accent: 'text-white',
    shadow: 'shadow-green-500',
    pattern: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)',
    bgColor: '#2563EB'
  },
  { 
    bg: 'from-red-500 via-red-600 to-red-700', 
    border: 'border-red-800', 
    accent: 'text-white',
    shadow: 'shadow-red-500',
    pattern: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%)',
    bgColor: '#2563EB'
  },
  { 
    bg: 'from-orange-500 via-orange-600 to-orange-700', 
    border: 'border-orange-800', 
    accent: 'text-white',
    shadow: 'shadow-orange-500',
    pattern: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2) 0%, rgba(194, 65, 12, 0.2) 100%)',
    bgColor: '#2563EB'
  },
  { 
    bg: 'from-pink-500 via-pink-600 to-pink-700', 
    border: 'border-pink-800', 
    accent: 'text-white',
    shadow: 'shadow-pink-500',
    pattern: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(219, 39, 119, 0.2) 100%)',
    bgColor: '#2563EB'
  },
];

// Category-specific bright color mapping
const CATEGORY_COLOR_MAP: Record<string, typeof CATEGORY_COLORS[0]> = {
  launch: { 
    bg: 'from-orange-500 via-orange-600 to-orange-700', 
    border: 'border-orange-800', 
    accent: 'text-orange',
    shadow: 'shadow-orange-500',
    pattern: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%)',
    bgColor: '#f86604',
  },

  vehicle: { 
    bg: 'from-orange-500 via-orange-600 to-orange-700', 
    border: 'border-orange-800', 
    accent: 'text-orange',
    shadow: 'shadow-orange-500',
    pattern: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.2) 100%)',
    bgColor: '#f86604'
  },

  spacecraft: { 
    bg: 'from-blue-500 via-blue-600 to-blue-700', 
    border: 'border-blue-800', 
    accent: 'text-black',
    shadow: 'shadow-blue-500',
    pattern: 'linear-gradient(135deg, rgba(10, 87, 255, 0.2) 0%, rgba(29, 78, 216, 0.2) 100%)',
    bgColor: '#1c43b8'
  },

  craft: { 
    bg: 'from-blue-500 via-blue-600 to-blue-700', 
    border: 'border-blue-800', 
    accent: 'text-black',
    shadow: 'shadow-blue-500',
    pattern: 'linear-gradient(135deg, rgba(88, 239, 225, 0.2) 0%, rgba(88, 239, 225, 0.2) 100%)',
    bgColor: '#1c43b8'
  },

  gaganyaan: { 
    bg: 'from-orange-500 via-orange-600 to-orange-700', 
    border: 'border-orange-800', 
    accent: 'text-white',
    shadow: 'shadow-orange-500',
    pattern: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2) 0%, rgba(194, 65, 12, 0.2) 100%)',
    bgColor: '#b84f1c'
  },

  infrastructure: {
    bg: 'from-slate-600 via-slate-700 to-slate-800',
    border: 'border-slate-800',
    accent: 'text-white',
    shadow: 'shadow-slate-600',
    pattern: 'linear-gradient(135deg, rgba(71, 85, 105, 0.2) 0%, rgba(51, 65, 85, 0.2) 100%)',
    bgColor: '#d6ca1c'
  },

  research: {
    bg: 'from-purple-600 via-purple-700 to-purple-800',
    border: 'border-purple-800',
    accent: 'text-white',
    shadow: 'shadow-purple-600',
    pattern: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(126, 34, 206, 0.2) 100%)',
    bgColor: '#339c09'
  },

  'user funded': {
    bg: 'from-cyan-500 via-cyan-600 to-cyan-700',
    border: 'border-cyan-800',
    accent: 'text-white',
    shadow: 'shadow-cyan-500',
    pattern: 'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
    bgColor: '#06b6d4'
  },
};

// Category icon mapping with real SVG images
const getCategoryIcon = (categoryName: string) => {
  const normalizedName = categoryName?.toLowerCase() || '';
  
  if (normalizedName.includes('launch') || normalizedName.includes('vehicle')) {
    return (
    <img 
      src="photos/launchvehicle.svg" 
className="w-12 h-12 "
      alt="Launch Vehicle Icon" 
    />
    );
  } else if (normalizedName.includes('spacecraft') || normalizedName.includes('craft')) {
    return (
      <img 
      src="photos/spacecraft.svg" 
className="w-12 h-12 transform scale-x-[-1]"
      alt="Spacecraft Icon" 
    />
    );
  } else if (normalizedName.includes('gaganyaan')) {
  return (
    <img 
      src="photos/gaganyaan.svg" 
className="w-12 h-12 transform scale-x-[-1]"
      alt="Gaganyaan Icon" 
    />
  );
} else if (normalizedName.includes('infrastructure')) {
  return (
   <img 
      src="photos/infrastructure.svg" 
className="w-12 h-12 transform scale-x-[-1]"
      alt="Infrastructure Icon" 
    />
  );
} else if (normalizedName.includes('research') || normalizedName.includes('development')) {
  return (
 <img 
      src="photos/ARDD.svg" 
className="w-12 h-12 transform scale-x-[-1]"
      alt="Research & Development Icon" 
    />
  );
}
   else if (normalizedName.includes('user funded') || normalizedName.includes('funded')) {
    return (
      <img 
      src="photos/UserFunded.svg" 
className="w-12 h-12"
      alt="User Funded Icon" 
    />
    );
  }
  
  // Default icon
  return <Award className="w-6 h-6" />;
};

// Get color scheme based on category name - for beautiful differentiation
const getColorSchemeByCategory = (categoryName: string): typeof CATEGORY_COLORS[0] => {
  const normalizedName = categoryName?.toLowerCase() || '';
  
  console.log('🎨 Category Name:', categoryName, '| Normalized:', normalizedName);
  
  // Check for specific category matches
  for (const [key, colorScheme] of Object.entries(CATEGORY_COLOR_MAP)) {
    if (normalizedName.includes(key)) {
      console.log('✅ Matched key:', key, '| Color:', colorScheme.bgColor);
      return colorScheme;
    }
  }
  
  // Fallback to default colors if no match
  console.log('❌ No match found, using default color');
  return CATEGORY_COLORS[0];
};

export const CategoryStatsCards: React.FC<CategoryStatsCardsProps> = ({ onNavigate, employeeCode, userRole, navigationData }) => {
  const [stats, setStats] = useState<CategoryStatData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProjects, setAllProjects] = useState<ProjectDetailResponse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalProjects, setModalProjects] = useState<ProjectDetailResponse[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ code: string; name: string }>({ code: '', name: '' });
  const [categoryProjects, setCategoryProjects] = useState<ProjectDetailResponse[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'on-track' | 'delayed'>('all');

  useEffect(() => {
    if (employeeCode && userRole) {
      console.log('CategoryStatsCards: Fetching data for', userRole, 'with employee code:', employeeCode);
      fetchData();
      fetchAllProjects();
    }
  }, [employeeCode, userRole]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: CategoryStatData[] = [];
      
      if (userRole === 'PROJECT_DIRECTOR' || userRole === 'PROGRAMME_DIRECTOR') {
        console.log(`Fetching category stats for ${userRole} with employee code: ${employeeCode}`);
        const response = await categoryStatsService.getCategoryStatsByDirector(employeeCode);
        data = response;
        console.log('Category Stats by Director:', data);
      } else {
        console.log('Fetching global category stats for role:', userRole);
        const response = await categoryStatsService.getCategoryStats();
        data = response;
        console.log('Category Stats (Global):', data);
      }
      
      const statsArray = Array.isArray(data) ? data : [];
      // Display all categories, including those with 0 projects
      const sorted = statsArray.sort((a, b) => b.projectCount - a.projectCount);
      console.log('📊 All Categories:', sorted.map(s => s.projectCategoryFullName));
      setStats(sorted);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error loading stats';
      setError(errorMsg);
      console.error('Error fetching category stats:', err);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      console.log('🔍 Fetching all projects...');
      const projects = await projectDetailService.getAllProjectDetails();
      console.log('✅ Projects fetched:', projects);
      console.log('📊 Total projects:', projects?.length || 0);
      if (projects && projects.length > 0) {
        console.log('🔎 Sample project:', projects[0]);
        console.log('📋 Project category codes:', projects.map(p => p.projectCategoryCode).slice(0, 5));
      }
      setAllProjects(projects || []);
    } catch (err) {
      console.error('❌ Error fetching projects:', err);
      setAllProjects([]);
    }
  };

  const getColorScheme = (index: number) => {
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  };

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
          // Set time to 00:00:00 for date-only comparison
          now.setHours(0, 0, 0, 0);
          sched.setHours(0, 0, 0, 0);
          // If schedule date is less than or equal to today, it's delayed
          // Only future dates (after today) are on-track
          return sched.getTime() <= now.getTime();
        }
      }
    } catch (e) {
      // ignore parse errors and fall back
    }

    // fallback: if durationInMonths > 0 treat as delayed (legacy behavior)
    return (project.durationInMonths || 0) > 0;
  };

  const handleOpenModal = (title: string, projects: ProjectDetailResponse[]) => {
    console.log('🎯 Opening modal with title:', title);
    console.log('📊 Projects to display:', projects.length);
    if (projects.length > 0) {
      console.log('🔍 First project:', projects[0]);
    }
    setModalTitle(title);
    setModalProjects(projects);
    setModalOpen(true);
  };

  const handleOpenCategoryModal = (categoryCode: string, categoryName: string, filterType: 'all' | 'on-track' | 'delayed') => {
    console.log('🎯 Opening category modal for:', categoryName, '(' + categoryCode + '), filter:', filterType);
    // Fetch projects for this specific category with filter
    fetchProjectsForCategory(categoryCode, categoryName, filterType);
  };

  const fetchProjectsForCategory = async (categoryCode: string, categoryName: string, filterType: 'all' | 'on-track' | 'delayed') => {
    try {
      console.log('🔍 Fetching projects for category:', categoryCode, 'filter:', filterType);
      let catProjects = await projectDetailService.getProjectDetailsByProjectCategoryCode(categoryCode);
      console.log('📊 Total projects in category:', catProjects.length);
      
      // Filter based on type
      if (filterType === 'on-track') {
        catProjects = catProjects.filter(p => !isProjectDelayed(p));
        console.log('✅ On-track projects:', catProjects.length);
      } else if (filterType === 'delayed') {
        catProjects = catProjects.filter(p => isProjectDelayed(p));
        console.log('✅ Delayed projects:', catProjects.length);
      }
      
      if (catProjects.length > 0) {
        console.log('🔍 Sample project:', catProjects[0]);
      }
      
      setSelectedCategory({ code: categoryCode, name: categoryName });
      setCategoryProjects(catProjects);
      setFilterType(filterType);
      setCategoryModalOpen(true);
    } catch (err) {
      console.error('❌ Error fetching projects for category:', err);
      setSelectedCategory({ code: categoryCode, name: categoryName });
      setCategoryProjects([]);
      setFilterType(filterType);
      setCategoryModalOpen(true);
    }
  };

  const getFilteredProjects = (categoryCode: string, filterType: 'all' | 'on-track' | 'delayed') => {
    console.log('🔍 Filtering projects for category:', categoryCode, 'filter:', filterType);
    console.log('📊 Total projects available:', allProjects.length);
    
    const categoryProjects = allProjects.filter(p => p.projectCategoryCode === categoryCode);
    console.log('📌 Projects in category:', categoryProjects.length);
    
    if (filterType === 'all') {
      console.log('✅ Returning all projects:', categoryProjects.length);
      return categoryProjects;
    } else if (filterType === 'on-track') {
      const onTrack = categoryProjects.filter(p => !isProjectDelayed(p));
      console.log('✅ On-track projects:', onTrack.length);
      return onTrack;
    } else if (filterType === 'delayed') {
      const delayed = categoryProjects.filter(p => isProjectDelayed(p));
      console.log('✅ Delayed projects:', delayed.length);
      return delayed;
    }
    
    return categoryProjects;
  };

  const formatCurrency = (value: number): string => {
    if (!value) return '₹0 Cr';
    const crores = value ;
    const formatted = crores.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `₹${formatted} Cr`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return null;
  }

  const prevMonthLabel = new Date(
  new Date().getFullYear(),
  new Date().getMonth() - 1,
  1
).toLocaleString("en-US", { month: "short", year: "numeric" });

  return (
    <div className="space-y-3" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, index) => {
          const colorScheme = getColorSchemeByCategory(stat.projectCategoryFullName);
          const utilizationRate = stat.totalSanctionedCost > 0 
            ? Math.round((stat.totalCumulativeExpenditure / stat.totalSanctionedCost) * 100) 
            : 0;

          return (
            <div
             // key={stat.projectCategoryCode}
              
              className="rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group shadow-lg bg-white border-2"
              style={{
                borderColor: colorScheme.bgColor,
                boxShadow: `0 10px 30px -5px ${colorScheme.bgColor}20`
              }}
            >
              {/* Header Section with Category Name - Gradient */}
              <div 
                className="p-2 flex items-center gap-3"
                style={{ 
                  background: `linear-gradient(135deg, ${colorScheme.bgColor} 0%, ${colorScheme.bgColor}cc 100%)`,
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                <div className="p-2.5 bg-white/25 rounded-xl shadow-lg backdrop-blur-sm group-hover:bg-white/35 transition-all">
                  <span className="text-xl text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>
                    {getCategoryIcon(stat.projectCategoryFullName)}
                  </span>
                </div>
                <div className="p-2 flex items-center gap-3">
                  <h3 className="font-black text-white text-2xl tracking-tight drop-shadow-md line-clamp-1">
                    {stat.projectCategoryFullName}
                  </h3>
                  {/* <p className="text-xs text-white/80 font-semibold">Project Portfolio</p> */}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-2 space-y-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                {/* Stats Grid - Total, OnTrack, Delayed */}
                <div className="grid grid-cols-3 gap-2">
                  <div 
                    className={`p-2 text-center border-2 transition-opacity ${stat.projectCount > 0 ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'}`}
                    style={{ background: colorScheme.bgColor, borderColor: colorScheme.bgColor, boxShadow: `0 4px 12px ${colorScheme.bgColor}40` }}
                    onClick={(e) => {
                      if (stat.projectCount > 0) {
                        e.stopPropagation();
                        console.log('🔘 Total button clicked for category:', stat.projectCategoryCode);
                        handleOpenCategoryModal(stat.projectCategoryCode, stat.projectCategoryFullName, 'all');
                      }
                    }}
                  >
                    <p className="text-lg uppercase font-black text-white mb-1">Total</p>
                    <p className="text-xl font-black text-white">{stat.projectCount}</p>
                  </div>
                  <div 
                    className={`p-2 text-center border-2 transition-opacity ${stat.onTrackCount > 0 ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'}`}
                    style={{ background: '#419c34', borderColor: '#419c34', boxShadow: `0 4px 12px #419c3440` }}
                    onClick={(e) => {
                      if (stat.onTrackCount > 0) {
                        e.stopPropagation();
                        console.log('🔘 On Track button clicked for category:', stat.projectCategoryCode);
                        handleOpenCategoryModal(stat.projectCategoryCode, stat.projectCategoryFullName, 'on-track');
                      }
                    }}
                  >
                    <p className="text-lg text-white uppercase font-black mb-1">On Track</p>
                    <p className="text-xl font-black text-white">{stat.onTrackCount}</p>
                  </div>
                  <div 
                    className={`p-2 text-center border-2 transition-opacity ${stat.delayedCount > 0 ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'}`}
                    style={{ background: '#b53030', borderColor: '#b53030', boxShadow: `0 4px 12px #b5303040` }}
                    onClick={(e) => {
                      if (stat.delayedCount > 0) {
                        e.stopPropagation();
                        console.log('🔘 Delayed button clicked for category:', stat.projectCategoryCode);
                        handleOpenCategoryModal(stat.projectCategoryCode, stat.projectCategoryFullName, 'delayed');
                      }
                    }}
                  >
                    <p className="text-lg text-white uppercase font-black mb-1">Delayed</p>
                    <p className="text-xl font-black text-white">{stat.delayedCount}</p>
                  </div>
                </div>

                {/* Budget Information */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-1xl font-bold text-black">Sanctioned</span>
                    <span className="text-1xl font-black text-black">{formatCurrency(stat.totalSanctionedCost)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-1xl font-bold text-black">Expenditure as on {prevMonthLabel}</span>
                    <span className="text-1xl font-black text-black">{formatCurrency(stat.totalCumulativeExpenditure)}</span>
                  </div>

                  {/* Budget Utilization Bar */}
                  <div className="pt-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-1xl font-bold text-black">% Budget Utilized</span>
                      <span className="text-1xl font-black text-black">
                        {utilizationRate}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          backgroundColor: colorScheme.bgColor,
                          width: `${Math.min(utilizationRate, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project List Modal */}
      <ProjectListModal 
        isOpen={modalOpen}
        title={modalTitle}
        projects={modalProjects}
        onClose={() => setModalOpen(false)}
      />

      {/* Project Category Wise List Modal */}
      <ProjectCategoryWiseListModal 
        isOpen={categoryModalOpen}
        categoryName={selectedCategory.name}
        categoryCode={selectedCategory.code}
        projects={categoryProjects}
        filterType={filterType}
        onClose={() => setCategoryModalOpen(false)}
      />
    </div>
  );
};

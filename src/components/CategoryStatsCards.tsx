import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, AlertTriangle, Award, Loader2 } from 'lucide-react';
import { ProjectCategoryService } from '../services/projectCategoryService';
import { categoryStatsService } from '../services/categoryStatsService';

interface CategoryStat {
  category: string;
  total: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  completed: number;
}

interface CategoryInfo {
  code: string;
  fullName: string;
}

interface CategoryStatsCardsProps {
  onNavigate?: (page: string, category?: string) => void;
  employeeCode?: string; // For director-specific stats
}

// Color palette for categories (rotates through colors)
const CATEGORY_COLORS = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-green-500 to-green-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-cyan-500 to-cyan-600',
  'from-teal-500 to-teal-600',
  'from-rose-500 to-rose-600',
  'from-amber-500 to-amber-600'
];

// Icon options for categories (rotates through icons)
const CATEGORY_ICONS = [
  <TrendingUp className="w-6 h-6" key="trending" />,
  <Award className="w-6 h-6" key="award" />,
  <AlertCircle className="w-6 h-6" key="alert" />,
  <CheckCircle className="w-6 h-6" key="check" />,
  <AlertTriangle className="w-6 h-6" key="warning" />,
  <Loader2 className="w-6 h-6" key="loader" />
];

export const CategoryStatsCards: React.FC<CategoryStatsCardsProps> = ({ onNavigate, employeeCode }) => {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [categories, setCategories] = useState<Map<string, CategoryInfo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [employeeCode]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all categories
      const allCategories = await ProjectCategoryService.getAllProjectCategories();
      console.log('All Categories:', allCategories);
      const categoryMap = new Map<string, CategoryInfo>();
      allCategories.forEach((cat) => {
        categoryMap.set(cat.projectCategoryCode, {
          code: cat.projectCategoryCode,
          fullName: cat.projectCategoryFullName
        });
      });
      setCategories(categoryMap);
      
      // Fetch stats - use categoryStatsService for both director-specific and global/chairman stats
      let data;
      if (employeeCode && employeeCode !== 'CHAIRMAN') {
        console.log('Fetching category stats for employee code:', employeeCode);
        data = await categoryStatsService.getCategoryStatsByDirector(employeeCode);
        console.log('Category Stats by Director (raw):', data);
      } else {
        // For CHAIRMAN role, fetch global stats for all categories
        console.log('Fetching global category stats for CHAIRMAN role');
        data = await categoryStatsService.getCategoryStats();
        console.log('Category Stats (Global):', data);
      }
      
      // Merge all categories with their stats (even if no stats exist)
      const mergedStats: CategoryStat[] = allCategories.map((cat) => {
        const statData = data?.find((stat: any) => {
          console.log('Comparing stat:', stat.projectCategoryCode, 'with category:', cat.projectCategoryCode);
          return stat.projectCategoryCode === cat.projectCategoryCode;
        });
        console.log('Found stat for category', cat.projectCategoryCode, ':', statData);
        return {
          category: cat.projectCategoryCode,
          total: statData?.projectCount || 0,
          onTrack: statData?.onTrack || 0,
          atRisk: statData?.atRisk || 0,
          delayed: statData?.delayed || 0,
          completed: statData?.completed || 0
        };
      });
      console.log('Merged stats:', mergedStats);
      setStats(mergedStats);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error loading stats';
      setError(errorMsg);
      console.error('Error fetching category stats:', err);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (categoryCode: string, index: number): string => {
    return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  };

  const getCategoryIcon = (categoryCode: string, index: number) => {
    return CATEGORY_ICONS[index % CATEGORY_ICONS.length];
  };

  const getCategoryFullName = (categoryCode: string): string => {
    return categories.get(categoryCode)?.fullName || categoryCode;
  };

  const getStatusPercentage = (stat: CategoryStat, status: 'onTrack' | 'atRisk' | 'delayed' | 'completed'): number => {
    if (stat.total === 0) return 0;
    return Math.round((stat[status] / stat.total) * 100);
  };

  // Don't show loading, error, or empty states - render nothing if no categories exist
  // This component is optional and will gracefully hide when categories aren't available
  if (loading || error || stats.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.category}
            onClick={() => stat.total > 0 && onNavigate?.('my-projects', stat.category)}
            className={`bg-gradient-to-br ${getCategoryColor(stat.category, index)} rounded-lg shadow-lg overflow-hidden text-white hover:shadow-xl transition-all ${stat.total > 0 ? 'cursor-pointer hover:scale-105' : 'opacity-75 cursor-default'}`}
          >
            {/* Header */}
            <div className="p-4 bg-black bg-opacity-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold truncate">{getCategoryFullName(stat.category)}</h3>
                <div className="opacity-70">{getCategoryIcon(stat.category, index)}</div>
              </div>
            </div>

            {/* Total Count */}
            <div className="p-4">
              <div className="mb-4">
                <p className="text-3xl font-bold">{stat.total}</p>
                <p className="text-sm opacity-90">{stat.total === 1 ? 'Project' : 'Total Projects'}</p>
              </div>

              {/* Status Breakdown */}
              <div className="space-y-2 text-xs">
                {/* On Track */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>On Track</span>
                    <span className="font-bold">{stat.onTrack || 0}</span>
                  </div>
                </div>

                {/* At Risk */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>At Risk</span>
                    <span className="font-bold">{stat.atRisk || 0}</span>
                  </div>
                </div>

                {/* Delayed */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>Delayed</span>
                    <span className="font-bold">{stat.delayed || 0}</span>
                  </div>
                </div>

                {/* Completed */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>Completed</span>
                    <span className="font-bold">{stat.completed || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle, AlertTriangle, Award } from 'lucide-react';
import { projectService } from '../services/projectService';

interface CategoryStat {
  category: string;
  total: number;
  onTrack: number;
  atRisk: number;
  delayed: number;
  completed: number;
}

interface CategoryStatsCardsProps {
  onNavigate?: (page: string, category?: string) => void;
}

export const CategoryStatsCards: React.FC<CategoryStatsCardsProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  const fetchCategoryStats = async () => {
    try {
      setLoading(true);
      const data = await projectService.getCategoryStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading stats');
      console.error('Error fetching category stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'Launch Vehicles': 'from-blue-500 to-blue-600',
      'Space Crafts': 'from-purple-500 to-purple-600',
      'Infrastructure': 'from-green-500 to-green-600',
      'Advanced R&D': 'from-orange-500 to-orange-600',
      'User Funded Projects': 'from-pink-500 to-pink-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Launch Vehicles': <TrendingUp className="w-6 h-6" />,
      'Space Crafts': <Award className="w-6 h-6" />,
      'Infrastructure': <AlertCircle className="w-6 h-6" />,
      'Advanced R&D': <CheckCircle className="w-6 h-6" />,
      'User Funded Projects': <AlertTriangle className="w-6 h-6" />
    };
    return icons[category] || <TrendingUp className="w-6 h-6" />;
  };

  const getStatusPercentage = (stat: CategoryStat, status: 'onTrack' | 'atRisk' | 'offTrack' | 'completed'): number => {
    if (stat.total === 0) return 0;
    return Math.round((stat[status] / stat.total) * 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
     

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.category}
            onClick={() => onNavigate?.('my-projects', stat.category)}
            className={`bg-gradient-to-br ${getCategoryColor(stat.category)} rounded-lg shadow-lg overflow-hidden text-white hover:shadow-xl transition-all cursor-pointer hover:scale-105`}
          >
            {/* Header */}
            <div className="p-4 bg-black bg-opacity-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold truncate">{stat.category}</h3>
                <div className="opacity-70">{getCategoryIcon(stat.category)}</div>
              </div>
            </div>

            {/* Total Count */}
            <div className="p-4">
              <div className="mb-4">
                <p className="text-3xl font-bold">{stat.total}</p>
                <p className="text-sm opacity-90">Total Projects</p>
              </div>

              {/* Status Breakdown */}
              <div className="space-y-3 text-xs">
                {/* On Track */}
                {stat.onTrack > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>On Track</span>
                      </div>
                      <span className="font-bold">{stat.onTrack} ({getStatusPercentage(stat, 'onTrack')}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-300 rounded-full" 
                        style={{ width: `${getStatusPercentage(stat, 'onTrack')}%` }} 
                      />
                    </div>
                  </div>
                )}

                {/* At Risk */}
                {stat.atRisk > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>At Risk</span>
                      </div>
                      <span className="font-bold">{stat.atRisk} ({getStatusPercentage(stat, 'atRisk')}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-300 rounded-full" 
                        style={{ width: `${getStatusPercentage(stat, 'atRisk')}%` }} 
                      />
                    </div>
                  </div>
                )}

                {/* Delayed */}
                {stat.delayed > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Delayed</span>
                      </div>
                      <span className="font-bold">{stat.delayed} ({getStatusPercentage(stat, 'delayed')}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-300 rounded-full" 
                        style={{ width: `${getStatusPercentage(stat, 'delayed')}%` }} 
                      />
                    </div>
                  </div>
                )}

                {/* Completed */}
                {stat.completed > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                      <span className="font-bold">{stat.completed} ({getStatusPercentage(stat, 'completed')}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-300 rounded-full" 
                        style={{ width: `${getStatusPercentage(stat, 'completed')}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Empty State */}
              {stat.total === 0 && (
                <p className="text-xs opacity-75 italic">No projects yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

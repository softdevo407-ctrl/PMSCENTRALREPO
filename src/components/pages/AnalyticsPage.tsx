import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SAMPLE_PROJECT_DEFINITIONS } from '../../pbemData';

interface AnalyticsPageProps {
  userName: string;
}

// Mock data for charts
const budgetByStatus = [
  { status: 'On Track', value: 450 },
  { status: 'At Risk', value: 120 },
  { status: 'Delayed', value: 80 }
];

const timelineData = [
  { month: 'Jan', completed: 4, inProgress: 8, planned: 12 },
  { month: 'Feb', completed: 6, inProgress: 7, planned: 10 },
  { month: 'Mar', completed: 8, inProgress: 6, planned: 9 },
  { month: 'Apr', completed: 10, inProgress: 5, planned: 8 },
  { month: 'May', completed: 12, inProgress: 4, planned: 6 },
  { month: 'Jun', completed: 14, inProgress: 3, planned: 5 }
];

const categoryDistribution = [
  { name: 'IT Infrastructure', value: 35 },
  { name: 'Core Services', value: 28 },
  { name: 'Capacity Building', value: 22 },
  { name: 'Others', value: 15 }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ userName }) => {
  const allProjects = SAMPLE_PROJECT_DEFINITIONS;
  const totalBudget = allProjects.reduce((sum, p) => sum + p.sanctionedAmount, 0);
  const spentBudget = totalBudget * 0.58; // 58% spent
  const avgCompletion = (allProjects.reduce((sum, p) => sum + 65, 0) / allProjects.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Analytics</h1>
        <p className="text-gray-600 mt-2">Strategic insights and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase font-semibold">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{(totalBudget / 10000000).toFixed(1)}Cr</p>
            </div>
            <DollarSign className="w-12 h-12 text-blue-100" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase font-semibold">Budget Spent</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{(spentBudget / 10000000).toFixed(1)}Cr</p>
            </div>
            <TrendingDown className="w-12 h-12 text-orange-100" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase font-semibold">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{avgCompletion}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-100" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 uppercase font-semibold">Portfolio Health</p>
              <p className="text-2xl font-bold text-green-600 mt-2">78%</p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-100" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Budget Distribution by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={budgetByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Project Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={budgetByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status: s, value: v }: any) => `${s}: ${v}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Project Timeline (6 months)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="inProgress" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="planned" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Project Distribution by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-900">High Risk</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">2</p>
            <p className="text-sm text-red-700 mt-1">Projects requiring immediate action</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Medium Risk</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">3</p>
            <p className="text-sm text-orange-700 mt-1">Projects to monitor closely</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-900">On Track</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">6</p>
            <p className="text-sm text-green-700 mt-1">Projects progressing well</p>
          </div>
        </div>
      </div>
    </div>
  );
};

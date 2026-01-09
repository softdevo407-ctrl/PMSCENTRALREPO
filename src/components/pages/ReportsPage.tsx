import React, { useState } from 'react';
import { Download, FileText, BarChart3, Calendar, Filter } from 'lucide-react';

interface ReportsPageProps {
  userName: string;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ userName }) => {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter'>('month');

  const reportTemplates = [
    {
      id: 'budget-report',
      name: 'Budget Report',
      description: 'Detailed budget allocation, spending, and variance analysis',
      icon: '💰',
      frequency: 'Monthly'
    },
    {
      id: 'progress-report',
      name: 'Project Progress Report',
      description: 'Phase completion, milestone status, and timeline tracking',
      icon: '📊',
      frequency: 'Bi-weekly'
    },
    {
      id: 'risk-report',
      name: 'Risk & Issues Report',
      description: 'Identified risks, mitigation status, and open issues',
      icon: '⚠️',
      frequency: 'Weekly'
    },
    {
      id: 'performance-report',
      name: 'Performance Metrics',
      description: 'KPIs, accomplishments, and performance indicators',
      icon: '📈',
      frequency: 'Monthly'
    },
    {
      id: 'stakeholder-report',
      name: 'Stakeholder Communication',
      description: 'Executive summary for stakeholder updates',
      icon: '👥',
      frequency: 'On-demand'
    },
    {
      id: 'audit-report',
      name: 'Audit & Compliance',
      description: 'Compliance checks, audit findings, and corrective actions',
      icon: '✓',
      frequency: 'Quarterly'
    }
  ];

  const recentReports = [
    {
      id: 1,
      name: 'Budget Report - May 2024',
      type: 'Budget Report',
      generated: '2024-05-30',
      generatedBy: 'System Auto',
      status: 'Ready',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Project Progress - Week 22',
      type: 'Project Progress Report',
      generated: '2024-05-28',
      generatedBy: 'System Auto',
      status: 'Ready',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Risk Assessment - May',
      type: 'Risk & Issues Report',
      generated: '2024-05-25',
      generatedBy: 'System Auto',
      status: 'Ready',
      size: '3.1 MB'
    },
    {
      id: 4,
      name: 'Performance Metrics Q1',
      type: 'Performance Metrics',
      generated: '2024-05-20',
      generatedBy: 'System Auto',
      status: 'Ready',
      size: '2.7 MB'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Generate, view, and download project reports</p>
      </div>

      {/* Report Generation Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Generate New Report</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a report template...</option>
              {reportTemplates.map(report => (
                <option key={report.id} value={report.id}>{report.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'quarter')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>

        <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          Generate & Download Report
        </button>
      </div>

      {/* Report Templates Grid */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Available Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => setSelectedReport(template.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedReport === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{template.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {template.frequency}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900">Recent Reports</h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Report Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Generated</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentReports.map(report => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{report.name}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{report.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{new Date(report.generated).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700">{report.size}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Scheduling */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Scheduled Reports</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Budget Report</p>
              <p className="text-sm text-gray-600">Scheduled: Every Monday 09:00 AM</p>
            </div>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
              Unschedule
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Project Progress Report</p>
              <p className="text-sm text-gray-600">Scheduled: Every Friday 05:00 PM</p>
            </div>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
              Unschedule
            </button>
          </div>
        </div>

        <button className="mt-4 w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
          Schedule New Report
        </button>
      </div>
    </div>
  );
};

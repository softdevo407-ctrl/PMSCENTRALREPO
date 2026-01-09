import React, { useState } from 'react';
import { Plus, X, Calendar, DollarSign, User, FolderOpen, Tag, Info } from 'lucide-react';

interface NewProjectPageProps {
  userName: string;
  onNavigate?: (page: string) => void;
}

export const NewProjectPage: React.FC<NewProjectPageProps> = ({ userName, onNavigate }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    shortName: '',
    categoryName: '',
    programmeName: '',
    leadCentreName: '',
    budgetCode: '',
    sanctionedAmount: '',
    endDate: '',
    description: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    'IT Infrastructure',
    'Satellite Communication',
    'Core Services',
    'Capacity Building',
    'Infrastructure & Advanced R&D'
  ];

  const programmes = [
    'Satellite Communication Programme',
    'Technology Development Programme',
    'Core Infrastructure Programme',
    'Advanced Research Programme'
  ];

  const leadCentres = [
    'ISRO Main Centre',
    'Satellite Centre',
    'Development & Educational Communication Satellite',
    'Space Applications Centre'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New project created:', formData);
    // Reset form
    setFormData({
      projectName: '',
      shortName: '',
      categoryName: '',
      programmeName: '',
      leadCentreName: '',
      budgetCode: '',
      sanctionedAmount: '',
      endDate: '',
      description: ''
    });
  };

  const budgetAllocation = {
    planning: 15,
    development: 45,
    testing: 25,
    deployment: 15
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">Define a new satellite project with comprehensive details and budget allocation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name *</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="e.g., Next Generation Satellite System"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Short Name *</label>
                  <input
                    type="text"
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleChange}
                    placeholder="e.g., NGSAT-2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                Project Classification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <select
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Programme *</label>
                  <select
                    name="programmeName"
                    value={formData.programmeName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Programme</option>
                    {programmes.map(prog => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Organization Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-green-600" />
                Organization Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Lead Centre *</label>
                  <select
                    name="leadCentreName"
                    value={formData.leadCentreName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Lead Centre</option>
                    {leadCentres.map(centre => (
                      <option key={centre} value={centre}>{centre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Code *</label>
                  <input
                    type="text"
                    name="budgetCode"
                    value={formData.budgetCode}
                    onChange={handleChange}
                    placeholder="e.g., PMS-2024-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial & Timeline */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                Financial & Timeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sanctioned Amount (₹ Lakhs) *</label>
                  <input
                    type="number"
                    name="sanctionedAmount"
                    value={formData.sanctionedAmount}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Project Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project objectives, scope, and key deliverables..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                {showPreview ? 'Hide' : 'Preview'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar - Budget Breakdown & Overview */}
        <div className="space-y-6">
          {/* Budget Allocation Preview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Typical Budget Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(budgetAllocation).map(([phase, percentage]) => (
                <div key={phase}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{phase}</span>
                    <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" 
                      style={{ width: `${percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note:</strong> These are typical allocations. Adjust phases and budgets during project scheduling.
              </p>
            </div>
          </div>

          {/* Project Phases Template */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Standard Phases</h3>
            <div className="space-y-3">
              {[
                { name: 'Planning & Design', duration: '3-6 months' },
                { name: 'Development & Integration', duration: '6-12 months' },
                { name: 'Testing & Validation', duration: '3-6 months' },
                { name: 'Deployment & Operations', duration: '2-4 months' }
              ].map((phase, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{phase.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{phase.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-green-50 rounded-lg border border-green-200 p-6">
            <h3 className="text-sm font-bold text-green-900 mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-xs text-green-800">
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Use meaningful short names for easy reference</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Set realistic end dates with buffer time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Include detailed descriptions for stakeholder clarity</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Add phases immediately after creation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

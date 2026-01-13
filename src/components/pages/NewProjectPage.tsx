import React, { useState } from 'react';
import { Plus, X, Calendar, DollarSign, User, FolderOpen, Tag, Info, HelpCircle, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { projectService } from '../../services/projectService';
import { authService } from '../../services/authService';

interface NewProjectPageProps {
  userName: string;
  onNavigate?: (page: string) => void;
}

interface Errors {
  [key: string]: string;
}

interface Tooltip {
  [key: string]: string;
}

export const NewProjectPage: React.FC<NewProjectPageProps> = ({ userName, onNavigate }) => {
  const { user } = useAuth();
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
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const tooltips: Tooltip = {
    projectName: 'Enter the full official name of the project (minimum 5 characters)',
    shortName: 'Short identifier for quick reference (e.g., ALVD-2024). Must be unique and 3-20 characters',
    categoryName: 'Select the primary category that best describes this project',
    programmeName: 'Select the program under which this project will be executed',
    leadCentreName: 'Select the lead organization/centre responsible for this project',
    budgetCode: 'Unique budget code for financial tracking (e.g., LV-2024-001)',
    sanctionedAmount: 'Total sanctioned budget in Lakhs (₹). Minimum ₹10 lakhs required',
    endDate: 'Project completion target date. Must be at least 6 months from today',
    description: 'Provide detailed description of project objectives, scope, and expected outcomes'
  };

  const categories = [
    'Launch Vehicles',
    'Space Crafts',
    'Infrastructure',
    'Advanced R&D',
    'User Funded Projects'
  ];

  const programmes = [
    'GSLV',
    'PSLV',
    'SSLV',
    'GAGANYAAN',
    'COMMUNICATION SATELLITES',
    'EARTH OBSERVATION SATELLITES',
    'SCIENCE MISSIONS',
    'NAVIGATION SATELLITES',
    'SPACE EXPLORATION MISSIONS',
    'TECHNOLOGY DEMONSTRATION MISSIONS',
    'USER FUNDED SATTELITES'
  ];

  const leadCentres = [
    'UR Rao Satellite Centre ',
    'VIKRAM Sarabhai Space Centre',
    'SATISH Dhawan Space Centre',
    'Space Applications Centre'
    ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // Project Name validation
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (formData.projectName.trim().length < 5) {
      newErrors.projectName = 'Project name must be at least 5 characters';
    } else if (formData.projectName.trim().length > 255) {
      newErrors.projectName = 'Project name cannot exceed 255 characters';
    }

    // Short Name validation
    if (!formData.shortName.trim()) {
      newErrors.shortName = 'Short name is required';
    } else if (formData.shortName.trim().length < 3) {
      newErrors.shortName = 'Short name must be at least 3 characters';
    } else if (formData.shortName.trim().length > 20) {
      newErrors.shortName = 'Short name cannot exceed 20 characters';
    } else if (!/^[A-Z0-9\-]+$/.test(formData.shortName.trim())) {
      newErrors.shortName = 'Short name should contain only uppercase letters, numbers, and hyphens';
    }

    // Category validation
    if (!formData.categoryName) {
      newErrors.categoryName = 'Category is required';
    }

    // Programme validation
    if (!formData.programmeName) {
      newErrors.programmeName = 'Programme is required';
    }

    // Lead Centre validation
    if (!formData.leadCentreName) {
      newErrors.leadCentreName = 'Lead centre is required';
    }

    // Budget Code validation
    if (!formData.budgetCode.trim()) {
      newErrors.budgetCode = 'Budget code is required';
    } else if (formData.budgetCode.trim().length < 5) {
      newErrors.budgetCode = 'Budget code must be at least 5 characters';
    }

    // Sanctioned Amount validation
    if (!formData.sanctionedAmount) {
      newErrors.sanctionedAmount = 'Sanctioned amount is required';
    } else {
      const amount = parseFloat(formData.sanctionedAmount);
      if (isNaN(amount)) {
        newErrors.sanctionedAmount = 'Please enter a valid number';
      } else if (amount < 10) {
        newErrors.sanctionedAmount = 'Minimum sanctioned amount is ₹10 lakhs';
      } else if (amount > 100000) {
        newErrors.sanctionedAmount = 'Maximum sanctioned amount is ₹100,000 lakhs';
      }
    }

    // End Date validation
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else {
      const selectedDate = new Date(formData.endDate);
      const today = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

      if (selectedDate <= today) {
        newErrors.endDate = 'End date must be in the future';
      } else if (selectedDate < sixMonthsFromNow) {
        newErrors.endDate = 'End date should be at least 6 months from today';
      }
    }

    // Description validation (optional but if provided, validate)
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      setErrors({ submit: 'User not authenticated. Please login again.' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Get token from user object or localStorage fallback
      const token = user.token || authService.getToken();
      
      if (!token) {
        setErrors({ submit: 'Authentication token not found. Please login again.' });
        return;
      }

      // Convert amount from lakhs to actual rupees (lakhs × 100,000)
      const sanctionedAmountInRupees = parseFloat(formData.sanctionedAmount) * 100000;

      const projectData = {
        projectName: formData.projectName.trim(),
        shortName: formData.shortName.trim().toUpperCase(),
        programmeName: formData.programmeName,
        category: formData.categoryName,
        budgetCode: formData.budgetCode.trim(),
        leadCentre: formData.leadCentreName,
        sanctionedAmount: sanctionedAmountInRupees,
        endDate: formData.endDate,
        programmeDirId: user.id, // Pass current user as programme director
      };

      const response = await projectService.createProject(projectData, token);
      
      setSuccess(true);
      setSuccessMessage(`Project "${response.projectName}" created successfully!`);
      
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

      // Redirect after 2 seconds
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('my-projects');
        }
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      setErrors({ submit: errorMessage });
      setSuccess(false);
    } finally {
      setLoading(false);
    }
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
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">Success</h3>
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Submit Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Project Name *
                    <div className="relative inline-block">
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip('projectName')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'projectName' && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                          {tooltips.projectName}
                          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="e.g., Next Generation Satellite System"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.projectName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.projectName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.projectName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Short Name *
                    <div className="relative inline-block">
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip('shortName')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'shortName' && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                          {tooltips.shortName}
                          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="text"
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleChange}
                    placeholder="e.g., NGSAT-2024"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.shortName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.shortName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.shortName}
                    </p>
                  )}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Category *
                    <div className="relative inline-block">
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip('categoryName')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'categoryName' && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                          {tooltips.categoryName}
                          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </label>
                  <select
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.categoryName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.categoryName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.categoryName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Programme *
                    <div className="relative inline-block">
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip('programmeName')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'programmeName' && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                          {tooltips.programmeName}
                          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </label>
                  <select
                    name="programmeName"
                    value={formData.programmeName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.programmeName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Programme</option>
                    {programmes.map(prog => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </select>
                  {errors.programmeName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.programmeName}
                    </p>
                  )}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Lead Centre *
                    <div className="relative inline-block">
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip('leadCentreName')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'leadCentreName' && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                          {tooltips.leadCentreName}
                          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </label>
                  <select
                    name="leadCentreName"
                    value={formData.leadCentreName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.leadCentreName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <option value="">Select Lead Centre</option>
                    {leadCentres.map(centre => (
                      <option key={centre} value={centre}>{centre}</option>
                    ))}
                  </select>
                  {errors.leadCentreName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.leadCentreName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Budget Code *
                    <div className="relative inline-block">
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip('budgetCode')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'budgetCode' && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                          {tooltips.budgetCode}
                          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="text"
                    name="budgetCode"
                    value={formData.budgetCode}
                    onChange={handleChange}
                    placeholder="e.g., PMS-2024-001"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.budgetCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.budgetCode && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.budgetCode}
                    </p>
                  )}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Sanctioned Amount (₹ Lakhs) *
                    <div className="relative inline-block">
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip('sanctionedAmount')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'sanctionedAmount' && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                          {tooltips.sanctionedAmount}
                          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="number"
                    name="sanctionedAmount"
                    value={formData.sanctionedAmount}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.sanctionedAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.sanctionedAmount && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.sanctionedAmount}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    End Date *
                    <div className="relative inline-block">
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                        onMouseEnter={() => setShowTooltip('endDate')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'endDate' && (
                        <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                          {tooltips.endDate}
                          <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={loading}
                  />
                  {errors.endDate && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                Project Description
                <div className="relative inline-block">
                  <HelpCircle
                    className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                    onMouseEnter={() => setShowTooltip('description')}
                    onMouseLeave={() => setShowTooltip(null)}
                  />
                  {showTooltip === 'description' && (
                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                      {tooltips.description}
                      <div className="absolute top-full left-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </div>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project objectives, scope, and key deliverables..."
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {formData.description && (
                <p className="text-gray-500 text-xs">{formData.description.length}/2000 characters</p>
              )}
              {errors.description && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || success}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-semibold flex items-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Creating...' : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Project
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                disabled={loading}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 text-gray-700 rounded-lg transition-colors font-semibold"
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

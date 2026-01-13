import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, HelpCircle, Loader2, Info, Tag, FolderOpen, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import CoreUISearchableSelect from './CoreUISearchableSelect';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: number; // For edit mode
}

interface Errors {
  [key: string]: string;
}

interface Tooltip {
  [key: string]: string;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ isOpen, onClose, onSuccess, projectId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    projectName: '',
    shortName: '',
    projectType: '',
    categoryName: '',
    programmeName: '',
    programmeId: null as number | null,
    leadCentreName: '',
    budgetCode: '',
    financialSanction: '',
    projectRealizationDate: '',
    programmeDirectorId: null as string | number | null,
    projectDirectorId: null as string | number | null,
    projectDocument: null as File | null,
    description: ''
  });

  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [projectDirectors, setProjectDirectors] = useState<{ id: string | number; fullName: string }[]>([]);
  const [programmeDirectors, setProgrammeDirectors] = useState<{ id: string | number; fullName: string }[]>([]);

  // Static Programme Directors with numeric IDs
  const staticProgrammeDirectors = [
    { id: 1, fullName: 'Dr. Rajesh Kumar' },
    { id: 2, fullName: 'Dr. Priya Sharma' },
    { id: 3, fullName: 'Dr. Amit Patel' }
  ];

  // Static Project Directors with numeric IDs
  const staticProjectDirectors = [
    { id: 4, fullName: 'Vikram Singh' },
    { id: 5, fullName: 'Neha Gupta' },
    { id: 6, fullName: 'Arun Kumar' }
  ];

  // Load static directors on component mount
  useEffect(() => {
    if (isOpen) {
      setProgrammeDirectors(staticProgrammeDirectors);
      setProjectDirectors(staticProjectDirectors);
    }
  }, [isOpen]);

  const tooltips: Tooltip = {
    projectName: 'Enter the full official name of the project (minimum 5 characters)',
    shortName: 'Short identifier for quick reference (e.g., ALVD-2024). Must be unique and 3-20 characters',
    projectType: 'Select the type of project based on its scope and objectives',
    categoryName: 'Select the primary category that best describes this project',
    programmeName: 'Select the program under which this project will be executed',
    leadCentreName: 'Select the lead organization/centre responsible for this project',
    budgetCode: '2-digit alphanumeric code in uppercase (e.g., LV)',
    financialSanction: 'Total sanctioned budget in Lakhs (₹). Minimum ₹10 lakhs required',
    projectRealizationDate: 'Project completion target date. Must be at least 6 months from today',
    programmeDirectorId: 'Select the Programme Director for this project',
    projectDirectorId: 'Select the Project Director for this project',
    projectDocument: 'Upload project document or proposal file',
    description: 'Provide detailed description of project objectives, scope, and expected outcomes'
  };

  const categories = [
    'Launch Vehicles',
    'Space Crafts',
    'Infrastructure',
    'Advanced R&D',
    'User Funded Projects',
    'Gaganyaan'
  ];

  const projectTypes = [
    'Ongoing',
    'Developmental',
    'Advanced R&D',
    'Infrastructure'
  ];

  const programmes = [
    { id: 1, programmeName: 'GSLV', description: 'Geostationary Satellite Launch Vehicle', status: 'ACTIVE' },
    { id: 2, programmeName: 'PSLV', description: 'Polar Satellite Launch Vehicle', status: 'ACTIVE' },
    { id: 3, programmeName: 'SSLV', description: 'Small Satellite Launch Vehicle', status: 'ACTIVE' },
    { id: 4, programmeName: 'Gaganyaan', description: 'Human Spaceflight Programme', status: 'ACTIVE' },
    { id: 5, programmeName: 'Communication Satellites', description: 'Communication Satellites Programme', status: 'ACTIVE' },
    { id: 6, programmeName: 'Earth Observation Programme', description: 'Earth Observation Programme', status: 'ACTIVE' },
    { id: 7, programmeName: 'Science Missions', description: 'Scientific Research Missions', status: 'ACTIVE' },
    { id: 8, programmeName: 'Navigation Sattelites', description: 'Navigation System Programme', status: 'ACTIVE' },
    { id: 9, programmeName: 'Space Exploration Missions', description: 'Space Exploration Initiative', status: 'ACTIVE' },
    { id: 10, programmeName: 'Technology Demonstration Missions', description: 'Technology Demonstration', status: 'ACTIVE' },
    { id: 11, programmeName: 'User Funded Satellites', description: 'User Funded Satellite Programme', status: 'ACTIVE' }
  ];

  const leadCentres = [
    'UR Rao Satellite Centre ',
    'VIKRAM Sarabhai Space Centre',
    'SATISH Dhawan Space Centre',
    'Space Applications Centre'
  ];

  // Load existing project if in edit mode
  useEffect(() => {
    if (isOpen && projectId) {
      loadProject();
    } else if (isOpen) {
      setIsEditMode(false);
      resetForm();
    }
  }, [isOpen, projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const project = await projectService.getProjectById(projectId!);
      
      // Find the programme to get its ID
      const selectedProgramme = programmes.find(p => p.programmeName === project.programmeName);
      
      setFormData({
        projectName: project.projectName,
        shortName: project.shortName,
        projectType: project.projectType || '',
        categoryName: project.category,
        programmeName: project.programmeName,
        programmeId: selectedProgramme?.id || null,
        leadCentreName: project.leadCentre,
        budgetCode: project.budgetCode,
        financialSanction: (project.sanctionedAmount / 100000).toString(), // Convert from rupees to lakhs
        projectRealizationDate: new Date(project.endDate).toISOString().split('T')[0],
        programmeDirectorId: project.programmeDirId || null,
        projectDirectorId: project.projectDirectorId || null,
        projectDocument: null,
        description: ''
      });
      
      setIsEditMode(true);
      setErrors({});
    } catch (err) {
      setErrors({ submit: `Failed to load project: ${err instanceof Error ? err.message : 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      shortName: '',
      projectType: '',
      categoryName: '',
      programmeName: '',
      programmeId: null,
      leadCentreName: '',
      budgetCode: '',
      financialSanction: '',
      projectRealizationDate: '',
      programmeDirectorId: null,
      projectDirectorId: null,
      projectDocument: null,
      description: ''
    });
    setErrors({});
    setSuccess(false);
    setSuccessMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for programme selection to also set programmeId
    if (name === 'programmeName') {
      const selectedProgramme = programmes.find(p => p.programmeName === value);
      setFormData({
        ...formData,
        programmeName: value,
        programmeId: selectedProgramme?.id || null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      projectDocument: file
    });
    if (errors.projectDocument) {
      setErrors({
        ...errors,
        projectDocument: ''
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

    // Project Type validation
    if (!formData.projectType) {
      newErrors.projectType = 'Project type is required';
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

    // Budget Code validation - 2 digits alphanumeric uppercase
    if (!formData.budgetCode.trim()) {
      newErrors.budgetCode = 'Budget code is required';
    } else if (!/^[A-Z0-9]{2}$/.test(formData.budgetCode.trim())) {
      newErrors.budgetCode = 'Budget code must be exactly 2 characters (alphanumeric, uppercase only)';
    }

    // Financial Sanction validation
    if (!formData.financialSanction) {
      newErrors.financialSanction = 'Financial sanction is required';
    } else {
      const amount = parseFloat(formData.financialSanction);
      if (isNaN(amount)) {
        newErrors.financialSanction = 'Please enter a valid number';
      } else if (amount < 10) {
        newErrors.financialSanction = 'Minimum financial sanction is ₹10 lakhs';
      } else if (amount > 100000) {
        newErrors.financialSanction = 'Maximum financial sanction is ₹100,000 lakhs';
      }
    }

    // Project Realization Date validation
    if (!formData.projectRealizationDate) {
      newErrors.projectRealizationDate = 'Project realization date is required';
    } else {
      const selectedDate = new Date(formData.projectRealizationDate);
      const today = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

      if (!isEditMode && selectedDate <= today) {
        newErrors.projectRealizationDate = 'Date must be in the future';
      } else if (!isEditMode && selectedDate < sixMonthsFromNow) {
        newErrors.projectRealizationDate = 'Date should be at least 6 months from today';
      }
    }

    // Programme Director validation
    if (!formData.programmeDirectorId) {
      newErrors.programmeDirectorId = 'Programme Director is required';
    }

    // Project Director validation
    if (!formData.projectDirectorId) {
      newErrors.projectDirectorId = 'Project Director is required';
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

      const token = user.token || authService.getToken();
      
      if (!token) {
        setErrors({ submit: 'Authentication token not found. Please login again.' });
        return;
      }

      const sanctionedAmountInRupees = parseFloat(formData.financialSanction) * 100000;

      const projectData = {
        projectName: formData.projectName.trim(),
        shortName: formData.shortName.trim().toUpperCase(),
        programmeName: formData.programmeName,
        programmeId: formData.programmeId,
        projectType: formData.projectType,
        category: formData.categoryName,
        budgetCode: formData.budgetCode.trim(),
        leadCentre: formData.leadCentreName,
        sanctionedAmount: sanctionedAmountInRupees,
        endDate: formData.projectRealizationDate,
        programmeDirectorId: formData.programmeDirectorId,
        projectDirectorId: formData.projectDirectorId,
        programmeDirId: user.id,
      };

      let response;
      if (isEditMode && projectId) {
        const projectDataForUpdate = {
          projectName: formData.projectName.trim(),
          shortName: formData.shortName.trim().toUpperCase(),
          programmeName: formData.programmeName,
          programmeId: formData.programmeId,
          projectType: formData.projectType,
          category: formData.categoryName,
          budgetCode: formData.budgetCode.trim(),
          leadCentre: formData.leadCentreName,
          sanctionedAmount: sanctionedAmountInRupees,
          endDate: formData.projectRealizationDate,
          programmeDirectorId: formData.programmeDirectorId,
          projectDirectorId: formData.projectDirectorId,
        };
        response = await projectService.updateProject(projectId, projectDataForUpdate, formData.projectDocument || undefined);
        setSuccessMessage(`Project "${response.projectName}" updated successfully!`);
      } else {
        response = await projectService.createProject(projectData, token, formData.projectDocument || undefined);
        setSuccessMessage(`Project "${response.projectName}" created successfully!`);
      }
      
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save project';
      setErrors({ submit: errorMessage });
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

          {/* Error Message */}
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
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Basic Information
            </h3>
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

              <div>
                <CoreUISearchableSelect
                  label="Type of Project"
                  placeholder="Search project type..."
                  options={projectTypes.map(type => ({ value: type, label: type }))}
                  value={formData.projectType}
                  onChange={(value) => {
                    setFormData({ ...formData, projectType: value as string });
                    if (errors.projectType) {
                      setErrors({ ...errors, projectType: '' });
                    }
                  }}
                  error={errors.projectType}
                  required={true}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-600" />
              Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CoreUISearchableSelect
                  label="Category"
                  placeholder="Search category..."
                  options={categories.map(cat => ({ value: cat, label: cat }))}
                  value={formData.categoryName}
                  onChange={(value) => {
                    setFormData({ ...formData, categoryName: value as string });
                    if (errors.categoryName) {
                      setErrors({ ...errors, categoryName: '' });
                    }
                  }}
                  error={errors.categoryName}
                  required={true}
                  disabled={loading}
                />
              </div>

              <div>
                <CoreUISearchableSelect
                  label="Programme"
                  placeholder="Search programme..."
                  options={programmes.map(prog => ({ value: prog.programmeName, label: prog.programmeName }))}
                  value={formData.programmeName}
                  onChange={(value) => {
                    const selectedProgramme = programmes.find(p => p.programmeName === value);
                    setFormData({
                      ...formData,
                      programmeName: value as string,
                      programmeId: selectedProgramme?.id || null
                    });
                    if (errors.programmeName) {
                      setErrors({ ...errors, programmeName: '' });
                    }
                  }}
                  error={errors.programmeName}
                  required={true}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-green-600" />
              Organization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CoreUISearchableSelect
                  label="Lead Centre"
                  placeholder="Search lead centre..."
                  options={leadCentres.map(centre => ({ value: centre, label: centre }))}
                  value={formData.leadCentreName}
                  onChange={(value) => {
                    setFormData({ ...formData, leadCentreName: value as string });
                    if (errors.leadCentreName) {
                      setErrors({ ...errors, leadCentreName: '' });
                    }
                  }}
                  error={errors.leadCentreName}
                  required={true}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Code *</label>
                <input
                  type="text"
                  name="budgetCode"
                  value={formData.budgetCode}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setFormData({ ...formData, budgetCode: value });
                    if (errors.budgetCode) {
                      setErrors({ ...errors, budgetCode: '' });
                    }
                  }}
                  placeholder="e.g., LV"
                  maxLength={2}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition uppercase ${
                    errors.budgetCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.budgetCode && (
                  <p className="text-red-600 text-sm mt-1">{errors.budgetCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Budget and Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              Budget & Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Financial Sanction (₹ Lakhs) *</label>
                <input
                  type="number"
                  name="financialSanction"
                  value={formData.financialSanction}
                  onChange={handleChange}
                  placeholder="e.g., 500"
                  step="0.01"
                  min="10"
                  max="100000"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.financialSanction ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.financialSanction && (
                  <p className="text-red-600 text-sm mt-1">{errors.financialSanction}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  Project Realization Date *
                  <div className="relative inline-block">
                    <HelpCircle
                      className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                      onMouseEnter={() => setShowTooltip('projectRealizationDate')}
                      onMouseLeave={() => setShowTooltip(null)}
                    />
                    {showTooltip === 'projectRealizationDate' && (
                      <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                        {tooltips.projectRealizationDate}
                      </div>
                    )}
                  </div>
                </label>
                <input
                  type="date"
                  name="projectRealizationDate"
                  value={formData.projectRealizationDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                    errors.projectRealizationDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.projectRealizationDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.projectRealizationDate}</p>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                Project Document
                <div className="relative inline-block">
                  <HelpCircle
                    className="w-4 h-4 text-gray-400 cursor-help hover:text-gray-600"
                    onMouseEnter={() => setShowTooltip('projectDocument')}
                    onMouseLeave={() => setShowTooltip(null)}
                  />
                  {showTooltip === 'projectDocument' && (
                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
                      {tooltips.projectDocument}
                    </div>
                  )}
                </div>
              </label>
              <input
                type="file"
                name="projectDocument"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  errors.projectDocument ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              <p className="text-gray-600 text-xs mt-1">Accepted formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
              {errors.projectDocument && (
                <p className="text-red-600 text-sm mt-1">{errors.projectDocument}</p>
              )}
            </div>
          </div>

          {/* Directors */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-green-600" />
              Project Leadership
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CoreUISearchableSelect
                  label={formData.categoryName === 'Launch Vehicles' ? 'Mission Programme Director' : 'Programme Director'}
                  placeholder={`Search ${formData.categoryName === 'Launch Vehicles' ? 'Mission Programme Directors' : 'Programme Directors'}...`}
                  options={programmeDirectors.map(director => ({ value: director.id, label: director.fullName }))}
                  value={formData.programmeDirectorId}
                  onChange={(value) => {
                    setFormData({ ...formData, programmeDirectorId: value as number | null });
                    if (errors.programmeDirectorId) {
                      setErrors({ ...errors, programmeDirectorId: '' });
                    }
                  }}
                  error={errors.programmeDirectorId}
                  required={true}
                  disabled={loading}
                />
              </div>

              <div>
                <CoreUISearchableSelect
                  label={formData.categoryName === 'Launch Vehicles' ? 'Mission Director' : 'Project Director'}
                  placeholder={`Search ${formData.categoryName === 'Launch Vehicles' ? 'Mission Directors' : 'Project Directors'}...`}
                  options={projectDirectors.map(director => ({ value: director.id, label: director.fullName }))}
                  value={formData.projectDirectorId}
                  onChange={(value) => {
                    setFormData({ ...formData, projectDirectorId: value as number | null });
                    if (errors.projectDirectorId) {
                      setErrors({ ...errors, projectDirectorId: '' });
                    }
                  }}
                  error={errors.projectDirectorId}
                  required={true}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the project objectives and scope..."
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditMode ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

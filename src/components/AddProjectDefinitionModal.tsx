import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectDetailService, ProjectDetailRequest, ProjectDetailResponse } from '../services/projectDetailService';
import { ProjectCategoryService } from '../services/projectCategoryService';
import { ProgrammeTypeService } from '../services/programmeTypeService';
import { budgetCentreProjectCodeService } from '../services/budgetCentreProjectCodeService';
import { sanctioningAuthorityService } from '../services/sanctioningAuthorityService';
import CoreUISearchableSelect from './CoreUISearchableSelect';

interface AddProjectDefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectCode?: string; // For edit mode
}

interface Errors {
  [key: string]: string;
}

export const AddProjectDefinitionModal: React.FC<AddProjectDefinitionModalProps> = ({ isOpen, onClose, onSuccess, projectCode }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProjectDetailRequest>({
    missionProjectFullName: '',
    missionProjectShortName: '',
    missionProjectDescription: '',
    projectCategoryCode: '',
    budgetCode: '',
    projectTypesCode: '',
    sanctionedAuthority: '',
    individualCombinedSanctionCost: '',
    sanctionedCost: 0,
    dateOffs: '',
    durationInMonths: null,
    originalSchedule: '',
    fsCopy: null,
    missionProjectDirector: '',
    programmeDirector: '',
    cumExpUpToPrevFy: null,
    curYrExp: null,
    currentStatusPercentage: null,
    currentStatus: '',
    currentStatusRemarks: null,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [sanctionedCostLakhs, setSanctionedCostLakhs] = useState<number>(0);
  const [dropdownOptions, setDropdownOptions] = useState({
    categories: [] as Array<{ code: string; name: string; description?: string }>,
    projectTypes: [] as Array<{ code: string; name: string; description?: string }>,
    budgetCodes: [] as Array<{ code: string; name: string; description?: string }>,
    sanctioningAuthorities: [] as Array<{ code: string; name: string; description?: string }>,
    statuses: [] as Array<{ code: string; name: string }>,
  });

  const tooltips: { [key: string]: string } = {
    missionProjectFullName: 'Enter the complete project name',
    missionProjectShortName: 'Enter a short abbreviation (max 50 characters)',
    missionProjectDescription: 'Brief description of the project (max 50 characters)',
    budgetCode: 'Budget classification code (max 9 characters)',
    sanctionedCost: 'Total sanctioned project cost',
    dateOffs: 'Date when the project was sanctioned',
  };

  // Load project details if in edit mode
  useEffect(() => {
    if (projectCode) {
      loadProjectDetails(projectCode);
      setIsEditMode(true);
    }
  }, [projectCode]);

  // Load dropdown options
  useEffect(() => {
    if (isOpen) {
      loadDropdownOptions();
    }
  }, [isOpen]);

  const loadProjectDetails = async (code: string) => {
    try {
      const project = await projectDetailService.getProjectDetailByCode(code);
      const lakhsValue = project.sanctionedCost ? project.sanctionedCost / 100000 : 0; // Convert from actual amount to Lakhs
      setSanctionedCostLakhs(lakhsValue);
      setFormData({
        missionProjectFullName: project.missionProjectFullName || '',
        missionProjectShortName: project.missionProjectShortName || '',
        missionProjectDescription: project.missionProjectDescription || '',
        projectCategoryCode: project.projectCategoryCode || '',
        budgetCode: project.budgetCode || '',
        projectTypesCode: project.projectTypesCode || '',
        sanctionedAuthority: project.sanctionedAuthority || '',
        individualCombinedSanctionCost: project.individualCombinedSanctionCost || '',
        sanctionedCost: project.sanctionedCost || 0,
        dateOffs: project.dateOffs || '',
        durationInMonths: project.durationInMonths || null,
        originalSchedule: project.originalSchedule || '',
        fsCopy: project.fsCopy || null,
        missionProjectDirector: project.missionProjectDirector || '',
        programmeDirector: project.programmeDirector || '',
        cumExpUpToPrevFy: project.cumExpUpToPrevFy || null,
        curYrExp: project.curYrExp || null,
        currentStatusPercentage: project.currentStatusPercentage || null,
        currentStatus: project.currentStatus || '',
        currentStatusRemarks: project.currentStatusRemarks || null,
      });
    } catch (err) {
      setErrors({ submit: 'Failed to load project details' });
    }
  };

  const loadDropdownOptions = async () => {
    try {
      console.log('Loading dropdown options...');
      const [categories, programmeTypes, budgetCodes, sanctioningAuthorities] = await Promise.all([
        ProjectCategoryService.getAllProjectCategories().catch(err => {
          console.error('Failed to load categories:', err);
          return [];
        }),
        ProgrammeTypeService.getAllProgrammeTypes().catch(err => {
          console.error('Failed to load programme types:', err);
          return [];
        }),
        budgetCentreProjectCodeService.getAllBudgetCentreProjectCodes().catch(err => {
          console.error('Failed to load budget codes:', err);
          return [];
        }),
        sanctioningAuthorityService.getAllSanctioningAuthorities().catch(err => {
          console.error('Failed to load sanctioning authorities:', err);
          return [];
        }),
      ]);

      console.log('Loaded sanctioning authorities:', sanctioningAuthorities);

      setDropdownOptions({
        categories: (categories || []).map(cat => ({
          code: cat.projectCategoryCode,
          name: cat.projectCategoryFullName,
          description: cat.projectCategoryShortName,
        })),
        projectTypes: (programmeTypes || []).map(type => ({
          code: type.programmeTypeCode,
          name: type.programmeTypeFullName,
          description: type.programmeTypeShortName,
        })),
        budgetCodes: (budgetCodes || []).map(bc => ({
          code: bc.centreProjectCode,
          name: bc.budgetCentreProjectFullName,
          description: bc.budgetCentreProjectShortName,
        })),
        sanctioningAuthorities: (sanctioningAuthorities || []).map(sa => ({
          code: sa.sanctioningAuthorityCode,
          name: sa.sanctioningAuthorityFullName,
          description: sa.sanctioningAuthorityShortName,
        })),
        statuses: [
          { code: '01', name: 'On Track' },
          { code: '02', name: 'At Risk' },
          { code: '03', name: 'Delayed' },
          { code: '04', name: 'Completed' },
        ],
      });
    } catch (err) {
      console.error('Failed to load dropdown options:', err);
      // Set empty arrays to prevent undefined errors
      setDropdownOptions(prev => ({
        ...prev,
        sanctioningAuthorities: [],
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.missionProjectFullName?.trim()) {
      newErrors.missionProjectFullName = 'Project name is required';
    }
    if (!formData.missionProjectShortName?.trim()) {
      newErrors.missionProjectShortName = 'Short name is required';
    }
    if (!formData.missionProjectDescription?.trim()) {
      newErrors.missionProjectDescription = 'Description is required';
    }
    if (!formData.projectCategoryCode) {
      newErrors.projectCategoryCode = 'Category is required';
    }
    if (!formData.budgetCode) {
      newErrors.budgetCode = 'Budget code is required';
    }
    if (!formData.projectTypesCode) {
      newErrors.projectTypesCode = 'Project type is required';
    }
    if (!formData.sanctionedAuthority?.trim()) {
      newErrors.sanctionedAuthority = 'Sanctioned authority is required';
    }
    if (!formData.individualCombinedSanctionCost) {
      newErrors.individualCombinedSanctionCost = 'Please select Individual or Combined';
    }
    if (!sanctionedCostLakhs || sanctionedCostLakhs <= 0) {
      newErrors.sanctionedCost = 'Sanctioned cost must be greater than 0';
    }
    if (!formData.dateOffs) {
      newErrors.dateOffs = 'Date of sanction is required';
    }
    if (!formData.originalSchedule) {
      newErrors.originalSchedule = 'Original schedule is required';
    }
    if (!formData.missionProjectDirector) {
      newErrors.missionProjectDirector = 'Project director is required';
    }
    if (!formData.programmeDirector) {
      newErrors.programmeDirector = 'Programme director is required';
    }
    if (!formData.currentStatus) {
      newErrors.currentStatus = 'Current status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Convert Lakhs to actual amount (1 Lakh = 100,000)
      const submissionData = {
        ...formData,
        sanctionedCost: sanctionedCostLakhs * 100000 // Convert Lakhs to actual amount
      };

      if (isEditMode && projectCode) {
        await projectDetailService.updateProjectDetail(projectCode, submissionData);
        setSuccessMessage('Project definition updated successfully!');
      } else {
        const response = await projectDetailService.createProjectDetail(submissionData);
        setSuccessMessage(`Project definition created successfully! Code: ${response.missionProjectCode}`);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'Failed to save project definition'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      missionProjectFullName: '',
      missionProjectShortName: '',
      missionProjectDescription: '',
      projectCategoryCode: '',
      budgetCode: '',
      projectTypesCode: '',
      sanctionedAuthority: '',
      individualCombinedSanctionCost: '',
      sanctionedCost: 0,
      dateOffs: '',
      durationInMonths: null,
      originalSchedule: '',
      fsCopy: null,
      missionProjectDirector: '',
      programmeDirector: '',
      cumExpUpToPrevFy: null,
      curYrExp: null,
      currentStatusPercentage: null,
      currentStatus: '',
      currentStatusRemarks: null,
    });
    setSanctionedCostLakhs(0);
    setErrors({});
    setSuccess(false);
    setIsEditMode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isEditMode ? 'Edit Project Definition' : 'New Project Definition'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-blue-500 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {success ? (
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">{successMessage}</p>
                <p className="text-sm text-green-700">Redirecting...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Error */}
              {errors.submit && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Project Details Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Project Details
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  {/* Project Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.missionProjectFullName || ''}
                      onChange={(e) => handleChange('missionProjectFullName', e.target.value)}
                      placeholder="Enter project name"
                      maxLength={255}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.missionProjectFullName ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.missionProjectFullName && (
                      <p className="text-red-600 text-sm mt-2 font-medium">{errors.missionProjectFullName}</p>
                    )}
                  </div>

                  {/* Short Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Short Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.missionProjectShortName || ''}
                      onChange={(e) => handleChange('missionProjectShortName', e.target.value)}
                      placeholder="Max 50 chars"
                      maxLength={50}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.missionProjectShortName ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.missionProjectShortName && (
                      <p className="text-red-600 text-sm mt-2 font-medium">{errors.missionProjectShortName}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.missionProjectDescription || ''}
                    onChange={(e) => handleChange('missionProjectDescription', e.target.value)}
                    placeholder="Brief description (max 50 chars)"
                    maxLength={50}
                    rows={2}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
                      errors.missionProjectDescription ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">Characters: {(formData.missionProjectDescription || '').length}/50</p>
                    {errors.missionProjectDescription && (
                      <p className="text-red-600 text-sm font-medium">{errors.missionProjectDescription}</p>
                    )}
                  </div>
                  
                  {errors.missionProjectDescription && (
                    <p className="text-red-600 text-sm mt-1">{errors.missionProjectDescription}</p>
                  )}
                </div>
              </div>

              {/* Category and Type */}
              <div className="grid grid-cols-2 gap-6">
                {/* Category */}
                <CoreUISearchableSelect
                  label="Category"
                  placeholder="Search category..."
                  options={dropdownOptions.categories.map(cat => ({ 
                    value: cat.code, 
                    label: `${cat.name}` 
                  }))}
                  value={formData.projectCategoryCode || null}
                  onChange={(value) => {
                    handleChange('projectCategoryCode', value || '');
                    if (errors.projectCategoryCode) {
                      setErrors(prev => ({ ...prev, projectCategoryCode: '' }));
                    }
                  }}
                  error={errors.projectCategoryCode}
                  required={true}
                  disabled={loading}
                />

                {/* Project Type */}
                <CoreUISearchableSelect
                  label="Project Type"
                  placeholder="Search project type..."
                  options={dropdownOptions.projectTypes.map(type => ({ 
                    value: type.code, 
                    label: `${type.name}` 
                  }))}
                  value={formData.projectTypesCode || null}
                  onChange={(value) => {
                    handleChange('projectTypesCode', value || '');
                    if (errors.projectTypesCode) {
                      setErrors(prev => ({ ...prev, projectTypesCode: '' }));
                    }
                  }}
                  error={errors.projectTypesCode}
                  required={true}
                  disabled={loading}
                />
              </div>

              {/* Budget Details */}
              <div className="space-y-6 border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Budget Details
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  {/* Budget Code */}
                  <CoreUISearchableSelect
                    label="Budget Code"
                    placeholder="Search budget code..."
                    options={dropdownOptions.budgetCodes.map(bc => ({ 
                      value: bc.code,
                      label: `${bc.name} - ${bc.code}` 
                    }))}
                    value={formData.budgetCode || null}
                    onChange={(value) => {
                      handleChange('budgetCode', value || '');
                      if (errors.budgetCode) {
                        setErrors(prev => ({ ...prev, budgetCode: '' }));
                      }
                    }}
                    error={errors.budgetCode}
                    required={true}
                    disabled={loading}
                  />

                  {/* Sanctioned Cost */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Sanctioned Cost (Lakhs) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-gray-600 font-bold text-lg">₹</span>
                      <input
                        type="number"
                        value={sanctionedCostLakhs || 0}
                        onChange={(e) => {
                          setSanctionedCostLakhs(parseFloat(e.target.value) || 0);
                          if (errors.sanctionedCost) {
                            setErrors(prev => ({ ...prev, sanctionedCost: '' }));
                          }
                        }}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.sanctionedCost ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                        }`}
                      />
                    </div>
                    {errors.sanctionedCost && (
                      <p className="text-red-600 text-sm mt-2 font-medium">{errors.sanctionedCost}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Sanctioned Authority */}
                  <CoreUISearchableSelect
                    label="Sanctioning Authority"
                    placeholder="Search sanctioning authority..."
                    options={dropdownOptions.sanctioningAuthorities.map(sa => ({ 
                      value: sa.code, 
                      label: `${sa.name} (${sa.description})` 
                    }))}
                    value={formData.sanctionedAuthority || null}
                    onChange={(value) => {
                      handleChange('sanctionedAuthority', value || '');
                      if (errors.sanctionedAuthority) {
                        setErrors(prev => ({ ...prev, sanctionedAuthority: '' }));
                      }
                    }}
                    error={errors.sanctionedAuthority}
                    required={true}
                    disabled={loading}
                  />

                  {/* Individual/Combined */}
                  <CoreUISearchableSelect
                    label="Individual/Combined"
                    placeholder="Select option..."
                    options={[
                      { value: 'I', label: 'Individual Sanction' },
                      { value: 'C', label: 'Combined Sanction' }
                    ]}
                    value={formData.individualCombinedSanctionCost || null}
                    onChange={(value) => {
                      handleChange('individualCombinedSanctionCost', value || '');
                      if (errors.individualCombinedSanctionCost) {
                        setErrors(prev => ({ ...prev, individualCombinedSanctionCost: '' }));
                      }
                    }}
                    error={errors.individualCombinedSanctionCost}
                    required={true}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Schedule Information */}
              <div className="space-y-6 border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Schedule Information
                </h3>

                <div className="grid grid-cols-3 gap-6">
                  {/* Date of Sanction */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Date of Sanction <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOffs || ''}
                      onChange={(e) => handleChange('dateOffs', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.dateOffs ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.dateOffs && (
                      <p className="text-red-600 text-sm mt-2 font-medium">{errors.dateOffs}</p>
                    )}
                  </div>

                  {/* Duration in Months */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Duration (Months)
                    </label>
                    <input
                      type="number"
                      value={formData.durationInMonths || ''}
                      onChange={(e) => handleChange('durationInMonths', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all"
                    />
                  </div>

                  {/* Original Schedule */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Original Schedule <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.originalSchedule || ''}
                      onChange={(e) => handleChange('originalSchedule', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.originalSchedule ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    {errors.originalSchedule && (
                      <p className="text-red-600 text-sm mt-2 font-medium">{errors.originalSchedule}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Team */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Project Team</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Project Director */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Director *
                    </label>
                    <input
                      type="text"
                      value={formData.missionProjectDirector || ''}
                      onChange={(e) => handleChange('missionProjectDirector', e.target.value)}
                      placeholder="Enter project director"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.missionProjectDirector ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.missionProjectDirector && (
                      <p className="text-red-600 text-sm mt-1">{errors.missionProjectDirector}</p>
                    )}
                  </div>

                  {/* Programme Director */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Programme Director *
                    </label>
                    <input
                      type="text"
                      value={formData.programmeDirector || ''}
                      onChange={(e) => handleChange('programmeDirector', e.target.value)}
                      placeholder="Enter programme director"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.programmeDirector ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.programmeDirector && (
                      <p className="text-red-600 text-sm mt-1">{errors.programmeDirector}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Status</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Current Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.currentStatus || ''}
                      onChange={(e) => handleChange('currentStatus', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white ${
                        errors.currentStatus ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Status</option>
                      {dropdownOptions.statuses.map(status => (
                        <option key={status.code} value={status.code}>{status.name}</option>
                      ))}
                    </select>
                    {errors.currentStatus && (
                      <p className="text-red-600 text-sm mt-1">{errors.currentStatus}</p>
                    )}
                  </div>

                  {/* Status Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status % Complete
                    </label>
                    <input
                      type="number"
                      value={formData.currentStatusPercentage || ''}
                      onChange={(e) => handleChange('currentStatusPercentage', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Remarks
                  </label>
                  <textarea
                    value={formData.currentStatusRemarks || ''}
                    onChange={(e) => handleChange('currentStatusRemarks', e.target.value)}
                    placeholder="Enter any remarks (max 255 chars)"
                    maxLength={255}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Optional Expenditure Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Expenditure (Optional)</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Cumulative Exp Previous FY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cumulative Exp Previous FY
                    </label>
                    <input
                      type="number"
                      value={formData.cumExpUpToPrevFy || ''}
                      onChange={(e) => handleChange('cumExpUpToPrevFy', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Current Year Expenditure */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Year Expenditure
                    </label>
                    <input
                      type="number"
                      value={formData.curYrExp || ''}
                      onChange={(e) => handleChange('curYrExp', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-8 border-t-2 border-gray-200\">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEditMode ? 'Update' : 'Create'} Project Definition
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 transition-colors font-semibold border-2 border-gray-300 hover:border-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

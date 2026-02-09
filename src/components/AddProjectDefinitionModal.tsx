import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { projectDetailService, ProjectDetailRequest, ProjectDetailResponse } from '../services/projectDetailService';
import { ProgrammeTypeService } from '../services/programmeTypeService';
import { projectTypeService } from '../services/projectTypeService';
import { budgetCentreProjectCodeService } from '../services/budgetCentreProjectCodeService';
import { sanctioningAuthorityService } from '../services/sanctioningAuthorityService';
import { projectStatusCodeService } from '../services/projectStatusCodeService';
import { employeeDetailsService } from '../services/employeeDetailsService';
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
    budgetCode: '',
    programmeTypeCode: '',
    projectTypesCode: '',
    leadCentreCode: '',
    sanctionedAuthority: '',
    individualCombinedSanctionCost: '',
    sanctionedCost: 0,
    dateOffs: '',
    durationInMonths: null,
    originalSchedule: '',
    fsCopy: null,
    missionProjectDirector: '',
    programmeDirector: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [sanctionedCostLakhs, setSanctionedCostLakhs] = useState<number>(0);
  
  // Time Overrun and Project Actuals states
  const [timeOverrunApproval, setTimeOverrunApproval] = useState<string>('NO');
  const [revisedCompletionDate, setRevisedCompletionDate] = useState<string>('');
  const [projectActuals, setProjectActuals] = useState<Array<{
    budgetYear: number;
    plannedCashFlow: number;
    votedGrant: number;
    revisedEstimates: number;
    actualExpenditure: number;
  }>>([]);
  const [currentActualRow, setCurrentActualRow] = useState<{
    budgetYear: number;
    plannedCashFlow: number;
    votedGrant: number;
    revisedEstimates: number;
    actualExpenditure: number;
  }>({
    budgetYear: new Date().getFullYear(),
    plannedCashFlow: 0,
    votedGrant: 0,
    revisedEstimates: 0,
    actualExpenditure: 0,
  });
  
  const [dropdownOptions, setDropdownOptions] = useState({
    categories: [] as Array<{ code: string; name: string; description?: string }>,
    programmeTypes: [] as Array<{ code: string; name: string; description?: string; display?: string }>,
    projectTypes: [] as Array<{ code: string; name: string; description?: string; display?: string }>,
    budgetCodes: [] as Array<{ code: string; name: string; description?: string }>,
    sanctioningAuthorities: [] as Array<{ code: string; name: string; description?: string }>,
    statuses: [] as Array<{ code: string; name: string }>,
    employees: [] as Array<{ code: string; name: string; display: string }>,
    leadCentres: [] as Array<{ code: string; name: string; display: string }>,
  });

  const tooltips: { [key: string]: string } = {
    missionProjectFullName: 'Enter the complete project name',
    missionProjectShortName: 'Enter a short abbreviation (max 50 characters)',
    missionProjectDescription: 'Brief description of the project (max 50 characters)',
    budgetCode: 'Budget classification code (max 9 characters)',
    sanctionedCost: 'Total sanctioned project cost',
    dateOffs: 'Date when the project was sanctioned',
  };

  // Helper function to check if originalSchedule is in the past (delayed)
  const isProjectDelayed = (): boolean => {
    if (!formData.originalSchedule) return false;
    const scheduleDate = new Date(formData.originalSchedule);
    const today = new Date();
    scheduleDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return scheduleDate < today;
  };

  // Helper function to add a new project actuals row
  const addProjectActualRow = () => {
    if (currentActualRow.budgetYear && currentActualRow.plannedCashFlow > 0) {
      setProjectActuals([...projectActuals, currentActualRow]);
      setCurrentActualRow({
        budgetYear: new Date().getFullYear(),
        plannedCashFlow: 0,
        votedGrant: 0,
        revisedEstimates: 0,
        actualExpenditure: 0,
      });
    } else {
      alert('Please enter Budget Year and Planned Cash Flow > 0');
    }
  };

  // Helper function to remove a project actuals row
  const removeProjectActualRow = (index: number) => {
    setProjectActuals(projectActuals.filter((_, i) => i !== index));
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

  // Monitor originalSchedule for delay detection
  useEffect(() => {
    if (formData.originalSchedule) {
      const isDelayed = isProjectDelayed();
      if (isDelayed && timeOverrunApproval === 'NO') {
        // Auto-enable time overrun section if project is delayed
        setTimeOverrunApproval('YES');
      } else if (!isDelayed) {
        // Reset if schedule is no longer in the past
        setTimeOverrunApproval('NO');
        setRevisedCompletionDate('');
        setProjectActuals([]);
      }
    }
  }, [formData.originalSchedule]);

  const loadProjectDetails = async (code: string) => {
    try {
      const project = await projectDetailService.getProjectDetailByCode(code);
      console.log("project------------"+JSON.stringify(project));
      //const lakhsValue = project.sanctionedCost ? project.sanctionedCost / 100000 : 0; // Convert from actual amount to Lakhs
      setSanctionedCostLakhs(project.sanctionedCost);
      
      // Load time overrun data if exists
      if (project.timeOverrunApproval) {
        setTimeOverrunApproval(project.timeOverrunApproval);
      }
      
      if (project.revisedCompletionDate) {
        setRevisedCompletionDate(project.revisedCompletionDate);
      }
      
      // Load existing project actuals data if exists
      if (project.projectActuals && Array.isArray(project.projectActuals) && project.projectActuals.length > 0) {
        setProjectActuals(
          project.projectActuals.map((actuals: any) => ({
            budgetYear: actuals.budgetYear,
            plannedCashFlow: actuals.plannedCashFlow || 0,
            votedGrant: actuals.votedGrant || 0,
            revisedEstimates: actuals.revisedEstimates || 0,
            actualExpenditure: actuals.actualExpenditure || 0,
          }))
        );
      }
      
      setFormData({
        missionProjectFullName: project.missionProjectFullName || '',
        missionProjectShortName: project.missionProjectShortName || '',
        missionProjectDescription: project.missionProjectDescription || '',
        budgetCode: project.budgetCode || '',
        programmeTypeCode: project.programmeTypeCode || '',
        projectTypesCode: project.projectTypesCode || '',
        leadCentreCode: project.leadCentreCode || '',
        sanctionedAuthority: project.sanctionedAuthority || '',
        individualCombinedSanctionCost: project.individualCombinedSanctionCost || '',
        sanctionedCost: project.sanctionedCost || 0,
        dateOffs: project.dateOffs || '',
        durationInMonths: project.durationInMonths || null,
        originalSchedule: project.originalSchedule || '',
        fsCopy: project.fsCopy || null,
        missionProjectDirector: project.missionProjectDirector || '',
        programmeDirector: project.programmeDirector || '',
      });
    } catch (err) {
      setErrors({ submit: 'Failed to load project details' });
    }
  };

  const loadDropdownOptions = async () => {
    try {
      console.log('Loading dropdown options...');
      const [programmeTypes, projectTypes, budgetCodes, sanctioningAuthorities, projectStatuses, employees] = await Promise.all([
        ProgrammeTypeService.getAllProgrammeTypes().catch(err => {
          console.error('Failed to load programme types:', err);
          return [];
        }),
        projectTypeService.getAllProjectTypes().catch(err => {
          console.error('Failed to load project types:', err);
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
        projectStatusCodeService.getAllProjectStatusCodes().catch(err => {
          console.error('Failed to load project status codes:', err);
          return [];
        }),
        employeeDetailsService.getAllEmployeeDetails().catch(err => {
          console.error('Failed to load employees:', err);
          return [];
        }),
      ]);

      console.log('Loaded sanctioning authorities:', sanctioningAuthorities);
      console.log('Loaded project statuses:', projectStatuses);
      console.log('Loaded employees:', employees);
      console.log('Loaded budget centre project codes:', budgetCodes);

      // Filter lead centres by centreProject = 'C'
      const leadCentres = (budgetCodes || []).filter(code => code.centreProject === 'C');

      setDropdownOptions({
        categories: [], // Categories now come from programmeType selection
        programmeTypes: (programmeTypes || []).map(type => ({
          code: type.programmeTypeCode,
          name: type.programmeTypeFullName,
          description: type.programmeTypeShortName,
          display: `${type.programmeTypeFullName}-${type.programmeTypeShortName}`,
        })),
        projectTypes: (projectTypes || []).map(type => ({
          code: type.projectTypesCode,
          name: type.projectTypesFullName,
          description: type.projectTypesShortName,
          display: `${type.projectTypesFullName}-${type.projectTypesShortName}`,
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
        statuses: (projectStatuses || []).map(status => ({
          code: status.projectStatusCode,
          name: status.projectStatusFullName,
        })),
        employees: (employees || []).map(emp => ({
          code: emp.employeeCode,
          name: emp.name,
          display: `${emp.employeeCode}-${emp.name}`,
        })),
        leadCentres: leadCentres.map(lc => ({
          code: lc.centreProjectCode,
          name: lc.budgetCentreProjectFullName,
          display: lc.budgetCentreProjectShortName,
        })),
      });
    } catch (err) {
      console.error('Failed to load dropdown options:', err);
      // Set empty arrays to prevent undefined errors
      setDropdownOptions(prev => ({
        ...prev,
        sanctioningAuthorities: [],
        statuses: [],
        employees: [],
        leadCentres: [],
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
    if (!formData.budgetCode) {
      newErrors.budgetCode = 'Budget code is required';
    }
    if (!formData.programmeTypeCode) {
      newErrors.programmeTypeCode = 'Programme type is required';
    }
    if (!formData.projectTypesCode) {
      newErrors.projectTypesCode = 'Project type is required';
    }
    if (!formData.leadCentreCode) {
      newErrors.leadCentreCode = 'Lead centre is required';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    let updatedFormData = {
      ...formData,
      [field]: value
    };

    // When programmeType changes, auto-populate projectCategoryCode
    if (field === 'projectTypesCode') {
      const selectedType = dropdownOptions.projectTypes.find(pt => pt.code === value);
      // We need to find the category code from the programme type
      // This will be handled by fetching the full ProgrammeType details from backend
      // For now, we'll store the code and let the backend handle the relationship
    }

    setFormData(updatedFormData);
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

    // Validate time overrun data if applicable
    if (isProjectDelayed() && timeOverrunApproval === 'YES') {
      if (!revisedCompletionDate) {
        setErrors({ submit: 'Revised Completion Date is required when Time Overrun is approved' });
        return;
      }
      if (projectActuals.length === 0) {
        setErrors({ submit: 'At least one Project Actuals record is required when Time Overrun is approved' });
        return;
      }
    }

    setLoading(true);

    try {
      // Convert Lakhs to actual amount (1 Lakh = 100,000)
      const submissionData = {
        ...formData,
        sanctionedCost: sanctionedCostLakhs * 100000, // Convert Lakhs to actual amount
        currentStatus: "STS01",
        // Add time overrun data if applicable
        ...(isProjectDelayed() && timeOverrunApproval === 'YES' ? {
          timeOverrunApproval: 'YES',
          revisedCompletionDate: revisedCompletionDate,
          projectActuals: projectActuals.map(row => ({
            missionProjectCode: isEditMode && projectCode ? projectCode : formData.missionProjectFullName, // Use actual code in edit mode
            budgetYear: row.budgetYear,
            plannedCashFlow: row.plannedCashFlow,
            votedGrant: row.votedGrant,
            revisedEstimates: row.revisedEstimates,
            actualExpenditure: row.actualExpenditure,
            userId: user?.username || 'SYSTEM',
            regStatus: 'ACTIVE',
          })),
        } : {
          timeOverrunApproval: 'NO',
          revisedCompletionDate: '',
          projectActuals: [], // Clear actuals if not delayed or not approved
        })
      };

      console.log('Submission Data:', JSON.stringify(submissionData, null, 2));

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
      budgetCode: '',
      programmeTypeCode: '',
      projectTypesCode: '',
      leadCentreCode: '',
      sanctionedAuthority: '',
      individualCombinedSanctionCost: '',
      sanctionedCost: 0,
      dateOffs: '',
      durationInMonths: null,
      originalSchedule: '',
      fsCopy: null,
      missionProjectDirector: '',
      programmeDirector: '',
    });
    setSanctionedCostLakhs(0);
    setTimeOverrunApproval('NO');
    setRevisedCompletionDate('');
    setProjectActuals([]);
    setCurrentActualRow({
      budgetYear: new Date().getFullYear(),
      plannedCashFlow: 0,
      votedGrant: 0,
      revisedEstimates: 0,
      actualExpenditure: 0,
    });
    setErrors({});
    setSuccess(false);
    setIsEditMode(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 overflow-hidden">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
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
        <div className="p-8 overflow-y-auto flex-1">
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
                      Project Full Name <span className="text-red-500">*</span>
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
                      Project Short Name <span className="text-red-500">*</span>
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
                    Project Description <span className="text-red-500">*</span>
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

              {/* Programme Type - Full Width and Larger */}
              <div className="mb-6">
                <CoreUISearchableSelect
                  label="Programme Type*"
                  placeholder="Search programme type..."
                  options={dropdownOptions.programmeTypes.map(type => ({ 
                    value: type.code, 
                    label: type.display || `${type.code} - ${type.name || ''}`
                  }))}
                  value={formData.programmeTypeCode || null}
                  onChange={(value) => {
                    handleChange('programmeTypeCode', value || '');
                    if (errors.programmeTypeCode) {
                      setErrors(prev => ({ ...prev, programmeTypeCode: '' }));
                    }
                  }}
                  error={errors.programmeTypeCode}
                  required={true}
                  disabled={loading}
                  isLarge={true}
                />
              </div>

              {/* Project Type and Lead Centre - Side by Side */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Project Type */}
                <CoreUISearchableSelect
                  label="Project Type*"
                  placeholder="Search project type..."
                  options={dropdownOptions.projectTypes.map(type => ({ 
                    value: type.code, 
                    label: type.display || `${type.code} - ${type.name || ''}`
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

                {/* Lead Centre */}
                <CoreUISearchableSelect
                  label="Lead Centre*"
                  placeholder="Search lead centre..."
                  options={dropdownOptions.leadCentres.map(lc => ({ 
                    value: lc.code,
                    label: lc.display
                  }))}
                  value={formData.leadCentreCode || null}
                  onChange={(value) => {
                    handleChange('leadCentreCode', value || '');
                    if (errors.leadCentreCode) {
                      setErrors(prev => ({ ...prev, leadCentreCode: '' }));
                    }
                  }}
                  error={errors.leadCentreCode}
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
                    label="Budget Code*"
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

                  {/* Sanction Cost */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                      Sanction Cost (Lakhs) <span className="text-red-500">*</span>
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
                  {/* Sanctioning Authority */}
                  <CoreUISearchableSelect
                    label="Sanctioning Authority*"
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
                    label="Sanction Type*"
                    placeholder="Select option..."
                    options={[
                      { value: 'Individual', label: 'Individual Sanction' },
                      { value: 'Combined', label: 'Combined Sanction' }
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
                      Date Of Sanction <span className="text-red-500">*</span>
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
                      Duration In Months
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

              {/* Time Overrun Section - Appears only if project is delayed */}
              {isProjectDelayed() && (
                <div className="space-y-6 border-t-2 border-yellow-300 pt-6 bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-bold text-yellow-800 uppercase tracking-wider">
                      ⚠️ Project Time Overrun Detected
                    </h3>
                  </div>
                  <p className="text-sm text-yellow-700">
                    The original schedule date ({formData.originalSchedule}) is in the past. Please update with time overrun details.
                  </p>

                  {/* Time Overrun Approval */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        Time Overrun Approval <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={timeOverrunApproval}
                        onChange={(e) => {
                          setTimeOverrunApproval(e.target.value);
                          if (e.target.value === 'NO') {
                            setRevisedCompletionDate('');
                            setProjectActuals([]);
                          }
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-gray-400 transition-all font-medium"
                      >
                        <option value="NO">NO - No Overrun</option>
                        <option value="YES">YES - Has Overrun</option>
                      </select>
                    </div>

                    {/* Revised Completion Date - Only if YES */}
                    {timeOverrunApproval === 'YES' && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                          Revised Completion Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={revisedCompletionDate}
                          onChange={(e) => setRevisedCompletionDate(e.target.value)}
                          min={formData.originalSchedule}
                          className="w-full px-4 py-3 border-2 border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-yellow-400 transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-2">Must be after original schedule date</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Project Actuals Section - Appears only if timeOverrunApproval = YES */}
              {timeOverrunApproval === 'YES' && isProjectDelayed() && (
                <div className="space-y-6 border-t-2 border-blue-300 pt-6 bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-600 rounded"></div>
                    Project Actuals - Financial Data Entry
                  </h3>
                  <p className="text-sm text-blue-700">
                    Enter project financial actuals data for each budget year (Amounts in Lakhs)
                  </p>

                  {/* Data Entry Form */}
                  <div className="bg-white p-6 rounded-lg border-2 border-blue-200 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Budget Year */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Budget Year <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="2000"
                          max="2100"
                          value={currentActualRow.budgetYear}
                          onChange={(e) =>
                            setCurrentActualRow({
                              ...currentActualRow,
                              budgetYear: parseInt(e.target.value) || new Date().getFullYear(),
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      {/* Planned Cash Flow */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Planned Cash Flow <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={currentActualRow.plannedCashFlow}
                          onChange={(e) =>
                            setCurrentActualRow({
                              ...currentActualRow,
                              plannedCashFlow: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      {/* Voted Grant */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Voted Grant <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={currentActualRow.votedGrant}
                          onChange={(e) =>
                            setCurrentActualRow({
                              ...currentActualRow,
                              votedGrant: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {/* Revised Estimates */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Revised Estimates <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={currentActualRow.revisedEstimates}
                          onChange={(e) =>
                            setCurrentActualRow({
                              ...currentActualRow,
                              revisedEstimates: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      {/* Actual Expenditure */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Actual Expenditure <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={currentActualRow.actualExpenditure}
                          onChange={(e) =>
                            setCurrentActualRow({
                              ...currentActualRow,
                              actualExpenditure: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>

                      {/* Add Button */}
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={addProjectActualRow}
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm"
                        >
                          + Add Row
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Project Actuals Table */}
                  {projectActuals.length > 0 && (
                    <div className="overflow-x-auto border-2 border-blue-200 rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-blue-600 text-white">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Budget Year</th>
                            <th className="px-4 py-3 text-right font-semibold">Planned Cash Flow (₹)</th>
                            <th className="px-4 py-3 text-right font-semibold">Voted Grant (₹)</th>
                            <th className="px-4 py-3 text-right font-semibold">Revised Estimates (₹)</th>
                            <th className="px-4 py-3 text-right font-semibold">Actual Expenditure (₹)</th>
                            <th className="px-4 py-3 text-center font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projectActuals.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                              <td className="px-4 py-3 border-t border-blue-200 font-medium">{row.budgetYear}</td>
                              <td className="px-4 py-3 border-t border-blue-200 text-right">
                                {row.plannedCashFlow.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 border-t border-blue-200 text-right">
                                {row.votedGrant.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 border-t border-blue-200 text-right">
                                {row.revisedEstimates.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 border-t border-blue-200 text-right">
                                {row.actualExpenditure.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 border-t border-blue-200 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeProjectActualRow(index)}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all text-xs font-semibold"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {projectActuals.length === 0 && (
                    <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600 text-sm">
                      No project actuals added yet. Fill the form above and click "Add Row" to add financial data.
                    </div>
                  )}
                </div>
              )}

              {/* Project Team */}
              <div className="space-y-6 border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Project Team
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  {/* Project Director */}
                  <CoreUISearchableSelect
                    label="Project/Mission Director*"
                    placeholder="Search project director..."
                    options={dropdownOptions.employees.map(emp => ({ 
                      value: emp.code, 
                      label: emp.display 
                    }))}
                    value={formData.missionProjectDirector || null}
                    onChange={(value) => {
                      handleChange('missionProjectDirector', value || '');
                      if (errors.missionProjectDirector) {
                        setErrors(prev => ({ ...prev, missionProjectDirector: '' }));
                      }
                    }}
                    error={errors.missionProjectDirector}
                    required={true}
                    disabled={loading}
                  />

                  {/* Programme Director */}
                  <CoreUISearchableSelect
                    label="Programme/Project Director*"
                    placeholder="Search programme director..."
                    options={dropdownOptions.employees.map(emp => ({ 
                      value: emp.code, 
                      label: emp.display 
                    }))}
                    value={formData.programmeDirector || null}
                    onChange={(value) => {
                      handleChange('programmeDirector', value || '');
                      if (errors.programmeDirector) {
                        setErrors(prev => ({ ...prev, programmeDirector: '' }));
                      }
                    }}
                    error={errors.programmeDirector}
                    required={true}
                    disabled={loading}
                  />
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

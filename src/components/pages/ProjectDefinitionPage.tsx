import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import {
  projectDetailService,
  ProjectDetailRequest,
  ProjectDetailResponse,
} from "../../services/projectDetailService";
import { useAuth } from "../../hooks/useAuth";

type SortField = keyof ProjectDetailResponse;

interface FormData extends ProjectDetailRequest {}

interface ProjectDefinitionPageProps {
  autoOpenForm?: boolean;
  onProjectCreated?: () => void;
}

const ProjectDefinitionPage: React.FC<ProjectDefinitionPageProps> = ({ autoOpenForm = false, onProjectCreated }) => {
  const [projectDetails, setProjectDetails] = useState<ProjectDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("missionProjectCode");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dropdownOptions, setDropdownOptions] = useState({
    categories: [] as Array<{ code: string; name: string }>,
    projectTypes: [] as Array<{ code: string; name: string }>,
    users: [] as Array<{ id: string; name: string }>,
    statuses: [] as Array<{ code: string; name: string }>,
  });

  const [formData, setFormData] = useState<FormData>({
    missionProjectFullName: "",
    missionProjectShortName: "",
    missionProjectDescription: "",
    projectCategoryCode: "",
    budgetCode: "",
    projectTypesCode: "",
    sanctionedAuthority: "",
    individualCombinedSanctionCost: "",
    sanctionedCost: 0,
    dateOffs: "",
    durationInMonths: null,
    originalSchedule: "",
    fsCopy: null,
    missionProjectDirector: "",
    programmeDirector: "",
    cumExpUpToPrevFy: null,
    curYrExp: null,
    currentStatusPercentage: null,
    currentStatus: "",
    currentStatusRemarks: null,
  });

  const { user } = useAuth();

  // Load project details
  useEffect(() => {
    loadProjectDetails();
    loadDropdownOptions();
  }, []);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectDetailService.getAllProjectDetails();
      setProjectDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load project details");
      console.error("Error loading project details:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownOptions = async () => {
    try {
      setDropdownOptions({
        categories: [
          { code: "CAT01", name: "Infrastructure" },
          { code: "CAT02", name: "Technology" },
          { code: "CAT03", name: "Capacity Building" },
        ],
        projectTypes: [
          { code: "TYPE1", name: "Capital" },
          { code: "TYPE2", name: "Revenue" },
          { code: "TYPE3", name: "Maintenance" },
        ],
        users: [
          { id: "001", name: "John Doe" },
          { id: "002", name: "Jane Smith" },
          { id: "003", name: "Mike Johnson" },
        ],
        statuses: [
          { code: "01", name: "Planning" },
          { code: "02", name: "In Progress" },
          { code: "03", name: "Completed" },
          { code: "04", name: "On Hold" },
        ],
      });
    } catch (err) {
      console.error("Error loading dropdown options:", err);
    }
  };

  // Filter and sort data
  const { sortedData, pageCount } = useMemo(() => {
    let filtered = projectDetails.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal == null || bVal == null) return 0;

      const comparison =
        typeof aVal === "string"
          ? aVal.localeCompare(String(bVal))
          : aVal < bVal
            ? -1
            : aVal > bVal
              ? 1
              : 0;

      return sortOrder === "asc" ? comparison : -comparison;
    });

    const count = Math.ceil(sorted.length / itemsPerPage);
    return { sortedData: sorted, pageCount: count };
  }, [projectDetails, searchQuery, sortField, sortOrder, itemsPerPage]);

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: 
        value === "" 
          ? null 
          : ["sanctionedCost", "durationInMonths", "cumExpUpToPrevFy", "curYrExp", "currentStatusPercentage"].includes(name)
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      if (editingCode) {
        await projectDetailService.updateProjectDetail(editingCode, formData);
        setSuccessMessage("Project detail updated successfully!");
      } else {
        const response = await projectDetailService.createProjectDetail(formData);
        setSuccessMessage(
          `Project detail created successfully! Code: ${response.missionProjectCode}`
        );
        // Call the onProjectCreated callback if provided
        if (onProjectCreated) {
          onProjectCreated();
        }
      }
      loadProjectDetails();
      
      // Reset form
      setEditingCode(null);
      setFormData({
        missionProjectFullName: "",
        missionProjectShortName: "",
        missionProjectDescription: "",
        projectCategoryCode: "",
        budgetCode: "",
        projectTypesCode: "",
        sanctionedAuthority: "",
        individualCombinedSanctionCost: "",
        sanctionedCost: 0,
        dateOffs: "",
        durationInMonths: null,
        originalSchedule: "",
        fsCopy: null,
        missionProjectDirector: "",
        programmeDirector: "",
        cumExpUpToPrevFy: null,
        curYrExp: null,
        currentStatusPercentage: null,
        currentStatus: "",
        currentStatusRemarks: null,
      });
      
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project detail");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (code: string) => {
    try {
      await projectDetailService.deleteProjectDetail(code);
      setSuccessMessage("Project detail deleted successfully!");
      setDeleteConfirm(null);
      loadProjectDetails();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project detail");
    }
  };

  const handleEditProject = (detail: ProjectDetailResponse) => {
    setEditingCode(detail.missionProjectCode);
    setFormData({
      missionProjectFullName: detail.missionProjectFullName,
      missionProjectShortName: detail.missionProjectShortName,
      missionProjectDescription: detail.missionProjectDescription,
      projectCategoryCode: detail.projectCategoryCode,
      budgetCode: detail.budgetCode,
      projectTypesCode: detail.projectTypesCode,
      sanctionedAuthority: detail.sanctionedAuthority,
      individualCombinedSanctionCost: detail.individualCombinedSanctionCost,
      sanctionedCost: detail.sanctionedCost,
      dateOffs: detail.dateOffs,
      durationInMonths: detail.durationInMonths,
      originalSchedule: detail.originalSchedule,
      fsCopy: detail.fsCopy,
      missionProjectDirector: detail.missionProjectDirector,
      programmeDirector: detail.programmeDirector,
      cumExpUpToPrevFy: detail.cumExpUpToPrevFy,
      curYrExp: detail.curYrExp,
      currentStatusPercentage: detail.currentStatusPercentage,
      currentStatus: detail.currentStatus,
      currentStatusRemarks: detail.currentStatusRemarks,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Project Definition</h1>
          <p className="text-gray-600 mt-2">Create and manage project definitions</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingCode ? "Edit Project Definition" : "Create New Project"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Read-only fields */}
                {editingCode && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Code (Auto-Generated)
                      </label>
                      <input
                        type="text"
                        value={editingCode}
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User ID (Auto-Set)
                        </label>
                        <input
                          type="text"
                          value={user?.id || ""}
                          disabled
                          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status (Auto-Set to R)
                        </label>
                        <input
                          type="text"
                          value="R"
                          disabled
                          className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Mission Project Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Project Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="missionProjectFullName"
                    value={formData.missionProjectFullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full project name"
                  />
                </div>

                {/* Short Name & Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="missionProjectShortName"
                      value={formData.missionProjectShortName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Short name (max 50 chars)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="projectCategoryCode"
                      value={formData.projectCategoryCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Category</option>
                      {dropdownOptions.categories.map((cat) => (
                        <option key={cat.code} value={cat.code}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                    <span className="text-xs font-normal text-gray-500 ml-2">
                      ({formData.missionProjectDescription.length}/50)
                    </span>
                  </label>
                  <textarea
                    name="missionProjectDescription"
                    value={formData.missionProjectDescription}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project description (max 50 chars)"
                  />
                </div>

                {/* Budget Code & Project Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="budgetCode"
                      value={formData.budgetCode}
                      onChange={handleInputChange}
                      required
                      maxLength={9}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Budget code (max 9 chars)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="projectTypesCode"
                      value={formData.projectTypesCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Select Type</option>
                      {dropdownOptions.projectTypes.map((type) => (
                        <option key={type.code} value={type.code}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sanctioned Authority & Individual/Combined */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanctioned Authority <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="sanctionedAuthority"
                      value={formData.sanctionedAuthority}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Authority name (max 50 chars)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Individual/Combined <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="individualCombinedSanctionCost"
                      value={formData.individualCombinedSanctionCost}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      <option value="">Select Option</option>
                      <option value="I">Individual</option>
                      <option value="C">Combined</option>
                    </select>
                  </div>
                </div>

                {/* Sanctioned Cost & Date of Sanction */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanctioned Cost <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="sanctionedCost"
                      value={formData.sanctionedCost}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Sanction <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dateOffs"
                      value={formData.dateOffs}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Duration & Original Schedule */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Months)
                    </label>
                    <input
                      type="number"
                      name="durationInMonths"
                      value={formData.durationInMonths || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Schedule <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="originalSchedule"
                      value={formData.originalSchedule}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Project Director & Programme Director */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Director <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="missionProjectDirector"
                      value={formData.missionProjectDirector}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      <option value="">Select Director</option>
                      {dropdownOptions.users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Programme Director <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="programmeDirector"
                      value={formData.programmeDirector}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      <option value="">Select Director</option>
                      {dropdownOptions.users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expenditure Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cumulative Exp. (Previous FY)
                    </label>
                    <input
                      type="number"
                      name="cumExpUpToPrevFy"
                      value={formData.cumExpUpToPrevFy || ""}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Year Expenditure
                    </label>
                    <input
                      type="number"
                      name="curYrExp"
                      value={formData.curYrExp || ""}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {/* Current Status & Percentage */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="currentStatus"
                      value={formData.currentStatus}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      <option value="">Select Status</option>
                      {dropdownOptions.statuses.map((status) => (
                        <option key={status.code} value={status.code}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status % Complete
                    </label>
                    <input
                      type="number"
                      name="currentStatusPercentage"
                      value={formData.currentStatusPercentage || ""}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0-100"
                    />
                  </div>
                </div>

                {/* Status Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status Remarks
                  </label>
                  <textarea
                    name="currentStatusRemarks"
                    value={formData.currentStatusRemarks || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional remarks"
                  />
                </div>

                {/* Form Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCode(null);
                      setFormData({
                        missionProjectFullName: "",
                        missionProjectShortName: "",
                        missionProjectDescription: "",
                        projectCategoryCode: "",
                        budgetCode: "",
                        projectTypesCode: "",
                        sanctionedAuthority: "",
                        individualCombinedSanctionCost: "",
                        sanctionedCost: 0,
                        dateOffs: "",
                        durationInMonths: null,
                        originalSchedule: "",
                        fsCopy: null,
                        missionProjectDirector: "",
                        programmeDirector: "",
                        cumExpUpToPrevFy: null,
                        curYrExp: null,
                        currentStatusPercentage: null,
                        currentStatus: "",
                        currentStatusRemarks: null,
                      });
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {formSubmitting ? "Saving..." : editingCode ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Projects List</h2>
              
              {/* Search */}
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Projects Table */}
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-gray-600 text-sm">Loading...</p>
                </div>
              ) : paginatedData.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-gray-600 text-sm">No projects found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-2 py-2 text-left font-semibold text-gray-900">Code</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-900">Name</th>
                          <th className="px-2 py-2 text-left font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((detail) => (
                          <tr
                            key={detail.missionProjectCode}
                            className="border-b border-gray-200 hover:bg-gray-50 transition"
                          >
                            <td className="px-2 py-2 font-medium text-blue-600 text-xs">
                              {detail.missionProjectCode}
                            </td>
                            <td className="px-2 py-2 text-gray-900 text-xs truncate">
                              {detail.missionProjectFullName}
                            </td>
                            <td className="px-2 py-2 flex gap-2">
                              <button
                                onClick={() => handleEditProject(detail)}
                                className="text-blue-600 hover:text-blue-800 transition"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(detail.missionProjectCode)}
                                className="text-red-600 hover:text-red-800 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(parseInt(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="15">15 per page</option>
                    </select>

                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>Page {currentPage} of {pageCount}</span>
                      <span>{sortedData.length} total</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Prev
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                        disabled={currentPage === pageCount}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDefinitionPage;

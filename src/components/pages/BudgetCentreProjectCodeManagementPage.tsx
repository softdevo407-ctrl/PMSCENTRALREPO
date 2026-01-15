import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  budgetCentreProjectCodeService,
  BudgetCentreProjectCodeResponse,
  BudgetCentreProjectCodeRequest
} from '../../services/budgetCentreProjectCodeService';

interface BudgetCentreProjectCodeManagementPageProps {
  userName: string;
}

export const BudgetCentreProjectCodeManagementPage: React.FC<
  BudgetCentreProjectCodeManagementPageProps
> = ({ userName }) => {
  const [codes, setCodes] = useState<BudgetCentreProjectCodeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<BudgetCentreProjectCodeResponse | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    centreProjectCode: string;
    centreProject: string;
  } | null>(null);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [formData, setFormData] = useState<BudgetCentreProjectCodeRequest>({
    centreProjectCode: '',
    centreProject: '',
    budgetCentreProjectFullName: '',
    budgetCentreProjectShortName: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: null,
    userId: '',
    regStatus: 'R'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetCentreProjectCodeService.getAllBudgetCentreProjectCodes();
      setCodes(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch budget centre project codes';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted data
  const filteredCodes = useMemo(() => {
    let result = codes.filter(code =>
      code.centreProjectCode.toLowerCase().includes(searchText.toLowerCase()) ||
      code.centreProject.toLowerCase().includes(searchText.toLowerCase()) ||
      code.budgetCentreProjectFullName.toLowerCase().includes(searchText.toLowerCase()) ||
      code.budgetCentreProjectShortName.toLowerCase().includes(searchText.toLowerCase())
    );

    // Sorting
    if (sortColumn) {
      result.sort((a, b) => {
        let aValue: any = a[sortColumn as keyof BudgetCentreProjectCodeResponse];
        let bValue: any = b[sortColumn as keyof BudgetCentreProjectCodeResponse];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = (bValue as string).toLowerCase();
        }

        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    return result;
  }, [codes, searchText, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredCodes.slice(startIndex, endIndex);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.centreProjectCode?.trim()) {
      errors.centreProjectCode = 'Centre Project Code is required';
    } else if (formData.centreProjectCode.length > 2) {
      errors.centreProjectCode = 'Centre Project Code cannot exceed 2 characters';
    }

    if (!formData.centreProject?.trim()) {
      errors.centreProject = 'Centre Project is required';
    } else if (formData.centreProject.length > 1) {
      errors.centreProject = 'Centre Project must be a single character';
    }

    if (!formData.budgetCentreProjectFullName?.trim()) {
      errors.budgetCentreProjectFullName = 'Full name is required';
    }

    if (!formData.budgetCentreProjectShortName?.trim()) {
      errors.budgetCentreProjectShortName = 'Short name is required';
    }

    if (!formData.fromDate) {
      errors.fromDate = 'From date is required';
    }

    if (
      formData.toDate &&
      new Date(formData.toDate) < new Date(formData.fromDate)
    ) {
      errors.toDate = 'To date cannot be before from date';
    }

    if (!formData.userId?.trim()) {
      errors.userId = 'User ID is required';
    }

    if (!formData.regStatus?.trim()) {
      errors.regStatus = 'Status is required';
    } else if (formData.regStatus.length > 1) {
      errors.regStatus = 'Status must be a single character';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (code?: BudgetCentreProjectCodeResponse) => {
    if (code) {
      setEditingCode(code);
      setFormData({
        centreProjectCode: code.centreProjectCode,
        centreProject: code.centreProject,
        budgetCentreProjectFullName: code.budgetCentreProjectFullName,
        budgetCentreProjectShortName: code.budgetCentreProjectShortName,
        fromDate: code.fromDate,
        toDate: code.toDate,
        userId: code.userId,
        regStatus: code.regStatus
      });
    } else {
      setEditingCode(null);
      setFormData({
        centreProjectCode: '',
        centreProject: '',
        budgetCentreProjectFullName: '',
        budgetCentreProjectShortName: '',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: null,
        userId: '',
        regStatus: 'R'
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (code: BudgetCentreProjectCodeResponse) => {
    handleOpenModal(code);
  };

  const TableHeader: React.FC<{ column: string; label: string }> = ({ column, label }) => (
    <th
      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortColumn === column && (
          <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
        )}
      </div>
    </th>
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCode(null);
    setFormData({
      centreProjectCode: '',
      centreProject: '',
      budgetCentreProjectFullName: '',
      budgetCentreProjectShortName: '',
      fromDate: new Date().toISOString().split('T')[0],
      toDate: null,
      userId: '',
      regStatus: 'R'
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingCode) {
        await budgetCentreProjectCodeService.updateBudgetCentreProjectCode(
          editingCode.centreProjectCode,
          editingCode.centreProject,
          formData
        );
      } else {
        await budgetCentreProjectCodeService.createBudgetCentreProjectCode(formData);
      }
      await fetchCodes();
      handleCloseModal();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMsg);
    }
  };

  const handleDelete = async (centreProjectCode: string, centreProject: string) => {
    try {
      await budgetCentreProjectCodeService.deleteBudgetCentreProjectCode(centreProjectCode, centreProject);
      await fetchCodes();
      setShowDeleteConfirm(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete';
      setError(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading budget centre project codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Budget Centre Project Code Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage budget centre project codes and configurations
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Code
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-gray-200">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by code, project, name..."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 outline-none text-sm"
        />
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={15}>15 per page</option>
          <option value={20}>20 per page</option>
          <option value={25}>25 per page</option>
        </select>
      </div>

      {/* Filter Info */}
      <div className="flex gap-2 border-b border-gray-200">
        <span className="px-4 py-2 font-medium text-sm text-gray-600">
          Total Codes: {codes.length} | Filtered: {filteredCodes.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-600">Loading budget centre project codes...</p>
          </div>
        ) : filteredCodes.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No budget centre project codes found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <TableHeader column="centreProjectCode" label="Code" />
                    <TableHeader column="centreProject" label="Project" />
                    <TableHeader column="budgetCentreProjectFullName" label="Full Name" />
                    <TableHeader column="budgetCentreProjectShortName" label="Short Name" />
                    <TableHeader column="fromDate" label="From Date" />
                    <TableHeader column="toDate" label="To Date" />
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map(code => (
                    <tr
                      key={`${code.centreProjectCode}-${code.centreProject}`}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-900">
                        {code.centreProjectCode}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-900">
                        {code.centreProject}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {code.budgetCentreProjectFullName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {code.budgetCentreProjectShortName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(code.fromDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {code.toDate
                          ? new Date(code.toDate).toLocaleDateString()
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          {code.regStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenModalForEdit(code)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm({
                              centreProjectCode: code.centreProjectCode,
                              centreProject: code.centreProject
                            })}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} | Showing {startIndex + 1} to {Math.min(endIndex, filteredCodes.length)} of {filteredCodes.length} records
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  title="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCode
                  ? 'Edit Budget Centre Project Code'
                  : 'Create New Budget Centre Project Code'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Centre Project Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Centre Project Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.centreProjectCode}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        centreProjectCode: e.target.value.toUpperCase()
                      })
                    }
                    disabled={!!editingCode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., BC"
                    maxLength={2}
                  />
                  {formErrors.centreProjectCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.centreProjectCode}
                    </p>
                  )}
                </div>

                {/* Centre Project */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Centre Project <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.centreProject}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        centreProject: e.target.value.toUpperCase()
                      })
                    }
                    disabled={!!editingCode}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., A"
                    maxLength={1}
                  />
                  {formErrors.centreProject && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.centreProject}
                    </p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.budgetCentreProjectFullName}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        budgetCentreProjectFullName: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Budget Centre Project Full Name"
                  />
                  {formErrors.budgetCentreProjectFullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.budgetCentreProjectFullName}
                    </p>
                  )}
                </div>

                {/* Short Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.budgetCentreProjectShortName}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        budgetCentreProjectShortName: e.target.value.toUpperCase()
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., BCP"
                    maxLength={20}
                  />
                  {formErrors.budgetCentreProjectShortName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.budgetCentreProjectShortName}
                    </p>
                  )}
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={e =>
                      setFormData({ ...formData, fromDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formErrors.fromDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.fromDate}
                    </p>
                  )}
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    To Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.toDate || ''}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        toDate: e.target.value || null
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formErrors.toDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.toDate}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep active indefinitely
                  </p>
                </div>

                {/* User ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={e =>
                      setFormData({ ...formData, userId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., IS03651"
                  />
                  {formErrors.userId && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.userId}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.regStatus}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        regStatus: e.target.value.toUpperCase().substring(0, 1)
                      })
                    }
                    maxLength={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., R"
                  />
                  {formErrors.regStatus && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.regStatus}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Single character</p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingCode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Delete Budget Centre Project Code
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Are you sure you want to delete this budget centre project code? This
                  action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.centreProjectCode, showDeleteConfirm.centreProject)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
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

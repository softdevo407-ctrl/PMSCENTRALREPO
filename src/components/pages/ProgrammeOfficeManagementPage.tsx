import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import {
  programmeOfficeService,
  ProgrammeOfficeResponse,
  ProgrammeOfficeRequest
} from '../../services/programmeOfficeService';

interface ProgrammeOfficeManagementPageProps {
  userName: string;
}

export const ProgrammeOfficeManagementPage: React.FC<
  ProgrammeOfficeManagementPageProps
> = ({ userName }) => {
  const [offices, setOffices] = useState<ProgrammeOfficeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<ProgrammeOfficeResponse | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProgrammeOfficeRequest>({
    programmeOfficeCode: '',
    programmeOfficeFullName: '',
    programmeOfficeShortName: '',
    hierarchyOrder: 0,
    fromDate: new Date().toISOString().split('T')[0],
    toDate: null,
    userId: '',
    regStatus: 'R'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await programmeOfficeService.getAllProgrammeOffices();
      setOffices(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch programme offices';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffices = offices;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.programmeOfficeCode?.trim()) {
      errors.programmeOfficeCode = 'Code is required';
    } else if (formData.programmeOfficeCode.length > 5) {
      errors.programmeOfficeCode = 'Code cannot exceed 5 characters';
    }

    if (!formData.programmeOfficeFullName?.trim()) {
      errors.programmeOfficeFullName = 'Full name is required';
    }

    if (!formData.programmeOfficeShortName?.trim()) {
      errors.programmeOfficeShortName = 'Short name is required';
    }

    if (!formData.hierarchyOrder || formData.hierarchyOrder <= 0) {
      errors.hierarchyOrder = 'Hierarchy order must be a positive number';
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

  const handleOpenModal = (office?: ProgrammeOfficeResponse) => {
    if (office) {
      setEditingOffice(office);
      setFormData({
        programmeOfficeCode: office.programmeOfficeCode,
        programmeOfficeFullName: office.programmeOfficeFullName,
        programmeOfficeShortName: office.programmeOfficeShortName,
        hierarchyOrder: office.hierarchyOrder,
        fromDate: office.fromDate,
        toDate: office.toDate,
        userId: office.userId,
        regStatus: office.regStatus
      });
    } else {
      setEditingOffice(null);
      setFormData({
        programmeOfficeCode: '',
        programmeOfficeFullName: '',
        programmeOfficeShortName: '',
        hierarchyOrder: 0,
        fromDate: new Date().toISOString().split('T')[0],
        toDate: null,
        userId: '',
        regStatus: 'R'
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOffice(null);
    setFormData({
      programmeOfficeCode: '',
      programmeOfficeFullName: '',
      programmeOfficeShortName: '',
      hierarchyOrder: 0,
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
      if (editingOffice) {
        await programmeOfficeService.updateProgrammeOffice(
          editingOffice.programmeOfficeCode,
          formData
        );
      } else {
        await programmeOfficeService.createProgrammeOffice(formData);
      }
      await fetchOffices();
      handleCloseModal();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMsg);
    }
  };

  const handleDeactivate = async (code: string) => {
    try {
      await programmeOfficeService.deactivateProgrammeOffice(code);
      await fetchOffices();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to deactivate';
      setError(errorMsg);
    }
  };

  const handleDelete = async (code: string) => {
    try {
      await programmeOfficeService.deleteProgrammeOffice(code);
      await fetchOffices();
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
          <p className="text-gray-600">Loading programme offices...</p>
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
            Programme Office Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage programme office codes and configurations
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Office
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

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <span className="px-4 py-2 font-medium text-sm text-gray-600">
          Total Offices: {offices.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredOffices.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No programme offices found in this view
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Short Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Hierarchy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    From Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    To Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOffices.map(office => (
                  <tr
                    key={office.programmeOfficeCode}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-900">
                      {office.programmeOfficeCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {office.programmeOfficeFullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {office.programmeOfficeShortName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {office.hierarchyOrder}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(office.fromDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {office.toDate
                        ? new Date(office.toDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {office.regStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setEditingOffice(office);
                            setFormData({
                              programmeOfficeCode: office.programmeOfficeCode,
                              programmeOfficeFullName: office.programmeOfficeFullName,
                              programmeOfficeShortName: office.programmeOfficeShortName,
                              hierarchyOrder: office.hierarchyOrder,
                              fromDate: office.fromDate,
                              toDate: office.toDate,
                              userId: office.userId,
                              regStatus: office.regStatus
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(office.programmeOfficeCode)}
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
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingOffice
                  ? 'Edit Programme Office'
                  : 'Create New Programme Office'}
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
                {/* Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.programmeOfficeCode}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        programmeOfficeCode: e.target.value.toUpperCase()
                      })
                    }
                    disabled={!!editingOffice}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., POHQ1"
                    maxLength={5}
                  />
                  {formErrors.programmeOfficeCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.programmeOfficeCode}
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
                    value={formData.programmeOfficeFullName}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        programmeOfficeFullName: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Space Infrastructure Programme Office"
                  />
                  {formErrors.programmeOfficeFullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.programmeOfficeFullName}
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
                    value={formData.programmeOfficeShortName}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        programmeOfficeShortName: e.target.value.toUpperCase()
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., SIPO"
                  />
                  {formErrors.programmeOfficeShortName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.programmeOfficeShortName}
                    </p>
                  )}
                </div>

                {/* Hierarchy Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hierarchy Order <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.hierarchyOrder}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        hierarchyOrder: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1"
                    min="1"
                  />
                  {formErrors.hierarchyOrder && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.hierarchyOrder}
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
                  {editingOffice ? 'Update' : 'Create'}
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
                  Delete Programme Office
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Are you sure you want to delete this programme office? This
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
                onClick={() => handleDelete(showDeleteConfirm)}
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

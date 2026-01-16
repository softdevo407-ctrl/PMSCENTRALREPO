import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Loader2, Trash2, Edit2 } from 'lucide-react';
import { projectStatusCodeService, ProjectStatusCodeRequest, ProjectStatusCodeResponse } from '../../services/projectStatusCodeService';

interface ProjectStatusCodeManagementPageProps {
  userName: string;
}

interface Errors {
  [key: string]: string;
}

export const ProjectStatusCodeManagementPage: React.FC<ProjectStatusCodeManagementPageProps> = ({ userName }) => {
  const [statusCodes, setStatusCodes] = useState<ProjectStatusCodeResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectStatusCodeRequest>({
    projectStatusCode: '',
    projectStatusFullName: '',
    projectStatusShortName: '',
    hierarchyOrder: 0,
    fromDate: '',
    toDate: '',
    userId: userName,
    regStatus: '1',
    regTime: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadStatusCodes();
  }, []);

  const loadStatusCodes = async () => {
    setLoading(true);
    try {
      const data = await projectStatusCodeService.getAllProjectStatusCodes();
      setStatusCodes(data);
      setError('');
    } catch (err) {
      setError('Failed to load project status codes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.projectStatusCode?.trim()) {
      newErrors.projectStatusCode = 'Status Code is required';
    }
    if (!formData.projectStatusFullName?.trim()) {
      newErrors.projectStatusFullName = 'Full Name is required';
    }
    if (!formData.projectStatusShortName?.trim()) {
      newErrors.projectStatusShortName = 'Short Name is required';
    }
    if (!formData.fromDate) {
      newErrors.fromDate = 'From Date is required';
    }
    if (!formData.userId?.trim()) {
      newErrors.userId = 'User ID is required';
    }
    if (!formData.regStatus) {
      newErrors.regStatus = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = () => {
    setIsEditMode(false);
    setSelectedCode(null);
    setFormData({
      projectStatusCode: '',
      projectStatusFullName: '',
      projectStatusShortName: '',
      hierarchyOrder: 0,
      fromDate: '',
      toDate: '',
      userId: userName,
      regStatus: '1',
      regTime: new Date().toISOString().split('T')[0],
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (status: ProjectStatusCodeResponse) => {
    setIsEditMode(true);
    setSelectedCode(status.projectStatusCode);
    setFormData({
      projectStatusCode: status.projectStatusCode,
      projectStatusFullName: status.projectStatusFullName,
      projectStatusShortName: status.projectStatusShortName,
      hierarchyOrder: status.hierarchyOrder || 0,
      fromDate: status.fromDate,
      toDate: status.toDate || '',
      userId: status.userId,
      regStatus: status.regStatus,
      regTime: status.regTime || '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (isEditMode && selectedCode) {
        await projectStatusCodeService.updateProjectStatusCode(selectedCode, formData);
      } else {
        await projectStatusCodeService.createProjectStatusCode(formData);
      }
      await loadStatusCodes();
      setIsModalOpen(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save status code');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    setLoading(true);
    try {
      await projectStatusCodeService.deleteProjectStatusCode(code);
      await loadStatusCodes();
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete status code');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Status Codes</h1>
          <p className="text-gray-600">Manage project status codes and hierarchy</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
        >
          + New Status Code
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 flex-1">{error}</span>
          <button
            onClick={() => setError('')}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6">
        <p className="text-gray-600 font-medium">Total Status Codes: {statusCodes.length}</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && statusCodes.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Full Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Short Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hierarchy Order</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">From Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">To Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {statusCodes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-600">
                      No project status codes found
                    </td>
                  </tr>
                ) : (
                  statusCodes.map((status) => (
                    <tr key={status.projectStatusCode} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{status.projectStatusCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{status.projectStatusFullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{status.projectStatusShortName}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{status.hierarchyOrder}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{status.fromDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{status.toDate || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status.regStatus === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {status.regStatus === '1' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(status)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(status.projectStatusCode)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {isEditMode ? 'Edit Project Status Code' : 'New Project Status Code'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-blue-500 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Status Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.projectStatusCode || ''}
                    onChange={(e) => handleChange('projectStatusCode', e.target.value)}
                    placeholder="e.g., STS001"
                    maxLength={6}
                    disabled={isEditMode}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.projectStatusCode ? 'border-red-500' : 'border-gray-300'
                    } ${isEditMode ? 'bg-gray-100' : ''}`}
                  />
                  {errors.projectStatusCode && (
                    <p className="text-red-600 text-sm mt-1">{errors.projectStatusCode}</p>
                  )}
                </div>

                {/* Hierarchy Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hierarchy Order
                  </label>
                  <input
                    type="number"
                    value={formData.hierarchyOrder || 0}
                    onChange={(e) => handleChange('hierarchyOrder', parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.projectStatusFullName || ''}
                    onChange={(e) => handleChange('projectStatusFullName', e.target.value)}
                    placeholder="Enter full name"
                    maxLength={255}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.projectStatusFullName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.projectStatusFullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.projectStatusFullName}</p>
                  )}
                </div>

                {/* Short Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.projectStatusShortName || ''}
                    onChange={(e) => handleChange('projectStatusShortName', e.target.value)}
                    placeholder="Enter short name"
                    maxLength={50}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.projectStatusShortName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.projectStatusShortName && (
                    <p className="text-red-600 text-sm mt-1">{errors.projectStatusShortName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* From Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.fromDate || ''}
                    onChange={(e) => handleChange('fromDate', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.fromDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fromDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.fromDate}</p>
                  )}
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={formData.toDate || ''}
                    onChange={(e) => handleChange('toDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* User ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    User ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.userId || ''}
                    onChange={(e) => handleChange('userId', e.target.value)}
                    placeholder="User ID"
                    maxLength={7}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.userId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.userId && (
                    <p className="text-red-600 text-sm mt-1">{errors.userId}</p>
                  )}
                </div>

                {/* Registration Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.regStatus || '1'}
                    onChange={(e) => handleChange('regStatus', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.regStatus ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                  {errors.regStatus && (
                    <p className="text-red-600 text-sm mt-1">{errors.regStatus}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 transition-all font-semibold flex items-center justify-center gap-2 shadow-md"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isEditMode ? 'Update' : 'Create'} Status Code
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold border-2 border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete status code <strong>{deleteConfirm}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-semibold"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

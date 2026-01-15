import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { ProgrammeTypeService, ProgrammeType, ProgrammeTypeRequest } from '../../services/programmeTypeService';

interface ProgrammeTypeManagementPageProps {
  userName: string;
}

export function ProgrammeTypeManagementPage({ userName }: ProgrammeTypeManagementPageProps) {
  const [programmeTypes, setProgrammeTypes] = useState<ProgrammeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<ProgrammeType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProgrammeTypeRequest>({
    programmeTypeCode: '',
    projectCategoryCode: '',
    programmeTypeFullName: '',
    programmeTypeShortName: '',
    hierarchyOrder: 1,
    fromDate: '',
    toDate: null,
    userId: userName || 'IS03651',
    regStatus: 'R',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadProgrammeTypes();
  }, []);

  const loadProgrammeTypes = async () => {
    try {
      setLoading(true);
      const data = await ProgrammeTypeService.getAllProgrammeTypes();
      setProgrammeTypes(data);
    } catch (error) {
      console.error('Error loading programme types:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.programmeTypeCode.trim()) {
      newErrors.programmeTypeCode = 'Programme Type Code is required';
    }
    if (formData.programmeTypeCode.length > 5) {
      newErrors.programmeTypeCode = 'Code must not exceed 5 characters';
    }

    if (!formData.projectCategoryCode.trim()) {
      newErrors.projectCategoryCode = 'Project Category Code is required';
    }

    if (!formData.programmeTypeFullName.trim()) {
      newErrors.programmeTypeFullName = 'Full Name is required';
    }
    if (formData.programmeTypeFullName.length > 255) {
      newErrors.programmeTypeFullName = 'Full Name must not exceed 255 characters';
    }

    if (!formData.programmeTypeShortName.trim()) {
      newErrors.programmeTypeShortName = 'Short Name is required';
    }
    if (formData.programmeTypeShortName.length > 50) {
      newErrors.programmeTypeShortName = 'Short Name must not exceed 50 characters';
    }

    if (formData.hierarchyOrder < 0) {
      newErrors.hierarchyOrder = 'Hierarchy Order must be positive';
    }

    if (!formData.fromDate) {
      newErrors.fromDate = 'From Date is required';
    }

    if (formData.toDate && new Date(formData.toDate) < new Date(formData.fromDate)) {
      newErrors.toDate = 'To Date must be after From Date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editingType) {
        await ProgrammeTypeService.updateProgrammeType(editingType.programmeTypeCode, formData);
        setSuccessMessage('Programme Type updated successfully!');
      } else {
        await ProgrammeTypeService.createProgrammeType(formData);
        setSuccessMessage('Programme Type created successfully!');
      }

      setTimeout(() => {
        setSuccessMessage('');
        setIsModalOpen(false);
        setEditingType(null);
        loadProgrammeTypes();
      }, 1500);
    } catch (error) {
      console.error('Error saving programme type:', error);
      setErrors({ submit: 'Failed to save programme type' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    try {
      setLoading(true);
      await ProgrammeTypeService.deleteProgrammeType(code);
      setShowDeleteConfirm(null);
      setSuccessMessage('Programme Type deleted successfully!');

      setTimeout(() => {
        setSuccessMessage('');
        loadProgrammeTypes();
      }, 1500);
    } catch (error) {
      console.error('Error deleting programme type:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type?: ProgrammeType) => {
    if (type) {
      setEditingType(type);
      setFormData({
        programmeTypeCode: type.programmeTypeCode,
        projectCategoryCode: type.projectCategoryCode,
        programmeTypeFullName: type.programmeTypeFullName,
        programmeTypeShortName: type.programmeTypeShortName,
        hierarchyOrder: type.hierarchyOrder,
        fromDate: type.fromDate,
        toDate: type.toDate,
        userId: type.userId,
        regStatus: type.regStatus,
      });
    } else {
      setEditingType(null);
      setFormData({
        programmeTypeCode: '',
        projectCategoryCode: '',
        programmeTypeFullName: '',
        programmeTypeShortName: '',
        hierarchyOrder: 1,
        fromDate: new Date().toISOString().split('T')[0],
        toDate: null,
        userId: userName || 'IS03651',
        regStatus: 'R',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Programme Types Management</h1>
          <p className="text-gray-600">Manage programme types for your organization</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {successMessage}
          </div>
        )}

        {/* New Button */}
        <button
          onClick={() => handleOpenModal()}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Programme Type
        </button>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading && programmeTypes.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Full Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Short Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hierarchy</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">From Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">To Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {programmeTypes.map((type) => (
                  <tr key={type.programmeTypeCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{type.programmeTypeCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{type.programmeTypeFullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{type.programmeTypeShortName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{type.projectCategoryCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{type.hierarchyOrder}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{type.fromDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{type.toDate || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          type.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {type.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenModal(type)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(type.programmeTypeCode)}
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
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingType ? 'Edit Programme Type' : 'Create New Programme Type'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Error Messages */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    {Object.entries(errors).map(([key, error]) => (
                      <div key={key} className="flex items-center gap-2 text-red-700 text-sm mb-2 last:mb-0">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                    ))}
                  </div>
                )}

                {/* Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programme Type Code *
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    disabled={editingType ? true : false}
                    value={formData.programmeTypeCode}
                    onChange={(e) => setFormData({ ...formData, programmeTypeCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., PRG01"
                  />
                </div>

                {/* Project Category Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Category Code *
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={formData.projectCategoryCode}
                    onChange={(e) => setFormData({ ...formData, projectCategoryCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., GAG02"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    maxLength={255}
                    value={formData.programmeTypeFullName}
                    onChange={(e) => setFormData({ ...formData, programmeTypeFullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Human Space Programme"
                  />
                </div>

                {/* Short Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Name *
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    value={formData.programmeTypeShortName}
                    onChange={(e) => setFormData({ ...formData, programmeTypeShortName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., HSP"
                  />
                </div>

                {/* Hierarchy Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hierarchy Order *
                  </label>
                  <input
                    type="number"
                    value={formData.hierarchyOrder}
                    onChange={(e) => setFormData({ ...formData, hierarchyOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date *
                  </label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.toDate || ''}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* User ID - Read Only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-3 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingType ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Confirmation</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this programme type? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

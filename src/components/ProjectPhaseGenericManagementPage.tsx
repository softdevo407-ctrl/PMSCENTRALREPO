import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, X, Loader2 } from 'lucide-react';
import { ProjectPhaseGenericService, ProjectPhaseGeneric, ProjectPhaseGenericRequest } from '../services/projectPhaseGenericService';

interface Props {
  userName: string;
}

export function ProjectPhaseGenericManagementPage({ userName }: Props) {
  const [phases, setPhases] = useState<ProjectPhaseGeneric[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<ProjectPhaseGeneric | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<ProjectPhaseGenericRequest>({
    projectPhaseCode: '',
    projectPhaseFullName: '',
    projectPhaseShortName: '',
    hierarchyOrder: 0,
    fromDate: '',
    toDate: null,
    userId: userName,
    regStatus: 'R',
  });

  useEffect(() => {
    loadPhases();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadPhases = async () => {
    setLoading(true);
    try {
      const data = await ProjectPhaseGenericService.getAllPhases();
      setPhases(data);
    } catch (err) {
      console.error('Failed to load phases:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectPhaseCode?.trim()) {
      newErrors.projectPhaseCode = 'Phase code is required';
    } else if (formData.projectPhaseCode.length > 10) {
      newErrors.projectPhaseCode = 'Code cannot exceed 10 characters';
    }

    if (!formData.projectPhaseFullName?.trim()) {
      newErrors.projectPhaseFullName = 'Full name is required';
    }

    if (!formData.projectPhaseShortName?.trim()) {
      newErrors.projectPhaseShortName = 'Short name is required';
    }

    if (!formData.hierarchyOrder || formData.hierarchyOrder <= 0) {
      newErrors.hierarchyOrder = 'Hierarchy order must be a positive number';
    }

    if (!formData.fromDate) {
      newErrors.fromDate = 'From date is required';
    }

    if (formData.toDate && new Date(formData.toDate) < new Date(formData.fromDate)) {
      newErrors.toDate = 'To date cannot be before from date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenModal = (phase?: ProjectPhaseGeneric) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        projectPhaseCode: phase.projectPhaseCode,
        projectPhaseFullName: phase.projectPhaseFullName,
        projectPhaseShortName: phase.projectPhaseShortName,
        hierarchyOrder: phase.hierarchyOrder,
        fromDate: phase.fromDate,
        toDate: phase.toDate,
        userId: phase.userId,
        regStatus: phase.regStatus,
      });
    } else {
      setEditingPhase(null);
      setFormData({
        projectPhaseCode: '',
        projectPhaseFullName: '',
        projectPhaseShortName: '',
        hierarchyOrder: 0,
        fromDate: new Date().toISOString().split('T')[0],
        toDate: null,
        userId: userName,
        regStatus: 'R',
      });
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPhase(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingPhase) {
        await ProjectPhaseGenericService.updatePhase(editingPhase.projectPhaseCode, formData);
        setSuccessMessage('Phase updated successfully');
      } else {
        await ProjectPhaseGenericService.createPhase(formData);
        setSuccessMessage('Phase created successfully');
      }
      handleCloseModal();
      await loadPhases();
    } catch (err) {
      console.error('Failed to save phase:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (phaseCode: string) => {
    setShowDeleteConfirm(phaseCode);
  };

  const confirmDelete = async () => {
    if (!showDeleteConfirm) return;

    setIsDeleting(true);
    try {
      await ProjectPhaseGenericService.deletePhase(showDeleteConfirm);
      setSuccessMessage('Phase deleted successfully');
      setShowDeleteConfirm(null);
      await loadPhases();
    } catch (err) {
      console.error('Failed to delete phase:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const phaseToDelete = phases.find(p => p.projectPhaseCode === showDeleteConfirm);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md z-50 animate-fade-out">
          {successMessage}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Project Phases</h1>
        <p className="text-gray-600 mt-2">Manage project phase codes and configurations</p>
      </div>

      <button
        onClick={() => handleOpenModal()}
        className="mb-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Plus size={20} />
        New Phase
      </button>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={40} className="text-blue-600 animate-spin" />
        </div>
      ) : phases.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500">No phases found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Code</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Full Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Short Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hierarchy</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">From Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">To Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {phases.map((phase) => (
                <tr key={phase.projectPhaseCode} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{phase.projectPhaseCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{phase.projectPhaseFullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{phase.projectPhaseShortName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{phase.hierarchyOrder}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{new Date(phase.fromDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{phase.toDate ? new Date(phase.toDate).toLocaleDateString() : 'Ongoing'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      phase.regStatus === 'A' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {phase.regStatus === 'A' ? 'Active' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <button
                      onClick={() => handleOpenModal(phase)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(phase.projectPhaseCode)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPhase ? 'Edit Phase' : 'Add New Phase'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <div key={field} className="text-sm text-red-700 flex items-center gap-2">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phase Code *</label>
                  <input
                    type="text"
                    value={formData.projectPhaseCode}
                    onChange={(e) => setFormData({ ...formData, projectPhaseCode: e.target.value })}
                    disabled={!!editingPhase}
                    placeholder="e.g., PHE01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hierarchy Order *</label>
                  <input
                    type="number"
                    value={formData.hierarchyOrder}
                    onChange={(e) => setFormData({ ...formData, hierarchyOrder: parseInt(e.target.value) || 0 })}
                    placeholder="Enter hierarchy order"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.projectPhaseFullName}
                  onChange={(e) => setFormData({ ...formData, projectPhaseFullName: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Name *</label>
                <input
                  type="text"
                  value={formData.projectPhaseShortName}
                  onChange={(e) => setFormData({ ...formData, projectPhaseShortName: e.target.value })}
                  placeholder="Enter short name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date *</label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={formData.toDate || ''}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={formData.userId}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                >
                  {isSaving && <Loader2 size={18} className="animate-spin" />}
                  {isSaving ? 'Saving...' : editingPhase ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && phaseToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Phase</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">{phaseToDelete.projectPhaseFullName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {isDeleting && <Loader2 size={18} className="animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

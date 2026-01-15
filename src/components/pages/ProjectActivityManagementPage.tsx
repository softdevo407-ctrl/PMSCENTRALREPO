import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';
import { ProjectActivityService, ProjectActivity, ProjectActivityRequest } from '../../services/projectActivityService';

interface ProjectActivityManagementPageProps {
  userName: string;
}

export function ProjectActivityManagementPage({ userName }: ProjectActivityManagementPageProps) {
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ProjectActivity | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectActivityRequest>({
    projectActivityCode: '',
    projectActivityFullName: '',
    projectActivityShortName: '',
    hierarchyOrder: 1,
    fromDate: '',
    toDate: null,
    userId: userName || 'IS03651',
    regStatus: 'R',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await ProjectActivityService.getAllProjectActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectActivityCode.trim()) {
      newErrors.projectActivityCode = 'Project Activity Code is required';
    }
    if (formData.projectActivityCode.length > 5) {
      newErrors.projectActivityCode = 'Code must not exceed 5 characters';
    }

    if (!formData.projectActivityFullName.trim()) {
      newErrors.projectActivityFullName = 'Full Name is required';
    }
    if (formData.projectActivityFullName.length > 255) {
      newErrors.projectActivityFullName = 'Full Name must not exceed 255 characters';
    }

    if (!formData.projectActivityShortName.trim()) {
      newErrors.projectActivityShortName = 'Short Name is required';
    }
    if (formData.projectActivityShortName.length > 50) {
      newErrors.projectActivityShortName = 'Short Name must not exceed 50 characters';
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

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    if (!formData.regStatus || formData.regStatus.length !== 1) {
      newErrors.regStatus = 'Status must be a single character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      if (editingActivity) {
        await ProjectActivityService.updateProjectActivity(editingActivity.projectActivityCode, formData);
        setSuccessMessage('Project Activity updated successfully!');
      } else {
        await ProjectActivityService.createProjectActivity(formData);
        setSuccessMessage('Project Activity created successfully!');
      }

      setTimeout(() => {
        setSuccessMessage('');
        setIsModalOpen(false);
        setEditingActivity(null);
        loadActivities();
      }, 1500);
    } catch (error) {
      console.error('Error saving activity:', error);
      setErrors({ submit: 'Failed to save activity' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    try {
      setLoading(true);
      await ProjectActivityService.deleteProjectActivity(code);
      setShowDeleteConfirm(null);
      setSuccessMessage('Project Activity deleted successfully!');

      setTimeout(() => {
        setSuccessMessage('');
        loadActivities();
      }, 1500);
    } catch (error) {
      console.error('Error deleting activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (activity?: ProjectActivity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        projectActivityCode: activity.projectActivityCode,
        projectActivityFullName: activity.projectActivityFullName,
        projectActivityShortName: activity.projectActivityShortName,
        hierarchyOrder: activity.hierarchyOrder,
        fromDate: activity.fromDate,
        toDate: activity.toDate,
        userId: activity.userId,
        regStatus: activity.regStatus,
      });
    } else {
      setEditingActivity(null);
      setFormData({
        projectActivityCode: '',
        projectActivityFullName: '',
        projectActivityShortName: '',
        hierarchyOrder: 1,
        fromDate: '',
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Activities Management</h1>
          <p className="text-gray-600">Manage project activities for your organization</p>
        </div>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {successMessage}
          </div>
        )}

        <button
          onClick={() => handleOpenModal()}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Activity
        </button>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading && activities.length === 0 ? (
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
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Hierarchy</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">From Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">To Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activities.map((activity) => (
                  <tr key={activity.projectActivityCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{activity.projectActivityCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{activity.projectActivityFullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{activity.projectActivityShortName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{activity.hierarchyOrder}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{activity.fromDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{activity.toDate || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          activity.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {activity.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenModal(activity)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(activity.projectActivityCode)}
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingActivity ? 'Edit Project Activity' : 'Create New Project Activity'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                  <input
                    type="text"
                    maxLength={5}
                    disabled={editingActivity ? true : false}
                    value={formData.projectActivityCode}
                    onChange={(e) => setFormData({ ...formData, projectActivityCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., ACT01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    maxLength={255}
                    value={formData.projectActivityFullName}
                    onChange={(e) => setFormData({ ...formData, projectActivityFullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Attitude and Orbit Control Subsystem"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Name *</label>
                  <input
                    type="text"
                    maxLength={50}
                    value={formData.projectActivityShortName}
                    onChange={(e) => setFormData({ ...formData, projectActivityShortName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., AOCS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hierarchy Order *</label>
                  <input
                    type="number"
                    value={formData.hierarchyOrder}
                    onChange={(e) => setFormData({ ...formData, hierarchyOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date *</label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.toDate || ''}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value || null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User ID *</label>
                  <input
                    type="text"
                    maxLength={7}
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., IS03651"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Registration Status *</label>
                  <select
                    value={formData.regStatus}
                    onChange={(e) => setFormData({ ...formData, regStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="R">Registered (R)</option>
                    <option value="P">Pending (P)</option>
                    <option value="I">Inactive (I)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingActivity ? 'Update' : 'Create'}
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
                  Are you sure you want to delete this project activity? This action cannot be undone.
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

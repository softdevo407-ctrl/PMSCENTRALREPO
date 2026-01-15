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
  employeeDetailsService,
  EmployeeDetailsResponse,
  EmployeeDetailsRequest
} from '../../services/employeeDetailsService';

interface EmployeeDetailsManagementPageProps {
  userName: string;
}

export const EmployeeDetailsManagementPage: React.FC<
  EmployeeDetailsManagementPageProps
> = ({ userName }) => {
  const [employees, setEmployees] = useState<EmployeeDetailsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeDetailsResponse | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<EmployeeDetailsRequest>({
    employeeCode: '',
    name: '',
    presentDesignationFullName: '',
    centre: '',
    userId: '',
    regStatus: 'A',
    regTime: new Date().toISOString().split('T')[0],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeDetailsService.getAllEmployeeDetails();
      setEmployees(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch employees';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.employeeCode?.trim()) {
      errors.employeeCode = 'Employee code is required';
    } else if (formData.employeeCode.length > 7) {
      errors.employeeCode = 'Employee code cannot exceed 7 characters';
    }

    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.presentDesignationFullName?.trim()) {
      errors.presentDesignationFullName = 'Designation is required';
    }

    if (!formData.centre?.trim()) {
      errors.centre = 'Centre is required';
    }

    if (!formData.userId?.trim()) {
      errors.userId = 'User ID is required';
    }

    if (!formData.regStatus?.trim()) {
      errors.regStatus = 'Status is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (employee?: EmployeeDetailsResponse) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        employeeCode: employee.employeeCode,
        name: employee.name,
        presentDesignationFullName: employee.presentDesignationFullName,
        centre: employee.centre,
        userId: employee.userId,
        regStatus: employee.regStatus,
        regTime: employee.regTime,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        employeeCode: '',
        name: '',
        presentDesignationFullName: '',
        centre: '',
        userId: '',
        regStatus: 'A',
        regTime: new Date().toISOString().split('T')[0],
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    setFormData({
      employeeCode: '',
      name: '',
      presentDesignationFullName: '',
      centre: '',
      userId: '',
      regStatus: 'A',
      regTime: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingEmployee) {
        await employeeDetailsService.updateEmployeeDetails(
          editingEmployee.employeeCode,
          formData
        );
      } else {
        await employeeDetailsService.createEmployeeDetails(formData);
      }
      await fetchEmployees();
      handleCloseModal();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMsg);
    }
  };

  const handleDeactivate = async (code: string) => {
    try {
      await employeeDetailsService.deactivateEmployeeDetails(code);
      await fetchEmployees();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to deactivate';
      setError(errorMsg);
    }
  };

  const handleDelete = async (code: string) => {
    try {
      await employeeDetailsService.deleteEmployeeDetails(code);
      await fetchEmployees();
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
          <p className="text-gray-600">Loading employee details...</p>
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
            Employee Details Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage employee information and designations
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Employee
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
          Total Employees: {employees.length}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {employees.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No employees found
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Centre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    User ID
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
                {employees.map(employee => (
                  <tr
                    key={employee.employeeCode}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-gray-900">
                      {employee.employeeCode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {employee.presentDesignationFullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {employee.centre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {employee.userId}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                        employee.regStatus === 'A'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {employee.regStatus === 'A' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenModal(employee)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(employee.employeeCode)}
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
                {editingEmployee
                  ? 'Edit Employee Details'
                  : 'Create New Employee'}
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
                {/* Employee Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        employeeCode: e.target.value.toUpperCase()
                      })
                    }
                    disabled={!!editingEmployee}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="e.g., IS03651"
                    maxLength={7}
                  />
                  {formErrors.employeeCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.employeeCode}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        name: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., John Doe"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.presentDesignationFullName}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        presentDesignationFullName: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {formErrors.presentDesignationFullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.presentDesignationFullName}
                    </p>
                  )}
                </div>

                {/* Centre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Centre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.centre}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        centre: e.target.value.toUpperCase()
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., HQ"
                    maxLength={20}
                  />
                  {formErrors.centre && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.centre}
                    </p>
                  )}
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
                      setFormData({ ...formData, userId: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., IS03651"
                    maxLength={7}
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
                  <select
                    value={formData.regStatus}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        regStatus: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="A">Active</option>
                    <option value="I">Inactive</option>
                  </select>
                  {formErrors.regStatus && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.regStatus}
                    </p>
                  )}
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
                  {editingEmployee ? 'Update' : 'Create'}
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
                  Delete Employee
                </h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Are you sure you want to delete this employee? This action cannot be undone.
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

import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Briefcase, AlertCircle, Loader2, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface AdminDashboardProps {
  userName: string;
}

interface PendingApproval {
  id: number;
  employeeName: string;
  employeeCode: string;
  requestedRole: string;
  submissionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface EnrolledEmployee {
  id: number;
  employeeName: string;
  employeeCode: string;
  assignedRole: string;
  programme?: string;
  joinDate: string;
}

interface Programme {
  id: number;
  programmeName: string;
  programmeDirector: string;
  directorEmployeeCode: string;
  projectCount: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ userName }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'employees' | 'programmes'>('overview');
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [enrolledEmployees, setEnrolledEmployees] = useState<EnrolledEmployee[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Load data from API
      // Mock data for now
      setPendingApprovals([
        { id: 1, employeeName: 'Rahul Patel', employeeCode: 'EMP004', requestedRole: 'PROGRAMME_DIRECTOR', submissionDate: '2026-01-10', status: 'PENDING' },
        { id: 2, employeeName: 'Anjali Singh', employeeCode: 'EMP005', requestedRole: 'PROJECT_DIRECTOR', submissionDate: '2026-01-11', status: 'PENDING' },
      ]);
      
      setEnrolledEmployees([
        { id: 0, employeeName: 'System Admin', employeeCode: 'IS00001', assignedRole: 'ADMIN', joinDate: '2025-01-01' },
        { id: 1, employeeName: 'Rajesh Kumar', employeeCode: 'EMP001', assignedRole: 'PROJECT_DIRECTOR', joinDate: '2025-06-15' },
        { id: 2, employeeName: 'Priya Sharma', employeeCode: 'EMP002', assignedRole: 'PROGRAMME_DIRECTOR', programme: 'GSLV', joinDate: '2025-07-20' },
      ]);

      setProgrammes([
        { id: 1, programmeName: 'GSLV', programmeDirector: 'Priya Sharma', directorEmployeeCode: 'EMP002', projectCount: 5 },
        { id: 2, programmeName: 'PSLV', programmeDirector: 'Unassigned', directorEmployeeCode: '', projectCount: 3 },
      ]);
    } catch (err) {
      setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (id: number) => {
    try {
      // TODO: Call API to approve
      setPendingApprovals(pendingApprovals.filter(p => p.id !== id));
      // Add to enrolled employees
    } catch (err) {
      setError(`Failed to approve: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleRejectRequest = async (id: number) => {
    try {
      // TODO: Call API to reject
      setPendingApprovals(pendingApprovals.filter(p => p.id !== id));
    } catch (err) {
      setError(`Failed to reject: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleAssignProgramme = async (employeeId: number, programmeId: number) => {
    try {
      // TODO: Call API to assign programme
      setEnrolledEmployees(enrolledEmployees.map(e =>
        e.id === employeeId
          ? { ...e, programme: programmes.find(p => p.id === programmeId)?.programmeName }
          : e
      ));
    } catch (err) {
      setError(`Failed to assign: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage employees, roles, and programme assignments</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Role Approvals ({pendingApprovals.filter(p => p.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'employees'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          Enrolled Employees
        </button>
        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'programmes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Programmes
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="ml-2 text-gray-600">Loading data...</p>
        </div>
      ) : activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {pendingApprovals.filter(p => p.status === 'PENDING').length}
                </p>
              </div>
              <UserCheck className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Enrolled Employees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{enrolledEmployees.length}</p>
              </div>
              <Users className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase tracking-wide">Programmes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{programmes.length}</p>
              </div>
              <Briefcase className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>
      ) : activeTab === 'approvals' ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requested Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Submission Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingApprovals.map(approval => (
                  <tr key={approval.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{approval.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{approval.employeeCode}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                        {approval.requestedRole.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(approval.submissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {approval.status === 'PENDING' && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {approval.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(approval.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-xs font-semibold"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(approval.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-semibold"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {pendingApprovals.length === 0 && (
              <div className="text-center py-8 text-gray-600">No pending approvals</div>
            )}
          </div>
        </div>
      ) : activeTab === 'employees' ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Programme</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enrolledEmployees.map(employee => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{employee.employeeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{employee.employeeCode}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                        {employee.assignedRole.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {employee.programme || 'Not Assigned'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs font-semibold">
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {enrolledEmployees.length === 0 && (
              <div className="text-center py-8 text-gray-600">No enrolled employees</div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Programme Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Programme Director</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Projects</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {programmes.map(prog => (
                  <tr key={prog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{prog.programmeName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {prog.programmeDirector === 'Unassigned' ? (
                        <span className="text-red-600 font-medium">Unassigned</span>
                      ) : (
                        prog.programmeDirector
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {prog.directorEmployeeCode || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                        {prog.projectCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {prog.programmeDirector === 'Unassigned' && (
                        <button className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-xs font-semibold">
                          <Plus className="w-3 h-3" />
                          Assign Director
                        </button>
                      )}
                      {prog.programmeDirector !== 'Unassigned' && (
                        <button className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-xs font-semibold">
                          <Edit className="w-3 h-3" />
                          Change Director
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {programmes.length === 0 && (
              <div className="text-center py-8 text-gray-600">No programmes found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

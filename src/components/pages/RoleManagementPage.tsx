import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Loader2, AlertCircle, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react';

interface PendingRoleRequest {
  id: number;
  employeeName: string;
  employeeCode: string;
  requestedRole: string;
  submissionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface ApprovedEmployee {
  id: number;
  employeeName: string;
  employeeCode: string;
  assignedRole: string;
  assignedProgramme?: string;
  approvalStatus: 'APPROVED' | 'REJECTED';
  approvedDate: string;
}

interface Programme {
  id: number;
  programmeName: string;
}

export const RoleManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [pendingRequests, setPendingRequests] = useState<PendingRoleRequest[]>([]);
  const [approvedEmployees, setApprovedEmployees] = useState<ApprovedEmployee[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load pending requests
      const pendingResponse = await fetch('/api/admin/role-management/pending-requests');
      if (!pendingResponse.ok) {
        const text = await pendingResponse.text();
        console.error('Pending requests response:', text);
        throw new Error(`Failed to load pending requests: ${pendingResponse.status}`);
      }
      const pendingText = await pendingResponse.text();
      console.log('Pending requests response text:', pendingText);
      const pendingData = pendingText ? JSON.parse(pendingText) : { data: [] };
      setPendingRequests(pendingData.data || []);

      // Load approved employees
      const approvedResponse = await fetch('/api/admin/role-management/approved-employees');
      if (!approvedResponse.ok) {
        const text = await approvedResponse.text();
        console.error('Approved employees response:', text);
        throw new Error(`Failed to load approved employees: ${approvedResponse.status}`);
      }
      const approvedText = await approvedResponse.text();
      console.log('Approved employees response text:', approvedText);
      const approvedData = approvedText ? JSON.parse(approvedText) : { data: [] };
      setApprovedEmployees(approvedData.data || []);

      // Load programmes
      const programmesResponse = await fetch('/api/admin/role-management/programmes');
      if (!programmesResponse.ok) {
        const text = await programmesResponse.text();
        console.error('Programmes response:', text);
        throw new Error(`Failed to load programmes: ${programmesResponse.status}`);
      }
      const programmesText = await programmesResponse.text();
      console.log('Programmes response text:', programmesText);
      const programmesData = programmesText ? JSON.parse(programmesText) : { data: [] };
      setProgrammes(programmesData.data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load data: ${errorMsg}`);
      console.error('Full error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: number) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    // If Programme Director, must assign programme
    if (request.requestedRole === 'PROGRAMME_DIRECTOR') {
      setSelectedEmployeeId(requestId);
      setIsAssignModalOpen(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/role-management/pending-requests/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programmeId: null })
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Approve response:', responseText);
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Failed to approve request: ${response.status}`);
        } catch (parseErr) {
          throw new Error(`Failed to approve request: ${response.status}`);
        }
      }

      // Move from pending to approved
      const approvedRequest = pendingRequests.find(r => r.id === requestId);
      if (approvedRequest) {
        setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
        setApprovedEmployees([...approvedEmployees, {
          id: approvedRequest.id,
          employeeName: approvedRequest.employeeName,
          employeeCode: approvedRequest.employeeCode,
          assignedRole: approvedRequest.requestedRole,
          approvalStatus: 'APPROVED',
          approvedDate: new Date().toISOString()
        }]);
        setSuccess(`${approvedRequest.employeeName} approved successfully!`);
      }

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to approve: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignAndApprove = async () => {
    if (!selectedEmployeeId || !selectedProgrammeId) {
      setError('Please select both employee and programme');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/role-management/pending-requests/${selectedEmployeeId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ programmeId: selectedProgrammeId })
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Approve with programme response:', responseText);
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Failed to approve request: ${response.status}`);
        } catch (parseErr) {
          throw new Error(`Failed to approve request: ${response.status}`);
        }
      }

      // Move from pending to approved
      const approvedRequest = pendingRequests.find(r => r.id === selectedEmployeeId);
      if (approvedRequest) {
        const programmeName = programmes.find(p => p.id === selectedProgrammeId)?.programmeName;
        setPendingRequests(pendingRequests.filter(r => r.id !== selectedEmployeeId));
        setApprovedEmployees([...approvedEmployees, {
          id: approvedRequest.id,
          employeeName: approvedRequest.employeeName,
          employeeCode: approvedRequest.employeeCode,
          assignedRole: approvedRequest.requestedRole,
          assignedProgramme: programmeName,
          approvalStatus: 'APPROVED',
          approvedDate: new Date().toISOString()
        }]);
        setSuccess(`${approvedRequest.employeeName} approved with ${programmeName} programme!`);
      }

      setIsAssignModalOpen(false);
      setSelectedEmployeeId(null);
      setSelectedProgrammeId(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to approve: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!rejectingRequestId) return;

    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/role-management/pending-requests/${rejectingRequestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: rejectReason })
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Reject response:', responseText);
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || `Failed to reject request: ${response.status}`);
        } catch (parseErr) {
          throw new Error(`Failed to reject request: ${response.status}`);
        }
      }

      const rejectedRequest = pendingRequests.find(r => r.id === rejectingRequestId);
      if (rejectedRequest) {
        setPendingRequests(pendingRequests.filter(r => r.id !== rejectingRequestId));
        setSuccess(`${rejectedRequest.employeeName} rejected successfully!`);
      }

      setIsRejectModalOpen(false);
      setRejectingRequestId(null);
      setRejectReason('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Failed to reject: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredPending = pendingRequests.filter(req =>
    req.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApproved = approvedEmployees.filter(emp =>
    emp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-2">Approve or reject pending role requests from new registrations</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or employee code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Pending Requests ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'approved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Approved ({approvedEmployees.length})
        </button>
      </div>

      {/* Content */}
      {loading && activeTab === 'pending' ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <p className="ml-2 text-gray-600">Loading pending requests...</p>
        </div>
      ) : activeTab === 'pending' ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Requested Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Submission Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPending.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No pending requests found matching your search' : 'No pending role requests'}
                    </td>
                  </tr>
                ) : (
                  filteredPending.map(req => (
                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{req.employeeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.employeeCode}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                          {req.requestedRole.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(req.submissionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => handleApproveRequest(req.id)}
                          disabled={loading}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-xs font-semibold disabled:opacity-50"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectingRequestId(req.id);
                            setIsRejectModalOpen(true);
                          }}
                          disabled={loading}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-xs font-semibold disabled:opacity-50"
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Assigned Programme</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Approved Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApproved.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'No approved employees found matching your search' : 'No approved employees yet'}
                    </td>
                  </tr>
                ) : (
                  filteredApproved.map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{emp.employeeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.employeeCode}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                          {emp.assignedRole.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {emp.assignedProgramme ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                            {emp.assignedProgramme}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(emp.approvedDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Programme Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Assign Programme</h2>

            <div className="space-y-4">
              {/* Selected Employee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selected Employee</label>
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm text-gray-900 font-medium">
                    {pendingRequests.find(r => r.id === selectedEmployeeId)?.employeeName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {pendingRequests.find(r => r.id === selectedEmployeeId)?.employeeCode}
                  </p>
                </div>
              </div>

              {/* Programme Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Programme</label>
                <select
                  value={selectedProgrammeId || ''}
                  onChange={(e) => setSelectedProgrammeId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a programme...</option>
                  {programmes.map(prog => (
                    <option key={prog.id} value={prog.id}>
                      {prog.programmeName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Validation Messages */}
              {!selectedProgrammeId && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-700">Please select a programme</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
                  setSelectedEmployeeId(null);
                  setSelectedProgrammeId(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignAndApprove}
                disabled={!selectedProgrammeId || loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Approving...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Request</h2>

            <div className="space-y-4">
              {/* Rejection Reason */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Rejection</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide a reason for rejection (will be visible to applicant)..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              {/* Validation Messages */}
              {!rejectReason.trim() && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-700">Please provide a rejection reason</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectingRequestId(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectRequest}
                disabled={!rejectReason.trim() || loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

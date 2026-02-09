import React from 'react';
import { SAMPLE_PROJECT_DEFINITIONS, SAMPLE_REVISION_REQUESTS } from '../../pbemData';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface ApprovalsPageProps {
  userName: string;
  userRole: 'Project Director' | 'Programme Director' | 'Chairman';
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ userName, userRole }) => {
  const allRevisions = SAMPLE_REVISION_REQUESTS;
  let revisions = allRevisions;

  if (userRole === 'Programme Director') {
    revisions = revisions.filter(r => r.status === 'PENDING');
  } else if (userRole === 'Chairman') {
    revisions = revisions.filter(r => r.status === 'PENDING');
  }

  const handleApprove = (revisionId: string) => {
    console.log('Approved revision:', revisionId);
  };

  const handleReject = (revisionId: string) => {
    console.log('Rejected revision:', revisionId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Approval Requests</h1>
        <p className="text-gray-600 mt-2">Review and approve pending revision requests</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide">Pending</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{revisions.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide">Approved (Total)</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {allRevisions.filter(r => r.status === 'APPROVED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide">Avg Response Time</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">2.4d</p>
        </div>
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {revisions.map(revision => {
          const project = SAMPLE_PROJECT_DEFINITIONS.find(p => p.id === revision.projectDefinitionId);
          return (
            <div key={revision.id} className="bg-white rounded-lg border border-orange-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{project?.projectName}</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Revision Reason:</p>
                      <p className="font-medium text-gray-900">{revision.remarks}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">Current Budget</p>
                        <p className="text-lg font-bold text-gray-900">₹{((project?.sanctionedAmount || 0) / 10000000).toFixed(1)}Cr</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Revised End Date</p>
                        <p className="text-lg font-bold text-blue-600">{new Date(revision.revisedEndDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-600">Requested By: <span className="font-medium text-gray-900">{revision.requestedBy}</span></p>
                      <p className="text-gray-600">Date: <span className="font-medium text-gray-900">{new Date(revision.requestedDate).toLocaleDateString()}</span></p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleApprove(revision.id)}
                    className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(revision.id)}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {revisions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">All approvals are up to date!</p>
          <p className="text-gray-500 text-sm mt-1">No pending requests to review</p>
        </div>
      )}
    </div>
  );
};

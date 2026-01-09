import React, { useState } from 'react';
import { SAMPLE_REVISION_REQUESTS, SAMPLE_PROJECT_DEFINITIONS } from '../../pbemData';
import { AlertCircle, CheckCircle2, Clock, User } from 'lucide-react';

interface RevisionsPageProps {
  userName: string;
  userRole: 'Project Director' | 'Programme Director' | 'Chairman';
}

export const RevisionsPage: React.FC<RevisionsPageProps> = ({ userName, userRole }) => {
  const [selectedRevision, setSelectedRevision] = useState<string | null>(null);

  let revisions = SAMPLE_REVISION_REQUESTS;

  if (userRole === 'Project Director') {
    revisions = revisions.filter(r => r.requestedBy === userName);
  } else if (userRole === 'Programme Director') {
    revisions = revisions.filter(r => r.requestedBy === userName || r.status === 'PENDING');
  }

  const pendingRevisions = revisions.filter(r => r.status === 'PENDING');
  const approvedRevisions = revisions.filter(r => r.status === 'APPROVED');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Revision Requests</h1>
        <p className="text-gray-600 mt-2">Manage and track all revision requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 uppercase tracking-wide">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{revisions.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-6">
          <p className="text-sm text-orange-600 uppercase tracking-wide">Pending</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">{pendingRevisions.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <p className="text-sm text-green-600 uppercase tracking-wide">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{approvedRevisions.length}</p>
        </div>
      </div>

      {/* Pending Revisions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Approvals</h2>
        <div className="space-y-4">
          {pendingRevisions.map(revision => {
            const project = SAMPLE_PROJECT_DEFINITIONS.find(p => p.id === revision.projectDefinitionId);
            return (
              <div 
                key={revision.id}
                className="bg-white rounded-lg border border-orange-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedRevision(revision.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900">{project?.projectName}</h3>
                    <p className="text-sm text-gray-600 mt-1">{revision.remarks}</p>
                    <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(revision.requestedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {revision.requestedBy}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approved Revisions */}
      {approvedRevisions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Approved Revisions</h2>
          <div className="space-y-4">
            {approvedRevisions.map(revision => {
              const project = SAMPLE_PROJECT_DEFINITIONS.find(p => p.id === revision.projectDefinitionId);
              return (
                <div key={revision.id} className="bg-white rounded-lg border border-green-200 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900">{project?.projectName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{revision.remarks}</p>
                      <p className="text-sm text-gray-600 mt-2">Approved: {revision.approvalDate ? new Date(revision.approvalDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Approved
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {revisions.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No revision requests</p>
        </div>
      )}
    </div>
  );
};

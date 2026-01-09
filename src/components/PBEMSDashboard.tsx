import React, { useState } from 'react';
import {
  SAMPLE_PROJECT_DEFINITIONS,
  SAMPLE_PROJECT_SCHEDULING,
  SAMPLE_REVISION_REQUESTS,
  SAMPLE_USERS,
} from '../pbemData';
import { UserRole, ProjectStatus } from '../pbemTypes';
import ProjectDefinitionList from './ProjectDefinitionList';
import ProjectSchedulingDetail from './ProjectSchedulingDetail';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface PBEMSDashboardProps {
  userRole: UserRole;
  currentUserName: string;
}

const PBEMSDashboard: React.FC<PBEMSDashboardProps> = ({ userRole, currentUserName }) => {
  const [activeTab, setActiveTab] = useState<'definitions' | 'scheduling' | 'revisions'>('definitions');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const currentUser = SAMPLE_USERS.find((u) => u.name === currentUserName);

  // Filter data based on role
  const filteredDefinitions =
    userRole === UserRole.CHAIRMAN
      ? SAMPLE_PROJECT_DEFINITIONS
      : userRole === UserRole.PROGRAMME_DIRECTOR
      ? SAMPLE_PROJECT_DEFINITIONS.filter((p) => p.programmeDirectorName === currentUserName)
      : SAMPLE_PROJECT_DEFINITIONS.filter((p) => p.projectDirectorName === currentUserName);

  const filteredSchedulings =
    userRole === UserRole.CHAIRMAN
      ? SAMPLE_PROJECT_SCHEDULING
      : userRole === UserRole.PROGRAMME_DIRECTOR
      ? SAMPLE_PROJECT_SCHEDULING.filter((s) => {
          const def = SAMPLE_PROJECT_DEFINITIONS.find((d) => d.id === s.projectDefinitionId);
          return def?.programmeDirectorName === currentUserName;
        })
      : SAMPLE_PROJECT_SCHEDULING.filter((s) => {
          const def = SAMPLE_PROJECT_DEFINITIONS.find((d) => d.id === s.projectDefinitionId);
          return def?.projectDirectorName === currentUserName;
        });

  const filteredRevisions =
    userRole === UserRole.CHAIRMAN
      ? SAMPLE_REVISION_REQUESTS
      : userRole === UserRole.PROGRAMME_DIRECTOR
      ? SAMPLE_REVISION_REQUESTS.filter((r) => {
          const def = SAMPLE_PROJECT_DEFINITIONS.find((d) => d.id === r.projectDefinitionId);
          return def?.programmeDirectorName === currentUserName;
        })
      : SAMPLE_REVISION_REQUESTS.filter((r) => r.requestedBy === currentUserName);

  // Statistics
  const totalProjects = filteredDefinitions.length;
  const onTrackCount = filteredDefinitions.filter((p) => p.status === ProjectStatus.ON_TRACK).length;
  const atRiskCount = filteredDefinitions.filter((p) => p.status === ProjectStatus.AT_RISK).length;
  const delayedCount = filteredDefinitions.filter((p) => p.status === ProjectStatus.DELAYED).length;
  const completedCount = filteredDefinitions.filter((p) => p.status === ProjectStatus.COMPLETED).length;
  const pendingRevisions = filteredRevisions.filter((r) => r.status === 'PENDING').length;

  const selectedProject = SAMPLE_PROJECT_DEFINITIONS.find((p) => p.id === selectedProjectId);
  const selectedScheduling = SAMPLE_PROJECT_SCHEDULING.find(
    (s) => s.projectDefinitionId === selectedProjectId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">PMS Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome, <span className="font-semibold">{currentUserName}</span> ({userRole})
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase">Role</p>
                <p className="text-sm font-bold text-gray-900">{userRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <p className="text-xs text-gray-600 font-semibold uppercase">Total Projects</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalProjects}</h3>
          </div>
          <div className="bg-emerald-50 rounded-lg p-5 shadow-sm border border-emerald-200">
            <p className="text-xs text-emerald-700 font-semibold uppercase">On Track</p>
            <h3 className="text-3xl font-bold text-emerald-900 mt-2">{onTrackCount}</h3>
          </div>
          <div className="bg-orange-50 rounded-lg p-5 shadow-sm border border-orange-200">
            <p className="text-xs text-orange-700 font-semibold uppercase">At Risk</p>
            <h3 className="text-3xl font-bold text-orange-900 mt-2">{atRiskCount}</h3>
          </div>
          <div className="bg-red-50 rounded-lg p-5 shadow-sm border border-red-200">
            <p className="text-xs text-red-700 font-semibold uppercase">Delayed</p>
            <h3 className="text-3xl font-bold text-red-900 mt-2">{delayedCount}</h3>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 shadow-sm border border-blue-200">
            <p className="text-xs text-blue-700 font-semibold uppercase">Completed</p>
            <h3 className="text-3xl font-bold text-blue-900 mt-2">{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="bg-white rounded-t-lg border border-b-0 border-gray-200 shadow-sm overflow-hidden mb-0">
          <div className="flex items-center gap-0">
            <button
              onClick={() => {
                setActiveTab('definitions');
                setViewMode('list');
              }}
              className={`flex-1 px-6 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === 'definitions'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Project Definitions
            </button>
            <button
              onClick={() => setActiveTab('scheduling')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === 'scheduling'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Project Scheduling
            </button>
            {userRole !== UserRole.CHAIRMAN && (
              <button
                onClick={() => setActiveTab('revisions')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors border-b-2 relative ${
                  activeTab === 'revisions'
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Revision Requests
                {pendingRevisions > 0 && (
                  <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pendingRevisions}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg border border-gray-200 shadow-sm p-8">
          {activeTab === 'definitions' && viewMode === 'list' && (
            <ProjectDefinitionList
              projects={filteredDefinitions}
              userRole={userRole}
              currentUserName={currentUserName}
              onEdit={(project) => {
                // Edit functionality
                alert(`Edit functionality for ${project.projectName} would be implemented here`);
              }}
              onView={(project) => {
                setSelectedProjectId(project.id);
                setViewMode('detail');
              }}
              onCreateNew={() => {
                alert('New Project creation form would be implemented here');
              }}
            />
          )}

          {activeTab === 'definitions' && viewMode === 'detail' && selectedProject && (
            <div>
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180" />
                Back to List
              </button>
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedProject.projectName}</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Programme Name</p>
                    <p className="text-lg font-bold text-gray-900">{selectedProject.programmeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Lead Centre</p>
                    <p className="text-lg font-bold text-gray-900">{selectedProject.leadCentreName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Sanctioned Amount</p>
                    <p className="text-lg font-bold text-gray-900">₹{(selectedProject.sanctionedAmount / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">End Date</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(selectedProject.revisedEndDate || selectedProject.endDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scheduling' && selectedScheduling && (
            <div>
              <button
                onClick={() => setSelectedProjectId(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <ArrowRight className="w-4 h-4 transform rotate-180" />
                Back to List
              </button>
              <ProjectSchedulingDetail
                scheduling={selectedScheduling}
                projectName={selectedProject?.projectName || 'Unknown Project'}
              />
            </div>
          )}

          {activeTab === 'scheduling' && !selectedScheduling && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Project</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchedulings.map((scheduling) => {
                  const def = SAMPLE_PROJECT_DEFINITIONS.find((d) => d.id === scheduling.projectDefinitionId);
                  return (
                    <button
                      key={scheduling.id}
                      onClick={() => setSelectedProjectId(scheduling.projectDefinitionId)}
                      className="text-left bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all"
                    >
                      <h3 className="font-bold text-gray-900 mb-2">{def?.projectName}</h3>
                      <p className="text-sm text-gray-600 mb-4">{def?.shortName}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-bold text-gray-900">{scheduling.overallCompletionPercentage}% Complete</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          scheduling.status === ProjectStatus.ON_TRACK
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : scheduling.status === ProjectStatus.AT_RISK
                            ? 'bg-orange-100 text-orange-800 border-orange-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}>
                          {scheduling.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'revisions' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Revision Requests</h2>
              {filteredRevisions.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No revision requests</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRevisions.map((revision) => {
                    const def = SAMPLE_PROJECT_DEFINITIONS.find((d) => d.id === revision.projectDefinitionId);
                    return (
                      <div key={revision.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-gray-900">{def?.projectName}</h3>
                            <p className="text-sm text-gray-600 mt-1">Requested by: {revision.requestedBy}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            revision.status === 'PENDING'
                              ? 'bg-orange-100 text-orange-800 border-orange-300'
                              : revision.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-red-100 text-red-800 border-red-300'
                          }`}>
                            {revision.status}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                          <p className="text-sm text-gray-700"><span className="font-semibold">Revised End Date:</span> {new Date(revision.revisedEndDate).toLocaleDateString('en-IN')}</p>
                          <p className="text-sm text-gray-700 mt-2"><span className="font-semibold">Remarks:</span> {revision.remarks}</p>
                        </div>
                        {revision.approvalRemarks && (
                          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                            <p className="text-sm text-emerald-800"><span className="font-semibold">Approval Remarks:</span> {revision.approvalRemarks}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PBEMSDashboard;

import React, { useState } from 'react';
import { ProjectDefinition } from '../pbemTypes';
import { 
  Plus, 
  Edit2, 
  Eye, 
  Calendar, 
  DollarSign, 
  Users,
  MapPin,
  FileText
} from 'lucide-react';

interface ProjectDefinitionListProps {
  projects: ProjectDefinition[];
  userRole: string;
  currentUserName: string;
  onEdit: (project: ProjectDefinition) => void;
  onView: (project: ProjectDefinition) => void;
  onCreateNew: () => void;
}

const ProjectDefinitionList: React.FC<ProjectDefinitionListProps> = ({
  projects,
  userRole,
  currentUserName,
  onEdit,
  onView,
  onCreateNew,
}) => {
  // Filter projects based on role
  const filteredProjects = projects.filter((project) => {
    if (userRole === 'Project Director') {
      return project.projectDirectorName === currentUserName;
    } else if (userRole === 'Programme Director') {
      return project.programmeDirectorName === currentUserName;
    }
    // Chairman sees all
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'At Risk':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Delayed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const daysUntilDeadline = (endDate: string) => {
    const today = new Date('2025-01-08');
    const deadline = new Date(endDate);
    const days = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Definitions</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} assigned to you
          </p>
        </div>
        {userRole === 'Project Director' && (
          <button
            onClick={onCreateNew}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No projects found</p>
            <p className="text-sm text-gray-500 mt-1">
              {userRole === 'Project Director'
                ? 'Create a new project to get started'
                : 'No projects assigned to you yet'}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const daysLeft = daysUntilDeadline(project.revisedEndDate || project.endDate);

            return (
              <div
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="p-6">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">{project.projectName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Short Name: <span className="font-semibold text-gray-900">{project.shortName}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView(project)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      {userRole === 'Project Director' && (
                        <button
                          onClick={() => onEdit(project)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Project Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Lead Centre</p>
                          <p className="text-sm text-gray-900 font-medium">{project.leadCentreName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Budget Code</p>
                          <p className="text-sm text-gray-900 font-medium">{project.budgetCode}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Budget</p>
                          <p className="text-sm text-gray-900 font-bold">
                            ₹{(project.revisedSanctionedAmount / 1000000).toFixed(1)}M
                          </p>
                          {project.revisedSanctionedAmount !== project.sanctionedAmount && (
                            <p className="text-xs text-orange-600">
                              Revised from ₹{(project.sanctionedAmount / 1000000).toFixed(1)}M
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Programme Director</p>
                          <p className="text-sm text-gray-900 font-medium">{project.programmeDirectorName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Project Director</p>
                          <p className="text-sm text-gray-900 font-medium">{project.projectDirectorName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold uppercase">Deadline</p>
                          <p className="text-sm text-gray-900 font-medium">
                            {new Date(project.revisedEndDate || project.endDate).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className={`text-xs font-semibold mt-0.5 ${
                            daysLeft < 0 ? 'text-red-600' : daysLeft < 30 ? 'text-orange-600' : 'text-emerald-600'
                          }`}>
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days remaining`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revised Date Info */}
                  {project.revisedEndDate && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-xs text-orange-700 font-semibold uppercase mb-1">Revision Details</p>
                      <p className="text-sm text-orange-900">
                        <span className="font-semibold">Revised End Date:</span> {new Date(project.revisedEndDate).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-sm text-orange-800 mt-2">{project.revisedDateRemarks}</p>
                      {project.revisedDateApprovedByChairman && (
                        <p className="text-xs text-emerald-700 font-semibold mt-2">✓ Approved by Chairman</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectDefinitionList;

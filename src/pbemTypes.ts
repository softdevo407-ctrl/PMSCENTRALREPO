/**
 * PMS (Project Management System)
 * Comprehensive types for project management with role-based access
 */

export enum UserRole {
  PROJECT_DIRECTOR = 'Project Director',
  PROGRAMME_DIRECTOR = 'Programme Director',
  CHAIRMAN = 'Chairman',
}

export enum PhaseType {
  PLANNING = 'Planning Phase',
  INTEGRATION = 'Integration Phase',
  TESTING = 'Testing Phase',
}

export enum ProjectStatus {
  ON_TRACK = 'On Track',
  AT_RISK = 'At Risk',
  DELAYED = 'Delayed',
  COMPLETED = 'Completed',
}

export interface Activity {
  id: string;
  name: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  weight: number; // percentage within milestone (0-100)
  status: ProjectStatus;
  completionPercentage: number; // 0-100
  remarks?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  activities: Activity[];
  completionPercentage: number; // calculated from activities
  status: ProjectStatus;
}

export interface ProjectPhase {
  id: string;
  type: PhaseType;
  weight: number; // e.g., 60 for Phase 1, 30 for Phase 2, 10 for Phase 3
  milestones: Milestone[];
  completionPercentage: number; // calculated from weighted milestones
  status: ProjectStatus;
}

export interface ProjectDefinition {
  id: string;
  categoryName: string;
  projectName: string;
  shortName: string;
  programmeName: string;
  leadCentreName: string;
  budgetCode: string;
  programmeDirectorName: string;
  projectDirectorName: string;
  sanctionedDate: string;
  endDate: string;
  sanctionedAmount: number;
  revisedSanctionedAmount: number;
  revisedEndDate?: string;
  revisedDateRemarks?: string;
  revisedDateApprovedByChairman: boolean;
  createdDate: string;
  status: ProjectStatus;
}

export interface ProjectScheduling {
  id: string;
  projectDefinitionId: string;
  phases: ProjectPhase[];
  overallCompletionPercentage: number;
  status: ProjectStatus;
  lastUpdated: string;
}

export interface RevisionRequest {
  id: string;
  projectDefinitionId: string;
  projectSchedulingId: string;
  requestedBy: string; // Project Director name
  requestedDate: string;
  revisedEndDate: string;
  remarks: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedByChairman?: boolean;
  approvalDate?: string;
  approvalRemarks?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface PBEMSDashboardData {
  projectDefinitions: ProjectDefinition[];
  projectSchedulings: ProjectScheduling[];
  revisionRequests: RevisionRequest[];
  users: User[];
}

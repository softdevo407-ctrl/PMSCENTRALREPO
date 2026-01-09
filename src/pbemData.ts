/**
 * PMS Hardcoded Sample Data
 * This contains all the project definitions, scheduling, and revision data
 */

import {
  ProjectDefinition,
  ProjectScheduling,
  RevisionRequest,
  User,
  UserRole,
  PhaseType,
  ProjectStatus,
} from './pbemTypes';

// ============ USERS ============
export const SAMPLE_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@pms.gov',
    role: UserRole.PROJECT_DIRECTOR,
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@pms.gov',
    role: UserRole.PROJECT_DIRECTOR,
  },
  {
    id: 'user-3',
    name: 'Amit Patel',
    email: 'amit.patel@pms.gov',
    role: UserRole.PROGRAMME_DIRECTOR,
  },
  {
    id: 'user-4',
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@pms.gov',
    role: UserRole.PROGRAMME_DIRECTOR,
  },
  {
    id: 'user-5',
    name: 'Dr. Ramesh Gupta',
    email: 'ramesh.gupta@pms.gov',
    role: UserRole.CHAIRMAN,
  },
];

// ============ PROJECT DEFINITIONS ============
export const SAMPLE_PROJECT_DEFINITIONS: ProjectDefinition[] = [
  {
    id: 'proj-def-001',
    categoryName: 'Launch Vehicles',
    projectName: 'Advanced Launch Vehicle Development',
    shortName: 'ALVD-2024',
    programmeName: 'Space Transportation Program',
    leadCentreName: 'Vikram Sarabhai Space Centre',
    budgetCode: 'LV-2024-001',
    programmeDirectorName: 'Amit Patel',
    projectDirectorName: 'Rajesh Kumar',
    sanctionedDate: '2024-01-15',
    endDate: '2025-12-31',
    sanctionedAmount: 50000000, // 50 Million
    revisedSanctionedAmount: 52000000, // 52 Million
    revisedEndDate: '2026-03-31',
    revisedDateRemarks: 'Extended due to component procurement delays',
    revisedDateApprovedByChairman: true,
    createdDate: '2024-01-15',
    status: ProjectStatus.AT_RISK,
  },
  {
    id: 'proj-def-002',
    categoryName: 'Satellite Communication',
    projectName: 'Next Generation Satellite Communication System',
    shortName: 'NGSAT-2024',
    programmeName: 'Satellite Communication Program',
    leadCentreName: 'Space Applications Centre',
    budgetCode: 'SC-2024-002',
    programmeDirectorName: 'Dr. Vikram Singh',
    projectDirectorName: 'Priya Sharma',
    sanctionedDate: '2024-02-01',
    endDate: '2025-06-30',
    sanctionedAmount: 35000000,
    revisedSanctionedAmount: 35000000,
    createdDate: '2024-02-01',
    status: ProjectStatus.ON_TRACK,
  },
  {
    id: 'proj-def-003',
    categoryName: 'Infrastructure & Advanced R&D',
    projectName: 'Advanced Computing Infrastructure',
    shortName: 'ACI-2024',
    programmeName: 'Technology Development Program',
    leadCentreName: 'Indian Institute of Space Science and Technology',
    budgetCode: 'INF-2024-003',
    programmeDirectorName: 'Amit Patel',
    projectDirectorName: 'Rajesh Kumar',
    sanctionedDate: '2023-06-01',
    endDate: '2024-12-31',
    sanctionedAmount: 25000000,
    revisedSanctionedAmount: 28000000,
    createdDate: '2023-06-01',
    status: ProjectStatus.DELAYED,
  },
];

// ============ PROJECT SCHEDULING ============
export const SAMPLE_PROJECT_SCHEDULING: ProjectScheduling[] = [
  {
    id: 'proj-sch-001',
    projectDefinitionId: 'proj-def-001',
    overallCompletionPercentage: 45,
    status: ProjectStatus.AT_RISK,
    lastUpdated: '2025-01-08',
    phases: [
      {
        id: 'phase-001-01',
        type: PhaseType.PLANNING,
        weight: 60,
        completionPercentage: 72,
        status: ProjectStatus.ON_TRACK,
        milestones: [
          {
            id: 'milestone-001-01',
            name: 'Requirements Definition',
            description: 'Define detailed technical requirements',
            startDate: '2024-01-15',
            endDate: '2024-03-31',
            completionPercentage: 85,
            status: ProjectStatus.COMPLETED,
            activities: [
              {
                id: 'activity-001-01',
                name: 'Stakeholder Analysis',
                startDate: '2024-01-15',
                endDate: '2024-02-15',
                weight: 30,
                completionPercentage: 100,
                status: ProjectStatus.COMPLETED,
              },
              {
                id: 'activity-001-02',
                name: 'Requirement Documentation',
                startDate: '2024-02-16',
                endDate: '2024-03-31',
                weight: 70,
                completionPercentage: 80,
                status: ProjectStatus.ON_TRACK,
              },
            ],
          },
          {
            id: 'milestone-001-02',
            name: 'Design & Architecture',
            description: 'Create system design and architecture',
            startDate: '2024-04-01',
            endDate: '2024-06-30',
            completionPercentage: 60,
            status: ProjectStatus.ON_TRACK,
            activities: [
              {
                id: 'activity-001-03',
                name: 'System Architecture Design',
                startDate: '2024-04-01',
                endDate: '2024-05-15',
                weight: 50,
                completionPercentage: 75,
                status: ProjectStatus.ON_TRACK,
              },
              {
                id: 'activity-001-04',
                name: 'Detailed Design Documentation',
                startDate: '2024-05-16',
                endDate: '2024-06-30',
                weight: 50,
                completionPercentage: 45,
                status: ProjectStatus.ON_TRACK,
              },
            ],
          },
        ],
      },
      {
        id: 'phase-001-02',
        type: PhaseType.INTEGRATION,
        weight: 30,
        completionPercentage: 28,
        status: ProjectStatus.AT_RISK,
        milestones: [
          {
            id: 'milestone-001-03',
            name: 'Component Integration',
            description: 'Integrate components into system',
            startDate: '2024-07-01',
            endDate: '2024-10-31',
            completionPercentage: 28,
            status: ProjectStatus.AT_RISK,
            activities: [
              {
                id: 'activity-001-05',
                name: 'Component Procurement',
                startDate: '2024-07-01',
                endDate: '2024-08-31',
                weight: 40,
                completionPercentage: 50,
                status: ProjectStatus.AT_RISK,
                remarks: 'Vendor delays in component delivery',
              },
              {
                id: 'activity-001-06',
                name: 'Integration & Testing',
                startDate: '2024-09-01',
                endDate: '2024-10-31',
                weight: 60,
                completionPercentage: 15,
                status: ProjectStatus.AT_RISK,
              },
            ],
          },
        ],
      },
      {
        id: 'phase-001-03',
        type: PhaseType.TESTING,
        weight: 10,
        completionPercentage: 0,
        status: ProjectStatus.DELAYED,
        milestones: [
          {
            id: 'milestone-001-04',
            name: 'Quality Assurance Testing',
            description: 'Comprehensive testing and validation',
            startDate: '2024-11-01',
            endDate: '2025-12-31',
            completionPercentage: 0,
            status: ProjectStatus.DELAYED,
            activities: [
              {
                id: 'activity-001-07',
                name: 'Unit Testing',
                startDate: '2024-11-01',
                endDate: '2024-12-31',
                weight: 40,
                completionPercentage: 0,
                status: ProjectStatus.DELAYED,
              },
              {
                id: 'activity-001-08',
                name: 'System Testing & Validation',
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                weight: 60,
                completionPercentage: 0,
                status: ProjectStatus.DELAYED,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'proj-sch-002',
    projectDefinitionId: 'proj-def-002',
    overallCompletionPercentage: 62,
    status: ProjectStatus.ON_TRACK,
    lastUpdated: '2025-01-08',
    phases: [
      {
        id: 'phase-002-01',
        type: PhaseType.PLANNING,
        weight: 60,
        completionPercentage: 100,
        status: ProjectStatus.COMPLETED,
        milestones: [
          {
            id: 'milestone-002-01',
            name: 'Requirements & Planning',
            description: 'Complete project planning',
            startDate: '2024-02-01',
            endDate: '2024-05-31',
            completionPercentage: 100,
            status: ProjectStatus.COMPLETED,
            activities: [
              {
                id: 'activity-002-01',
                name: 'Project Charter',
                startDate: '2024-02-01',
                endDate: '2024-02-29',
                weight: 30,
                completionPercentage: 100,
                status: ProjectStatus.COMPLETED,
              },
              {
                id: 'activity-002-02',
                name: 'Technical Specifications',
                startDate: '2024-03-01',
                endDate: '2024-05-31',
                weight: 70,
                completionPercentage: 100,
                status: ProjectStatus.COMPLETED,
              },
            ],
          },
        ],
      },
      {
        id: 'phase-002-02',
        type: PhaseType.INTEGRATION,
        weight: 30,
        completionPercentage: 45,
        status: ProjectStatus.ON_TRACK,
        milestones: [
          {
            id: 'milestone-002-02',
            name: 'Development & Integration',
            description: 'Build and integrate system',
            startDate: '2024-06-01',
            endDate: '2025-02-28',
            completionPercentage: 45,
            status: ProjectStatus.ON_TRACK,
            activities: [
              {
                id: 'activity-002-03',
                name: 'Core Module Development',
                startDate: '2024-06-01',
                endDate: '2024-11-30',
                weight: 50,
                completionPercentage: 70,
                status: ProjectStatus.ON_TRACK,
              },
              {
                id: 'activity-002-04',
                name: 'Integration & Verification',
                startDate: '2024-12-01',
                endDate: '2025-02-28',
                weight: 50,
                completionPercentage: 20,
                status: ProjectStatus.ON_TRACK,
              },
            ],
          },
        ],
      },
      {
        id: 'phase-002-03',
        type: PhaseType.TESTING,
        weight: 10,
        completionPercentage: 0,
        status: ProjectStatus.DELAYED,
        milestones: [
          {
            id: 'milestone-002-03',
            name: 'Testing & Deployment',
            description: 'Final testing and deployment',
            startDate: '2025-03-01',
            endDate: '2025-06-30',
            completionPercentage: 0,
            status: ProjectStatus.DELAYED,
            activities: [
              {
                id: 'activity-002-05',
                name: 'UAT Testing',
                startDate: '2025-03-01',
                endDate: '2025-05-31',
                weight: 60,
                completionPercentage: 0,
                status: ProjectStatus.DELAYED,
              },
              {
                id: 'activity-002-06',
                name: 'Production Deployment',
                startDate: '2025-06-01',
                endDate: '2025-06-30',
                weight: 40,
                completionPercentage: 0,
                status: ProjectStatus.DELAYED,
              },
            ],
          },
        ],
      },
    ],
  },
];

// ============ REVISION REQUESTS ============
export const SAMPLE_REVISION_REQUESTS: RevisionRequest[] = [
  {
    id: 'revision-001',
    projectDefinitionId: 'proj-def-001',
    projectSchedulingId: 'proj-sch-001',
    requestedBy: 'Rajesh Kumar',
    requestedDate: '2025-01-05',
    revisedEndDate: '2026-03-31',
    remarks: 'Extended timeline due to vendor delays in critical component procurement',
    status: 'APPROVED',
    approvedByChairman: true,
    approvalDate: '2025-01-07',
    approvalRemarks: 'Approved with condition to track vendor performance',
  },
  {
    id: 'revision-002',
    projectDefinitionId: 'proj-def-003',
    projectSchedulingId: 'proj-sch-002',
    requestedBy: 'Rajesh Kumar',
    requestedDate: '2025-01-03',
    revisedEndDate: '2025-03-31',
    remarks: 'Infrastructure procurement and installation taking longer than expected',
    status: 'PENDING',
  },
];

// ============ HELPER FUNCTION TO CALCULATE WEIGHTED COMPLETION ============
export function calculatePhaseCompletion(phase: typeof SAMPLE_PROJECT_SCHEDULING[0]['phases'][0]): number {
  if (phase.milestones.length === 0) return 0;
  const totalWeight = phase.milestones.reduce((sum, m) => sum + (m.activities.length || 1), 0);
  const weightedCompletion = phase.milestones.reduce((sum, m) => {
    const milestoneActivities = m.activities || [];
    if (milestoneActivities.length === 0) return sum + m.completionPercentage;
    return sum + (m.completionPercentage * milestoneActivities.length);
  }, 0);
  return Math.round(weightedCompletion / totalWeight);
}

export function calculateProjectStatus(
  completionPercentage: number,
  endDate: string,
  schedulingData: typeof SAMPLE_PROJECT_SCHEDULING[0]
): ProjectStatus {
  const today = new Date('2025-01-08');
  const deadline = new Date(endDate);
  const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Completed
  if (completionPercentage >= 100) {
    return ProjectStatus.COMPLETED;
  }

  // Delayed
  if (daysRemaining < 0) {
    return ProjectStatus.DELAYED;
  }

  // At Risk
  if (daysRemaining < 30 && completionPercentage < 75) {
    return ProjectStatus.AT_RISK;
  }

  // On Track
  return ProjectStatus.ON_TRACK;
}

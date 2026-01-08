
export enum ProjectCategory {
  LAUNCH_VEHICLES = 'Launch Vehicles',
  SATELLITE_COMM = 'Satellite Communication',
  INFRASTRUCTURE_RD = 'Infrastructure & Advanced R&D',
  USER_FUNDED = 'User Funded Projects'
}

export enum ProjectStatus {
  ON_TRACK = 'On Track',
  AT_RISK = 'At Risk',
  DELAYED = 'Delayed',
  COMPLETED = 'Completed'
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completedDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  totalBudget: number;
  expenditure: number;
  status: ProjectStatus;
  milestones: Milestone[];
  delayRemarks?: string;
  description: string;
}

export interface DashboardStats {
  totalBudget: number;
  totalExpenditure: number;
  projectCount: number;
}

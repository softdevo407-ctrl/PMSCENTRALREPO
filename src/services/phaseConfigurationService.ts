import { ProjectPhaseGenericService, ProjectPhaseGeneric } from './projectPhaseGenericService';
import { ProjectMilestoneService, ProjectMilestone } from './projectMilestoneService';
import { ProjectActivityService, ProjectActivity } from './projectActivityService';

export interface PhaseOption {
  code: string;
  fullName: string;
}

export interface MilestoneOption {
  code: string;
  fullName: string;
  fromDate: string;
  toDate: string | null;
}

export interface ActivityOption {
  code: string;
  fullName: string;
  fromDate: string;
  toDate: string | null;
}

export interface MilestoneEntry {
  id: string;
  milestoneCode: string;
  milestoneName: string;
  startDate: string;
  endDate: string;
  months: number;
  activities: ActivityEntry[];
}

export interface ActivityEntry {
  id: string;
  activityCode: string;
  activityName: string;
  startDate: string;
  endDate: string;
  months: number;
  sortOrder: number;
}

export interface PhaseConfiguration {
  phaseCode: string;
  phaseName: string;
  sortOrder: number;
  milestones: MilestoneEntry[];
}

export class PhaseConfigurationService {
  static async getAllPhaseOptions(): Promise<PhaseOption[]> {
    try {
      const phases = await ProjectPhaseGenericService.getAllPhases();
      return phases.map(p => ({
        code: p.projectPhaseCode,
        fullName: p.projectPhaseFullName
      }));
    } catch (error) {
      console.error('Error fetching phase options:', error);
      throw error;
    }
  }

  static async getAllMilestoneOptions(): Promise<MilestoneOption[]> {
    try {
      const milestones = await ProjectMilestoneService.getAllMilestones();
      return milestones.map(m => ({
        code: m.projectMilestoneCode,
        fullName: m.projectMilestoneFullName,
        fromDate: m.fromDate,
        toDate: m.toDate
      }));
    } catch (error) {
      console.error('Error fetching milestone options:', error);
      throw error;
    }
  }

  static async getAllActivityOptions(): Promise<ActivityOption[]> {
    try {
      const activities = await ProjectActivityService.getAllProjectActivities();
      return activities.map(a => ({
        code: a.projectActivityCode,
        fullName: a.projectActivityFullName,
        fromDate: a.fromDate,
        toDate: a.toDate
      }));
    } catch (error) {
      console.error('Error fetching activity options:', error);
      throw error;
    }
  }

  static calculateMonths(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(0, Math.round(months));
  }
}

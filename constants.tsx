
import React from 'react';
import { Project, ProjectCategory, ProjectStatus } from './types';
import { 
  Rocket, 
  Satellite, 
  Microscope, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  [ProjectCategory.LAUNCH_VEHICLES]: <Rocket className="w-6 h-6 text-blue-600" />,
  [ProjectCategory.SATELLITE_COMM]: <Satellite className="w-6 h-6 text-indigo-600" />,
  [ProjectCategory.INFRASTRUCTURE_RD]: <Microscope className="w-6 h-6 text-emerald-600" />,
  [ProjectCategory.USER_FUNDED]: <Users className="w-6 h-6 text-orange-600" />,
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.ON_TRACK]: 'bg-green-100 text-green-700 border-green-200',
  [ProjectStatus.AT_RISK]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [ProjectStatus.DELAYED]: 'bg-red-100 text-red-700 border-red-200',
  [ProjectStatus.COMPLETED]: 'bg-blue-100 text-blue-700 border-blue-200',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'GSLV Mark IV Prototype',
    category: ProjectCategory.LAUNCH_VEHICLES,
    totalBudget: 120000000,
    expenditure: 45000000,
    status: ProjectStatus.ON_TRACK,
    description: 'Development of the next generation heavy lift launch vehicle with reusable first stage.',
    milestones: [
      { id: 'm1', title: 'Propulsion Design', dueDate: '2024-03-01', status: 'Completed', completedDate: '2024-02-25' },
      { id: 'm2', title: 'Static Fire Test', dueDate: '2024-06-15', status: 'In Progress' },
      { id: 'm3', title: 'Avionics Integration', dueDate: '2024-09-01', status: 'Pending' }
    ]
  },
  {
    id: '2',
    name: 'Orbiter-7 Mesh Network',
    category: ProjectCategory.SATELLITE_COMM,
    totalBudget: 85000000,
    expenditure: 78000000,
    status: ProjectStatus.DELAYED,
    description: 'Low-latency global communication network utilizing 12 synchronized micro-satellites.',
    delayRemarks: 'Supply chain issues delayed the acquisition of radiation-hardened processors by 4 months.',
    milestones: [
      { id: 'm4', title: 'Satellite Bus Assembly', dueDate: '2023-11-20', status: 'Completed', completedDate: '2023-12-10' },
      { id: 'm5', title: 'Transponder Testing', dueDate: '2024-01-15', status: 'In Progress' }
    ]
  },
  {
    id: '3',
    name: 'Deep Space Antenna Array',
    category: ProjectCategory.INFRASTRUCTURE_RD,
    totalBudget: 45000000,
    expenditure: 12000000,
    status: ProjectStatus.AT_RISK,
    description: 'Ground-based upgrade for the interplanetary communication network.',
    milestones: [
      { id: 'm6', title: 'Site Selection', dueDate: '2024-02-01', status: 'Completed' },
      { id: 'm7', title: 'Foundation Excavation', dueDate: '2024-05-10', status: 'Pending' }
    ]
  },
  {
    id: '4',
    name: 'Commsat-5 Commercial Lease',
    category: ProjectCategory.USER_FUNDED,
    totalBudget: 30000000,
    expenditure: 28500000,
    status: ProjectStatus.COMPLETED,
    description: 'Commercial payload delivery and operational support for regional telco.',
    milestones: [
      { id: 'm8', title: 'Customer Handover', dueDate: '2023-12-01', status: 'Completed' }
    ]
  },
  {
    id: '5',
    name: 'Quantum Key Distribution Lab',
    category: ProjectCategory.INFRASTRUCTURE_RD,
    totalBudget: 15000000,
    expenditure: 4000000,
    status: ProjectStatus.ON_TRACK,
    description: 'Securing satellite communications using quantum cryptography protocols.',
    milestones: [
      { id: 'm9', title: 'Fiber Link Install', dueDate: '2024-04-10', status: 'In Progress' }
    ]
  }
];

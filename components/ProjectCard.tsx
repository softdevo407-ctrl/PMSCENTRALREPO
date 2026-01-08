
import React from 'react';
import { Project, ProjectStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { ChevronRight, DollarSign } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const percentageSpent = Math.round((project.expenditure / project.totalBudget) * 100);

  return (
    <div 
      onClick={() => onClick(project.id)}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
            {project.name}
          </h3>
          <span className={`inline-block px-2 py-0.5 mt-1 text-xs font-medium rounded-full border ${STATUS_COLORS[project.status]}`}>
            {project.status}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-500">
          <span>Budget Utilized</span>
          <span className="font-medium text-slate-900">{percentageSpent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${percentageSpent > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
          />
        </div>
        <div className="flex items-center text-xs text-slate-400">
          <DollarSign className="w-3 h-3 mr-1" />
          <span>{project.expenditure.toLocaleString()} / {project.totalBudget.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;


import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPIProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
}

const KPI: React.FC<KPIProps> = ({ label, value, icon: Icon, color, trend }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center text-xs">
          <span className="text-emerald-500 font-bold mr-1">{trend}</span>
          <span className="text-slate-400">vs last quarter</span>
        </div>
      )}
    </div>
  );
};

export default KPI;

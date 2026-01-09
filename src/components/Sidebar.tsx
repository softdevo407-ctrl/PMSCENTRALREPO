import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { ProjectCategory } from '../types';
import { CATEGORY_ICONS } from './constants';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView: 'DASHBOARD' | 'CATEGORY_DETAIL' | 'PROJECT_DETAIL';
  selectedCategory: ProjectCategory | null;
  onDashboardClick: () => void;
  onCategoryClick: (category: ProjectCategory) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  currentView,
  selectedCategory,
  onDashboardClick,
  onCategoryClick,
}) => {
  const categories = Object.values(ProjectCategory);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transform transition-all duration-300 z-30 flex flex-col overflow-hidden ${
          isOpen ? 'w-72' : 'w-0 lg:w-20'
        }`}
      >
        {/* Logo Section */}
        <div className="px-6 py-8 border-b border-slate-700/50 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0">
          <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl flex-shrink-0">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {isOpen && (
              <div>
                <h1 className="text-2xl font-bold text-white">PMS</h1>
                <p className="text-xs text-blue-100">Budget Monitor</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${isOpen ? 'px-4' : 'px-2'}`}>
          {/* Main Dashboard */}
          <div>
            <button
              onClick={onDashboardClick}
              className={`w-full flex items-center ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'} rounded-xl transition-all duration-200 font-medium ${
                currentView === 'DASHBOARD'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
              title={!isOpen ? 'Dashboard' : ''}
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>Dashboard</span>}
            </button>
          </div>

          {/* Sectors Section */}
          {isOpen && (
            <div className="pt-4">
              <div className="px-4 py-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Project Sectors
                </p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryClick(cat)}
                className={`w-full flex items-center ${isOpen ? 'gap-3 px-4 py-3 text-left' : 'justify-center p-3'} rounded-xl transition-all duration-200 group ${
                  selectedCategory === cat && currentView === 'CATEGORY_DETAIL'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
                title={!isOpen ? cat : ''}
              >
                <span className="text-lg flex-shrink-0">
                  {CATEGORY_ICONS[cat]}
                </span>
                {isOpen && (
                  <>
                    <span className="flex-1 text-sm font-medium truncate">{cat}</span>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 opacity-50" />
                  </>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className={`border-t border-slate-700/50 p-3 space-y-2 flex-shrink-0`}>
          <button className={`w-full flex items-center ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium`} title={!isOpen ? 'Settings' : ''}>
            <Settings className="w-5 h-5" />
            {isOpen && <span>Settings</span>}
          </button>
          <button className={`w-full flex items-center ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center p-3'} rounded-xl text-slate-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 text-sm font-medium`} title={!isOpen ? 'Logout' : ''}>
            <LogOut className="w-5 h-5" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Bell, Search, Settings, LogOut } from 'lucide-react';
import CoreUISidebar from './CoreUISidebar';
import { UserRole } from '../pbemTypes';

interface CoreUIDashboardLayoutProps {
  userRole: UserRole;
  userName: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  pendingCount?: number;
  children: React.ReactNode;
}

const CoreUIDashboardLayout: React.FC<CoreUIDashboardLayoutProps> = ({
  userRole,
  userName,
  currentPage,
  onNavigate,
  onLogout,
  pendingCount = 0,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Project Director':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'Programme Director':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' };
      case 'Chairman':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const colors = getRoleColor(userRole);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <CoreUISidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        userRole={userRole}
        userName={userName}
        currentPage={currentPage}
        onNavigate={onNavigate}
        pendingCount={pendingCount}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {currentPage === 'dashboard' && 'Dashboard'}
                {currentPage === 'new-project' && 'Create New Project'}
                {currentPage === 'my-projects' && 'My Projects'}
                {currentPage === 'scheduling' && 'Project Scheduling'}
                {currentPage === 'revisions' && 'Revision Requests'}
                {currentPage === 'assigned-projects' && 'Assigned Projects'}
                {currentPage === 'monitoring' && 'Project Monitoring'}
                {currentPage === 'approvals' && 'Approvals'}
                {currentPage === 'reports' && 'Reports'}
                {currentPage === 'all-projects' && 'All Projects'}
                {currentPage === 'oversight' && 'Project Oversight'}
                {currentPage === 'analytics' && 'Analytics'}
              </h2>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-40"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{userName}</p>
                  <p className={`text-xs font-medium ${colors.text}`}>{userRole}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center font-bold ${colors.text} border ${colors.border}`}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb / Status */}
          <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Last updated: {new Date().toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
              {userRole}
            </span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoreUIDashboardLayout;

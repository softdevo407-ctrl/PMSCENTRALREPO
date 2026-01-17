import React from 'react';
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../pbemTypes';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  active?: boolean;
  onClick: () => void;
}

interface SidebarGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  submenu: SidebarItem[];
}

type SidebarMenuItem = SidebarItem | SidebarGroup;

interface CoreUISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: UserRole;
  userName: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  pendingCount?: number;
  onLogout: () => void;
}

const CoreUISidebar: React.FC<CoreUISidebarProps> = ({
  isOpen,
  onToggle,
  userRole,
  userName,
  currentPage,
  onNavigate,
  pendingCount = 0,
  onLogout,
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(['generics']);

  const isGroup = (item: SidebarMenuItem): item is SidebarGroup => {
    return 'submenu' in item;
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const getSidebarItems = (): SidebarMenuItem[] => {
    const baseItems: SidebarItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        onClick: () => onNavigate('dashboard'),
      },
    ];

    if (userRole === 'Project Director') {
      return [
        ...baseItems,
        // {
        //   id: 'new-project',
        //   label: 'New Project',
        //   icon: <Plus className="w-5 h-5" />,
        //   onClick: () => onNavigate('new-project'),
        // },
        {
          id: 'my-projects',
          label: 'My Projects',
          icon: <FileText className="w-5 h-5" />,
          onClick: () => onNavigate('my-projects'),
        },
        {
          id: 'scheduling',
          label: 'Project Scheduling',
          icon: <ClipboardList className="w-5 h-5" />,
          onClick: () => onNavigate('scheduling'),
        },
        {
          id: 'revisions',
          label: 'Revision Requests',
          icon: <CheckSquare className="w-5 h-5" />,
          badge: pendingCount > 0 ? pendingCount.toString() : undefined,
          onClick: () => onNavigate('revisions'),
        },
      ];
    } else if (userRole === 'Programme Director') {
      return [
        ...baseItems,
        {
          id: 'assigned-projects',
          label: 'Assigned Projects',
          icon: <FileText className="w-5 h-5" />,
          onClick: () => onNavigate('assigned-projects'),
        },
        {
          id: 'monitoring',
          label: 'Project Monitoring',
          icon: <LayoutDashboard className="w-5 h-5" />,
          onClick: () => onNavigate('monitoring'),
        },
        {
          id: 'approvals',
          label: 'Approvals',
          icon: <CheckSquare className="w-5 h-5" />,
          badge: pendingCount > 0 ? pendingCount.toString() : undefined,
          onClick: () => onNavigate('approvals'),
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: <ClipboardList className="w-5 h-5" />,
          onClick: () => onNavigate('reports'),
        },
      ];
    } else if (userRole === 'Admin') {
      return [
        ...baseItems,
        {
          id: 'generics',
          label: 'Generics',
          icon: <Settings className="w-5 h-5" />,
          submenu: [
            {
              id: 'programme-offices',
              label: 'Programme Offices',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('programme-offices'),
            },
            {
              id: 'programme-types',
              label: 'Programme Types',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('programme-types'),
            },
            {
              id: 'project-types',
              label: 'Project Types',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('project-types'),
            },
            {
              id: 'project-activities',
              label: 'Project Activities',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('project-activities'),
            },
            {
              id: 'project-categories',
              label: 'Project Categories',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('project-categories'),
            },
            {
              id: 'project-milestones',
              label: 'Project Milestones',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('project-milestones'),
            },
            {
              id: 'project-phases-generic',
              label: 'Project Phases',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('project-phases-generic'),
            },
            {
              id: 'budget-centre-project-codes',
              label: 'Budget  Codes',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('budget-centre-project-codes'),
            },
            {
              id: 'sanctioning-authorities',
              label: 'Sanctioning Auth',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('sanctioning-authorities'),
            },
            {
              id: 'employee-details',
              label: 'Employee Details',
              icon: <Users className="w-5 h-5" />,
              onClick: () => onNavigate('employee-details'),
            },
            {
              id: 'project-status-codes',
              label: 'Project StatCodes',
              icon: <CheckSquare className="w-5 h-5" />,
              onClick: () => onNavigate('project-status-codes'),
            },
            {
              id: 'project-definition',
              label: 'Project Definitions',
              icon: <FileText className="w-5 h-5" />,
              onClick: () => onNavigate('project-definition'),
            },
          ],
        },
        {
          id: 'role-management',
          label: 'Role Management',
          icon: <Users className="w-5 h-5" />,
          onClick: () => onNavigate('role-management'),
        },
        {
          id: 'approvals',
          label: 'Approvals',
          icon: <CheckSquare className="w-5 h-5" />,
          badge: pendingCount > 0 ? pendingCount.toString() : undefined,
          onClick: () => onNavigate('approvals'),
        },
      ];
    } else if (userRole === 'Chairman') {
      return [
        ...baseItems,
        {
          id: 'all-projects',
          label: 'All Projects',
          icon: <FileText className="w-5 h-5" />,
          onClick: () => onNavigate('all-projects'),
        },
        {
          id: 'oversight',
          label: 'Project Oversight',
          icon: <Users className="w-5 h-5" />,
          onClick: () => onNavigate('oversight'),
        },
        {
          id: 'approvals',
          label: 'Approvals',
          icon: <CheckSquare className="w-5 h-5" />,
          badge: pendingCount > 0 ? pendingCount.toString() : undefined,
          onClick: () => onNavigate('approvals'),
        },
        {
          id: 'analytics',
          label: 'Analytics',
          icon: <LayoutDashboard className="w-5 h-5" />,
          onClick: () => onNavigate('analytics'),
        },
      ];
    }

    return baseItems;
  };

  const sidebarItems = getSidebarItems();

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'from-orange-600 to-orange-800';
      case 'Project Director':
        return 'from-blue-600 to-blue-800';
      case 'Programme Director':
        return 'from-purple-600 to-purple-800';
      case 'Chairman':
        return 'from-red-600 to-red-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white w-64 transition-all duration-300 z-40 flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className={`bg-gradient-to-r ${getRoleColor(userRole)} p-6 shadow-lg`}>
          <h2 className="text-2xl font-bold">PMS</h2>
          <p className="text-sm text-gray-200 mt-1">Project Budget System</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getRoleColor(userRole)} flex items-center justify-center font-bold`}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs text-gray-400">{userRole}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                {isGroup(item) ? (
                  <>
                    <button
                      onClick={() => toggleGroup(item.id)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedGroups.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedGroups.includes(item.id) && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.submenu.map((subitem) => (
                          <li key={subitem.id}>
                            <button
                              onClick={() => {
                                subitem.onClick();
                                if (window.innerWidth < 1024) onToggle();
                              }}
                              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all text-sm ${
                                currentPage === subitem.id
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {subitem.icon}
                                <span className="font-medium">{subitem.label}</span>
                              </div>
                              {subitem.badge && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  {subitem.badge}
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => {
                      item.onClick();
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-white hover:bg-red-600/20 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-30"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default CoreUISidebar;

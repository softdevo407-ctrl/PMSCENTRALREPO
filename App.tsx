
import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory, ProjectStatus } from './src/types';
import { UserRole } from './src/pbemTypes';
import { useAuth } from './src/hooks/useAuth';
import { authService } from './src/services/authService';
import Dashboard from './src/components/Dashboard';
import ProjectDetail from './src/components/ProjectDetail';
import ProjectCard from './src/components/ProjectCard';
import Sidebar from './src/components/Sidebar';
import RoleSelector from './src/components/RoleSelector';
import PBEMSDashboard from './src/components/PBEMSDashboard';
import StartPage from './src/components/StartPage';
import CoreUIDashboardLayout from './src/components/CoreUIDashboardLayout';
import ProjectDirectorDashboard from './src/components/ProjectDirectorDashboard';
import ProgrammeDirectorDashboard from './src/components/ProgrammeDirectorDashboard';
import ChairmanDashboard from './src/components/ChairmanDashboard';
import { NewProjectPage } from './src/components/pages/NewProjectPage';
import { MyProjectsPage } from './src/components/pages/MyProjectsPage';
import { ProjectSchedulingPage } from './src/components/pages/ProjectSchedulingPage';
import { RevisionsPage } from './src/components/pages/RevisionsPage';
import { AssignedProjectsPage } from './src/components/pages/AssignedProjectsPage';
import { MonitoringPage } from './src/components/pages/MonitoringPage';
import { ApprovalsPage } from './src/components/pages/ApprovalsPage';
import { OversightPage } from './src/components/pages/OversightPage';
import { AnalyticsPage } from './src/components/pages/AnalyticsPage';
import { ReportsPage } from './src/components/pages/ReportsPage';
import { RoleManagementPage } from './src/components/pages/RoleManagementPage';
import { ProgrammeOfficeManagementPage } from './src/components/pages/ProgrammeOfficeManagementPage';
import { ProgrammeTypeManagementPage } from './src/components/pages/ProgrammeTypeManagementPage';
import { ProjectTypeManagementPage } from './src/components/pages/ProjectTypeManagementPage';
import { ProjectActivityManagementPage } from './src/components/pages/ProjectActivityManagementPage';
import { ProjectCategoryManagementPage } from './src/components/pages/ProjectCategoryManagementPage';
import { ProjectMilestoneManagementPage } from './src/components/ProjectMilestoneManagementPage';
import { ProjectPhaseGenericManagementPage } from './src/components/ProjectPhaseGenericManagementPage';
import { BudgetCentreProjectCodeManagementPage } from './src/components/pages/BudgetCentreProjectCodeManagementPage';
import ProjectDefinitionPage from './src/components/pages/ProjectDefinitionPage';
import { SanctioningAuthorityManagementPage } from './src/components/pages/SanctioningAuthorityManagementPage';
import { EmployeeDetailsManagementPage } from './src/components/pages/EmployeeDetailsManagementPage';
import { ProjectStatusCodeManagementPage } from './src/components/pages/ProjectStatusCodeManagementPage';
import { 
  ArrowLeft, 
  Plus, 
  Bell,
  Menu,
  Loader2,
  LogOut,
  Settings
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:7080/api/projects';

type View = 'DASHBOARD' | 'CATEGORY_DETAIL' | 'PROJECT_DETAIL' | 'PMS';
type AppMode = 'BUDGET' | 'PMS' | 'START' | 'LEGACY_PMS';

const App: React.FC = () => {
  const { user, logout } = useAuth();
  const [appMode, setAppMode] = useState<AppMode>('START');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Budget Dashboard State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage on app mount
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser && savedUser.role) {
      // Map backend role names to frontend role names
      const roleMap: { [key: string]: UserRole } = {
        'ADMIN': 'Admin',
        'PROJECT_DIRECTOR': 'Project Director',
        'PROGRAMME_DIRECTOR': 'Programme Director',
        'CHAIRMAN': 'Chairman'
      };
      
      const mappedRole = roleMap[savedUser.role] || savedUser.role;
      setUserRole(mappedRole as UserRole);
      setCurrentUserName(savedUser.fullName);
      setAppMode('PMS');
    }
    setIsInitialized(true);
  }, []);

  // Sync user from authentication context when logged in
  useEffect(() => {
    if (!isInitialized) return;
    
    if (user && user.role) {
      // Map backend role names to frontend role names
      const roleMap: { [key: string]: UserRole } = {
        'ADMIN': 'Admin',
        'PROJECT_DIRECTOR': 'Project Director',
        'PROGRAMME_DIRECTOR': 'Programme Director',
        'CHAIRMAN': 'Chairman'
      };
      
      const mappedRole = roleMap[user.role] || user.role;
      setUserRole(mappedRole as UserRole);
      setCurrentUserName(user.fullName);
      setAppMode('PMS');
    }
  }, [user, isInitialized]);

  // Fetch all projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backend connection error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToCategory = (category: ProjectCategory) => {
    setSelectedCategory(category);
    setCurrentView('CATEGORY_DETAIL');
  };

  const navigateToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('PROJECT_DETAIL');
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${updatedProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });
      if (!response.ok) throw new Error('Update failed');
      setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    } catch (err) {
      alert("Failed to save changes to database.");
    }
  };

  const handleAddProject = async (category: ProjectCategory) => {
    const name = prompt("Enter project name:");
    if (!name) return;
    const budgetStr = prompt("Enter total budget ($):") || "0";
    const budget = parseFloat(budgetStr);
    
    const newProjectPayload = {
      name,
      category,
      totalBudget: budget,
      expenditure: 0,
      status: ProjectStatus.ON_TRACK,
      description: "New project created.",
      milestones: []
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProjectPayload),
      });
      if (!response.ok) throw new Error('Creation failed');
      const savedProject = await response.json();
      setProjects(prev => [...prev, savedProject]);
      navigateToProject(savedProject.id);
    } catch (err) {
      alert("Error saving project to database.");
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const categoryProjects = projects.filter(p => p.category === selectedCategory);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="inline-block p-4 bg-white rounded-full shadow-2xl mb-6">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Initializing PMS</h2>
        <p className="text-slate-500">Loading your project data...</p>
      </div>
    </div>
  );

  // START PAGE - First load
  if (appMode === 'START') {
    return (
      <StartPage
        onGetStarted={() => setAppMode('PMS')}
      />
    );
  }

  // PMS Mode with CoreUI
  if (appMode === 'PMS') {
    // Show start page or role selector
    if (!userRole || !currentUserName) {
      return (
        <StartPage
          onGetStarted={() => {
            // Switch to role selector by using LEGACY_PMS mode
            setAppMode('LEGACY_PMS');
          }}
          onLoginSuccess={(fullName: string, role: string) => {
            // Map backend role names to frontend role names
            const roleMap: { [key: string]: UserRole } = {
              'PROJECT_DIRECTOR': 'Project Director',
              'PROGRAMME_DIRECTOR': 'Programme Director',
              'CHAIRMAN': 'Chairman'
            };
            
            const mappedRole = roleMap[role] || role;
            setUserRole(mappedRole as UserRole);
            setCurrentUserName(fullName);
          }}
        />
      );
    }

    // Show CoreUI Dashboard based on role
    return (
      <CoreUIDashboardLayout
        userRole={userRole}
        userName={currentUserName}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={() => {
          logout();
          setUserRole(null);
          setCurrentUserName(null);
          setAppMode('START');
        }}
      >
        {/* ADMIN PAGES */}
        {currentPage === 'dashboard' && userRole === 'Admin' && (
          <ChairmanDashboard 
            userName={currentUserName}
            onNavigate={setCurrentPage} 
          />
        )}
        {currentPage === 'role-management' && userRole === 'Admin' && (
          <RoleManagementPage />
        )}
        {currentPage === 'programme-offices' && userRole === 'Admin' && (
          <ProgrammeOfficeManagementPage userName={currentUserName} />
        )}
        {currentPage === 'programme-types' && userRole === 'Admin' && (
          <ProgrammeTypeManagementPage userName={currentUserName} />
        )}
        {currentPage === 'project-types' && userRole === 'Admin' && (
          <ProjectTypeManagementPage userName={currentUserName} />
        )}
        {currentPage === 'project-activities' && userRole === 'Admin' && (
          <ProjectActivityManagementPage userName={currentUserName} />
        )}
        {currentPage === 'project-categories' && userRole === 'Admin' && (
          <ProjectCategoryManagementPage userName={currentUserName} />
        )}
        {currentPage === 'project-milestones' && userRole === 'Admin' && (
          <ProjectMilestoneManagementPage userName={currentUserName} />
        )}
        {currentPage === 'project-phases-generic' && userRole === 'Admin' && (
          <ProjectPhaseGenericManagementPage userName={currentUserName} />
        )}
        {currentPage === 'budget-centre-project-codes' && userRole === 'Admin' && (
          <BudgetCentreProjectCodeManagementPage userName={currentUserName} />
        )}
        {currentPage === 'sanctioning-authorities' && userRole === 'Admin' && (
          <SanctioningAuthorityManagementPage userName={currentUserName} />
        )}
        {currentPage === 'employee-details' && userRole === 'Admin' && (
          <EmployeeDetailsManagementPage userName={currentUserName} />
        )}
        {currentPage === 'project-status-codes' && userRole === 'Admin' && (
          <ProjectStatusCodeManagementPage userName={currentUserName} />
        )}
        {currentPage === 'project-definition' && userRole === 'Admin' && (
          <ProjectDefinitionPage />
        )}

        {/* PROJECT DIRECTOR PAGES */}
        {currentPage === 'dashboard' && userRole === 'Project Director' && (
          <ProjectDirectorDashboard
            userName={currentUserName}
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'new-project' && userRole === 'Project Director' && (
          <ProjectDefinitionPage autoOpenForm={true} />
        )}
        {currentPage === 'my-projects' && userRole === 'Project Director' && (
          <MyProjectsPage userName={currentUserName} />
        )}
        {currentPage === 'scheduling' && userRole === 'Project Director' && (
          <ProjectSchedulingPage userName={currentUserName} />
        )}
        {currentPage === 'revisions' && userRole === 'Project Director' && (
          <RevisionsPage userName={currentUserName} userRole={userRole} />
        )}

        {/* PROGRAMME DIRECTOR PAGES */}
        {currentPage === 'dashboard' && userRole === 'Programme Director' && (
          <ProgrammeDirectorDashboard
            userName={currentUserName}
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'assigned-projects' && userRole === 'Programme Director' && (
          <AssignedProjectsPage userName={currentUserName} />
        )}
        {currentPage === 'monitoring' && userRole === 'Programme Director' && (
          <MonitoringPage userName={currentUserName} />
        )}
        {currentPage === 'approvals' && userRole === 'Programme Director' && (
          <ApprovalsPage userName={currentUserName} userRole={userRole} />
        )}
        {currentPage === 'reports' && userRole === 'Programme Director' && (
          <ReportsPage userName={currentUserName} />
        )}

        {/* CHAIRMAN PAGES */}
        {currentPage === 'dashboard' && userRole === 'Chairman' && (
          <ChairmanDashboard 
            userName={currentUserName}
            onNavigate={setCurrentPage} 
          />
        )}
        {currentPage === 'all-projects' && userRole === 'Chairman' && (
          <OversightPage userName={currentUserName} />
        )}
        {currentPage === 'oversight' && userRole === 'Chairman' && (
          <OversightPage userName={currentUserName} />
        )}
        {currentPage === 'approvals' && userRole === 'Chairman' && (
          <ApprovalsPage userName={currentUserName} userRole={userRole} />
        )}
        {currentPage === 'analytics' && userRole === 'Chairman' && (
          <AnalyticsPage userName={currentUserName} />
        )}
      </CoreUIDashboardLayout>
    );
  }

  // LEGACY PMS MODE - Original role selector
  if (appMode === 'LEGACY_PMS') {
    return (
      <RoleSelector
        onRoleSelect={(role, userName) => {
          setUserRole(role);
          setCurrentUserName(userName);
          setAppMode('PMS');
        }}
        onLogout={() => {
          setUserRole(null);
          setCurrentUserName(null);
          setAppMode('START');
        }}
      />
    );
  }

  // Budget Dashboard Mode (Legacy)
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentView={currentView as 'DASHBOARD' | 'CATEGORY_DETAIL' | 'PROJECT_DETAIL'}
        selectedCategory={selectedCategory}
        onDashboardClick={() => setCurrentView('DASHBOARD')}
        onCategoryClick={navigateToCategory}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">PMS Dashboard</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-4">
              {error && (
                <span className="text-xs font-semibold bg-red-100 text-red-700 px-3 py-1.5 rounded-lg">
                  Backend Offline
                </span>
              )}
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">Budget Manager</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm border-2 border-blue-200 shadow-sm">
                  PB
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {currentView === 'DASHBOARD' && (
                <Dashboard
                  projects={projects}
                  onCategoryClick={navigateToCategory}
                  onAddProject={handleAddProject}
                />
              )}

              {currentView === 'CATEGORY_DETAIL' && selectedCategory && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setCurrentView('DASHBOARD')}
                        className="p-2.5 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all group"
                      >
                        <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
                      </button>
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900">{selectedCategory}</h1>
                        <p className="text-sm text-blue-600 font-medium">All projects in this sector</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddProject(selectedCategory)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg shadow-md transition-all font-semibold text-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Project
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={navigateToProject}
                      />
                    ))}
                  </div>
                </div>
              )}

              {currentView === 'PROJECT_DETAIL' && selectedProject && (
                <ProjectDetail
                  project={selectedProject}
                  onBack={() =>
                    setCurrentView(selectedCategory ? 'CATEGORY_DETAIL' : 'DASHBOARD')
                  }
                  onUpdate={handleUpdateProject}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

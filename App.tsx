
import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory, ProjectStatus } from './types';
import { CATEGORY_ICONS } from './constants';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import ProjectCard from './components/ProjectCard';
import { 
  ArrowLeft, 
  Plus, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronRight,
  Menu,
  X,
  Loader2
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api/projects';

type View = 'DASHBOARD' | 'CATEGORY_DETAIL' | 'PROJECT_DETAIL';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Initializing AstraScope...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <aside className={`bg-[#1e293b] text-slate-300 w-64 fixed inset-y-0 left-0 transform transition-transform duration-200 z-50 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
             <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AstraScope</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div 
            onClick={() => setCurrentView('DASHBOARD')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${currentView === 'DASHBOARD' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-semibold">Overview</span>
          </div>

          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Sectors
          </div>
          {Object.values(ProjectCategory).map(cat => (
            <div 
              key={cat}
              onClick={() => navigateToCategory(cat)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all group ${selectedCategory === cat && currentView === 'CATEGORY_DETAIL' ? 'bg-slate-700 text-white' : 'hover:bg-slate-800'}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 group-hover:text-blue-400">{CATEGORY_ICONS[cat]}</span>
                <span className="text-sm truncate max-w-[120px]">{cat}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-slate-600">
              {isSidebarOpen ? <X /> : <Menu />}
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 rounded-lg pl-10 pr-4 py-1.5 text-sm w-80 transition-all outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {error && <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded">DB Offline</span>}
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
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
                    <button onClick={() => setCurrentView('DASHBOARD')} className="p-2 hover:bg-white rounded-xl border border-slate-200 transition-all">
                      <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">{selectedCategory}</h1>
                      <p className="text-sm text-slate-500">Records from PostgreSQL</p>
                    </div>
                  </div>
                  <button onClick={() => handleAddProject(selectedCategory)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-md transition-all font-semibold text-sm">
                    <Plus className="w-4 h-4" /> New Entry
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProjects.map(project => (
                    <ProjectCard key={project.id} project={project} onClick={navigateToProject} />
                  ))}
                </div>
              </div>
            )}

            {currentView === 'PROJECT_DETAIL' && selectedProject && (
              <ProjectDetail 
                project={selectedProject} 
                onBack={() => setCurrentView(selectedCategory ? 'CATEGORY_DETAIL' : 'DASHBOARD')}
                onUpdate={handleUpdateProject}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

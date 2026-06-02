import React, { useState, useEffect } from 'react';
import { ViewType, Client, Project } from './types';
import { mockClients, mockProjects } from './mockData';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import { ClientsView, ProjectsView, InvoicesView, SettingsView } from './components/ExtraViews';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check for active authenticated persistence session token on startup
  useEffect(() => {
    const savedSession = localStorage.getItem('assessmax_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.email && parsed.name) {
          setCurrentUserEmail(parsed.email);
          setCurrentUserName(parsed.name);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Could not restore session', err);
      }
    }
  }, []);

  // Trigger floating alert feedback
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleDeleteProject = (id: string) => {
    const projectToDelete = projects.find((p) => p.id === id);
    if (!projectToDelete) return;

    setProjects(projects.filter((p) => p.id !== id));
    
    // Decrement corresponding client project count
    setClients(
      clients.map((c) =>
        c.name === projectToDelete.clientName
          ? { ...c, projectsCount: Math.max(0, c.projectsCount - 1) }
          : c
      )
    );

    setToastMessage(`Project file "${projectToDelete.name}" was successfully decommissioned.`);
  };

  const handleCreateProject = (newProj: { name: string; clientName: string; drawingTypes: string[]; floorsCount: number }) => {
    const drawingCount = newProj.drawingTypes.length;
    // Calculate simulated standard cost dynamically based on drawing layers uploaded, scaled by number of floors
    const simulatedCost = drawingCount * 8518670 * newProj.floorsCount; 

    const newlyCreated: Project = {
      id: `proj-${Date.now()}`,
      name: newProj.name,
      clientName: newProj.clientName,
      date: 'Today, ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      drawingType: newProj.drawingTypes[0] || 'CAD Layout',
      value: simulatedCost,
      status: 'Success',
      floorsCount: newProj.floorsCount
    };

    setProjects([newlyCreated, ...projects]);

    // Track statistics for selected developers client
    setClients(
      clients.map((c) =>
        c.name === newProj.clientName
          ? { ...c, projectsCount: c.projectsCount + 1 }
          : c
      )
    );

    setCurrentView('dashboard');
    setToastMessage(`Drawing estimation completed! Added "${newProj.name}" successfully.`);
  };

  const handleAddClient = (newClient: Client) => {
    setClients([...clients, newClient]);
    setToastMessage(`New client developer "${newClient.name}" successfully onboarded.`);
  };

  // View router switcher
  const renderMainWorkspace = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            projects={projects}
            onStartNewEstimation={() => setCurrentView('new-estimation')}
            onDeleteProject={handleDeleteProject}
          />
        );
      case 'new-estimation':
        return (
          <UploadView
            clients={clients}
            onCancel={() => setCurrentView('dashboard')}
            onSubmit={handleCreateProject}
          />
        );
      case 'clients':
        return (
          <ClientsView
            clients={clients}
            onAddClient={handleAddClient}
          />
        );
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
          />
        );
      case 'invoices':
        return (
          <InvoicesView projects={projects} />
        );
      case 'settings':
        return (
          <SettingsView />
        );
      default:
        return (
          <DashboardView
            projects={projects}
            onStartNewEstimation={() => setCurrentView('new-estimation')}
            onDeleteProject={handleDeleteProject}
          />
        );
    }
  };

  // VIEW 1: Login transition if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={(email, name) => {
          setCurrentUserEmail(email);
          setCurrentUserName(name);
          setIsAuthenticated(true);
          try {
            localStorage.setItem('assessmax_session', JSON.stringify({ email, name }));
          } catch (err) {
            console.error('Could not save session storage', err);
          }
        }}
      />
    );
  }

  // Double Layout viewport matching side-by-side structures (View 2 & View 3)
  return (
    <div className="flex bg-[#f8f9fc] min-h-screen text-slate-800 font-sans relative antialiased overflow-hidden select-none">
      
      {/* Dynamic Toast Feedback Overlay block */}
      {toastMessage && (
        <div className="absolute bottom-6 right-6 bg-[#0f1021] border border-slate-800 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-slate-200 text-xs font-semibold max-w-sm animate-fade-in z-50">
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400">
            ✓
          </div>
          <span className="flex-1 text-slate-200">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-500 hover:text-slate-300 font-bold ml-2 cursor-pointer focus:outline-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main sidebar component */}
      <Sidebar
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view)}
        onSignOut={() => {
          setIsAuthenticated(false);
          setCurrentUserEmail('');
          setCurrentUserName('');
          try {
            localStorage.removeItem('assessmax_session');
          } catch (err) {
            console.error('Failed to clear session storage', err);
          }
        }}
        userEmail={currentUserEmail}
        userName={currentUserName}
      />

      {/* Main center workspace frame */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {renderMainWorkspace()}
      </main>

    </div>
  );
}

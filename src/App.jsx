import React, { useState, useEffect } from 'react';
import { mockClients, mockProjects } from './mockData';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import { ClientsView, ProjectsView, InvoicesView, SettingsView, DEFAULT_CORE_RATES, DEFAULT_MATERIAL_RATES, DEFAULT_LABOUR_RATES } from './components/ExtraViews';
import ProjectDetailsView from './components/ProjectDetailsView';
import { generateDefaultQuantities, calculateProjectValuation } from './utils';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('assessmax_projects');
    return saved ? JSON.parse(saved) : mockProjects;
  });
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('assessmax_clients');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize mock clients with their corresponding project counts
    return mockClients.map(c => ({
      ...c,
      projectsCount: mockProjects.filter(p => p.clientName === c.name).length
    }));
  });

  // Track state changes to preserve client-side offline storage
  useEffect(() => {
    localStorage.setItem('assessmax_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('assessmax_clients', JSON.stringify(clients));
  }, [clients]);
  const [toastMessage, setToastMessage] = useState(null);

  // Check for active authenticated persistence session token on startup
  useEffect(() => {
    const savedSession = localStorage.getItem('assessmax_session');
    const token = localStorage.getItem('auth_token');
    if (savedSession && token) {
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
    } else {
      localStorage.removeItem('assessmax_session');
      localStorage.removeItem('auth_token');
    }
  }, []);

  const handleSessionExpired = () => {
    setIsAuthenticated(false);
    setCurrentUserEmail('');
    setCurrentUserName('');
    localStorage.removeItem('assessmax_session');
    localStorage.removeItem('auth_token');
    setToastMessage('Your session has expired. Please log in again.');
  };

  // Zero-latency backend sync offline emulation loop
  useEffect(() => {
    // Ensure accurate initial values of projects count on client list based on projects list
    setClients((prev) =>
      prev.map((c) => ({
        ...c,
        projectsCount: projects.filter((p) => p.clientName === c.name).length
      }))
    );
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

  const handleDeleteProject = (id) => {
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

  const handleCreateProject = (newProj) => {
    // 1. Fetch current global default rates from localStorage or ExtraViews fallbacks
    const savedCore = localStorage.getItem('assessmax_core_rates');
    const savedMaterial = localStorage.getItem('assessmax_material_rates');
    const savedLabour = localStorage.getItem('assessmax_labour_rates');

    const coreRates = savedCore ? JSON.parse(savedCore) : DEFAULT_CORE_RATES;
    const materialRates = savedMaterial ? JSON.parse(savedMaterial) : DEFAULT_MATERIAL_RATES;
    const labourRates = savedLabour ? JSON.parse(savedLabour) : DEFAULT_LABOUR_RATES;

    // 2. Generate project specific quantities from drawing types selected
    const quantities = generateDefaultQuantities(newProj.drawingTypes, newProj.floorsCount);

    // 3. Compute cost dynamically based on quantities and loaded default rates
    const calculatedValue = calculateProjectValuation(quantities, coreRates);

    const newlyCreated = {
      id: `proj-${Date.now()}`,
      name: newProj.name,
      clientName: newProj.clientName,
      date: 'Today, ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      drawingType: newProj.drawingTypes[0] || 'CAD Layout',
      value: calculatedValue > 0 ? calculatedValue : (newProj.drawingTypes.length * 8500000 * newProj.floorsCount),
      status: 'Success',
      floorsCount: newProj.floorsCount,
      coreRates: coreRates,
      materialRates: materialRates,
      labourRates: labourRates,
      quantities: quantities
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

  const handleUpdateProject = (updatedProj) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
  };

  const handleAddClient = (newClient) => {
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
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setCurrentView('project-details');
            }}
          />
        );
      case 'new-estimation':
        return (
          <UploadView
            clients={clients}
            onCancel={() => setCurrentView('dashboard')}
            onSubmit={handleCreateProject}
            onSessionExpired={() => {
              setIsAuthenticated(false);
              setCurrentUserEmail('');
              setCurrentUserName('');
              localStorage.removeItem('assessmax_session');
              localStorage.removeItem('auth_token');
            }}
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
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setCurrentView('project-details');
            }}
          />
        );
      case 'project-details':
        const activeProj = projects.find(p => p.id === selectedProjectId);
        if (!activeProj) {
          setCurrentView('dashboard');
          return null;
        }
        // Lazily self-heal project rates & quantities if loaded without them
        if (!activeProj.coreRates) {
          const savedCore = localStorage.getItem('assessmax_core_rates');
          const savedMaterial = localStorage.getItem('assessmax_material_rates');
          const savedLabour = localStorage.getItem('assessmax_labour_rates');
          activeProj.coreRates = savedCore ? JSON.parse(savedCore) : DEFAULT_CORE_RATES;
          activeProj.materialRates = savedMaterial ? JSON.parse(savedMaterial) : DEFAULT_MATERIAL_RATES;
          activeProj.labourRates = savedLabour ? JSON.parse(savedLabour) : DEFAULT_LABOUR_RATES;
          activeProj.quantities = generateDefaultQuantities([activeProj.drawingType], activeProj.floorsCount || 1);
        }
        return (
          <ProjectDetailsView
            project={activeProj}
            onUpdateProject={handleUpdateProject}
            onBack={() => setCurrentView('projects')}
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
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setCurrentView('project-details');
            }}
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
    <div className="flex bg-[#f8f9fc] min-h-screen text-slate-800 font-sans relative antialiased overflow-hidden select-none w-full">
      
      {/* Dynamic Toast Feedback Overlay block */}
      {toastMessage && (
        <div className="absolute bottom-6 right-6 bg-[#0f1021] border border-slate-800 p-4 rounded-xl shadow-2xl flex items-center gap-3 text-slate-200 text-xs font-semibold max-w-sm animate-fade-in z-50">
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500 flex items-center justify-center text-emerald-400">
            ✓
          </div>
          <span className="flex-1 text-slate-200">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-500 hover:text-slate-300 font-bold ml-2 cursor-pointer focus:outline-none bg-transparent border-0 outline-none"
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
            localStorage.removeItem('auth_token');
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

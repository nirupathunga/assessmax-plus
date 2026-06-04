import React, { useState } from 'react';
import { Client, Project } from '../types';
import { formatINR } from '../mockData';

// ---------------- CLIENTS VIEW ----------------
interface ClientsViewProps {
  clients: Client[];
  onAddClient: (newClient: Client) => void;
}

export function ClientsView({ clients, onAddClient }: ClientsViewProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !email.trim()) return;

    onAddClient({
      id: `c-${Date.now()}`,
      name,
      contact,
      email,
      projectsCount: 0
    });
    setName('');
    setContact('');
    setEmail('');
    setShowAddForm(false);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Clients Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage construction firms, developers, and partners</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gradient-to-r from-violet-600 to-orange-500 hover:brightness-110 active:scale-95 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl cursor-pointer transition-all"
        >
          {showAddForm ? 'Close Registration Form' : 'Add Client'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white border border-slate-200/60 p-6 rounded-xl shadow-sm mb-6 max-w-xl animate-fade-in">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Add Developer Client</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-[10px] font-bold mb-1.5 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Development Corp"
                className="w-full bg-slate-50 border border-slate-220 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-[10px] font-bold mb-1.5 uppercase tracking-wider">Contact Person</label>
                <input
                   type="text"
                   required
                   value={contact}
                   onChange={(e) => setContact(e.target.value)}
                   placeholder="John Doe"
                   className="w-full bg-slate-50 border border-slate-220 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 text-[10px] font-bold mb-1.5 uppercase tracking-wider">Contact Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full bg-slate-50 border border-slate-220 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-lg cursor-pointer transition-colors"
            >
              Add Client
            </button>
          </form>
        </div>
      )}

      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clients.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-base leading-snug">{c.name}</h3>
                  <span className="bg-orange-50 text-orange-600 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-orange-100">
                    {c.projectsCount} Project(s)
                  </span>
                </div>
                <div className="space-y-1 pt-2 text-xs text-slate-500 font-mono">
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Primary Liaison: <strong className="text-slate-700 font-sans font-semibold">{c.contact}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Corporate Contact: <span className="text-slate-700">{c.email}</span>
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">Validated Workspace Client</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200/65 rounded-2xl p-12 text-center max-w-xl mx-auto select-none">
          <p className="text-sm text-slate-500 font-medium">No clients recorded. Click "Add Client" to begin creating your developer ledger.</p>
        </div>
      )}
    </div>
  );
}

// ---------------- PROJECTS VIEW ----------------
interface ProjectsViewProps {
  projects: Project[];
}

export function ProjectsView({ projects }: ProjectsViewProps) {
  return (
    <div className="flex-1 min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Active Workspaces</h1>
        <p className="text-xs text-slate-500 mt-1">Full structural quantity audit files catalog</p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden p-6">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="border border-slate-100 hover:border-slate-200 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-800 text-sm">{p.name}</h3>
                    {p.floorsCount && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-100/50">
                        {p.floorsCount} {p.floorsCount === 1 ? 'Floor' : 'Floors'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span>Client: <strong className="text-slate-600">{p.clientName}</strong></span>
                    <span>•</span>
                    <span>Category: <strong className="text-violet-600">{p.drawingType}</strong></span>
                    <span>•</span>
                    <span>Created: <strong>{p.date}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-6 self-start md:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Estimation cost</span>
                    <strong className="text-slate-800 text-xs font-mono">{formatINR(p.value)}</strong>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-100 uppercase">
                    Validated
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h4 className="font-bold text-slate-600 text-sm">No Projects Processed Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Start a drawing estimation to analyze construction layout files.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- INVOICES VIEW ----------------
interface InvoicesViewProps {
  projects: Project[];
}

export function InvoicesView({ projects }: InvoicesViewProps) {
  // Compute invoices dynamically from the existing logged projects
  const invoicingValue = projects.length * 35000; // Simulated engineering audit fee standard
  
  return (
    <div className="flex-1 min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Invoice Billing Panel</h1>
        <p className="text-xs text-slate-500 mt-1">Service auditing fees and calculations receipts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200/60 p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Total Service Fees</span>
            <div className="text-2xl font-extrabold text-[#f43f5e] mt-1">
              {formatINR(invoicingValue)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#ff7e33] flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-6 rounded-xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Active Standard Cost Limit</span>
            <div className="text-2xl font-extrabold text-[#ff7e33] mt-1">
              {formatINR(projects.reduce((acc, p) => acc + p.value, 0))}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-650 flex items-center justify-center">
            ⏱
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        {projects.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bill ID</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Drawing Project</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valuation Scope Cost</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audit Fee</th>
                <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 text-xs">
              {projects.map((proj, index) => {
                const billId = `INV-2026-${String(index + 1).padStart(3, '0')}`;
                return (
                  <tr key={proj.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-mono font-semibold text-slate-800">{billId}</td>
                    <td className="p-4 font-bold">{proj.name}</td>
                    <td className="p-4 font-mono text-slate-500">{formatINR(proj.value)}</td>
                    <td className="p-4 font-mono font-bold text-violet-700">{formatINR(35000)}</td>
                    <td className="p-4 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Paid
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16V17" />
            </svg>
            <h4 className="font-bold text-slate-600 text-sm">No Invoice Statements Generated</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Add drawings workspaces to calculate auditing billing receipts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- SETTINGS VIEW ----------------
export function SettingsView() {
  return (
    <div className="flex-1 min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Workspace Configuration</h1>
        <p className="text-xs text-slate-500 mt-1">Configure AssessMax workspace defaults, limits, and team access credentials</p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl p-6 shadow-sm space-y-6 max-w-xl">
        <div className="space-y-1 pb-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm">Quantities Valuation Engine Defaults</h3>
          <p className="text-xs text-slate-400">Defaults are applied automatically to new drawings uploads</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 text-[10px] font-bold mb-1.5 uppercase tracking-wider">Default Currency Format</label>
            <select className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline cursor-pointer">
              <option>INR (₹) - Indian Rupee formatting</option>
              <option>USD ($) - US Dollar formatting</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 text-[10px] font-bold mb-1.5 uppercase tracking-wider">Scan Resolution Tolerance</label>
            <input type="range" className="w-full accent-violet-600 cursor-pointer" defaultValue={80} />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>Standard (95% accuracy)</span>
              <span>Ultra Precision (99.8%)</span>
            </div>
          </div>

          <div className="bg-violet-50/50 rounded-lg p-4 border border-violet-100 text-slate-700 space-y-2">
            <h4 className="text-xs font-bold text-violet-900 uppercase">Interactive Subscription</h4>
            <p className="text-xs leading-relaxed text-slate-500">
              Registered license allows unlimited drawing validations up to 25 CAD file layers simultaneous processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

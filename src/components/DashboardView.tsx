import React, { useState } from 'react';
import { Project } from '../types';
import { formatINR } from '../mockData';

interface DashboardViewProps {
  projects: Project[];
  onStartNewEstimation: () => void;
  onDeleteProject?: (id: string) => void;
}

export default function DashboardView({ projects, onStartNewEstimation, onDeleteProject }: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Success' | 'Pending'>('ALL');

  // Filter project arrays based on search keyword & status pill
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.drawingType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans overflow-y-auto">
        {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AssessMax</h1>
            <div className="flex items-center bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider gap-0.5 select-none">
              <span className="w-1.5 h-1.5 bg-violet-600 rounded-full animate-ping" />
              Interactive Workspace
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Upload and estimate project costs from CAD drawings</p>
        </div>

        {/* New estimation button */}
        <button
          onClick={onStartNewEstimation}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white font-semibold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl shadow-lg shadow-violet-500/10 active:scale-95 transition-all self-start cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Start New Estimation
        </button>
      </div>

        {/* Call-to-action banner */}
      <div className="bg-gradient-to-r from-violet-950 to-indigo-900 border border-violet-850 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden mb-8 shadow-xl">
        {/* Background effects */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl translate-x-20 -translate-y-20 pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-violet-300 bg-violet-500/10 px-2 py-1 rounded border border-violet-850">
                New Estimation
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight leading-tight">Start a new project estimation</h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Upload your CAD drawing files to get started. Our estimation engine will analyze the drawings and provide quantity takeoffs and cost estimates.
            </p>
          </div>

          <button
            onClick={onStartNewEstimation}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff7e33] to-[#f43f5e] hover:brightness-110 active:scale-95 text-white font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase shadow-xl cursor-pointer self-start md:self-center transition-all "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Start New Estimation
          </button>
        </div>
      </div>

      {/* Projects table */}
      <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden mb-4">
        {/* Filters */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-800 text-sm">Recent Projects</h3>
            <p className="text-xs text-slate-400">Total {filteredProjects.length} projects</p>
          </div>

          {projects.length > 0 && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search drawings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 bg-slate-50 border border-slate-220 text-slate-700 text-xs rounded-lg pl-8 pr-4 py-2 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 focus:outline-none focus:bg-white transition-all placeholder-slate-400"
                />
              </div>

              {/* Status filters */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg gap-0.5 border border-slate-200">
                {(['ALL', 'Success', 'Pending'] as const).map((filterOpt) => (
                  <button
                    key={filterOpt}
                    onClick={() => setStatusFilter(filterOpt)}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-all cursor-pointer ${
                      statusFilter === filterOpt
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {filterOpt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Table or empty state */}
        {filteredProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Project Name</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Client</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Type</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Cost</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Status</th>
                  {onDeleteProject && (
                    <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((proj) => {
                  return (
                    <tr key={proj.id} className="hover:bg-slate-50/75 transition-colors group">
                      <td className="p-4 text-xs font-semibold text-slate-800 tracking-tight">
                        <div className="font-bold text-slate-800">{proj.name}</div>
                        {proj.floorsCount && (
                          <div className="mt-1">
                            <span className="inline-flex items-center text-[10px] text-violet-700 bg-violet-50 font-bold px-1.5 py-0.5 rounded border border-violet-100/50 uppercase select-none">
                              {proj.floorsCount} {proj.floorsCount === 1 ? 'Floor' : 'Floors'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-600">
                        {proj.clientName}
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {proj.date}
                      </td>
                      <td className="p-4">
                        <span className="bg-violet-50 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded border border-violet-100/60 uppercase">
                          {proj.drawingType}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-800 text-right font-mono">
                        {formatINR(proj.value)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase gap-1 ${
                          proj.status === 'Success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${proj.status === 'Success' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                          {proj.status === 'Success' ? 'Complete' : 'Processing'}
                        </span>
                      </td>
                      {onDeleteProject && (
                        <td className="p-4 text-center">
                          <button
                            onClick={() => onDeleteProject(proj.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.2 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                            title="Remove project"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 select-none">
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4 shadow-inner">
              <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-bold text-slate-705 text-sm mb-1 text-center">No recent projects found</h4>
            <p className="text-xs text-slate-400 max-w-sm text-center">
              Click "Start New Estimation" to begin your first project estimation.
            </p>
            <button
              onClick={onStartNewEstimation}
              className="mt-3 text-xs font-bold text-violet-600 hover:text-indigo-600 uppercase tracking-wider cursor-pointer"
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

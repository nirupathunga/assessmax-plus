import React, { useState } from 'react';
import { formatINR } from '../mockData';

export default function DashboardView({ projects, onStartNewEstimation, onDeleteProject, onSelectProject }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setSearchFilter] = useState('ALL');

  // Compute stats dynamically from the projects array
  const totalValuation = projects.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const completedCount = projects.filter((p) => p.status === 'Success').length;
  const pendingCount = projects.filter((p) => p.status === 'Pending').length;
  const uniqueClients = Array.from(new Set(projects.map((p) => p.clientName))).length;

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.drawingType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans overflow-y-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/60 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="bg-teal-500/10 text-teal-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider select-none border border-teal-500/20">
              Quantities Redistribution Suite
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            Asset Estimation Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-threaded quantities extraction, material takeoff auditing, and IS-code cost valuation.
          </p>
        </div>

        <button
          onClick={onStartNewEstimation}
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-750 text-white font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer self-start lg:self-center"
        >
          <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Onboard New Project
        </button>
      </div>

      {/* Main Interactive Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Metric 1: Total Valuation */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md hover:border-slate-300/80 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-emerald-400" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Cumulative Estimation Size
            </span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xl font-black text-slate-900 tracking-tight font-mono">
              {formatINR(totalValuation)}
            </h4>
            <p className="text-[10px] text-slate-400">Total estimated material value in INR</p>
          </div>
        </div>

        {/* Metric 2: Completed Estimations */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md hover:border-slate-300/80 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Compiled Blueprints
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">
              {completedCount} <span className="text-xs font-medium text-slate-400">Project(s)</span>
            </h4>
            <p className="text-[10px] text-slate-400">Fully validated takeoff reports</p>
          </div>
        </div>

        {/* Metric 3: Active Pipeline */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md hover:border-slate-300/80 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Pending Operations
            </span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <span className="relative flex h-2.5 w-2.5 mr-0.5 mt-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
            </div>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">
              {pendingCount} <span className="text-xs font-medium text-slate-400">Pending</span>
            </h4>
            <p className="text-[10px] text-slate-400">Actively processing or in analysis</p>
          </div>
        </div>

        {/* Metric 4: Unique Client Corporations */}
        <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden group hover:shadow-md hover:border-slate-300/80 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-400" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Developer Corporations
            </span>
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">
              {uniqueClients} <span className="text-xs font-medium text-slate-400">Active</span>
            </h4>
            <p className="text-[10px] text-slate-400">Subscribed developer connections</p>
          </div>
        </div>
      </div>

      {/* Primary Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Recent Projects Table and Workspace controls (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            {/* Header & Smart Actions panel */}
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Estimation Workspaces Catalog
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Total of {filteredProjects.length} records dynamically matching diagnostic filters
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {/* Search Bar Input */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search drawing records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-52 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg pl-8 pr-4 py-2 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none focus:bg-white transition-all placeholder-slate-400 font-medium"
                  />
                </div>

                {/* Status Toggle Pills */}
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200 shrink-0">
                  {['ALL', 'Success', 'Pending'].map((filterOpt) => (
                    <button
                      key={filterOpt}
                      onClick={() => setSearchFilter(filterOpt)}
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-all cursor-pointer ${
                        statusFilter === filterOpt
                          ? 'bg-white text-slate-900 shadow-sm border-b border-slate-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {filterOpt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Takeoff Records Table */}
            {filteredProjects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Project & Category
                      </th>
                      <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Client Entity
                      </th>
                      <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">
                        Takeoff Value
                      </th>
                      <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                        Validation
                      </th>
                      {onDeleteProject && (
                        <th className="py-3.5 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProjects.map((proj) => (
                      <tr
                        key={proj.id}
                        onClick={() => onSelectProject && onSelectProject(proj.id)}
                        className="hover:bg-slate-100/60 transition-colors group cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="font-extrabold text-[#4c3e80] text-xs tracking-tight">
                            {proj.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="bg-teal-500/10 text-teal-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {proj.drawingType}
                            </span>
                            {proj.floorsCount ? (
                              <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-semibold">
                                {proj.floorsCount} {proj.floorsCount === 1 ? 'Floor' : 'Floors'}
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-slate-600">
                          {proj.clientName}
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {proj.date || 'Active Takeoff'}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs font-black font-mono text-slate-900 text-right">
                          {formatINR(proj.value)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase gap-1 ${
                              proj.status === 'Success'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-amber-50 text-amber-705 border border-amber-100'
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                proj.status === 'Success' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                            {proj.status === 'Success' ? 'Success' : 'Pending'}
                          </span>
                        </td>
                        {onDeleteProject && (
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject(proj.id);
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                              title="Delete workspace record"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="p-4 bg-slate-50 border border-slate-100 text-slate-300 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm mb-1">
                  {projects.length === 0 ? 'No Active Workspaces Found' : 'No matches correspond to the query'}
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  {projects.length === 0
                    ? 'Onboard a CAD diagram sheet or plan blueprint to compute real-time structural quantity schedules.'
                    : 'Refine search terms or reset filters to review remaining takeoff projects.'}
                </p>
                {projects.length === 0 && (
                  <button
                    onClick={onStartNewEstimation}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-500 uppercase tracking-wider cursor-pointer"
                  >
                    Onboard First Blueprint
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Structural Modules Pipeline Checklist Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">


          {/* Core Pipeline Status Boards */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                Take-off Module Coverage
              </h4>
              <p className="text-[10px] text-slate-400">
                Core structural components processed inside active blueprints
              </p>
            </div>

            <div className="divide-y divide-slate-100 pt-2 space-y-3">
              {[
                { title: 'Foundation Footing', description: 'Concrete excavations & schedules', checked: completedCount > 0 },
                { title: 'Plinth Beam Grid', description: 'Horizontal structural tie logs', checked: completedCount > 1 },
                { title: 'Ground Floor Beams', description: 'Horizontal distribution schedulers', checked: completedCount > 2 },
                { title: 'Floor Slab Layouts', description: 'Volumetric depth grids', checked: completedCount > 3 },
                { title: 'Columns Structure', description: 'Vertical bars and coordinate schedule', checked: completedCount > 4 },
              ].map((item, index) => (
                <div key={index} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] shrink-0 font-bold ${
                        item.checked
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 border border-slate-200 text-slate-400'
                      }`}
                    >
                      {item.checked ? '✓' : index + 1}
                    </div>

                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${item.checked ? 'text-slate-800' : 'text-slate-500'}`}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{item.description}</p>
                    </div>
                  </div>

                  <div>
                    {item.checked ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-100/60 uppercase select-none shrink-0">
                        Takeoff Active
                      </span>
                    ) : (
                      <span className="bg-slate-105 text-slate-400 text-[8px] font-bold px-2 py-0.5 rounded border border-slate-200/50 uppercase select-none shrink-0">
                        Inoperable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

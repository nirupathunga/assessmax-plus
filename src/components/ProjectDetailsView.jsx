import React, { useState } from 'react';
import { formatINR } from '../mockData';
import { calculateProjectValuation } from '../utils';

export default function ProjectDetailsView({ project, onUpdateProject, onBack }) {
  const [activeTab, setActiveTab] = useState('takeoff');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Safe default initialization of project properties
  const coreRates = project.coreRates || [];
  const materialRates = project.materialRates || [];
  const labourRates = project.labourRates || [];
  const quantities = project.quantities || [];

  const [localCore, setLocalCore] = useState(coreRates);
  const [localMaterial, setLocalMaterial] = useState(materialRates);
  const [localLabour, setLocalLabour] = useState(labourRates);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(null);

  // Sync state if project changes
  React.useEffect(() => {
    setLocalCore(project.coreRates || []);
    setLocalMaterial(project.materialRates || []);
    setLocalLabour(project.labourRates || []);
  }, [project]);

  // Handle saving core rates changes specifically to this project
  const handleRateChange = (category, itemIndex, newRate) => {
    let updatedCore = [...localCore];
    let updatedMaterial = [...localMaterial];
    let updatedLabour = [...localLabour];

    if (category === 'core') {
      updatedCore[itemIndex] = { ...updatedCore[itemIndex], rate: newRate };
      setLocalCore(updatedCore);
    } else if (category === 'material') {
      updatedMaterial[itemIndex] = { ...updatedMaterial[itemIndex], rate: newRate };
      setLocalMaterial(updatedMaterial);
    } else if (category === 'labour') {
      updatedLabour[itemIndex] = { ...updatedLabour[itemIndex], rate: newRate };
      setLocalLabour(updatedLabour);
    }

    // Immediately calculate new valuation and update in parent
    const nextValuation = calculateProjectValuation(quantities, updatedCore);
    
    const updatedProject = {
      ...project,
      coreRates: updatedCore,
      materialRates: updatedMaterial,
      labourRates: updatedLabour,
      value: nextValuation > 0 ? nextValuation : project.value // update the main INR cost valuation
    };

    onUpdateProject(updatedProject);
    triggerSuccessFeedback(`Project rates updated! Cost updated to ${formatINR(updatedProject.value)}.`);
  };

  const triggerSuccessFeedback = (msg) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 3000);
  };

  const getRateForItemName = (itemName) => {
    const exact = localCore.find(r => r.item.toLowerCase() === itemName.toLowerCase());
    return exact && exact.rate !== null ? exact.rate : 0;
  };

  // Filters for searching rates
  const filteredCore = localCore.filter(r => r.item.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredMaterial = localMaterial.filter(r => r.item.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredLabour = localLabour.filter(r => r.item.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans overflow-y-auto w-full">
      {/* Breadcrumb back navigation */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider cursor-pointer bg-transparent border-0 outline-none"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back To Workspaces
        </button>
      </div>

      {/* Hero Header Section */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-violet-200/50">
              Project Workspace
            </span>
            {project.floorsCount && (
              <span className="bg-[#4c3e80]/10 text-[#4c3e80] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {project.floorsCount} {project.floorsCount === 1 ? 'Floor' : 'Floors'}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2.5 font-sans">
            {project.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Client Entity: <strong className="text-slate-700 font-semibold">{project.clientName}</strong> • Drawing Profile: <strong className="text-violet-600 font-semibold">{project.drawingType}</strong>
          </p>
        </div>

        <div className="text-left md:text-right bg-slate-50 border border-slate-150 p-4 rounded-xl min-w-[200px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Estimation Value</span>
          <strong className="text-2xl font-black text-rose-500 font-mono block mt-1">{formatINR(project.value)}</strong>
          <span className="text-[9px] text-[#00cfa5] font-semibold flex items-center gap-1 mt-1 justify-start md:justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00cfa5] animate-pulse" /> Custom Rates Calibrated
          </span>
        </div>
      </div>

      {/* Floating alert bar */}
      {saveSuccessMessage && (
        <div className="mb-6 bg-emerald-50 text-emerald-800 text-xs px-4 py-3 rounded-xl border border-emerald-100 font-semibold flex items-center gap-2 animate-fade-in">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
          {saveSuccessMessage}
        </div>
      )}

      {/* Tab bar header */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('takeoff')}
          className={`pb-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'takeoff'
              ? 'border-violet-600 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📊 Takeoff Breakup
        </button>
        <button
          onClick={() => {
            setActiveTab('core');
            setSearchQuery('');
          }}
          className={`pb-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'core'
              ? 'border-violet-600 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🏷️ Custom Core Rates (rates)
        </button>
        <button
          onClick={() => {
            setActiveTab('unit');
            setSearchQuery('');
          }}
          className={`pb-3 px-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'unit'
              ? 'border-violet-600 text-slate-900 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🧱 Custom Resource Rates (material & labour)
        </button>
      </div>

      {/* Tab Contents: TAKEOFF BREAKUP */}
      {activeTab === 'takeoff' && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-violet-700 p-4 font-semibold text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider">Quantities takeoff & rates multiplication</h2>
                <p className="text-[10px] text-violet-200 font-normal mt-0.5">Calculated by multiplying the blueprint estimated quantity with project-specific custom rates</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," 
                    + "Item,Category,Quantity,Unit,Rate (INR),Subtotal (INR)\n"
                    + quantities.map(e => `"${e.item}","${e.category}",${e.quantity},"${e.unit}",${getRateForItemName(e.item)},${e.quantity * getRateForItemName(e.item)}`).join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", `${project.name.replace(/\s+/g, '_')}_Cost_Breakdown.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer"
              >
                📥 Download Excel Takeoff
              </button>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              {quantities.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item / Structural element</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Quantity</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Unit</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Custom Project Rate</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {quantities.map((row, index) => {
                      const rate = getRateForItemName(row.item);
                      const subtotal = row.quantity * rate;
                      return (
                        <tr key={index} className="hover:bg-violet-50/10">
                          <td className="p-4 font-bold text-slate-800">{row.item}</td>
                          <td className="p-4 text-slate-400 font-semibold uppercase text-[9px] tracking-wider">{row.category}</td>
                          <td className="p-4 font-mono font-bold text-slate-900 text-right">{row.quantity}</td>
                          <td className="p-4 text-slate-500 font-mono text-right">{row.unit}</td>
                          <td className="p-4 font-mono text-slate-600 text-right">{formatINR(rate)}</td>
                          <td className="p-4 font-mono font-black text-violet-700 text-right">{formatINR(subtotal)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-slate-400">No custom structural quantities generated. Using general project estimations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: PROJECT DEFAULT CORE RATES (RATES) */}
      {activeTab === 'core' && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-violet-700 p-4 font-semibold text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider">Custom Project Standard Rates (rates)</h2>
                <p className="text-[10px] text-violet-200 font-normal mt-0.5">Edit these default values to calculate project specific costs. Editing rates here does NOT disturb other projects or main settings.</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-violet-300">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search project rates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-violet-800/40 border border-violet-600 placeholder-violet-300 text-white text-xs rounded-lg pl-8 pr-4 py-2 focus:ring-1 focus:ring-white focus:outline-none focus:bg-violet-800/80 transition-all font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              {filteredCore.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item / Subsystem</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-24">Unit Rate (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {localCore.map((row, index) => {
                      if (searchQuery && !row.item.toLowerCase().includes(searchQuery.toLowerCase())) return null;
                      return (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="p-4 font-semibold text-slate-700">{row.item}</td>
                          <td className="p-4"><span className="font-semibold text-slate-400 bg-slate-100/80 border border-slate-200/50 py-0.5 px-1.5 rounded">{row.unit}</span></td>
                          <td className="p-4 text-right pr-16 whitespace-nowrap">
                            <span className="text-[10px] text-slate-400 font-mono italic mr-2">({formatINR(row.rate || 0)})</span>
                            <input
                              type="number"
                              value={row.rate === null ? '' : row.rate}
                              onChange={(e) => {
                                const val = e.target.value === '' ? null : Number(e.target.value);
                                handleRateChange('core', index, val);
                              }}
                              className="font-black font-mono w-28 bg-slate-50 border border-slate-200 text-slate-800 py-1.5 px-2.5 rounded-lg text-right focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  No matching rates found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Contents: PROJECT CUSTOM MATERIAL & LABOUR RESOURCE RATES */}
      {activeTab === 'unit' && (
        <div className="animate-fade-in space-y-8">
          {/* Material rates */}
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-violet-700 p-4 font-semibold text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider">Custom Material resource costs (material)</h2>
                <p className="text-[10px] text-violet-200 font-normal mt-0.5">Bulk concrete aggregates, timber beams, sealants, cement bags specifically for this project</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-violet-300">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-violet-800/40 border border-violet-600 placeholder-violet-300 text-white text-xs rounded-lg pl-8 pr-4 py-2 focus:ring-1 focus:ring-white focus:outline-none focus:bg-violet-800/80 transition-all font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              {filteredMaterial.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Material item</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-24">Unit Rate (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {localMaterial.map((row, index) => {
                      if (searchQuery && !row.item.toLowerCase().includes(searchQuery.toLowerCase())) return null;
                      return (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="p-4 font-semibold text-slate-700">{row.item}</td>
                          <td className="p-4"><span className="font-semibold text-slate-400 bg-slate-100/80 border border-slate-200/50 py-0.5 px-1.5 rounded">{row.unit}</span></td>
                          <td className="p-4 text-right pr-16 whitespace-nowrap">
                            <span className="text-[10px] text-slate-400 font-mono mr-2">({formatINR(row.rate || 0)})</span>
                            <input
                              type="number"
                              value={row.rate === null ? '' : row.rate}
                              onChange={(e) => {
                                const val = e.target.value === '' ? null : Number(e.target.value);
                                handleRateChange('material', index, val);
                              }}
                              className="font-black font-mono w-28 bg-slate-50 border border-slate-200 text-slate-800 py-1.5 px-2.5 rounded-lg text-right focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  No materials matched category search.
                </div>
              )}
            </div>
          </div>

          {/* Labour rates */}
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-violet-700 p-4 font-semibold text-white">
              <h2 className="text-sm font-bold uppercase tracking-wider">Custom Labor Wage scales (labour)</h2>
              <p className="text-[10px] text-violet-200 font-normal mt-0.5">Specialist bar benders, masons, painters, electricians, engineers specifically for this project</p>
            </div>

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              {filteredLabour.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Labour Role</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Unit</th>
                      <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-24">Daily Wage Scale (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {localLabour.map((row, index) => {
                      if (searchQuery && !row.item.toLowerCase().includes(searchQuery.toLowerCase())) return null;
                      return (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="p-4 font-semibold text-slate-700">{row.item}</td>
                          <td className="p-4"><span className="font-semibold text-slate-400 bg-slate-100/80 border border-slate-200/50 py-0.5 px-1.5 rounded">{row.unit}</span></td>
                          <td className="p-4 text-right pr-16 whitespace-nowrap">
                            <span className="text-[10px] text-slate-400 font-mono mr-2">({formatINR(row.rate || 0)})</span>
                            <input
                              type="number"
                              value={row.rate === null ? '' : row.rate}
                              onChange={(e) => {
                                const val = e.target.value === '' ? null : Number(e.target.value);
                                handleRateChange('labour', index, val);
                              }}
                              className="font-black font-mono w-28 bg-slate-50 border border-slate-200 text-slate-800 py-1.5 px-2.5 rounded-lg text-right focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  No roles match query criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

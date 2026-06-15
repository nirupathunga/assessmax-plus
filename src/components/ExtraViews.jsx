import React, { useState } from 'react';
import { formatINR } from '../mockData';

// ---------------- CLIENTS VIEW ----------------
export function ClientsView({ clients, onAddClient }) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
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
export function ProjectsView({ projects, onSelectProject }) {
  return (
    <div className="flex-1 min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Active Workspaces</h1>
        <p className="text-xs text-slate-500 mt-1">Full structural quantity audit files catalog & rate customized takeoff sheets</p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden p-6">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProject && onSelectProject(p.id)}
                className="border border-slate-100 hover:border-slate-300 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all cursor-pointer bg-slate-50/20 hover:bg-slate-50/90 hover:shadow-xs group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-[#4c3e80] text-sm group-hover:text-violet-700 transition-colors">{p.name}</h3>
                    {p.floorsCount && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-violet-100 text-[#4c3e80] border border-violet-200/50">
                        {p.floorsCount} {p.floorsCount === 1 ? 'Floor' : 'Floors'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span>Client: <strong className="text-slate-600 font-semibold">{p.clientName}</strong></span>
                    <span>•</span>
                    <span>Category: <strong className="text-violet-600 font-semibold">{p.drawingType}</strong></span>
                    <span>•</span>
                    <span>Created: <strong>{p.date}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-6 self-stretch sm:self-auto min-w-[280px]">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Takeoff Valuation</span>
                    <strong className="text-rose-500 text-sm font-black font-mono">{formatINR(p.value)}</strong>
                  </div>
                  
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold px-3.5 py-2 rounded-lg border border-violet-500 uppercase tracking-wider transition-all cursor-pointer"
                  >
                    📝 Calibrate Rates & Takeoff
                  </button>
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
export function InvoicesView({ projects }) {
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
export const DEFAULT_CORE_RATES = [
  { "item": "Excavation", "rate": 300, "unit": "cum" },
  { "item": "PCC(1:4:8)", "rate": 6000, "unit": "cum" },
  { "item": "PCC(1:3:6)", "rate": 6500, "unit": "cum" },
  { "item": "FDN RCC(M25)", "rate": 7200, "unit": "cum" },
  { "item": "Pedestal RCC(M25)", "rate": 7200, "unit": "cum" },
  { "item": "FDNColumn RCC(M25)", "rate": 7500, "unit": "cum" },
  { "item": "Footing main bars", "rate": 78, "unit": "kg" },
  { "item": "Footing Cross Reinforcement", "rate": 78, "unit": "kg" },
  { "item": "Pedestal Reinforcement", "rate": 78, "unit": "kg" },
  { "item": "Pedestal Stirrups", "rate": 78, "unit": "kg" },
  { "item": "FDNColumn Main Bars", "rate": 78, "unit": "kg" },
  { "item": "FDNColumn Stirrups", "rate": 78, "unit": "kg" },
  { "item": "Footing Formwork", "rate": 700, "unit": "sqm" },
  { "item": "Pedestal Formwork", "rate": 700, "unit": "sqm" },
  { "item": "FDNColumn Formwork", "rate": 700, "unit": "sqm" },
  { "item": "RFR (Returning and Filling)", "rate": 250, "unit": "cum" },
  { "item": "Removal", "rate": 200, "unit": "cum" },
  { "item": "Beam RCC(M25)", "rate": 7700, "unit": "cum" },
  { "item": "Beam Formwork", "rate": 950, "unit": "sqm" },
  { "item": "Beam Main Bars", "rate": 80, "unit": "kg" },
  { "item": "Beam Extra Bars", "rate": 80, "unit": "kg" },
  { "item": "Beam Stirrups", "rate": 80, "unit": "kg" },
  { "item": "Beam Total Steel", "rate": null, "unit": "kg" },
  { "item": "Column RCC(M25)", "rate": 7700, "unit": "cum" },
  { "item": "Column Formwork", "rate": 920, "unit": "sqm" },
  { "item": "Column Main Bars", "rate": 78, "unit": "kg" },
  { "item": "Column Stirrups", "rate": 78, "unit": "kg" },
  { "item": "Column Total Steel", "rate": null, "unit": "kg" },
  { "item": "Slab RCC(M25)", "rate": 7700, "unit": "cum" },
  { "item": "Slab Formwork", "rate": 950, "unit": "sqm" },
  { "item": "Slab Main Bars", "rate": 78, "unit": "kg" },
  { "item": "Slab Cross Bars", "rate": 78, "unit": "kg" },
  { "item": "Slab Total Steel", "rate": null, "unit": "kg" },
  { "item": "Wooden Door Shutter", "rate": 1200, "unit": "sqm" },
  { "item": "Wooden Door Frame", "rate": 12000, "unit": "cum" },
  { "item": "UPVC Toilet Door", "rate": 1200, "unit": "sqm" },
  { "item": "UPVC Windows", "rate": 4500, "unit": "sqm" },
  { "item": "UPVC Ventilators", "rate": 4000, "unit": "sqm" },
  { "item": "Full Brick Wall", "rate": 7200, "unit": "cum" },
  { "item": "Half Brick Wall", "rate": 6100, "unit": "cum" },
  { "item": "Floor Area", "rate": 1300, "unit": "sqm" },
  { "item": "External Plaster", "rate": 300, "unit": "sqm" },
  { "item": "Internal Plaster", "rate": 350, "unit": "sqm" },
  { "item": "External Painting", "rate": 220, "unit": "sqm" },
  { "item": "Internal Painting", "rate": 200, "unit": "sqm" },
  { "item": "Wooden Door Painting", "rate": 150, "unit": "sqm" },
  { "item": "Subfloor Filling", "rate": 150, "unit": "cum" },
  { "item": "Subfloor PCC 1:3:6", "rate": 5000, "unit": "cum" },
  { "item": "Subfloor PCC 1:2:4", "rate": 5500, "unit": "cum" },
  { "item": "Cement Screed Bed", "rate": 5000, "unit": "cum" },
  { "item": "Cement Screed Finishing", "rate": 300, "unit": "sqm" },
  { "item": "Flooring (Vitrified Tiles)", "rate": 1200, "unit": "sqm" },
  { "item": "Flooring (Ceramic Tiles)", "rate": 800, "unit": "sqm" },
  { "item": "Flooring (Marble)", "rate": 1500, "unit": "sqm" },
  { "item": "Flooring (Granite)", "rate": 1800, "unit": "sqm" }
];

export const DEFAULT_MATERIAL_RATES = [
  { "item": "Cement", "rate": 420, "unit": "bags (50 kg)" },
  { "item": "Cement (OPC 53)", "rate": 430, "unit": "bags (50 kg)" },
  { "item": "Sand", "rate": 3100, "unit": "cum" },
  { "item": "Sand (Zone II)", "rate": 3100, "unit": "cum" },
  { "item": "Coarse Aggregate (20 mm)", "rate": 1950, "unit": "cum" },
  { "item": "Coarse Aggregate (40 mm)", "rate": 1900, "unit": "cum" },
  { "item": "Water", "rate": 0.1, "unit": "litres" },
  { "item": "Water (compaction)", "rate": 0.1, "unit": "litres" },
  { "item": "Admixture", "rate": 180, "unit": "kg" },
  { "item": "TMT Steel Bars", "rate": 62, "unit": "kg" },
  { "item": "Binding Wire", "rate": 85, "unit": "kg" },
  { "item": "Door shutter", "rate": 3500, "unit": "Nos" },
  { "item": "Wood Polish", "rate": 250, "unit": "litres" },
  { "item": "Hardware Set (hinges/bolts)", "rate": 450, "unit": "set" },
  { "item": "Nails / Screws", "rate": 120, "unit": "kg" },
  { "item": "Timber (Seasoned Hardwood)", "rate": 85000, "unit": "cum" },
  { "item": "UPVC Door Panel", "rate": 4800, "unit": "sqm" },
  { "item": "Hardware Set", "rate": 450, "unit": "set" },
  { "item": "Sealant", "rate": 350, "unit": "litres" },
  { "item": "UPVC Frame & Sash", "rate": 5200, "unit": "sqm" },
  { "item": "Glass (5 mm clear)", "rate": 650, "unit": "sqm" },
  { "item": "Sealant / Gasket", "rate": 350, "unit": "litres" },
  { "item": "UPVC Frame", "rate": 4800, "unit": "sqm" },
  { "item": "Mesh / Louvre", "rate": 900, "unit": "sqm" },
  { "item": "Bricks (230x115x75 mm)", "rate": 11, "unit": "nos" },
  { "item": "Floor Tiles (600x600 mm)", "rate": 950, "unit": "sqm" },
  { "item": "Tile Grout", "rate": 45, "unit": "kg" },
  { "item": "Primer (Wall)", "rate": 180, "unit": "litres" },
  { "item": "Exterior Emulsion Paint", "rate": 320, "unit": "litres" },
  { "item": "Interior Emulsion Paint", "rate": 350, "unit": "litres" },
  { "item": "Wood Primer", "rate": 220, "unit": "litres" },
  { "item": "Enamel / Wood Paint", "rate": 350, "unit": "litres" },
  { "item": "Sandpaper", "rate": 15, "unit": "sheet" },
  { "item": "Murrum / Gravel Fill", "rate": 600, "unit": "cum" }
];

export const DEFAULT_LABOUR_RATES = [
  { "item": "Helper", "rate": 700, "unit": "day" },
  { "item": "Mason", "rate": 1200, "unit": "day" },
  { "item": "Mixer Operator", "rate": 900, "unit": "day" },
  { "item": "Bar Bender", "rate": 1000, "unit": "day" },
  { "item": "Carpenter", "rate": 1200, "unit": "day" },
  { "item": "Tile Fixer", "rate": 1100, "unit": "day" },
  { "item": "Painter", "rate": 1000, "unit": "day" },
  { "item": "Electrician", "rate": 1100, "unit": "day" },
  { "item": "Plumber", "rate": 1100, "unit": "day" }
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('fixed');

  const [coreRates, setCoreRates] = useState(() => {
    const saved = localStorage.getItem('assessmax_core_rates');
    return saved ? JSON.parse(saved) : DEFAULT_CORE_RATES;
  });

  const [materialRates, setMaterialRates] = useState(() => {
    const saved = localStorage.getItem('assessmax_material_rates');
    return saved ? JSON.parse(saved) : DEFAULT_MATERIAL_RATES;
  });

  const [labourRates, setLabourRates] = useState(() => {
    const saved = localStorage.getItem('assessmax_labour_rates');
    return saved ? JSON.parse(saved) : DEFAULT_LABOUR_RATES;
  });

  // State filtering & custom modification UX
  const [coreSearch, setCoreSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const [labourSearch, setLabourSearch] = useState('');

  // Rate Add modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState('core');
  const [newItemName, setNewItemName] = useState('');
  const [newItemRate, setNewItemRate] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');

  // Global staging configurations state
  const [currencyFormat, setCurrencyFormat] = useState('INR');
  const [precisionTolerance, setPrecisionTolerance] = useState(80);
  const [saveBanner, setSaveBanner] = useState(null);

  // Sync state modifications dynamically to offline persistent local storage
  const saveCore = (updated) => {
    setCoreRates(updated);
    localStorage.setItem('assessmax_core_rates', JSON.stringify(updated));
    triggerSaveFeedback('Core rates (rates) saved successfully.');
  };

  const saveMaterial = (updated) => {
    setMaterialRates(updated);
    localStorage.setItem('assessmax_material_rates', JSON.stringify(updated));
    triggerSaveFeedback('Material rates (material) saved successfully.');
  };

  const saveLabour = (updated) => {
    setLabourRates(updated);
    localStorage.setItem('assessmax_labour_rates', JSON.stringify(updated));
    triggerSaveFeedback('Labour rates (labour) saved successfully.');
  };

  const triggerSaveFeedback = (msg) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 3000);
  };

  const resetAllToDefaults = () => {
    if (window.confirm('Are you sure you want to revert all rates to defaults?')) {
      setCoreRates(DEFAULT_CORE_RATES);
      localStorage.setItem('assessmax_core_rates', JSON.stringify(DEFAULT_CORE_RATES));
      
      setMaterialRates(DEFAULT_MATERIAL_RATES);
      localStorage.setItem('assessmax_material_rates', JSON.stringify(DEFAULT_MATERIAL_RATES));

      setLabourRates(DEFAULT_LABOUR_RATES);
      localStorage.setItem('assessmax_labour_rates', JSON.stringify(DEFAULT_LABOUR_RATES));

      triggerSaveFeedback('All rates successfully reset to baseline defaults.');
    }
  };

  // Specific handles for updating core, material, labour rates inside grid
  const handleRateChange = (category, itemIndexInFullList, val) => {
    const numericValue = val === '' ? null : Number(val);
    
    if (category === 'core') {
      const updated = [...coreRates];
      updated[itemIndexInFullList] = { ...updated[itemIndexInFullList], rate: numericValue };
      saveCore(updated);
    } else if (category === 'material') {
      const updated = [...materialRates];
      updated[itemIndexInFullList] = { ...updated[itemIndexInFullList], rate: numericValue };
      saveMaterial(updated);
    } else if (category === 'labour') {
      const updated = [...labourRates];
      updated[itemIndexInFullList] = { ...updated[itemIndexInFullList], rate: numericValue };
      saveLabour(updated);
    }
  };

  // For adding a custom rate standard
  const handleAddCostStandard = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemUnit.trim()) return;

    const rateVal = newItemRate === '' ? null : Number(newItemRate);
    const newRecord = { item: newItemName.trim(), rate: rateVal, unit: newItemUnit.trim() };

    if (targetCategory === 'core') {
      saveCore([...coreRates, newRecord]);
    } else if (targetCategory === 'material') {
      saveMaterial([...materialRates, newRecord]);
    } else {
      saveLabour([...labourRates, newRecord]);
    }

    // Clear state & close modal
    setNewItemName('');
    setNewItemRate('');
    setNewItemUnit('');
    setShowAddModal(false);
  };

  // For deleting rate rows
  const handleDeleteRow = (category, originalIndex) => {
    if (category === 'core') {
      saveCore(coreRates.filter((_, idx) => idx !== originalIndex));
    } else if (category === 'material') {
      saveMaterial(materialRates.filter((_, idx) => idx !== originalIndex));
    } else if (category === 'labour') {
      saveLabour(labourRates.filter((_, idx) => idx !== originalIndex));
    }
  };

  // Safe formatting depending on format selected
  const formatCostValue = (val) => {
    if (val === null) return "N/A (Derived)";
    if (currencyFormat === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
    return formatINR(val);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans overflow-y-auto">
      
      {/* Title block styling */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Default Construction Rates</h1>
          <p className="text-xs text-slate-500 mt-1">Configure workspace defaults, material costs, and labor standard specifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetAllToDefaults}
            className="border border-red-200 bg-red-50 text-red-650 hover:bg-red-100 text-xs font-semibold py-2 px-4 rounded-xl cursor-pointer transition-colors"
          >
            Reset to Standard Defaults
          </button>
        </div>
      </div>

      {/* Persistence and auto-sync notifier */}
      {saveBanner && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{saveBanner}</span>
        </div>
      )}

      {/* Reorganized Section Selectors */}
      <div className="flex border-b border-slate-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('fixed')}
          className={`pb-3 px-5 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'fixed'
              ? 'border-violet-600 text-violet-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          🏷️ Fixed Price (rates)
        </button>
        <button
          onClick={() => setActiveTab('unit')}
          className={`pb-3 px-5 text-sm font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'unit'
              ? 'border-violet-600 text-violet-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          🧱 Unit Price (material & labour)
        </button>
      </div>

      <div className="space-y-8">
        
        {/* TAB 1: FIXED PRICE (RATES.JSON) */}
        {activeTab === 'fixed' && (
          <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-violet-700 p-4 font-semibold text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider">Fixed Price Rate Card (rates)</h2>
                <p className="text-[10px] text-violet-200 font-normal mt-0.5">Primary concrete, columns, structural systems, and elements default rates</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search items..."
                  value={coreSearch}
                  onChange={(e) => setCoreSearch(e.target.value)}
                  className="bg-white/10 placeholder-violet-200 border border-white/20 text-xs rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-white text-white w-48 font-normal"
                />
                <button
                  onClick={() => {
                    setTargetCategory('core');
                    setShowAddModal(true);
                  }}
                  className="bg-[#ff7e33] hover:brightness-110 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg transition-transform cursor-pointer"
                >
                  + Add Item
                </button>
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider">
                    <th className="p-3 font-semibold w-1/12 text-center">Row</th>
                    <th className="p-3 font-semibold w-5/12">Item / Engineering Sub-system</th>
                    <th className="p-3 font-semibold w-2/12">Unit</th>
                    <th className="p-3 font-semibold w-3/12">Unit Rate ({currencyFormat === 'USD' ? '$' : '₹'})</th>
                    <th className="p-3 font-semibold w-1/12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {coreRates.map((r, index) => {
                    if (coreSearch && !r.item.toLowerCase().includes(coreSearch.toLowerCase())) return null;
                    return (
                      <tr key={`core-${index}`} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{index + 1}</td>
                        <td className="p-3 font-semibold text-slate-700">{r.item}</td>
                        <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px] text-slate-600">{r.unit}</span></td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={r.rate === null ? '' : r.rate}
                              onChange={(e) => handleRateChange('core', index, e.target.value)}
                              placeholder="Derived"
                              step="any"
                              className="w-24 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 text-xs rounded-lg p-1.5 font-semibold font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                            />
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                              ({formatCostValue(r.rate)})
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteRow('core', index)}
                            className="text-red-500 hover:text-red-700 font-bold hover:scale-115 transition-transform cursor-pointer text-xs"
                            title="Delete standard rate reference"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: UNIT PRICE (MATERIAL.JSON & LABOUR.JSON) */}
        {activeTab === 'unit' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Table B: Material Resource Costs (material.json) */}
            <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-violet-700 p-4 font-semibold text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider">Material Resource Costs (material)</h2>
                  <p className="text-[10px] text-violet-200 font-normal mt-0.5">Bulk concrete aggregates, wood polish, timber beams, sealants, paints, bricks</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    className="bg-white/10 placeholder-violet-200 border border-white/20 text-xs rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-white text-white w-32 font-normal"
                  />
                  <button
                    onClick={() => {
                      setTargetCategory('material');
                      setShowAddModal(true);
                    }}
                    className="bg-[#ff7e33] hover:brightness-110 text-white text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg transition-transform cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[500px] overflow-y-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider">
                      <th className="p-2 font-semibold w-1/12 text-center">Row</th>
                      <th className="p-2 font-semibold w-5/12">Resource Spec</th>
                      <th className="p-2 font-semibold w-2/12">Unit</th>
                      <th className="p-2 font-semibold w-3/12">Unit Cost ({currencyFormat === 'USD' ? '$' : '₹'})</th>
                      <th className="p-2 font-semibold w-1/12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {materialRates.map((r, index) => {
                      if (materialSearch && !r.item.toLowerCase().includes(materialSearch.toLowerCase())) return null;
                      return (
                        <tr key={`material-${index}`} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2 text-center text-slate-400 font-mono text-[11px]">{index + 1}</td>
                          <td className="p-2 font-semibold text-slate-700">{r.item}</td>
                          <td className="p-2"><span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px] text-slate-600">{r.unit}</span></td>
                          <td className="p-2">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={r.rate === null ? '' : r.rate}
                                onChange={(e) => handleRateChange('material', index, e.target.value)}
                                placeholder="Derived"
                                step="any"
                                className="w-16 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 text-xs rounded-lg p-1 font-semibold font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />
                              <span className="text-[10px] text-slate-450 font-mono hidden sm:inline whitespace-nowrap">
                                ({r.rate !== null ? (currencyFormat === 'USD' ? `$${r.rate}` : `₹${r.rate}`) : 'N/A'})
                              </span>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteRow('material', index)}
                              className="text-red-500 hover:text-red-750 font-bold hover:scale-115 transition-transform cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table C: Labor Wage Scales (labour.json) */}
            <div className="bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-violet-700 p-4 font-semibold text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider">Labor Wage Scales (labour)</h2>
                  <p className="text-[10px] text-violet-200 font-normal mt-0.5">Specialist bar benders, masons, painters, electricians, engineers, plumbers, helpers</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search labor..."
                    value={labourSearch}
                    onChange={(e) => setLabourSearch(e.target.value)}
                    className="bg-white/10 placeholder-violet-200 border border-white/20 text-xs rounded-lg py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-white text-white w-32 font-normal"
                  />
                  <button
                    onClick={() => {
                      setTargetCategory('labour');
                      setShowAddModal(true);
                    }}
                    className="bg-[#ff7e33] hover:brightness-110 text-white text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg transition-transform cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-[500px] overflow-y-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] text-slate-500 uppercase tracking-wider">
                      <th className="p-2 font-semibold w-1/12 text-center">Row</th>
                      <th className="p-2 font-semibold w-5/12">Labor Role / Classification</th>
                      <th className="p-2 font-semibold w-2/12">Period</th>
                      <th className="p-2 font-semibold w-3/12">Standard Wage ({currencyFormat === 'USD' ? '$' : '₹'})</th>
                      <th className="p-2 font-semibold w-1/12 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {labourRates.map((r, index) => {
                      if (labourSearch && !r.item.toLowerCase().includes(labourSearch.toLowerCase())) return null;
                      return (
                        <tr key={`labour-${index}`} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-2 text-center text-slate-400 font-mono text-[11px]">{index + 1}</td>
                          <td className="p-2 font-semibold text-slate-700">{r.item}</td>
                          <td className="p-2"><span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px] text-slate-600">{r.unit}</span></td>
                          <td className="p-2">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={r.rate === null ? '' : r.rate}
                                onChange={(e) => handleRateChange('labour', index, e.target.value)}
                                placeholder="Derived"
                                step="any"
                                className="w-16 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 text-xs rounded-lg p-1 font-semibold font-mono focus:outline-none focus:ring-1 focus:ring-violet-500"
                              />
                              <span className="text-[10px] text-slate-450 font-mono hidden sm:inline whitespace-nowrap">
                                ({r.rate !== null ? (currencyFormat === 'USD' ? `$${r.rate}` : `₹${r.rate}`) : 'N/A'})
                              </span>
                            </div>
                          </td>
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteRow('labour', index)}
                              className="text-red-500 hover:text-red-770 font-bold hover:scale-115 transition-transform cursor-pointer text-xs"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* RENDER THE RATE STANDARD CREATOR MODAL WINDOWS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs select-none">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fade-in text-slate-800">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                Add Cost Index to {targetCategory === 'core' ? 'Fixed Price (rates)' : targetCategory === 'material' ? 'Material (material)' : 'Labour (labour)'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCostStandard} className="space-y-4">
              <div>
                <label className="block text-slate-600 text-[10px] font-bold mb-1.5 uppercase tracking-wider">
                  Item Description / Standard Name
                </label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. M30 Reinforced Grade Concrete"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 text-[10px] font-bold mb-1.5 uppercase tracking-wider">
                    Unit rate ({currencyFormat === 'USD' ? '$' : '₹'})
                  </label>
                  <input
                    type="number"
                    value={newItemRate}
                    onChange={(e) => setNewItemRate(e.target.value)}
                    placeholder="Enter rate value"
                    step="any"
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 text-[10px] font-bold mb-1.5 uppercase tracking-wider">
                    Unit of Measure / Period
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="e.g. cum, sqm, kg, day"
                    className="w-full bg-slate-50 border border-slate-250 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs uppercase py-2 px-4 rounded-lg cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs uppercase py-2 px-4 rounded-lg cursor-pointer transition-all"
                >
                  Confirm Index Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

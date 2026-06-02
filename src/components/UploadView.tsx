import React, { useState } from 'react';
import { Client, DrawingTypeCard } from '../types';
import { mockDrawingTypes } from '../mockData';

interface UploadViewProps {
  clients: Client[];
  onCancel: () => void;
  onSubmit: (newProj: { name: string; clientName: string; drawingTypes: string[]; floorsCount: number }) => void;
}

export default function UploadView({ clients, onCancel, onSubmit }: UploadViewProps) {
  const [projectName, setProjectName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [floorsCount, setFloorsCount] = useState<number>(1);
  const [selectedDrawingTypeIds, setSelectedDrawingTypeIds] = useState<string[]>(['foundation']); // Default to Foundation highlighted
  const [errorStatus, setErrorStatus] = useState('');

  // Step wizard state (Step 1: Project details, Step 2: Foundation images)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ id: string; url: string; name: string; size: string }[]>([]);

  // Sulating processing steps loader
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    'Parsing drawing vector nodes...',
    'Performing AI area quantification taking off...',
    'Analyzing load calculations and material requirements...',
    'Generating total project cost estimation models...',
    'Validating compliance sheets against code standards...'
  ];

  // Toggle highlight selection with logic to lock Plan/Elevation
  const handleToggleCard = (cardId: string) => {
    const isPlanOrElevation = cardId === 'plan' || cardId === 'elevation';
    const coreIds = ['foundation', 'plinth-beam', 'floor-beam', 'floor-slab', 'columns'];
    const isAllCoreSelected = coreIds.every((id) => selectedDrawingTypeIds.includes(id));

    if (isPlanOrElevation && !isAllCoreSelected) {
      // Prevent selection of plan/elevation until core components are fully selected
      return;
    }

    if (selectedDrawingTypeIds.includes(cardId)) {
      // Keep at least one selected so it doesn't break
      if (selectedDrawingTypeIds.length > 1) {
        const nextSelection = selectedDrawingTypeIds.filter((id) => id !== cardId);
        
        // If a core id is decommissioned, deselect Plan and Elevation automatically
        const stillHasAllCore = coreIds.every((id) => nextSelection.includes(id));
        if (!stillHasAllCore) {
          setSelectedDrawingTypeIds(nextSelection.filter((id) => id !== 'plan' && id !== 'elevation'));
        } else {
          setSelectedDrawingTypeIds(nextSelection);
        }
      }
    } else {
      setSelectedDrawingTypeIds([...selectedDrawingTypeIds, cardId]);
    }
  };

  // Step 1 Validation & Proceed
  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      setErrorStatus('Please select a client for this project.');
      return;
    }
    if (!projectName.trim()) {
      setErrorStatus('Please provide a legitimate project name.');
      return;
    }
    if (selectedDrawingTypeIds.length === 0) {
      setErrorStatus('Please select at least one drawing type to upload.');
      return;
    }
    setErrorStatus('');
    setCurrentStep(2);
  };

  // Back button
  const handleBackToStep1 = () => {
    setErrorStatus('');
    setCurrentStep(1);
  };

  // Multiple File uploads parsing mechanics
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const validImageFiles = files.filter(f => f.type.startsWith('image/'));
    if (validImageFiles.length === 0) {
      setErrorStatus('Please select valid image files (PNG, JPG, JPEG).');
      return;
    }
    setErrorStatus('');

    const newImages = validImageFiles.map(file => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return {
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${sizeMB} MB`
      };
    });

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  // Drag and Drop support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Pre-load demo foundation blueprint layouts
  const loadDemoDrawings = () => {
    const demo1 = {
      id: 'demo-1',
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600',
      name: 'Foundation_Concrete_Grade_M25.png',
      size: '2.45 MB'
    };
    const demo2 = {
      id: 'demo-2',
      url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
      name: 'Footing_Reinforcement_Detail_A.png',
      size: '1.80 MB'
    };
    const demo3 = {
      id: 'demo-3',
      url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
      name: 'Pile_Cap_Soil_Bearing_Details.png',
      size: '3.12 MB'
    };
    setUploadedImages([demo1, demo2, demo3]);
    setErrorStatus('');
  };

  // Step 2 Submission (Runs AI and creates the Project record)
  const handleValidationAndSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      setErrorStatus('Please upload or load at least one foundation blueprint image to proceed with the estimation.');
      return;
    }
    setErrorStatus('');
    setIsProcessing(true);
    setProcessingStep(0);

    // Beautiful step-by-step progress simulation
    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            const clientObj = clients.find((c) => c.id === selectedClientId);
            const finalClientName = clientObj ? clientObj.name : 'Unknown Client';
            const mappedDrawingLabels = selectedDrawingTypeIds.map(
              (id) => mockDrawingTypes.find((t) => t.id === id)?.title || id
            );

            onSubmit({
              name: projectName,
              clientName: finalClientName,
              drawingTypes: mappedDrawingLabels,
              floorsCount: floorsCount
            });
            setIsProcessing(false);
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  // Inline SVG render helper depending on the drawing type ID
  const renderCardSVG = (id: string, active: boolean) => {
    const strokeColor = active ? 'text-violet-600' : 'text-slate-400';
    switch (id) {
      case 'foundation':
        // Grid footing/pile foundation visual
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'plinth-beam':
        // Horizontal girder tie-beam with supports
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M3 16h18M5 5v14M11 5v14M19 5v14" />
          </svg>
        );
      case 'floor-beam':
        // Reinforced concrete beam spanning columns
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 14V6h16v8H4zM8 6h8v8H8V6z" />
          </svg>
        );
      case 'floor-slab':
        // Solid slab mesh layer with thickness arrow details
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16M6 4v16M12 4v16M18 4v16" />
          </svg>
        );
      case 'columns':
        // Vertical building columns design
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h3v18H6V3zm9 0h3v18h-3V3z" />
          </svg>
        );
      case 'plan':
        // Architectural rooms and partitions plan layout
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'elevation':
        // Front elevation visual blueprint structure
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      default:
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8f9fc] p-6 md:p-8 font-sans overflow-y-auto relative">
      {/* Simulation overlay modal block */}
      {isProcessing && (
        <div className="absolute inset-0 bg-[#07080f]/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#0f1021] border border-slate-800 rounded-2xl w-full max-w-md p-8 text-center shadow-2xl relative select-none animate-fade-in">
            {/* Spinning radar graphic */}
            <div className="mx-auto w-20 h-20 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin flex items-center justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-violet-600/10 flex items-center justify-center text-violet-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
            </div>

            {/* Stepper info logs */}
            <h3 className="text-white text-lg font-bold mb-2">Validating Engineering Blueprints</h3>
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-widest h-4 animate-pulse">
              Step {processingStep + 1} of {processingSteps.length}
            </p>

            <div className="bg-[#15162d] border border-slate-800 rounded-lg p-4 mt-6 text-slate-350 text-sm font-mono text-left space-y-1.5 shadow-inner">
              {processingSteps.map((stepStr, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    idx < processingStep
                      ? 'text-emerald-400'
                      : idx === processingStep
                      ? 'text-white font-bold'
                      : 'text-slate-600'
                  }`}
                >
                  {idx < processingStep ? (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : idx === processingStep ? (
                    <svg className="w-4 h-4 animate-spin text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <div className="w-4 h-0.5 bg-slate-800 ml-1 rounded flex-shrink-0" />
                  )}
                  <span className="truncate">{stepStr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back to Dashboard Link Anchor */}
      <div className="mb-6">
        <button
          onClick={onCancel}
          className="group flex items-center text-xs font-semibold text-slate-500 hover:text-violet-600 tracking-wider uppercase gap-1.5 transition-colors cursor-pointer bg-transparent border-0 outline-none"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Main Panel progress step visualizer header */}
      <div className="mb-6 bg-white border border-slate-200/50 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center relative select-none">
        {/* Upload Circle emblem */}
        <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4 transition-transform hover:scale-105 duration-250">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        
        {/* Progress horizontal line with modern gradient */}
        <div className="w-full max-w-xl h-1 bg-slate-100/90 rounded-full mb-4 overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 to-orange-500 rounded-full transition-all duration-500" 
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>

        {/* Step details text */}
        <p className="text-xs sm:text-sm text-slate-500 tracking-wide">
          Step {currentStep} of 9 : <span className="font-bold text-slate-800">{currentStep === 1 ? 'Project' : 'Upload Foundation Images'}</span>
        </p>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-xl p-6 md:p-8 shadow-sm">
        
        {errorStatus && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-6 text-center font-medium">
            {errorStatus}
          </div>
        )}

        {/* STEP 1: Project Metadata Form */}
        {currentStep === 1 && (
          <div>
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Upload Construction Drawings</h2>
                <p className="text-xs text-slate-500 mt-1">Upload multiple drawings - floor plan, foundation, structural, elevation, section, design, electrical, plumbing, etc.</p>
              </div>
            </div>

            <form onSubmit={handleGoToStep2} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Select Client Dropdown */}
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                    Select Client <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 focus:bg-white transition-all cursor-pointer appearance-none"
                    >
                      <option value="">Choose a client for this project</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.contact})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Project Name TextBox */}
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., Residential Building - Phase 1"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 focus:bg-white transition-all placeholder-slate-400"
                  />
                </div>

                {/* Number of Floors Dropdown */}
                <div>
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                    Number of Floors <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={floorsCount}
                      onChange={(e) => setFloorsCount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 focus:bg-white transition-all cursor-pointer appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Floor' : 'Floors'}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* 8-Card Grid Drawing Selection space */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider">
                    Select Blueprint Drawing Types to Upload
                  </label>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {selectedDrawingTypeIds.length} type(s) selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockDrawingTypes.map((card) => {
                    const isSelected = selectedDrawingTypeIds.includes(card.id);
                    const isPlanOrElevation = card.id === 'plan' || card.id === 'elevation';
                    
                    const coreIds = ['foundation', 'plinth-beam', 'floor-beam', 'floor-slab', 'columns'];
                    const isAllCoreSelected = coreIds.every((id) => selectedDrawingTypeIds.includes(id));
                    const isDisabledView = isPlanOrElevation && !isAllCoreSelected;

                    return (
                      <div
                        key={card.id}
                        onClick={() => handleToggleCard(card.id)}
                        className={`border rounded-xl p-5 select-none transition-all duration-250 ${
                          isDisabledView
                            ? 'border-slate-200/60 bg-slate-50/50 opacity-45 cursor-not-allowed'
                            : isSelected
                            ? 'border-violet-600 bg-violet-50/40 shadow-md shadow-violet-500/5 cursor-pointer'
                            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className={`p-2.5 rounded-lg ${
                            isDisabledView 
                              ? 'bg-slate-100/50 text-slate-300' 
                              : isSelected 
                              ? 'bg-violet-100 text-violet-700' 
                              : 'bg-slate-50 text-slate-400'
                          }`}>
                            {renderCardSVG(card.id, isSelected && !isDisabledView)}
                          </div>
                          
                          {/* Interactive check bubble or lock icon */}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isDisabledView
                              ? 'bg-slate-100 border-slate-200 text-slate-400'
                              : isSelected
                              ? 'bg-violet-600 border-violet-600 text-white'
                              : 'border-slate-300'
                          }`}>
                            {isDisabledView ? (
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : isSelected ? (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : null}
                          </div>
                        </div>
                        <h4 className={`text-sm font-bold tracking-tight ${
                          isDisabledView
                            ? 'text-slate-400'
                            : isSelected
                            ? 'text-violet-950'
                            : 'text-slate-800'
                        }`}>
                          {card.title} {isDisabledView && <span className="text-[9px] font-semibold text-rose-500/80 ml-1 select-none">(Locked)</span>}
                        </h4>
                        <p className="text-xs text-slate-450 mt-1 leading-snug">
                          {isDisabledView ? 'Complete initial structural selection first.' : card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submission and Cancel Button space */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-slate-600 hover:text-slate-900 border border-slate-200 bg-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer text-center hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-violet-500/10 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Continue to Step 2 →
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Foundation Image Upload Interface */}
        {currentStep === 2 && (
          <div>
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight font-sans">Upload Foundation Images</h2>
                <p className="text-xs text-slate-500 mt-1">Upload foundation & footing engineering drawings, layouts or photos to analyze concrete rebar and estimate structure costs.</p>
              </div>
            </div>

            <form onSubmit={handleValidationAndSubmission} className="space-y-6">
              
              {/* Image drag-and-drop region */}
              <div
                onClick={() => document.getElementById('file-uploader')?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 relative group select-none ${
                  isDragging 
                    ? 'border-violet-600 bg-violet-50/40 shadow-inner' 
                    : 'border-slate-200 hover:border-violet-400 bg-slate-50/50 hover:bg-violet-50/10'
                }`}
              >
                <input
                  id="file-uploader"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-violet-200 transition-all duration-300 mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700 font-semibold mb-1">
                    Drag and drop your foundation images here, or <span className="text-violet-600 group-hover:underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    Supports JPG, JPEG, PNG drawings up to 10MB
                  </p>
                </div>
              </div>

              {/* Dynamic counter header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Images Select List
                </span>
                <span className="inline-flex items-center text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                  {uploadedImages.length} image{uploadedImages.length === 1 ? '' : 's'} added
                </span>
              </div>

              {/* Grid block of loaded previews */}
              {uploadedImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm relative group hover:shadow-md transition-all">
                      <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative border-b border-slate-100">
                        <img
                          src={img.url}
                          alt={img.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='75' viewBox='0 0 100 75'><rect width='100' height='75' fill='%23f1f5f9'/><path d='M35 45l10-10 15 15h-25zm20-10l5-5 10 10v-5z' fill='%2394a3b8'/></svg>";
                          }}
                        />
                        {/* Hover Overlay Delete Trigger */}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedImages(prev => prev.filter(item => item.id !== img.id));
                            }}
                            className="bg-rose-600 hover:bg-rose-500 text-white rounded-lg p-2 shadow-lg cursor-pointer transition-all transform translate-y-3 group-hover:translate-y-0 duration-200"
                            title="Delete drawing"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <p className="text-xs font-bold text-slate-800 truncate mb-0.5" title={img.name}>
                          {img.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {img.size}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-slate-200/80 rounded-2xl bg-slate-50/20 p-12 text-center text-slate-400 select-none">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-semibold text-slate-500">No images added to the queue yet</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Drop files or click browse to upload images to run estimation immediately.</p>
                </div>
              )}

              {/* Navigation button set down keel */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="text-slate-600 hover:text-slate-900 border border-slate-200 bg-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider cursor-pointer text-center hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  ← Back to Step 1
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-violet-600 to-orange-500 hover:from-violet-500 hover:to-orange-400 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-violet-500/10 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Upload and Estimate →
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

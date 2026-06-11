import React, { useState } from 'react';
import { Client, DrawingTypeCard } from '../types';
import { mockDrawingTypes } from '../mockData';

interface UploadViewProps {
  clients: Client[];
  onCancel: () => void;
  onSubmit: (newProj: { name: string; clientName: string; drawingTypes: string[]; floorsCount: number }) => void;
  onSessionExpired?: () => void;
}

const uploadSteps = [
  { id: 'foundation', title: 'Foundation', displayId: 'foundation' },
  { id: 'plinth-beam', title: 'Plinth Beam', displayId: 'plinth_beam' },
  { id: 'floor-beam', title: 'Floor Beam', displayId: 'floor_beam' },
  { id: 'floor-slab', title: 'Floor Slab', displayId: 'floor_slab' },
  { id: 'columns', title: 'Columns', displayId: 'columns' },
  { id: 'superstructure', title: 'Superstructure & Finishes', displayId: 'superstructure' },
  { id: 'lintel-beam', title: 'Lintel Beam', displayId: 'lintel_beam' },
  { id: 'staircase', title: 'Staircase', displayId: 'staircase' }
];

export default function UploadView({ clients, onCancel, onSubmit, onSessionExpired }: UploadViewProps) {
  const [projectName, setProjectName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [floorsCount, setFloorsCount] = useState<number>(1);
  const [selectedDrawingTypeIds, setSelectedDrawingTypeIds] = useState<string[]>([]); // Empty default selection
  const [errorStatus, setErrorStatus] = useState('');

  // Step wizard state (1 to 10 steps)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [currentFloorIndex, setCurrentFloorIndex] = useState<number>(1);
  const [stepState, setStepState] = useState<'upload' | 'results'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  
  // Storage for uploaded diagram images mapped per step module
  const [moduleImages, setModuleImages] = useState<Record<string, { id: string; url: string; name: string; size: string }[]>>({});

  // Active step computed references
  const activeUploadSteps = uploadSteps.filter(step => {
    if (currentFloorIndex > 1) {
      return selectedDrawingTypeIds.includes(step.id) && step.id !== 'foundation' && step.id !== 'plinth-beam';
    }
    return selectedDrawingTypeIds.includes(step.id);
  });
  const totalWizardSteps = activeUploadSteps.length;
  const hasTransitionStep = floorsCount > 1 && currentFloorIndex < floorsCount;
  const transitionStepNumber = totalWizardSteps + 2;
  const totalStepsInTitle = totalWizardSteps + 1 + (hasTransitionStep ? 1 : 0);

  const getStepKey = (stepId?: string) => {
    if (!stepId) return '';
    return `${currentFloorIndex}_${stepId}`;
  };

  const currentUploadStep = currentStep >= 2 && currentStep <= (totalWizardSteps + 1) ? activeUploadSteps[currentStep - 2] : null;
  const uploadedImages = currentUploadStep ? (moduleImages[getStepKey(currentUploadStep.id)] || []) : [];
  const allUploadedImages: { id: string; url: string; name: string; size: string }[] = (Object.values(moduleImages) as any[]).flat();
  const totalUploadedCount = allUploadedImages.length;

  const getDynamicQuantities = (stepId?: string) => {
    // Determine which files to count
    let count = 3;
    if (stepId) {
      count = (moduleImages[getStepKey(stepId)] || []).length || 3;
    } else {
      count = totalUploadedCount > 0 ? totalUploadedCount : 3;
    }
    const imgFactor = count / 3;
    const floorFactor = 1 + (floorsCount - 1) * 0.15;
    const baseFactor = Math.max(0.15, imgFactor * floorFactor);
    const round2 = (num: number) => Math.round(num * 100) / 100;
    
    const allRows = [
      { item: 'Excavation', quantity: round2(59.87 * baseFactor), unit: 'cum', category: 'foundation' },
      { item: 'PCC(1:4:8)', quantity: round2(5.43 * baseFactor), unit: 'cum', category: 'foundation' },
      { item: 'FDN RCC(M25)', quantity: round2(12.1 * baseFactor), unit: 'cum', category: 'foundation' },
      { item: 'Pedestal RCC(M25)', quantity: round2(0.8 * baseFactor), unit: 'cum', category: 'foundation' },
      { item: 'FDNColumn RCC(M25)', quantity: round2(0.87 * baseFactor), unit: 'cum', category: 'foundation' },
      { item: 'Pedestal Stirrups', quantity: round2(68.94 * baseFactor), unit: 'kg', category: 'foundation' },
      { item: 'FDNColumn Main Bars', quantity: round2(293.79 * baseFactor), unit: 'kg', category: 'foundation' },
      { item: 'FDNColumn Stirrups', quantity: round2(70.04 * baseFactor), unit: 'kg', category: 'foundation' },
      { item: 'Footing Formwork', quantity: round2(22.56 * baseFactor), unit: 'm²', category: 'foundation' },
      { item: 'Pedestal Formwork', quantity: round2(9.41 * baseFactor), unit: 'm²', category: 'foundation' },
      { item: 'FDNColumn Formwork', quantity: round2(11.08 * baseFactor), unit: 'm²', category: 'foundation' },
      { item: 'RFR (Returning and Filling)', quantity: round2(44.74 * baseFactor), unit: 'm³', category: 'foundation' },
      { item: 'Removal', quantity: round2(19.2 * baseFactor), unit: 'm³', category: 'foundation' },
      
      { item: 'Plinth Beam Concrete (M25)', quantity: round2(8.52 * baseFactor), unit: 'cum', category: 'plinth-beam' },
      { item: 'Plinth Beam Main Reinforcement', quantity: round2(148.2 * baseFactor), unit: 'kg', category: 'plinth-beam' },
      { item: 'Plinth Beam Stirrups', quantity: round2(45.1 * baseFactor), unit: 'kg', category: 'plinth-beam' },
      { item: 'Plinth Beam Shuttering', quantity: round2(18.4 * baseFactor), unit: 'm²', category: 'plinth-beam' },

      { item: 'Floor Beam Concrete (M25)', quantity: round2(11.35 * baseFactor), unit: 'cum', category: 'floor-beam' },
      { item: 'Floor Beam Main Reinforcement', quantity: round2(210.8 * baseFactor), unit: 'kg', category: 'floor-beam' },
      { item: 'Floor Beam Shuttering / Formwork', quantity: round2(24.6 * baseFactor), unit: 'm²', category: 'floor-beam' },

      { item: 'Floor Slab Concrete (M20/25)', quantity: round2(18.6 * baseFactor), unit: 'cum', category: 'floor-slab' },
      { item: 'Slab Rebar Mesh Main (10mm)', quantity: round2(340.5 * baseFactor), unit: 'kg', category: 'floor-slab' },
      { item: 'Slab Distribution Steel (8mm)', quantity: round2(180.2 * baseFactor), unit: 'kg', category: 'floor-slab' },
      { item: 'Slab Formwork / Centering', quantity: round2(120.0 * baseFactor), unit: 'm²', category: 'floor-slab' },

      { item: 'Column concrete (M25)', quantity: round2(9.4 * baseFactor), unit: 'cum', category: 'columns' },
      { item: 'Column Main Longitudinal Bars', quantity: round2(450.2 * baseFactor), unit: 'kg', category: 'columns' },
      { item: 'Column Stirrup Ties (8mm)', quantity: round2(110.6 * baseFactor), unit: 'kg', category: 'columns' },
      
      { item: 'Internal Partitions & Superstructure Brickwork', quantity: round2(120.4 * baseFactor), unit: 'sqm', category: 'superstructure' },
      { item: 'Plastering works (1:6)', quantity: round2(240.8 * baseFactor), unit: 'sqm', category: 'superstructure' },

      { item: 'Exterior Wall Painting / Texture', quantity: round2(310.2 * baseFactor), unit: 'sqm', category: 'superstructure' },
      { item: 'Structural Architectural Projections', quantity: round2(2.5 * baseFactor), unit: 'cum', category: 'superstructure' },

      { item: 'Lintel Beam Concrete (M20/M25)', quantity: round2(3.15 * baseFactor), unit: 'cum', category: 'lintel-beam' },
      { item: 'Lintel Beam Main Steel reinforcement', quantity: round2(110.4 * baseFactor), unit: 'kg', category: 'lintel-beam' },
      { item: 'Lintel Beam Shuttering / Formwork', quantity: round2(12.8 * baseFactor), unit: 'm²', category: 'lintel-beam' },

      { item: 'Staircase Waist Slab Concrete (M25)', quantity: round2(4.8 * baseFactor), unit: 'cum', category: 'staircase' },
      { item: 'Staircase Rebar reinforcement (12mm)', quantity: round2(120.5 * baseFactor), unit: 'kg', category: 'staircase' },
      { item: 'Staircase Shuttering / Formwork', quantity: round2(15.2 * baseFactor), unit: 'sqm', category: 'staircase' }
    ];

    if (stepId) {
      return allRows.filter(r => r.category === stepId);
    }
    return allRows;
  };

  // Toggle highlight selection with logic to lock Superstructure/Lintel/Staircase
  const handleToggleCard = (cardId: string) => {
    if (currentFloorIndex > 1 && (cardId === 'foundation' || cardId === 'plinth-beam')) {
      return; // Do not toggle foundation / plinth-beam on floor 2+
    }
    const isLockedType = cardId === 'superstructure' || cardId === 'lintel-beam' || cardId === 'staircase';
    const coreIds = currentFloorIndex > 1
      ? ['floor-beam', 'floor-slab', 'columns']
      : ['foundation', 'plinth-beam', 'floor-beam', 'floor-slab', 'columns'];
    const isAllCoreSelected = coreIds.every((id) => selectedDrawingTypeIds.includes(id));

    if (isLockedType && !isAllCoreSelected) {
      // Prevent selection of superstructure/lintel/staircase until core components are fully selected
      return;
    }

    if (selectedDrawingTypeIds.includes(cardId)) {
      const nextSelection = selectedDrawingTypeIds.filter((id) => id !== cardId);
      
      // If a core id is decommissioned, deselect locked ones automatically
      const stillHasAllCore = coreIds.every((id) => nextSelection.includes(id));
      if (!stillHasAllCore) {
        setSelectedDrawingTypeIds(nextSelection.filter((id) => id !== 'superstructure' && id !== 'lintel-beam' && id !== 'staircase'));
      } else {
        setSelectedDrawingTypeIds(nextSelection);
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

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setErrorStatus('Authentication token not found. Please log in again.');
      return;
    }

    setErrorStatus('');
    // Completely bypass external API call
    const mockId = `mock_proj_${Date.now()}`;
    localStorage.setItem('active_project_id', mockId);
    setErrorStatus('');
    setCurrentStep(2);
    setStepState('upload');
  };

  // Navigation handlers across the multi-step form wizard
  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUploadStep) return;
    
    // Check if at least one image is uploaded, or prompt options
    const stepImgs = moduleImages[getStepKey(currentUploadStep.id)] || [];
    if (stepImgs.length === 0) {
      setErrorStatus(`Please upload or load at least one blueprint drawing image for '${currentUploadStep.title}' to proceed with estimation.`);
      return;
    }
    
    setErrorStatus('');
    if (stepState === 'upload') {
      setStepState('results');
    } else {
      setStepState('upload');
      if (currentStep < (totalWizardSteps + 1)) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleSkipStep = () => {
    setErrorStatus('');
    if (stepState === 'upload') {
      setStepState('results');
    } else {
      setStepState('upload');
      if (currentStep < (totalWizardSteps + 1)) {
        setCurrentStep(currentStep + 1);
      } else {
        handleCalculateCost();
      }
    }
  };

  const handlePrevStep = () => {
    setErrorStatus('');
    if (stepState === 'results') {
      setStepState('upload');
    } else {
      if (currentStep > 2) {
        setCurrentStep(currentStep - 1);
        setStepState('results');
      } else {
        setCurrentStep(1);
      }
    }
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

    if (currentUploadStep) {
      setModuleImages(prev => ({
        ...prev,
        [getStepKey(currentUploadStep.id)]: [...(prev[getStepKey(currentUploadStep.id)] || []), ...newImages]
      }));
    }
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

  // Pre-load demo drawings for the active step module
  const loadDemoDrawings = () => {
    if (!currentUploadStep) return;
    const stepId = currentUploadStep.id;

    let demos: { id: string; url: string; name: string; size: string }[] = [];
    if (stepId === 'foundation') {
      demos = [
        { id: 'f-1', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600', name: 'Foundation_Concrete_Grade_M25.png', size: '2.45 MB' },
        { id: 'f-2', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600', name: 'Footing_Reinforcement_Detail_A.png', size: '1.80 MB' },
        { id: 'f-3', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600', name: 'Pile_Cap_Soil_Bearing_Details.png', size: '3.12 MB' }
      ];
    } else if (stepId === 'plinth-beam') {
      demos = [
        { id: 'pb-1', url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=600', name: 'Plinth_Beam_Tie_Layout_S1.png', size: '1.95 MB' },
        { id: 'pb-2', url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600', name: 'Beam_Rebar_Crossover_Detail.png', size: '2.10 MB' }
      ];
    } else if (stepId === 'floor-beam') {
      demos = [
        { id: 'fb-1', url: 'https://images.unsplash.com/photo-1512403754473-2785561399cf?auto=format&fit=crop&q=80&w=600', name: 'Floor_Beam_Span_Section_B4.png', size: '2.22 MB' },
        { id: 'fb-2', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600', name: 'Concrete_Slab_Supporting_Grid.png', size: '1.75 MB' }
      ];
    } else if (stepId === 'floor-slab') {
      demos = [
        { id: 'fs-1', url: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&q=80&w=600', name: 'Slab_Two_Way_Rebar_Mesh.png', size: '2.80 MB' }
      ];
    } else if (stepId === 'columns') {
      demos = [
        { id: 'col-1', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600', name: 'Column_Stirrup_Spacing_Schedule.png', size: '2.50 MB' },
        { id: 'col-2', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600', name: 'Vertical_Steel_Bars_Location_Offsets.png', size: '1.90 MB' }
      ];
    } else if (stepId === 'superstructure') {
      demos = [
        { id: 'sup-1', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600', name: 'Superstructure_Brickwork_Detail.png', size: '3.40 MB' }
      ];
    } else if (stepId === 'lintel-beam') {
      demos = [
        { id: 'lb-1', url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&q=80&w=600', name: 'Lintel_Beam_Reinforcement_Detail.png', size: '2.15 MB' }
      ];
    } else if (stepId === 'staircase') {
      demos = [
        { id: 'st-1', url: 'https://images.unsplash.com/photo-1563911302283-d2bc1d9e2659?auto=format&fit=crop&q=80&w=600', name: 'Staircase_Structure_Reinforcement_Detail.png', size: '2.15 MB' }
      ];
    }

    setModuleImages(prev => ({
      ...prev,
      [getStepKey(stepId)]: demos
    }));
    setErrorStatus('');
  };

  // Step 9 Submission (Runs Cost Takeoff, then submits and finishes instantly)
  const handleCalculateCost = () => {
    setErrorStatus('');
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
  };

  // Inline SVG render helper depending on the drawing type ID
  const renderCardSVG = (id: string, active: boolean) => {
    const strokeColor = active ? 'text-[#00cfa5]' : 'text-slate-400';
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
      case 'superstructure':
        // Brickwork visual layout
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'lintel-beam':
        // Lintel structure beam layout
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M3 16h18M5 5v14M11 5v14M19 5v14" />
          </svg>
        );
      case 'staircase':
        // Staircase structural visual
        return (
          <svg className={`w-8 h-8 ${strokeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 6h-4v4h-4v4H7v4H3m16-12h2m-6 4h4m-8 4h4m-8 4h4" />
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
      {/* Back to Dashboard Link Anchor */}
      <div className="mb-6">
        <button
          onClick={onCancel}
          className="group flex items-center text-xs font-semibold text-slate-500 hover:text-[#00cfa5] tracking-wider uppercase gap-1.5 transition-colors cursor-pointer bg-transparent border-0 outline-none"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Main Panel progress step visualizer header */}
      <div className="mb-6 bg-white border border-slate-200/50 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center relative select-none">
        {currentStep === 1 ? (
          /* Step 1 emblem circle */
          <div className="w-12 h-12 rounded-full bg-[#00cfa5] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4 transition-transform hover:scale-105 duration-250">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        ) : (
          /* Multi-step 3-circle indicator exactly matching the AssessMax screenshots */
          <div className="flex items-center justify-center mb-4 select-none">
            {/* Circle 1: Uploading Drawings phase (Active when uploading, green checkmark when results are ready) */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
              stepState === 'results' || currentStep === transitionStepNumber 
                ? 'bg-[#00cfa5] text-white shadow-md shadow-emerald-450/10' 
                : 'bg-[#00cfa5] text-white shadow-lg shadow-emerald-500/30'
            }`}>
              {stepState === 'results' || currentStep === transitionStepNumber ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            
            {/* Connecting line 1 to 2 */}
            <div className={`h-0.5 sm:h-1 w-12 sm:w-16 transition-colors duration-300 ${
              stepState === 'results' || currentStep === transitionStepNumber ? 'bg-[#00cfa5]' : 'bg-slate-200'
            }`} />
            
            {/* Circle 2: Detailed Quantity Results phase */}
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
              stepState === 'results' || currentStep === transitionStepNumber 
                ? 'bg-[#00cfa5] text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-slate-100 text-slate-400'
            }`}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            {/* Connecting line 2 to 3 */}
            <div className="h-0.5 sm:h-1 w-12 sm:w-16 bg-slate-200" />
            
            {/* Circle 3: Inactive price estimate */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-base sm:text-lg font-bold">
              ₹
            </div>
          </div>
        )}
        
        {/* Progress horizontal line with modern gradient */}
        <div className="w-full max-w-xl h-1.5 bg-slate-100/90 rounded-full mb-4 overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500" 
            style={{ width: `${(currentStep / totalStepsInTitle) * 100}%` }}
          />
        </div>
 
        {/* Step details text */}
        <p className="text-xs sm:text-sm text-slate-500 tracking-wide">
          {currentStep === 1 ? (
            <span>Step 1 of {totalStepsInTitle} {floorsCount > 1 ? `(Floor ${currentFloorIndex}/${floorsCount})` : ''} : <span className="font-bold text-slate-800">Select Module</span></span>
          ) : currentStep === transitionStepNumber ? (
            <span>Step {totalStepsInTitle} of {totalStepsInTitle} : <span className="font-bold text-slate-800">Floor Transition</span></span>
          ) : (
            <span>Floor {currentFloorIndex} of {floorsCount} - Step {currentStep} of {totalStepsInTitle} : <span className="font-bold text-slate-800">{currentUploadStep?.title}</span></span>
          )}
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
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00cfa5] flex items-center justify-center flex-shrink-0">
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
              {floorsCount > 1 && (
                <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl px-4 py-3 flex items-center justify-between text-emerald-800 animate-fade-in shadow-inner">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold tracking-wider uppercase flex items-center gap-1">
                      Active Floor Target: <span className="font-extrabold text-teal-900 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-150">Floor {currentFloorIndex}</span> of {floorsCount}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-600/10 text-emerald-700 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {currentFloorIndex === 1 ? 'Foundation & Base' : `Upper Structural Level ${currentFloorIndex}`}
                  </span>
                </div>
              )}

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
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-[#00cfa5] focus:border-[#00cfa5] focus:bg-white transition-all cursor-pointer appearance-none"
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
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-[#00cfa5] focus:border-[#00cfa5] focus:bg-white transition-all placeholder-slate-400"
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
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-3 pr-10 focus:outline-none focus:ring-1 focus:ring-[#00cfa5] focus:border-[#00cfa5] focus:bg-white transition-all cursor-pointer appearance-none"
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
                    const isLockedType = card.id === 'superstructure' || card.id === 'lintel-beam' || card.id === 'staircase';
                    const isNotApplicableForFloor = currentFloorIndex > 1 && (card.id === 'foundation' || card.id === 'plinth-beam');
                    
                    const coreIds = currentFloorIndex > 1
                      ? ['floor-beam', 'floor-slab', 'columns']
                      : ['foundation', 'plinth-beam', 'floor-beam', 'floor-slab', 'columns'];
                    const isAllCoreSelected = coreIds.every((id) => selectedDrawingTypeIds.includes(id));
                    const isDisabledView = (isLockedType && !isAllCoreSelected) || isNotApplicableForFloor;

                    return (
                      <div
                        key={card.id}
                        onClick={() => handleToggleCard(card.id)}
                        className={`border rounded-xl p-5 select-none transition-all duration-250 ${
                          isNotApplicableForFloor
                            ? 'border-slate-200/60 bg-slate-50/50 opacity-45 cursor-not-allowed'
                            : isDisabledView
                            ? 'border-slate-200/60 bg-slate-50/50 opacity-45 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#00cfa5] bg-emerald-50/10 shadow-md shadow-emerald-500/5 cursor-pointer'
                            : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                           <div className={`p-2.5 rounded-lg ${
                            isDisabledView 
                              ? 'bg-slate-100/50 text-slate-300' 
                              : isSelected 
                              ? 'bg-[#00cfa5]/10 text-emerald-600' 
                              : 'bg-slate-50 text-slate-400'
                          }`}>
                            {renderCardSVG(card.id, isSelected && !isDisabledView)}
                          </div>
                          
                          {/* Interactive check bubble or lock icon */}
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                            isDisabledView
                              ? 'bg-slate-100 border-slate-200 text-slate-400'
                              : isSelected
                              ? 'bg-white border-[#00cfa5] text-[#00cfa5]'
                              : 'border-slate-300'
                          }`}>
                            {isNotApplicableForFloor ? (
                              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            ) : isDisabledView ? (
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
                            ? 'text-[#00cfa5]'
                            : 'text-slate-800'
                        }`}>
                          {card.title} {isNotApplicableForFloor ? (
                            <span className="text-[9px] font-bold text-amber-600/80 ml-1 select-none">(Completed Ground)</span>
                          ) : isDisabledView ? (
                            <span className="text-[9px] font-semibold text-rose-500/80 ml-1 select-none">(Locked)</span>
                          ) : null}
                        </h4>
                        <p className="text-xs text-slate-450 mt-1 leading-snug">
                          {isNotApplicableForFloor 
                            ? 'Foundational work is completed at ground level. Not required for upper floors.' 
                            : isDisabledView 
                            ? 'Complete initial structural selection first.' 
                            : card.description}
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
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2-9: Dynamic Multi-Step Image Upload Interfaces */}
        {currentStep >= 2 && currentStep <= (totalWizardSteps + 1) && stepState === 'upload' && (
          <div>
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 animate-pulse">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight font-sans">
                  Upload {currentUploadStep?.displayId} Diagram
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload a floor plan, structural drawing, or site plan
                </p>
              </div>
            </div>

            <form onSubmit={handleNextStep} className="space-y-6">
              
              {/* Image drag-and-drop region */}
              <div
                onClick={() => document.getElementById(`file-uploader-${currentUploadStep?.id}`)?.click()}
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
                  id={`file-uploader-${currentUploadStep?.id}`}
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
                    Drop your diagram here
                  </p>
                  <p className="text-xs text-slate-450 font-medium">
                    or click to browse (JPEG, PNG, WEBP, PDF)
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
                              if (currentUploadStep) {
                                setModuleImages(prev => ({
                                  ...prev,
                                  [currentUploadStep.id]: (prev[currentUploadStep.id] || []).filter(item => item.id !== img.id)
                                }));
                              }
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
                        <p className="text-xs font-bold text-slate-850 truncate mb-0.5" title={img.name}>
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
                  <p className="text-[10px] text-slate-400 mt-0.5">Drop files or click standard mockup blueprints to load sample vector templates.</p>
                </div>
              )}

              {/* Navigation button set down keel with layered layout exactly matching the screenshots */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 select-none">

                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 px-8 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Upload and Estimate →
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 2-9 RESULTS: Adaptive Estimation Results */}
        {(currentStep >= 2 && currentStep <= (totalWizardSteps + 1) && stepState === 'results') && (() => {
          const activeStepId = currentUploadStep ? currentUploadStep.id : undefined;
          const displayTitle = `Estimation Results: ${currentUploadStep?.title}`;
          const displaySubtitle = `Detailed quantity takeoff generated specifically for the ${currentUploadStep?.title} module.`;
          
          const imagesToDisplay = uploadedImages;
          const dataRows = getDynamicQuantities(activeStepId);

          return (
            <div className="animate-fade-in select-none text-left">
              {/* Header section of the Results card */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 mb-6 font-sans">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/10">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">{displayTitle}</h2>
                    <p className="text-xs text-slate-500 mt-1">{displaySubtitle}</p>
                  </div>
                </div>
                
                {/* Download Excel Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8," 
                        + "Item,Quantity,Unit\n"
                        + dataRows.map(e => `"${e.item}",${e.quantity},"${e.unit}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `${projectName ? projectName.replace(/\s+/g, '_') : 'Project'}_${currentUploadStep?.displayId || 'Sub'}_Takeoff.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="inline-flex items-center gap-2 border border-slate-200 py-2.5 px-5 rounded-full hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-all shadow-sm bg-white cursor-pointer select-none text-slate-700"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Excel
                  </button>
                </div>
              </div>

              {/* List of processed blueprints with visual check marks, proving estimation is done specifically for given images */}
              <div className="mb-6 bg-violet-50/20 border border-violet-100/70 rounded-2xl p-4 font-sans shadow-sm">
                <p className="text-xs font-bold text-violet-850 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Est. Calculated Strictly From Scanned Blueprint Drawing Image(s):
                </p>
                <div className="flex flex-wrap gap-2">
                  {imagesToDisplay.map((img) => (
                    <div key={img.id} className="inline-flex items-center gap-1.5 text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-slate-150 shadow-sm animate-fade-in">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00cfa5]" />
                      <span className="font-semibold text-slate-855 truncate max-w-[200px]">{img.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({img.size})</span>
                    </div>
                  ))}
                  {imagesToDisplay.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No custom blueprints uploaded. Direct structural index defaults loaded.</p>
                  )}
                </div>
              </div>



              {/* Quantities Table Container matching table in screenshot 2 */}
              <div className="border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm mb-6 max-h-[480px] overflow-y-auto">
                <table className="w-full text-left border-collapse font-sans">
                  <thead>
                    <tr className="bg-[#4c3e80] text-white">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-left">Item</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right">Quantity</th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right pr-12">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {dataRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-violet-50/20 transition-colors duration-150">
                        <td className="py-3.5 px-6 text-sm font-semibold text-slate-850">{row.item}</td>
                        <td className="py-3.5 px-6 text-sm font-bold text-slate-900 text-right font-mono">{row.quantity}</td>
                        <td className="py-3.5 px-6 text-sm font-medium text-slate-500 text-right font-mono pr-12">{row.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Footer Back & Create buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 font-sans">
                
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === (totalWizardSteps + 1)) {
                      if (hasTransitionStep) {
                        setCurrentStep(transitionStepNumber);
                        setStepState('upload');
                      } else {
                        handleCalculateCost();
                      }
                    } else {
                      setStepState('upload');
                      setCurrentStep(currentStep + 1);
                    }
                  }}
                  className="flex-1 sm:max-w-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {currentStep === (totalWizardSteps + 1) ? (hasTransitionStep ? "Next Floor >" : "Calculate Cost >") : `Continue to ${activeUploadSteps[currentStep - 1]?.title || 'Next Step'} >`}
                </button>
              </div>
            </div>
          );
        })()}

        {/* STEP 10: Floor Transition */}
        {currentStep === transitionStepNumber && (
          <div className="text-center py-10 px-4 font-sans max-w-lg mx-auto animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00cfa5] flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-3">
              Floor {currentFloorIndex} Estimation Complete!
            </h3>
            
            <p className="text-sm text-slate-500 leading-relaxed mb-8">
              All {totalWizardSteps} structural modules and quantities have been successfully estimated for your <strong>Floor {currentFloorIndex} level</strong>. Since your project is configured with <strong>{floorsCount} floors</strong>, you will now proceed to configure and estimate details for <strong>Floor {currentFloorIndex + 1}</strong>.
            </p>
            
            <button
              type="button"
              onClick={() => {
                const nextFloor = currentFloorIndex + 1;
                setCurrentFloorIndex(nextFloor);
                setCurrentStep(1);
                setStepState('upload');
                // Pre-remove foundation and plinth beam as we transition to upper level
                setSelectedDrawingTypeIds(prev => prev.filter(id => id !== 'foundation' && id !== 'plinth-beam'));
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-4 px-8 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10 active:scale-95 transition-all text-center cursor-pointer flex items-center justify-center gap-2"
            >
              Configure Floor {currentFloorIndex + 1} <span className="font-semibold text-emerald-100">→</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

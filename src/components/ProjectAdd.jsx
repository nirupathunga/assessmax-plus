// @ts-nocheck
import React from "react";
import { useEffect, useState } from "react";
import { DropdownInput, TextInput } from "../../../shared/form/FormInput";
import { CalculatorIcon, CircleTickIcon, ClientIcon, DiagramIcon, FileTextIcon, FolderIcon, LeftArrowIcon, LeftChevronIcon, RightArrowIcon, RightChevronIcon, RupeeIcon, UploadFileIcon } from "../../../shared/icons/Icons";
import { Validators } from "../../../shared/utils/Validators";

import './ProjectAdd.scss';
import { Button } from "react-bootstrap";
import { clientsList, foundationEstimationResult, gfBeamEstimationResult, gfColumnEstimationResult, gfSlabEstimationResult, lintelBeamEstimationResult, plinthEstimationResult, projectAdd, projectEstimation, projectResumeDetail, runStaircaseEstimationResult, wfdEstimationResult } from "../../../shared/settings/apiConfig";
import { getApi, postApi } from "../../../shared/services/apiHelper";

const stepTitles = [
    {
        module: "Project",
        steps: [
            { id: 1, label: "Project Create", type: "project" }
        ]
    },
    {
        module: "foundation",
        steps: [
            { id: 2, label: "Upload Foundation", type: "upload" },
            { id: 3, label: "Foundation Estimation", type: "estimation" },
            { id: 4, label: "Foundation Cost", type: "cost" }
        ]
    },
    {
        module: "plinth_beam",
        steps: [
            { id: 5, label: "Upload Plinth Beam", type: "upload" },
            { id: 6, label: "Plinth Beam Estimation", type: "estimation" },
            { id: 7, label: "Plinth Beam Cost", type: "cost" }
        ]
    },
    {
        module: "gfb",
        steps: [
            { id: 8, label: "Upload GF Beam", type: "upload" },
            { id: 9, label: "GF Beam Estimation", type: "estimation" },
            { id: 10, label: "GF Beam Cost", type: "cost" }
        ]
    },
    {
        module: "gfslab",
        steps: [
            { id: 11, label: "Upload GF Slab", type: "upload" },
            { id: 12, label: "GF Slab Estimation", type: "estimation" },
            { id: 13, label: "GF Slab Cost", type: "cost" }
        ]
    },
    {
        module: "lb",
        steps: [
            { id: 14, label: "Upload Lintel Beam", type: "upload" },
            { id: 15, label: "Lintel Beam Estimation", type: "estimation" },
            { id: 16, label: "Lintel Beam Cost", type: "cost" }
        ]
    },
    {
        module: "column",
        steps: [
            { id: 17, label: "Upload GF Column", type: "upload" },
            { id: 18, label: "GF Column Estimation", type: "estimation" },
            { id: 19, label: "GF Column Cost", type: "cost" }
        ]
    },
    {
        module: "wfd",
        steps: [
            { id: 20, label: "Upload WFD", type: "upload" },
            { id: 21, label: "WFD Estimation", type: "estimation" },
            { id: 22, label: "WFD Cost", type: "cost" }
        ]
    },
    {
        module: "staircase",
        steps: [
            { id: 23, label: "Upload Staircase", type: "upload" },
            { id: 24, label: "Staircase Estimation", type: "estimation" },
            { id: 25, label: "Staircase Cost", type: "cost" }
        ]
    }
];

const MODULES = [
    { key: "foundation", label: "Foundation", estimationApi: foundationEstimationResult, costApi: foundationEstimationResult },
    { key: "plinth_beam", label: "Plinth Beam", estimationApi: plinthEstimationResult, costApi: plinthEstimationResult },
    { key: "gfb", label: "GF Beam", estimationApi: gfBeamEstimationResult, costApi: gfBeamEstimationResult },
    { key: "gfslab", label: "GF Slab", estimationApi: gfSlabEstimationResult, costApi: gfSlabEstimationResult },
    { key: "lb", label: "Lintel Beam", estimationApi: lintelBeamEstimationResult, costApi: lintelBeamEstimationResult },
    { key: "column", label: "GF Column", estimationApi: gfColumnEstimationResult, costApi: gfColumnEstimationResult },
    { key: "wfd", label: "WFD", estimationApi: wfdEstimationResult, costApi: wfdEstimationResult },
    { key: "staircase", label: "Staircase", estimationApi: runStaircaseEstimationResult, costApi: runStaircaseEstimationResult }
];

const resumeStepMap = {
    foundation: 2,
    plinth_beam: 5,
    gfb: 8,
    gfslab: 11,
    lb: 14,
    column: 17,
    wfd: 20,
    staircase: 23
};

export default function ProjectAdd(props) {
    const isEdit = props.location.pathname.includes('edit');
    const projectId = props.location.pathname.includes('new') ? '' : props?.match?.params?.id;

    const [initialLoading, setInitialLoading] = useState(isEdit);

    const [currentStep, setCurrentStep] = useState(1);

    const [projectFormData, setProjectFormData] = useState({
        client_id: { value: "", valid: false, error: "", validators: [Validators.required()] },
        name: { value: "", valid: false, error: "", validators: [Validators.required()] },
        project_id: { value: "", valid: false, error: "", validators: [] },
        estimation_id: { value: "", valid: false, error: "", validators: [] },
    });

    const [images, setImages] = useState({
        foundation: [],
        plinth_beam: [],
        gfb: [],
        gfslab: [],
        lb: [],
        column: [],
        wfd: [],
        staircase: []
    });

    const [results, setResults] = useState({
        foundation: {
            summary: null,
            excel_url: null,
            cost: null
        },
        plinth_beam: {
            summary: null,
            excel_url: null,
            cost: null
        },
        gfb: {
            summary: null,
            excel_url: null,
            cost: null
        },
        gfslab: {
            summary: null,
            excel_url: null,
            cost: null
        },
        lb: {
            summary: null,
            excel_url: null,
            cost: null
        },
        column: {
            summary: null,
            excel_url: null,
            cost: null
        },
        wfd: {
            summary: null,
            excel_url: null,
            cost: null
        },
        staircase: {
            summary: null,
            excel_url: null,
            cost: null
        }
    });

    const [clientOptions, setClientOptions] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [pendingModules, setPendingModules] = useState([]);

    const currentGroup = React.useMemo(() => {
        return stepTitles.find(group =>
            group.steps.some(step => step.id === currentStep)
        );
    }, [currentStep]);

    const getCurrentModuleIndex = () => {
        return stepTitles.findIndex(group =>
            group.steps.some(step => step.id === currentStep)
        ) + 1;
    };

    const currentStepData = currentGroup?.steps.find(s => s.id === currentStep);

    const moduleKey = currentGroup?.module;
    const stepType = currentStepData?.type;
    const stepLabel = currentStepData?.label;

    const totalSteps = React.useMemo(() => 
        stepTitles.flatMap(g => g.steps).length
    , []);

    const totalModules = stepTitles.length;

    const percentage = Math.round((currentStep / totalSteps) * 100);
    
    useEffect(() => {
        getApi(clientsList).then(response => {
            setClientOptions(response.data.data.map(client => { return { id: client.id, value: client.name } }));
        }).catch(error => {
            console.log(error);
        });
    }, []);

    useEffect(() => {
        if (projectId && isEdit) {
            setInitialLoading(true);
            getApi(`${projectResumeDetail}/${projectId}`).then((response) => {
                let data = response.data;
                setPendingModules(data.pending_modules || []);
                setProjectFormData(prevState => {
                    return Validators.validateAndSetAllFormControls(prevState, data)
                })

                if (data.resume_from) {
                    const step = resumeStepMap[data.resume_from] || 1;
                    setCurrentStep(step);
                }

                setInitialLoading(false);
            }).catch((error) => {
                console.log(error);
                setInitialLoading(false);
            });
        }
    }, [projectId, isEdit]);

    const onChangeProject = (type, event) => {
        let formControl = { ...projectFormData };
        let inputValue = '';

        if (type == 'name') {
            inputValue = event.target.value;
        } else {
            inputValue = event;
        }

        setProjectFormData(() => {
            return {
                ...formControl,
                [type]: Validators.validateFormControl(formControl[type], inputValue)
            }
        });
    }

    const nextStep = () => {
        if (currentStep === 1) {
            return isEdit ? setCurrentStep(2) : createProject();
        }

        if (currentStepData?.type === "upload") {
            return uploadDiagram();
        }

        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const createProject = () => {
        let data = {
            client_id: projectFormData.client_id.value,
            name: projectFormData.name.value,
        }
        postApi(projectAdd, data).then(response => {
            if (response.status == 200) {
                setProjectFormData(prev => ({
                    ...prev,
                    project_id: {
                        ...prev.project_id,
                        value: response.data.id
                    }
                }));
                setCurrentStep(prevStep => prevStep + 1);
                setButtonLoading(false);
            } else {
                setButtonLoading(false);
            }
        }).catch(error => {
            setButtonLoading(false);
            setErrorMessage(error.response.data.detail);
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        });
    }

    const openMediaPicker = (type) => {
        let input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = "image/*,application/pdf";

        input.onchange = event => {
            const files = Array.from(event.target.files || []);
            if (files.length > 0) {
                onChangeImage(files, type);
            }
        };

        input.click();
    };

    const onChangeImage = (files, type) => {
        const readers = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64 = reader.result;

                    resolve({
                        name: file.name,
                        type: file.type,
                        preview: file.type.includes("image") ? base64 : null,
                        file: base64.replace(/^data:.*;base64,/, "")
                    });
                };

                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(results => {
            setImages(prev => ({...prev, [type]: results}));
        });
    };

    const uploadDiagram = async () => {
        const uploadedImages = images[moduleKey].map(file => file.file);
        setButtonLoading(true);

        let data = {
            client_id: projectFormData.client_id.value,
            name: projectFormData.name.value,
            project_id: isEdit ? projectId : projectFormData.project_id.value,
            images: uploadedImages,
            module: moduleKey,
            status: "pending"
        }
        try {
            const response = await postApi(projectEstimation, data);

            if (response.status == 200) {
                setProjectFormData(prev => ({
                    ...prev,
                    estimation_id: {
                        ...prev.estimation_id,
                        value: response.data.id
                    }
                }));            
                setButtonLoading(false);
                
                await calculateEstimate(response.data, moduleKey);

            } else {
                setButtonLoading(false);
            }
        }
        catch (error) {            
            console.log(error);
            setButtonLoading(false);
        }  
    };

    const calculateEstimate = async (estimationData, moduleKey) => {
        const module = MODULES.find(m => m.key === moduleKey);

        setButtonLoading(true);

        let data = {
            estimation_id: estimationData.id,
            project_id: isEdit ? projectId : projectFormData.project_id.value,
            image_urls: estimationData.images,
        };

        await postApi(module.estimationApi, data).then(response => {
            if (response.status === 200) {
                setProjectFormData(prev => ({
                    ...prev,
                    [`${moduleKey}EstimationData`]: {
                        ...prev[`${moduleKey}EstimationData`],
                        value: response.data.summary
                    }
                }));
                setResults(prev => ({
                    ...prev,
                    [moduleKey]: {
                        summary: response.data.metrics,
                        excel_url: response.data.excel_url
                    }
                }));
                setCurrentStep(prev => prev + 1);
                moveToNextPendingModule();
            }
            setButtonLoading(false);
        })
        .catch(error => {
            setButtonLoading(false);
            setErrorMessage(error.response.data.detail);
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        });
    };

    const calculateCost = async () => {
        const module = MODULES.find(m => m.key === moduleKey);

        setButtonLoading(true);

        let data = {
            estimation_id: projectFormData.estimation_id.value,
            project_id: isEdit ? projectId : projectFormData.project_id.value
        };

        await postApi(module.costApi, data).then(response => {
            if (response.status === 200) {
                setProjectFormData(prev => ({
                    ...prev,
                    [`${moduleKey}CostData`]: {
                        ...prev[`${moduleKey}CostData`],
                        value: response.data.summary
                    }
                }));
                setResults(prev => ({
                    ...prev,
                    [moduleKey]: {
                        summary: response.data.metrics,
                        excel_url: response.data.excel_url
                    }
                }));
                setCurrentStep(prev => prev + 1);
            }
            setButtonLoading(false);
        })
        .catch(error => {
            setButtonLoading(false);
            setErrorMessage(error.response.data.detail);
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        });
    };

    const downloadFile = () => {
        const data = results[moduleKey];

        if (!data?.excel_url) return;

        const a = document.createElement("a");
        a.href = data.excel_url;
        a.setAttribute("download", "");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const skipModule = () => {
        moveToNextPendingModule();
    };

    const renderSummaryRows = (data) => {
        if (!data || !Array.isArray(data)) return null;

        return data.map((item, index) => (
            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4 text-xs font-semibold text-slate-800">{item.label}</td>
                <td className="py-3 px-4 text-xs font-bold font-mono text-slate-950 text-right">{item.quantity}</td>
                <td className="py-3 px-4 text-xs font-medium text-slate-500 text-center">{item.unit}</td>
            </tr>
        ));
    };

    const moveToNextPendingModule = () => {
        if (!pendingModules.length) return;

        const currentModuleIndex = pendingModules.indexOf(moduleKey);

        const nextModuleKey = pendingModules[currentModuleIndex + 1];

        if (nextModuleKey) {
            const nextStep = resumeStepMap[nextModuleKey];
            setCurrentStep(nextStep);
        } else {
            console.log("All pending modules completed");
        }
    };

    const handleNext = () => {
        if (currentStep === totalSteps) {
            props.history.push("/projects");
        } else {
            setCurrentStep(prev => prev + 1);
        }
    }

    // Interactive progress counts for Dashboard tracking
    const totalFilesUploaded = React.useMemo(() => {
        return Object.values(images).reduce((acc, curr) => acc + (curr?.length || 0), 0);
    }, [images]);

    const completedModulesCount = React.useMemo(() => {
        return MODULES.filter(m => results[m.key]?.summary !== null).length;
    }, [results]);

    const activeProjectName = projectFormData.name.value || "Draft Structural Blueprint";
    const activeClientOption = clientOptions.find(opt => opt.id === projectFormData.client_id.value);
    const activeClientName = activeClientOption ? activeClientOption.value : "Pending Designation";

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-4 md:p-8 font-sans overflow-y-auto">
            {initialLoading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <img className="loader-icon w-12 h-12 animate-spin duration-1500" src={`${process.env.PUBLIC_URL}/static/images/loader.svg`} alt="loading" />
                        <span className="text-xs font-medium text-slate-500 tracking-wider uppercase">Fetching Workspace Elements</span>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Upper Elegant Header Bar */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <span className="bg-[#00cfa5]/10 text-[#00cfa5] text-[10px] font-bold px-2 px-2.5 py-1 rounded-full uppercase tracking-wider select-none border border-[#00cfa5]/20">
                                    QUANTITIES REDISTRIBUTION WORKSPACE
                                </span>
                            </div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">{isEdit ? "Refine Project Blueprint" : "Onboard Project Blueprint"}</h1>
                            <p className="text-xs text-slate-500 mt-1">Interactive takeoff estimator following regional IS codes and reinforcement specifications.</p>
                        </div>
                    </div>

                    {/* Dashboard Stepper Strip displaying active steps of group */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-700 hidden sm:block">
                                    <FolderIcon />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ACTIVE INTENSIVE PHASE</span>
                                    <div className="text-base font-bold text-slate-900">
                                        Module: <span className="text-[#00cfa5] capitalize">{moduleKey || "Initialization"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Center Stepper Indicators */}
                            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto py-1 justify-start md:justify-center">
                                {currentGroup?.steps.map((step, index) => {
                                    let IconComponent = UploadFileIcon;
                                    if (step.type === "estimation") IconComponent = CalculatorIcon;
                                    if (step.type === "cost") IconComponent = RupeeIcon;

                                    const isCompleted = currentStep > step.id;
                                    const isActive = currentStep === step.id;

                                    return (
                                        <React.Fragment key={step.id}>
                                            <div className="flex items-center gap-2.5">
                                                <div 
                                                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                                        isCompleted 
                                                            ? "bg-[#00cfa5] text-white shadow-md shadow-[#00cfa5]/10" 
                                                            : isActive 
                                                                ? "bg-[#00cfa5]/10 border-2 border-[#00cfa5] text-[#00cfa5] scale-105" 
                                                                : "bg-slate-55 border border-slate-200 text-slate-400"
                                                    }`}
                                                >
                                                    {isCompleted ? <CircleTickIcon /> : <IconComponent />}
                                                </div>
                                                <span className={`text-xs font-bold tracking-tight hidden lg:inline whitespace-nowrap ${
                                                    isActive ? "text-slate-900" : isCompleted ? "text-slate-600" : "text-slate-400"
                                                }`}>
                                                    {step.label}
                                                </span>
                                            </div>

                                            {index !== currentGroup.steps.length - 1 && (
                                                <div className={`w-8 h-0.5 rounded ${isCompleted ? "bg-[#00cfa5]" : "bg-slate-205"}`} />
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            <div className="text-right whitespace-nowrap self-end md:self-center">
                                <div className="text-xs font-medium text-slate-500">Workspace Complete</div>
                                <div className="text-lg font-bold text-slate-950">{percentage}%</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#00cfa5] to-teal-500 transition-all duration-500" style={{ width: `${percentage}%` }} />
                        </div>
                    </div>

                    {/* Core Grid Panel */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Main Interactive Card Workflow - takes 8 columns */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* ERROR MESSAGE STRIP */}
                            {errorMessage && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-medium">
                                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* STEP 1: INITIALIZE PROJECT */}
                            {currentStep === 1 && (
                                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#00cfa5]/10 rounded-xl text-[#00cfa5]">
                                            <FolderIcon />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-extrabold text-slate-900">Initialize Take-off Workspace</h3>
                                            <p className="text-xs text-slate-500">Provide blueprint characteristics and select developer client details to formulate records.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-widest">
                                                <ClientIcon />
                                                <span>Select Client *</span>
                                            </div>
                                            <DropdownInput 
                                                name="client_id" 
                                                defaultValue="clientName" 
                                                value={projectFormData.client_id.value} 
                                                options={clientOptions} 
                                                onChange={(value) => onChangeProject('client_id', value)} 
                                                error={projectFormData.client_id.error} 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <TextInput 
                                                name="name" 
                                                label="Project Name" 
                                                value={projectFormData.name.value} 
                                                error={projectFormData.name.error} 
                                                onChange={(event) => { onChangeProject('name', event) }} 
                                                isMandatory 
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button 
                                            onClick={nextStep} 
                                            disabled={buttonLoading}
                                            className="w-full bg-gradient-to-r from-[#00cfa5] to-teal-600 hover:from-[#05be99] hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#00cfa5]/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {buttonLoading ? "Creating..." : isEdit ? "Proceed" : "Create Project Blueprint"}
                                            <RightArrowIcon />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP TYPE: UPLOAD BLUEPRINT DRAWINGS */}
                            {stepType === "upload" && (
                                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#00cfa5]/10 rounded-xl text-[#00cfa5]">
                                                <UploadFileIcon />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-extrabold text-[#00cfa5] capitalize">Upload {moduleKey} Drawings</h3>
                                                <p className="text-xs text-slate-500">Provide reinforcement maps, section detail blueprints, or plans for this phase.</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold bg-[#00cfa5]/10 border border-[#00cfa5]/30 text-[#00cfa5] px-2 py-1 rounded">
                                            MAX 20MB
                                        </span>
                                    </div>

                                    {/* Upload Interaction Field */}
                                    <div 
                                        onClick={() => openMediaPicker(moduleKey)}
                                        className="border-2 border-dashed border-slate-200 hover:border-[#00cfa5] bg-slate-50/50 hover:bg-[#00cfa5]/5 rounded-2xl p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
                                    >
                                        {images[moduleKey]?.length > 0 ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                                                {images[moduleKey].map((file, i) => (
                                                    <div key={i} className="relative aspect-video rounded-xl border border-slate-220 overflow-hidden bg-white shadow-sm flex flex-col items-center justify-center p-2">
                                                        {file.preview ? (
                                                            <img src={file.preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
                                                        ) : file.type === "application/pdf" ? (
                                                            <div className="flex flex-col items-center justify-center text-[#00cfa5] space-y-1">
                                                                <FileTextIcon />
                                                                <span className="text-[10px] font-medium text-slate-600 truncate max-w-full px-2">{file.name}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="text-[10px] text-slate-400 truncate">{file.name}</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-3.5">
                                                <div className="p-4 bg-white border border-slate-200 text-slate-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto shadow-sm group-hover:text-[#00cfa5] group-hover:border-[#00cfa5]/50 transition-colors">
                                                    <DiagramIcon />
                                                </div>
                                                <div className="space-y-1">
                                                    <h5 className="font-extrabold text-slate-800 text-sm">Select architectural or CAD blueprint files</h5>
                                                    <p className="text-xs text-slate-400">Click to browse or drop items into active module frame (JPEG, PNG, WEBP, PDF)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer buttons layout */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                        <button 
                                            onClick={skipModule}
                                            className="flex items-center justify-center gap-1 bg-white hover:bg-slate-50 border border-slate-205 text-slate-600 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all sm:w-1/4 cursor-pointer"
                                        >
                                            Skip Module
                                            <RightChevronIcon />
                                        </button>
                                        <button 
                                            disabled={buttonLoading || !images[moduleKey]?.length}
                                            onClick={uploadDiagram}
                                            className={`flex-1 flex items-center justify-center gap-1.5 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider text-white shadow-lg shadow-[#00cfa5]/10 active:scale-95 transition-all cursor-pointer ${
                                                images[moduleKey]?.length 
                                                    ? "bg-gradient-to-r from-[#00cfa5] to-teal-600 hover:from-[#05be99] hover:to-teal-500" 
                                                    : "bg-slate-300 cursor-not-allowed"
                                            }`}
                                        >
                                            {buttonLoading ? "Running Estimator..." : "Upload and Calculate Quantity"}
                                            <RightChevronIcon />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP TYPE: ESTIMATION QUANTITY TAKEOFF RESULT */}
                            {stepType === "estimation" && (
                                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                                        <div className="flex items-center gap-3.5">
                                            <div className="p-3 bg-[#00cfa5]/10 rounded-xl text-[#00cfa5]">
                                                <CalculatorIcon />
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="text-lg font-extrabold text-slate-900">Quantities Extraction Draft</h3>
                                                <p className="text-xs text-slate-500">Material volumetric computations based on structural schedule details.</p>
                                            </div>
                                        </div>
                                        {results[moduleKey]?.excel_url && (
                                            <button 
                                                onClick={downloadFile}
                                                className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-center"
                                            >
                                                <FileTextIcon />
                                                <span>Download Spreadsheet (XLSX)</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Brief overview note description */}
                                    <div className="text-xs leading-relaxed text-slate-500 border-l-4 border-[#00cfa5] bg-slate-50 p-4 rounded-r-xl">
                                        Concrete volumetric counts, soil excavation depth parameters, and reinforcement schedules were generated specifically for this structural module frame. Real-world estimations comply strictly with Indian aggregate specifications.
                                    </div>

                                    {/* Quantities Bento Row Highlight Metrics Panel */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                                        <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50 space-y-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TAKEOFF POINTS</span>
                                            <div className="text-lg font-extrabold text-slate-950">{results[moduleKey]?.summary?.length || 0} items</div>
                                        </div>
                                        <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50 space-y-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ACTIVE CATEGORY</span>
                                            <div className="text-lg font-extrabold text-[#00cfa5] capitalize truncate">{moduleKey}</div>
                                        </div>
                                        <div className="border border-slate-150 p-4 rounded-xl bg-slate-50/50 space-y-1 col-span-2 sm:col-span-1">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">TARGET CODE</span>
                                            <div className="text-lg font-extrabold text-slate-950">IS:456-2000</div>
                                        </div>
                                    </div>

                                    {/* Table view */}
                                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                                    <th className="py-3.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Parameter</th>
                                                    <th className="py-3.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Computed Quantity</th>
                                                    <th className="py-3.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Unit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {renderSummaryRows(results[moduleKey]?.summary) || (
                                                    <tr>
                                                        <td colSpan={3} className="py-8 text-center text-xs text-slate-400 font-medium">No computed takeoff details active. Click back.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Action Footers */}
                                    <div className="flex justify-between items-center gap-4 pt-4">
                                        <button 
                                            onClick={prevStep}
                                            disabled={buttonLoading}
                                            className="bg-white hover:bg-slate-50 border border-slate-250 text-slate-600 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                        >
                                            <LeftArrowIcon />
                                            <span>Back</span>
                                        </button>
                                        <button 
                                            onClick={calculateCost}
                                            disabled={buttonLoading}
                                            className="flex-1 bg-gradient-to-r from-[#00cfa5] to-teal-600 hover:from-[#05be99] hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#00cfa5]/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            {buttonLoading ? "Formulating Rates..." : "Calculate Core Costing Breakdown"}
                                            <RightChevronIcon />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP TYPE: COST BREAKDOWN RESULT */}
                            {stepType === "cost" && (
                                <div className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                                    <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
                                        <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                                            <RupeeIcon />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h3 className="text-lg font-extrabold text-slate-900">Module Cost Valuation</h3>
                                            <p className="text-xs text-slate-500">Scheduled tender rate breakdown matching current specifications.</p>
                                        </div>
                                    </div>

                                    {/* Cost Table list */}
                                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                                    <th className="py-3.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Item Detail</th>
                                                    <th className="py-3.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Extracted Qty</th>
                                                    <th className="py-3.5 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Standard Unit</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {renderSummaryRows(results[moduleKey]?.summary) || (
                                                    <tr>
                                                        <td colSpan={3} className="py-8 text-center text-xs text-slate-400 font-medium">No cost schedules available.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Action Footers */}
                                    <div className="flex justify-between items-center gap-4 pt-4">
                                        <button 
                                            onClick={prevStep}
                                            className="bg-white hover:bg-slate-50 border border-slate-250 text-slate-600 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                        >
                                            <LeftArrowIcon />
                                            <span>Back</span>
                                        </button>
                                        <button 
                                            onClick={handleNext}
                                            className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>{currentStep === totalSteps ? "Archive Workspace" : "Onward to Next Phase"}</span>
                                            <RightChevronIcon />
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Right Sidebar Dossier & Tracking Checklist - takes 4 columns */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* General Blueprint Dossier Info Card */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white border border-slate-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00cfa5]/15 rounded-full blur-2xl pointer-events-none" />
                                
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-bold tracking-widest uppercase bg-[#00cfa5]/20 border border-[#00cfa5]/40 text-[#00cfa5] px-2 py-0.5 rounded">
                                            ACTIVE FILE
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">WORKSPACE IDENTIFIER</span>
                                        <h4 className="text-base font-extrabold text-white truncate" title={activeProjectName}>
                                            {activeProjectName}
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3.5 mt-2">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">CLIENT SEGMENT</span>
                                            <p className="text-xs font-bold text-white truncate" title={activeClientName}>
                                                {activeClientName}
                                            </p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">MEDIA COUNTS</span>
                                            <p className="text-xs font-bold text-white truncate">
                                                {totalFilesUploaded} Drawing(s)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CORE INTENSITY TIMELINE CHECKLIST / TRACKING SYSTEM */}
                            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm space-y-4">
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase">Structural Modules Pipeline</h4>
                                    <p className="text-[10px] text-slate-400">Complete, in analysis, or upcoming milestones.</p>
                                </div>

                                <div className="divide-y divide-slate-100 pt-2">
                                    {MODULES.map((m, idx) => {
                                        const isCompleted = results[m.key]?.summary !== null;
                                        const isActiveModule = m.key === moduleKey;

                                        return (
                                            <div key={m.key} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {/* Status bullet indicators */}
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] transition-all shrink-0 ${
                                                        isCompleted 
                                                            ? "bg-[#00cfa5]/10 text-[#00cfa5] border border-[#00cfa5]/20" 
                                                            : isActiveModule 
                                                                ? "bg-[#00cfa5]/20 text-[#00cfa5] border-2 border-[#00cfa5]" 
                                                                : "bg-slate-55 border border-slate-205 text-slate-400"
                                                    }`}>
                                                        {isCompleted ? "✓" : idx + 1}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className={`text-xs font-bold truncate ${
                                                            isCompleted ? "text-slate-700" : isActiveModule ? "text-[#00cfa5] truncate" : "text-slate-400"
                                                        }`}>
                                                            {m.label}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Badge */}
                                                <div>
                                                    {isCompleted ? (
                                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
                                                            COMPILED
                                                        </span>
                                                    ) : isActiveModule ? (
                                                        <span className="inline-flex items-center bg-[#00cfa5]/10 text-[#00cfa5] border border-[#00cfa5]/25 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none gap-1">
                                                            <span className="w-1 h-1 bg-[#00cfa5] rounded-full animate-ping" />
                                                            ANALYSIS
                                                        </span>
                                                    ) : (
                                                        <span className="bg-slate-100 text-slate-400 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 select-none">
                                                            LOCKED
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

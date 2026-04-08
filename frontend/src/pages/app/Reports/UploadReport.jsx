import React, { useState, useEffect, useRef } from 'react';
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    AlertCircle,
    Search,
    Brain,
    Zap,
    Activity,
    ShieldCheck,
    RefreshCw,
    Loader2,
    Cpu,
    Lock,
    Scan,
    FileSearch,
    Dna
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { reportService } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader, ActionButton } from '../../../components/SharedComponents';

const UploadReport = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStage, setUploadStage] = useState(0); // 0: Idle, 1: OCR, 2: AI, 3: Risk, 4: Done
    const [error, setError] = useState(null);
    const [telemetry, setTelemetry] = useState([]);
    const { user, setLatestAnalysis, setPatientHistory } = useApp();
    const navigate = useNavigate();
    const telemetryRef = useRef(null);
    const simulationRef = useRef(null);

    const stages = [
        { label: 'Neural Extraction', icon: FileSearch, desc: 'Scanning clinical markers and OCR metrics.' },
        { label: 'Cloud-AI Reasoning', icon: Brain, desc: 'Correlating data with medical knowledge base.' },
        { label: 'Biometric Scaling', icon: Dna, desc: 'Calibrating organ health index & risk scores.' },
        { label: 'Neural Protocol', icon: Zap, desc: 'Generating personalized post-recovery plan.' }
    ];

    const telemetryLogs = [
        "Initializing secure HIPAA uplink...",
        "Establishing secure AI uplink...",
        "Decompressing clinical data stream...",
        "Executing OCR pattern matching...",
        "Correlating creatinine levels with historical thresholds...",
        "Analyzing metabolic markers for anomalies...",
        "Scanning renal architecture metrics...",
        "Validating diagnostic report integrity...",
        "Mapping laboratory units to global standards...",
        "Generating clinical reasoning tree...",
        "Calibrating recovery probability engine...",
        "Optimizing dietary protocol recommendations...",
        "Finalizing diagnostic intelligence output..."
    ];

    useEffect(() => {
        if (isUploading && uploadStage < 4) {
            const logInterval = setInterval(() => {
                setTelemetry(prev => {
                    const nextLog = telemetryLogs[Math.floor(Math.random() * telemetryLogs.length)];
                    return [...prev.slice(-4), nextLog];
                });
            }, 1200);
            return () => clearInterval(logInterval);
        }
    }, [isUploading, uploadStage]);

    useEffect(() => {
        if (telemetryRef.current) {
            telemetryRef.current.scrollTop = telemetryRef.current.scrollHeight;
        }
    }, [telemetry]);

    const onFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && (selected.type === 'application/pdf' || selected.type.startsWith('image/'))) {
            setFile(selected);
            setError(null);
        } else {
            setError('Please select a valid PDF or Image file.');
        }
    };

    const startSimulation = () => {
        simulationRef.current = setInterval(() => {
            setUploadStage(prev => {
                if (prev >= 4) {
                    clearInterval(simulationRef.current);
                    simulationRef.current = null;
                    return 4;
                }
                return prev + 1;
            });
        }, 3000);
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setUploadStage(1);
        startSimulation();

        const formData = new FormData();
        formData.append('file', file);
        if (user?.id) {
            formData.append('user_id', user.id);
        }

        try {
            const response = await reportService.uploadReport(formData);
            
            if (simulationRef.current) {
                clearInterval(simulationRef.current);
                simulationRef.current = null;
            }
            setUploadStage(4);
            setLatestAnalysis(response);
            if (user?.id) {
                reportService.getPatientHistory(user.id).then(setPatientHistory);
            }
            setTimeout(() => navigate('/app/dashboard'), 1500);

        } catch (err) {
            if (simulationRef.current) {
                clearInterval(simulationRef.current);
                simulationRef.current = null;
            }
            setError(typeof err === 'string' ? err : (err?.message || 'Analysis failed. Please try again.'));
            setIsUploading(false);
            setUploadStage(0);
        }
    };

    useEffect(() => {
        return () => {
            if (simulationRef.current) {
                clearInterval(simulationRef.current);
            }
        };
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto pb-20"
        >
            <SectionHeader 
                title="Neural Scan Terminal"
                subtitle="Upload your medical reports for HIPAA-compliant AI analysis and real-time monitoring."
                center
                className="mb-16"
            />

            <AnimatePresence mode="wait">
                {!isUploading ? (
                    <motion.div 
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel p-1 border-stone-200 bg-stone-50"
                    >
                        <div className="relative group rounded-[2.8rem] overflow-hidden border border-stone-200 hover:border-primary/50 transition-all duration-700">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            
                            {/* Scanning Animation Background */}
                            <div className="absolute inset-x-0 h-[1px] bg-primary/30 top-0 animate-scan pointer-events-none"></div>
                            
                            <input
                                type="file"
                                id="report-upload"
                                className="hidden"
                                onChange={onFileChange}
                                accept=".pdf,image/*"
                            />

                            {file ? (
                                <div className="flex flex-col items-center justify-center p-20 lg:p-32">
                                    <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-10 shadow-glow border border-primary/20"
                                    >
                                        <Scan className="w-10 h-10 text-primary" />
                                    </motion.div>

                                    <div className="text-center space-y-6">
                                        <div className="bg-primary/10 border border-primary/20 px-6 py-2 rounded-full inline-flex items-center space-x-3">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black uppercase tracking-widest text-primary">{file.name}</span>
                                        </div>
                                        <h3 className="text-3xl font-display font-black text-stone-800 ">Report Loaded</h3>
                                        <p className="text-stone-500 font-medium ">Neural pathways ready for extraction.</p>
                                        
                                        <div className="pt-10 flex justify-center space-x-6">
                                            <ActionButton 
                                                onClick={handleUpload}
                                                className="px-12 py-4"
                                            >
                                                Initiate Scan
                                            </ActionButton>
                                            <button 
                                                onClick={(e) => { e.preventDefault(); setFile(null); }}
                                                className="px-8 py-4 rounded-3xl border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-black uppercase tracking-widest transition-all"
                                            >
                                                Reset
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <label htmlFor="report-upload" className="cursor-pointer flex flex-col items-center justify-center p-20 lg:p-32">
                                    <motion.div 
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-background transition-all duration-500 shadow-glow border border-primary/20"
                                    >
                                        <Scan className="w-10 h-10" />
                                    </motion.div>

                                    <div className="text-center">
                                        <h3 className="text-4xl font-display font-black mb-4  text-glow">Drop Data Chunk</h3>
                                        <p className="text-stone-400 font-black uppercase tracking-[0.3em] text-xs">Supports PDF, JPEG, PNG • Clinical Grade</p>
                                    </div>
                                </label>
                            )}
                        </div>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-6 bg-critical/10 border border-critical/20 rounded-3xl flex items-center space-x-4 text-critical "
                            >
                                <AlertCircle className="w-6 h-6 shrink-0" />
                                <span className="text-sm font-black uppercase tracking-widest">{error}</span>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="processing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-12"
                    >
                        {/* Terminal Header */}
                        <div className="glass-panel p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex items-center space-x-8">
                                <div className="relative w-28 h-28">
                                    <div className="absolute inset-0 border-4 border-stone-200 rounded-full"></div>
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 border-t-4 border-primary rounded-full"
                                    ></motion.div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <Cpu className="w-8 h-8 text-primary animate-pulse" />
                                        <span className="text-[10px] font-black text-stone-500 mt-2 tracking-widest">{Math.min(uploadStage * 25, 99)}%</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2 ">Active Neural Scan</h4>
                                    <h3 className="text-3xl font-display font-black text-stone-800">Analyzing Intelligence...</h3>
                                    <div className="flex items-center space-x-4 mt-4">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center">
                                                    <ShieldCheck className="w-3 h-3 text-primary" />
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Safe & Encryption Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Telemetry Log */}
                            <div 
                                ref={telemetryRef}
                                className="w-full md:w-80 h-32 bg-black/40 border border-stone-200 rounded-2xl p-4 overflow-y-auto font-mono text-[9px] text-primary/60  custom-scrollbar"
                            >
                                {telemetry.map((log, idx) => (
                                    <div key={idx} className="mb-1 flex items-start">
                                        <span className="opacity-70 mr-2">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                                        <span className="text-glow">{log}</span>
                                    </div>
                                ))}
                                <div className="animate-pulse">_</div>
                            </div>
                        </div>

                        {/* Stages Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {stages.map((stage, idx) => {
                                const Icon = stage.icon;
                                const isCurrent = uploadStage === idx + 1;
                                const isDone = uploadStage > idx + 1;

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`p-8 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden group
                                            ${isCurrent ? 'bg-primary/10 border-primary/40 shadow-glow' : 'bg-stone-50 border-stone-200 opacity-70'}
                                            ${isDone ? 'opacity-100 bg-excellent/5 border-excellent/30' : ''}
                                        `}
                                    >
                                        {isCurrent && (
                                            <div className="absolute top-0 right-0 p-4">
                                                <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                                            </div>
                                        )}
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 
                                            ${isDone ? 'bg-excellent/20 text-excellent' : 'bg-primary/20 text-primary'}
                                            ${isCurrent ? 'animate-float' : ''}
                                        `}>
                                            {isDone ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                        </div>
                                        <h4 className={`text-base font-display font-black mb-2 ${isCurrent ? 'text-stone-800' : 'text-stone-700'}`}>{stage.label}</h4>
                                        <p className="text-xs text-stone-500 leading-relaxed font-medium ">{stage.desc}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Certifications Row */}
            <div className="flex flex-wrap items-center justify-center gap-16 mt-24 opacity-30">
                <div className="flex items-center space-x-3">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-display">AES-256 Encrypted</span>
                </div>
                <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-4 h-4 text-excellent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-display">HIPAA Secure Terminal</span>
                </div>
                <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-info" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-display">Neural Model v2.5.4</span>
                </div>
            </div>
        </motion.div>
    );
};

export default UploadReport;

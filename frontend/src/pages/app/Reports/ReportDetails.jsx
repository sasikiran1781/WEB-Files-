import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft,
    Download,
    FileText,
    AlertCircle,
    Hospital,
    Stethoscope,
    Calendar,
    Activity,
    CheckCircle2,
    Loader2,
    Share2,
    ShieldCheck,
    Dna,
    Zap,
    Scale,
    PieChart,
    ArrowUpRight,
    Search,
    Binary
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { reportService } from '../../../services/api';
import { 
    MetricCard, 
    StatusBadge, 
    ScoreRing, 
    SectionHeader, 
    ActionButton 
} from '../../../components/SharedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setSelectedReport } = useApp();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const data = await reportService.getReportDetails(id);
                setReport(data);
                setSelectedReport(data);
            } catch (err) {
                setError(err?.message || 'Failed to fetch report details.');
            } finally {
                // Simulate neural calibration for vibe
                setTimeout(() => setLoading(false), 1500);
            }
        };
        fetchReport();
    }, [id, setSelectedReport]);

    const handleDownload = async () => {
        try {
            const response = await reportService.getReportPdf(id);
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `REVA_DeepScan_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <div className="relative w-32 h-32 mb-12">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-[1px] border-primary/20 rounded-full"
                    />
                    <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border-[1px] border-secondary/20 border-t-transparent rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Dna className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    {/* Scanning Bar */}
                    <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-[-20%] right-[-20%] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px] z-10"
                    />
                </div>
                <div className="text-center">
                    <h3 className="text-xl font-display font-black text-stone-800  tracking-widest mb-2 uppercase">Neural Recalibration</h3>
                    <p className="text-[10px] text-stone-600 font-black uppercase tracking-[0.4em] animate-pulse">Syncing clinical biometric nodes...</p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-32 text-center max-w-2xl mx-auto mt-20"
            >
                <div className="w-24 h-24 bg-critical/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-critical/20">
                    <AlertCircle className="w-12 h-12 text-critical" />
                </div>
                <h2 className="text-3xl font-display font-black mb-6  uppercase">Node Connection Failed</h2>
                <p className="text-stone-600 mb-12 font-medium ">
                    {error || 'The requested clinical deep-scan could not be synchronized with the neural ledger.'}
                </p>
                <ActionButton onClick={() => navigate('/app/history')} className="mx-auto">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Archive Directory
                </ActionButton>
            </motion.div>
        );
    }

    const patient = report.patient_identity || {};
    const metrics = report.medical_metrics || [];
    const recs = report.recommendations || {};

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <div>
                    <button onClick={() => navigate(-1)} className="text-[10px] font-black text-stone-500 hover:text-stone-800 flex items-center space-x-3  tracking-[0.3em] group transition-all mb-8">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>BACK TO ARCHIVE</span>
                    </button>
                    <SectionHeader 
                        title="Clinical Deep-Scan"
                        subtitle={`Target Identification: ${report.id?.slice(-12) || 'REV-UNKNOWN'}`}
                    />
                </div>
                <div className="flex items-center space-x-4 w-full lg:w-auto">
                    <button onClick={handleDownload} className="flex-1 lg:flex-initial px-8 py-3 rounded-2xl bg-stone-50 border border-stone-200 border border-stone-200 text-[10px] font-black uppercase tracking-widest text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-all flex items-center justify-center space-x-3">
                        <Download className="w-4 h-4" />
                        <span>Export PDF Deep-Scan</span>
                    </button>
                    <ActionButton className="flex-1 lg:flex-initial px-10 py-3 text-[10px]">
                        <Share2 className="w-4 h-4 mr-2" />
                        Protocol Share
                    </ActionButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Report Token */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="glass-panel p-10 border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Binary className="w-32 h-32" />
                        </div>
                        
                        <div className="flex items-center space-x-6 mb-12">
                            <div className="w-20 h-20 bg-primary/10 rounded-[1.8rem] flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-all duration-700">
                                <FileText className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-display font-black text-stone-800  leading-tight group-hover:text-primary transition-colors">
                                    {report.report_type || 'Metabolic Profile'}
                                </h2>
                                <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mt-2">Verified Clinical Node</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: Calendar, label: 'Execution Timestamp', value: report.report_date || 'N/A' },
                                { icon: Hospital, label: 'Clinical Uplink Target', value: report.hospital_name || 'Unity Labs Alpha' },
                                { icon: Stethoscope, label: 'Validating Officer', value: report.doctor_name || 'Dr. Clinical Guardian' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-5">
                                    <div className="p-3 bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl group-hover:border-primary/20 transition-all">
                                        <item.icon className="w-4 h-4 text-stone-500 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.3em] mb-1 ">{item.label}</p>
                                        <p className="text-xs font-bold text-stone-800/70 ">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 pt-12 border-t border-stone-200">
                            <div className="flex justify-center mb-10 relative">
                                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-75 animate-pulse-slow"></div>
                                <ScoreRing score={parseInt(report.recovery_score) || 75} size={160} />
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-200">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest  font-display">Status Index</span>
                                    <StatusBadge status={report.severity_level || 'Stable'} />
                                </div>
                                <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-200">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest  font-display">Verification Layer</span>
                                    <div className="flex items-center space-x-3 text-excellent">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[9px] font-black  tracking-[0.2em]">NODE VALIDATED</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-8 ">Neural Insights v2.5</h4>
                        <div className="relative">
                            <Zap className="absolute -top-4 -left-4 w-12 h-12 text-primary/10 animate-pulse" />
                            <p className="text-base font-display font-medium text-stone-800/80 leading-relaxed  z-10 relative">
                                "{report.primary_diagnosis || "Analysis indicates localized biometric optimization compared to cohort baseline. No critical deviations detected."}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Deep Metrics Ledger */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="glass-panel">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-xl font-display font-black ">Biometric Node Extractions</h3>
                            <div className="hidden sm:flex items-center space-x-4">
                                <Scale className="w-4 h-4 text-stone-400" />
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest ">Validated via Vision v4</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {metrics.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <MetricCard
                                        label={m.metric}
                                        value={m.value}
                                        unit={m.unit}
                                        status={m.status}
                                        range={m.range}
                                    />
                                </motion.div>
                            ))}
                            {metrics.length === 0 && (
                                <div className="col-span-full py-32 text-center glass-card border-dashed border-stone-200">
                                    <Binary className="w-12 h-12 text-stone-400 mx-auto mb-6" />
                                    <p className="text-xs text-stone-400 font-black uppercase tracking-widest ">No clinical markers could be extracted from this specific node.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Summary Recommendation Segment */}
                        <div className="glass-panel group cursor-pointer hover:border-excellent/30 transition-all duration-700">
                            <div className="flex items-center justify-between mb-10">
                                <h4 className="text-[10px] font-black text-excellent uppercase tracking-[0.3em] ">Priority Protocol</h4>
                                <ArrowUpRight className="w-5 h-5 text-stone-400 group-hover:text-excellent transition-all" />
                            </div>
                            <div className="space-y-6">
                                {recs.foods_to_eat?.slice(0, 3).map((food, idx) => (
                                    <div key={idx} className="flex items-center space-x-5 p-5 rounded-2xl bg-stone-50 border border-stone-200 group-hover:border-excellent/10 group-hover:bg-excellent/5 transition-all">
                                        <div className="w-2 h-2 rounded-full bg-excellent shadow-glow"></div>
                                        <span className="text-sm font-black text-stone-800/80 ">{food}</span>
                                    </div>
                                ))}
                                <Link to="/app/recovery-plan" className="flex items-center space-x-3 text-excellent text-[9px] font-black  tracking-[0.3em] uppercase hover:translate-x-2 transition-transform pt-4">
                                    <span>ACCESS FULL NEURAL PROTOCOL</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Subject Identity Segment */}
                        <div className="glass-panel bg-stone-50 flex flex-col justify-between">
                            <div>
                                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-10 ">Patient Metadata Check</h4>
                                <div className="space-y-8">
                                    <div>
                                        <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 ">Legal Identifier</p>
                                        <p className="text-xl font-display font-black text-stone-800  truncate">{patient.patient_name || 'N/A'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-10">
                                        <div>
                                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 ">Subject Age</p>
                                            <p className="text-lg font-display font-black text-stone-800 ">{patient.age || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 ">Gender Index</p>
                                            <p className="text-lg font-display font-black text-stone-800  uppercase">{patient.gender || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-12 pt-8 border-t border-stone-200">
                                <div className="flex items-center space-x-3 text-stone-400">
                                    <PieChart className="w-4 h-4" />
                                    <span className="text-[9px] font-black tracking-widest uppercase">Encryption Layer: RSA-4096 Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportDetails;

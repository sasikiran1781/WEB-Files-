import React, { useState } from 'react';
import {
    History,
    FileText,
    Download,
    Eye,
    Calendar,
    ArrowRight,
    TrendingUp,
    Activity,
    MoreVertical,
    Filter,
    Search,
    Archive,
    CheckCircle2,
    ShieldCheck,
    Clock,
    Hospital
} from 'lucide-react';
import { Link , useNavigate } from "react-router-dom";
import { useApp } from '../../../context/AppContext';
import { 
    StatusBadge, 
    SectionHeader, 
    ActionButton 
} from '../../../components/SharedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const ReportHistory = () => {
    
    const navigate = useNavigate();
const { patientHistory } = useApp();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredHistory = patientHistory?.filter(report => 
        report.report_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.hospital_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleDownloadReport = (report) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", `report_${report.id || 'export'}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <SectionHeader 
                    title="Neural Archives"
                    subtitle="Immutable ledger of all clinical extractions and biometric follow-ups."
                />
                <div className="flex items-center space-x-4 w-full lg:w-auto">
                    <div className="relative flex-grow lg:flex-initial">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                            type="text" 
                            placeholder="SEARCH ARCHIVES..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl pl-12 pr-6 py-3 text-[10px] font-black text-stone-800 placeholder:text-stone-400 outline-none focus:border-primary/50 transition-all w-full lg:w-64 tracking-widest" 
                        />
                    </div>
                    <ActionButton onClick={() => navigate('/app/upload')} className="whitespace-nowrap">
                        <Activity className="w-4 h-4 mr-2" />
                        New Scan
                    </ActionButton>
                </div>
            </div>

            {!patientHistory?.length ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-32 text-center relative overflow-hidden backdrop-blur-2xl border border-stone-200/50 shadow-xl"
                >
                    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-dashed border-primary/20 animate-[spin_60s_linear_infinite]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-dotted border-primary/10 animate-[spin_40s_linear_infinite_reverse]"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-primary/20 relative group">
                            <motion.div 
                                className="absolute inset-0 rounded-[2.5rem] border border-dashed border-primary/40" 
                                animate={{ rotate: 360 }} 
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            />
                            <Archive className="w-10 h-10 text-primary animate-pulse" />
                        </div>
                        <h2 className="text-3xl font-display font-black mb-4 uppercase text-stone-800">Archives Empty</h2>
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <div className="px-3 py-1 bg-stone-100 rounded-lg text-[8px] font-black text-stone-500 uppercase tracking-[0.2em] border border-stone-200/80">DATABANK SECURE</div>
                        </div>
                        <p className="text-stone-600 mb-12 max-w-sm mx-auto font-medium ">
                            Your clinical timeline is currently empty. Initialize your first neural extraction to populate the ledger.
                        </p>
                        <ActionButton onClick={() => navigate('/app/upload')} className="px-10 shadow-lg shadow-primary/20">
                            Perform First Scan
                        </ActionButton>
                    </div>
                </motion.div>
            ) : (
                <div className="space-y-8">
                    <AnimatePresence mode="popLayout">
                        {filteredHistory.map((report, idx) => (
                            <motion.div 
                                key={report.id || idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-panel p-0 overflow-hidden group hover:border-primary/30 transition-all duration-700"
                            >
                                <div className="flex flex-col lg:flex-row">
                                    {/* Report Summary Side */}
                                    <div className="p-10 lg:w-80 bg-stone-50 border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center space-x-3 text-primary">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{report.report_date || 'MAR 2026'}</span>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow"></div>
                                            </div>
                                            <h3 className="text-2xl font-display font-black text-stone-800  group-hover:text-primary transition-colors leading-tight mb-3">
                                                {report.report_type || 'General Clinical Analysis'}
                                            </h3>
                                            <div className="flex items-center space-x-3 opacity-70">
                                                <Hospital className="w-3.5 h-3.5" />
                                                <span className="text-[9px] font-black uppercase tracking-widest truncate">{report.hospital_name || 'Global Diagnostics'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-12 flex items-center space-x-8">
                                            <div>
                                                <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 ">Neural Score</p>
                                                <div className="flex items-baseline space-x-1">
                                                    <span className="text-2xl font-display font-black text-stone-800 ">{report.recovery_score || '75'}</span>
                                                    <span className="text-[10px] font-black text-stone-400">/100</span>
                                                </div>
                                            </div>
                                            <div className="w-px h-10 bg-stone-100"></div>
                                            <div>
                                                <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 ">Risk Index</p>
                                                <StatusBadge status={report.severity_level || 'Stable'} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Report Details Side */}
                                    <div className="p-10 flex-grow flex flex-col justify-between">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                                            {report.medical_metrics?.slice(0, 4).map((m, mIdx) => (
                                                <div key={mIdx} className="group/metric">
                                                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-2 group-hover/metric:text-primary/40 transition-colors ">{m.metric}</p>
                                                    <p className="text-lg font-display font-black text-stone-800/80 ">
                                                        {m.value} <span className="text-[10px] font-black text-stone-400 uppercase ml-1 ">{m.unit}</span>
                                                    </p>
                                                </div>
                                            ))}
                                            {report.medical_metrics?.length > 4 && (
                                                <div className="flex items-center">
                                                    <div className="px-4 py-2 rounded-xl bg-stone-100 border border-stone-200 text-[9px] font-black text-stone-500 uppercase tracking-[0.2em]">
                                                        +{report.medical_metrics.length - 4} MARKERS
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-10">
                                            <div className="flex items-center space-x-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                                                <div className="w-10 h-10 rounded-xl bg-excellent/10 flex items-center justify-center">
                                                    <ShieldCheck className="w-5 h-5 text-excellent" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest  leading-none mb-1">Status Report</p>
                                                    <p className="text-xs font-bold text-stone-700  font-medium">
                                                        {idx === 0 ? "Latest scan: Positive shift detected" : "Archived baseline calibrated"}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-4 w-full md:w-auto">
                                                <Link 
                                                    to={`/app/report/${report.id}`} 
                                                    className="flex-1 md:flex-initial px-6 py-3 rounded-2xl bg-stone-100 border border-stone-200 text-[10px] font-black uppercase tracking-widest text-stone-700 hover:text-stone-800 hover:bg-stone-100 transition-all flex items-center justify-center space-x-3 group/btn"
                                                >
                                                    <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    <span>Analyze</span>
                                                </Link>
                                                <button onClick={() => handleDownloadReport(report)} className="flex-1 md:flex-initial px-8 py-3 rounded-2xl bg-primary text-background text-[10px] font-black uppercase tracking-widest shadow-glow hover:scale-105 transition-all flex items-center justify-center space-x-3">
                                                    <Download className="w-4 h-4" />
                                                    <span>PDF Uplink</span>
                                                </button>
                                                <button onClick={() => alert('Additional metrics menu')} className="p-3 bg-stone-100 rounded-2xl text-stone-400 hover:text-stone-800 transition-all">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredHistory.length === 0 && searchQuery && (
                        <div className="py-32 text-center glass-card border-dashed border-stone-200">
                            <Search className="w-12 h-12 text-stone-400 mx-auto mb-6" />
                            <p className="text-xs text-stone-400 font-black uppercase tracking-widest ">No clinical signatures match your search query.</p>
                        </div>
                    )}

                    {/* Footer / Load More */}
                    <div className="flex justify-center pt-20">
                        <button onClick={() => alert('Loading historic ledger data...')} className="px-10 py-4 rounded-full border border-stone-200 text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] hover:text-stone-800 hover:border-white/20 transition-all group">
                            <span className="flex items-center space-x-4">
                                <span>Access Historical Ledger</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ReportHistory;

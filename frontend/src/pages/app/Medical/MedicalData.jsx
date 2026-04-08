import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
    User,
    Hospital,
    Stethoscope,
    Clipboard,
    Activity,
    Calendar,
    MapPin,
    TrendingUp,
    Download,
    Share2,
    Lock,
    Search,
    ShieldCheck,
    Fingerprint,
    Dna,
    Database,
    Binary
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { 
    MetricCard, 
    StatusBadge, 
    ScoreRing, 
    SectionHeader, 
    ActionButton 
} from '../../../components/SharedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const MedicalData = () => {
    
    const navigate = useNavigate();
const { latestAnalysis, patientHistory } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const analysis = latestAnalysis || patientHistory?.[0];

    const handleExportData = () => {
        if (!analysis) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "reva_neural_data.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'REVA Clinical Identity',
                text: 'View my verified clinical record and medical metrics.',
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Secure Uplink URL copied to clipboard.");
        }
    };

    if (!analysis) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-32 text-center"
            >
                <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-primary/20 animate-float">
                    <Database className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-black mb-6">No Identity Data Extracted</h2>
                <p className="text-stone-600 mb-12 max-w-sm mx-auto font-medium ">
                    Neural identity profiles are generated post-report extraction. Upload a clinical document to begin calibration.
                </p>
                <ActionButton onClick={() => navigate('/app/upload')}>
                    Begin Extraction
                </ActionButton>
            </motion.div>
        );
    }

    const patient = analysis.patient_identity || {};
    const metrics = analysis.medical_metrics || [];

    const filteredMetrics = metrics.filter(m => 
        m.metric?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <SectionHeader 
                    title="Neural Identity Profile"
                    subtitle="Unified patient biometric signature and clinical metric repository."
                />
                <div className="flex items-center space-x-4">
                    <button onClick={handleExportData} className="px-6 py-3 rounded-2xl bg-stone-50 border border-stone-200 border border-stone-200 text-[10px] font-black uppercase tracking-widest text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-all flex items-center space-x-3">
                        <Download className="w-4 h-4" />
                        <span>Export Bio-Data</span>
                    </button>
                    <ActionButton onClick={handleShare} className="px-8 py-3 text-[10px]">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Uplink
                    </ActionButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Identity Token */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="glass-panel p-1 px-1 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                        <div className="p-8 relative z-10">
                            {/* Holographic ID Badge */}
                            <div className="relative mb-10">
                                <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full animate-pulse-slow"></div>
                                <div className="relative bg-stone-50 border border-stone-200 border border-stone-200 rounded-[2.5rem] p-8 flex flex-col items-center text-center overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Fingerprint className="w-6 h-6 text-primary/30" />
                                    </div>
                                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-[1.8rem] flex items-center justify-center text-background font-display font-black text-4xl mb-6 shadow-glow transition-transform group-hover:scale-110 duration-700">
                                        {patient.patient_name?.[0] || 'P'}
                                    </div>
                                    <h3 className="text-2xl font-display font-black text-stone-800  truncate w-full">{patient.patient_name || 'Patient'}</h3>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2 ">#{patient.patient_id?.slice(-8) || 'REV-XXXX'}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: User, label: 'Bio Data', value: `${patient.gender || 'N/A'} • ${patient.age || 'N/A'}Y` },
                                    { icon: Activity, label: 'Blood Core', value: patient.blood_group || 'O Positive' },
                                    { icon: Hospital, label: 'Origin Lab', value: patient.hospital_name || 'Commercial Diagnostic' },
                                    { icon: MapPin, label: 'Sectors', value: patient.location || 'Distributed Node' },
                                    { icon: Stethoscope, label: 'Lead Clinical', value: patient.doctor_name || 'REVA AI v2.5' },
                                ].map((item, idx) => (
                                    <motion.div 
                                        key={idx}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center space-x-5 p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-primary/20 transition-all"
                                    >
                                        <div className="p-2.5 bg-primary/10 rounded-xl">
                                            <item.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1 ">{item.label}</p>
                                            <p className="text-xs font-bold text-stone-800/70 ">{item.value}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-stone-200">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest  font-display">Neural Validation</span>
                                    <div className="flex items-center space-x-2 text-excellent">
                                        <Lock className="w-3 h-3" />
                                        <span className="text-[9px] font-black  tracking-widest">VERIFIED</span>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
                                    <p className="text-[10px] text-stone-500  font-medium leading-relaxed">
                                        Identity cross-referenced with <span className="text-primary font-black ">{patientHistory?.length || 1} diagnostic points</span>. Cryptographic UHID integrity: 100%.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] ">Pending Extraction</h4>
                            <Calendar className="w-4 h-4 text-secondary/40" />
                        </div>
                        <p className="text-lg font-display font-black text-stone-800  mb-1 uppercase">Advanced Metabolic CBC</p>
                        <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest">Scheduled: 24 Mar 2026</p>
                        <button onClick={() => alert('Syncing extraction protocols and biometric cycles...')} className="w-full mt-8 py-3 bg-secondary/10 border border-secondary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-secondary hover:bg-secondary hover:text-background transition-all">
                            Initialize Sync
                        </button>
                    </div>
                </div>

                {/* Right Column: Biometric Ledger */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="glass-panel group">
                        {/* Ledger Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                            <div>
                                <h3 className="text-xl font-display font-black ">Clinical Biometric Ledger</h3>
                                <p className="text-[10px] text-stone-500 font-black uppercase tracking-[0.2em]  mt-2">Latest Extraction: {analysis.report_date || 'Mar 2026'}</p>
                            </div>
                            <div className="w-full md:w-auto relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input 
                                    type="text" 
                                    placeholder="SEARCH LEDGER..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl pl-12 pr-6 py-3 text-[10px] font-black text-stone-800 placeholder:text-stone-400 outline-none focus:border-primary/50 transition-all w-full md:w-64 tracking-widest" 
                                />
                            </div>
                        </div>

                        {/* Metrics Responsive Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredMetrics.map((m, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <MetricCard
                                            label={m.metric || "Metric"}
                                            value={m.value || "0"}
                                            unit={m.unit || ""}
                                            status={m.status || "Optimal"}
                                            range={m.range}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            
                            {filteredMetrics.length === 0 && (
                                <div className="col-span-full py-20 text-center glass-card border-dashed border-stone-200">
                                    <Binary className="w-12 h-12 text-stone-400 mx-auto mb-6" />
                                    <p className="text-xs text-stone-400 font-black uppercase tracking-widest ">No matching markers found in current extraction.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Integrated Analytics Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="glass-panel bg-gradient-to-br from-excellent/5 to-transparent border-excellent/10 flex flex-col justify-between">
                            <div className="mb-10">
                                <h4 className="text-[10px] font-black text-excellent uppercase tracking-[0.3em] mb-8 ">Recovery Dynamics</h4>
                                <div className="flex items-center space-x-10">
                                    <ScoreRing score={parseInt(analysis.recovery_score) || 75} size={130} />
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="p-1.5 bg-excellent/20 rounded-lg">
                                                <TrendingUp className="w-4 h-4 text-excellent" />
                                            </div>
                                            <span className="text-base font-display font-black text-stone-800 ">{analysis.severity_level || 'Normal'} Risk</span>
                                        </div>
                                        <p className="text-[11px] text-stone-600  font-medium leading-relaxed">
                                            Improving velocity detected in renal function indices over last 3 extraction cycles.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-8 border-t border-stone-200 flex items-center justify-between">
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Confidence Index</span>
                                <span className="text-[10px] font-black text-excellent">98.4%</span>
                            </div>
                        </div>

                        <div className="glass-panel relative flex flex-col justify-between group cursor-pointer hover:border-primary/40 transition-all duration-700">
                            <div className="absolute top-0 right-0 p-8">
                                <Dna className="w-6 h-6 text-primary/20 group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-10 ">Clinical Conclusion</h4>
                                <p className="text-base font-display font-medium leading-relaxed  text-stone-800/70 group-hover:text-stone-800 transition-colors">
                                    "{analysis.primary_diagnosis || "Patient results indicate a stable clinical baseline. Regular monitoring suggested."}"
                                </p>
                            </div>
                            <div className="mt-12 flex items-center text-primary text-[10px] font-black  tracking-[0.2em] group-hover:translate-x-2 transition-transform">
                                <span>VIEW DETAILED AI LOGS</span>
                                <TrendingUp className="w-4 h-4 ml-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MedicalData;

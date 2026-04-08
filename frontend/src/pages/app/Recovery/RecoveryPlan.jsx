import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
    ClipboardList,
    CheckCircle2,
    XCircle,
    Droplet,
    Zap,
    ShieldAlert,
    ChevronRight,
    Pizza,
    Salad,
    Dumbbell,
    Heart,
    Pill,
    Clock,
    Flame,
    Wind,
    Utensils,
    Info,
    LayoutDashboard
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionHeader, RecommendationCard, StatusBadge, ActionButton } from '../../../components/SharedComponents';

const RecoveryPlan = () => {
    
    const navigate = useNavigate();
const { latestAnalysis, patientHistory } = useApp();
    const [activeTab, setActiveTab] = useState('nutrition');
    const analysis = latestAnalysis || patientHistory?.[0];
    const recs = analysis?.recommendations || {};

    if (!analysis) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-32 text-center"
            >
                <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-primary/20 animate-float">
                    <ClipboardList className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-3xl font-display font-black mb-6">No Neural Protocol Found</h2>
                <p className="text-stone-600 mb-12 max-w-sm mx-auto font-medium ">
                    Upload your clinical report to generate an AI-calibrated recovery protocol.
                </p>
                <ActionButton onClick={() => navigate('/app/upload')}>
                    Generate Protocol
                </ActionButton>
            </motion.div>
        );
    }

    const tabs = [
        { id: 'nutrition', label: 'Nutritional', icon: Utensils },
        { id: 'lifestyle', label: 'Lifestyle', icon: Activity },
        { id: 'medication', label: 'Clinical', icon: Pill },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <SectionHeader 
                    title="Neural Recovery Protocol"
                    subtitle="AI-calibrated clinical guidance based on latest biometric extraction."
                />
                <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Adherence Rating</p>
                        <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase  tracking-tighter">
                            <span>High Fidelity</span>
                        </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 border border-stone-200 py-4 px-8 rounded-3xl backdrop-blur-md">
                        <StatusBadge status="Active" />
                    </div>
                </div>
            </div>

            {/* Premium Tab Navigation */}
            <div className="flex flex-wrap gap-4 p-2 bg-stone-50 border border-stone-200 rounded-[2rem] max-w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-3 rounded-2xl flex items-center space-x-3 transition-all duration-500
                            ${activeTab === tab.id 
                                ? 'bg-primary text-background font-black shadow-glow' 
                                : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100 font-bold uppercase tracking-widest text-[10px]'}
                        `}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'stroke-[2.5px]' : ''}`} />
                        <span className={activeTab === tab.id ? '' : 'hidden sm:inline'}>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'nutrition' && (
                    <motion.div 
                        key="nutrition"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                    >
                        <RecommendationCard 
                            type="diet"
                            title="Clinical Nutritional Guide"
                            items={recs.foods_to_eat || []}
                        />
                        <RecommendationCard 
                            type="restriction"
                            title="Biological Restrictions"
                            items={recs.foods_to_avoid || []}
                        />

                        {/* Hydration Metric Card */}
                        <div className="lg:col-span-2 glass-panel group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Droplet className="w-64 h-64 text-info" />
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                                <div className="max-w-md">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="p-3 bg-info/10 rounded-2xl">
                                            <Droplet className="w-6 h-6 text-info" />
                                        </div>
                                        <h3 className="text-xl font-display font-black ">Daily Hydration Target</h3>
                                    </div>
                                    <p className="text-stone-600  font-medium leading-relaxed mb-8">
                                        Your renal recovery depends on precise fluid intake. We've adjusted your target based on your latest GFR and creatinine levels.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="px-5 py-2 rounded-2xl bg-stone-100 border border-stone-200 flex items-center space-x-3">
                                            <Clock className="w-4 h-4 text-info" />
                                            <span className="text-[10px] font-black text-stone-700 uppercase tracking-widest">300ml every 2 hours</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <div className="flex items-baseline justify-center md:justify-end space-x-3 mb-2">
                                        <h2 className="text-7xl font-display font-black text-stone-800 text-glow">{recs.water_intake?.split(' ')[0] || '3.5'}</h2>
                                        <span className="text-xl font-black text-stone-400 uppercase tracking-[0.2em] ">Liters</span>
                                    </div>
                                    <div className="h-2 w-64 bg-stone-100 rounded-full overflow-hidden mx-auto md:ml-auto">
                                        <div className="h-full bg-info w-[75%] shadow-[0_0_15px_rgba(0,122,255,0.6)]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'lifestyle' && (
                    <motion.div 
                        key="lifestyle"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-10"
                    >
                        {/* Exercise Protocol */}
                        <div className="lg:col-span-2 glass-panel">
                            <div className="flex items-center space-x-4 mb-10">
                                <div className="p-3 bg-secondary/10 rounded-2xl">
                                    <Dumbbell className="w-6 h-6 text-secondary" />
                                </div>
                                <h3 className="text-xl font-display font-black ">Kinetical Recovery Protocol</h3>
                            </div>
                            <div className="bg-stone-50 border border-stone-200 p-8 rounded-[2rem] mb-10">
                                <p className="text-2xl text-stone-800/80 font-display font-medium leading-relaxed ">
                                    "{recs.exercise || "Focus on moderate respiratory discipline and walking. Avoid systemic strain until metabolic indices recalibrate."}"
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-secondary/5 border border-secondary/20 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Heart className="w-5 h-5 text-secondary" />
                                        <span className="text-xs font-black uppercase tracking-widest">BPM Ceiling</span>
                                    </div>
                                    <span className="text-lg font-black text-stone-800 ">115</span>
                                </div>
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <Wind className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest">Session Limit</span>
                                    </div>
                                    <span className="text-lg font-black text-stone-800 ">20m</span>
                                </div>
                            </div>
                        </div>

                        {/* Precautions Sidecar */}
                        <div className="glass-card p-10 bg-gradient-to-br from-critical/5 to-transparent border-critical/10 flex flex-col h-full">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="p-3 bg-critical/10 rounded-2xl">
                                    <ShieldAlert className="w-6 h-6 text-critical" />
                                </div>
                                <h3 className="text-lg font-display font-black ">Vital Warnings</h3>
                            </div>
                            <div className="space-y-6 flex-grow">
                                {recs.precautions?.map((item, idx) => (
                                    <div key={idx} className="flex items-start space-x-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-critical mt-1.5 shrink-0 shadow-[0_0_8px_rgba(255,59,48,0.8)]"></div>
                                        <p className="text-sm font-medium text-stone-600  leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 pt-8 border-t border-stone-200">
                                <div className="flex items-center space-x-3 text-critical/60">
                                    <Info className="w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase tracking-widest leading-tight">If systemic symptoms persist, contact medical uplink.</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'medication' && (
                    <motion.div 
                        key="medication"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="max-w-4xl mx-auto w-full"
                    >
                        <div className="glass-panel relative overflow-hidden">
                            <div className="flex items-center justify-between mb-16">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl">
                                        <Pill className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-display font-black ">Neural Pharma Schedule</h3>
                                </div>
                                <div className="hidden sm:block">
                                    <StatusBadge status="Under Review" />
                                </div>
                            </div>

                            <div className="relative space-y-12 pl-12">
                                {/* Vertical Line */}
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary via-primary/20 to-transparent"></div>

                                {[
                                    { name: 'Neural-Z (Amlodipine)', dose: '5mg', time: '08:00', type: 'Capsule', note: 'Avoid systemic caffeine immediate post-intake.' },
                                    { name: 'Metformin-Core', dose: '500mg', time: '18:00', type: 'Tablet', note: 'Consume with moderate glucose intake.' },
                                    { name: 'Statin-B (Atorvastatin)', dose: '10mg', time: '21:30', type: 'Softgel', note: 'Optimal absorption during neural resting phase.' }
                                ].map((med, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-[44px] top-1 w-6 h-6 rounded-full bg-white border-4 border-primary shadow-glow group-hover:scale-125 transition-transform z-10 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                        </div>
                                        <div className="glass-card p-8 border-stone-200 group-hover:border-primary/30 transition-all cursor-pointer">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex items-center space-x-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 group-hover:text-primary transition-colors">
                                                        <Pill className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-display font-black text-stone-800  group-hover:text-primary transition-colors">{med.name}</h4>
                                                        <div className="flex items-center space-x-4 mt-1">
                                                            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{med.dose} • {med.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-8">
                                                    <div className="text-center">
                                                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Schedule</p>
                                                        <div className="flex items-center space-x-2 text-stone-800 font-black ">
                                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                                            <span>{med.time}</span>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                            <p className="mt-6 text-sm text-stone-600  font-medium pt-6 border-t border-stone-200">
                                                {med.note}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-20 p-8 rounded-3xl bg-secondary/5 border border-secondary/10 flex items-start space-x-6">
                                <Info className="w-6 h-6 text-secondary shrink-0" />
                                <p className="text-xs text-stone-600  font-medium leading-relaxed">
                                    Clinical pharmacological interventions are automatically synchronized with latest biometric extraction. For dosage modification, contact your healthcare provider via the REVA Connect uplink.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default RecoveryPlan;

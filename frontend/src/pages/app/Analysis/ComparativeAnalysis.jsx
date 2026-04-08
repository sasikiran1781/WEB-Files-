import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
    Diff,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    Info,
    CheckCircle2,
    FileText,
    Activity,
    History,
    TrendingUp,
    Zap,
    Target,
    BarChart3,
    ArrowRight,
    Search,
    RefreshCcw
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { 
    StatusBadge, 
    SectionHeader, 
    ActionButton 
} from '../../../components/SharedComponents';
import { motion } from 'framer-motion';

const ComparativeAnalysis = () => {
    
    const navigate = useNavigate();
const { latestAnalysis, patientHistory } = useApp();

    const hasHistory = patientHistory && patientHistory.length >= 2;
    const current = latestAnalysis || patientHistory?.[0];
    const previous = hasHistory ? patientHistory[1] : null;

    if (!current) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-32 text-center relative overflow-hidden backdrop-blur-2xl border border-stone-200/50 shadow-xl"
            >
                {/* Scientific Tech Radar Scanner backdrops */}
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-dashed border-primary/20 animate-[spin_60s_linear_infinite]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-dotted border-primary/10 animate-[spin_40s_linear_infinite_reverse]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary/5"></div>
                </div>

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-primary/20 relative group">
                        <motion.div 
                            className="absolute inset-0 rounded-[2.5rem] border border-dashed border-primary/40" 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div 
                            className="absolute inset-2 rounded-[2rem] border border-dotted border-primary/30" 
                            animate={{ rotate: -360 }} 
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        <Diff className="w-10 h-10 text-primary animate-pulse" />
                    </div>
                    
                    <h2 className="text-3xl font-display font-black mb-4 tracking-tight text-stone-800 uppercase">Differential Lock</h2>
                    
                    <div className="flex items-center justify-center space-x-3 mb-6">
                        <div className="px-3 py-1 bg-stone-100 rounded-lg text-[8px] font-black text-stone-500 uppercase tracking-[0.2em] border border-stone-200/80">SECURE NODE</div>
                        <div className="w-1 h-1 rounded-full bg-stone-300"></div>
                        <div className="px-3 py-1 bg-primary/10 rounded-lg text-[8px] font-black text-primary uppercase tracking-[0.2em]">CALIBRATION_NEEDED</div>
                    </div>

                    <p className="text-stone-600 mb-12 max-w-sm mx-auto font-medium ">
                        Neural comparison requires at least one active clinical extraction to initialize.
                    </p>

                    <ActionButton onClick={() => navigate('/app/upload')} className="px-10 shadow-lg shadow-primary/20">
                        Initialize Scan
                    </ActionButton>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                <SectionHeader 
                    title="Neural Differential"
                    subtitle="Synchronizing biometric shifts and recovery velocity across temporal nodes."
                />
                {!hasHistory && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="px-6 py-3 bg-primary/5 border border-primary/20 rounded-2xl flex items-center space-x-3"
                    >
                        <Info className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest  leading-none">Baseline established. Awaiting follow-up telemetry.</span>
                    </motion.div>
                )}
            </div>

            {!hasHistory ? (
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-24 text-center border-dashed border-stone-200 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-stone-100 rounded-[1.8rem] flex items-center justify-center mx-auto mb-10 group-hover:bg-primary/20 group-hover:border-primary/30 border border-stone-200 transition-all duration-700">
                            <RefreshCcw className="w-10 h-10 text-stone-400 group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="text-2xl font-display font-black mb-6 uppercase">Single Protocol Active</h3>
                        <p className="text-stone-600 mb-12 max-w-md mx-auto font-medium ">
                            Differential analysis requires a subsequent follow-up scan to detect biometric trends, metric shifting, and calculate your recovery trajectory.
                        </p>
                        <ActionButton onClick={() => navigate('/app/upload')} className="px-12">
                            Perform Follow-up Scan
                        </ActionButton>
                    </div>
                </motion.div>
            ) : (
                <div className="space-y-12">
                    {/* Comparison High-Level View */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-12 xl:col-span-4 glass-panel p-10 bg-gradient-to-br from-excellent/10 via-transparent to-transparent border-excellent/20 relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <TrendingUp className="w-48 h-48 text-excellent" />
                            </div>
                            
                            <p className="text-[10px] font-black text-excellent uppercase tracking-[0.4em] mb-4 ">Recovery Velocity</p>
                            <div className="flex items-center space-x-5 mb-10">
                                <h3 className="text-6xl font-display font-black text-stone-800  tracking-tighter">+12.4%</h3>
                                <div className="px-4 py-2 rounded-xl bg-excellent/20 border border-excellent/20 text-excellent text-[9px] font-black tracking-widest uppercase shadow-glow-excellent">OPTIMIZED</div>
                            </div>
                            <div className="relative z-10 flex items-start space-x-6 p-6 rounded-2xl bg-stone-50 border border-stone-200">
                                <div className="p-3 bg-excellent/20 rounded-xl">
                                    <Zap className="w-5 h-5 text-excellent" />
                                </div>
                                <p className="text-sm font-medium text-stone-700  leading-relaxed">
                                    "Clinical deviation has stabilized. Target identification nodes indicate a positive biometric shift in renal clearance efficiency."
                                </p>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-12 xl:col-span-8 glass-panel p-10 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between h-full gap-10">
                                <div className="flex-1 space-y-4 group">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-2 h-2 rounded-full bg-stone-200"></div>
                                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] ">Historical Node</p>
                                    </div>
                                    <p className="text-2xl font-display font-black text-stone-700  leading-none">{previous?.report_date || 'MAR 2026'}</p>
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-3.5 h-3.5 text-stone-400" />
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest truncate">{previous?.report_type || 'Chemical Ledger'}</p>
                                    </div>
                                </div>
                                
                                <div className="relative flex items-center justify-center p-8">
                                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
                                    <div className="w-20 h-20 rounded-[2rem] bg-white border border-primary/30 flex items-center justify-center relative z-10 shadow-glow">
                                        <Target className="w-8 h-8 text-primary animate-pulse" />
                                    </div>
                                    <div className="hidden md:block absolute left-[-100%] right-[-100%] h-px bg-stone-100 z-0"></div>
                                </div>

                                <div className="flex-1 space-y-4 text-right group">
                                    <div className="flex items-center justify-end space-x-3 mb-2">
                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] ">Active Extraction</p>
                                        <div className="w-2 h-2 rounded-full bg-primary shadow-glow"></div>
                                    </div>
                                    <p className="text-2xl font-display font-black text-stone-800  leading-none">{current?.report_date || 'APR 2026'}</p>
                                    <div className="flex items-center justify-end space-x-3">
                                        <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest truncate">{current?.report_type || 'Clinical Ledger'}</p>
                                        <FileText className="w-3.5 h-3.5 text-stone-400" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Detailed Metric Differential Ledger */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-0 overflow-hidden"
                    >
                        <div className="p-10 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="flex items-center space-x-6">
                                <div className="p-3 bg-primary/10 rounded-xl border border-primary/20">
                                    <BarChart3 className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-display font-black ">Biometric Differential Ledger</h3>
                            </div>
                            <div className="flex items-center space-x-8">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 bg-excellent rounded-full shadow-glow-excellent"></div>
                                    <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest  leading-none">Positive Shift</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2.5 h-2.5 bg-critical rounded-full shadow-glow-critical"></div>
                                    <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest  leading-none">Critical Deviation</span>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-stone-50 text-stone-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                        <th className="px-10 py-6">Target Extraction</th>
                                        <th className="px-10 py-6">Historical Baseline</th>
                                        <th className="px-10 py-6 text-primary">Active Value</th>
                                        <th className="px-10 py-6">Differential</th>
                                        <th className="px-10 py-6 text-right">Clinical State</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { name: 'Creatinine', prev: '1.2', curr: '0.9', unit: 'mg/dL', delta: -25, status: 'Optimal' },
                                        { name: 'Blood Urea', prev: '45', curr: '38', unit: 'mg/dL', delta: -15.5, status: 'Optimal' },
                                        { name: 'Hemoglobin', prev: '11.5', curr: '12.8', unit: 'g/dL', delta: 11.3, status: 'Optimizing' },
                                        { name: 'Sodium', prev: '142', curr: '140', unit: 'mmol/L', delta: -1.4, status: 'Stable' },
                                        { name: 'Potassium', prev: '4.8', curr: '5.2', unit: 'mmol/L', delta: 8.3, status: 'Alert' },
                                    ].map((item, idx) => (
                                        <tr key={idx} className="hover:bg-stone-50 transition-all duration-300 group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-1.5 h-8 bg-primary/20 rounded-full group-hover:bg-primary group-hover:shadow-glow transition-all duration-500"></div>
                                                    <span className="text-base font-display font-medium text-stone-800  group-hover:translate-x-1 transition-transform">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-sm font-black text-stone-500 ">{item.prev} <span className="text-[10px] uppercase ml-1 opacity-50">{item.unit}</span></p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-lg font-display font-black text-primary ">{item.curr} <span className="text-[10px] text-primary/40 uppercase ml-1">{item.unit}</span></p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className={`flex items-center space-x-2 font-black  text-base ${item.delta > 0 ? (item.status === 'Alert' ? 'text-critical' : 'text-primary') : 'text-excellent'}`}>
                                                    {item.delta > 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                                                    <span>{Math.abs(item.delta)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <StatusBadge status={item.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* AI Confirmation Integration */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-panel p-10 bg-primary/5 border-primary/20 relative group"
                    >
                        <div className="flex items-start space-x-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-700">
                                <CheckCircle2 className="w-8 h-8 text-primary shadow-glow" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <h4 className="text-xl font-display font-black text-stone-800  lowercase">Neural.Confirmation_Insight</h4>
                                    <div className="px-3 py-1 bg-primary/10 border border-primary/10 rounded-lg text-[8px] font-black text-primary uppercase tracking-[0.2em] ">V3.1 SECURE</div>
                                </div>
                                <p className="text-lg font-display text-stone-700 leading-relaxed  pr-12">
                                    "Biometric shift detected: Renal clearance efficiency has increased by 25%. This correlates with the reduction in Creatinine from 1.2 to 0.9. Patient recovery velocity is above baseline. Maintain current hydration and diet protocol."
                                </p>
                                <div className="pt-6 flex items-center space-x-6 text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] font-display">
                                    <span>Sync Lock: Active</span>
                                    <div className="w-1 h-1 rounded-full bg-stone-100"></div>
                                    <span>Extraction Confidence: 99.8%</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ComparativeAnalysis;

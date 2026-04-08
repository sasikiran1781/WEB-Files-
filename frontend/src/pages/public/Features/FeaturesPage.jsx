import React from 'react';
import { 
    Brain, 
    Search, 
    FileText, 
    Activity, 
    Shield, 
    Zap, 
    LineChart, 
    FileSearch, 
    Droplets, 
    Microscope, 
    Dna, 
    Lock,
    Cpu,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader, ActionButton } from '../../../components/SharedComponents';

const FeaturesPage = () => {
    const features = [
        { 
            icon: FileSearch, 
            title: "Neural OCR Extraction", 
            desc: "Proprietary Vision AI architecture that extracts 50+ clinical markers from complex report layouts with 99.8% precision.",
            category: "Ingestion" 
        },
        { 
            icon: Brain, 
            title: "Gemini Reasoning Core", 
            desc: "Advanced clinical analysis fueled by Gemini 2.5, identifying subtle anomalies and delta-shifts in your biometric profile.",
            category: "Analysis" 
        },
        { 
            icon: LineChart, 
            title: "Recovery Velocity", 
            desc: "Longitudinal tracking of health metrics with automated velocity calculations to predict recovery windows.",
            category: "Visualization" 
        },
        { 
            icon: Dna, 
            title: "Biometric Ledger", 
            desc: "A unified clinical repository of every lab test, filtered by organ group—Renal, Metabolic, Liver, and Blood.",
            category: "Storage" 
        },
        { 
            icon: Droplets, 
            title: "Precision Hydration", 
            desc: "Dynamically calibrated hydration protocols based on creatinine clearance and metabolic baseline shifts.",
            category: "Protocol" 
        },
        { 
            icon: Shield, 
            title: "Zero-Trust Security", 
            desc: "HIPAA-compliant data architecture with RSA-4096 encryption for absolute clinical data integrity.",
            category: "Safety" 
        }
    ];

    return (
        <div className="relative min-h-screen">
            {/* Background Visuals */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto py-32 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-32"
                >
                    <SectionHeader 
                        badge="Product Intelligence"
                        title="The Clinical Operating System."
                        subtitle="REVA consolidates fragmented medical data into a single, high-fidelity neural interface."
                    />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((f, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-10 group hover:border-primary/40 transition-all duration-700 relative overflow-hidden h-full"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                                <f.icon className="w-20 h-20" />
                            </div>
                            
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="w-14 h-14 bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500 shadow-glow">
                                        <f.icon className="w-7 h-7" />
                                    </div>
                                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]  border border-stone-200 px-3 py-1 rounded-full group-hover:border-primary/20 group-hover:text-primary transition-all">
                                        {f.category}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className="text-2xl font-display font-black text-stone-800  tracking-tight mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed font-medium ">
                                        {f.desc}
                                    </p>
                                </div>
                                
                                <div className="flex items-center space-x-2 text-[8px] font-black text-primary/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                                    <Zap className="w-3 h-3" />
                                    <span>Core Intelligence Model Active</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Technical Capabilities */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 p-12 glass-panel border-stone-200 bg-stone-50"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { label: "Extraction Speed", value: "<1.2s", icon: Zap },
                            { label: "Clinical Precision", value: "99.8%", icon: Microscope },
                            { label: "Encryption Layer", value: "RSA-4096", icon: Lock },
                            { label: "Model Version", value: "v2.5.4", icon: Cpu }
                        ].map((stat, idx) => (
                            <div key={idx} className="space-y-4 group">
                                <div className="text-3xl font-display font-black text-stone-800 group-hover:text-primary transition-colors">{stat.value}</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 ">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-40 text-center space-y-12"
                >
                    <h2 className="text-5xl font-display font-black text-stone-800 ">Ready to Synchronize?</h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                        <ActionButton 
                            onClick={() => window.location.href = '/signup'}
                            className="px-12"
                        >
                            Initialize Terminal
                        </ActionButton>
                        <button 
                            onClick={() => window.location.href = '/how-it-works'}
                            className="px-10 py-4 rounded-2xl border border-stone-200 hover:bg-stone-100 text-[10px] font-black uppercase tracking-[0.3em] transition-all  text-stone-600 hover:text-stone-800"
                        >
                            View Pipeline Logic
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FeaturesPage;

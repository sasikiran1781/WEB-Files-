import React from 'react';
import { 
    Upload, 
    Search, 
    Brain, 
    Activity, 
    ArrowRight, 
    Scan, 
    Layers, 
    Database, 
    Zap,
    Cpu,
    ShieldCheck,
    FileSearch,
    Network
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader, ActionButton } from '../../../components/SharedComponents';

const HowItWorksPage = () => {
    const steps = [
        { 
            icon: Upload, 
            title: "Data Ingestion", 
            desc: "Uplink your clinical PDF or mobile scan through our AES-256 encrypted terminal.",
            accent: "primary",
            telemetry: "ENCRYPTED_UPLINK_ESTABLISHED"
        },
        { 
            icon: FileSearch, 
            title: "Neural Extraction", 
            desc: "Vision AI identifies 45+ clinical markers, reference ranges, and diagnostic metadata.",
            accent: "secondary",
            telemetry: "OCR_SCANNING_IN_PROGRESS"
        },
        { 
            icon: Brain, 
            title: "Clinical Core", 
            desc: "Gemini 2.5 Pro correlates values against 12M+ clinical data points to detect risk anomalies.",
            accent: "primary",
            telemetry: "REASONING_CORE_ACTIVE"
        },
        { 
            icon: Zap, 
            title: "Protocol Synthesis", 
            desc: "Automated generation of diet, hydration, and medication protocols based on organ indices.",
            accent: "excellent",
            telemetry: "SYNTHESIZING_PROTOCOLS"
        }
    ];

    return (
        <div className="relative min-h-screen">
            {/* Background Aesthetic */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto py-32 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-32"
                >
                    <SectionHeader 
                        title="Neural Analysis Pipeline"
                        subtitle="From raw clinical data to actionable recovery intelligence in sub-second cycles."
                        center
                    />
                </motion.div>

                <div className="relative">
                    {/* Animated Connection Path */}
                    <div className="hidden lg:block absolute top-[100px] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10">
                        <motion.div 
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-40 h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {steps.map((s, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="relative mb-12">
                                    <div className="w-32 h-32 glass-panel flex items-center justify-center relative z-10 group-hover:border-primary/50 transition-all duration-700 bg-stone-50 overflow-hidden">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute top-3 left-3 px-2 py-0.5 border border-stone-200 rounded-md text-[8px] font-black text-stone-400 uppercase tracking-widest  group-hover:text-primary transition-colors">NODE_0{i + 1}</div>
                                        <s.icon className="w-12 h-12 text-stone-400 group-hover:text-primary group-hover:scale-110 transition-all duration-700 group-hover:shadow-glow" />
                                        
                                        {/* Scan Bar Animation */}
                                        <motion.div 
                                            animate={{ y: [-40, 40] }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                                            className="absolute inset-x-0 h-px bg-primary/30 opacity-0 group-hover:opacity-100"
                                        />
                                    </div>
                                    
                                    {/* Connectivity Rings */}
                                    <div className="absolute inset-0 -z-0 scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                        <div className="absolute inset-0 border border-primary/5 rounded-full animate-ping"></div>
                                        <div className="absolute inset-4 border border-primary/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                                    </div>
                                </div>

                                <motion.div className="space-y-4">
                                    <div className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-lg text-[7px] font-black text-stone-400 uppercase tracking-[0.3em] font-mono group-hover:text-primary transition-colors ">
                                        {s.telemetry}
                                    </div>
                                    <h3 className="text-2xl font-display font-black text-stone-800  tracking-tight">{s.title}</h3>
                                    <p className="text-sm text-stone-600 leading-relaxed  font-medium max-w-[240px] mx-auto">
                                        {s.desc}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Deep Scan Visual Section */}
                <div className="mt-48 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-500 ">Security Core Architecture</span>
                        </div>
                        <h2 className="text-5xl font-display font-black text-stone-800 leading-tight ">
                            Full-Stack Clinical <br />
                            <span className="text-primary text-glow">Data Protection.</span>
                        </h2>
                        <p className="text-lg text-stone-600 leading-relaxed font-medium ">
                            REVA operates on a zero-trust architecture, ensuring your sensitive clinical telemetry is encrypted at rest and in transit via RSA-4096 protocols.
                        </p>
                        <div className="pt-8 flex flex-wrap gap-6">
                            {['HIPAA COMPLIANT', 'AES-256 ENCRYPTED', 'GDPR READY'].map((cert, j) => (
                                <div key={j} className="flex items-center space-x-2 px-4 py-2 bg-stone-50 border border-stone-200 border border-stone-200 rounded-xl">
                                    <div className="w-1.5 h-1.5 rounded-full bg-excellent"></div>
                                    <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest">{cert}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2 }}
                        className="relative"
                    >
                        <div className="glass-panel p-1 rounded-[3rem] overflow-hidden group">
                            <div className="bg-white/80 rounded-[2.8rem] aspect-video relative overflow-hidden flex items-center justify-center p-12">
                                <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
                                <Network className="w-40 h-40 text-primary opacity-50 animate-float" />
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 border border-stone-200 rounded-full animate-ping opacity-50"></div>
                                    <div className="w-48 h-48 border border-stone-200 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }}></div>
                                </div>

                                {/* Floating Data Points */}
                                <div className="absolute top-10 right-10 p-4 glass-card border-primary/20 text-[8px] font-black text-primary uppercase animate-float">Extraction: Hemoglobin [HGB]</div>
                                <div className="absolute bottom-10 left-10 p-4 glass-card border-secondary/20 text-[8px] font-black text-secondary uppercase animate-float" style={{ animationDelay: '1.5s' }}>Validating: Renal Baseline</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Final Integration CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-48 glass-panel p-20 text-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-[1.8rem] border border-primary/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700 shadow-glow">
                            <Activity className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-black mb-8 ">Experience Neural Intelligence Today</h2>
                        <p className="text-stone-600 max-w-xl mx-auto mb-12 font-medium  text-lg leading-relaxed">
                            Initialize your first report and unlock the same recovery insights used by elite clinics worldwide.
                        </p>
                        <ActionButton 
                            onClick={() => window.location.href = '/signup'}
                            className="px-16"
                        >
                            Start Neural Scan
                        </ActionButton>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default HowItWorksPage;

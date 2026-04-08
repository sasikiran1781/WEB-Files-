import React from 'react';
import { Brain, Heart, Shield, Cpu, Target, Network, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../../../components/SharedComponents';

const AboutPage = () => {
    return (
        <div className="relative min-h-screen">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto py-32 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-32"
                >
                    <SectionHeader 
                        badge="Neural Genesis"
                        title="The Blueprint for Future Care."
                        subtitle="REVA was architected to bridge the critical gap between complex clinical data and human recovery."
                    />
                    
                    <div className="mt-16 prose prose-invert lg:prose-2xl max-w-4xl space-y-12 text-stone-600">
                        <p className="text-2xl  leading-relaxed font-display font-medium text-stone-800/80">
                            Our vision is simple: <span className="text-primary text-glow ">No patient should ever feel disconnected from their own medical intelligence.</span>
                        </p>
                        <p className=" leading-relaxed">
                            Historically, medical reports have existed as static, disconnected documents. REVA transforms these artifacts into a living, unified intelligence layer. By leveraging the clinical reasoning of Gemini 2.5 and advanced OCR architectures, we provide patients with a high-fidelity roadmap to recovery that is as precise as it is personalized.
                        </p>
                    </div>
                </motion.div>

                {/* Core Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                        { 
                            icon: Cpu, 
                            title: "Clinical Accuracy", 
                            desc: "Our neural models are trained on enterprise-grade medical benchmarks to recognize and correlate biometric indicators across Renal, Liver, and Metabolic spectra.",
                            accent: "primary"
                        },
                        { 
                            icon: Heart, 
                            title: "Hyper-Personalization", 
                            desc: "REVA doesn't just read data; it understands context. Every recovery protocol is dynamically synthesized based on your unique biometric delta shifts.",
                            accent: "secondary"
                        },
                        { 
                            icon: Shield, 
                            title: "Absolute Privacy", 
                            desc: "Built on zero-trust principles. Your clinical data is your own, protected by AES-256 encryption and full HIPAA-compliant architectural standards.",
                            accent: "excellent"
                        },
                        { 
                            icon: Target, 
                            title: "Mission Excellence", 
                            desc: "We are committed to reducing post-treatment reading errors and providing patients with the clarity needed to make informed recovery decisions.",
                            accent: "info"
                        }
                    ].map((pillar, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-10 group hover:border-primary/40 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-50 transition-opacity">
                                <pillar.icon className="w-24 h-24" />
                            </div>
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="w-14 h-14 bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                                    <pillar.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-display font-black text-stone-800  tracking-tight">{pillar.title}</h3>
                            </div>
                            <p className="text-stone-600 leading-relaxed font-medium  relative z-10">
                                {pillar.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Final Brand Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-40 text-center space-y-12"
                >
                    <div className="flex items-center justify-center space-x-8">
                        <div className="h-px flex-grow bg-gradient-to-r from-transparent to-white/10"></div>
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                        <div className="h-px flex-grow bg-gradient-to-l from-transparent to-white/10"></div>
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-3xl font-display font-black text-stone-800 ">Synchronizing Human Health & AI.</h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 ">Global Headquarters • Neural Core Lab srl</p>
                    </div>

                    <div className="flex justify-center space-x-20 opacity-30">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Active Monitoring</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Network className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Global Intelligence</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutPage;

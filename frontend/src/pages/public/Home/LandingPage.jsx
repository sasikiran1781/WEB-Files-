import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Activity, Brain, ShieldCheck, Play, ArrowRight,
    FileText, TrendingUp, Zap, Clock, User, HeartPulse, Stethoscope, Star
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const yTransform = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div ref={containerRef} className="relative min-h-screen bg-white text-stone-800 overflow-hidden selection:bg-yellow-500/30 selection:text-stone-800 font-sans">
            
            {/* Soft Ambient Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-yellow-600/10 rounded-full blur-[150px] "></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[150px] " style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-amber-600/10 rounded-full blur-[120px] "></div>
            </div>

            {/* Navbar Placeholder */}
            <div className="h-24 w-full relative z-50"></div>

            {/* Hero Section */}
            <motion.section 
                style={{ y: yTransform, opacity: opacityHero }}
                className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-6 pt-10 pb-32"
            >
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Copy & Actions */}
                    <div className="flex flex-col items-start text-left relative z-20">
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-50 border border-stone-200 backdrop-blur-xl mb-8 shadow-sm"
                        >
                            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]"></div>
                            <span className="text-xs font-semibold text-yellow-300 uppercase tracking-widest">REVA V2.0 Access</span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                            className="text-5xl sm:text-6xl md:text-7xl font-bold text-stone-800 leading-[1.1] tracking-[-0.02em] mb-6"
                        >
                            AI-Powered <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500">Recovery Intelligence</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            className="text-lg md:text-xl text-stone-500 max-w-lg leading-relaxed font-normal mb-10"
                        >
                            Transforming complex medical reports into actionable, personalized recovery insights. Monitor your vitals, track progress, and heal smarter.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 w-full sm:w-auto"
                        >
                            <button 
                                onClick={() => navigate('/role-selection')}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 text-white font-semibold tracking-wide hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <span>Start Analysis</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button 
                                onClick={() => navigate('/how-it-works')}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-50 border border-stone-200 border border-stone-200 text-stone-800 font-semibold tracking-wide hover:bg-white/[0.1] backdrop-blur-xl transition-all duration-300 flex items-center justify-center space-x-2"
                            >
                                <Play className="w-4 h-4 fill-white text-stone-800" />
                                <span>View Demo</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right: Dashboard Preview UI */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        className="relative z-10 w-full"
                    >
                        {/* Apple-style Glassmorphism Dashboard */}
                        <div className="relative w-full aspect-[4/3] rounded-[2.5rem] bg-gradient-to-br from-white/[0.08] to-white/[0.01] border border-stone-200 backdrop-blur-2xl shadow-2xl p-6 overflow-hidden flex flex-col gap-6">
                            
                            {/* Inner Header */}
                            <div className="flex justify-between items-center px-2">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-400 flex items-center justify-center p-[2px]">
                                        <div className="w-full h-full bg-stone-50 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-yellow-300" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-stone-800 font-semibold text-sm">Patient Dashboard</p>
                                        <p className="text-stone-500 text-xs">Live Monitoring</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold flex items-center space-x-1.5 border border-green-500/20">
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                    <span>Stable</span>
                                </div>
                            </div>

                            {/* Info Cards Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-stone-50 border border-stone-200 border border-stone-200 rounded-3xl p-5 hover:bg-stone-50 transition-colors relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-50 transition-opacity">
                                        <HeartPulse className="w-16 h-16 text-yellow-400" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
                                            <Activity className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <p className="text-stone-500 text-xs font-medium mb-1">Recovery Score</p>
                                        <p className="text-3xl font-bold text-stone-800 tracking-tight">88<span className="text-lg text-stone-500 ml-1">%</span></p>
                                    </div>
                                </div>
                                <div className="bg-stone-50 border border-stone-200 border border-stone-200 rounded-3xl p-5 hover:bg-stone-50 transition-colors relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-50 transition-opacity">
                                        <TrendingUp className="w-16 h-16 text-amber-400" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                                            <Stethoscope className="w-4 h-4 text-amber-400" />
                                        </div>
                                        <p className="text-stone-500 text-xs font-medium mb-1">Resting HR</p>
                                        <p className="text-3xl font-bold text-stone-800 tracking-tight">64<span className="text-lg text-stone-500 ml-1">bpm</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="flex-1 bg-stone-50 border border-stone-200 border border-stone-200 rounded-3xl p-5 flex flex-col justify-between hover:bg-stone-50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-stone-500 text-xs font-medium">Activity Trends</p>
                                        <p className="text-stone-800 text-sm font-semibold mt-1">+12% vs last week</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between h-20 space-x-2">
                                    {[30, 45, 20, 60, 40, 80, 65].map((height, i) => (
                                        <div key={i} className="w-full bg-stone-50 border border-stone-200 rounded-t-md relative group">
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                                                className={`w-full absolute bottom-0 rounded-t-md ${i === 5 ? 'bg-gradient-to-t from-yellow-500 to-amber-400' : 'bg-white/[0.2]'}`}
                                            ></motion.div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Floating Decorative Elements */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 p-4 rounded-2xl bg-stone-50 border border-stone-200 border border-stone-200 backdrop-blur-xl shadow-xl flex items-center space-x-3"
                        >
                            <Brain className="w-5 h-5 text-yellow-400" />
                            <div>
                                <p className="text-xs font-semibold text-stone-800">AI Insight</p>
                                <p className="text-[10px] text-yellow-300">Optimal hydration needed</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <section className="py-24 px-6 relative z-10 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-stone-800 mb-4 tracking-tight">How It Works</h2>
                        <p className="text-stone-500 text-lg max-w-2xl mx-auto">A seamless three-step process to transform your medical data into a personalized recovery roadmap.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent -translate-y-1/2 z-0"></div>

                        {[
                            {
                                step: "1",
                                icon: FileText,
                                title: "Upload Reports",
                                desc: "Securely upload your PDFs or photos of medical lab results.",
                                color: "text-yellow-400",
                                bg: "bg-yellow-500/10"
                            },
                            {
                                step: "2",
                                icon: Brain,
                                title: "Neural Extraction",
                                desc: "Our AI accurately extracts and analyzes complex clinical metrics.",
                                color: "text-amber-400",
                                bg: "bg-amber-500/10"
                            },
                            {
                                step: "3",
                                icon: Target, // Using our local Target component below as placeholder
                                title: "Receive Insights",
                                desc: "Get a personalized action plan for optimal health recovery.",
                                color: "text-amber-400",
                                bg: "bg-amber-500/10"
                            }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: idx * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center p-8 bg-white rounded-[2rem] border border-stone-200 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-6 border border-stone-200`}>
                                    <item.icon className={`w-8 h-8 ${item.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-stone-800 mb-3">{item.title}</h3>
                                <p className="text-stone-500 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-stone-800 mb-4 tracking-tight">Premium Features</h2>
                        <p className="text-stone-500 text-lg max-w-2xl mx-auto">Built with cutting-edge technology for doctors and patients requiring the highest standard of care.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Brain,
                                title: "AI Analysis",
                                desc: "Deep-learning models dissect metabolic profiles with clinical precision."
                            },
                            {
                                icon: Activity,
                                title: "Recovery Tracking",
                                desc: "Correlate historical biometrics to forecast recovery velocity."
                            },
                            {
                                icon: FileText,
                                title: "Smart Reports",
                                desc: "Interactive dashboards replacing static, confusing lab printouts."
                            },
                            {
                                icon: Zap,
                                title: "Dynamic Protocols",
                                desc: "Actionable routines mathematically generated in real-time."
                            },
                            {
                                icon: ShieldCheck,
                                title: "HIPAA Compliant",
                                desc: "Military-grade data fortification protecting your medical blueprints."
                            },
                            {
                                icon: Clock,
                                title: "Timeline View",
                                desc: "Visualize your entire recovery journey chronologically."
                            }
                        ].map((feature, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-stone-50 border border-stone-200 hover:border-stone-200 hover:bg-stone-50 transition-all p-8 rounded-[2rem] flex flex-col items-start"
                            >
                                <div className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center mb-6">
                                    <feature.icon className="w-6 h-6 text-stone-800" />
                                </div>
                                <h3 className="text-lg font-semibold text-stone-800 mb-2">{feature.title}</h3>
                                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 relative z-10 bg-gradient-to-b from-[#0A0C10] to-[#0D1016]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-stone-800 mb-4 tracking-tight">Trusted by Professionals</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                quote: "REVA has transformed how my patients understand their bloodwork. It bridges the gap between clinical data and actionable lifestyle changes flawlessly.",
                                name: "Dr. Sarah Jenkins",
                                title: "Endocrinologist"
                            },
                            {
                                quote: "The most intuitive health dashboard I've ever used. The AI insights caught a minor deficiency I completely overlooked in standard reports.",
                                name: "Marcus T.",
                                title: "Recovering Patient"
                            }
                        ].map((test, idx) => (
                            <div key={idx} className="p-8 rounded-[2.5rem] bg-stone-50 border border-stone-200 shadow-lg relative">
                                <div className="flex space-x-1 mb-6">
                                    {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 text-yellow-400 fill-teal-400" />)}
                                </div>
                                <p className="text-lg text-stone-800 font-medium  mb-8 leading-relaxed">"{test.quote}"</p>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-stone-200 flex items-center justify-center">
                                        <User className="w-6 h-6 text-stone-600" />
                                    </div>
                                    <div>
                                        <p className="text-stone-800 font-semibold">{test.name}</p>
                                        <p className="text-stone-500 text-sm">{test.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Minimal Footer CTA */}
            <footer className="py-20 px-6 relative z-10 border-t border-stone-200 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-stone-800 mb-6">Ready to optimize your health?</h2>
                    <p className="text-stone-500 mb-10 w-full sm:w-2/3 mx-auto">Join the elite platform for medical intelligence and take command of your recovery journey today.</p>
                    <button 
                        onClick={() => navigate('/role-selection')}
                        className="px-10 py-4 rounded-full bg-stone-900 text-white font-semibold hover:scale-105 hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        Create Free Account
                    </button>
                    
                    <div className="mt-20 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center text-sm text-stone-500">
                        <p>© 2026 REVA Medical Intelligence. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <span className="hover:text-stone-800 cursor-pointer transition-colors">Privacy</span>
                            <span className="hover:text-stone-800 cursor-pointer transition-colors">Terms</span>
                            <span className="hover:text-stone-800 cursor-pointer transition-colors">HIPAA Info</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Target placeholder component
const Target = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export default LandingPage;


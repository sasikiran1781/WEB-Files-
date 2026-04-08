import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Mail, Lock, Building, BadgeCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const DoctorEnrollment = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic
        navigate('/login', { state: { role: 'doctor' } });
    };

    return (
        <div className="min-h-screen bg-white relative flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-stone-50 border border-stone-200 border border-stone-200 rounded-3xl backdrop-blur-md p-8 shadow-2xl"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-primary" />
                        <span className="text-[9px] font-black tracking-widest text-stone-600 uppercase">Clinician Gateway</span>
                    </div>
                    <h1 className="text-2xl font-display font-black text-stone-800 mb-2 text-center">Practice Enrollment</h1>
                    <p className="text-stone-600 text-center text-xs leading-relaxed max-w-[280px]">
                        Register your clinical credentials to access the provider network.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name / Badge */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">Full Identification</label>
                        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3.5 focus-within:border-primary/50 transition-all">
                            <BadgeCheck className="w-5 h-5 text-stone-500 mr-3" />
                            <input 
                                type="text" 
                                placeholder="Dr. Alexander Vance" 
                                className="w-full bg-transparent border-none text-stone-800 text-sm focus:outline-none placeholder:text-stone-400"
                                required 
                            />
                        </div>
                    </div>

                    {/* Clinic Address / Apartment */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">Clinical Department</label>
                        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3.5 focus-within:border-primary/50 transition-all">
                            <Building className="w-5 h-5 text-stone-500 mr-3" />
                            <input 
                                type="text" 
                                placeholder="Neurology Center, Suite 402" 
                                className="w-full bg-transparent border-none text-stone-800 text-sm focus:outline-none placeholder:text-stone-400"
                                required 
                            />
                        </div>
                    </div>

                    {/* Email / Mail */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">Institutional Mail</label>
                        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3.5 focus-within:border-primary/50 transition-all">
                            <Mail className="w-5 h-5 text-stone-500 mr-3" />
                            <input 
                                type="email" 
                                placeholder="vance@reva.care" 
                                className="w-full bg-transparent border-none text-stone-800 text-sm focus:outline-none placeholder:text-stone-400"
                                required 
                            />
                        </div>
                    </div>

                    {/* Password / Lock */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest ml-1">Secure Core Key</label>
                        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3.5 focus-within:border-primary/50 transition-all relative">
                            <Lock className="w-5 h-5 text-stone-500 mr-3" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                className="w-full bg-transparent border-none text-stone-800 text-sm focus:outline-none placeholder:text-stone-400 pr-10"
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-stone-500 hover:text-stone-800"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Checkbox for License Certification */}
                    <div className="flex items-start gap-3 mt-6">
                        <button 
                            type="button" 
                            onClick={() => setAgreed(!agreed)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all mt-0.5 ${agreed ? 'bg-primary border-primary' : 'border-white/20 bg-stone-50'}`}
                        >
                            {agreed && <CheckCircle2 className="w-4 h-4 text-stone-800" />}
                        </button>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                            I certify that I hold a valid license to practice medicine/dentistry and agree to the Provider Terms of Service.
                        </p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={!agreed}
                        className="btn-primary w-full mt-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Complete Registration
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default DoctorEnrollment;

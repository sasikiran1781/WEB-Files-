import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Stethoscope, ChevronRight, Activity } from 'lucide-react';

const RoleSelection = () => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        if (role === 'patient') {
            navigate('/login', { state: { role: 'patient' } });
        } else {
            navigate('/doctor-enrollment');
        }
    };

    return (
        <div className="min-h-screen bg-white relative flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none"></div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-12">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-8 h-8 text-primary animate-pulse" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-stone-600 uppercase">Secure Gateway</span>
                    </div>
                    <h1 className="text-3xl font-display font-black text-stone-800 mb-3 text-center">Identify Your Role</h1>
                    <p className="text-stone-700 text-center text-sm leading-relaxed max-w-[280px]">
                        Select your access level to synchronize clinical data or manage treatment plans.
                    </p>
                </div>

                <div className="space-y-5">
                    {/* Patient Portal */}
                    <button 
                        onClick={() => handleRoleSelect('patient')}
                        className="w-full group relative flex items-center p-6 bg-stone-50 border border-stone-200 backdrop-blur-md border border-stone-200 rounded-3xl shadow-sm hover:border-primary/40 hover:bg-stone-50 border border-stone-200 transition-all hover:scale-[1.02] duration-300"
                    >
                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center mr-5 border border-primary/20">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left flex-grow pr-4">
                            <h2 className="text-xl font-display font-black text-stone-800 mb-1">Patient Portal</h2>
                            <p className="text-xs text-stone-600 leading-snug">
                                View treatment plans, 3D scans, and appointments.
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>

                    {/* Clinician Access */}
                    <button 
                        onClick={() => handleRoleSelect('doctor')}
                        className="w-full group relative flex items-center p-6 bg-stone-50 border border-stone-200 backdrop-blur-md border border-stone-200 rounded-3xl shadow-sm hover:border-primary/40 hover:bg-stone-50 border border-stone-200 transition-all hover:scale-[1.02] duration-300"
                    >
                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center mr-5 border border-primary/20">
                            <Stethoscope className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-left flex-grow pr-4">
                            <h2 className="text-xl font-display font-black text-stone-800 mb-1">Clinician Access</h2>
                            <p className="text-xs text-stone-600 leading-snug">
                                Modify diagnostics, approve requests, and manage patients.
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                </div>

                <div className="mt-16 flex flex-col items-center">
                    <p className="text-[10px] font-black text-stone-500 tracking-wide uppercase">
                        Version 2.0 • ProstoCalc Secure Core
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RoleSelection;

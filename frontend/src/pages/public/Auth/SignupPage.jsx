import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, User, Loader2, ArrowRight, ShieldCheck, CheckCircle2, Database, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import { authService } from '../../../services/api';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusText, setStatusText] = useState('');
    const { login } = useApp();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim().toLowerCase();
        
        if (!trimmedName || trimmedName.length < 2) {
            setError("Please enter a valid full name.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!formData.password || !formData.confirmPassword) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setStatusText('Creating account...');

        try {
            await new Promise(r => setTimeout(r, 600));
            setStatusText('Securing credentials...');
            
            // Sending a robust payload to handle any backend naming variants
            const signupPayload = { 
                full_name: trimmedName,
                name: trimmedName,
                email: trimmedEmail,
                password: formData.password,
                phone: ""
            };
            
            console.log('Attempting signup with:', { ...signupPayload, password: '***' });
            await authService.signup(signupPayload);
            
            setStatusText('Redirecting to login...');
            await new Promise(r => setTimeout(r, 600));
            
            navigate('/login');
        } catch (err) {
            console.error('Signup Error:', err);
            const errorMessage = typeof err === 'string' ? err : (err.message || 'Registration failed. Please try again.');
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setStatusText('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden bg-white font-sans">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[150px]  pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px]  pointer-events-none" style={{ animationDelay: '2s' }}></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
                            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl group-hover:bg-stone-50 transition-all duration-300 shadow-sm relative backdrop-blur-md">
                                <Activity className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300" />
                            </div>
                            <span className="text-2xl font-bold text-stone-800 tracking-tight">REVA</span>
                        </Link>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-bold text-stone-800 mb-2"
                    >
                        Create an account
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-stone-500 text-sm font-medium"
                    >
                        Register your clinical profile for AI-powered monitoring
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="backdrop-blur-2xl bg-stone-50 p-8 md:p-10 rounded-[2rem] border border-stone-200 shadow-2xl relative overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-medium text-stone-500 mb-2 pl-1">
                                Full Name
                            </label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within/input:text-yellow-400 transition-colors duration-300" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white border border-stone-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-yellow-500/50 outline-none transition-all duration-300 text-stone-800 placeholder-[#A1A5AB]/50 shadow-inner"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs font-medium text-stone-500 mb-2 pl-1">
                                Email Address
                            </label>
                            <div className="relative group/input">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within/input:text-yellow-400 transition-colors duration-300" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white border border-stone-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-yellow-500/50 outline-none transition-all duration-300 text-stone-800 placeholder-[#A1A5AB]/50 shadow-inner"
                                    placeholder="name@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-stone-500 mb-2 pl-1">
                                Password
                            </label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within/input:text-yellow-400 transition-colors duration-300" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white border border-stone-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-yellow-500/50 outline-none transition-all duration-300 text-stone-800 placeholder-[#A1A5AB]/50 shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-stone-500 mb-2 pl-1">
                                Confirm Password
                            </label>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within/input:text-yellow-400 transition-colors duration-300" />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-white border border-stone-200 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:border-yellow-500/50 outline-none transition-all duration-300 text-stone-800 placeholder-[#A1A5AB]/50 shadow-inner"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-5 pt-2">
                            <div className="flex items-start space-x-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                                <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-stone-500 font-medium leading-relaxed">
                                    I agree to the <span className="text-stone-800 font-semibold">HIPAA-compliant</span> clinical data processing terms and AI protocols.
                                </p>
                            </div>

                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium flex items-center space-x-3 overflow-hidden"
                                    >
                                        <ShieldCheck className="w-5 h-5 shrink-0" />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-semibold flex items-center justify-center space-x-2 hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] relative overflow-hidden group/btn mt-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                        <span>{statusText || 'Signing up...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-200 text-center">
                        <p className="text-sm text-stone-500 font-medium">
                            Already have an account? <Link to="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 ml-1">Log in</Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignupPage;

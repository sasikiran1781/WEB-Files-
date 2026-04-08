import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Loader2, ArrowRight, ShieldCheck, Database, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import { authService } from '../../../services/api';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusText, setStatusText] = useState('');
    const { login } = useApp();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        const trimmedEmail = formData.email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!formData.password) {
            setError('Please enter your password.');
            return;
        }

        setIsLoading(true);
        setStatusText('Connecting to server...');

        try {
            await new Promise(r => setTimeout(r, 600));
            setStatusText('Authenticating credentials...');
            const loginPayload = { email: trimmedEmail, password: formData.password };
            const response = await authService.login(loginPayload);
            setStatusText('Initializing dashboard...');
            await new Promise(r => setTimeout(r, 400));
            login(response.user, response.token);
            navigate('/app/dashboard');
        } catch (err) {
            setError(err || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
            setStatusText('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-white font-sans">
            {/* Soft Ambient Gradients */}
            {/* soft Ambient Gradients with continuous fluid motion */}
            <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-yellow-600/10 rounded-full blur-[150px]  pointer-events-none"
            ></motion.div>
            <motion.div 
                animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0], opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
                className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[150px]  pointer-events-none"
            ></motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-10">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <Link to="/" className="inline-flex items-center space-x-3 mb-6 group">
                            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl group-hover:bg-stone-50 transition-all duration-300 shadow-sm relative backdrop-blur-md">
                                <Activity className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300" />
                            </div>
                            <span className="text-3xl font-bold text-stone-800 tracking-tight">REVA</span>
                        </Link>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-stone-800 mb-2"
                    >
                        Sign in to account
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-stone-500 text-sm font-medium"
                    >
                        Access your clinical intelligence dashboard
                    </motion.p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="backdrop-blur-2xl bg-stone-50 p-8 md:p-10 rounded-[2rem] border border-stone-200 shadow-2xl relative overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                        <div>
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
                            <div className="flex justify-between items-center mb-2 pl-1">
                                <label className="block text-xs font-medium text-stone-500">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300">Forgot?</Link>
                            </div>
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

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-semibold flex items-center justify-center space-x-2 hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] relative overflow-hidden group/btn"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                                        <span>{statusText || 'Signing in...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-200 text-center">
                        <p className="text-sm text-stone-500 font-medium">
                            Don't have an account? <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 ml-1">Sign up</Link>
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-10 flex items-center justify-center space-x-6 text-stone-500/50"
                >
                    <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4" />
                        <span className="text-xs font-medium">Encrypted DB Connection</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-100"></div>
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-medium">Zero-Trust Auth</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;

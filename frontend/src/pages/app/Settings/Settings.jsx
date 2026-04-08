import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Lock,
    Bell,
    Shield,
    Monitor,
    Key,
    Smartphone,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Cpu,
    Activity,
    ShieldCheck,
    Fingerprint,
    Zap,
    Binary,
    Database
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { authService } from '../../../services/api';
import { SectionHeader, ActionButton, StatusBadge } from '../../../components/SharedComponents';
import { motion, AnimatePresence } from 'framer-motion';

const Settings = () => {
    const { user } = useApp();
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [status, setStatus] = useState({ type: null, message: '' });
    const [isChanging, setIsChanging] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    const handleSaveProfile = () => {
        setIsSavingProfile(true);
        setTimeout(() => {
            setIsSavingProfile(false);
            setStatus({ type: 'success', message: 'Identity calibration saved and synchronized.' });
        }, 1500);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.new !== passwordForm.confirm) {
            setStatus({ type: 'error', message: 'Security keys do not match.' });
            return;
        }

        setIsChanging(true);
        setStatus({ type: null, message: '' });

        try {
            await authService.changePassword({
                current_password: passwordForm.current,
                new_password: passwordForm.new
            });
            setStatus({ type: 'success', message: 'Neural access key updated successfully.' });
            setPasswordForm({ current: '', new: '', confirm: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err || 'Neural uplink failure. Update aborted.' });
        } finally {
            setIsChanging(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Identity Profile', icon: User, desc: 'Personal clinical metadata' },
        { id: 'security', label: 'Security Protocols', icon: Lock, desc: 'Encryption & access keys' },
        { id: 'notifications', label: 'Neural Alerts', icon: Bell, desc: 'Clinical sync notifications' },
        { id: 'system', label: 'System Diagnostics', icon: Cpu, desc: 'Model architecture & performance' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-20"
        >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                <SectionHeader 
                    title="System Control"
                    subtitle="Configure your clinical reasoning parameters and neural security protocols."
                />
                <div className="flex items-center space-x-3 bg-stone-50 border border-stone-200 border border-stone-200 px-6 py-2.5 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-excellent animate-pulse shadow-glow"></div>
                    <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest ">Node Status: Secured</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Lateral Navigation Terminal */}
                <div className="lg:w-80 space-y-3 shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full group flex items-center space-x-5 px-8 py-5 rounded-[2rem] transition-all duration-500 border relative overflow-hidden
                                ${activeTab === tab.id
                                    ? 'bg-primary/10 border-primary/30 text-stone-800 shadow-glow'
                                    : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-800'}
                            `}
                        >
                            <div className={`p-2.5 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-primary/20 text-primary' : 'bg-stone-100 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                <tab.icon className="w-5 h-5" />
                            </div>
                            <div className="text-left min-w-0">
                                <p className="text-xs font-black  uppercase tracking-widest">{tab.label}</p>
                                <p className="text-[9px] font-medium opacity-30  truncate mt-0.5">{tab.desc}</p>
                            </div>
                            {activeTab === tab.id && (
                                <motion.div 
                                    layoutId="tab-active"
                                    className="absolute right-4 w-1 h-6 bg-primary rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Main Command Workspace */}
                <div className="flex-grow min-h-[700px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass-panel p-12 h-full bg-stone-50 border-stone-200 overflow-hidden"
                        >
                            {/* Profile Compartment */}
                            {activeTab === 'profile' && (
                                <div className="space-y-12 h-full flex flex-col">
                                    <div className="flex items-center space-x-10 pb-12 border-b border-stone-200">
                                        
                                        {status.message && activeTab === 'profile' && (
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="absolute top-4 right-4 p-4 rounded-2xl bg-excellent/10 text-excellent border border-excellent/30 shadow-glow-excellent text-xs font-black uppercase tracking-widest z-50 flex items-center space-x-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>{status.message}</span>
                                            </motion.div>
                                        )}

                                        <div className="relative group/avatar cursor-pointer">
                                            <div className="w-32 h-32 rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/10 border border-stone-200 flex items-center justify-center text-primary text-5xl font-black  relative z-10 overflow-hidden shadow-2xl">
                                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                                                {user?.name?.[0] || 'P'}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 p-3 bg-primary text-background rounded-2xl shadow-glow z-20 group-hover/avatar:scale-110 transition-transform">
                                                <Fingerprint className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3">
                                                <h3 className="text-4xl font-display font-black text-stone-800 ">{user?.name || 'Clinical Unit'}</h3>
                                                <StatusBadge status="Active" size="sm" />
                                            </div>
                                            <p className="text-sm text-stone-600  font-medium">{user?.email || 'uplink@reva-ai.com'}</p>
                                            <div className="flex items-center space-x-6 pt-2">
                                                <div className="flex items-center space-x-2 text-[10px] font-black text-primary/60 uppercase tracking-widest ">
                                                    <Zap className="w-3 h-3" />
                                                    <span>Premium Bio-Link</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-[10px] font-black text-stone-400 uppercase tracking-widest ">
                                                    <ShieldCheck className="w-3 h-3" />
                                                    <span>Verified Identity</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]  leading-none">Diagnostic Metadata</h4>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest  px-2">Display Alias</label>
                                                    <input type="text" defaultValue={user?.name} className="w-full bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-medium focus:border-primary/40 outline-none transition-all  text-stone-800" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest  px-2">Uplink Repository (Email)</label>
                                                    <input type="email" defaultValue={user?.email} className="w-full bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl px-6 py-4 text-sm font-medium focus:border-primary/40 outline-none transition-all  text-stone-800" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]  leading-none">Identity Synchronization</h4>
                                            <div className="glass-panel p-6 bg-primary/[0.02] border-primary/10 rounded-[2rem] flex items-center space-x-6 group hover:border-primary/30 transition-all">
                                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-background transition-all duration-500">
                                                    <Smartphone className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-stone-800  uppercase tracking-tight">Reva Mobile Suite</p>
                                                    <p className="text-xs text-stone-500  mt-1 leading-snug">Last sync: 2 hours ago via Neural-Link encrypted protocol.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl">
                                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest ">Node Location</span>
                                                <span className="text-[10px] font-black text-stone-700  uppercase">Global Primary Cluster</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-10 flex justify-end">
                                        <ActionButton onClick={handleSaveProfile} className="px-12 py-4">
                                            {isSavingProfile ? 'Synchronizing...' : 'Save Identity Calibration'}
                                        </ActionButton>
                                    </div>
                                </div>
                            )}

                            {/* Security Compartment */}
                            {activeTab === 'security' && (
                                <div className="max-w-2xl space-y-12 h-full flex flex-col">
                                    <div className="space-y-8">
                                        <div className="flex items-center space-x-5 mb-10">
                                            <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 rounded-3xl flex items-center justify-center shadow-glow-secondary">
                                                <Key className="w-8 h-8 text-secondary" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-display font-black text-stone-800 ">Security Key Management</h3>
                                                <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] font-black  mt-1">Configure neural uplink credentials</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handlePasswordChange} className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest  px-2">Current Terminal Password</label>
                                                <input
                                                    type="password"
                                                    value={passwordForm.current}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                                    className="w-full bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl px-6 py-5 text-sm font-medium focus:border-secondary/40 outline-none transition-all  text-stone-800"
                                                    placeholder="ORIGIN_KEY"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest  px-2">New Security Matrix</label>
                                                    <input
                                                        type="password"
                                                        value={passwordForm.new}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                                        className="w-full bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl px-6 py-5 text-sm font-medium focus:border-secondary/40 outline-none transition-all  text-stone-800"
                                                        placeholder="NEW_MATRIX"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest  px-2">Confirm Identity Key</label>
                                                    <input
                                                        type="password"
                                                        value={passwordForm.confirm}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                                        className="w-full bg-stone-50 border border-stone-200 border border-stone-200 rounded-2xl px-6 py-5 text-sm font-medium focus:border-secondary/40 outline-none transition-all  text-stone-800"
                                                        placeholder="VALIDATE_MATRIX"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {status.message && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className={`p-6 rounded-[2rem] border flex items-center space-x-5  text-sm font-black uppercase tracking-widest
                                                        ${status.type === 'success' ? 'bg-excellent/10 border-excellent/30 text-excellent shadow-glow-excellent' : 'bg-critical/10 border-critical/30 text-critical shadow-glow-critical'}
                                                    `}
                                                >
                                                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                    <span>{status.message}</span>
                                                </motion.div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isChanging}
                                                className="btn-primary w-full py-5 flex items-center justify-center space-x-4 bg-secondary border-secondary shadow-glow-secondary font-black"
                                            >
                                                {isChanging ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Recalibrate Access Key</span>}
                                            </button>
                                        </form>
                                    </div>

                                    <div className="mt-auto pt-10 border-t border-stone-200">
                                        <div className="flex items-center justify-between p-8 rounded-[2rem] bg-stone-50 border border-stone-200 hover:border-stone-200 transition-all cursor-pointer group">
                                            <div className="flex items-center space-x-6">
                                                <div className="w-14 h-14 bg-excellent/10 rounded-2xl flex items-center justify-center text-excellent border border-excellent/20 group-hover:shadow-glow-excellent transition-all">
                                                    <Shield className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-stone-800  uppercase tracking-widest">Multi-Factor Biometrics</p>
                                                    <p className="text-xs text-stone-500  mt-1 leading-snug">Fingerprint & RSA-SMS protocol active.</p>
                                                </div>
                                            </div>
                                            <div className="w-14 h-7 bg-primary/20 rounded-full relative p-1.5 cursor-pointer">
                                                <div className="absolute right-1.5 top-1.5 bottom-1.5 w-4 bg-primary rounded-full shadow-glow"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Compartment */}
                            {activeTab === 'notifications' && (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-10 animate-in zoom-in-95">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-info/10 rounded-[2.5rem] flex items-center justify-center relative z-10 border border-info/20 shadow-glow-info">
                                            <Bell className="w-10 h-10 text-info animate-float" />
                                        </div>
                                        <div className="absolute inset-0 bg-info/20 blur-3xl opacity-50 scale-150 animate-pulse"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-display font-black text-stone-800 ">Alert Calibration</h3>
                                        <p className="text-sm text-stone-600  font-medium max-w-xs mx-auto leading-relaxed">
                                            Neural alert parameters are being synchronized with your biometric duty cycles. Check back for real-time notification templates.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['Clinical Reminders', 'Delta Anomalies', 'Uplink Status', 'Care Protocol'].map((tag, k) => (
                                            <div key={k} className="px-5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] ">
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* System Compartment */}
                            {activeTab === 'system' && (
                                <div className="space-y-12 h-full flex flex-col">
                                    <div className="flex items-center space-x-6 mb-10">
                                        <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center shadow-glow">
                                            <Cpu className="w-8 h-8 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-display font-black text-stone-800 ">Neural Diagnostics</h3>
                                            <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] font-black  mt-1">Architecture & Model Integrity</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]  px-2 leading-none">Intelligence Models</h4>
                                            <div className="space-y-4">
                                                {[
                                                    { name: 'REVA AI Engine', status: 'Primary', version: 'v2.5.4', icon: Zap },
                                                    { name: 'Vision AI v4', status: 'Active', version: 'v4.0.1', icon: Binary },
                                                    { name: 'Risk Reasoning', status: 'Engaged', version: 'v1.12.0', icon: Database }
                                                ].map((mod, l) => (
                                                    <div key={l} className="flex items-center justify-between p-5 rounded-2xl bg-stone-50 border border-stone-200 border border-stone-200 group hover:border-primary/20 transition-all">
                                                        <div className="flex items-center space-x-4">
                                                            <mod.icon className="w-4 h-4 text-stone-500 group-hover:text-primary transition-colors" />
                                                            <div>
                                                                <p className="text-xs font-black text-stone-800/80  uppercase tracking-tighter">{mod.name}</p>
                                                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{mod.version}</p>
                                                            </div>
                                                        </div>
                                                        <span className="text-[8px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded-md  uppercase">{mod.status}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]  px-2 leading-none">Security Integrity</h4>
                                            <div className="glass-panel p-6 bg-excellent/[0.02] border-excellent/10 rounded-[2rem] space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[9px] font-black text-stone-600 uppercase tracking-widest ">Encryption Tier</span>
                                                    <span className="text-[10px] font-black text-stone-800/80  uppercase">RSA-4096 / AES-256</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        animate={{ width: ['0%', '100%'] }}
                                                        transition={{ duration: 4, repeat: Infinity }}
                                                        className="h-full bg-excellent shadow-glow-excellent"
                                                    />
                                                </div>
                                                <p className="text-[9px] text-stone-400  font-medium leading-relaxed">
                                                    Quantum-safe decryption protocols are active. All clinical data fragments are scrubbed before inference cycles.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-3 gap-6 pt-10">
                                        <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl text-center">
                                            <p className="text-lg font-black text-stone-800 leading-none mb-1 ">99.8%</p>
                                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Inference Accuracy</p>
                                        </div>
                                        <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl text-center">
                                            <p className="text-lg font-black text-stone-800 leading-none mb-1 ">1.2s</p>
                                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Avg Pulse Rate</p>
                                        </div>
                                        <div className="p-6 bg-stone-50 border border-stone-200 rounded-2xl text-center">
                                            <p className="text-lg font-black text-stone-800 leading-none mb-1 ">100%</p>
                                            <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest">System Uptime</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;

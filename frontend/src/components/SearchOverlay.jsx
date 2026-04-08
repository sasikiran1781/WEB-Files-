import React, { useState, useEffect } from 'react';
import { Search, FileText, User, Activity, Command, X, ArrowRight, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const { patientHistory, latestAnalysis } = useApp();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            const handleEsc = (e) => { e.key === 'Escape' && setTimeout(() => onClose(), 100); };
            window.addEventListener('keydown', handleEsc);
            return () => {
                document.body.style.overflow = 'auto';
                window.removeEventListener('keydown', handleEsc);
            };
        }
    }, [isOpen, onClose]);

    const results = React.useMemo(() => {
        if (!query.trim()) {
            return [];
        }

        const q = query.toLowerCase();
        const filtered = [];

        // Search in reports
        (patientHistory || []).forEach(report => {
            if (report.report_type?.toLowerCase().includes(q) || report.hospital_name?.toLowerCase().includes(q)) {
                filtered.push({ type: 'report', title: report.report_type, subtitle: report.report_date, id: report.id, icon: FileText });
            }
        });

        // Search in metrics
        const allMetrics = latestAnalysis?.medical_metrics || [];
        allMetrics.forEach(m => {
            if (m.metric?.toLowerCase().includes(q)) {
                filtered.push({ type: 'metric', title: m.metric, subtitle: `${m.value} ${m.unit}`, id: 'medical-data', icon: Activity });
            }
        });

        // App routes
        const routes = [
            { title: 'Dashboard', path: '/app/dashboard', icon: Activity },
            { title: 'REVA Brain', path: '/app/brain', icon: Brain },
            { title: 'Care & Meds', path: '/app/care', icon: User },
            { title: 'Settings', path: '/app/settings', icon: Command },
        ];
        routes.forEach(r => {
            if (r.title.toLowerCase().includes(q)) {
                filtered.push({ type: 'route', title: r.title, subtitle: 'Application View', path: r.path, icon: r.icon });
            }
        });

        return filtered.slice(0, 8);
    }, [query, patientHistory, latestAnalysis]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>

            <div className="w-full max-w-2xl glass-card border-stone-200 shadow-strong relative animate-in slide-in-from-top-4 duration-300 overflow-hidden">
                <div className="p-6 border-b border-stone-200 flex items-center space-x-4">
                    <Search className="w-6 h-6 text-primary" />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search clinical records, metrics, or medical intelligence..."
                        className="flex-grow bg-transparent border-none outline-none text-lg text-stone-800 placeholder:text-stone-400 "
                    />
                    <div className="flex items-center space-x-2 px-2 py-1 bg-stone-100 rounded-lg border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest  leading-none">ESC</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-stone-400" />
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
                    {results.length > 0 ? (
                        results.map((res, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    if (res.type === 'report') navigate(`/app/report/${res.id}`);
                                    else if (res.type === 'metric') navigate('/app/medical-data');
                                    else if (res.type === 'route') navigate(res.path);
                                    setTimeout(() => onClose(), 100);
                                }}
                                className="w-full flex items-center p-4 rounded-xl hover:bg-primary/10 group transition-all text-left"
                            >
                                <div className="p-2 bg-stone-100 rounded-lg border border-stone-200 group-hover:border-primary/30 group-hover:text-primary mr-4 transition-all">
                                    <res.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-semibold text-stone-800 group-hover:text-primary transition-colors truncate ">{res.title}</p>
                                    <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mt-1 group-hover:text-primary/50 transition-colors">{res.subtitle}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-primary transition-all group-hover:translate-x-1" />
                            </button>
                        ))
                    ) : query ? (
                        <div className="py-12 text-center">
                            <p className="text-stone-500 ">No clinical intelligence matches your query.</p>
                        </div>
                    ) : (
                        <div className="py-4 px-2">
                            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4 ">Quick Actions</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'REVA Brain', path: '/app/brain', icon: Brain },
                                    { label: 'Upload Record', path: '/app/upload', icon: FileText },
                                    { label: 'System Policy', path: '/app/settings', icon: Command },
                                    { label: 'Medical Profile', path: '/app/medical-data', icon: User },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { navigate(item.path); setTimeout(() => onClose(), 100); }}
                                        className="flex items-center space-x-3 p-3 rounded-xl bg-stone-100 border border-stone-200 hover:border-primary/30 transition-all text-left group"
                                    >
                                        <item.icon className="w-4 h-4 text-stone-500 group-hover:text-primary" />
                                        <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-800 ">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] ">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                            <div className="px-1.5 py-0.5 bg-stone-100 rounded border border-stone-200">↑↓</div>
                            <span>Navigate</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="px-1.5 py-0.5 bg-stone-100 rounded border border-stone-200">↵</div>
                            <span>Select</span>
                        </div>
                    </div>
                    <span>Clinical Engine v2.0</span>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;

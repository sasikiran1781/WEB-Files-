import React, { useEffect } from 'react';
import { X, Bell, Info, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

const NotificationsPanel = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            const handleEsc = (e) => { e.key === 'Escape' && onClose(); };
            window.addEventListener('keydown', handleEsc);
            return () => window.removeEventListener('keydown', handleEsc);
        }
    }, [isOpen, onClose]);

    const notifications = [
        {
            id: 1,
            type: 'info',
            title: 'AI Analysis Complete',
            message: 'Your Renal Function test from Unity Labs has been successfully analyzed.',
            time: '12 mins ago',
            icon: CheckCircle2,
            color: 'text-excellent',
            bg: 'bg-excellent/10'
        },
        {
            id: 2,
            type: 'warning',
            title: 'Medical Alert',
            message: 'Potassium levels are slightly elevated (5.2 mEq/L). Review your hydration protocol.',
            time: '2 hours ago',
            icon: AlertTriangle,
            color: 'text-moderate',
            bg: 'bg-moderate/10'
        },
        {
            id: 3,
            type: 'info',
            title: 'System Update',
            message: 'Gemini 2.0 Ultra is now powering your clinical reasoning engine.',
            time: 'Yesterday',
            icon: Info,
            color: 'text-primary',
            bg: 'bg-primary/10'
        }
    ];

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-white/40 backdrop-blur-sm z-[60] animate-in fade-in duration-300" onClick={onClose}></div>
            )}

            {/* Panel */}
            <aside className={`
        fixed top-0 right-0 h-full w-full max-w-sm bg-stone-50 border-l border-stone-200 z-[70] transition-transform duration-500 ease-out shadow-2xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
                <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-stone-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Bell className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl font-display font-bold ">Alert Center</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-stone-600" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 space-y-4">
                        {notifications.map((n) => (
                            <div key={n.id} className="p-5 rounded-2xl bg-stone-100 border border-stone-200 hover:border-stone-200 transition-all cursor-pointer group">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg ${n.bg} ${n.color} mt-1`}>
                                        <n.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-bold text-sm text-stone-800 ">{n.title}</h4>
                                            <span className="text-[10px] text-stone-400 font-bold uppercase">{n.time}</span>
                                        </div>
                                        <p className="text-xs text-stone-600 leading-relaxed  line-clamp-2">{n.message}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {notifications.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                                <Bell className="w-12 h-12 mb-4" />
                                <p className="text-sm ">No active medical alerts.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-8 border-t border-stone-200 bg-stone-50">
                        <button className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-all text-xs font-bold uppercase tracking-widest  group">
                            <span>Clear All Alerts</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default NotificationsPanel;

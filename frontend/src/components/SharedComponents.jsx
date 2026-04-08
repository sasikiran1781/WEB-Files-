import React from 'react';
import { TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Clock, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const SectionHeader = ({ title, subtitle, badge }) => (
    <div className="mb-10">
        {badge && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>{badge}</span>
            </div>
        )}
        <h2 className="text-3xl md:text-4xl font-display font-bold text-stone-800 mb-2">{title}</h2>
        {subtitle && <p className="text-stone-600 font-medium text-lg ">{subtitle}</p>}
    </div>
);

export const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorMap = {
        primary: 'text-primary bg-primary/10 border-primary/20 shadow-primary/10',
        excellent: 'text-excellent bg-excellent/10 border-excellent/20 shadow-excellent/10',
        critical: 'text-critical bg-critical/10 border-critical/20 shadow-critical/10',
        moderate: 'text-moderate bg-moderate/10 border-moderate/20 shadow-moderate/10',
        secondary: 'text-secondary bg-secondary/10 border-secondary/20 shadow-secondary/10',
        info: 'text-info bg-info/10 border-info/20 shadow-info/10',
    };

    const style = colorMap[color] || colorMap.primary;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${style.split(' ')[1]} ${style.split(' ')[0]} transition-all duration-500 group-hover:scale-110`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center space-x-1 text-xs font-black uppercase tracking-tighter ${trend === 'up' ? 'text-excellent' : 'text-critical'}`}>
                        {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{trendValue}%</span>
                    </div>
                )}
            </div>
            <div>
                <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest mb-2 ">{title}</p>
                <h3 className="text-3xl font-display font-bold text-stone-800 group-hover:text-glow transition-all duration-300">{value}</h3>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 w-0 bg-current ${style.split(' ')[0]} transition-all duration-500 group-hover:w-full opacity-50`} />
        </motion.div>
    );
};

export const MetricCard = ({ label, value, unit, status, range }) => {
    // Dynamically calculate status and progress bar percentage if range is provided
    let derivedStatus = status || 'OPTIMAL';
    let progressPercent = 68;

    if (range && value) {
        const numVal = parseFloat(value);
        if (!isNaN(numVal)) {
            if (range.includes('-')) {
                const parts = range.split('-');
                const min = parseFloat(parts[0]);
                const max = parseFloat(parts[1]);
                if (!isNaN(min) && !isNaN(max)) {
                    if (numVal > max) {
                        derivedStatus = 'Critical';
                    } else if (numVal < min) {
                        derivedStatus = 'Low';
                    } else {
                        derivedStatus = 'Optimal';
                    }
                    progressPercent = Math.max(0, Math.min(100, ((numVal - min) / (max - min)) * 100));
                }
            } else if (range.includes('<')) {
                const max = parseFloat(range.replace(/[^\d.]/g, ''));
                if (!isNaN(max)) {
                    if (numVal > max) {
                        derivedStatus = 'Critical';
                    } else {
                        derivedStatus = 'Optimal';
                    }
                    progressPercent = Math.max(0, Math.min(100, (numVal / max) * 50));
                }
            } else if (range.includes('>')) {
                const min = parseFloat(range.replace(/[^\d.]/g, ''));
                if (!isNaN(min)) {
                    if (numVal < min) {
                        derivedStatus = 'Critical';
                    } else {
                        derivedStatus = 'Optimal';
                    }
                    progressPercent = 50 + Math.max(0, Math.min(50, ((numVal - min) / min) * 50));
                }
            }
        }
    }

    const getStatusStyles = (s) => {
        switch (s?.toLowerCase()) {
            case 'critical': return 'text-critical border-critical/30 bg-critical/10';
            case 'low': return 'text-info border-info/30 bg-info/10';
            case 'moderate': return 'text-moderate border-moderate/30 bg-moderate/10';
            case 'excellent':
            case 'optimal':
            case 'stable':
            case 'normal': return 'text-excellent border-excellent/30 bg-excellent/10';
            default: return 'text-info border-info/30 bg-info/10';
        }
    };

    const statusStyle = getStatusStyles(derivedStatus);
    const isCritical = derivedStatus.toLowerCase() === 'critical';

    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-card p-6 group cursor-default transition-colors ${isCritical ? 'border-critical/30 bg-critical/5' : ''}`}
        >
            <div className="flex justify-between items-start mb-5">
                <span className="text-stone-600 text-[10px] font-black uppercase tracking-[0.15em] ">{label}</span>
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${statusStyle}`}>
                    {derivedStatus}
                </span>
            </div>
            <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-display font-bold transition-colors duration-300 ${isCritical ? 'text-critical group-hover:text-critical/80' : 'text-stone-800 group-hover:text-primary'}`}>{value}</span>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{unit}</span>
            </div>
            {range && (
                <div className="mt-6">
                    <div className="flex justify-between mb-2 text-[9px] font-black uppercase tracking-widest text-stone-400 ">
                        <span>Range: {range}</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden relative">
                        <div className={`h-full ${isCritical ? 'bg-critical shadow-[0_0_10px_rgba(255,59,48,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(0,240,255,0.5)]'} transition-all duration-1000 ease-out`} style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export const ScoreRing = ({ score, size = 150 }) => {
    const radius = (size / 2) - 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s >= 85) return '#34C759';
        if (s >= 70) return '#00F0FF';
        if (s >= 50) return '#FF9F0A';
        return '#FF3B30';
    };

    const color = getColor(score);

    return (
        <div className="relative flex items-center justify-center p-4" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 absolute" width={size} height={size}>
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="10"
                    fill="transparent"
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    filter="url(#glow)"
                />
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
                <span className="text-5xl font-display font-black text-stone-800 leading-none">{score}</span>
                <span className="text-[10px] text-stone-600 uppercase tracking-[0.2em] font-black mt-2 ">Recovery</span>
            </div>
            <div 
                className="absolute inset-0 rounded-full blur-3xl opacity-10"
                style={{ backgroundColor: color }}
            />
        </div>
    );
};

export const RecommendationCard = ({ type, items, icon: Icon }) => (
    <div className="glass-card p-6 hover:bg-stone-50">
        <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-xl ${type === 'Avoid' ? 'bg-critical/10 text-critical' : 'bg-excellent/10 text-excellent'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-lg">{type === 'Avoid' ? 'Restrictions' : 'Dietary Recommendations'}</h4>
        </div>
        <div className="space-y-3">
            {items?.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-sm text-stone-600 group">
                    <div className={`w-1.5 h-1.5 rounded-full ${type === 'Avoid' ? 'bg-critical/40' : 'bg-excellent/40'} group-hover:scale-125 transition-all`} />
                    <span className="group-hover:text-stone-800 transition-colors ">{item}</span>
                </div>
            ))}
        </div>
    </div>
);

export const StatusBadge = ({ status }) => {
    const config = {
        'Critical': { color: 'text-critical', bg: 'bg-critical/10', border: 'border-critical/20', icon: AlertCircle },
        'Moderate': { color: 'text-moderate', bg: 'bg-moderate/10', border: 'border-moderate/20', icon: Clock },
        'Excellent': { color: 'text-excellent', bg: 'bg-excellent/10', border: 'border-excellent/20', icon: CheckCircle2 },
        'Normal': { color: 'text-excellent', bg: 'bg-excellent/10', border: 'border-excellent/20', icon: CheckCircle2 },
        'High': { color: 'text-critical', bg: 'bg-critical/10', border: 'border-critical/20', icon: AlertCircle }
    };

    const style = config[status] || config['Moderate'];
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${style.bg} ${style.color} ${style.border} shadow-lg shadow-black/20`}>
            <Icon className="w-4 h-4" />
            <span>{status} {status === 'High' || status === 'Critical' ? 'Risk' : 'Stability'}</span>
        </span>
    );
};

export const ActionButton = ({ children, icon: Icon, onClick, variant = 'primary' }) => (
    <button 
        onClick={onClick}
        className={variant === 'primary' ? 'btn-primary group' : 'btn-outline group'}
    >
        <span>{children}</span>
        {Icon ? <Icon className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> : <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
    </button>
);


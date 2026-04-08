import React, { useEffect, useState } from 'react';
import {
    Activity,
    ArrowRight,
    AlertCircle,
    Droplet,
    FileText,
    ChevronRight,
    Download,
    Calendar,
    Clock,
    Share2,
    Zap,
    TrendingUp,
    TrendingDown,
    ShieldCheck,
    UploadCloud,
    Heart,
    Plus
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import {
    StatCard,
    MetricCard,
    ScoreRing,
    StatusBadge,
    SectionHeader,
    ActionButton,
    RecommendationCard
} from '../../../components/SharedComponents';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
} from 'recharts';
import { Link , useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

const Dashboard = () => {
    
    const navigate = useNavigate();
const { user, latestAnalysis, patientHistory } = useApp();
    const [greeting, setGreeting] = useState('');
    const [todayWaterIntake, setTodayWaterIntake] = useState(() => {
        return parseFloat(localStorage.getItem('todayWaterIntake')) || 0;
    });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const addWater = (amount) => {
        const newTotal = todayWaterIntake + amount;
        setTodayWaterIntake(Math.round(newTotal * 10) / 10); // Round safely
        localStorage.setItem('todayWaterIntake', Math.round(newTotal * 10) / 10);
    };

    const analysis = latestAnalysis || patientHistory?.[0] || null;
    
    // Normalize metrics if backend returns a dictionary for iOS compatibility
    const metrics = Array.isArray(analysis?.medical_metrics)
        ? analysis.medical_metrics
        : analysis?.medical_metrics && typeof analysis.medical_metrics === 'object'
            ? Object.entries(analysis.medical_metrics).map(([key, val]) => ({
                metric: key,
                value: val.value,
                unit: val.unit,
                status: val.status || 'Optimal',
                range: val.range
              }))
            : [];
            
    const recs = analysis?.recommendations || {};

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 pb-20"
        >
            {/* Header with Quick Info */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                <div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Activity className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 font-accent ">Patient Intel Terminal v4.0</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-stone-800 mb-2">
                        {greeting}, <span className="text-primary  text-glow">{user?.name?.split(' ')[0] || 'Commander'}</span>
                    </h1>
                    <p className="text-stone-600 font-medium ">Your neural recovery metrics are calibrated and up to date.</p>
                </div>
                
                <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">System Status</p>
                        <div className="flex items-center space-x-2 text-excellent font-bold text-xs">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-excellent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-excellent"></span>
                            </span>
                            <span>All Systems Nominal</span>
                        </div>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 border border-stone-200 px-6 py-4 rounded-3xl backdrop-blur-md flex items-center space-x-4">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-stone-400">Observation Date</p>
                            <span className="text-xs font-bold text-stone-800/80">
                                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {!analysis ? (
                <div className="space-y-6 max-w-lg mx-auto md:max-w-none">
                    {/* Recovery Score Card */}
                    <div className="bg-stone-50 border border-stone-200 rounded-[2rem] p-8 flex justify-between items-center text-stone-800 shadow-sm">
                        <div>
                            <p className="text-stone-500 font-bold mb-2">Recovery Score</p>
                            <h2 className="text-5xl font-black mb-2">0<span className="text-3xl text-stone-400">/100</span></h2>
                            <p className="text-excellent font-bold text-sm flex items-center"><TrendingUp className="w-4 h-4 mr-1"/> +0% this week</p>
                            <Link to="/app/history" className="text-primary text-sm font-bold mt-4 flex items-center hover:opacity-80 transition-opacity">
                                View Details <ArrowRight className="w-4 h-4 ml-1"/>
                            </Link>
                        </div>
                        <div className="flex justify-center">
                            <ScoreRing score={0} size={120} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Risk Level */}
                        <Link to="/app/overview" className="block bg-stone-50 border border-stone-200 rounded-[2rem] p-6 text-stone-800 shadow-sm group hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-stone-500 font-bold text-sm mb-1 group-hover:text-stone-700 transition-colors">Risk Level</p>
                                <h3 className="text-2xl font-black mb-1">Stable</h3>
                                <p className="text-stone-400 text-xs">Safe</p>
                            </div>
                        </Link>

                        {/* Water Intake */}
                        <Link to="/app/water" className="block bg-stone-50 border border-stone-200 rounded-[2rem] p-6 text-stone-800 shadow-sm group hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Droplet className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-stone-500 font-bold text-sm mb-1 group-hover:text-stone-700 transition-colors">Water Intake</p>
                                <h3 className="text-2xl font-black mb-1">0.0L</h3>
                                <p className="text-stone-400 text-xs flex justify-between">Goal: 2.5L</p>
                            </div>
                        </Link>
                    </div>

                    {/* Action Uploads Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {/* Initial Upload */}
                        <Link to="/app/upload" className="block w-full bg-stone-50 border border-stone-200 rounded-[2rem] p-6 text-stone-800 shadow-sm group hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors border border-primary/20">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight">Initial Upload</h4>
                                        <p className="text-stone-500 text-sm">Start first diagnostic</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary transition-colors" />
                            </div>
                        </Link>

                        {/* Upload Follow Up */}
                        <Link to="/app/upload" className="block w-full bg-stone-50 border border-stone-200 rounded-[2rem] p-6 text-stone-800 shadow-sm group hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-sm border border-primary/20">
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight">Upload Follow-Up</h4>
                                        <p className="text-stone-500 text-sm">Track progress updates</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-primary transition-colors" />
                            </div>
                        </Link>
                    </div>

                    {/* Latest Insight Card */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold font-display mb-4 text-stone-800">Latest Insight</h3>
                        <div className="relative rounded-[2rem] overflow-hidden min-h-[200px] bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center border border-primary/20 p-8 shadow-sm">
                            <div className="absolute top-0 right-0 -m-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                            
                            <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <span className="px-3 py-1 bg-stone-50 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-full mb-4 inline-block shadow-sm">AI GENERATED</span>
                                    <h4 className="text-3xl font-display font-black text-stone-800 mb-2">Smart Insights</h4>
                                    <p className="text-stone-600 font-medium">Upload your first diagnostic report to activate personalized AI recommendations.</p>
                                </div>
                                <Activity className="w-16 h-16 text-primary opacity-20 hidden md:block" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Primary Intelligence Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Status Card - Large */}
                        <div className="lg:col-span-2 glass-panel relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8">
                                <StatusBadge status={analysis.severity_level || 'Normal'} />
                            </div>
                            
                            <div className="mb-12">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-4 ">Latest Analysis Summary</h3>
                                <div className="flex items-baseline space-x-3 mb-2">
                                    <h4 className="text-3xl font-display font-black text-stone-800">{analysis.report_type || 'Clinical Report'}</h4>
                                    <span className="text-primary text-xs font-black uppercase tracking-widest opacity-70">#{String(analysis.id || 'N/A').slice(0, 8)}</span>
                                </div>
                                <p className="text-stone-600 text-sm font-medium ">{analysis.hospital_name || 'Affiliated Medical Center'} • {analysis.report_date || 'Mar 2026'}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
                                <div className="md:col-span-2 flex justify-center">
                                    <ScoreRing score={parseInt(analysis.recovery_score) || 75} size={220} />
                                </div>
                                <div className="md:col-span-3 space-y-8">
                                    <div className="bg-stone-50 border border-stone-200 p-6 rounded-[2rem]">
                                        <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary mb-4 ">Clinical Insight</h5>
                                        <p className="text-lg text-stone-800/70 font-display font-medium leading-relaxed ">
                                            "{analysis.primary_diagnosis || "Patient metrics are within acceptable ranges. We recommend maintaining current hydration and sleep protocols for optimal recovery."}"
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="px-5 py-2 rounded-2xl bg-excellent/10 border border-excellent/20 flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-excellent shadow-[0_0_8px_rgba(52,199,89,0.8)]"></div>
                                            <span className="text-[10px] font-black text-stone-700 uppercase tracking-widest">Metabolic: Stable</span>
                                        </div>
                                        <div className="px-5 py-2 rounded-2xl bg-info/10 border border-info/20 flex items-center space-x-2">
                                            <div className="w-2 h-2 rounded-full bg-info shadow-[0_0_8px_rgba(0,122,255,0.8)]"></div>
                                            <span className="text-[10px] font-black text-stone-700 uppercase tracking-widest">Renal: Normal</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Sidebar */}
                        <div className="space-y-6">
                            <StatCard 
                                title="Recovery Index"
                                value={analysis.recovery_score + "%" || "N/A"}
                                icon={Activity}
                                trend="up"
                                trendValue="8.4"
                                color="primary"
                            />
                            <StatCard 
                                title="Vital Stability"
                                value={analysis.severity_level || "Balanced"}
                                icon={ShieldCheck}
                                color={analysis.severity_level === 'Critical' ? 'critical' : 'excellent'}
                            />
                            <div className="glass-card p-8 bg-gradient-to-br from-secondary/10 to-transparent border-secondary/20 h-full">
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="p-2 bg-secondary/20 rounded-xl">
                                        <Zap className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h4 className="font-display font-black text-lg">Next Step</h4>
                                </div>
                                <p className="text-sm font-medium text-stone-600  mb-10 leading-relaxed">
                                    Your follow-up analysis is scheduled for 10 days from today. Maintain current dietary protocols.
                                </p>
                                <Link to="/app/care" className="btn-outline w-full py-3 text-xs">
                                    View Protocol
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Follow-up Intelligence Banner */}
                    {analysis?.follow_up_analysis?.is_follow_up && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 rounded-[2.5rem] bg-gradient-to-r from-primary/10 via-primary/[0.03] to-transparent border border-primary/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6"
                        >
                            <div className="flex items-center space-x-6">
                                <div className={`p-4 rounded-3xl ${parseFloat(analysis.follow_up_analysis.improvement_percentage) >= 0 ? 'bg-excellent/10 border border-excellent/20' : 'bg-critical/10 border border-critical/20'}`}>
                                    {parseFloat(analysis.follow_up_analysis.improvement_percentage) >= 0 ? (
                                        <TrendingUp className={`w-8 h-8 text-excellent`} />
                                    ) : (
                                        <TrendingDown className={`w-8 h-8 text-critical`} />
                                    )}
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-1 ">Comparative Diagnostics</h5>
                                    <h4 className="text-2xl font-display font-black text-stone-800 mb-1">
                                        Health Trend: <span className="text-secondary ">{analysis.follow_up_analysis.health_trend || "Stable"}</span>
                                    </h4>
                                    <p className="text-stone-600 text-sm font-medium ">
                                        Overall metric variance: 
                                        <span className={`font-black ml-1 ${parseFloat(analysis.follow_up_analysis.improvement_percentage) >= 0 ? 'text-excellent' : 'text-critical'}`}>
                                            {parseFloat(analysis.follow_up_analysis.improvement_percentage) >= 0 ? '+' : ''}{analysis.follow_up_analysis.improvement_percentage}%
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                {analysis.follow_up_analysis.comparisons && Object.entries(analysis.follow_up_analysis.comparisons).slice(0, 2).map(([key, val]) => (
                                    <div key={key} className="bg-stone-50 border border-stone-200 px-6 py-4 rounded-2xl flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2">{key.replace('_', ' ')}</span>
                                        <span className="text-lg font-display font-black text-stone-800 flex items-baseline gap-2">
                                            {val.current}
                                            <span className={`text-[11px] font-black ${val.change_percent >= 0 ? 'text-excellent' : 'text-critical'}`}>
                                                ({val.change_percent >= 0 ? '↑' : '↓'} {Math.abs(val.change_percent)}%)
                                            </span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Chart & Intelligence Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Recovery Trend */}
                        <div className="glass-panel group">
                            <div className="flex justify-between items-center mb-12">
                                <h3 className="text-xl font-display font-black ">Neural Recovery Flow</h3>
                                <div className="flex space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-primary/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[
                                        { name: 'Obs-1', score: 58 },
                                        { name: 'Obs-2', score: 62 },
                                        { name: 'Obs-3', score: 68 },
                                        { name: 'Latest', score: parseInt(analysis?.recovery_score) || 75 },
                                    ]}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                                        <XAxis dataKey="name" stroke="#00000020" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#00000060' }} />
                                        <YAxis stroke="#00000020" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#00000060' }} />
                                        <Tooltip
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                                border: '1px solid rgba(212,175,55,0.2)', 
                                                borderRadius: '16px',
                                                backdropFilter: 'blur(20px)',
                                                padding: '12px'
                                            }}
                                            itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#D4AF37"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorScore)"
                                            animationDuration={3000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Organ Index Radar */}
                        <div className="glass-panel group">
                            <h3 className="text-xl font-display font-black  mb-12 text-right">Biometric Organ Index</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                        { subject: 'Kidney', A: 85 },
                                        { subject: 'Liver', A: 92 },
                                        { subject: 'Cardio', A: 78 },
                                        { subject: 'Neuro', A: 95 },
                                        { subject: 'Metabol', A: 88 },
                                    ]}>
                                        <PolarGrid stroke="#00000008" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#00000060', fontSize: 10, fontWeight: 'bold' }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Intelligence"
                                            dataKey="A"
                                            stroke="#D4AF37"
                                            fill="#D4AF37"
                                            fillOpacity={0.15}
                                            animationDuration={2500}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Lower Widgets Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Hydration Widget (Interactive Quick Add) */}
                        <div className="lg:col-span-1 glass-card p-8 bg-gradient-to-br from-info/10 to-transparent border-info/20 group">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="p-3 bg-info/30 rounded-2xl group-hover:scale-110 transition-transform">
                                    <Droplet className="w-5 h-5 text-info" />
                                </div>
                                <h4 className="font-display font-black ">Hydration Protocol</h4>
                            </div>
                            <div className="flex items-baseline space-x-3 mb-3">
                                <span className="text-5xl font-display font-black text-stone-800">{todayWaterIntake.toFixed(1)}</span>
                                <span className="text-xs font-black text-stone-400 uppercase tracking-widest">
                                    of {parseFloat(String(recs.water_intake || '2.5').replace(/[^\d.]/g, '')) || 2.5}L
                                </span>
                            </div>
                            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden mb-6">
                                <div className="h-full bg-info w-[75%] rounded-full shadow-[0_0_15px_rgba(0,122,255,0.6)]" style={{ width: `${Math.min((todayWaterIntake / 2.5) * 100, 100)}%` }}></div>
                            </div>
                            <p className="text-[10px] text-stone-600  font-medium mb-4">Auto-calibrated based on renal markers</p>
                            
                            {/* Quick Add Buttons */}
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => addWater(0.25)} className="text-[10px] bg-sky-50 hover:bg-sky-100 text-sky-600 font-black p-2 rounded-xl transition-all">+250ml</button>
                                <button onClick={() => addWater(0.5)} className="text-[10px] bg-sky-50 hover:bg-sky-100 text-sky-600 font-black p-2 rounded-xl transition-all">+500ml</button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="lg:col-span-2 glass-panel group">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="font-display font-black  uppercase tracking-widest text-stone-500 text-xs">Extraction History</h4>
                                <Link to="/app/history" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Full Logs</Link>
                            </div>
                            <div className="space-y-4">
                                {(patientHistory || []).slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-center p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:bg-stone-50 border border-stone-200 transition-all cursor-pointer">
                                        <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 mr-5">
                                            <FileText className="w-5 h-5 text-stone-600" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-display font-bold text-stone-800 text-sm">{item.report_type || 'Diagnostic Report'}</p>
                                            <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.1em] ">{item.report_date || 'Mar 2026'}</p>
                                        </div>
                                        <div className="text-right flex items-center space-x-4">
                                            <div className="hidden sm:block">
                                                <p className="text-[10px] font-black text-primary mb-1 uppercase tracking-tighter">Score</p>
                                                <p className="text-sm font-black text-stone-800">{item.recovery_score || '0'}%</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-stone-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Action Widget */}
                        <div className="lg:col-span-1 glass-card p-10 flex flex-col justify-between group hover:border-primary/50 cursor-pointer text-center relative overflow-hidden" onClick={() => navigate('/app/upload')}>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div>
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
                                    <ArrowRight className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="text-xl font-display font-black text-stone-800 mb-2 ">Analyze Report</h4>
                                <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mb-8">Initiate Neural Scan</p>
                            </div>
                            <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-0 group-hover:w-full transition-all duration-700"></div>
                            </div>
                        </div>
                    </div>

                    {/* Diet & Nutrition Framework */}
                    <div>
                        <SectionHeader 
                            title="Dietary Protocol & Recovery Plan"
                            subtitle="AI-tailored nutritional updates linked directly with clinical data types."
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Foods to Eat */}
                            <div className="glass-panel group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200">Recommended</span>
                                </div>
                                <h4 className="text-xl font-display font-black text-stone-800 mb-6  flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-excellent shadow-[0_0_8px_rgba(52,199,89,0.8)]"></div>
                                    Foods to Eat
                                </h4>
                                <ul className="space-y-3">
                                    {recs.foods_to_eat && recs.foods_to_eat.length > 0 ? (
                                        recs.foods_to_eat.map((item, id) => (
                                            <li key={id} className="flex items-start gap-3 text-sm text-stone-700 bg-stone-50 border border-stone-100 p-3 rounded-xl">
                                                <ShieldCheck className="w-4 h-4 text-excellent mt-0.5 flex-shrink-0" />
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-stone-400 text-sm ">Standard balanced recovery diet.</li>
                                    )}
                                </ul>
                            </div>

                            {/* Foods to Avoid */}
                            <div className="glass-panel group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-critical bg-critical/10 px-3 py-1.5 rounded-full border border-critical/20">Strict</span>
                                </div>
                                <h4 className="text-xl font-display font-black text-stone-800 mb-6  flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-critical shadow-[0_0_8px_rgba(255,59,48,0.8)]"></div>
                                    Foods to Avoid
                                </h4>
                                <ul className="space-y-3">
                                    {recs.foods_to_avoid && recs.foods_to_avoid.length > 0 ? (
                                        recs.foods_to_avoid.map((item, id) => (
                                            <li key={id} className="flex items-start gap-3 text-sm text-stone-700 bg-stone-50 border border-stone-100 p-3 rounded-xl border-l-critical border-l-2">
                                                <AlertCircle className="w-4 h-4 text-critical mt-0.5 flex-shrink-0" />
                                                <span className="font-medium">{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-stone-400 text-sm ">No strict restrictions provided.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Metrics Explorer */}
                    <div>
                        <SectionHeader 
                            title="Neural Metric Explorer"
                            subtitle="Live calibration data from latest clinical extraction."
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {metrics.slice(0, 5).map((m, idx) => (
                                <MetricCard
                                    key={idx}
                                    label={m.metric || "Metric"}
                                    value={m.value || "0"}
                                    unit={m.unit || ""}
                                    status={m.status || "Optimal"}
                                    range={m.range}
                                />
                            ))}
                            <Link to="/app/medical-data" className="glass-card flex flex-col items-center justify-center p-6 border-dashed border-white/20 hover:border-primary/50 group transition-all">
                                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary transition-colors mb-4">
                                    <ChevronRight className="w-6 h-6 text-primary group-hover:text-background" />
                                </div>
                                <span className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]  group-hover:text-stone-800">View All Metrics</span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default Dashboard;


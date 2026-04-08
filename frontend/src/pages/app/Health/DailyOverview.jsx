import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Activity, Droplets, Heart, TrendingUp, TrendingDown,
    AlertCircle, CheckCircle, Info, RefreshCw, ChevronRight
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { reportService } from '../../../services/api';

const DailyOverview = () => {
    const navigate = useNavigate();
    const { user, latestAnalysis, setLatestAnalysis, loading, setLoading } = useApp();

    useEffect(() => {
        if (!latestAnalysis && user?.id) {
            fetchLatest();
        }
    }, [user]);

    const fetchLatest = async () => {
        setLoading(true);
        try {
            const data = await reportService.getLatestAnalysis(user.id);
            setLatestAnalysis(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const score = latestAnalysis?.recovery_score ?? null;
    const risk = latestAnalysis?.risk_analysis ?? {};
    const metrics = latestAnalysis?.medical_metrics ?? {};
    const followUp = latestAnalysis?.follow_up_analysis ?? {};
    const waterIntake = parseFloat(localStorage.getItem('todayWaterIntake') || '0');

    const getSeverityColor = (level) => {
        const map = {
            Excellent: 'text-emerald-400',
            Good: 'text-green-400',
            Stable: 'text-amber-400',
            Moderate: 'text-amber-400',
            'At Risk': 'text-orange-400',
            Critical: 'text-red-400',
            Poor: 'text-red-400',
        };
        return map[level] || 'text-stone-700';
    };

    const getSeverityBg = (level) => {
        const map = {
            Excellent: 'bg-emerald-500/10 border-emerald-500/20',
            Good: 'bg-green-500/10 border-green-500/20',
            Stable: 'bg-amber-500/10 border-amber-500/20',
            Moderate: 'bg-amber-500/10 border-amber-500/20',
            'At Risk': 'bg-orange-500/10 border-orange-500/20',
            Critical: 'bg-red-500/10 border-red-500/20',
            Poor: 'bg-red-500/10 border-red-500/20',
        };
        return map[level] || 'bg-stone-100 border-stone-200';
    };

    const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';
    const improvement = followUp?.improvement_percentage ?? 0;
    const metricEntries = Object.entries(metrics).slice(0, 8);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">Daily Overview</h1>
                        <p className="text-stone-600 text-sm">Your health at a glance</p>
                    </div>
                </div>
                <button onClick={fetchLatest} disabled={loading} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors">
                    <RefreshCw className={`w-5 h-5 text-stone-700 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {!latestAnalysis ? (
                <div className="text-center py-20 text-stone-600">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No analysis data yet. Upload a medical report to get started.</p>
                    <button onClick={() => navigate('/app/upload')} className="mt-4 px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-600 transition-all">
                        Upload Report
                    </button>
                </div>
            ) : (
                <>
                    {/* Recovery Score Hero */}
                    <div className="bg-gradient-to-br from-white/5 to-white/0 border border-stone-200 rounded-3xl p-8 flex items-center gap-8">
                        <div className="relative w-36 h-36 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke={scoreColor} strokeWidth="2.5"
                                    strokeDasharray={`${score}, 100`} strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-stone-800">{score}</span>
                                <span className="text-stone-600 text-xs">/ 100</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-stone-700 mb-1">Recovery Score</h2>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold mb-3 ${getSeverityBg(risk.severity_level)}`}>
                                <span className={getSeverityColor(risk.severity_level)}>{risk.severity_level || 'Stable'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {improvement >= 0 ? (
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-400" />
                                )}
                                <span className={`text-sm font-bold ${improvement >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}% vs last report
                                </span>
                            </div>
                            <p className="text-stone-600 text-sm mt-2 line-clamp-2">{risk.summary}</p>
                        </div>
                    </div>

                    {/* Risk Card */}
                    {risk.primary_risk && (
                        <div className={`border rounded-2xl p-5 flex items-start gap-4 ${getSeverityBg(risk.severity_level)}`}>
                            <AlertCircle className={`w-6 h-6 mt-0.5 ${getSeverityColor(risk.severity_level)}`} />
                            <div>
                                <p className="text-stone-800 font-semibold">Primary Risk: {risk.primary_risk}</p>
                                {risk.secondary_risks?.length > 0 && (
                                    <p className="text-stone-600 text-sm mt-1">Also noted: {risk.secondary_risks.slice(0, 3).join(', ')}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-stone-100 border border-stone-200 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:bg-stone-100 transition-all"
                            onClick={() => navigate('/app/water')}>
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <Droplets className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-stone-600 text-xs">Water Today</p>
                                <p className="text-stone-800 font-bold text-xl">{waterIntake.toFixed(1)}L</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-400 ml-auto" />
                        </div>
                        <div className="bg-stone-100 border border-stone-200 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:bg-stone-100 transition-all"
                            onClick={() => navigate('/app/dashboard')}>
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center">
                                <Heart className="w-6 h-6 text-rose-400" />
                            </div>
                            <div>
                                <p className="text-stone-600 text-xs">Heart Rate</p>
                                <p className="text-stone-800 font-bold text-xl">{metrics?.heart_rate?.value || '--'}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-400 ml-auto" />
                        </div>
                    </div>

                    {/* Medical Metrics Overview */}
                    {metricEntries.length > 0 && (
                        <div className="bg-stone-100 border border-stone-200 rounded-3xl p-6">
                            <h2 className="text-stone-800 font-semibold mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-amber-400" /> Medical Metrics
                            </h2>
                            <div className="space-y-3">
                                {metricEntries.map(([key, val]) => {
                                    const value = typeof val === 'object' ? val?.value : val;
                                    const unit = typeof val === 'object' ? val?.unit : '';
                                    return (
                                        <div key={key} className="flex items-center justify-between py-2 border-b border-stone-200">
                                            <span className="text-stone-700 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-stone-800 font-semibold">
                                                {value} <span className="text-stone-500 text-xs">{unit}</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            {Object.keys(metrics).length > 8 && (
                                <button onClick={() => navigate('/app/medical-data')}
                                    className="w-full mt-4 py-2 text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors flex items-center justify-center gap-1">
                                    View all metrics <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DailyOverview;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Plus, Minus, ArrowLeft, Target, Bell, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const WaterTracking = () => {
    const navigate = useNavigate();
    const { latestAnalysis } = useApp();
    const [consumed, setConsumed] = useState(0);
    const [goal, setGoal] = useState(2.5);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Load from localStorage
        const saved = parseFloat(localStorage.getItem('todayWaterIntake') || '0');
        setConsumed(saved);
        const savedLogs = JSON.parse(localStorage.getItem('waterLogs') || '[]');
        setLogs(savedLogs);

        // Get recommended intake from analysis
        if (latestAnalysis?.recommendations?.water_intake) {
            const raw = latestAnalysis.recommendations.water_intake;
            const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
            if (!isNaN(num)) setGoal(num);
        }
    }, [latestAnalysis]);

    const addWater = (amount) => {
        const newTotal = Math.min(consumed + amount, 10);
        const now = new Date();
        const newLog = {
            amount,
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: now.toISOString()
        };
        const newLogs = [newLog, ...logs].slice(0, 20);
        setConsumed(newTotal);
        setLogs(newLogs);
        localStorage.setItem('todayWaterIntake', newTotal.toString());
        localStorage.setItem('waterLogs', JSON.stringify(newLogs));
    };

    const removeWater = () => {
        const newTotal = Math.max(consumed - 0.25, 0);
        setConsumed(newTotal);
        localStorage.setItem('todayWaterIntake', newTotal.toString());
    };

    const percentage = Math.min((consumed / goal) * 100, 100);

    const getStatusColor = () => {
        if (percentage >= 100) return '#00d4ff';
        if (percentage >= 60) return '#10b981';
        if (percentage >= 30) return '#f59e0b';
        return '#ef4444';
    };

    const getStatusText = () => {
        if (percentage >= 100) return 'Daily goal achieved! 🎉';
        if (percentage >= 60) return 'Great progress!';
        if (percentage >= 30) return 'Keep drinking!';
        return 'Stay hydrated!';
    };

    const quickAmounts = [0.15, 0.25, 0.33, 0.5];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">Water Intake</h1>
                    <p className="text-stone-600 text-sm">Stay hydrated for optimal recovery</p>
                </div>
            </div>

            {/* Main Visual */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/20 rounded-3xl p-8 text-center">
                <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="2.5"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke={getStatusColor()} strokeWidth="2.5"
                            strokeDasharray={`${percentage}, 100`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 0.5s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Droplets className="w-8 h-8 mb-1" style={{ color: getStatusColor() }} />
                        <p className="text-4xl font-bold text-stone-800">{consumed.toFixed(1)}</p>
                        <p className="text-stone-600 text-sm">of {goal.toFixed(1)}L</p>
                    </div>
                </div>
                <p className="text-lg font-semibold" style={{ color: getStatusColor() }}>{getStatusText()}</p>
                <p className="text-stone-600 text-sm mt-1">{Math.max(0, goal - consumed).toFixed(1)}L remaining today</p>
            </div>

            {/* Quick Add Buttons */}
            <div className="bg-stone-100 border border-stone-200 rounded-3xl p-6">
                <h2 className="text-stone-800 font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" /> Quick Add
                </h2>
                <div className="grid grid-cols-4 gap-3 mb-4">
                    {quickAmounts.map((amount) => (
                        <button
                            key={amount}
                            onClick={() => addWater(amount)}
                            className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-amber-500/10 border border-yellow-500/20 hover:bg-amber-500/20 transition-all active:scale-95"
                        >
                            <Droplets className="w-5 h-5 text-amber-400" />
                            <span className="text-stone-800 font-bold text-sm">{(amount * 1000).toFixed(0)}ml</span>
                        </button>
                    ))}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => addWater(0.5)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 rounded-2xl text-black font-bold transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Add 500ml
                    </button>
                    <button
                        onClick={removeWater}
                        className="px-4 py-3 bg-stone-100 hover:bg-stone-200 rounded-2xl text-stone-800/70 transition-all active:scale-95"
                    >
                        <Minus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { icon: Target, label: 'Daily Goal', value: `${goal.toFixed(1)}L`, color: 'text-amber-400' },
                    { icon: TrendingUp, label: 'Progress', value: `${Math.round(percentage)}%`, color: 'text-emerald-400' },
                    { icon: Clock, label: 'Logs Today', value: logs.length.toString(), color: 'text-purple-400' },
                ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="bg-stone-100 border border-stone-200 rounded-2xl p-4 text-center">
                        <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
                        <p className="text-stone-800 font-bold text-lg">{value}</p>
                        <p className="text-stone-600 text-xs">{label}</p>
                    </div>
                ))}
            </div>

            {/* Intake Logs */}
            {logs.length > 0 && (
                <div className="bg-stone-100 border border-stone-200 rounded-3xl p-6">
                    <h2 className="text-stone-800 font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-stone-600" /> Today's Log
                    </h2>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {logs.map((log, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-stone-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <Droplets className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <span className="text-stone-800/70 text-sm">{(log.amount * 1000).toFixed(0)}ml added</span>
                                </div>
                                <span className="text-stone-600 text-xs">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WaterTracking;

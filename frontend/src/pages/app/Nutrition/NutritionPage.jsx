import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Utensils, Apple, X, Droplets, Dumbbell, ShieldCheck,
    ChevronRight, RefreshCw, Upload
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { reportService } from '../../../services/api';

const MealCard = ({ type, icon, color, items, time, calories }) => {
    const colorMap = {
        cyan: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
        violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', dot: 'bg-violet-400' },
        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
    };
    const c = colorMap[color] || colorMap.cyan;

    return (
        <div className={`border rounded-2xl p-5 ${c.bg} ${c.border}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                        <span className="text-xl">{icon}</span>
                    </div>
                    <div>
                        <p className={`font-semibold ${c.text}`}>{type}</p>
                        <p className="text-stone-600 text-xs">{time}</p>
                    </div>
                </div>
                {calories && <span className="text-stone-600 text-xs font-medium">{calories} kcal</span>}
            </div>
            {items?.length > 0 ? (
                <ul className="space-y-2">
                    {items.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                            <span className="text-stone-800/70 text-sm">{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-stone-500 text-sm ">No specific recommendations. Maintain a balanced diet.</p>
            )}
        </div>
    );
};

const NutritionPage = () => {
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
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const recs = latestAnalysis?.recommendations || {};
    const foodsToEat = recs.foods_to_eat || [];
    const foodsToAvoid = recs.foods_to_avoid || [];
    const waterIntake = recs.water_intake || '2.5L daily';
    const exercise = recs.exercise || recs.exercise_guidelines || 'Light activity as tolerated';
    const precautions = recs.recovery_precautions || [];
    const calorieGoal = recs.calorie_goal || '1800';
    const proteinGoal = recs.protein_goal || '85g';

    // Distribute foods across meals
    const breakfast = foodsToEat.slice(0, 3);
    const lunch = foodsToEat.slice(3, 6);
    const snacks = foodsToEat.slice(6, 8);
    const dinner = foodsToEat.slice(8, 11);

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">Diet & Nutrition</h1>
                        <p className="text-stone-600 text-sm">Personalized AI recovery meal plan</p>
                    </div>
                </div>
                <button onClick={fetchLatest} disabled={loading} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors">
                    <RefreshCw className={`w-5 h-5 text-stone-700 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {!latestAnalysis ? (
                <div className="text-center py-20">
                    <Utensils className="w-12 h-12 mx-auto mb-4 text-stone-400" />
                    <p className="text-stone-600 mb-4">Upload a medical report to get your personalized nutrition plan</p>
                    <button onClick={() => navigate('/app/upload')}
                        className="flex items-center gap-2 mx-auto px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-600 transition-all">
                        <Upload className="w-4 h-4" /> Upload Report
                    </button>
                </div>
            ) : (
                <>
                    {/* Nutrition Goals */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Daily Calories', value: calorieGoal, unit: 'kcal', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                            { label: 'Protein Goal', value: proteinGoal, unit: '', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
                            { label: 'Water Intake', value: waterIntake, unit: '', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                        ].map(({ label, value, unit, color, bg }) => (
                            <div key={label} className={`border rounded-2xl p-4 text-center ${bg}`}>
                                <p className={`text-xl font-bold ${color}`}>{value}</p>
                                {unit && <p className="text-stone-600 text-xs">{unit}</p>}
                                <p className="text-stone-700 text-xs mt-1">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Meal Plan */}
                    <div>
                        <h2 className="text-stone-800 font-semibold mb-4 flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-amber-400" /> AI Meal Plan
                        </h2>
                        <div className="space-y-4">
                            <MealCard type="Breakfast" icon="🌅" color="amber" items={breakfast.length ? breakfast : foodsToEat.slice(0, 3)} time="7:00 - 9:00 AM" calories="350-450" />
                            <MealCard type="Lunch" icon="☀️" color="emerald" items={lunch.length ? lunch : foodsToEat.slice(0, 3)} time="12:00 - 1:30 PM" calories="500-600" />
                            <MealCard type="Snacks" icon="🍎" color="cyan" items={snacks.length ? snacks : foodsToEat.slice(0, 2)} time="3:30 - 4:30 PM" calories="150-200" />
                            <MealCard type="Dinner" icon="🌙" color="violet" items={dinner.length ? dinner : foodsToEat.slice(0, 3)} time="7:00 - 8:30 PM" calories="400-500" />
                        </div>
                    </div>

                    {/* Foods to Avoid */}
                    {foodsToAvoid.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6">
                            <h2 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                                <X className="w-4 h-4" /> Foods to Avoid
                            </h2>
                            <div className="grid grid-cols-2 gap-2">
                                {foodsToAvoid.map((food, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-red-500/10 rounded-xl px-3 py-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                        <span className="text-stone-800/70 text-sm">{food}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Exercise Guidelines */}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
                        <h2 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                            <Dumbbell className="w-4 h-4" /> Exercise Guidelines
                        </h2>
                        <p className="text-stone-800/70 text-sm leading-relaxed">{exercise}</p>
                    </div>

                    {/* Recovery Precautions */}
                    {precautions.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6">
                            <h2 className="text-amber-400 font-semibold mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" /> Recovery Precautions
                            </h2>
                            <ul className="space-y-3">
                                {precautions.map((p, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-amber-400 text-xs font-bold">{i + 1}</span>
                                        </div>
                                        <span className="text-stone-800/70 text-sm">{p}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NutritionPage;

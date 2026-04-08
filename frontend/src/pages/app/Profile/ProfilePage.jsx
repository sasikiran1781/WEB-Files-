import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Mail, Phone, Shield, Edit2, Save, X,
    ChevronRight, Camera, LogOut, Upload
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { authService } from '../../../services/api';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, setUser, logout, latestAnalysis } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || user?.full_name || '');
    const [editPhone, setEditPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [passMsg, setPassMsg] = useState('');
    const [passError, setPassError] = useState(false);

    const initials = (user?.name || user?.full_name || 'RV').split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

    const handleSave = () => {
        const updated = { ...user, name: editName, full_name: editName, phone: editPhone };
        setUser(updated);
        localStorage.setItem('reva_user', JSON.stringify(updated));
        setIsEditing(false);
    };

    const handlePasswordChange = async () => {
        if (!oldPass || !newPass) return;
        setLoading(true);
        setPassMsg('');
        setPassError(false);
        try {
            await authService.changePassword({ email: user?.email, old_password: oldPass, new_password: newPass });
            setPassMsg('Password changed successfully!');
            setOldPass('');
            setNewPass('');
            setChangePassword(false);
        } catch (e) {
            setPassMsg(e || 'Failed to change password');
            setPassError(true);
        } finally {
            setLoading(false);
        }
    };

    const score = latestAnalysis?.recovery_score ?? null;
    const riskLevel = latestAnalysis?.risk_analysis?.severity_level ?? null;

    const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">Profile</h1>
                    <p className="text-stone-600 text-sm">Your REVA account</p>
                </div>
            </div>

            {/* Avatar & Name */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/20 rounded-3xl p-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-3xl font-bold text-black shadow-lg">
                        {initials}
                    </div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-stone-50 border-2 border-amber-500/30 flex items-center justify-center cursor-pointer hover:bg-stone-100 transition-colors">
                        <Camera className="w-3.5 h-3.5 text-stone-600" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-stone-800">{user?.name || user?.full_name || 'REVA User'}</h2>
                <p className="text-stone-600 text-sm mt-1">{user?.email}</p>

                {/* Health Summary Badges */}
                {score !== null && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: scoreColor }} />
                            <span className="text-stone-800 text-xs font-medium">Score: {score}/100</span>
                        </div>
                        {riskLevel && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200">
                                <Shield className="w-3 h-3 text-amber-400" />
                                <span className="text-stone-800 text-xs font-medium">{riskLevel}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Personal Info */}
            <div className="bg-stone-100 border border-stone-200 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-stone-800 font-semibold">Personal Information</h2>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1.5 text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={handleSave}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-black text-sm font-bold rounded-xl hover:bg-amber-600 transition-all">
                                <Save className="w-3.5 h-3.5" /> Save
                            </button>
                            <button onClick={() => setIsEditing(false)}
                                className="p-1.5 bg-stone-100 rounded-xl text-stone-600 hover:bg-stone-200 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Name Field */}
                <div className="space-y-1">
                    <label className="text-stone-600 text-xs flex items-center gap-1.5"><User className="w-3 h-3" /> Full Name</label>
                    {isEditing ? (
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                            className="w-full bg-stone-100 border border-white/20 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:border-amber-500/50 outline-none transition-colors" />
                    ) : (
                        <p className="text-stone-800 font-medium">{user?.name || user?.full_name || '—'}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-stone-600 text-xs flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</label>
                    <p className="text-stone-800 font-medium">{user?.email || '—'}</p>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                    <label className="text-stone-600 text-xs flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</label>
                    {isEditing ? (
                        <input value={editPhone} onChange={e => setEditPhone(e.target.value)}
                            className="w-full bg-stone-100 border border-white/20 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:border-amber-500/50 outline-none transition-colors" />
                    ) : (
                        <p className="text-stone-800 font-medium">{user?.phone || '—'}</p>
                    )}
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-stone-100 border border-stone-200 rounded-3xl p-6">
                <button onClick={() => setChangePassword(!changePassword)}
                    className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-violet-400" />
                        <span className="text-stone-800 font-semibold">Change Password</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-stone-500 transition-transform ${changePassword ? 'rotate-90' : ''}`} />
                </button>
                {changePassword && (
                    <div className="mt-4 space-y-3">
                        <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)}
                            placeholder="Current password"
                            className="w-full bg-stone-100 border border-white/20 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:border-violet-500/50 outline-none" />
                        <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                            placeholder="New password"
                            className="w-full bg-stone-100 border border-white/20 rounded-xl px-4 py-2.5 text-stone-800 text-sm focus:border-violet-500/50 outline-none" />
                        {passMsg && <p className={`text-sm ${passError ? 'text-red-400' : 'text-emerald-400'}`}>{passMsg}</p>}
                        <button onClick={handlePasswordChange} disabled={loading}
                            className="w-full py-3 bg-violet-500 hover:bg-violet-600 text-stone-800 font-bold rounded-xl transition-all disabled:opacity-50">
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="bg-stone-100 border border-stone-200 rounded-3xl p-6 space-y-2">
                <h2 className="text-stone-800 font-semibold mb-3">Quick Actions</h2>
                {[
                    { label: 'Upload Medical Report', icon: Upload, path: '/app/upload', color: 'text-amber-400' },
                    { label: 'View Report History', icon: ChevronRight, path: '/app/history', color: 'text-stone-600' },
                    { label: 'Account Settings', icon: ChevronRight, path: '/app/settings', color: 'text-stone-600' },
                ].map(({ label, icon: Icon, path, color }) => (
                    <button key={label} onClick={() => navigate(path)}
                        className="w-full flex items-center justify-between py-3 px-1 border-b border-stone-200 last:border-0 hover:text-stone-800/90 transition-colors">
                        <span className="text-stone-800/70 text-sm">{label}</span>
                        <Icon className={`w-4 h-4 ${color}`} />
                    </button>
                ))}
            </div>

            {/* Logout */}
            <button onClick={logout}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" /> Sign Out
            </button>
        </div>
    );
};

export default ProfilePage;

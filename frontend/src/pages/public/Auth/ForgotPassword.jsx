import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Lock, ShieldCheck, KeyRound } from 'lucide-react';
import { authService } from '../../../services/api';

const STEPS = { EMAIL: 'email', OTP: 'otp', PASSWORD: 'password', SUCCESS: 'success' };

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(STEPS.EMAIL);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
            setError('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authService.sendOtp(trimmedEmail);
            setEmail(trimmedEmail);
            setStep(STEPS.OTP);
        } catch (err) {
            setError(err || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            setError('Please enter a valid 6-digit OTP.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authService.verifyOtp(email, otp);
            setStep(STEPS.PASSWORD);
        } catch (err) {
            setError(err || 'Invalid or expired OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await authService.resetPassword(email, newPassword);
            setStep(STEPS.SUCCESS);
        } catch (err) {
            setError(err || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        <KeyRound className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-stone-800">Reset Password</h1>
                    <p className="text-stone-600 mt-2 text-sm">
                        {step === STEPS.EMAIL && 'Enter your email to receive a verification code'}
                        {step === STEPS.OTP && `Enter the OTP sent to ${email}`}
                        {step === STEPS.PASSWORD && 'Create a new strong password'}
                        {step === STEPS.SUCCESS && 'Your password has been reset!'}
                    </p>
                </div>

                {/* Progress Dots */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[STEPS.EMAIL, STEPS.OTP, STEPS.PASSWORD].map((s, i) => {
                        const stepIndex = [STEPS.EMAIL, STEPS.OTP, STEPS.PASSWORD, STEPS.SUCCESS].indexOf(step);
                        const thisIndex = i;
                        return (
                            <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${stepIndex >= thisIndex ? 'w-12 bg-primary' : 'w-6 bg-stone-100'}`} />
                        );
                    })}
                </div>

                <div className="bg-stone-100 border border-stone-200 rounded-3xl p-8">
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Email */}
                    {step === STEPS.EMAIL && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-stone-600 text-xs font-medium uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                        className="w-full bg-stone-100 border border-stone-200 rounded-2xl pl-11 pr-4 py-4 text-stone-800 placeholder-white/20 focus:border-primary/50 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full py-4 bg-primary text-background font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                {loading ? 'Sending OTP...' : 'Send Verification Code'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP */}
                    {step === STEPS.OTP && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-stone-600 text-xs font-medium uppercase tracking-wider">6-Digit OTP</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                        className="w-full bg-stone-100 border border-stone-200 rounded-2xl pl-11 pr-4 py-4 text-stone-800 text-center tracking-[0.5em] text-xl placeholder-white/20 focus:border-primary/50 outline-none transition-colors"
                                    />
                                </div>
                                <p className="text-stone-500 text-xs text-center">Check your email inbox for the 6-digit code</p>
                            </div>
                            <button type="submit" disabled={loading || otp.length < 6}
                                className="w-full py-4 bg-primary text-background font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50">
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button type="button" onClick={() => handleSendOtp({ preventDefault: () => {} })}
                                className="w-full py-2 text-stone-600 hover:text-stone-700 text-sm transition-colors">
                                Resend OTP
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === STEPS.PASSWORD && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-stone-600 text-xs font-medium uppercase tracking-wider">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        required
                                        className="w-full bg-stone-100 border border-stone-200 rounded-2xl pl-11 pr-4 py-4 text-stone-800 placeholder-white/20 focus:border-primary/50 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-stone-600 text-xs font-medium uppercase tracking-wider">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat new password"
                                        required
                                        className="w-full bg-stone-100 border border-stone-200 rounded-2xl pl-11 pr-4 py-4 text-stone-800 placeholder-white/20 focus:border-primary/50 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading}
                                className="w-full py-4 bg-primary text-background font-bold rounded-2xl hover:bg-primary/90 transition-all disabled:opacity-50">
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === STEPS.SUCCESS && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                                <ShieldCheck className="w-10 h-10 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-800 mb-2">Password Reset!</h3>
                                <p className="text-stone-600 text-sm">Your password has been updated. You can now log in with your new password.</p>
                            </div>
                            <button onClick={() => navigate('/login')}
                                className="w-full py-4 bg-primary text-background font-bold rounded-2xl hover:bg-primary/90 transition-all">
                                Go to Login
                            </button>
                        </div>
                    )}
                </div>

                {step !== STEPS.SUCCESS && (
                    <div className="text-center mt-6">
                        <Link to="/login" className="flex items-center justify-center gap-2 text-stone-600 hover:text-stone-800/70 text-sm transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;

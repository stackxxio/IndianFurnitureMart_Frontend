import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, Loader2, ArrowLeft, ShieldCheck, Timer, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
            setStep(2);
            setTimer(300); // 5 minutes
            toast.success('OTP sent to your email');
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to send OTP';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length < 6) {
            setError('Please enter the 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/verify-otp', { 
                email: email.trim().toLowerCase(), 
                otp: otpValue 
            });
            toast.success('OTP Verified Successfully');
            sessionStorage.setItem('resetToken', response.data.resetToken);
            navigate('/reset-password');
        } catch (error) {
            const msg = error.response?.data?.message || 'Invalid or expired OTP';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        
        setIsResending(true);
        try {
            await api.post('/auth/forgot-password', { email: email.trim().toLowerCase() });
            setTimer(300);
            setOtp(['', '', '', '', '', '']);
            toast.success('New OTP sent to your email');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F6F1EB] overflow-hidden items-center justify-center p-6 relative text-[#330020]">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-[#330020]/[0.01]" />
                <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-[#8A8F68]/[0.05] blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white/55 rounded-[2.5rem] shadow-soft p-10 lg:p-16 border border-[#330020]/10 backdrop-blur-md relative z-10"
            >
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-serif mb-3 tracking-tight text-[#330020]">Access <span className="italic font-light">Recovery.</span></h1>
                    <p className="text-[#330020]/48 font-bold text-[10px] uppercase tracking-[0.2em]">Secure authentication gateway</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <p className="text-sm text-[#330020]/72 font-light leading-relaxed mb-10 text-center px-4">
                                Enter your registered email address and we will issue a one-time secure access token.
                            </p>

                            <form onSubmit={handleEmailSubmit} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/20 group-focus-within:text-[#330020] transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (error) setError('');
                                            }}
                                            className="w-full pl-16 pr-6 py-5 bg-white/80 border border-[#330020]/10 focus:border-[#330020]/30 rounded-[1.5rem] outline-none transition-all font-bold text-sm shadow-sm text-[#330020]"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-full bg-[#330020] text-[#F6F1EB] text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-lg shadow-[#330020]/10 hover:bg-[#4A012E] hover:shadow-lg hover:shadow-[#4A012E]/20 border border-transparent cursor-pointer"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <span className="flex items-center gap-4">
                                            Request Token <ArrowRight size={20} />
                                        </span>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="mb-10 text-center">
                                <div className="w-16 h-16 bg-white/80 text-[#8A8F68] rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#330020]/10 shadow-sm">
                                    <ShieldCheck size={24} />
                                </div>
                                <p className="text-sm text-[#330020]/72 font-light leading-relaxed mb-2 px-4">Secure token dispatched to</p>
                                <span className="text-sm font-bold tracking-tight text-[#330020]">{email}</span>
                            </div>

                            <form onSubmit={handleOtpSubmit} className="space-y-10">
                                <div className="flex justify-between gap-3 px-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-full h-16 text-center text-xl font-bold bg-white/80 border border-[#330020]/10 rounded-2xl focus:border-[#330020]/30 outline-none transition-all shadow-sm text-[#330020]"
                                        />
                                    ))}
                                </div>

                                {error && <p className="text-red-500 text-center text-[10px] font-bold uppercase tracking-widest">{error}</p>}

                                <div className="flex flex-col items-center gap-8">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 rounded-full bg-[#330020] text-[#F6F1EB] text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-lg shadow-[#330020]/10 hover:bg-[#4A012E] hover:shadow-lg hover:shadow-[#4A012E]/20 border border-transparent cursor-pointer"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'Authorize Access'}
                                    </button>

                                    <div className="flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-3 text-[#330020]/48 font-bold text-[10px] uppercase tracking-widest">
                                            <Timer size={14} className="text-[#8A8F68]" />
                                            <span>Token valid for {timer > 0 ? formatTime(timer) : '0:00'}</span>
                                        </div>
                                        
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={timer > 0 || isResending}
                                            className={`flex items-center gap-2 font-bold uppercase text-[9px] tracking-[0.2em] transition-colors cursor-pointer ${
                                                timer > 0 ? 'text-[#330020]/10 cursor-not-allowed' : 'text-[#8A8F68] hover:underline'
                                            }`}
                                        >
                                            {isResending ? <RefreshCw className="animate-spin" size={12} /> : 'Request New Token'}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full py-4 text-[#330020]/48 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:text-[#330020] transition-colors mt-4 cursor-pointer"
                                >
                                    <ArrowLeft size={14} />
                                    Change email address
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 pt-12 border-t border-[#330020]/10 text-center">
                    <Link to="/login" className="inline-flex items-center gap-3 text-[#330020]/48 font-bold hover:text-[#330020] transition-colors text-[10px] uppercase tracking-[0.2em] group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Authentication
                    </Link>
                </div>
            </motion.div>

            <div className="absolute bottom-12 left-0 w-full text-center pointer-events-none">
                <span className="text-[9px] font-bold text-[#330020]/20 uppercase tracking-[0.3em]">© 2024 Indian Furniture Mart • Secure Gateway</span>
            </div>
        </div>
    );
};

export default ForgotPassword;

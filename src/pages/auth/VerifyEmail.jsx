import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, 
    CheckCircle2, 
    XCircle, 
    Loader2, 
    ArrowRight, 
    ShieldCheck, 
    RefreshCw, 
    ArrowLeft 
} from 'lucide-react';
import Button from '../../components/common/Button';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const emailParam = searchParams.get('email') || '';
    const tokenParam = searchParams.get('token') || '';

    // States: 'VERIFYING' | 'OTP_INPUT' | 'SUCCESS' | 'INVALID_LINK' | 'RESEND'
    const [viewState, setViewState] = useState('OTP_INPUT');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    
    // Cooldown timer for resend
    const [cooldown, setCooldown] = useState(0);
    const [email, setEmail] = useState(emailParam);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef([]);

    // 1. Auto-verify if email and token query parameters are present
    useEffect(() => {
        if (emailParam && tokenParam) {
            autoVerifyLink(emailParam, tokenParam);
        }
    }, [emailParam, tokenParam]);

    // 2. Cooldown timer for resending OTP
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const autoVerifyLink = async (emailAddr, tokenVal) => {
        setViewState('VERIFYING');
        setLoading(true);
        try {
            const { data } = await api.get(`/auth/verify-email-link?email=${encodeURIComponent(emailAddr)}&token=${tokenVal}`);
            toast.success(data.message || 'Email verified successfully!');
            setViewState('SUCCESS');
        } catch (error) {
            console.error('Link verification error:', error);
            const msg = error.response?.data?.message || 'Link verification failed. The link may have expired.';
            toast.error(msg);
            setViewState('INVALID_LINK');
        } finally {
            setLoading(false);
        }
    };

    // 3. Handle OTP focus and entries
    const handleOtpChange = (index, value) => {
        const val = value.replace(/[^0-9]/g, ''); // Numeric only
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        // Auto focus next field
        if (val && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            setOtp(digits);
            otpRefs.current[5].focus();
        }
    };

    // 4. Handle OTP Form Submit
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) {
            toast.error('Please enter the complete 6-digit verification code.');
            return;
        }

        if (!email) {
            toast.error('Email is missing. Please enter your email.');
            setViewState('RESEND');
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-email-otp', {
                email: email.trim().toLowerCase(),
                otp: fullOtp
            });
            toast.success(data.message || 'Verification successful!');
            setViewState('SUCCESS');
        } catch (error) {
            const msg = error.response?.data?.message || 'Verification failed. Please check the code.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    // 5. Trigger Verification Resend
    const handleResend = async (e) => {
        if (e) e.preventDefault();
        if (!email) {
            toast.error('Please provide an email address.');
            return;
        }

        setResendLoading(true);
        try {
            const { data } = await api.post('/auth/resend-verification', {
                email: email.trim().toLowerCase()
            });
            toast.success(data.message || 'Verification code sent to your email.');
            setCooldown(60); // Set 60 seconds cool-down
            setViewState('OTP_INPUT');
            setOtp(['', '', '', '', '', '']);
        } catch (error) {
            if (error.response?.status === 429) {
                toast.error(error.response.data.message);
                setCooldown(30); // fallback cooldown
            } else {
                toast.error(error.response?.data?.message || 'Failed to resend code.');
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F6F1EB] overflow-hidden font-sans">
            {/* Left Column: Premium Mart Aesthetic (Identical to Login) */}
            <div className="hidden lg:flex w-[45%] relative items-center justify-center overflow-hidden border-r border-[#330020]/10">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
                        alt="Luxury Mart" 
                        className="w-full h-full object-cover brightness-[0.72]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#330020]/60 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 p-20 text-[#F6F1EB] max-w-xl">
                    <span className="text-[#8A8F68] font-bold uppercase tracking-[0.4em] text-[10px] mb-8 block">ESTABLISHED 1992</span>
                    <h1 className="text-6xl font-serif text-[#F6F1EB] mb-8 leading-[0.9] tracking-tighter">
                        Authentic <br />
                        <span className="italic font-light text-[#F6F1EB]/60">Ownership.</span>
                    </h1>
                    <p className="text-lg text-[#F6F1EB]/80 leading-relaxed font-medium">
                        Verification secures your personal design portfolio and guarantees exclusive access to our luxury furniture collections.
                    </p>
                </div>

                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[#F6F1EB]/40">
                    <span className="text-[9px] font-bold uppercase tracking-widest">© 2026 Indian Furniture Mart</span>
                </div>
            </div>

            {/* Right Column: Dynamic Form Container */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-8 lg:p-24 bg-[#F6F1EB] relative">
                
                <AnimatePresence mode="wait">
                    {/* A. VERIFYING STATE */}
                    {viewState === 'VERIFYING' && (
                        <motion.div
                            key="verifying"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="w-full max-w-md p-10 md:p-12 bg-white/65 backdrop-blur-xl rounded-[2.5rem] border border-[#330020]/10 shadow-[0_20px_40px_rgba(51,0,32,0.08)] text-center space-y-8"
                        >
                            <div className="flex flex-col items-center gap-6">
                                <Loader2 className="animate-spin text-[#8A8F68]" size={48} />
                                <h2 className="text-3xl font-serif text-[#330020]">Confirming Credentials</h2>
                                <p className="text-xs text-[#330020]/60 leading-relaxed uppercase tracking-widest font-bold">
                                    Verifying secure authentication signature with database. Please wait...
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* B. OTP INPUT STATE */}
                    {viewState === 'OTP_INPUT' && (
                        <motion.div
                            key="otp_input"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="w-full max-w-md p-10 md:p-12 bg-white/65 backdrop-blur-xl rounded-[2.5rem] border border-[#330020]/10 shadow-[0_20px_40px_rgba(51,0,32,0.08)]"
                        >
                            <div className="mb-10">
                                <h2 className="text-4xl font-serif text-[#330020] mb-3 tracking-tight">Verify <span className="italic font-light">Email.</span></h2>
                                <p className="text-[#330020]/48 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                                    Enter the 6-digit confirmation code we sent to <br />
                                    <span className="text-[#8A8F68] font-bold lowercase tracking-normal">{email || 'your email'}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-8">
                                {/* OTP Code Inputs */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Confirmation Code</label>
                                    <div className="grid grid-cols-6 gap-3" onPaste={handlePaste}>
                                        {otp.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                ref={el => otpRefs.current[idx] = el}
                                                onChange={e => handleOtpChange(idx, e.target.value)}
                                                onKeyDown={e => handleKeyDown(idx, e)}
                                                className="w-full text-center py-4 bg-[#F6F1EB] border border-[#330020]/10 rounded-[1rem] outline-none focus:border-[#8A8F68] transition-all font-serif font-bold text-xl text-[#330020] shadow-none focus:ring-0"
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full !py-6 !text-sm shadow-none bg-[#330020] hover:bg-[#4A1132] text-[#F6F1EB] transition-colors rounded-full"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <span className="flex items-center justify-center gap-4">
                                            Verify Account <ArrowRight size={20} />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-10 pt-8 border-t border-[#330020]/10 flex flex-col gap-4 text-center">
                                <div className="text-xs">
                                    <span className="text-[#330020]/48 font-bold uppercase tracking-widest">Didn't receive the email?</span>
                                    <button 
                                        disabled={cooldown > 0 || resendLoading}
                                        onClick={handleResend}
                                        className="block mx-auto mt-2 text-[#8A8F68] font-bold uppercase tracking-widest text-[10px] hover:underline disabled:opacity-50"
                                    >
                                        {resendLoading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Request New Code'}
                                    </button>
                                </div>
                                <button
                                    onClick={() => setViewState('RESEND')}
                                    className="text-[9px] font-bold uppercase tracking-widest text-[#330020]/40 hover:text-[#330020] transition-colors"
                                >
                                    Change Email Address
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* C. SUCCESS STATE */}
                    {viewState === 'SUCCESS' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md p-10 md:p-12 bg-white/65 backdrop-blur-xl rounded-[2.5rem] border border-[#330020]/10 shadow-[0_20px_40px_rgba(51,0,32,0.08)] text-center space-y-8"
                        >
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-green-50 border border-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <CheckCircle2 size={40} />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-4xl font-serif text-[#330020] tracking-tight">Account <span className="italic font-light">Verified.</span></h2>
                                    <p className="text-[#330020]/60 font-sans text-sm leading-relaxed max-w-xs">
                                        Your email has been authenticated successfully. You now have complete access to our curated furniture collections.
                                    </p>
                                </div>
                            </div>

                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full !py-6 !text-sm shadow-none bg-[#330020] hover:bg-[#4A1132] text-[#F6F1EB] transition-colors rounded-full"
                            >
                                <span className="flex items-center justify-center gap-4">
                                    Proceed to Sign In <ArrowRight size={20} />
                                </span>
                            </Button>
                        </motion.div>
                    )}

                    {/* D. INVALID LINK STATE */}
                    {viewState === 'INVALID_LINK' && (
                        <motion.div
                            key="invalid_link"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="w-full max-w-md p-10 md:p-12 bg-white/65 backdrop-blur-xl rounded-[2.5rem] border border-[#330020]/10 shadow-[0_20px_40px_rgba(51,0,32,0.08)] text-center space-y-8"
                        >
                            <div className="flex flex-col items-center gap-6">
                                <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-600">
                                    <XCircle size={40} />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-serif text-[#330020]">Link Expired or Invalid</h2>
                                    <p className="text-[#330020]/60 font-sans text-xs leading-relaxed max-w-xs">
                                        The security verification signature is invalid or has expired after 24 hours. Please request a new verification code.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={() => setViewState('RESEND')}
                                    className="w-full !py-6 !text-sm shadow-none bg-[#330020] hover:bg-[#4A1132] text-[#F6F1EB] transition-colors rounded-full"
                                >
                                    <span className="flex items-center justify-center gap-4">
                                        Get New Verification Email <RefreshCw size={16} />
                                    </span>
                                </Button>
                                
                                <Link 
                                    to="/login"
                                    className="block text-[10px] font-bold uppercase tracking-widest text-[#330020]/48 hover:text-[#330020] transition-colors"
                                >
                                    Return to Sign In
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* E. CHANGE/RESEND EMAIL STATE */}
                    {viewState === 'RESEND' && (
                        <motion.div
                            key="resend"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="w-full max-w-md p-10 md:p-12 bg-white/65 backdrop-blur-xl rounded-[2.5rem] border border-[#330020]/10 shadow-[0_20px_40px_rgba(51,0,32,0.08)]"
                        >
                            <div className="mb-10">
                                <button 
                                    onClick={() => setViewState('OTP_INPUT')} 
                                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#330020]/48 hover:text-[#330020] transition-colors mb-6"
                                >
                                    <ArrowLeft size={12} /> Back to Code Input
                                </button>
                                <h2 className="text-4xl font-serif text-[#330020] mb-3 tracking-tight">Request <span className="italic font-light">Code.</span></h2>
                                <p className="text-[#330020]/48 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                                    Provide the email associated with your account to receive a new activation link and verification code.
                                </p>
                            </div>

                            <form onSubmit={handleResend} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/30 group-focus-within:text-[#330020] transition-colors" size={18} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-[#F6F1EB] border border-[#330020]/10 rounded-[1.5rem] outline-none focus:border-[#8A8F68] transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30 shadow-none focus:ring-0"
                                            placeholder="name@company.com"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={resendLoading || cooldown > 0}
                                    className="w-full !py-6 !text-sm shadow-none bg-[#330020] hover:bg-[#4A1132] text-[#F6F1EB] transition-colors rounded-full"
                                >
                                    {resendLoading ? <Loader2 className="animate-spin" /> : (
                                        <span className="flex items-center justify-center gap-4">
                                            {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Send Verification Code'} <ArrowRight size={20} />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VerifyEmail;

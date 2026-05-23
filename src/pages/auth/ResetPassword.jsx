import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';
import { Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem('resetToken');
        if (!storedToken) {
            toast.error('Invalid session. Please start the process again.');
            navigate('/forgot-password');
        } else {
            setToken(storedToken);
        }
    }, [navigate]);

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validatePassword(password)) {
            setError('Password requirements not met');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', { 
                token, 
                password 
            });
            toast.success('Password reset successful! Please login.');
            sessionStorage.removeItem('resetToken');
            navigate('/login');
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to reset password';
            setError(msg);
            toast.error(msg);
            if (msg.includes('expired') || msg.includes('session')) {
                sessionStorage.removeItem('resetToken');
                navigate('/forgot-password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F6F1EB] overflow-hidden items-center justify-center p-6 relative text-[#330020]">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-[50%] h-full bg-[#330020]/[0.01]" />
                <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-[#8A8F68]/[0.05] blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white/55 rounded-[2.5rem] shadow-soft p-10 lg:p-16 border border-[#330020]/10 backdrop-blur-md relative z-10"
            >
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-serif mb-3 tracking-tight text-[#330020]">Access <span className="italic font-light">Renewal.</span></h1>
                    <p className="text-[#330020]/48 font-bold text-[10px] uppercase tracking-[0.2em]">Secure password establishment</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/20 group-focus-within:text-[#330020] transition-colors" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full pl-16 pr-16 py-5 bg-white/80 border border-[#330020]/10 focus:border-[#330020]/30 rounded-[1.5rem] outline-none transition-all font-bold text-sm shadow-sm text-[#330020]"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#330020]/20 hover:text-[#330020] transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/20 group-focus-within:text-[#330020] transition-colors" size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full pl-16 pr-6 py-5 bg-white/80 border border-[#330020]/10 focus:border-[#330020]/30 rounded-[1.5rem] outline-none transition-all font-bold text-sm shadow-sm text-[#330020]"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 mt-3 ml-1 text-red-500">
                                <ShieldAlert size={12} />
                                <p className="text-[9px] font-bold uppercase tracking-widest">{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white/40 rounded-2xl p-6 space-y-4 border border-[#330020]/10 shadow-sm">
                        <p className="text-[9px] font-bold text-[#330020]/30 uppercase tracking-[0.2em] mb-2">Cryptographic Strength Check</p>
                        <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${password.length >= 6 ? 'bg-green-500/10 text-green-600' : 'bg-[#330020]/5 text-[#330020]/20'}`}>
                                <CheckCircle2 size={12} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${password.length >= 6 ? 'text-[#330020]/60' : 'text-[#330020]/20'}`}>Minimum 6 characters</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${/[A-Z]/.test(password) ? 'bg-green-500/10 text-green-600' : 'bg-[#330020]/5 text-[#330020]/20'}`}>
                                <CheckCircle2 size={12} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${/[A-Z]/.test(password) ? 'text-[#330020]/60' : 'text-[#330020]/20'}`}>Upper case inclusion</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${/\d/.test(password) ? 'bg-green-500/10 text-green-600' : 'bg-[#330020]/5 text-[#330020]/20'}`}>
                                <CheckCircle2 size={12} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${/\d/.test(password) ? 'text-[#330020]/60' : 'text-[#330020]/20'}`}>Numerical character</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 rounded-full bg-[#330020] text-[#F6F1EB] text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-lg shadow-[#330020]/10 hover:bg-[#4A012E] hover:shadow-lg hover:shadow-[#4A012E]/20 border border-transparent cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center gap-4">
                                    Establish New Password <ArrowRight size={20} />
                                </span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-12 pt-12 border-t border-[#330020]/10 text-center">
                    <Link to="/login" className="inline-flex items-center gap-3 text-[#330020]/48 font-bold hover:text-[#330020] transition-colors text-[10px] uppercase tracking-[0.2em] group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Abort and return to Authentication
                    </Link>
                </div>
            </motion.div>

            <div className="absolute bottom-12 left-0 w-full text-center pointer-events-none">
                <span className="text-[9px] font-bold text-[#330020]/20 uppercase tracking-[0.3em]">© 2024 Indian Furniture Mart • Secure Access Protocol</span>
            </div>
        </div>
    );
};

export default ResetPassword;

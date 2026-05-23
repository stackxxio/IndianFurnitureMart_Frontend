import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

    useEffect(() => {
        if (isExpired) {
            toast.error('Session expired. Please login again.', { id: 'session-expired' });
        }
    }, [isExpired]);

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setGoogleLoading(true);
            try {
                const { data } = await api.post('/auth/google-login', { 
                    token: tokenResponse.access_token 
                });
                login(data);
                toast.success('Welcome to Indian Furniture Mart via Google');
                const from = location.state?.from?.pathname || (data.role === 'admin' ? '/admin' : '/home');
                navigate(from, { replace: true });
            } catch (error) {
                console.error('Google Auth Login API error:', error);
                toast.error(error.response?.data?.message || 'Google authentication failed');
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            toast.error('Google login was cancelled or failed.');
            setGoogleLoading(false);
        }
    });

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email address is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email';
        if (!password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!validate()) {
            toast.error('Please fill all required fields correctly');
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { 
                email: trimmedEmail, 
                password: trimmedPassword 
            });
            login(data);
            toast.success('Welcome back to Indian Furniture Mart');
            
            const from = location.state?.from?.pathname || (data.role === 'admin' ? '/admin' : '/home');
            navigate(from, { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            
            if (error.response?.status === 403 && error.response?.data?.emailVerified === false) {
                toast.error(message);
                navigate(`/verify-email?email=${encodeURIComponent(trimmedEmail)}`);
                return;
            }
            
            toast.error(message);
            if (error.response?.status === 401) {
                setErrors({ auth: message });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F6F1EB] overflow-hidden font-sans">
            {/* Left Side: Cinematic Visual */}
            <div className="hidden lg:flex w-[45%] relative items-center justify-center overflow-hidden border-r border-[#330020]/10">
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
                        alt="Luxury Interior" 
                        className="w-full h-full object-cover brightness-[0.75]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#330020]/60 via-transparent to-transparent" />
                </motion.div>

                <div className="relative z-10 p-20 text-[#F6F1EB] max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <span className="text-[#8A8F68] font-bold uppercase tracking-[0.4em] text-[10px] mb-8 block">ESTABLISHED 1992</span>
                        <h1 className="text-6xl font-serif text-[#F6F1EB] mb-8 leading-[0.9] tracking-tighter">
                            The Sanctuary <br />
                            <span className="italic font-light text-[#F6F1EB]/60">of Design.</span>
                        </h1>
                        <p className="text-lg text-[#F6F1EB]/80 leading-relaxed font-medium">
                            Access your exclusive dashboard and manage your world-class furniture collections.
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[#F6F1EB]/40">
                    <span className="text-[9px] font-bold uppercase tracking-widest">© 2026 Indian Furniture Mart</span>
                    <div className="flex gap-6">
                        <span className="text-[9px] font-bold uppercase tracking-widest">Terms</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">Privacy</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-[55%] flex items-center justify-center p-6 lg:py-6 lg:px-12 bg-[#F6F1EB] relative">
                <div className="absolute top-0 right-0 p-6 lg:p-8 hidden lg:block">
                    <Link to="/register">
                        <span className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] mr-4">Don't have an account?</span>
                        <Button variant="secondary" className="!px-8 !py-3 !text-[10px] !bg-transparent !border-[#330020]/20 hover:!bg-[#330020]/5 !text-[#330020]">Create Account</Button>
                    </Link>
                </div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md p-6 md:p-8 bg-white/65 backdrop-blur-xl rounded-[2.5rem] border border-[#330020]/10 shadow-[0_20px_40px_rgba(51,0,32,0.08)]"
                >
                    <div className="mb-4">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#330020] mb-2 tracking-tight">Welcome <span className="italic font-light">Back.</span></h2>
                        <p className="text-[#330020]/48 font-bold text-[10px] uppercase tracking-widest">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/30 group-focus-within:text-[#330020] transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-16 pr-6 py-3.5 bg-[#F6F1EB] border border-[#330020]/10 rounded-[1.5rem] outline-none focus:border-[#8A8F68] transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30 shadow-none focus:ring-0"
                                    placeholder="name@company.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em]">Password</label>
                                <Link to="/forgot-password" title="Recover Password" className="text-[9px] font-bold uppercase tracking-widest text-[#8A8F68] hover:underline">Lost access?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/30 group-focus-within:text-[#330020] transition-colors" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-16 pr-16 py-3.5 bg-[#F6F1EB] border border-[#330020]/10 rounded-[1.5rem] outline-none focus:border-[#8A8F68] transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30 shadow-none focus:ring-0"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#330020]/30 hover:text-[#330020] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.password}</p>}
                        </div>

                        {errors.auth && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                                <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest text-center">{errors.auth}</p>
                            </div>
                        )}

                        <div className="pt-1">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full !py-3.5 !text-xs shadow-none bg-[#330020] hover:bg-[#4A1132] text-[#F6F1EB] transition-colors rounded-full"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (
                                    <span className="flex items-center justify-center gap-4">
                                        Authenticate <ArrowRight size={20} />
                                    </span>
                                )}
                            </Button>
                        </div>

                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-[#330020]/10"></div>
                            <span className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-widest text-[#330020]/30">OR</span>
                            <div className="flex-grow border-t border-[#330020]/10"></div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            disabled={googleLoading}
                            className="w-full flex items-center justify-center gap-4 py-3.5 bg-white/40 backdrop-blur-md hover:bg-white/70 border border-[#330020]/15 hover:border-[#330020]/30 transition-all rounded-full font-bold text-xs uppercase tracking-widest text-[#330020] shadow-sm disabled:opacity-50"
                        >
                            {googleLoading ? <Loader2 className="animate-spin" size={16} /> : (
                                <>
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path fill="#EA4335" d="M12 5.04c1.7 0 3.23.58 4.43 1.73l3.32-3.32C17.76 1.54 15.11 0 12 0 7.37 0 3.4 2.66 1.45 6.55l3.96 3.07C6.34 6.89 8.94 5.04 12 5.04z"/>
                                        <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.47h6.44c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.97 3.75-4.88 3.75-8.51z"/>
                                        <path fill="#FBBC05" d="M5.41 14.62c-.24-.72-.37-1.49-.37-2.28 0-.79.13-1.56.37-2.28L1.45 6.55C.53 8.39 0 10.45 0 12.63s.53 4.24 1.45 6.08l3.96-3.07z"/>
                                        <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.02.68-2.33 1.09-4.3 1.09-3.06 0-5.66-1.85-6.59-4.58L1.45 18.33C3.4 22.23 7.37 24 12 24z"/>
                                    </svg>
                                    Continue with Google
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-5 pt-4 border-t border-[#330020]/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#330020]/5 flex items-center justify-center text-[#330020]">
                                <ShieldCheck size={16} />
                            </div>
                            <span className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest">Secure 256-bit encryption</span>
                        </div>
                        <Link to="/" className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest hover:text-[#330020] transition-colors">Return to Mart</Link>
                    </div>
                    
                    <div className="mt-6 lg:hidden text-center">
                        <p className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-widest">
                            New customer? <Link to="/register" className="text-[#8A8F68] underline">Create account</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;



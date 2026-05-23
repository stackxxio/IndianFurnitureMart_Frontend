import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
    Mail, 
    Lock, 
    User, 
    ArrowRight, 
    Loader2, 
    Eye, 
    EyeOff, 
    Phone, 
    ShieldCheck,
    Globe
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

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
                navigate('/home');
            } catch (error) {
                console.error('Google Auth Register API error:', error);
                toast.error(error.response?.data?.message || 'Google authentication failed');
            } finally {
                setGoogleLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google registration error:', error);
            toast.error('Google authentication was cancelled or failed.');
            setGoogleLoading(false);
        }
    });

    const validate = () => {
        const newErrors = {};
        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'Full name is required';
        }
        if (!formData.email) {
            newErrors.email = 'Email address is required';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newErrors.email = 'Please provide a valid email (e.g. name@domain.com)';
        }

        // Password complexity: min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Min 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special symbol';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const trimmedData = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password.trim(),
            shopName: 'Customer Residence', // backend compatibility default fallback
            phone: formData.phone.trim() || 'Not provided' // backend compatibility default fallback (phone is UI-optional)
        };

        if (!validate()) {
            toast.error('Please fill all required fields correctly');
            return;
        }
        
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', trimmedData);
            toast.success(data.message || 'Customer account created! Please verify your email.');
            navigate(`/verify-email?email=${encodeURIComponent(trimmedData.email)}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { title: "Curated Collections", desc: "Save your favorite bespoke furniture designs and design ideas.", icon: ShieldCheck },
        { title: "Customer Portal", desc: "Inquire about legacy products and manage consultations.", icon: User },
        { title: "Global Logistics", desc: "Priority white-glove international shipping.", icon: Globe }
    ];

    return (
        <div className="min-h-screen w-full flex bg-[#F6F1EB] overflow-hidden font-sans">
            {/* Left Side: Editorial Form */}
            <div className="w-full lg:w-[60%] flex items-center justify-center p-6 md:p-12 lg:p-24 bg-[#F6F1EB] relative overflow-y-auto">
                <div className="absolute top-0 left-0 p-12 hidden lg:block">
                    <Link to="/login">
                        <span className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] mr-4">Already have an account?</span>
                        <Button variant="secondary" className="!px-8 !py-3 !text-[10px] !bg-transparent !border-[#330020]/20 hover:!bg-[#330020]/5 !text-[#330020]">Sign In</Button>
                    </Link>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-xl p-8 md:p-14 bg-white/65 backdrop-blur-xl rounded-[2.5rem] border border-[#330020]/10 shadow-[0_20px_40px_rgba(51,0,32,0.06)] my-12"
                >
                    <div className="mb-10 text-left">
                        <h2 className="text-4xl md:text-5xl font-serif text-[#330020] mb-4 tracking-tight">Create Your <span className="italic font-light text-[#330020]/60">Account.</span></h2>
                        <p className="text-[#330020]/60 font-medium text-xs leading-relaxed max-w-md">
                            Save curated collections, request design consultations, and access exclusive catalogue updates.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/30 group-focus-within:text-[#330020] transition-colors" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-6 py-4.5 bg-white/50 border border-[#330020]/10 rounded-[1.5rem] outline-none focus:border-[#330020]/30 focus:ring-4 focus:ring-[#330020]/5 transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30 shadow-[0_4px_12px_rgba(51,0,32,0.01)] focus:ring-0"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.name}</p>}
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/30 group-focus-within:text-[#330020] transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-6 py-4.5 bg-white/50 border border-[#330020]/10 rounded-[1.5rem] outline-none focus:border-[#330020]/30 focus:ring-4 focus:ring-[#330020]/5 transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30 shadow-[0_4px_12px_rgba(51,0,32,0.01)] focus:ring-0"
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.email}</p>}
                        </div>

                        {/* Phone Number (Optional) */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em]">Phone Number</label>
                                <span className="text-[8px] font-bold text-[#330020]/30 uppercase tracking-[0.2em]">Optional</span>
                            </div>
                            <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/30 group-focus-within:text-[#330020] transition-colors" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-16 pr-6 py-4.5 bg-white/50 border border-[#330020]/10 rounded-[1.5rem] outline-none focus:border-[#330020]/30 focus:ring-4 focus:ring-[#330020]/5 transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30 shadow-[0_4px_12px_rgba(51,0,32,0.01)] focus:ring-0"
                                    placeholder="+1 (000) 000-0000"
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.phone}</p>}
                        </div>

                        {/* Password and Confirm Password Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/30 group-focus-within:text-[#330020] transition-colors" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-16 pr-16 py-4.5 bg-white/50 border border-[#330020]/10 rounded-[1.5rem] outline-none focus:border-[#330020]/30 focus:ring-4 focus:ring-[#330020]/5 transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30 shadow-[0_4px_12px_rgba(51,0,32,0.01)] focus:ring-0"
                                        placeholder="••••••••"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-[#330020]/30 hover:text-[#330020] transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-1 ml-1 leading-normal">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/30 group-focus-within:text-[#330020] transition-colors" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-16 pr-6 py-4.5 bg-white/50 border border-[#330020]/10 rounded-[1.5rem] outline-none focus:border-[#330020]/30 focus:ring-4 focus:ring-[#330020]/5 transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30 shadow-[0_4px_12px_rgba(51,0,32,0.01)] focus:ring-0"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-1 ml-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        {/* Terms checkbox */}
                        <div className="flex items-start gap-4 pt-2 ml-1">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                required 
                                className="mt-1 w-5 h-5 rounded-md border-[#330020]/10 text-[#330020] focus:ring-[#330020]/10 accent-[#330020]" 
                            />
                            <label htmlFor="terms" className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] leading-relaxed">
                                I agree to the <span className="text-[#8A8F68] underline cursor-pointer">Terms of Service</span> and <span className="text-[#8A8F68] underline cursor-pointer">Privacy Charter</span>.
                            </label>
                        </div>

                        {/* Submit button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-[#330020] hover:bg-[#4A1132] text-[#F6F1EB] rounded-full transition-all duration-300 font-bold text-xs uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(51,0,32,0.15)] flex items-center justify-center gap-4 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                    <span className="flex items-center justify-center gap-4">
                                        CREATE ACCOUNT <ArrowRight size={18} />
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Separator */}
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-[#330020]/10"></div>
                            <span className="flex-shrink mx-4 text-[9px] font-bold uppercase tracking-widest text-[#330020]/30">OR</span>
                            <div className="flex-grow border-t border-[#330020]/10"></div>
                        </div>

                        {/* Google button */}
                        <button
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            disabled={googleLoading}
                            className="w-full flex items-center justify-center gap-4 py-5 bg-white/40 backdrop-blur-md hover:bg-white/70 border border-[#330020]/15 hover:border-[#330020]/30 transition-all rounded-full font-bold text-xs uppercase tracking-widest text-[#330020] shadow-sm disabled:opacity-50 cursor-pointer"
                        >
                            {googleLoading ? <Loader2 className="animate-spin" size={16} /> : (
                                <>
                                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
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

                    <div className="mt-10 lg:hidden text-center">
                        <p className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-widest">
                            Already have an account? <Link to="/login" className="text-[#8A8F68] underline">Sign In</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side: Visual & Features */}
            <div className="hidden lg:flex w-[40%] relative items-center justify-center overflow-hidden border-l border-[#330020]/10 font-sans">
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2000&auto=format&fit=crop" 
                        alt="Luxury Mart" 
                        className="w-full h-full object-cover brightness-[0.7]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#330020]/40 via-transparent to-transparent" />
                </motion.div>

                <div className="relative z-10 px-16 w-full">
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-12"
                    >
                        <div className="max-w-xs">
                            <h3 className="text-4xl font-serif text-[#F6F1EB] mb-6 leading-[0.9]">The Standard of Excellence.</h3>
                            <div className="w-12 h-[1px] bg-[#F6F1EB]/30" />
                        </div>

                        <div className="space-y-8">
                            {features.map((feature, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 + (idx * 0.1) }}
                                    className="flex items-start gap-6 group"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#8A8F68] group-hover:scale-110 transition-transform">
                                        <feature.icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[#F6F1EB] font-bold text-base mb-2">{feature.title}</h4>
                                        <p className="text-[#F6F1EB]/60 text-xs leading-relaxed font-medium">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-[#F6F1EB]/40">
                    <span className="text-[9px] font-bold uppercase tracking-widest">© 2026 Indian Furniture Mart</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest">International Mart</span>
                </div>
            </div>
        </div>
    );
};

export default Register;

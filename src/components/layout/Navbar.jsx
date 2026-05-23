import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { EnquiryContext } from '../../context/EnquiryContext';
import logo from "../../assets/ifm-logo.png";
import { 
    User, 
    LogOut, 
    Menu,
    X,
    ChevronDown,
    LayoutDashboard,
    ShoppingBag,
    Sofa,
    Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { items, openDrawer } = useContext(EnquiryContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'HOME', path: '/home' },
        { name: 'COLLECTIONS', path: '/products' },
        { name: 'CATEGORIES', path: '/categories' },
        { name: 'ABOUT US', path: '/about' },
        { name: 'CONTACT', path: '/contact' },
    ];

    const isHomePage = location.pathname === '/home' || location.pathname === '/';

    return (
        <>
            <nav 
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    isScrolled 
                        ? 'bg-[#F6F1EB]/95 backdrop-blur-[24px] shadow-[0_4px_24px_rgba(51,0,32,0.06)] py-4 border-b border-[#330020]/08' 
                        : isHomePage
                            ? 'bg-transparent py-[22px] border-b border-transparent shadow-none'
                            : 'bg-[#F6F1EB]/90 backdrop-blur-[20px] py-[22px] border-b border-[#330020]/08 shadow-none'
                }`}
            >
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/home" className="flex items-center gap-3.5 group">
                            <img 
                                src={logo} 
                                alt="Indian Furniture Mart" 
                                className="h-14 w-14 object-cover rounded-xl shadow-md border border-[#330020]/10 transition-all duration-300 group-hover:scale-[1.04] group-hover:-translate-y-[2px]" 
                            />
                            <div className="flex flex-col pt-0.5">
                                <span className="text-[20px] font-serif font-semibold text-[#330020] tracking-tight leading-none">
                                    Indian Furniture Mart
                                </span>
                                <span className="text-[8px] uppercase tracking-[0.35em] font-bold text-[#330020]/70 mt-1 opacity-90">
                                    MODERN • LUXURY
                                </span>
                            </div>
                        </Link>
 
                        {/* Navigation Links */}
                        <div className="hidden lg:flex items-center gap-[42px]">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`
                                        text-[12px] uppercase tracking-[3px] font-semibold font-sans transition-all duration-300
                                        hover:text-[#330020] relative group flex flex-col items-center py-1
                                        ${location.pathname === link.path ? 'text-[#330020]' : 'text-[#330020]/65'}
                                    `}
                                >
                                    <span>{link.name}</span>
                                    
                                    {/* Elegant Underline Animation on Hover */}
                                    <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#8A8F68] origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                                    
                                    {/* Active Muted Olive Dot */}
                                    {location.pathname === link.path && (
                                        <span className="absolute -bottom-3 w-1 h-1 rounded-full bg-[#8A8F68] transition-all duration-300" />
                                    )}
                                </Link>
                            ))}
                        </div>
 
                        {/* Actions */}
                        <div className="flex items-center gap-5">
                            {/* Desktop Only Actions */}
                            <div className="hidden lg:flex items-center gap-5">
                                {/* Wishlist Icon */}
                                <Link 
                                    to="/dashboard"
                                    onClick={(e) => {
                                        if (!user) {
                                            e.preventDefault();
                                            toast('Please sign in to access your personalized consultation list.', {
                                                icon: '🔒',
                                                style: {
                                                    background: '#F6F1EB',
                                                    color: '#330020',
                                                    border: '1px solid rgba(51, 0, 32, 0.1)',
                                                    borderRadius: '100px',
                                                    padding: '12px 24px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em'
                                                }
                                            });
                                            navigate('/login', { state: { from: location } });
                                        }
                                    }}
                                    className="text-[#330020]/60 hover:text-[#330020] hover:bg-[#330020]/05 p-2 rounded-full transition-all duration-300 relative group flex items-center justify-center"
                                >
                                    <Heart size={18} strokeWidth={1.5} />
                                </Link>

                                {/* Enquiry Bag Icon */}
                                <button 
                                    onClick={openDrawer}
                                    className="text-[#330020]/60 hover:text-[#330020] hover:bg-[#330020]/05 p-2 rounded-full transition-all duration-300 relative group flex items-center justify-center cursor-pointer"
                                >
                                    <ShoppingBag size={18} strokeWidth={1.5} />
                                    {items.length > 0 && (
                                        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#8A8F68] text-[#F6F1EB] text-[8px] font-bold rounded-full flex items-center justify-center">
                                            {items.length}
                                        </span>
                                    )}
                                </button>
     
                                {/* Profile / Auth */}
                                {user ? (
                                    <div className="relative">
                                        <button 
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-2 group p-1 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#330020] flex items-center justify-center text-[#F6F1EB] text-[10px] font-bold tracking-wider group-hover:scale-[1.04] transition-all duration-300">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-[11px] font-semibold text-[#330020] uppercase tracking-[2px] hidden sm:block transition-colors duration-300">
                                                {user.name.split(' ')[0]}
                                            </span>
                                            <ChevronDown size={12} className={`text-[#330020]/60 transition-transform duration-300 group-hover:text-[#330020] ${isProfileOpen ? 'rotate-180' : ''}`} />
                                        </button>
     
                                        <AnimatePresence>
                                            {isProfileOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-3 w-56 bg-[#F6F1EB]/90 backdrop-blur-xl rounded-2xl p-2 shadow-[0_20px_40px_rgba(51,0,32,0.08)] border border-[#330020]/10 z-50"
                                                >
                                                    <Link 
                                                        to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                                        onClick={() => setIsProfileOpen(false)}
                                                        className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[#330020]/5 hover:text-[#330020] transition-all text-[#330020]/70"
                                                    >
                                                        <LayoutDashboard size={14} strokeWidth={1.5} />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">
                                                            {user.role === 'admin' ? 'Admin Panel' : 'My Portfolio'}
                                                        </span>
                                                    </Link>
                                                    <div className="h-[1px] bg-[#330020]/10 my-1 mx-2"></div>
                                                    <button 
                                                        onClick={() => { logout(); navigate('/login'); }}
                                                        className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:bg-red-500/5 transition-all text-red-500/80 hover:text-red-500 cursor-pointer"
                                                    >
                                                        <LogOut size={14} strokeWidth={1.5} />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Logout</span>
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link to="/login">
                                        <button className="border border-[#330020]/20 hover:border-[#330020] bg-transparent hover:bg-[#330020] text-[#330020] hover:text-[#F6F1EB] px-6 py-2.5 rounded-none text-[11px] font-semibold uppercase tracking-[3px] transition-all duration-300 cursor-pointer">
                                            Sign In
                                        </button>
                                    </Link>
                                )}
                            </div>
 
                            {/* Mobile Menu Toggle (Always Visible on Mobile) */}
                            <button 
                                className="lg:hidden text-primary cursor-pointer p-1"
                                onClick={() => setIsMobileMenuOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
 
            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 z-[100] bg-[#F6F1EB]/95 backdrop-blur-2xl flex flex-col p-8 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-12 mt-2">
                            <div className="flex items-center gap-3 text-[#330020]">
                                <img src={logo} alt="Indian Furniture Mart" className="w-10 h-10 object-cover rounded-lg shadow-sm border border-[#330020]/10" />
                                <span className="text-xl font-serif font-bold tracking-tight">Indian Furniture Mart</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#330020] hover:rotate-90 transition-transform duration-300">
                                <X size={28} strokeWidth={1.5} />
                            </button>
                        </div>
                        
                        {/* Primary Nav */}
                        <div className="flex flex-col gap-6 mb-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-3xl md:text-4xl font-serif text-[#330020] hover:text-[#8A8F68] transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        
                        {/* Secondary Actions */}
                        <div className="flex flex-col gap-6 py-8 border-t border-[#330020]/10">
                            <Link 
                                to="/dashboard" 
                                onClick={(e) => {
                                    setIsMobileMenuOpen(false);
                                    if (!user) {
                                        e.preventDefault();
                                        toast('Please sign in to access your personalized consultation list.', {
                                            icon: '🔒',
                                            style: {
                                                background: '#F6F1EB',
                                                color: '#330020',
                                                border: '1px solid rgba(51, 0, 32, 0.1)',
                                                borderRadius: '100px',
                                                padding: '12px 24px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em'
                                            }
                                        });
                                        navigate('/login', { state: { from: location } });
                                    }
                                }} 
                                className="flex items-center gap-4 text-[#330020]/80 hover:text-[#330020] group"
                            >
                                <Heart size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold uppercase tracking-widest">Wishlist</span>
                            </Link>
                            
                            <button onClick={() => { setIsMobileMenuOpen(false); openDrawer(); }} className="flex items-center gap-4 text-[#330020]/80 hover:text-[#330020] group text-left">
                                <div className="relative">
                                    <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                    {items.length > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#8A8F68] text-[#F6F1EB] text-[9px] font-bold rounded-full flex items-center justify-center border border-[#F6F1EB]">
                                            {items.length}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-bold uppercase tracking-widest">Enquiry List</span>
                            </button>
                            
                            {user && (
                                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-[#330020]/80 hover:text-[#330020] group">
                                    <div className="w-6 h-6 rounded-full bg-[#330020] text-[#F6F1EB] flex items-center justify-center text-[10px] font-bold group-hover:bg-[#8A8F68] transition-colors">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-widest">My Account</span>
                                </Link>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-auto pt-8 border-t border-[#330020]/10 flex flex-col gap-4">
                            {user ? (
                                <button 
                                    onClick={() => { setIsMobileMenuOpen(false); logout(); navigate('/login'); }} 
                                    className="flex items-center gap-4 text-red-500/80 hover:text-red-500 group"
                                >
                                    <LogOut size={20} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Secure Logout</span>
                                </button>
                            ) : (
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="flex items-center gap-4 text-[#330020] hover:text-[#8A8F68] group"
                                >
                                    <User size={20} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Account Login</span>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

import React, { useContext, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Layout = ({ children, title, subtitle }) => {
    const { user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const isAdmin = user?.role === 'admin' && location.pathname.startsWith('/admin');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className={`min-h-screen bg-surface flex flex-col font-sans selection:bg-primary selection:text-[#FAF6F0]`}>
            {isAdmin ? (
                <div className="flex min-h-screen bg-[#F6F1EB] overflow-x-hidden relative">
                    {/* Admin Sidebar Toggle Overlay */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 bg-[#330020]/10 backdrop-blur-sm z-[70] lg:hidden"
                            />
                        )}
                    </AnimatePresence>

                    {/* Sidebar Component */}
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    
                    {/* Main Admin Content */}
                    <main className="flex-1 w-full lg:w-[calc(100%-20rem)] lg:ml-80 transition-all duration-500 min-h-screen flex flex-col">
                        {/* Admin Top Header */}
                        <header className="sticky top-0 z-[60] bg-[#F6F1EB]/85 backdrop-blur-xl border-b border-[#330020]/08 px-4 sm:px-6 md:px-8 py-4 md:py-6">
                            <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                                    <button 
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="lg:hidden p-3 hover:bg-[#330020]/5 rounded-2xl text-[#330020] transition-colors"
                                    >
                                        <Menu size={24} />
                                    </button>
                                    
                                    <div className="flex flex-col min-w-0">
                                        <p className="font-sans text-[8px] sm:text-[9px] md:text-[11px] font-bold text-[#8A8F68] uppercase tracking-[2px] md:tracking-[4px] mb-1 sm:mb-1.5 leading-none truncate">
                                            {subtitle || 'SYSTEM MANAGEMENT'}
                                        </p>
                                        <h1 className="font-serif text-lg sm:text-2xl md:text-3xl lg:text-[42px] font-semibold text-[#330020] tracking-[-1px] leading-tight truncate">
                                            {title || 'Admin Dashboard'}
                                        </h1>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                    <Link to="/home" className="hidden sm:block text-[10px] font-bold text-[#330020]/60 hover:text-[#330020] uppercase tracking-widest px-4 py-2 border border-[#330020]/10 rounded-full transition-all">
                                        View Site
                                    </Link>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#330020]/5 flex items-center justify-center text-[#330020] border border-[#330020]/10">
                                        <span className="text-xs font-bold">{user?.name?.charAt(0)}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1400px] w-full mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {children}
                            </motion.div>
                        </div>
                    </main>
                </div>
            ) : (
                <>
                    <Navbar />
                    <main className="flex-1 transition-all duration-300">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                    <Footer />
                </>
            )}
        </div>
    );
};

export default Layout;


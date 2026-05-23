import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeImage from '../../components/common/SafeImage';
import SEO from '../../components/common/SEO';
import { motion } from 'framer-motion';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPaginated, setIsPaginated] = useState(false);

    const itemsPerPage = 8;
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleLoadMore = () => {
        setIsPaginated(false);
        setVisibleCount(prev => Math.min(prev + 4, categories.length));
    };

    const handlePageClick = (page) => {
        setIsPaginated(true);
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setIsPaginated(true);
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setIsPaginated(true);
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const displayedCategories = isPaginated 
        ? categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        : categories.slice(0, visibleCount);

    return (
        <Layout>
            <SEO 
                title="Bespoke Curation Categories | Indian Furniture Mart Luxury" 
                description="Browse our hand-selected furniture categories including Living Room, Bedroom, and Dining Room."
            />
            <div className="min-h-screen bg-[#F6F1EB] pt-32 pb-24 text-[#330020]">
                <div className="max-w-[1600px] mx-auto px-10 md:px-[40px]">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="w-8 h-[1px] bg-[#8A8F68]/40" />
                            <span className="text-[#8A8F68] font-bold uppercase tracking-[0.4em] text-[9px]">Luxury Clients</span>
                            <div className="w-8 h-[1px] bg-[#8A8F68]/40" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#330020] mb-6 tracking-tight leading-[1.1] italic">
                            Select a Curated <span className="italic font-light text-[#8A8F68]">Mart.</span>
                        </h1>
                        <p className="text-[#330020]/72 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-light">
                            Explore our bespoke catalog by room and architectural space. Each section highlights handpicked, custom-crafted Indian luxury.
                        </p>
                    </div>

                    {loading ? (
                        <div className="py-32 flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-[#8A8F68] mb-6" size={40} />
                            <p className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.3em]">Opening luxury catalog...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="py-24 text-center max-w-md mx-auto">
                            <p className="text-[#330020]/48 text-sm italic mb-4">No marts currently open.</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/30">Please check back soon as our curators select new pieces.</p>
                        </div>
                    ) : (
                        <>
                            {/* High-density 4-column editorial mart grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto">
                                {displayedCategories.map((cat, i) => (
                                    <motion.div
                                        key={`cat-${cat._id || i}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: (i % itemsPerPage) * 0.05, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                                        className="group block"
                                    >
                                        <Link to={`/category/${cat.slug || cat._id}`} className="group flex flex-col justify-between min-h-[485px] rounded-[32px] overflow-hidden bg-white/55 backdrop-blur-[8px] border border-[#330020]/15 hover:border-[#330020]/30 shadow-[0_10px_30px_rgba(51,0,32,0.06)] hover:shadow-[0_20px_50px_rgba(51,0,32,0.12)] hover:-translate-y-2 transition-all duration-[450ms] ease-out">
                                            {/* Image Section (Top) with luxury spacing and rounded border */}
                                            <div className="pt-[14px] px-[14px] w-full">
                                                <div className="relative h-[220px] rounded-[28px] overflow-hidden bg-[#F6F1EB]">
                                                    <SafeImage 
                                                        src={cat.image?.url || cat.image} 
                                                        alt={cat.name} 
                                                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                                                    />
                                                </div>
                                            </div>

                                            {/* Dedicated Bottom Content Area - Warm Ivory Backdrop with clean typography */}
                                            <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                                                <div className="space-y-2">
                                                    <span className="font-sans text-[9px] md:text-[10px] font-semibold tracking-[2px] uppercase text-[#8A8F68] block">
                                                        Mart Collection
                                                    </span>
                                                    <h3 className="font-sans text-[20px] md:text-[22px] font-semibold leading-[1.3] text-[#330020] tracking-tight">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="font-sans text-[13px] font-normal leading-[1.6] text-[#330020]/58 line-clamp-3">
                                                        {cat.description || 'Editorial Indian craftsmanship curated for premium modern homes.'}
                                                    </p>
                                                </div>
                                                
                                                {/* Bottom CTA Area with premium divider above */}
                                                <div className="border-t border-[#330020]/08 pt-4">
                                                    <div className="inline-flex items-center gap-[8px] py-2.5 px-[16px] rounded-full bg-[#330020]/05 text-[#330020] group-hover:bg-[#330020] group-hover:text-[#F6F1EB] transition-all duration-[350ms] ease-out font-sans text-[10px] font-bold uppercase tracking-[3px]">
                                                        <span>Explore Mart</span>
                                                        <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Elegant Progressive Load & Pagination Controls */}
                            <div className="mt-16 flex flex-col items-center gap-8">
                                {/* Load More Button */}
                                {!isPaginated && visibleCount < categories.length && (
                                    <button 
                                        onClick={handleLoadMore}
                                        className="bg-[#330020] text-[#F6F1EB] hover:bg-[#4A1838] hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(51,0,32,0.15)] rounded-full py-4 px-[34px] tracking-[4px] text-[11px] uppercase font-bold transition-all duration-[350ms] ease-out cursor-pointer border-none"
                                    >
                                        Load More Collections
                                    </button>
                                )}

                                {/* Optional Pagination Rail */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 bg-[#330020]/05 p-1.5 rounded-full border border-[#330020]/05 shadow-sm">
                                        <button 
                                            onClick={handlePrevPage}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-full text-[#330020] hover:bg-[#330020]/05 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 border-none bg-transparent cursor-pointer"
                                        >
                                            &lt; Previous
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, idx) => {
                                            const pageNum = idx + 1;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageClick(pageNum)}
                                                    className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center transition-all duration-300 border-none cursor-pointer ${
                                                        currentPage === pageNum && isPaginated
                                                            ? 'bg-[#330020] text-[#F6F1EB] shadow-md' 
                                                            : 'bg-transparent text-[#330020] hover:bg-[#330020]/10'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        
                                        <button 
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded-full text-[#330020] hover:bg-[#330020]/05 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 border-none bg-transparent cursor-pointer"
                                        >
                                            Next &gt;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Categories;

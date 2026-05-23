import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import SafeImage from '../common/SafeImage';

const CategorySlider = ({ categories, loading }) => {
    const [displayLimit, setDisplayLimit] = useState(10);

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + 5);
    };

    if (loading) {
        return (
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-12 py-10">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] bg-black/[0.03] animate-pulse rounded-[2rem]" 
                    />
                ))}
            </div>
        );
    }

    const visibleCategories = categories.slice(0, displayLimit);

    return (
        <div className="relative group/slider w-full max-w-7xl mx-auto">
            <div className="flex flex-col gap-12">
                
                {/* Centered Flex Layout for Categories */}
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-10 lg:gap-12 pb-4 px-4">
                    <AnimatePresence mode='popLayout'>
                        {visibleCategories.map((cat, i) => (
                            <motion.div
                                key={`cat-slider-${cat._id || i}`}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ 
                                    delay: i * 0.1, 
                                    duration: 0.8, 
                                    ease: [0.22, 1, 0.36, 1] 
                                }}
                                className="flex-shrink-0"
                            >
                                <Link 
                                    to={`/products?category=${cat._id}`}
                                    className="group block flex flex-col items-center"
                                >
                                    <div className="w-[140px] h-[140px] sm:w-[150px] sm:h-[150px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] rounded-[2rem] overflow-hidden bg-[rgba(255,255,255,0.18)] border border-primary/10 mb-6 transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:border-[#330020]/30 group-hover:shadow-[0_20px_40px_rgba(51,0,32,0.15)] relative">
                                        <div className="absolute inset-0 w-full h-full">
                                            <SafeImage 
                                                src={cat.image?.url || cat.image} 
                                                alt={cat.name} 
                                                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110" 
                                            />
                                        </div>
                                        {/* Subtle overlay for luxury feel */}
                                        <div className="absolute inset-0 bg-[#330020]/0 group-hover:bg-[#330020]/5 transition-colors duration-500 pointer-events-none" />
                                    </div>
                                    <div className="text-center px-2">
                                        <h3 className="font-sans text-[10px] md:text-[11px] font-semibold text-[#8A8F68] uppercase tracking-[0.3em] group-hover:text-[#330020] transition-colors duration-500">
                                            {cat.name}
                                        </h3>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {displayLimit < categories.length && (
                    <div className="flex justify-center -mt-2">
                        <button 
                            onClick={handleLoadMore}
                            className="group flex items-center gap-6 py-4 px-10 rounded-full bg-[#330020] text-[#F6F1EB] hover:bg-[#4A012E] hover:shadow-[0_10px_25px_rgba(74,1,46,0.35)] transition-all duration-500 shadow-sm active:scale-95 cursor-pointer"
                        >
                            <span className="font-sans text-[11px] font-bold uppercase tracking-[4px]">More Collections</span>
                            <div className="w-8 h-8 rounded-full bg-[#F6F1EB]/10 flex items-center justify-center text-[#F6F1EB] group-hover:bg-white/20 group-hover:text-[#F6F1EB] transition-all">
                                <Plus size={14} />
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySlider;

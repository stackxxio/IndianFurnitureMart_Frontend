import React from 'react';

const Badge = ({ children, variant = 'neutral', className = '' }) => {
    const variants = {
        primary: 'bg-primary text-[#FAF6F0]',
        secondary: 'bg-primary/5 text-primary border border-white/[0.05]',
        success: 'bg-green-500/10 text-green-600 border border-green-500/10',
        warning: 'bg-accent/10 text-accent border border-accent/10',
        neutral: 'bg-black/[0.03] text-primary/40 border border-white/[0.03]',
        outline: 'bg-transparent border border-black/10 text-primary/60'
    };

    return (
        <span className={`
            px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center justify-center whitespace-nowrap transition-all duration-300
            ${variants[variant] || variants.neutral}
            ${className}
        `}>
            {children}
        </span>
    );
};

export default Badge;

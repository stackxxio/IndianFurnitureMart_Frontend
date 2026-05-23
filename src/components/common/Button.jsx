import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
    children, 
    variant = 'primary', 
    className = '', 
    onClick, 
    type = 'button',
    disabled = false,
    icon: Icon,
    loading = false
}) => {
    const variants = {
        primary: 'btn-luxury primary',
        outline: 'btn-luxury outline',
        ghost: 'btn-luxury ghost',
        glass: 'glass px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#330020] hover:text-[#F6F1EB] transition-all duration-500'
    };

    return (
        <motion.button
            whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${variants[variant] || variants.primary} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <>
                    {Icon && <Icon size={16} className="shrink-0" />}
                    {children}
                </>
            )}
        </motion.button>
    );
};

export default Button;

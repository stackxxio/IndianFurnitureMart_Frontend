import React from 'react';

const Input = ({ 
    label, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    error, 
    name,
    className = '',
    required = false,
    ...props
}) => {
    return (
        <div className={`flex flex-col gap-2 w-full ${className} text-[#330020]`}>
            {label && (
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 ml-1">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`
                    w-full px-6 py-4 bg-white/80 border rounded-2xl transition-all duration-300
                    text-sm font-medium placeholder:text-[#330020]/30 text-[#330020]
                    focus:outline-none focus:ring-4 focus:ring-[#330020]/5
                    ${error ? 'border-red-300 focus:border-red-400' : 'border-[#330020]/10 focus:border-[#330020]/30'}
                `}
                {...props}
            />
            {error && <span className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider">{error}</span>}
        </div>
    );
};

export default Input;

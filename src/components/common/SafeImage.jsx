import React, { useState, useEffect, useRef } from 'react';
import { Package, Loader2 } from 'lucide-react';

const SafeImage = ({ src, alt, className }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [imgSrc, setImgSrc] = useState(src);
    const imgRef = useRef(null);

    useEffect(() => {
        let finalSrc = src;

        // Auto-repair for split Base64 strings (corruption from previous bug)
        if (Array.isArray(src) && src.length >= 2 && typeof src[0] === 'string' && src[0].startsWith('data:')) {
            // If it's an array and the first part is the data header, rejoin the whole thing
            finalSrc = src.join(',');
            
            if (finalSrc.includes(',,')) {
                finalSrc = finalSrc.replace(/,,/g, ',');
            }
        } else if (Array.isArray(src)) {
            finalSrc = typeof src[0] === 'string' ? src[0] : (src[0]?.url || '');
        } else if (src && typeof src === 'object') {
            finalSrc = src.url || '';
        }

        if (!finalSrc) {
            setError(true);
            setLoading(false);
            return;
        }
        
        setImgSrc(finalSrc);
        setError(false);
        setLoading(true);

        // Check if image is already cached/loaded
        if (imgRef.current && imgRef.current.complete) {
            setLoading(false);
        }

        // Safety timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            setLoading(prev => {
                if (prev) {
                    setError(true);
                    return false;
                }
                return false;
            });
        }, 5000);

        return () => clearTimeout(timeout);
    }, [src]);

    const handleError = () => {
        setError(true);
        setLoading(false);
    };

    const handleLoad = () => {
        setLoading(false);
        setError(false);
    };

    if (error || !imgSrc) {
        return (
            <div className={`flex flex-col items-center justify-center bg-slate-100 text-slate-300 ${className}`}>
                <Package size={48} className="mb-2 opacity-50" />
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Preview</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                    <Loader2 className="animate-spin text-primary/30" size={24} />
                </div>
            )}
            <img
                ref={imgRef}
                src={imgSrc}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                loading="lazy"
                className={`w-full h-full object-cover transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
            />
        </div>
    );
};

export default SafeImage;

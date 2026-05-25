import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Star, MoveRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Premium high-end architectural/interior showcase images for fallbacks if database seeds are unrelated test entries
const CURATED_ICONIC_IMAGES = [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=70&w=350", // Architectural side table / luxury interior
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=70&w=350", // High-end sideboard / cabinet
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=70&w=350", // Luxury velvet armchair
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=70&w=350", // Premium sofa lounge
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=70&w=350", // Curated luxury bedroom lounge
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=70&w=350", // Modern architectural living space
    "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=70&w=350", // Luxury dining room
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=70&w=350"  // Minimalist modernist wooden chair
];

// Injects compression CDN configurations directly to Unsplash URLs to keep payloads under 30KB
const getOptimizedUrl = (url) => {
    if (!url) return '';
    if (url.includes('unsplash.com')) {
        let optimized = url;
        if (optimized.includes('w=')) {
            optimized = optimized.replace(/w=\d+/g, 'w=350');
        } else {
            optimized += '&w=350';
        }
        if (optimized.includes('q=')) {
            optimized = optimized.replace(/q=\d+/g, 'q=70');
        } else {
            optimized += '&q=70';
        }
        return optimized;
    }
    return url;
};

// Checks if the database product has placeholder/unrelated test strings or missing fields
const isTestOrUnrelated = (product) => {
    const imageUrl = (product.images?.[0]?.url || product.image || '').toLowerCase();
    const name = (product.name || '').toLowerCase();
    
    return (
        imageUrl.includes('flower') || 
        imageUrl.includes('sunflower') || 
        imageUrl.includes('car') || 
        imageUrl.includes('perfume') || 
        imageUrl.includes('bottle') || 
        imageUrl.includes('decor-test') ||
        imageUrl.includes('placeholder') ||
        imageUrl.includes('test') ||
        imageUrl.includes('nike') ||
        imageUrl.includes('shoe') ||
        imageUrl.includes('toy') ||
        imageUrl.includes('tshirt') ||
        name.includes('addff') || 
        name.includes('sadscd') || 
        name.includes('tcfd') || 
        name.includes('ebce') || 
        name.includes('sfd') ||
        name.includes('test') ||
        name.length < 4
    );
};

const getProductImage = (product, index) => {
    if (isTestOrUnrelated(product)) {
        return CURATED_ICONIC_IMAGES[index % CURATED_ICONIC_IMAGES.length];
    }
    return product.images?.[0]?.url || product.image || CURATED_ICONIC_IMAGES[0];
};

const getProductName = (product, index) => {
    if (isTestOrUnrelated(product)) {
        const names = [
            "Architectural Ash Sideboard",
            "Minimalist Teak Side Table",
            "Luxury Velvet Club Chair",
            "Deep Olive Mart Sofa",
            "Crafted Heritage Credenza",
            "Architectural Lounge Console",
            "Editorial Handcrafted Dining Table",
            "Modernist Teak Armchair"
        ];
        return names[index % names.length];
    }
    return product.name;
};

// Progressive Image Loader with 20px blurred previews and GPU-accelerated fade-ins
const ProgressiveImage = React.memo(({ src, alt }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [blurSrc, setBlurSrc] = useState('');

    useEffect(() => {
        if (!src) return;
        if (src.includes('unsplash.com')) {
            let tiny = src;
            if (tiny.includes('w=')) {
                tiny = tiny.replace(/w=\d+/g, 'w=20');
            } else {
                tiny += '&w=20';
            }
            if (tiny.includes('q=')) {
                tiny = tiny.replace(/q=\d+/g, 'q=10');
            } else {
                tiny += '&q=10';
            }
            setBlurSrc(tiny);
        } else {
            setBlurSrc('data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D\'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\' viewBox%3D\'0 0 4 5\'%3E%3Crect width%3D\'4\' height%3D\'5\' fill%3D\'%23F4EFEA\'%2F%3E%3C%2Fsvg%3E');
        }
        setIsLoaded(false);
    }, [src]);

    return (
        <div className="relative w-full h-full bg-surface overflow-hidden">
            {blurSrc && (
                <img
                    src={blurSrc}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover blur-sm scale-105 pointer-events-none transition-opacity duration-300 z-0 ${
                        isLoaded ? 'opacity-0' : 'opacity-100'
                    }`}
                />
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                ref={(el) => {
                    if (el && el.complete) {
                        setIsLoaded(true);
                    }
                }}
                className={`w-full h-full object-cover transition-all duration-500 ease-out will-change-transform z-10 group-hover/card:scale-[1.02] ${
                    isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
                }`}
            />
        </div>
    );
});

// React.memoized Product Card Component to prevent scroll paint CPU cycles
const ProductCard = React.memo(({ product, index, getProductName, getProductImage }) => {
    const productName = getProductName(product, index);
    const rawImage = getProductImage(product, index);
    const optimizedImage = getOptimizedUrl(rawImage);

    return (
        <div className="snap-start flex-shrink-0 w-full sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)]">
            <Link 
                to={`/products/${product.slug || product._id}`}
                className="relative block group/card"
            >
                {/* Spacious premium height: mobile h-[395px], desktop md:h-[465px] with custom borders, shadow, and radius */}
                <div 
                    className="w-full h-[395px] md:h-[465px] overflow-hidden bg-white/72 backdrop-blur-[6px] hover:-translate-y-[6px] border border-[rgba(51,0,32,0.08)] hover:border-[rgba(51,0,32,0.18)] shadow-[0_10px_30px_rgba(51,0,32,0.05)] hover:shadow-[0_18px_45px_rgba(51,0,32,0.10)] transition-all duration-400 ease-out flex flex-col justify-between rounded-[28px] will-change-transform"
                >
                    {/* Image Area - nested inside 14px padding to create luxury framing */}
                    <div className="pt-3.5 px-3.5 w-full h-[58%]">
                        <div className="relative w-full h-full overflow-hidden rounded-[24px] border border-white/[0.06] bg-[#F6F1EB]">
                            <ProgressiveImage src={optimizedImage} alt={productName} />
                            
                            {product.isIconic && (
                                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[#F6F1EB]/80 text-[#8A8F68] flex items-center justify-center shadow-soft border border-[#330020]/10 z-20">
                                    <Sparkles size={10} className="text-[#8A8F68]" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Area - Fixed 42% Height with refined padding to avoid overflow */}
                    <div className="p-5 md:p-6 flex flex-col justify-between h-[42%] bg-transparent">
                        <div className="space-y-1.5 md:space-y-2">
                            <span 
                                className="font-sans text-[9px] md:text-[10px] font-semibold uppercase tracking-[2px] block text-[#8A8F68]"
                            >
                                {product.category?.name || 'Exclusive Curation'}
                            </span>
                            
                            {/* Title - Elegant font-sans sizes with line clamp */}
                            <h3 
                                className="font-sans text-[18px] md:text-[20px] font-semibold leading-[1.35] tracking-[-0.2px] text-[#330020] line-clamp-2 h-[2.5rem] md:h-[2.8rem] overflow-hidden"
                            >
                                {productName}
                            </h3>
                            
                            {/* Inline Rating System */}
                            <div className="flex items-center gap-1 h-4">
                                {product.totalReviews > 0 ? (
                                    <div className="flex items-center gap-1.5 font-sans text-[10px] text-[rgba(51,0,32,0.55)]">
                                        <Star size={9} className="text-[#8A8F68] shrink-0" fill="currentColor" />
                                        <span>{product.averageRating?.toFixed(1)}</span>
                                        <span className="text-[#330020]/48">({product.totalReviews})</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 font-sans text-[10px] font-semibold tracking-[2px] uppercase text-[#8A8F68]">
                                        <Star size={9} className="text-[#8A8F68]/60 shrink-0" fill="currentColor" />
                                        <span>New Curation</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Block with luxury top border divider */}
                        <div className="pt-3 md:pt-4 border-t border-[rgba(51,0,32,0.08)] flex items-end justify-between">
                            <div className="flex flex-col min-w-0">
                                <span className="font-sans text-[8px] md:text-[9px] font-semibold tracking-[2px] uppercase text-[#8A8F68] leading-none mb-1.5">Curation Price</span>
                                <div className="flex items-baseline gap-1 md:gap-1.5">
                                    {product.showPrice !== false ? (
                                        <>
                                            <span className="font-sans text-[22px] md:text-[24px] font-bold text-[#330020] leading-none">
                                                ₹{product.price?.toLocaleString('en-IN')}
                                            </span>
                                            {product.originalPrice > product.price && (
                                                <span className="font-sans text-[12px] opacity-45 line-through leading-none text-[#330020]">
                                                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-accent leading-none py-1">
                                            Price on Request
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Minimal Luxury Explore CTA */}
                            <div className="inline-flex items-center gap-1.5 font-sans text-[10px] font-bold uppercase tracking-[3px] text-[#330020] group-hover/card:text-[#4A1838] transition-colors duration-300 shrink-0">
                                <span>Explore</span>
                                <span className="inline-block transform transition-transform duration-300 group-hover/card:translate-x-[3px]">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
});

const IconicSlider = ({ products, loading }) => {
    const scrollRef = useRef(null);
    const [visibleCount, setVisibleCount] = useState(4); // Render exactly 4 products initially so they fit desktop perfectly on start

    // GPU-accelerated vertical to horizontal mouse-wheel scroll listener
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // Allow native trackpad horizontal scrolling
            e.preventDefault();
            el.scrollLeft += e.deltaY * 0.85;
        };

        el.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            el.removeEventListener('wheel', handleWheel);
        };
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => Math.min(prev + 4, displayProducts.length));
        
        // Wait for render, then scroll to smoothly reveal new cards
        setTimeout(() => {
            if (scrollRef.current) {
                const cardWidth = scrollRef.current.querySelector('.snap-start')?.offsetWidth || 300;
                scrollRef.current.scrollTo({
                    left: scrollRef.current.scrollLeft + (cardWidth * 2),
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    if (loading) {
        return (
            <div className="flex gap-6 overflow-hidden py-6 px-6 md:px-8 lg:px-12 max-w-[1600px] mx-auto">
                {[...Array(4)].map((_, i) => (
                    <div 
                        key={i} 
                        className="w-full sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] flex-shrink-0 h-[395px] md:h-[465px] bg-surface animate-pulse rounded-[18px] border border-black/[0.06]" 
                    />
                ))}
            </div>
        );
    }

    const iconicProducts = products.filter(product => product.isIconic);
    const displayProducts = iconicProducts.length > 0 ? iconicProducts : products;
    const visibleProducts = displayProducts.slice(0, visibleCount);

    return (
        <div className="space-y-12 w-full overflow-hidden">
            <div className="relative w-full max-w-[1600px] mx-auto overflow-hidden">
                {/* Scrollsnap horizontal slider with custom snap coordinates and elegant padded boundaries */}
                <div 
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-6 px-6 md:px-8 lg:px-12 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                    {visibleProducts.map((product, i) => (
                        <ProductCard 
                            key={`iconic-${product._id || i}`} 
                            product={product} 
                            index={i} 
                            getProductName={getProductName} 
                            getProductImage={getProductImage} 
                        />
                    ))}
                </div>
            </div>

            {/* Bottom CTA Block */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 pt-4">
                {visibleCount < displayProducts.length && (
                    <button
                        onClick={handleLoadMore}
                        className="px-12 py-5 rounded-full bg-[#330020] text-[#F6F1EB] text-[9px] font-bold uppercase tracking-[0.4em] transition-all duration-500 hover:bg-[#4A012E] hover:shadow-[0_10px_25px_rgba(74,1,46,0.35)] shadow-sm active:scale-98 cursor-pointer border-none"
                    >
                        Load More Collections
                    </button>
                )}
                <Link 
                    to="/collections?filter=iconic" 
                    className="group inline-flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] text-[#330020] hover:text-[#4A012E] transition-all duration-500 pb-2 relative overflow-hidden"
                >
                    <span>View All Iconic Showcase</span>
                    <MoveRight size={18} className="group-hover:translate-x-3 transition-transform duration-500 text-[#4A012E]" />
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#330020]/10 group-hover:bg-[#4A012E] transition-colors duration-500" />
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#4A012E] group-hover:w-full transition-all duration-500" />
                </Link>
            </div>
        </div>
    );
};

export default IconicSlider;

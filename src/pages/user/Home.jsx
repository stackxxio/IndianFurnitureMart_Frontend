import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRight, 
    Globe,
    Award,
    Sparkles,
    History,
    MoveRight,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import CategorySlider from '../../components/home/CategorySlider';
import IconicSlider from '../../components/home/IconicSlider';
import TrendingSlider from '../../components/home/TrendingSlider';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeHero, setActiveHero] = useState(0);

    const heroSlides = [
        {
            image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920',
            title: 'Modern Indian Antiquity',
            subtitle: 'THE ARCHITECTURAL SERIES',
            desc: 'Where century-old Indian joinery meets the clean lines of international luxury design. Engineered for the sophisticated home.'
        },
        {
            image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1920',
            title: 'Handcrafted Heritage.',
            subtitle: 'OUR STORY',
            desc: 'Ethically harvested solid teak, hand-finished with natural oils to preserve the timber’s living spirit.'
        }
    ];

    useEffect(() => {
        // Delay preloading hero images so it doesn't block the initial intro animation frames
        const preloadTimer = setTimeout(() => {
            heroSlides.forEach((slide) => {
                const img = new window.Image();
                img.src = slide.image;
            });
        }, 2000);

        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes, aboutRes] = await Promise.all([
                    api.get('/products/featured'),
                    api.get('/categories'),
                    api.get('/about').catch(() => null)
                ]);
                setFeaturedProducts(productsRes.data);
                setCategories(categoriesRes.data);
                if (aboutRes) setAboutData(aboutRes.data);
            } catch (error) {
                console.error('Error fetching data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const timer = setInterval(() => {
            setActiveHero((prev) => (prev + 1) % heroSlides.length);
        }, 10000);
        return () => {
            clearInterval(timer);
            clearTimeout(preloadTimer);
        };
    }, []);

    const currentSlide = heroSlides[activeHero] || heroSlides[0];

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
    };

    return (
        <Layout>


            <SEO 
                title="Indian Furniture Mart — Premium Luxury Furniture & Interior Collections"
                description="Explore handcrafted furniture, elegant interiors, and curated modern living collections from Indian Furniture Mart."
            />
            {/* Section 1: Cinematic Full-Screen Hero */}
            <section className="relative h-[100vh] min-h-[600px] w-full flex items-center justify-center lg:justify-start overflow-hidden bg-[#1A0010]">
                {/* Background Image Carousel */}
                <div className="absolute inset-0 z-0 bg-[#1A0010]">
                    {heroSlides.map((slide, index) => (
                        <div 
                            key={index}
                            className="absolute inset-0 w-full h-full"
                            style={{
                                opacity: activeHero === index ? 1 : 0,
                                zIndex: activeHero === index ? 1 : 0,
                                transition: 'opacity 1.8s ease-in-out',
                                backfaceVisibility: 'hidden',
                                transform: 'translateZ(0)',
                                contain: 'paint',
                                willChange: 'opacity, transform'
                            }}
                        >
                            <motion.img 
                                initial={false}
                                animate={{ scale: activeHero === index ? 1.1 : 1 }}
                                transition={{ duration: 25, ease: "linear" }}
                                src={slide.image} 
                                alt={`Luxury Furniture ${index + 1}`} 
                                className="w-full h-full object-cover object-center absolute inset-0" 
                                style={{
                                    backfaceVisibility: 'hidden',
                                    transform: 'translateZ(0)',
                                    willChange: 'transform'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Overlays for Readability and Depth */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1A0010]/80 via-[#1A0010]/40 to-transparent" />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#1A0010]/90 via-transparent to-[#1A0010]/30 opacity-70" />
                
                {/* Navbar Contrast Gradient */}
                <div className="absolute top-0 left-0 right-0 h-48 z-10 bg-gradient-to-b from-[#F6F1EB]/90 via-[#F6F1EB]/40 to-transparent pointer-events-none" />

                {/* Main Content */}
                <div className="container mx-auto px-6 lg:px-12 relative z-20 pt-24 lg:pt-32">
                    <motion.div
                        key={`hero-text-${activeHero}`}
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { 
                                opacity: 1,
                                transition: { staggerChildren: 0.15, delayChildren: 0.3 } 
                            }
                        }}
                        className="max-w-3xl text-center lg:text-left mx-auto lg:mx-0"
                    >
                        {/* Subtitle */}
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, x: -30 },
                                visible: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.3, duration: 1.2 } }
                            }}
                            className="flex items-center justify-center lg:justify-start gap-4 mb-6 md:mb-8"
                        >
                            <div className="w-12 h-[1px] bg-[#8A8F68]" />
                            <span className="text-[#8A8F68] font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs">
                                {currentSlide.subtitle}
                            </span>
                            <div className="w-12 h-[1px] bg-[#8A8F68] lg:hidden" />
                        </motion.div>

                        {/* Title */}
                        <motion.h1 
                            variants={{
                                hidden: { opacity: 0, x: -60 },
                                visible: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.3, duration: 1.2 } }
                            }}
                            className="text-4xl sm:text-5xl md:text-7xl lg:text-[7rem] font-serif text-[#F6F1EB] leading-[1] tracking-tighter mb-6 md:mb-8 drop-shadow-2xl"
                        >
                            {currentSlide.title.split(' ')[0]} <br className="hidden md:block" />
                            <span className="italic font-light text-[#F6F1EB]/90">
                                {currentSlide.title.split(' ').slice(1).join(' ')}
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p 
                            variants={{
                                hidden: { opacity: 0, x: -40 },
                                visible: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.3, duration: 1.2 } }
                            }}
                            className="text-base md:text-xl text-[#F6F1EB]/80 mb-10 md:mb-12 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed drop-shadow-md"
                        >
                            {currentSlide.desc}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3, duration: 1.2 } }
                            }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
                        >
                            <Link to="/products" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-[#330020] text-[#F6F1EB] px-12 py-5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#4A012E] shadow-[0_8px_30px_rgba(51,0,32,0.5)] hover:-translate-y-1 transition-all duration-500 border border-[#330020] cursor-pointer">
                                    Explore Collection
                                </button>
                            </Link>
                            <Link to="/contact" className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-white/5 backdrop-blur-md text-[#F6F1EB] px-12 py-5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] hover:bg-white/10 border border-white/20 hover:border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                                    Book Consultation
                                </button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Section 2: Curated Collections Slider (Categories) */}
            <section className="bg-surface py-20 md:py-28 relative overflow-hidden">
                <div className="absolute top-20 -left-20 opacity-[0.02] select-none pointer-events-none hidden lg:block text-primary">
                    <span className="text-[12rem] xl:text-[20rem] font-serif font-bold leading-none">COLLECTIONS</span>
                </div>

                <div className="container mx-auto px-6 lg:px-12 relative z-10">
                    <motion.div 
                        {...fadeInUp}
                        className="flex flex-col items-center text-center mb-14"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="flex items-center gap-4 mb-6"
                        >
                            <div className="w-12 h-[1px] bg-accent" />
                            <span className="text-accent font-bold uppercase tracking-[0.5em] text-[10px]">Taxonomy of Elegance</span>
                            <div className="w-12 h-[1px] bg-accent" />
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-primary mb-8 leading-[0.85] tracking-tighter">
                            Curated <span className="italic font-light text-accent">Collections.</span>
                        </h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed font-light">
                            Explore refined furniture categories crafted for modern interiors.
                        </p>
                    </motion.div>

                    <CategorySlider categories={categories} loading={loading} />

                    <div className="mt-16 text-center">
                        <Link to="/categories" className="group inline-flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.5em] text-primary hover:text-[#330020] transition-all duration-700 pb-2 border-b border-white/[0.05] hover:border-[#330020]/30">
                            View Entire Archive <MoveRight size={18} className="group-hover:translate-x-3 transition-transform duration-500" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Section 3: Trending Interiors */}
            <TrendingSlider />

            {/* Section 4: Iconic Collections Slider - Premium Performance Editorial Showcase */}
            <section className="bg-surface py-16 md:py-20 lg:py-24 transition-colors duration-500">
                <div className="container mx-auto px-6 lg:px-12">
                    <motion.div 
                        {...fadeInUp}
                        className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
                    >
                        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-serif text-primary leading-[0.85] tracking-tighter mb-6 italic">
                            Iconic <span className="font-light text-accent not-italic">Collections.</span>
                        </h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Curated statement pieces crafted for refined interiors. Discover the dialogue between material and form.
                        </p>
                    </motion.div>

                    <IconicSlider products={featuredProducts} loading={loading} />
                </div>
            </section>

            {/* Section 5: Heritage & Artisanship Split */}
            <section className="bg-surface py-20 md:py-28 border-t border-primary/10">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <motion.div 
                            {...fadeInUp}
                            className="relative order-2 lg:order-1"
                        >
                            <div className="aspect-[4/5] md:aspect-square rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-premium border border-primary/10">
                                <img src={aboutData?.bannerImage?.url || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000"} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -bottom-10 -right-10 p-10 bg-[#330020] rounded-[3rem] text-[#F6F1EB] shadow-premium hidden lg:block">
                                <History size={32} strokeWidth={1.5} className="mb-6 text-accent" />
                                <p className="text-3xl font-serif mb-2 italic tracking-tight">Est. 1992</p>
                                <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#F6F1EB]/70">Century of Legacy</p>
                            </div>
                        </motion.div>
                        <motion.div 
                            {...fadeInUp}
                            className="order-1 lg:order-2"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-[1px] bg-accent" />
                                <span className="text-accent font-bold uppercase tracking-[0.6em] text-[10px]">OUR STORY</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-primary mb-8 leading-[0.9] tracking-tighter">
                                {aboutData?.storyTitle || "Honoring the"}<br />
                                <span className="italic font-light text-accent">Artisanal Soul.</span>
                            </h2>
                            <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-10 font-light max-w-xl">
                                {aboutData?.storyText || "Our workshop in New Delhi is where ancestral joinery techniques meet high-precision modern engineering. Every piece is hand-finished with natural oils to preserve the living spirit of the solid Burmese teak."}
                            </p>
                            <div className="grid grid-cols-2 gap-10 pt-10 border-t border-primary/10">
                                <div className="flex flex-col gap-4">
                                    <Award size={20} className="text-accent" />
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Master Craftsmen</h4>
                                    <p className="text-[10px] text-primary/48 leading-relaxed uppercase tracking-widest">Generational Wisdom</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Globe size={20} className="text-accent" />
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Global Presence</h4>
                                    <p className="text-[10px] text-primary/48 leading-relaxed uppercase tracking-widest">Shipped to 40+ Countries</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 6: Premium CTA (Custom Interiors) */}
            <section className="relative py-24 md:py-32 bg-[#330020] text-[#F6F1EB] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.02] select-none pointer-events-none">
                    <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920" alt="Texture" className="w-full h-full object-cover grayscale" />
                </div>
                <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="w-10 h-[1px] bg-white/10" />
                            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#8A8F68]">Custom Interiors</span>
                            <div className="w-10 h-[1px] bg-white/10" />
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl text-[#F6F1EB] font-serif mb-8 leading-[1.1] tracking-tighter">
                            Design Spaces That Speak <span className="italic font-light text-accent">Quiet Luxury.</span>
                        </h2>
                        <p className="text-lg md:text-xl text-[#F6F1EB]/72 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                            Partner with our mart for your next custom interior space. We offer dedicated customization support for custom luxury homes, curators, and premium residential spaces.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
                            <Link to="/contact">
                                <button className="bg-[#F6F1EB] text-[#330020] px-14 py-6 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-[#4A012E] hover:text-[#F6F1EB] hover:-translate-y-0.5 transition-all duration-500 shadow-xl cursor-pointer border-none">
                                    Book Consultation
                                </button>
                            </Link>
                            <Link to="/products" className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#F6F1EB]/72 hover:text-[#F6F1EB] transition-colors pb-2 border-b border-transparent hover:border-[#F6F1EB]/30">
                                Explore The Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Section 7: Featured In (Trusted By Global Clients) */}
            <section className="bg-[#F6F1EB] py-20 md:py-28 border-t border-[#330020]/10 overflow-hidden">
                <div className="container mx-auto px-6 lg:px-12 mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-[1px] bg-[#8A8F68]" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#330020]/48">Trusted By Global Clients</span>
                        <div className="w-12 h-[1px] bg-[#8A8F68]" />
                    </div>
                </div>
                <div className="flex gap-24 md:gap-48 overflow-x-auto scrollbar-hide px-6 lg:px-12 items-center justify-between opacity-50 hover:opacity-100 transition-opacity duration-1000 select-none [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {['ARCHITECTURAL DIGEST', 'ELLE DECOR', 'VOGUE LIVING', 'THE LOCAL PROJECT', 'WALLPAPER*', 'DEZEEN'].map((partner, i) => (
                        <div key={i} className="flex-shrink-0">
                            <span className="text-lg md:text-xl font-serif tracking-[0.2em] text-[#330020]/48 hover:text-[#330020] transition-colors duration-700 cursor-pointer">
                                {partner}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </Layout>
    );
};

export default Home;

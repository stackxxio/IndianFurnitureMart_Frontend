import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, 
    Sparkles, 
    Clock, 
    HeartHandshake,
    Loader2,
    ArrowRight
} from 'lucide-react';
import SafeImage from '../../components/common/SafeImage';
import SEO from '../../components/common/SEO';

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await api.get('/about');
                setAboutData(res.data);
            } catch (error) {
                console.error('Failed to fetch about data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center bg-[#F6F1EB]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-[#8A8F68]" size={40} />
                        <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#330020]/40">Gathering Chronicle...</span>
                    </div>
                </div>
            </Layout>
        );
    }

    const data = aboutData || {
        title: 'About Indian Furniture Mart',
        subtitle: 'Crafting comfortable and beautiful spaces for modern homes.',
        storyTitle: 'Our Story',
        storyText: 'Indian Furniture Mart started as a small passion project with a simple goal: to make beautiful, high-quality furniture accessible to families. Over the years, we have built a reputation on premium craftsmanship, outstanding design, and the ultimate comfort. We source only the finest teak wood and materials, and work with dedicated craftsmen who understand the natural soul of wood.',
        founderName: 'Rajesh Kumar',
        founderMessage: 'Our mission is to bring warmth, comfort, and timeless beauty into every home we touch.',
        bannerImage: { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1920' },
        founderImage: { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800' },
        gallery: []
    };

    const highlights = [
        {
            title: 'Quality Materials',
            desc: 'We source only premium solid teak wood and high-grade materials for lifetime endurance.',
            icon: ShieldCheck
        },
        {
            title: 'Trusted Service',
            desc: 'Thousands of happy families trust our quality and service for their homes.',
            icon: HeartHandshake
        },
        {
            title: 'Elegant Design',
            desc: 'Modern and timeless silhouettes that elevate and harmonize your living rooms.',
            icon: Sparkles
        },
        {
            title: 'Fast Customer Support',
            desc: 'Dedicated support team ready to assist you on chat, WhatsApp, and phone.',
            icon: Clock
        }
    ];

    // Split text paragraphs if available to render nicely
    const paragraphs = data.storyText ? data.storyText.split('\n').filter(p => p.trim() !== '') : [];

    return (
        <Layout>
            <SEO 
                title="About Us | Indian Furniture Mart"
                description={data.subtitle}
            />

            <div className="bg-[#F6F1EB] text-[#330020] overflow-hidden selection:bg-[#330020] selection:text-[#F6F1EB]">
                {/* 1. Brand Header / Hero (Clean Editorial Style) */}
                <section className="relative min-h-[85vh] flex items-center justify-center pt-36 pb-24 px-6 md:px-12 relative">
                    {/* Background Artwork */}
                    <div className="absolute inset-0 z-0">
                        <SafeImage 
                            src={data.bannerImage?.url} 
                            className="w-full h-full object-cover opacity-75 filter saturate-[0.85] contrast-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#F6F1EB]/90 via-[#F6F1EB]/45 to-[#F6F1EB]" />
                        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#8A8F68]/10 rounded-full blur-3xl" />
                    </div>

                    <div className="max-w-[1400px] w-full mx-auto relative z-10 flex flex-col items-center">
                        {/* Glassmorphic Panel to ensure absolute luxury readability */}
                        <div className="max-w-4xl w-full bg-white/80 backdrop-blur-lg p-8 md:p-16 rounded-[3.5rem] border border-white/50 shadow-premium flex flex-col items-center text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                                className="inline-flex items-center gap-3 px-5 py-2 bg-[#F6F1EB]/90 backdrop-blur-sm rounded-full border border-[#330020]/8 mb-8 shadow-sm"
                            >
                                <Sparkles size={11} className="text-[#8A8F68]" />
                                <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-[#330020]/80">Est. 1992 • Luxury Furniture Mart</span>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.0, delay: 0.2 }}
                                className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#330020] leading-[1.1] tracking-tight mb-8"
                            >
                                {data.title || "About Indian Furniture Mart"}
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.0, delay: 0.4 }}
                                className="text-sm sm:text-lg md:text-xl text-[#330020]/80 max-w-2xl leading-relaxed font-sans font-light"
                            >
                                {data.subtitle || "Crafting comfortable and beautiful spaces for modern homes."}
                            </motion.p>
                        </div>

                        {/* Interactive floating arrow to guide visitors */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-12 flex flex-col items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                            onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
                        >
                            <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Explore Our Legacy</span>
                            <motion.div 
                                animate={{ y: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.8 }}
                                className="w-5 h-5 flex items-center justify-center"
                            >
                                <ArrowRight size={14} className="rotate-90 text-[#330020]" />
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* 2. Legacy / Story Section (Staggered Frames) */}
                <section className="py-24 md:py-36 border-t border-[#330020]/8 bg-white/35">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                            
                            {/* Left Column: Visual Assets with Staggered Frame */}
                            <div className="lg:col-span-6 relative flex justify-center">
                                <div className="relative w-full max-w-[500px]">
                                    {/* Accent Border Box behind */}
                                    <div className="absolute -inset-4 border border-[#330020]/10 rounded-[3rem] -rotate-2" />
                                    
                                    {/* Main Image Frame */}
                                    <div className="aspect-[4/5] rounded-[2.8rem] overflow-hidden shadow-[0_25px_60px_-15px_rgba(51,0,32,0.15)] border border-[#330020]/15 relative z-10 bg-white">
                                        <SafeImage 
                                            src={data.bannerImage?.url || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000"} 
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] hover:scale-105" 
                                        />
                                    </div>

                                    {/* Floater Stats Card */}
                                    <motion.div 
                                        whileHover={{ scale: 1.05 }}
                                        className="absolute -bottom-10 -right-6 md:-right-10 p-8 bg-[#330020] rounded-[2.2rem] text-[#F6F1EB] shadow-premium z-20 max-w-[240px] border border-white/[0.08]"
                                    >
                                        <h3 className="text-4xl font-serif mb-2 italic text-[#8A8F68] leading-none">30+</h3>
                                        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#FAF6F0]/80 mb-1">Years of Trust</p>
                                        <p className="text-[9px] text-[#FAF6F0]/50 font-sans leading-normal">Premium mart crafting teak masterworks since 1992.</p>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Column: Editorial Text Content */}
                            <div className="lg:col-span-6 space-y-8">
                                <div className="inline-flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8A8F68]">Mart Journey</span>
                                    <div className="w-8 h-[1px] bg-[#8A8F68]/40" />
                                </div>

                                <h2 className="text-4xl sm:text-5xl font-serif text-[#330020] leading-[1.15] tracking-tight italic">
                                    {data.storyTitle || "Our Story"}
                                </h2>

                                <div className="space-y-6 text-[#330020]/80 font-sans font-light leading-relaxed text-base sm:text-lg">
                                    {paragraphs.length > 0 ? (
                                        paragraphs.map((p, idx) => (
                                            <p key={idx}>{p}</p>
                                        ))
                                    ) : (
                                        <p>{data.storyText}</p>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* 3. Testimonial / Founder's Vision (Warm Ivory & Luxury Quotes) */}
                <section className="py-24 md:py-36 border-t border-b border-[#330020]/8 relative">
                    <div className="absolute inset-0 bg-[#FAF6F0]/40 pointer-events-none" />
                    <div className="max-w-[1200px] mx-auto px-6 md:px-12 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
                            
                            {/* Quotes Block */}
                            <div className="lg:col-span-7 space-y-8">
                                <div className="inline-flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#8A8F68]">Founder's Philosophy</span>
                                    <div className="w-8 h-[1px] bg-[#8A8F68]/40" />
                                </div>

                                <div className="relative">
                                    <span className="absolute -top-12 -left-8 text-9xl font-serif text-[#8A8F68]/15 leading-none select-none">“</span>
                                    <blockquote className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#330020] italic leading-relaxed relative z-10">
                                        {data.founderMessage || "Our mission is to bring warmth, comfort, and timeless beauty into every home we touch."}
                                    </blockquote>
                                </div>

                                <div className="pt-6 border-t border-[#330020]/10 flex items-center gap-4">
                                    <div className="w-10 h-[1px] bg-[#330020]/20" />
                                    <div>
                                        <h4 className="text-lg font-sans font-bold text-[#330020]">{data.founderName || "Rajesh Kumar"}</h4>
                                        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8A8F68] mt-0.5">Founder & Chief Curator</p>
                                    </div>
                                </div>
                            </div>

                            {/* Owner Frame Picture */}
                            <div className="lg:col-span-5 flex justify-center">
                                <div className="relative">
                                    {/* Offset Decorative Frame */}
                                    <div className="absolute inset-0 border-2 border-[#8A8F68]/20 rounded-[2.5rem] translate-x-4 translate-y-4" />
                                    
                                    <div className="w-72 h-96 bg-white rounded-[2.5rem] overflow-hidden shadow-soft border border-[#330020]/15 relative z-10 transition-transform duration-700 hover:rotate-1">
                                        <SafeImage 
                                            src={data.founderImage?.url} 
                                            className="w-full h-full object-cover" 
                                            alt={data.founderName}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* 4. Brand Standards / Highlights (Glow Hover Cards) */}
                <section className="py-24 md:py-36">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                        
                        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#8A8F68]">Guarantees of Distinction</span>
                            <h2 className="text-4xl sm:text-5xl font-serif text-[#330020] leading-tight italic">Built on Quality & Mart Trust</h2>
                            <div className="w-12 h-[1px] bg-[#8A8F68] mx-auto mt-4" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {highlights.map((hl, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    whileHover={{ y: -6, shadow: "0 25px 50px -12px rgba(51,0,32,0.12)" }}
                                    className="bg-white/40 backdrop-blur-md rounded-[2rem] p-8 border border-[#330020]/8 transition-all duration-300 hover:bg-white flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="w-14 h-14 bg-[#F6F1EB] rounded-2xl flex items-center justify-center text-[#8A8F68] mb-8 border border-[#330020]/8 shadow-sm">
                                            <hl.icon size={22} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-base font-sans font-bold text-[#330020] mb-3">{hl.title}</h3>
                                        <p className="text-xs text-[#330020]/70 leading-relaxed font-light">{hl.desc}</p>
                                    </div>
                                    
                                    <div className="pt-6 mt-8 border-t border-[#330020]/5 flex items-center justify-between text-[9px] font-sans font-bold uppercase tracking-widest text-[#330020]/40">
                                        <span>Standard</span>
                                        <Sparkles size={10} className="text-[#8A8F68]/50" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. Mart virtual tour / Gallery (Luxury Border Grid) */}
                {data.gallery && data.gallery.length > 0 && (
                    <section className="py-24 md:py-36 border-t border-[#330020]/8 bg-white/40">
                        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
                            
                            <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
                                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-[#8A8F68]">A Visual Legacy</span>
                                <h2 className="text-4xl sm:text-5xl font-serif text-[#330020] leading-tight italic">Our Mart Gallery</h2>
                                <p className="text-xs text-[#330020]/50 font-sans">Take a virtual tour of our workshops and mart floors</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {data.gallery.map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                        className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-white/50 shadow-soft border border-[#330020]/8 group cursor-pointer"
                                    >
                                        <SafeImage 
                                            src={img.url} 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                            alt={`Mart image ${idx + 1}`}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#330020]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
};

export default About;

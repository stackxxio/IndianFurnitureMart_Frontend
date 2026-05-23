import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/common/SEO';
import api from '../../api';
import { Phone, Mail, MapPin, Clock, Loader2 } from 'lucide-react';

const Contact = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [iframeLoading, setIframeLoading] = useState(true);

    useEffect(() => {
        api.get('/settings').then(({ data }) => {
            setSettings(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <Layout><div className="min-h-[80vh] flex items-center justify-center bg-surface"><Loader2 className="animate-spin text-accent" /></div></Layout>
    );

    const s = settings || {};
    return (
        <Layout>
            <SEO title="Our Heritage Mart" description="Mart hours, phone helplines, emails, map location." />
            <div className="bg-surface min-h-screen pt-36 pb-24 px-6">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center max-w-2xl mx-auto">
                        <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">Connect With Us</span>
                        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-4">Visit Our Heritage Mart</h1>
                        <p className="text-text-muted text-xs leading-relaxed">Schedule customized styling consults and bespoke commissions at our flagship spaces.</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                        <div className="bg-white border rounded-[2rem] p-8 space-y-6 shadow-soft flex flex-col justify-between">
                            <div className="flex gap-4 border-b pb-4">
                                <MapPin className="text-accent shrink-0" size={20} />
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Mart Address</h4>
                                    <p className="text-xs font-bold text-primary">{s.martName || 'Indian Furniture Mart Pavilion'}</p>
                                    <p className="text-xs text-text-muted">{s.street || '14, Imperial Way'}, {s.city || 'Delhi'} - {s.pincode || '110001'}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 border-b pb-4">
                                <Phone className="text-accent shrink-0" size={20} />
                                <div className="w-full">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">Telephone Lines</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-primary">
                                        <div><span className="block text-[8px] text-primary/40">Mart:</span> <a href={`tel:${s.phoneMart}`} className="hover:text-[#330020] transition-colors">{s.phoneMart || '+91 11 4050 6070'}</a></div>
                                        <div><span className="block text-[8px] text-primary/40">Support:</span> <a href={`tel:${s.phoneSupport}`} className="hover:text-[#330020] transition-colors">{s.phoneSupport || '+91 98765 43210'}</a></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 border-b pb-4">
                                <Mail className="text-accent shrink-0" size={20} />
                                <div className="w-full">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">Email Directory</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-primary">
                                        <div><span className="block text-[8px] text-primary/40">General:</span> <a href={`mailto:${s.emailMart}`} className="hover:text-[#330020] transition-colors">{s.emailMart || 'mart@indianfurniture.com'}</a></div>
                                        <div><span className="block text-[8px] text-primary/40">Support:</span> <a href={`mailto:${s.emailSupport}`} className="hover:text-[#330020] transition-colors">{s.emailSupport || 'support@indianfurniture.com'}</a></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pb-2">
                                <Clock className="text-accent shrink-0" size={20} />
                                <div className="w-full">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">Availability Schedule</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-primary font-bold">
                                        <div><span className="block text-[8px] text-primary/40">Weekdays:</span> <span>{s.hoursWeekdays || '9:00 AM - 8:00 PM'}</span></div>
                                        <div><span className="block text-[8px] text-primary/40">Sunday:</span> <span>{s.hoursSunday || 'Closed'}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Follow Mart Stories</span>
                                <div className="flex gap-2 text-primary/60">
                                    {s.socialInstagram && (
                                        <a href={s.socialInstagram} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-surface hover:text-[#330020] transition-colors">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                            </svg>
                                        </a>
                                    )}
                                    {s.socialFacebook && (
                                        <a href={s.socialFacebook} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-surface hover:text-[#330020] transition-colors">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                            </svg>
                                        </a>
                                    )}
                                    {s.socialYoutube && (
                                        <a href={s.socialYoutube} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-surface hover:text-[#330020] transition-colors">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="min-h-[400px] rounded-[2rem] border bg-white p-2 shadow-soft overflow-hidden flex relative">
                            {iframeLoading && (
                                <div className="absolute inset-2 rounded-[1.8rem] bg-gradient-to-r from-[#2B1F1A]/[0.03] via-[#2B1F1A]/[0.01] to-[#2B1F1A]/[0.03] animate-pulse flex flex-col items-center justify-center text-primary/30">
                                    <Loader2 className="animate-spin mb-2 text-accent" size={24} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Loading Mart Map...</span>
                                </div>
                            )}
                            <iframe 
                                title="Mart Map" 
                                src={s.googleMapsUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.996160537351!2d77.21833891508253!3d28.629881182419515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd246c0e5aed%3A0xe5a3c6dfd2f7881e!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1622384732101!5m2!1sen!2sin'} 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0, borderRadius: '1.8rem', opacity: iframeLoading ? 0 : 1 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                onLoad={() => setIframeLoading(false)}
                                referrerPolicy="no-referrer-when-downgrade" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;

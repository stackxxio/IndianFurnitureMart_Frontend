import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { Settings, Save, Loader2, HelpCircle, X } from 'lucide-react';

const SettingsManagement = () => {
    const [settings, setSettings] = useState({
        martName: '', street: '', city: '', state: '', pincode: '',
        phoneMart: '', phoneSupport: '', phoneWhatsapp: '',
        emailSupport: '', emailMart: '', hoursWeekdays: '', hoursSunday: '',
        googleMapsUrl: '', socialInstagram: '', socialFacebook: '',
        socialWhatsapp: '', socialYoutube: '', footerLogo: '',
        footerDescription: '', footerCopyrightText: '', footerShowNewsletter: true,
        footerCategories: []
    });
    
    const [categoriesText, setCategoriesText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);

    useEffect(() => {
        api.get('/settings').then(({ data }) => {
            setSettings(data);
            setCategoriesText(data.footerCategories?.join(', ') || '');
            setLoading(false);
        }).catch(() => {
            toast.error('Failed to load settings');
            setLoading(false);
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const urlInput = settings.googleMapsUrl.trim();
            const iframeSrcMatch = urlInput.match(/src="([^"]+)"/);
            let finalUrl = iframeSrcMatch ? iframeSrcMatch[1] : urlInput;

            if (!finalUrl.includes('https://www.google.com/maps/embed')) {
                toast.error('Please use Google Maps Embed URL.');
                setSubmitting(false);
                return;
            }

            const payload = {
                ...settings,
                googleMapsUrl: finalUrl,
                footerCategories: categoriesText.split(',').map(c => c.trim()).filter(Boolean)
            };
            const { data } = await api.put('/settings', payload);
            setSettings(data);
            toast.success('Settings updated!');
        } catch (err) {
            toast.error('Failed to save settings');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <Layout title="Settings"><div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" /></div></Layout>
    );

    return (
        <Layout title="Site Settings">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8 relative">
                <div className="mb-12">
                    <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1">Mart Settings</h1>
                    <p className="font-sans text-[10px] font-bold text-[#8A8F68] uppercase tracking-[3px]">Manage dynamic contact info, mart location map, socials, and footer blocks</p>
                </div>

                <form onSubmit={handleSave} className="bg-white/82 backdrop-blur-md border border-[#330020]/08 rounded-[28px] p-8 sm:p-12 space-y-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)] text-[#330020]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Preferred City</label>
                            <input type="text" name="martName" value={settings.martName} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Street Address</label>
                            <input type="text" name="street" value={settings.street} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">City</label>
                            <input type="text" name="city" value={settings.city} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">State</label>
                            <input type="text" name="state" value={settings.state} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Pincode</label>
                            <input type="text" name="pincode" value={settings.pincode} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Mart Phone</label>
                            <input type="text" name="phoneMart" value={settings.phoneMart} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Support Helpline</label>
                            <input type="text" name="phoneSupport" value={settings.phoneSupport} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">WhatsApp Contact</label>
                            <input type="text" name="phoneWhatsapp" value={settings.phoneWhatsapp} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Mart Email</label>
                            <input type="email" name="emailMart" value={settings.emailMart} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Support Email</label>
                            <input type="email" name="emailSupport" value={settings.emailSupport} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Weekday Hours</label>
                            <input type="text" name="hoursWeekdays" value={settings.hoursWeekdays} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Sunday Hours</label>
                            <input type="text" name="hoursSunday" value={settings.hoursSunday} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                    </div>

                    <div className="border-t border-[#330020]/10 pt-8">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Google Maps Embed URL</label>
                            <button 
                                type="button" 
                                onClick={() => setShowHelpModal(true)} 
                                className="font-sans text-[11px] font-bold text-[#8A8F68] underline hover:text-[#330020] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                                <HelpCircle size={12} />
                                How to get embed link?
                            </button>
                        </div>
                        <input 
                            type="text" 
                            name="googleMapsUrl" 
                            value={settings.googleMapsUrl} 
                            onChange={handleChange} 
                            required 
                            placeholder="https://www.google.com/maps/embed?pb=..."
                            className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" 
                        />
                        <span className="block font-sans text-[9px] text-[#330020]/48 mt-2.5 font-bold uppercase tracking-[1px]">
                            Paste Google Maps Embed URL (https://www.google.com/maps/embed?...). Standard share links will not work.
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#330020]/10 pt-8">
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Instagram URL</label>
                            <input type="url" name="socialInstagram" value={settings.socialInstagram} onChange={handleChange} className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Facebook URL</label>
                            <input type="url" name="socialFacebook" value={settings.socialFacebook} onChange={handleChange} className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">WhatsApp Direct URL</label>
                            <input type="url" name="socialWhatsapp" value={settings.socialWhatsapp} onChange={handleChange} className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">YouTube URL</label>
                            <input type="url" name="socialYoutube" value={settings.socialYoutube} onChange={handleChange} className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                    </div>
                    
                    <div className="border-t border-[#330020]/10 pt-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Footer Branding Logo Text</label>
                                <input type="text" name="footerLogo" value={settings.footerLogo} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                            </div>
                            <div className="space-y-2">
                                <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Footer Categories (Comma Separated)</label>
                                <input type="text" value={categoriesText} onChange={(e) => setCategoriesText(e.target.value)} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Footer Description</label>
                            <textarea name="footerDescription" rows={3} value={settings.footerDescription} onChange={handleChange} required className="w-full py-5 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020] resize-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Footer Copyright Text</label>
                            <input type="text" name="footerCopyrightText" value={settings.footerCopyrightText} onChange={handleChange} required className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]" />
                        </div>
                        <div className="flex items-center justify-between p-6 bg-white/75 border border-[#330020]/10 rounded-[20px]">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#330020]/60">Show Footer Newsletter Box</span>
                            <input type="checkbox" name="footerShowNewsletter" checked={settings.footerShowNewsletter} onChange={handleChange} className="w-4 h-4 accent-[#330020] rounded cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-[#330020]/10">
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="h-16 px-10 bg-[#330020] text-[#FAF6F0] text-[11px] font-sans font-bold uppercase tracking-[2px] rounded-full hover:bg-[#8A8F68] hover:shadow-lg hover:shadow-[#8A8F68]/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                            Save Configurations
                        </button>
                    </div>
                </form>

                {/* HELP MODAL DIALOG */}
                {showHelpModal && (
                    <div className="fixed inset-0 bg-[#330020]/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                        <div className="bg-[#F6F1EB] rounded-[3rem] border border-[#330020]/10 p-10 max-w-md w-full shadow-2xl relative text-[#330020]">
                            <button 
                                type="button" 
                                onClick={() => setShowHelpModal(false)} 
                                className="absolute top-6 right-6 p-3 hover:bg-white/80 rounded-full text-[#330020]/40 transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                            <h3 className="text-2xl font-serif italic mb-6 border-b border-[#330020]/10 pb-3">How to get embed link?</h3>
                            <ol className="space-y-4 text-xs font-bold text-[#330020]/72 list-decimal pl-5 leading-relaxed">
                                <li>Open <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[#8A8F68] underline font-bold">Google Maps</a> in your browser.</li>
                                <li>Search for your flagship mart or building location.</li>
                                <li>Click the <strong>Share</strong> button in the left panel.</li>
                                <li>In the popup that appears, select the <strong>'Embed a map'</strong> tab.</li>
                                <li>Click <strong>Copy HTML</strong> (or copy only the URL inside the <code>src="..."</code> attribute).</li>
                                <li>Paste the copied HTML/URL into the Google Maps Embed URL field in this admin panel. We will automatically extract the clean URL for you!</li>
                            </ol>
                            <div className="mt-8 flex justify-end">
                                <button 
                                    type="button" 
                                    onClick={() => setShowHelpModal(false)} 
                                    className="h-12 px-8 bg-[#330020] text-[#FAF6F0] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#4A012E] hover:shadow-lg hover:shadow-[#4A012E]/20 transition-all cursor-pointer"
                                >
                                    Understood
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default SettingsManagement;

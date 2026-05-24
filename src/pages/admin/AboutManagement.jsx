import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Loader2, 
    Upload, 
    X, 
    Save, 
    Image as ImageIcon,
    FileText,
    User,
    Compass
} from 'lucide-react';
import SafeImage from '../../components/common/SafeImage';

const AboutManagement = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aboutData, setAboutData] = useState(null);

    // Form inputs
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        storyTitle: '',
        storyText: '',
        founderName: '',
        founderMessage: ''
    });

    // File selections (for new uploads)
    const [bannerFile, setBannerFile] = useState(null);
    const [founderFile, setFounderFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);

    // File previews
    const [bannerPreview, setBannerPreview] = useState('');
    const [founderPreview, setFounderPreview] = useState('');
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    // List of existing gallery images marked for deletion
    const [removedGalleryIds, setRemovedGalleryIds] = useState([]);

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const { data } = await api.get('/about');
            setAboutData(data);
            setFormData({
                title: data.title || '',
                subtitle: data.subtitle || '',
                storyTitle: data.storyTitle || '',
                storyText: data.storyText || '',
                founderName: data.founderName || '',
                founderMessage: data.founderMessage || ''
            });
            setBannerPreview(data.bannerImage?.url || '');
            setFounderPreview(data.founderImage?.url || '');
            setRemovedGalleryIds([]);
            setBannerFile(null);
            setFounderFile(null);
            setGalleryFiles([]);
            setGalleryPreviews([]);
        } catch (error) {
            toast.error('Failed to load mart page settings');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        if (type === 'banner') {
            setBannerFile(file);
            setBannerPreview(previewUrl);
        } else if (type === 'founder') {
            setFounderFile(file);
            setFounderPreview(previewUrl);
        }
    };

    const handleGallerySelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setGalleryFiles(prev => [...prev, ...files]);

        const previews = files.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...previews]);
    };

    const removeNewGalleryItem = (index) => {
        setGalleryFiles(prev => prev.filter((_, idx) => idx !== index));
        setGalleryPreviews(prev => prev.filter((_, idx) => idx !== index));
    };

    const markExistingGalleryForRemoval = (img) => {
        const id = img.public_id || img._id;
        if (removedGalleryIds.includes(id)) {
            setRemovedGalleryIds(prev => prev.filter(item => item !== id));
        } else {
            setRemovedGalleryIds(prev => [...prev, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        const payload = new FormData();
        payload.append('title', formData.title);
        payload.append('subtitle', formData.subtitle);
        payload.append('storyTitle', formData.storyTitle);
        payload.append('storyText', formData.storyText);
        payload.append('founderName', formData.founderName);
        payload.append('founderMessage', formData.founderMessage);

        if (bannerFile) {
            payload.append('bannerImage', bannerFile);
        }
        if (founderFile) {
            payload.append('founderImage', founderFile);
        }
        
        galleryFiles.forEach(file => {
            payload.append('gallery', file);
        });

        if (removedGalleryIds.length > 0) {
            payload.append('removedGalleryIds', JSON.stringify(removedGalleryIds));
        }

        try {
            await api.put('/about', payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('About page settings updated successfully!');
            fetchAboutData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update about page settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout title="Mart Page CMS">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary/20" size={40} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Mart Page CMS">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1">Mart Page CMS</h1>
                        <p className="font-sans text-[10px] font-bold text-[#8A8F68] uppercase tracking-[3px]">Dynamically manage stories, highlights, founder info, and mart showcases</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    
                    {/* 1. Hero settings Card */}
                    <div className="bg-white/82 backdrop-blur-md rounded-[28px] p-6 sm:p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08 text-[#330020]">
                        <div className="flex items-center gap-3 mb-8 border-b border-[#330020]/10 pb-4">
                            <Compass size={20} className="text-[#8A8F68] shrink-0" />
                            <h3 className="text-lg font-bold text-[#330020]">Hero Spotlight Banner</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex flex-col">
                                    <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Banner Title</label>
                                    <input 
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]"
                                        placeholder="About Indian Furniture Mart"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Banner Subtitle / Slogan</label>
                                    <textarea 
                                        value={formData.subtitle}
                                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                                        rows="3"
                                        className="w-full py-5 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020] resize-none"
                                        placeholder="Crafting comfortable and beautiful spaces for modern homes."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Banner Image Upload */}
                            <div className="flex flex-col">
                                <span className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Banner Image Spotlight</span>
                                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#330020]/10 bg-white/50 flex items-center justify-center group shadow-inner">
                                    {bannerPreview ? (
                                        <>
                                            <SafeImage src={bannerPreview} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-[#330020]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <label className="bg-[#FAF6F0]/90 hover:bg-[#FAF6F0] text-[#330020] px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest cursor-pointer shadow-premium transition-all">
                                                    Change Image
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        onChange={(e) => handleFileChange(e, 'banner')} 
                                                    />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="flex flex-col items-center gap-3 cursor-pointer text-[#330020]/30 hover:text-[#8A8F68] transition-colors">
                                            <Upload size={28} strokeWidth={1.5} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Upload Banner Photo</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={(e) => handleFileChange(e, 'banner')} 
                                                    />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Brand Narrative Card */}
                    <div className="bg-white/82 backdrop-blur-md rounded-[28px] p-6 sm:p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08 text-[#330020]">
                        <div className="flex items-center gap-3 mb-8 border-b border-[#330020]/10 pb-4">
                            <FileText size={20} className="text-[#8A8F68] shrink-0" />
                            <h3 className="text-lg font-bold text-[#330020]">Brand Story & Narrative</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col">
                                <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Story Heading</label>
                                <input 
                                    type="text"
                                    value={formData.storyTitle}
                                    onChange={(e) => handleInputChange('storyTitle', e.target.value)}
                                    className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]"
                                    placeholder="Our Story"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Story Text Details</label>
                                <textarea 
                                    value={formData.storyText}
                                    onChange={(e) => handleInputChange('storyText', e.target.value)}
                                    rows="6"
                                    className="w-full py-5 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020] resize-y"
                                    placeholder="Provide friendly, customer-centric retail language about your quality furniture journey..."
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Founder / Owner section Card */}
                    <div className="bg-white/82 backdrop-blur-md rounded-[28px] p-6 sm:p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08 text-[#330020]">
                        <div className="flex items-center gap-3 mb-8 border-b border-[#330020]/10 pb-4">
                            <User size={20} className="text-[#8A8F68] shrink-0" />
                            <h3 className="text-lg font-bold text-[#330020]">Founder & Owner Profile</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex flex-col">
                                    <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Owner Name</label>
                                    <input 
                                        type="text"
                                        value={formData.founderName}
                                        onChange={(e) => handleInputChange('founderName', e.target.value)}
                                        className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]"
                                        placeholder="e.g. Rajesh Kumar"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Message from Owner / Mission Statement</label>
                                    <textarea 
                                        value={formData.founderMessage}
                                        onChange={(e) => handleInputChange('founderMessage', e.target.value)}
                                        rows="4"
                                        className="w-full py-5 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020] resize-none"
                                        placeholder="Our mission is to bring warmth, comfort, and timeless beauty into every home we touch."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Owner Photo */}
                            <div className="flex flex-col items-center">
                                <span className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2 self-start">Founder Photo</span>
                                <div className="relative w-48 h-64 rounded-2xl overflow-hidden border border-[#330020]/10 bg-white/50 flex items-center justify-center group shadow-inner">
                                    {founderPreview ? (
                                        <>
                                            <SafeImage src={founderPreview} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-[#330020]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <label className="bg-[#FAF6F0]/90 hover:bg-[#FAF6F0] text-[#330020] px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest cursor-pointer shadow-premium transition-all">
                                                    Change Photo
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        className="hidden" 
                                                        onChange={(e) => handleFileChange(e, 'founder')} 
                                                    />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="flex flex-col items-center gap-3 cursor-pointer text-[#330020]/30 hover:text-[#8A8F68] transition-colors">
                                            <Upload size={24} strokeWidth={1.5} />
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-center px-4">Upload Founder Photo</span>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                className="hidden" 
                                                onChange={(e) => handleFileChange(e, 'founder')} 
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. Mart Gallery Asset Card */}
                    <div className="bg-white/82 backdrop-blur-md rounded-[28px] p-6 sm:p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08 text-[#330020]">
                        <div className="flex items-center gap-3 mb-8 border-b border-[#330020]/10 pb-4">
                            <ImageIcon size={20} className="text-[#8A8F68] shrink-0" />
                            <h3 className="text-lg font-bold text-[#330020]">Virtual Mart Gallery</h3>
                        </div>

                        <div className="space-y-8">
                            <div className="flex flex-col">
                                <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Upload Mart, Workshop & Lifestyle Photos</label>
                                <label className="border border-dashed border-[#330020]/15 rounded-2xl bg-white/50 h-32 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white hover:border-[#8A8F68]/40 transition-all group">
                                    <Upload size={24} className="text-[#330020]/30 group-hover:text-[#8A8F68] transition-colors" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#330020]/45 group-hover:text-[#330020]">Select mart pictures to upload</span>
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleGallerySelect} 
                                    />
                                </label>
                            </div>

                            {/* Gallery List */}
                            <div className="space-y-6">
                                <h4 className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-2">Current Mart Showcase</h4>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {/* Existing Gallery Images */}
                                    {aboutData.gallery?.map((img) => {
                                        const id = img.public_id || img._id;
                                        const isRemoved = removedGalleryIds.includes(id);
                                        return (
                                            <div key={id} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#330020]/10 bg-white/50 group shadow-sm">
                                                <SafeImage src={img.url} className={`w-full h-full object-cover transition-opacity duration-300 ${isRemoved ? 'opacity-25 grayscale' : ''}`} />
                                                <button
                                                    type="button"
                                                    onClick={() => markExistingGalleryForRemoval(img)}
                                                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-soft transition-all duration-300 z-10 ${isRemoved ? 'bg-green-500 text-[#FAF6F0] hover:bg-green-600' : 'bg-red-500 text-[#FAF6F0] hover:bg-red-600'}`}
                                                    title={isRemoved ? "Undo Delete" : "Mark for deletion"}
                                                >
                                                    {isRemoved ? <Save size={10} /> : <X size={10} />}
                                                </button>
                                                {isRemoved && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[#FAF6F0] text-[8px] font-bold uppercase tracking-widest font-sans pointer-events-none">
                                                        To Be Removed
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Newly Selected Previews */}
                                    {galleryPreviews.map((url, idx) => (
                                        <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#8A8F68]/20 bg-white/50 group shadow-sm">
                                            <SafeImage src={url} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewGalleryItem(idx)}
                                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-black text-[#FAF6F0] flex items-center justify-center shadow-soft transition-all duration-300 z-10"
                                                title="Remove selection"
                                            >
                                                <X size={10} />
                                            </button>
                                            <div className="absolute bottom-2 left-2 bg-[#8A8F68] text-[#FAF6F0] text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                                                New Upload
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 w-full">
                        <button
                            type="button"
                            onClick={fetchAboutData}
                            className="px-8 h-14 sm:h-16 w-full sm:w-auto rounded-full border border-[#330020]/15 text-[#330020]/80 text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[2px] hover:bg-white/80 transition-all"
                            disabled={saving}
                        >
                            Reset Changes
                        </button>
                        <button
                            type="submit"
                            className="px-8 sm:px-10 h-14 sm:h-16 w-full sm:w-auto justify-center rounded-full bg-[#330020] text-[#FAF6F0] text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[2px] hover:bg-[#8A8F68] hover:shadow-lg hover:shadow-[#8A8F68]/20 transition-all duration-500 flex items-center gap-3 disabled:opacity-50 cursor-pointer"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={12} /> Save Mart Config
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AboutManagement;

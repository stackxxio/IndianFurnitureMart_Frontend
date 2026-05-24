import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Image as ImageIcon, 
    X, 
    Loader2, 
    UploadCloud,
    Eye,
    EyeOff,
    MoreVertical,
    GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import SafeImage from '../../components/common/SafeImage';

const GalleryManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'partner',
        order: 0,
        isVisible: true
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const res = await api.get('/gallery/admin');
            setItems(res.data);
        } catch (error) {
            toast.error('Failed to fetch gallery assets');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                description: item.description || '',
                type: item.type,
                order: item.order,
                isVisible: item.isVisible
            });
            setPreview(item.image?.url);
        } else {
            setEditingItem(null);
            setFormData({
                title: '',
                description: '',
                type: 'partner',
                order: items.length,
                isVisible: true
            });
            setPreview(null);
        }
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('type', formData.type);
        data.append('order', formData.order);
        data.append('isVisible', formData.isVisible);
        
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            if (editingItem) {
                await api.put(`/gallery/${editingItem._id}`, data);
                toast.success('Gallery item updated');
            } else {
                await api.post('/gallery', data);
                toast.success('Gallery item added successfully');
            }
            setIsModalOpen(false);
            fetchGallery();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            toast.success('Item deleted successfully');
            fetchGallery();
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    return (
        <Layout title="Gallery Management">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1">Gallery</h1>
                        <p className="font-sans text-[10px] font-bold text-[#8A8F68] uppercase tracking-[3px]">Manage showcase imagery and brand visuals</p>
                    </div>
                    <Button 
                        onClick={() => handleOpenModal()}
                        variant="primary"
                        className="!px-6 !py-3 md:!px-8 md:!py-4 !text-[10px] md:!text-[11px] shadow-xl shadow-primary/20 w-full md:w-auto"
                    >
                        <Plus size={16} className="mr-2" /> Add Gallery Image
                    </Button>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="py-32 text-center"><Loader2 className="animate-spin inline text-primary/20" size={32} /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {items.map((item, idx) => (
                            <motion.div 
                                key={`gallery-${item._id || idx}`}
                                layout
                                className="group bg-white/82 backdrop-blur-md rounded-[28px] border border-[#330020]/08 shadow-[0_10px_30px_rgba(51,0,32,0.05)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(51,0,32,0.08)] transition-all duration-500 overflow-hidden text-[#330020]"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <SafeImage src={item.image?.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-[#330020]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => handleOpenModal(item)}
                                            className="w-12 h-12 rounded-2xl bg-[#FAF6F0] text-[#330020] flex items-center justify-center hover:bg-[#4A012E] hover:text-[#FAF6F0] transition-all"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="w-12 h-12 rounded-2xl bg-[#FAF6F0] text-[#8A8F68] flex items-center justify-center hover:bg-red-500 hover:text-[#FAF6F0] transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="absolute top-6 right-6">
                                        {item.isVisible ? (
                                            <div className="bg-[#8A8F68]/90 text-[#FAF6F0] p-2 rounded-xl backdrop-blur-md">
                                                <Eye size={14} />
                                            </div>
                                        ) : (
                                            <div className="bg-red-500/90 text-[#FAF6F0] p-2 rounded-xl backdrop-blur-md">
                                                <EyeOff size={14} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-[9px] font-bold text-[#8A8F68] uppercase tracking-widest">{item.type}</span>
                                        <div className="h-[1px] flex-1 bg-[#330020]/10" />
                                        <span className="text-[9px] font-bold text-[#330020]/20 uppercase tracking-widest">Order: {item.order}</span>
                                    </div>
                                    <h3 className="font-sans text-[18px] font-semibold text-[#330020] mb-2 truncate">{item.title}</h3>
                                    <p className="text-[10px] text-[#330020]/50 leading-relaxed uppercase tracking-widest truncate">{item.description || 'No description provided'}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#330020]/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-[#F6F1EB] border border-[#330020]/10 w-full max-w-xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl p-6 sm:p-10 overflow-hidden text-[#330020]"
                        >
                            <div className="flex items-start justify-between mb-8 sm:mb-10 gap-4">
                                <div>
                                    <h3 className="text-2xl font-serif italic mb-1">{editingItem ? 'Edit Gallery Image' : 'Add New Gallery Image'}</h3>
                                    <p className="text-[9px] font-bold text-[#330020]/40 uppercase tracking-widest">Configure gallery display and details</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 text-[#330020]/20 hover:bg-white/80 rounded-full transition-all"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Gallery Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs appearance-none text-[#330020]"
                                        >
                                            <option value="partner">Customer Profile</option>
                                            <option value="interior">Luxury Interior</option>
                                            <option value="collaboration">Collaboration</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Display Order</label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                            className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Image Asset</label>
                                    <div 
                                        onClick={() => document.getElementById('gallery-image').click()}
                                        className="relative w-full aspect-video bg-white/50 border border-dashed border-[#330020]/10 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
                                    >
                                        {preview ? (
                                            <img src={preview} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <UploadCloud className="text-[#330020]/10 group-hover:text-[#330020]/30 mb-2" size={32} strokeWidth={1} />
                                                <p className="text-[8px] font-bold uppercase tracking-widest text-[#330020]/20">Click to upload image</p>
                                            </>
                                        )}
                                        <input
                                            id="gallery-image"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full py-5 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs h-24 resize-none text-[#330020]"
                                    />
                                </div>

                                <div className="flex items-center gap-4 py-2">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isVisible: !formData.isVisible })}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all ${formData.isVisible ? 'bg-[#8A8F68]/10 text-[#8A8F68]' : 'bg-red-500/10 text-red-600'}`}
                                    >
                                        {formData.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{formData.isVisible ? 'Visible' : 'Hidden'}</span>
                                    </button>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={submitting}
                                    variant="primary"
                                    className="w-full !py-6 !text-[11px]"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : (
                                        editingItem ? 'Update Image' : 'Add Image'
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default GalleryManagement;

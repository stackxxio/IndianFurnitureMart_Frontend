import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Package, 
    X, 
    Loader2, 
    Search, 
    Filter, 
    ChevronDown,
    UploadCloud,
    SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SafeImage from '../../components/common/SafeImage';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        category: '',
        stock: '',
        description: '',
        isTrending: false,
        isIconic: false,
        isFeatured: false,
        isBulkPricingAvailable: false,
        homePriority: 0
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get('/products'),
                api.get('/categories/admin')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ 
                name: product.name, 
                price: product.price, 
                originalPrice: product.originalPrice || product.price,
                category: typeof product.category === 'object' ? product.category._id : product.category, 
                stock: product.stock, 
                description: product.description, 
                isTrending: product.isTrending, 
                isIconic: product.isIconic, 
                isFeatured: product.isFeatured || false,
                isBulkPricingAvailable: product.isBulkPricingAvailable || false,
                homePriority: product.homePriority || 0 
            });
            const imgs = product.images ? product.images : (product.image ? [{ url: product.image, public_id: '' }] : []);
            setExistingImages(imgs);
            setPreviews(imgs.map(img => img.url));
            setSelectedFiles([]);
        } else {
            setEditingProduct(null);
            setFormData({ 
                name: '', 
                price: '', 
                originalPrice: '',
                category: categories[0]?._id || '', 
                stock: '', 
                description: '', 
                isTrending: false, 
                isIconic: false, 
                isFeatured: false,
                isBulkPricingAvailable: false,
                homePriority: 0 
            });
            setExistingImages([]);
            setPreviews([]);
            setSelectedFiles([]);
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            if (previews.length + files.length > 5) {
                toast.error('Maximum 5 images allowed per product');
                return;
            }
            const newFiles = [...selectedFiles, ...files];
            setSelectedFiles(newFiles);
            const newPreviews = [...previews, ...files.map(file => URL.createObjectURL(file))];
            setPreviews(newPreviews);
        }
    };

    const removeImage = (index) => {
        const newFiles = [...selectedFiles];
        const newPreviews = [...previews];
        const newExisting = [...existingImages];
        
        if (index < newExisting.length) {
            newExisting.splice(index, 1);
            setExistingImages(newExisting);
        } else {
            const fileIndex = index - newExisting.length;
            newFiles.splice(fileIndex, 1);
            setSelectedFiles(newFiles);
        }
        
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Price must be positive';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!editingProduct && previews.length === 0) newErrors.images = 'At least one image is required';
        
        let selectedAttrs = 0;
        if (formData.isTrending) selectedAttrs++;
        if (formData.isIconic) selectedAttrs++;
        if (formData.isFeatured) selectedAttrs++;

        if (selectedAttrs > 2) {
            newErrors.attributes = 'A product can have a maximum of two collection attributes.';
            toast.error('A product can have a maximum of two collection attributes.');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        selectedFiles.forEach(file => data.append('images', file));
        
        if (editingProduct) {
            data.append('existingImages', JSON.stringify(existingImages));
        }

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, data);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', data);
                toast.success('New product added to inventory');
            }
            setIsModalOpen(false);
            fetchInitialData();
        } catch (error) {
            console.error('Submission error:', error);
            const message = error.response?.data?.message || 'Failed to save product. Please check your inputs.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted');
            fetchInitialData();
        } catch (error) {
            toast.error('Delete operation failed');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || 
            (typeof p.category === 'object' ? p.category?.name === selectedCategory : p.category === selectedCategory);
        return matchesSearch && matchesCategory;
    });

    return (
        <Layout title="Product Management">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1">Inventory</h1>
                        <p className="font-sans text-[10px] font-bold text-[#8A8F68] uppercase tracking-[3px]">Manage your furniture catalog and stock levels</p>
                    </div>
                    <Button 
                        onClick={() => handleOpenModal()}
                        variant="primary"
                        className="!px-6 !py-3 md:!px-8 md:!py-4 !text-[10px] md:!text-[11px] shadow-xl shadow-[#330020]/10 rounded-full w-full md:w-auto"
                    >
                        <Plus size={16} className="mr-2" /> Add New Product
                    </Button>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mb-10">
                    <div className="flex-grow relative">
                        <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-[#330020]/20" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search catalog..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 md:h-16 pl-12 md:pl-16 pr-6 md:pr-8 bg-white/75 border border-[#330020]/10 rounded-[1.25rem] md:rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs shadow-soft text-[#330020] placeholder:text-[#330020]/30"
                        />
                    </div>
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative group w-full lg:w-auto">
                            <select 
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none w-full pl-10 md:pl-12 pr-10 md:pr-12 h-14 md:h-16 bg-white/75 border border-[#330020]/10 rounded-[1.25rem] md:rounded-[20px] outline-none font-sans font-semibold text-xs shadow-soft cursor-pointer min-w-0 md:min-w-[200px] text-[#330020] focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all"
                            >
                                <option value="All">All Categories</option>
                                {categories.map((cat, idx) => (
                                    <option key={`cat-opt-${cat._id || idx}`} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 text-[#330020]/20 pointer-events-none group-hover:text-[#330020]/40 transition-colors" size={14} />
                            <Filter className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-[#330020]/20 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="glass rounded-[2.5rem] shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[1000px]">
                            <thead>
                                <tr className="bg-[#FAF6F0]/60 border-b border-[#330020]/05 font-sans text-[9px] font-bold uppercase tracking-[2px] text-[#330020]/45">
                                    <th className="px-10 py-8">Product Details</th>
                                    <th className="px-8 py-8">Category</th>
                                    <th className="px-8 py-8">Price</th>
                                    <th className="px-8 py-8">Inventory</th>
                                    <th className="px-10 py-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#330020]/5">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-32 text-center"><Loader2 className="animate-spin inline text-[#330020]/20" size={32} /></td></tr>
                                ) : filteredProducts.map((product, idx) => (
                                    <tr key={`prod-${product._id || idx}`} className="hover:bg-white/45 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white/80 rounded-2xl overflow-hidden border border-[#330020]/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                    <SafeImage src={(product.images && product.images.length > 0) ? product.images[0].url : product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h5 className="font-sans font-semibold text-[17px] text-[#330020] tracking-tight mb-1 truncate">{product.name}</h5>
                                                    <p className="font-sans text-[12px] tracking-[2px] uppercase text-[#330020]/45 truncate max-w-[250px]">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Badge variant="neutral" className="!text-[8px] !bg-white/80 border border-[#330020]/10">{typeof product.category === 'object' ? product.category?.name : product.category}</Badge>
                                        </td>
                                        <td className="px-8 py-6">
                                             <span className="font-sans text-[22px] font-bold text-[#330020]">₹{product.price.toLocaleString('en-IN')}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className={`font-sans text-[11px] font-bold ${product.stock < 10 ? 'text-[#8A8F68]' : 'text-[#330020]/60'}`}>{product.stock} Units</span>
                                                <div className="w-20 h-1.5 bg-[#8A8F68]/12 rounded-full overflow-hidden">
                                                    <div className="h-full rounded-full bg-[#8A8F68]" style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-3 text-[#330020]/20 hover:text-[#330020] hover:bg-[#330020]/5 hover:shadow-soft rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-3 text-[#330020]/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!loading && filteredProducts.length === 0 && (
                        <div className="py-32 text-center opacity-20">
                            <Package size={48} className="mx-auto mb-4" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">No products found in the catalog</p>
                        </div>
                    )}
                </div>
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
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            className="relative bg-[#F6F1EB] border border-[#330020]/10 w-full max-w-5xl rounded-[2rem] md:rounded-[3rem] shadow-2xl p-6 sm:p-8 md:p-12 max-h-[92vh] overflow-y-auto custom-scrollbar text-[#330020]"
                        >
                            <div className="flex items-start sm:items-center justify-between mb-8 md:mb-10 gap-4">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-serif italic mb-1">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <p className="text-[9px] font-bold text-[#330020]/40 uppercase tracking-widest leading-relaxed">Configure product details and display options</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 text-[#330020]/20 hover:bg-white/80 rounded-full transition-all flex-shrink-0"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-12">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
                                    {/* Left Column: Product DNA */}
                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-[#330020]/40 uppercase tracking-widest ml-1">Product Title</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-5 py-4 md:px-8 md:py-6 bg-white/80 border border-[#330020]/10 rounded-2xl md:rounded-3xl outline-none focus:ring-1 focus:ring-primary/10 transition-all font-bold text-sm text-[#330020] placeholder:text-[#330020]/30"
                                                placeholder="e.g. Haveli Carved Armchair"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/40 ml-1">Original Price (₹)</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={formData.originalPrice}
                                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                                        className="w-full bg-white/80 border border-[#330020]/10 rounded-2xl md:rounded-3xl px-5 py-4 md:px-8 md:py-6 text-sm focus:outline-none focus:border-primary/20 transition-all font-medium text-[#330020]"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                    <span className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 text-[#330020]/20 font-bold">₹</span>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/40 ml-1">Offer Price (₹)</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                        className="w-full bg-white/80 border border-[#330020]/10 rounded-2xl md:rounded-3xl px-5 py-4 md:px-8 md:py-6 text-sm focus:outline-none focus:border-primary/20 transition-all font-medium text-[#330020]"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                    <span className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 text-[#330020]/20 font-bold">₹</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/40 ml-1">Stock Level</label>
                                                <input
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                    className="w-full bg-white/80 border border-[#330020]/10 rounded-2xl md:rounded-3xl px-5 py-4 md:px-8 md:py-6 text-sm focus:outline-none focus:border-primary/20 transition-all font-medium text-[#330020]"
                                                    placeholder="0"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/40 ml-1">Category</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                        className="w-full bg-white/80 border border-[#330020]/10 rounded-2xl md:rounded-3xl px-5 py-4 md:px-8 md:py-6 text-sm focus:outline-none focus:border-primary/20 transition-all font-medium appearance-none cursor-pointer text-[#330020]"
                                                        required
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map((cat, idx) => (
                                                            <option key={`cat-id-${cat._id || idx}`} value={cat._id}>{cat.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 text-[#330020]/20 pointer-events-none" size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/40 ml-1">Artisan Philosophy</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-8 py-6 bg-white/80 border border-[#330020]/10 rounded-[2.5rem] outline-none focus:ring-1 focus:ring-primary/10 transition-all font-medium text-sm h-48 resize-none leading-relaxed text-[#330020] placeholder:text-[#330020]/30"
                                                placeholder="Describe the cultural narrative and craftsmanship..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Right Column: Imagery & Orchestration */}
                                    <div className="space-y-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between ml-1">
                                                <label className="text-[10px] font-bold text-[#330020]/40 uppercase tracking-widest">Visual Portfolio (Max 5)</label>
                                                <span className="text-[8px] font-bold text-[#8A8F68] uppercase tracking-widest">{previews.length}/5 Images</span>
                                            </div>
                                            <div 
                                                onClick={() => document.getElementById('product-images').click()}
                                                className="w-full min-h-[200px] bg-white/50 border-2 border-dashed border-[#330020]/10 rounded-2xl md:rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#8A8F68]/30 transition-all group overflow-hidden relative p-4"
                                            >
                                                {previews.length > 0 ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full h-full">
                                                        {previews.map((preview, i) => (
                                                            <div key={i} className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden shadow-soft group/img">
                                                                <SafeImage src={preview} className="w-full h-full object-cover" />
                                                                {i === 0 && (
                                                                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#8A8F68] text-[#FAF6F0] text-[6px] font-bold uppercase tracking-widest rounded-md shadow-lg">Cover</div>
                                                                )}
                                                                <button 
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-[#FAF6F0] flex items-center justify-center sm:opacity-0 group-hover/img:opacity-100 transition-all shadow-lg z-10"
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {previews.length < 5 && (
                                                            <div className="flex items-center justify-center border-2 border-dashed border-[#330020]/10 rounded-xl md:rounded-2xl hover:bg-white transition-all aspect-square min-h-[80px]">
                                                                <Plus size={20} className="text-[#330020]/10" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <UploadCloud size={40} strokeWidth={1} className="text-[#330020]/10 group-hover:text-[#330020]/30 transition-colors mb-4" />
                                                        <p className="text-[9px] font-bold text-[#330020]/40 uppercase tracking-[0.3em]">Drop images or click to browse</p>
                                                    </>
                                                )}
                                                <input 
                                                    id="product-images"
                                                    type="file" 
                                                    multiple 
                                                    accept="image/*"
                                                    onChange={handleImageChange} 
                                                    className="hidden" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/40 ml-1">Collection Attributes</label>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {[
                                                    { id: 'isTrending', label: 'Trending Interior', desc: 'Appears inside the Trending Interiors homepage showcase.' },
                                                    { id: 'isIconic', label: 'Iconic Collection', desc: 'Appears inside the premium Iconic Collections section.' },
                                                    { id: 'isFeatured', label: 'Featured Piece', desc: 'Reserved for future highlighted product experiences.' }
                                                ].map(attr => (
                                                    <label key={attr.id} className="flex flex-col items-start gap-3 p-6 bg-white/50 border border-[#330020]/10 rounded-[1.5rem] cursor-pointer hover:bg-white transition-all group">
                                                        <div className="flex items-center gap-4 w-full">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={formData[attr.id]} 
                                                                onChange={(e) => {
                                                                    const otherIds = ['isTrending', 'isIconic', 'isFeatured'].filter(id => id !== attr.id);
                                                                    const count = (e.target.checked ? 1 : 0) + (formData[otherIds[0]] ? 1 : 0) + (formData[otherIds[1]] ? 1 : 0);
                                                                    if (count > 2) {
                                                                        toast.error('A product can have a maximum of two collection attributes.');
                                                                        return;
                                                                    }
                                                                    setFormData({ ...formData, [attr.id]: e.target.checked });
                                                                }}
                                                                className="w-5 h-5 rounded-lg accent-[#330020] border-[#330020]/10 focus:ring-0" 
                                                            />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/60 group-hover:text-[#330020] transition-colors">{attr.label}</span>
                                                        </div>
                                                        <span className="text-[10px] text-[#330020]/40 font-medium leading-relaxed pl-9">{attr.desc}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.attributes && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.attributes}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#330020]/40 ml-1">Display Priority (Rank 1-99)</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={formData.homePriority}
                                                    onChange={(e) => setFormData({ ...formData, homePriority: e.target.value })}
                                                    className="w-full bg-white/80 border border-[#330020]/10 rounded-3xl px-8 py-6 text-sm focus:outline-none focus:border-primary/20 transition-all font-medium text-[#330020]"
                                                    placeholder="0"
                                                />
                                                <SlidersHorizontal className="absolute right-8 top-1/2 -translate-y-1/2 text-[#330020]/10" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#330020]/10">
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-8 !text-[11px] !tracking-[0.5em] shadow-2xl shadow-primary/20"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" /> : (editingProduct ? 'Update Masterpiece' : 'Publish to Collection')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default ProductManagement;

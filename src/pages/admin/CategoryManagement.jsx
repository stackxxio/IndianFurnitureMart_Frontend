import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Plus, 
    Search, 
    MoreVertical, 
    Edit2, 
    Trash2, 
    GripVertical, 
    Save, 
    X,
    Image as ImageIcon,
    Loader2,
    Eye,
    EyeOff,
    ArrowUpDown,
    Layers,
    ChevronRight,
    CornerDownRight,
    LayoutGrid
} from 'lucide-react';
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SafeImage from '../../components/common/SafeImage';

const SortableItem = ({ category, onEdit, onDelete, onToggleStatus }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: category._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 1,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style}
            className={`group flex items-center gap-4 md:gap-8 p-4 md:p-6 bg-white/82 backdrop-blur-md border border-[#330020]/08 rounded-[1.5rem] md:rounded-[28px] hover:shadow-[0_10px_30px_rgba(51,0,32,0.05)] transition-all duration-500 ${isDragging ? 'shadow-2xl ring-2 ring-primary/5 cursor-grabbing' : ''}`}
        >
            <div 
                {...attributes} 
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-[#330020]/10 hover:text-[#330020]/30 transition-colors p-2"
            >
                <GripVertical size={20} strokeWidth={1.5} />
            </div>

            <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[1.5rem] bg-white/80 border border-[#330020]/10 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                <SafeImage 
                    src={category.image?.url} 
                    alt={category.name} 
                    className="w-full h-full object-cover" 
                />
            </div>

            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-sans text-[16px] md:text-[20px] font-semibold text-[#330020] truncate tracking-tight">{category.name}</h4>
                    <Badge variant={category.isActive ? 'success' : 'neutral'} className="!text-[8px] !px-3 !py-1">
                        {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <CornerDownRight size={12} className="text-[#330020]/20 shrink-0" />
                    <p className="text-[10px] text-[#330020]/45 font-bold uppercase tracking-widest truncate leading-none pt-0.5">{category.description || 'No description provided'}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 opacity-100 translate-x-0 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:translate-x-4 md:group-hover:translate-x-0">
                <button 
                    onClick={() => onToggleStatus(category)}
                    className="p-2 md:p-4 text-[#330020]/40 md:text-[#330020]/20 hover:text-[#330020] hover:bg-white/80 rounded-xl md:rounded-2xl transition-all"
                    title={category.isActive ? 'Deactivate Category' : 'Activate Category'}
                >
                    {category.isActive ? <EyeOff size={16} md:size={18} strokeWidth={1.5} /> : <Eye size={16} md:size={18} strokeWidth={1.5} />}
                </button>
                <button 
                    onClick={() => onEdit(category)}
                    className="p-2 md:p-4 text-[#330020]/40 md:text-[#330020]/20 hover:text-[#330020] hover:bg-white/80 rounded-xl md:rounded-2xl transition-all"
                >
                    <Edit2 size={16} md:size={18} strokeWidth={1.5} />
                </button>
                <button 
                    onClick={() => onDelete(category._id)}
                    className="p-2 md:p-4 text-[#330020]/40 md:text-[#330020]/20 hover:text-red-500 hover:bg-red-50 rounded-xl md:rounded-2xl transition-all"
                >
                    <Trash2 size={16} md:size={18} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
};

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isReordering, setIsReordering] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories/admin');
            setCategories(data);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (active && over && active.id !== over.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex(i => i._id === active.id);
                const newIndex = items.findIndex(i => i._id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
            setIsReordering(true);
        }
    };

    const saveOrder = async () => {
        setSubmitting(true);
        try {
            const orderData = categories.map((cat, index) => ({
                _id: cat._id,
                order: index
            }));
            await api.patch('/categories/reorder', { categories: orderData });
            toast.success('Order saved successfully');
            setIsReordering(false);
        } catch (error) {
            toast.error('Failed to save order');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('isActive', formData.isActive);
        if (formData.image) data.append('image', formData.image);

        try {
            if (editingCategory) {
                await api.patch(`/categories/${editingCategory._id}`, data);
                toast.success('Category updated successfully');
            } else {
                await api.post('/categories', data);
                toast.success('New category added');
            }
            fetchCategories();
            handleCloseModal();
        } catch (error) {
            console.error('Submission error:', error);
            const message = error.response?.data?.message || 'Failed to save category. Please try again.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (category) => {
        try {
            await api.patch(`/categories/${category._id}`, { isActive: !category.isActive });
            toast.success(`Category ${category.isActive ? 'deactivated' : 'activated'}`);
            fetchCategories();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            isActive: category.isActive,
            image: null
        });
        setImagePreview(category.image?.url || null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', isActive: true, image: null });
        setImagePreview(null);
    };

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout title="Category Management">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1">Categories</h1>
                        <p className="font-sans text-[10px] font-bold text-[#8A8F68] uppercase tracking-[3px]">Manage product groupings and display order</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        {isReordering && (
                            <Button 
                                variant="primary" 
                                onClick={saveOrder} 
                                disabled={submitting}
                                className="!px-6 !py-3 md:!px-10 md:!py-5 !text-[10px] md:!text-[11px] shadow-xl shadow-primary/20 w-full sm:w-auto"
                            >
                                {submitting ? <Loader2 className="animate-spin" /> : <><Save size={16} className="mr-2" /> Save Order</>}
                            </Button>
                        )}
                        <Button 
                            variant={isReordering ? "secondary" : "primary"}
                            onClick={() => setShowModal(true)}
                            className="!px-6 !py-3 md:!px-10 md:!py-5 !text-[10px] md:!text-[11px] shadow-xl shadow-primary/20 w-full sm:w-auto"
                        >
                            <Plus size={16} className="mr-2" /> Add New Category
                        </Button>
                    </div>
                </div>

                {/* Filters & Statistics */}
                <div className="flex flex-col xl:flex-row gap-8 mb-12">
                    <div className="flex-grow relative group">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-[#330020]/20 group-focus-within:text-[#330020] transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-16 pl-20 pr-8 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="bg-white/82 backdrop-blur-md rounded-[1.5rem] md:rounded-[24px] px-6 md:px-8 py-4 md:py-6 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08 flex items-center gap-4 md:gap-6 w-full">
                            <Layers size={20} className="text-[#330020]/20" />
                            <div>
                                <p className="text-[9px] font-bold text-[#330020]/30 uppercase tracking-widest leading-none mb-1">Total Categories</p>
                                <p className="text-lg font-bold text-[#330020] leading-none">{categories.length}</p>
                            </div>
                        </div>
                        <div className="bg-white/82 backdrop-blur-md rounded-[1.5rem] md:rounded-[24px] px-6 md:px-8 py-4 md:py-6 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08 flex items-center gap-4 md:gap-6 w-full">
                            <ArrowUpDown size={20} className="text-[#330020]/20" />
                            <div>
                                <p className="text-[9px] font-bold text-[#330020]/30 uppercase tracking-widest leading-none mb-1">Sort Status</p>
                                <p className={`text-lg font-bold leading-none ${isReordering ? 'text-[#8A8F68]' : 'text-green-500'}`}>{isReordering ? 'Unsaved' : 'Saved'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories List */}
                {loading ? (
                    <div className="py-32 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-[#330020]/20 mb-6" size={48} />
                        <p className="text-[10px] font-bold text-[#330020]/20 uppercase tracking-widest">Loading categories...</p>
                    </div>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="space-y-6">
                            <SortableContext 
                                items={filteredCategories.map(c => c._id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {filteredCategories.map((category) => (
                                    <SortableItem 
                                        key={category._id} 
                                        category={category}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}
                            </SortableContext>
                        </div>

                        {filteredCategories.length === 0 && (
                            <div className="py-40 text-center bg-surface/50 rounded-[4rem] border border-dashed border-[#330020]/10">
                                <ImageIcon size={64} strokeWidth={1} className="mx-auto mb-8 text-[#330020]/10" />
                                <h3 className="text-2xl font-bold text-[#330020]/20 mb-2">No Categories</h3>
                                <p className="text-[10px] font-bold text-[#330020]/20 uppercase tracking-widest">Add your first category to get started</p>
                            </div>
                        )}
                    </DndContext>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-[#330020]/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#F6F1EB] border border-[#330020]/10 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl p-6 sm:p-8 md:p-12 overflow-y-auto max-h-[90vh] text-[#330020] scrollbar-hide"
                        >
                            <div className="flex justify-between items-start mb-8 md:mb-12">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-serif italic mb-2 text-[#330020]">
                                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                                    </h2>
                                    <p className="text-[10px] font-bold text-[#330020]/40 uppercase tracking-widest">Configure category name and display image</p>
                                </div>
                                <button onClick={handleCloseModal} className="p-4 hover:bg-white/80 rounded-full transition-all text-[#330020]/20 hover:text-[#330020]">
                                    <X size={24} strokeWidth={1.5} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-2">Category Name</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full h-16 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs text-[#330020]"
                                                placeholder="e.g. Victorian Mahogany Heritage"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 ml-2">Description</label>
                                            <textarea 
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full py-5 px-6 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-xs h-48 resize-none leading-relaxed text-[#330020]"
                                                placeholder="Enter category description..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-[#330020]/40 uppercase tracking-widest ml-2">Display Image</label>
                                            <div 
                                                onClick={() => document.getElementById('category-image').click()}
                                                className="aspect-square w-full max-w-[200px] md:max-w-none mx-auto bg-white/50 border border-[#330020]/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer relative shadow-soft"
                                            >
                                                {imagePreview ? (
                                                    <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-[#330020]/10 group-hover:text-[#330020]/20 transition-colors">
                                                        <Plus size={48} strokeWidth={1} />
                                                        <span className="text-[9px] font-bold uppercase mt-6 tracking-widest">Upload Image</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                    <div className="w-16 h-16 bg-[#FAF6F0]/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                                                        <ImageIcon className="text-[#FAF6F0]" size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                            <input 
                                                id="category-image"
                                                type="file" 
                                                className="hidden" 
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                            <p className="text-[8px] text-center font-bold text-[#330020]/20 uppercase tracking-widest mt-4">Suggested resolution: 1200x1200px</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-6 bg-white/75 border border-[#330020]/10 rounded-[20px]">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded-lg border-[#330020]/10 text-[#330020] focus:ring-[#330020]/20 cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="isActive" className="font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 cursor-pointer">
                                        Active & Visible on Website
                                    </label>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={submitting} 
                                    variant="primary" 
                                    className="w-full !py-7 !text-[11px] shadow-2xl shadow-primary/20"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : (
                                        <span className="flex items-center justify-center gap-3">
                                            {editingCategory ? <Save size={16} /> : <Plus size={16} />}
                                            {editingCategory ? 'Update Category' : 'Add Category'}
                                        </span>
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

export default CategoryManagement;

import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Package, ArrowRight, Loader2, Info, Phone, Mail, MessageSquare } from 'lucide-react';
import { EnquiryContext } from '../../context/EnquiryContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import toast from 'react-hot-toast';
import SafeImage from '../common/SafeImage';

const EnquiryDrawer = () => {
    const { items, isDrawerOpen, closeDrawer, removeFromEnquiry, updateQuantity, clearEnquiry } = useContext(EnquiryContext);
    const { user } = useContext(AuthContext);
    
    const [note, setNote] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        note: ''
    });

    const [errors, setErrors] = useState({});

    // Prefill user details if logged in
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.name || '',
                phone: user.phone || ''
            }));
        } else {
            setFormData({
                customerName: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                note: ''
            });
        }
    }, [user, isModalOpen]);

    // Keep formData note in sync with drawer note
    useEffect(() => {
        setFormData(prev => ({ ...prev, note: note }));
    }, [note]);

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerName.trim()) newErrors.customerName = 'Full Name is required';
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Mobile Number is required';
        } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Please enter a valid mobile number';
        }

        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProceedToDetails = () => {
        if (items.length === 0) {
            toast.error('Your collection is empty');
            return;
        }
        setIsModalOpen(true);
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please correct the validation errors');
            return;
        }

        setIsSubmitting(true);
        try {
            const formattedProducts = items.map(item => ({
                productId: item.product._id,
                quantity: item.quantity
            }));

            // Save to database
            const { data } = await api.post('/enquiries', {
                products: formattedProducts,
                customerName: formData.customerName,
                phone: formData.phone,
                whatsApp: formData.phone,
                email: user?.email || 'guest@example.com',
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                note: formData.note
            });

            toast.success('Enquiry Submitted Successfully!', {
                style: {
                    background: '#F6F1EB',
                    color: '#330020',
                    borderRadius: '100px',
                    padding: '12px 24px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    border: '1px solid rgba(51, 0, 32, 0.10)'
                },
                icon: '✨'
            });

            // Clean up state
            clearEnquiry();
            setNote('');
            setIsModalOpen(false);
            closeDrawer();

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit enquiry');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={closeDrawer}
                        className="fixed inset-0 bg-[#330020]/25 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#F6F1EB] z-[110] shadow-[-20px_0_60px_-15px_rgba(51,0,32,0.1)] flex flex-col text-[#330020]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-[#330020]/10 bg-white/55">
                            <div>
                                <h2 className="text-2xl font-serif text-[#330020] italic">Enquiry List</h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#330020]/48 mt-1">
                                    {items.length} {items.length === 1 ? 'Piece' : 'Pieces'} Selected
                                </p>
                            </div>
                            <button 
                                onClick={closeDrawer}
                                className="w-10 h-10 rounded-full border border-[#330020]/10 bg-white/80 flex items-center justify-center text-[#330020]/48 hover:bg-[#4A012E] hover:text-[#F6F1EB] hover:border-transparent transition-all duration-300 group cursor-pointer"
                            >
                                <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                    <Package size={48} strokeWidth={1} className="mb-6 text-[#330020]" />
                                    <h3 className="font-serif text-2xl text-[#330020] mb-2">Collection Empty</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#330020]/60">
                                        Add pieces to request a mart quote
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Items List */}
                                    <div className="space-y-4">
                                        <AnimatePresence mode="popLayout">
                                            {items.map((item, idx) => (
                                                <motion.div
                                                    key={`cart-item-${item.product?._id || 'id'}-${idx}`}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="bg-white/55 p-4 rounded-2xl border border-[#330020]/10 flex gap-4 shadow-soft relative group"
                                                >
                                                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#F6F1EB] shrink-0 border border-[#330020]/10">
                                                        <SafeImage 
                                                            src={item.product.images?.[0]?.url || item.product.image} 
                                                            alt={item.product.name} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between py-1">
                                                        <div>
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-serif text-lg text-[#330020] leading-tight pr-6">{item.product.name}</h4>
                                                                <button 
                                                                    onClick={() => removeFromEnquiry(item.product._id)}
                                                                    className="absolute top-4 right-4 text-[#330020]/20 hover:text-red-500 transition-colors cursor-pointer"
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                            </div>
                                                            <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#330020]/48 mt-1">
                                                                {item.product.showPrice !== false ? `₹${item.product.price?.toLocaleString('en-IN')}` : 'Price on Request'}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-3">
                                                            <div className="flex items-center bg-white/80 rounded-full border border-[#330020]/10">
                                                                <button 
                                                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                                    className="w-8 h-8 flex items-center justify-center text-[#330020]/48 hover:text-[#330020] cursor-pointer"
                                                                >
                                                                    <Minus size={12} strokeWidth={2} />
                                                                </button>
                                                                <span className="w-6 text-center text-xs font-bold text-[#330020]">{item.quantity}</span>
                                                                <button 
                                                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                                    className="w-8 h-8 flex items-center justify-center text-[#330020]/48 hover:text-[#330020] cursor-pointer"
                                                                >
                                                                    <Plus size={12} strokeWidth={2} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Project Notes */}
                                    <div className="mt-8">
                                        <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 mb-3">
                                            <Info size={12} /> Enquiry Notes
                                        </label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Mention specific finishes, custom sizing, or delivery requirements..."
                                            rows="4"
                                            className="w-full bg-white/80 border border-[#330020]/10 focus:border-[#330020]/30 rounded-2xl p-4 text-sm outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] resize-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="bg-white/55 border-t border-[#330020]/10 p-8">
                                <div className="flex flex-col mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#330020]/48">Subtotal Estimate</span>
                                        <span className="text-xl font-sans font-bold text-[#330020]">
                                            {items.some(item => item.product.showPrice === false) ? (
                                                <span className="text-base font-serif italic text-[#8A8F68]">Price on Request</span>
                                            ) : (
                                                `₹${items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toLocaleString('en-IN')}`
                                            )}
                                        </span>
                                    </div>
                                    {items.some(item => item.product.showPrice === false) && (
                                        <span className="text-[8px] font-bold text-[#8A8F68] uppercase tracking-wider text-right mt-1.5 block">
                                            * Total price will be provided upon inquiry
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={handleProceedToDetails}
                                    className="w-full h-16 rounded-full bg-[#330020] text-[#F6F1EB] text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-lg shadow-[#330020]/10 hover:bg-[#4A012E] hover:shadow-lg hover:shadow-[#4A012E]/20 group cursor-pointer"
                                >
                                    Proceed to Details <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}

            {/* Final Enquiry Modal */}
            {isModalOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        onClick={() => setIsModalOpen(false)}
                        className="fixed inset-0 bg-[#330020]/35 backdrop-blur-sm z-[120]"
                    />

                    {/* Modal Box */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[92%] max-w-[800px] max-h-[90vh] bg-[#F6F1EB] rounded-3xl md:rounded-[3.5rem] z-[130] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#330020]/10 text-[#330020]"
                    >
                        {/* Left Side: Summary Panel (Luxury Showcase) */}
                        <div className="w-full md:w-[38%] bg-white/40 border-b md:border-b-0 md:border-r border-[#330020]/10 p-5 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[35vh] md:max-h-none">
                            <div>
                                <h3 className="text-xl font-serif text-[#330020] italic">Mart Curation</h3>
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#330020]/48 mb-6">Reviewing Selected Pieces</p>
                                
                                <div className="space-y-4 max-h-[220px] md:max-h-[350px] overflow-y-auto pr-2">
                                    {items.map((item, idx) => (
                                        <div key={`modal-item-${item.product?._id || 'id'}-${idx}`} className="flex items-center gap-4 bg-white/55 p-3 rounded-xl border border-[#330020]/10">
                                            <div className="w-12 h-14 bg-[#F6F1EB] rounded-lg overflow-hidden shrink-0 border border-[#330020]/10">
                                                <SafeImage src={item.product.images?.[0]?.url || item.product.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-serif text-[#330020] truncate">{item.product.name}</p>
                                                <p className="text-[9px] font-sans font-bold text-[#330020]/48 uppercase mt-0.5">
                                                    x{item.quantity} • {item.product.showPrice !== false ? `₹${item.product.price?.toLocaleString('en-IN')}` : 'Price on Request'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-[#330020]/10 mt-6 md:mt-0">
                                <div className="flex flex-col text-[#330020]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#330020]/48">Subtotal Estimate</span>
                                        <span className="text-lg font-sans font-bold text-[#330020]">
                                            {items.some(item => item.product.showPrice === false) ? (
                                                <span className="text-base font-serif italic text-[#8A8F68]">Price on Request</span>
                                            ) : (
                                                `₹${items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toLocaleString('en-IN')}`
                                            )}
                                        </span>
                                    </div>
                                    {items.some(item => item.product.showPrice === false) && (
                                        <span className="text-[8px] font-bold text-[#8A8F68] uppercase tracking-wider text-right mt-1.5 block">
                                            * Total price will be provided upon inquiry
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Customer Details Form */}
                        <form onSubmit={handleFinalSubmit} className="w-full md:w-[62%] p-5 md:p-8 flex flex-col justify-between overflow-y-auto bg-white/20">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-serif text-[#330020] italic">Consultation Details</h3>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#330020]/48 mt-1">Let us reach you back within seconds</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-8 h-8 rounded-full border border-[#330020]/10 bg-white/80 flex items-center justify-center text-[#330020]/48 hover:bg-[#4A012E] hover:text-[#F6F1EB] hover:border-transparent transition-all duration-300 cursor-pointer"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="flex flex-col">
                                        <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 mb-1.5">Full Name *</label>
                                        <input 
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => handleFieldChange('customerName', e.target.value)}
                                            placeholder="Your full name"
                                            className={`bg-white/80 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] ${errors.customerName ? 'border-red-400 focus:border-red-400' : 'border-[#330020]/10 focus:border-[#330020]/30'}`}
                                        />
                                        {errors.customerName && <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.customerName}</span>}
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="flex flex-col">
                                        <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 mb-1.5">Mobile Number *</label>
                                        <input 
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                                            placeholder="e.g. +91 98765 43210"
                                            className={`bg-white/80 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] ${errors.phone ? 'border-red-400 focus:border-red-400' : 'border-[#330020]/10 focus:border-[#330020]/30'}`}
                                        />
                                        {errors.phone && <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.phone}</span>}
                                    </div>

                                    {/* Address */}
                                    <div className="flex flex-col sm:col-span-2">
                                        <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 mb-1.5">Delivery Address *</label>
                                        <input 
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => handleFieldChange('address', e.target.value)}
                                            placeholder="Street address, building, floor"
                                            className={`bg-white/80 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] ${errors.address ? 'border-red-400 focus:border-red-400' : 'border-[#330020]/10 focus:border-[#330020]/30'}`}
                                        />
                                        {errors.address && <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.address}</span>}
                                    </div>

                                    {/* City */}
                                    <div className="flex flex-col">
                                        <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 mb-1.5">City *</label>
                                        <input 
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => handleFieldChange('city', e.target.value)}
                                            placeholder="e.g. Bangalore"
                                            className={`bg-white/80 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] ${errors.city ? 'border-red-400 focus:border-red-400' : 'border-[#330020]/10 focus:border-[#330020]/30'}`}
                                        />
                                        {errors.city && <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.city}</span>}
                                    </div>

                                    {/* State */}
                                    <div className="flex flex-col">
                                        <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 mb-1.5">State *</label>
                                        <input 
                                            type="text"
                                            value={formData.state}
                                            onChange={(e) => handleFieldChange('state', e.target.value)}
                                            placeholder="e.g. Karnataka"
                                            className={`bg-white/80 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] ${errors.state ? 'border-red-400 focus:border-red-400' : 'border-[#330020]/10 focus:border-[#330020]/30'}`}
                                        />
                                        {errors.state && <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.state}</span>}
                                    </div>

                                    {/* Pincode */}
                                    <div className="flex flex-col">
                                        <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 mb-1.5">Pincode *</label>
                                        <input 
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => handleFieldChange('pincode', e.target.value)}
                                            placeholder="e.g. 560001"
                                            className={`bg-white/80 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] ${errors.pincode ? 'border-red-400 focus:border-red-400' : 'border-[#330020]/10 focus:border-[#330020]/30'}`}
                                        />
                                        {errors.pincode && <span className="text-[8px] text-red-500 font-bold uppercase tracking-wider mt-1">{errors.pincode}</span>}
                                    </div>

                                    {/* Additional Notes ( Prefilled from drawer note ) */}
                                    <div className="flex flex-col sm:col-span-2">
                                        <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/60 mb-1.5">Additional Notes (Optional)</label>
                                        <textarea 
                                            value={formData.note}
                                            onChange={(e) => handleFieldChange('note', e.target.value)}
                                            placeholder="Any special details..."
                                            rows="2"
                                            className="bg-white/80 border border-[#330020]/10 focus:border-[#330020]/30 rounded-xl px-4 py-2.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6 md:mt-8 sticky bottom-0 md:static bg-white/20 md:bg-transparent backdrop-blur-md md:backdrop-blur-none pt-4 pb-2 md:p-0 z-20">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 md:h-14 rounded-full bg-[#330020] text-[#F6F1EB] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-lg shadow-[#330020]/10 hover:bg-[#4A012E] hover:shadow-lg hover:shadow-[#4A012E]/20 disabled:opacity-50 group cursor-pointer"
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>Submit Enquiry <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" /></>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EnquiryDrawer;

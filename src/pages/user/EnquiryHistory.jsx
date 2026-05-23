import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Clock, 
    CheckCircle2, 
    XCircle, 
    Package, 
    Calendar, 
    MessageSquare, 
    MapPin, 
    Phone,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import SafeImage from '../../components/common/SafeImage';

const EnquiryHistory = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const { data } = await api.get('/enquiries/my');
            setEnquiries(data);
        } catch (error) {
            toast.error('Failed to load enquiry history');
        } finally {
            setLoading(false);
        }
    };

    const mapStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'contacted': return 'Contacted';
            case 'confirmed': return 'Confirmed';
            case 'completed': 
            case 'rejected': 
                return 'Closed';
            default: return 'Pending';
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100/50';
            case 'contacted': return 'bg-blue-50 text-blue-600 border-blue-100/50';
            case 'confirmed': return 'bg-green-50 text-green-600 border-green-100/50';
            case 'completed':
            case 'rejected': 
                return 'bg-zinc-50 text-zinc-600 border-zinc-100/50';
            default: return 'bg-zinc-50 text-zinc-600 border-zinc-100/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-amber-500 shrink-0" />;
            case 'contacted': return <Phone size={16} className="text-blue-500 shrink-0" />;
            case 'confirmed': return <CheckCircle2 size={16} className="text-green-500 shrink-0" />;
            case 'completed':
            case 'rejected': 
                return <XCircle size={16} className="text-zinc-500 shrink-0" />;
            default: return <Clock size={16} className="text-zinc-500 shrink-0" />;
        }
    };

    return (
        <Layout title="Enquiry History">
            <div className="bg-[#F6F1EB] min-h-screen pt-32 pb-24 text-[#330020]">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif text-[#330020] mb-2 italic">My Enquiries</h1>
                        <p className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-widest">Track and review your furniture requests</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-32">
                            <Loader2 className="animate-spin text-[#330020]/30" size={40} />
                        </div>
                    ) : enquiries.length === 0 ? (
                        <div className="bg-white/55 rounded-[2rem] p-16 md:p-24 text-center shadow-soft border border-[#330020]/10">
                            <Package size={64} strokeWidth={1} className="text-[#330020]/20 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-[#330020] mb-2">No enquiries found</h3>
                            <p className="text-xs text-[#330020]/72 max-w-sm mx-auto font-light leading-relaxed">
                                You haven't submitted any furniture enquiries yet. Browse our products and click "Add to Enquiry" to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {enquiries.map((enquiry, i) => (
                                <motion.div 
                                    key={`hist-enq-${enquiry._id || i}`}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/55 rounded-[2.5rem] shadow-soft p-8 md:p-10 border border-[#330020]/10 relative overflow-hidden group hover:shadow-premium transition-all duration-500"
                                >
                                    {/* Status Accent Top Line */}
                                    <div className={`absolute top-0 left-0 w-full h-[4px] ${
                                        enquiry.status === 'confirmed' ? 'bg-[#8A8F68]' :
                                        enquiry.status === 'contacted' ? 'bg-blue-400' :
                                        enquiry.status === 'pending' ? 'bg-amber-400' :
                                        'bg-zinc-300'
                                    }`} />

                                    <div className="flex flex-wrap items-start justify-between gap-6 mb-8 pt-2">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border bg-white/80 border-[#330020]/10 shadow-sm`}>
                                                {getStatusIcon(enquiry.status)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className="text-lg font-bold text-[#330020] tracking-tight">ENQ-{enquiry._id.slice(-6).toUpperCase()}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusStyles(enquiry.status)}`}>
                                                        {mapStatusText(enquiry.status)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-[#330020]/48 uppercase tracking-widest">
                                                    <Calendar size={12} className="text-[#8A8F68] shrink-0" />
                                                    {new Date(enquiry.createdAt || enquiry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/80 px-6 py-3.5 rounded-2xl border border-[#330020]/10 text-right shadow-sm">
                                            <p className="text-[8px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] mb-0.5">Total Pieces</p>
                                            <p className="text-xl font-bold text-[#330020]">{enquiry.products.length}</p>
                                        </div>
                                    </div>

                                    {/* Address Details */}
                                    <div className="mb-8 p-5 bg-white/80 rounded-2xl border border-[#330020]/10 flex items-start gap-4 shadow-sm">
                                        <MapPin size={16} className="text-[#8A8F68] mt-0.5 shrink-0" />
                                        <div className="text-xs">
                                            <p className="font-bold text-[#330020] mb-1 uppercase tracking-wider text-[9px] opacity-40">Delivery Details</p>
                                            <p className="text-[#330020]/80 font-bold">{enquiry.customerName} • {enquiry.phone}</p>
                                            <p className="text-[#330020]/72 mt-1 font-light leading-relaxed">
                                                {enquiry.address}, {enquiry.city}, {enquiry.state} - {enquiry.pincode}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Products Grid */}
                                    <div className="bg-white/40 rounded-2xl p-6 border border-[#330020]/10">
                                        <h4 className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                            <Package size={14} className="text-[#8A8F68]" /> Requested Pieces
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {enquiry.products.map((item, idx) => (
                                                <div key={`hist-item-${item.productId?._id || 'id'}-${idx}`} className="bg-white/80 p-3.5 rounded-xl border border-[#330020]/10 flex items-center gap-4 hover:border-[#8A8F68]/20 transition-all duration-300 shadow-sm">
                                                    <div className="w-12 h-14 bg-[#F6F1EB] rounded-lg overflow-hidden shrink-0 border border-[#330020]/10">
                                                        <SafeImage 
                                                            src={item.productId?.images?.[0]?.url || item.productId?.image} 
                                                            alt="Product" 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-[#330020] truncate mb-0.5">{item.productId?.name || 'Mart Piece'}</p>
                                                        <div className="flex items-center gap-2 text-[9px] font-bold text-[#330020]/48 uppercase tracking-wider">
                                                            <span>Qty: {item.quantity}</span>
                                                            <span className="w-1 h-1 bg-[#330020]/20 rounded-full" />
                                                            <span className="text-[#8A8F68]">₹{item.productId?.price ? item.productId.price.toLocaleString('en-IN') : 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Note */}
                                    {enquiry.note && (
                                        <div className="mt-6 pt-6 border-t border-[#330020]/10 flex items-start gap-4">
                                            <MessageSquare size={16} className="text-[#8A8F68] shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest mb-1.5">Additional Notes</p>
                                                <p className="text-xs text-[#330020]/72 font-light italic leading-relaxed">
                                                    "{enquiry.note}"
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default EnquiryHistory;

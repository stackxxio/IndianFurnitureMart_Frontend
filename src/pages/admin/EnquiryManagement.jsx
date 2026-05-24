import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import {
    Clock,
    CheckCircle2,
    XCircle,
    MessageSquare,
    User,
    Calendar,
    Loader2,
    Trash2,
    Mail,
    Phone,
    ArrowRight,
    CornerDownRight,
    Package,
    AlertCircle,
    Store,
    PhoneCall,
    BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../../components/common/Badge';
import SafeImage from '../../components/common/SafeImage';
import Button from '../../components/common/Button';

const EnquiryManagement = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (phone) => {
        setExpandedGroups(prev => ({ ...prev, [phone]: !prev[phone] }));
    };

    const groupedEnquiries = React.useMemo(() => {
        const groups = {};
        enquiries.forEach(enq => {
            const phone = enq.phone || enq.userId?.phone || 'Unknown';
            if (!groups[phone]) {
                groups[phone] = {
                    customerName: enq.customerName || enq.userId?.name || 'Guest User',
                    phone: phone,
                    email: enq.email || enq.userId?.email || 'No Email',
                    whatsApp: enq.whatsApp,
                    enquiries: [],
                    totalEnquiries: 0,
                    completedCount: 0,
                    pendingCount: 0,
                    hasNew: false,
                    lastActivity: null
                };
            }
            groups[phone].enquiries.push(enq);
            groups[phone].totalEnquiries += 1;
            if (enq.status === 'completed') groups[phone].completedCount += 1;
            if (enq.status === 'pending' || enq.status === 'new') {
                groups[phone].pendingCount += 1;
                if (new Date() - new Date(enq.createdAt || enq.date) < 24 * 60 * 60 * 1000) {
                    groups[phone].hasNew = true;
                }
            }
        });
        return Object.values(groups).map(g => {
            g.enquiries.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
            g.lastActivity = g.enquiries[0]?.date || g.enquiries[0]?.createdAt;
            return g;
        }).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));
    }, [enquiries]);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const { data } = await api.get('/enquiries');
            setEnquiries(data.reverse());
        } catch (error) {
            toast.error('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/enquiries/${id}/status`, { status });
            toast.success(`Request ${status}`);
            fetchEnquiries();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteEnquiry = async (id) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
        try {
            await api.delete(`/enquiries/${id}`);
            toast.success('Enquiry deleted');
            setEnquiries(enquiries.filter(e => e._id !== id));
        } catch (error) {
            toast.error('Delete operation failed');
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending': return 'neutral';
            case 'contacted': return 'info';
            case 'confirmed': return 'success';
            case 'rejected': return 'error';
            case 'completed': return 'success';
            default: return 'neutral';
        }
    };

    const renderStatusBadge = (status) => {
        let classes = "";
        if (status === 'completed' || status === 'confirmed' || status === 'success') {
            classes = "bg-[#8A8F68]/14 text-[#8A8F68] border border-[#8A8F68]/15";
        } else if (status === 'contacted') {
            classes = "bg-[#8A8F68]/08 text-[#330020] border border-[#8A8F68]/15";
        } else if (status === 'pending') {
            classes = "bg-[#330020]/05 text-[#330020]/70 border border-[#330020]/10";
        } else {
            classes = "bg-red-50 text-red-600 border border-red-200/20";
        }
        return (
            <span className={`inline-flex items-center px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-[2px] rounded-lg ${classes}`}>
                {status}
            </span>
        );
    };

    return (
        <Layout title="Enquiry Management">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1">Enquiries</h1>
                        <p className="font-sans text-[10px] font-bold text-[#8A8F68] uppercase tracking-[3px]">Review and manage customer furniture requests</p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-32 text-center">
                        <Loader2 className="animate-spin inline text-[#330020]/20" size={40} />
                    </div>
                ) : enquiries.length === 0 ? (
                    <div className="glass rounded-[3rem] p-32 text-center shadow-soft">
                        <MessageSquare size={64} strokeWidth={1} className="text-[#330020]/10 mx-auto mb-8" />
                        <p className="text-[10px] font-bold text-[#330020]/40 uppercase tracking-widest">No enquiries found at the moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        <AnimatePresence>
                            {groupedEnquiries.map((group, idx) => {
                                const isExpanded = expandedGroups[group.phone];
                                const isReturning = group.totalEnquiries > 1;
                                const isHighIntent = group.pendingCount > 1 || group.enquiries.some(e => e.products.length > 3);
                                
                                return (
                                <motion.div
                                    key={`grp-${group.phone || idx}`}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white/82 backdrop-blur-md rounded-[28px] border border-[#330020]/08 shadow-[0_10px_30px_rgba(51,0,32,0.05)] hover:shadow-[0_18px_45px_rgba(51,0,32,0.08)] transition-all duration-300 group overflow-hidden relative"
                                >
                                    {group.hasNew && (
                                        <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-200 rounded-full animate-pulse">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                            <span className="text-[8px] font-bold text-orange-600 uppercase tracking-widest">New</span>
                                        </div>
                                    )}
                                    <div className="p-5 sm:p-10 cursor-pointer" onClick={() => toggleGroup(group.phone)}>
                                        <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 items-start justify-between">
                                            
                                            {/* Customer Profile Summary */}
                                            <div className="flex items-center gap-4 sm:gap-5 w-full xl:w-1/3">
                                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#F6F1EB] rounded-xl sm:rounded-[1.5rem] flex items-center justify-center text-[#330020]/40 border border-[#330020]/10 flex-shrink-0">
                                                    <User size={24} strokeWidth={1.5} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-sans text-xl sm:text-2xl font-semibold text-[#330020] leading-none mb-2 truncate">
                                                        {group.customerName}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {isReturning && <span className="px-2 py-0.5 bg-[#8A8F68]/10 text-[#8A8F68] text-[8px] font-bold uppercase tracking-widest rounded-md">Returning</span>}
                                                        {isHighIntent && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold uppercase tracking-widest rounded-md">High Intent</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quick Stats */}
                                            <div className="flex items-center justify-between sm:justify-center gap-2 sm:gap-8 w-full xl:w-auto px-4 sm:px-6 py-3 bg-[#F6F1EB]/50 rounded-2xl border border-[#330020]/5">
                                                <div className="text-center flex-1 sm:flex-none">
                                                    <p className="text-xl sm:text-2xl font-bold text-[#330020]">{group.totalEnquiries}</p>
                                                    <p className="text-[8px] font-bold text-[#330020]/40 uppercase tracking-widest">Total</p>
                                                </div>
                                                <div className="w-[1px] h-8 bg-[#330020]/10 hidden sm:block"></div>
                                                <div className="text-center flex-1 sm:flex-none">
                                                    <p className="text-xl sm:text-2xl font-bold text-amber-500">{group.pendingCount}</p>
                                                    <p className="text-[8px] font-bold text-[#330020]/40 uppercase tracking-widest">Pending</p>
                                                </div>
                                                <div className="w-[1px] h-8 bg-[#330020]/10 hidden sm:block"></div>
                                                <div className="text-center flex-1 sm:flex-none">
                                                    <p className="text-xl sm:text-2xl font-bold text-[#8A8F68]">{group.completedCount}</p>
                                                    <p className="text-[8px] font-bold text-[#330020]/40 uppercase tracking-widest">Closed</p>
                                                </div>
                                            </div>

                                            {/* Communication Actions */}
                                            <div className="flex items-center gap-2 w-full xl:w-auto justify-end" onClick={e => e.stopPropagation()}>
                                                {group.whatsApp && (
                                                    <a href={`https://wa.me/${group.whatsApp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-green-50 text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm">
                                                        <MessageSquare size={14} />
                                                    </a>
                                                )}
                                                {group.phone && (
                                                    <a href={`tel:${group.phone}`} className="w-10 h-10 bg-[#330020]/5 text-[#330020] hover:bg-[#330020] hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm">
                                                        <Phone size={14} />
                                                    </a>
                                                )}
                                                {group.email && group.email !== 'No Email' && (
                                                    <a href={`mailto:${group.email}`} className="w-10 h-10 bg-[#330020]/5 text-[#330020] hover:bg-[#330020] hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm">
                                                        <Mail size={14} />
                                                    </a>
                                                )}
                                                <button className="w-10 h-10 bg-white border border-[#330020]/10 text-[#330020]/50 hover:text-[#330020] rounded-xl flex items-center justify-center transition-all shadow-sm ml-4">
                                                    <CornerDownRight size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Timeline Accordion */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-[#330020]/10 bg-[#F6F1EB]/30"
                                            >
                                                <div className="p-5 sm:p-10 space-y-6">
                                                    <p className="text-[10px] font-bold text-[#330020]/40 uppercase tracking-widest mb-6">Enquiry Timeline History</p>
                                                    <div className="relative border-l-2 border-[#330020]/10 ml-2 sm:ml-4 space-y-8 sm:space-y-10 pl-6 sm:pl-8">
                                                        {group.enquiries.map((enquiry, idx) => (
                                                            <div key={`grp-enq-${enquiry._id || idx}`} className="relative">
                                                                {/* Timeline Dot */}
                                                                <div className="absolute -left-[35px] sm:-left-[41px] top-1 w-5 h-5 bg-white border-2 border-[#8A8F68] rounded-full flex items-center justify-center z-10 shadow-sm">
                                                                    <div className="w-2 h-2 bg-[#8A8F68] rounded-full"></div>
                                                                </div>
                                                                
                                                                <div className="bg-white rounded-[1.5rem] sm:rounded-2xl border border-[#330020]/10 p-5 sm:p-6 shadow-sm">
                                                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-[10px] font-bold text-[#330020]/40 uppercase tracking-widest">
                                                                                {new Date(enquiry.date || enquiry.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                                                            </span>
                                                                            {renderStatusBadge(enquiry.status)}
                                                                        </div>
                                                                        <span className="text-[9px] font-bold text-[#330020]/30 uppercase tracking-widest">
                                                                            ID: ENQ-{enquiry._id.slice(-6).toUpperCase()}
                                                                        </span>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
                                                                        {enquiry.products.map((item, pIdx) => (
                                                                            <div key={`grp-prod-${item.productId?._id || 'id'}-${pIdx}`} className="bg-white/80 rounded-[1.25rem] p-4 flex items-center gap-4 border border-[#330020]/10 shadow-sm hover:shadow-md transition-shadow">
                                                                                <div className="w-16 h-16 bg-[#F6F1EB] rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-[#330020]/05">
                                                                                    {item.productId?.images?.[0]?.url || item.productId?.image ? (
                                                                                        <SafeImage src={item.productId?.images?.[0]?.url || item.productId?.image} alt={item.productId?.name} className="w-full h-full object-cover" />
                                                                                    ) : (
                                                                                        <Package size={24} className="text-[#330020]/20" />
                                                                                    )}
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="text-xs font-bold text-[#330020] truncate mb-1">{item.productId?.name || 'Retired Asset'}</p>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <p className="text-[9px] font-bold text-[#8A8F68] uppercase tracking-wider bg-[#8A8F68]/10 px-2 py-0.5 rounded-full">Qty: {item.quantity}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    {enquiry.note && (
                                                                        <div className="mb-6 p-4 bg-[#F6F1EB] rounded-xl text-xs font-medium text-[#330020]/70 italic border border-[#330020]/5">
                                                                            "{enquiry.note}"
                                                                        </div>
                                                                    )}

                                                                    {/* Pipeline Actions */}
                                                                    <div className="flex flex-wrap gap-2 pt-5 mt-2 border-t border-[#330020]/10">
                                                                        {(() => {
                                                                            const stages = ['contacted', 'confirmed', 'completed'];
                                                                            const currentIdx = stages.indexOf(enquiry.status);
                                                                            const isCancelled = enquiry.status === 'cancelled';
                                                                            
                                                                            const btnBase = "flex-1 min-w-[80px] sm:min-w-[100px] py-2.5 rounded-xl transition-all duration-500 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 border border-transparent relative overflow-hidden";
                                                                            
                                                                            return (
                                                                                <>
                                                                                    {stages.map((stage, idx) => {
                                                                                        const isActive = enquiry.status === stage;
                                                                                        const isPast = currentIdx > idx && !isCancelled;
                                                                                        const isFuture = currentIdx < idx || isCancelled;

                                                                                        let config = { icon: <Clock size={12}/>, text: stage };
                                                                                        if (stage === 'contacted') config = { icon: <PhoneCall size={12}/>, active: 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.35)] scale-[1.02] z-10', past: 'bg-blue-50/80 text-blue-500 border-blue-100', text: 'Contacted' };
                                                                                        if (stage === 'confirmed') config = { icon: <BadgeCheck size={12}/>, active: 'bg-[#8A8F68] text-white shadow-[0_0_20px_rgba(138,143,104,0.35)] scale-[1.02] z-10', past: 'bg-[#8A8F68]/10 text-[#8A8F68] border-[#8A8F68]/20', text: 'Confirmed' };
                                                                                        if (stage === 'completed') config = { icon: <CheckCircle2 size={12}/>, active: 'bg-[#2A4B3A] text-white shadow-[0_0_20px_rgba(42,75,58,0.35)] scale-[1.02] z-10', past: 'bg-emerald-50 text-emerald-600 border-emerald-100', text: 'Completed' };

                                                                                        let appliedClass = '';
                                                                                        if (isActive) appliedClass = config.active;
                                                                                        else if (isPast) appliedClass = config.past;
                                                                                        else appliedClass = 'bg-[#F6F1EB] text-[#330020]/30 hover:bg-[#330020]/5 hover:text-[#330020]/60';

                                                                                        return (
                                                                                            <button 
                                                                                                key={stage}
                                                                                                disabled={isCancelled}
                                                                                                onClick={() => updateStatus(enquiry._id, stage)} 
                                                                                                className={`${btnBase} ${appliedClass} ${isCancelled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}`}
                                                                                            >
                                                                                                {isPast ? <CheckCircle2 size={12} className="opacity-70" /> : config.icon} 
                                                                                                {config.text}
                                                                                            </button>
                                                                                        )
                                                                                    })}

                                                                                    <button 
                                                                                        disabled={enquiry.status === 'completed'}
                                                                                        onClick={() => updateStatus(enquiry._id, 'cancelled')} 
                                                                                        className={`${btnBase} ${isCancelled ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] scale-[1.02] z-10' : 'bg-red-50/50 text-red-400 hover:bg-red-50 hover:text-red-600'} ${enquiry.status === 'completed' ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                                    >
                                                                                        <XCircle size={12}/> {isCancelled ? 'Cancelled' : 'Cancel'}
                                                                                    </button>

                                                                                    <button 
                                                                                        onClick={() => deleteEnquiry(enquiry._id)} 
                                                                                        className="w-10 flex-none py-2.5 bg-[#F6F1EB] hover:bg-red-600 text-[#330020]/30 hover:text-white rounded-xl transition-all duration-300 flex items-center justify-center border border-transparent cursor-pointer"
                                                                                    >
                                                                                        <Trash2 size={14}/>
                                                                                    </button>
                                                                                </>
                                                                            )
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default EnquiryManagement;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    Calendar,
    User,
    Mail,
    Phone,
    ArrowLeft,
    Package,
    MapPin,
    Loader2,
    MessageSquare,
    ExternalLink,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Store
} from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../../components/common/Badge';
import SafeImage from '../../components/common/SafeImage';

const UserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            const { data } = await api.get(`/users/${id}`);
            setData(data);
        } catch (error) {
            toast.error('Operational data retrieval failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center py-32">
                    <Loader2 className="animate-spin text-primary/20" size={48} />
                </div>
            </Layout>
        );
    }

    if (!data) {
        return (
            <Layout>
                <div className="text-center py-32 text-primary/20 font-bold uppercase tracking-widest">
                    Node discovery failed
                </div>
            </Layout>
        );
    }

    const { user, enquiries = [], summary = {} } = data;

    // Helper for Status Badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="warning" className="!px-3 !py-1.5 !text-[9px]">
                        <Clock size={10} className="mr-1.5" /> Pending
                    </Badge>
                );
            case 'contacted':
                return (
                    <Badge variant="neutral" className="!px-3 !py-1.5 !text-[9px] !bg-blue-50 !text-blue-600 !border-blue-200">
                        <Phone size={10} className="mr-1.5" /> Contacted
                    </Badge>
                );
            case 'confirmed':
                return (
                    <Badge variant="success" className="!px-3 !py-1.5 !text-[9px]">
                        <CheckCircle2 size={10} className="mr-1.5" /> Confirmed
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge variant="success" className="!px-3 !py-1.5 !text-[9px] !bg-emerald-50 !text-emerald-700 !border-emerald-200">
                        <CheckCircle2 size={10} className="mr-1.5" /> Completed
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="error" className="!px-3 !py-1.5 !text-[9px]">
                        <XCircle size={10} className="mr-1.5" /> Rejected
                    </Badge>
                );
            default:
                return (
                    <Badge variant="neutral" className="!px-3 !py-1.5 !text-[9px]">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <Layout title="Customer Details">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
                {/* Back Button & Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="p-4 bg-white/80 border border-[#330020]/10 shadow-soft rounded-2xl text-[#330020]/40 hover:text-[#330020] transition-all"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1">
                                {user.name}
                            </h1>
                            <p className="font-sans text-[10px] font-bold text-[#8A8F68] uppercase tracking-[3px]">
                                Customer Profile & Consultation History
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Summary Badges Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="bg-white/82 backdrop-blur-md border border-[#330020]/08 rounded-[28px] p-8 shadow-[0_10px_30px_rgba(51,0,32,0.05)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10" />
                                <p className="text-[9px] font-bold text-[#330020]/30 uppercase tracking-[0.2em] mb-2">Total Enquiries</p>
                                <p className="text-3xl font-sans font-bold text-[#330020]">{summary.totalEnquiries || 0}</p>
                            </div>
                            <div className="bg-white/82 backdrop-blur-md border border-[#330020]/08 rounded-[28px] p-8 shadow-[0_10px_30px_rgba(51,0,32,0.05)] relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/10" />
                                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-[0.2em] mb-2">Pending Action</p>
                                <p className="text-3xl font-sans font-bold text-amber-600">{summary.pendingEnquiries || 0}</p>
                            </div>
                            <div className="bg-[#330020] rounded-[28px] p-8 shadow-[0_15px_35px_rgba(51,0,32,0.2)] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <p className="text-[9px] font-bold text-[#FAF6F0]/40 uppercase tracking-[0.2em] mb-2">Confirmed Consultations</p>
                                <p className="text-3xl font-sans font-bold text-[#FAF6F0]">{summary.confirmedEnquiries || 0}</p>
                            </div>
                        </div>

                        {/* Enquiries History List */}
                        <div className="bg-white/82 backdrop-blur-md border border-[#330020]/08 rounded-[32px] shadow-[0_10px_30px_rgba(51,0,32,0.05)] overflow-hidden">
                            <div className="p-10 border-b border-[#330020]/5 flex items-center justify-between">
                                <h3 className="text-xl font-serif italic flex items-center gap-4 text-[#330020]">
                                    <MessageSquare size={24} className="text-[#330020]/20" /> Enquiries History
                                </h3>
                                <Badge variant="neutral" className="!text-[8px] !bg-white/80 border border-[#330020]/10">
                                    {enquiries.length} SUBMISSIONS FOUND
                                </Badge>
                            </div>

                            <div className="p-10 space-y-8">
                                {enquiries.length === 0 ? (
                                    <div className="py-24 text-center opacity-20">
                                        <MessageSquare size={48} className="mx-auto mb-4 text-[#330020]" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#330020]">
                                            No enquiry logs found for this customer
                                        </p>
                                    </div>
                                ) : (
                                    enquiries.map((enquiry, idx) => (
                                        <div 
                                            key={`usr-enq-${enquiry._id || idx}`} 
                                            className="bg-white/60 border border-[#330020]/05 rounded-[24px] p-8 shadow-[0_8px_25px_rgba(51,0,32,0.02)] hover:shadow-[0_12px_35px_rgba(51,0,32,0.06)] transition-all duration-300 relative group"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="font-sans text-[11px] font-bold text-[#330020]/40 uppercase tracking-[1px]">
                                                        ID: #{enquiry._id.slice(-8).toUpperCase()}
                                                    </span>
                                                    <div className="w-[1px] h-3 bg-[#330020]/10" />
                                                    <span className="flex items-center gap-1.5 font-sans text-xs font-semibold text-[#330020]/50">
                                                        <Calendar size={13} /> {new Date(enquiry.createdAt || enquiry.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {getStatusBadge(enquiry.status)}
                                                    <Link 
                                                        to="/admin/enquiries" 
                                                        className="p-2 text-[#330020]/20 hover:text-primary hover:bg-[#330020]/05 rounded-xl transition-all"
                                                        title="Manage Enquiries"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Products List in this Enquiry */}
                                            <div className="space-y-4 mb-6">
                                                {enquiry.products?.map((item, idx) => {
                                                    const prod = item.productId || {};
                                                    return (
                                                        <div key={`prod-${idx}`} className="flex items-center justify-between p-4 bg-white/70 rounded-2xl border border-[#330020]/05">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] overflow-hidden border border-[#330020]/05 flex-shrink-0">
                                                                    <SafeImage 
                                                                        src={prod.images || prod.image} 
                                                                        alt={prod.name} 
                                                                        className="w-full h-full object-cover" 
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-sans text-xs font-bold text-[#330020]">{prod.name || 'Deprecated Product'}</p>
                                                                    <p className="font-sans text-[10px] text-[#330020]/40">
                                                                        ₹{prod.price?.toLocaleString('en-IN') || 'Price Request'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <span className="font-serif italic text-xs text-[#330020]/72">
                                                                x{item.quantity}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Enquiry Message */}
                                            {enquiry.message && (
                                                <div className="bg-[#FAF6F0]/60 p-4 rounded-xl border border-[#330020]/05 text-xs text-[#330020]/72 font-sans italic leading-relaxed">
                                                    "{enquiry.message}"
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Partner Sidebar */}
                    <div className="space-y-8">
                        {/* Profile Info Card */}
                        <div className="bg-white/82 backdrop-blur-md border border-[#330020]/08 rounded-[28px] p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)]">
                            <h4 className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-8">
                                Customer Profile
                            </h4>
                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-[#330020]/20 shrink-0 border border-[#330020]/10">
                                        <User size={20} strokeWidth={1.5} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-sans text-[10px] font-bold text-[#330020]/40 uppercase tracking-[1px] mb-1">Full Name</p>
                                        <p className="font-sans text-[14px] font-semibold text-[#330020] truncate">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-[#330020]/20 shrink-0 border border-[#330020]/10">
                                        <Package size={20} strokeWidth={1.5} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-sans text-[10px] font-bold text-[#330020]/40 uppercase tracking-[1px] mb-1">Design Preferences</p>
                                        <p className="font-sans text-[14px] font-semibold text-[#8A8F68] truncate">{user.preferences || 'None Saved'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-[#330020]/20 shrink-0 border border-[#330020]/10">
                                        <Mail size={20} strokeWidth={1.5} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-sans text-[10px] font-bold text-[#330020]/40 uppercase tracking-[1px] mb-1">Communication</p>
                                        <p className="font-sans text-[14px] font-semibold text-[#330020] truncate">{user.email}</p>
                                    </div>
                                </div>
                                {user.phone && (
                                    <div className="flex gap-5">
                                        <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-[#330020]/20 shrink-0 border border-[#330020]/10">
                                            <Phone size={20} strokeWidth={1.5} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-sans text-[10px] font-bold text-[#330020]/40 uppercase tracking-[1px] mb-1">Direct Line</p>
                                            <p className="font-sans text-[14px] font-semibold text-[#330020] truncate">{user.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Saved Addresses Card */}
                        <div className="bg-white/82 backdrop-blur-md border border-[#330020]/08 rounded-[28px] p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)]">
                            <h4 className="block font-sans text-[11px] font-bold tracking-[3px] uppercase text-[#330020]/60 mb-8 flex items-center gap-2">
                                <MapPin size={14} className="text-[#330020]/30" /> Saved Locations
                            </h4>
                            <div className="space-y-6">
                                {!user.addresses || user.addresses.length === 0 ? (
                                    <p className="text-[10px] font-sans font-bold text-[#330020]/30 uppercase tracking-[1px] text-center py-4">
                                        No addresses saved
                                    </p>
                                ) : (
                                    user.addresses.map((addr, idx) => (
                                        <div key={idx} className="bg-[#FAF6F0]/40 p-5 rounded-2xl border border-[#330020]/05 relative group">
                                            <p className="font-sans text-[11px] font-bold text-[#330020] mb-1">
                                                {addr.city}, {addr.state}
                                            </p>
                                            <p className="font-sans text-[10px] text-[#330020]/60 leading-relaxed">
                                                {addr.fullAddress}
                                            </p>
                                            <p className="font-sans text-[9px] font-bold text-[#8A8F68] uppercase tracking-[1px] mt-2">
                                                PIN: {addr.pincode}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserDetails;

import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/layout/Layout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import toast from 'react-hot-toast';
import { 
    User as UserIcon, 
    Package, 
    Heart, 
    MapPin, 
    Settings, 
    Calendar, 
    Plus, 
    Trash2, 
    Edit, 
    Lock, 
    Clock, 
    CheckCircle2, 
    X,
    Eye,
    MessageSquare,
    Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '../../components/common/SafeImage';

const Dashboard = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Active Dashboard Tab
    const [activeTab, setActiveTab] = useState('profile');

    // Data States
    const [profileDetails, setProfileDetails] = useState(null);
    const [enquiries, setEnquiries] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [loadingEnquiries, setLoadingEnquiries] = useState(true);

    // Form States
    const [profileForm, setProfileForm] = useState({ name: '', preferences: '', phone: '' });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [addressForm, setAddressForm] = useState({ fullAddress: '', city: '', state: '', pincode: '', landmark: '' });
    
    // UI Modal States
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [submittingAddress, setSubmittingAddress] = useState(false);
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingPassword, setSubmittingPassword] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfileData();
        fetchEnquiries();
    }, [user, navigate]);

    const fetchProfileData = async () => {
        setLoadingDetails(true);
        try {
            const { data } = await api.get('/users/profile');
            setProfileDetails(data);
            setProfileForm({
                name: data.name || '',
                preferences: data.preferences || '',
                phone: data.phone || ''
            });
        } catch (error) {
            toast.error('Failed to load profile details');
        } finally {
            setLoadingDetails(false);
        }
    };

    const fetchEnquiries = async () => {
        setLoadingEnquiries(true);
        try {
            const { data } = await api.get('/enquiries/my');
            setEnquiries(data);
        } catch (error) {
            toast.error('Failed to load enquiries');
        } finally {
            setLoadingEnquiries(false);
        }
    };

    const handleCancelEnquiry = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this enquiry?')) return;
        try {
            await api.put(`/enquiries/${id}/cancel`);
            toast.success('Enquiry cancelled successfully');
            fetchEnquiries();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel enquiry');
        }
    };

    // Update Profile Handler
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSubmittingProfile(true);
        try {
            const { data } = await api.put('/users/profile', profileForm);
            updateUser({ name: data.name, preferences: data.preferences, phone: data.phone });
            setProfileDetails(prev => ({ ...prev, ...data }));
            toast.success('Profile details updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSubmittingProfile(false);
        }
    };

    // Update Password Handler
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        setSubmittingPassword(true);
        try {
            await api.put('/users/profile/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            toast.success('Password updated successfully');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setSubmittingPassword(false);
        }
    };

    // Address Actions
    const handleOpenAddressModal = (address = null) => {
        if (address) {
            setEditingAddressId(address._id);
            setAddressForm({
                fullAddress: address.fullAddress,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                landmark: address.landmark || ''
            });
        } else {
            setEditingAddressId(null);
            setAddressForm({ fullAddress: '', city: '', state: '', pincode: '', landmark: '' });
        }
        setIsAddressModalOpen(true);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setSubmittingAddress(true);
        try {
            let updatedAddresses;
            if (editingAddressId) {
                const { data } = await api.put(`/users/profile/addresses/${editingAddressId}`, addressForm);
                updatedAddresses = data;
                toast.success('Address updated successfully');
            } else {
                const { data } = await api.post('/users/profile/addresses', addressForm);
                updatedAddresses = data;
                toast.success('Address added successfully');
            }
            setProfileDetails(prev => ({ ...prev, addresses: updatedAddresses }));
            setIsAddressModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save address');
        } finally {
            setSubmittingAddress(false);
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            const { data } = await api.delete(`/users/profile/addresses/${addressId}`);
            setProfileDetails(prev => ({ ...prev, addresses: data }));
            toast.success('Address deleted successfully');
        } catch (error) {
            toast.error('Failed to delete address');
        }
    };

    // Remove Wishlist Item
    const handleRemoveWishlistItem = async (productId) => {
        try {
            await api.post('/users/profile/saved-items', { productId });
            setProfileDetails(prev => ({
                ...prev,
                savedItems: prev.savedItems.filter(item => item._id !== productId)
            }));
            toast.success('Piece removed from Wishlist');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    // Helper functions for enquiry mapping
    const mapStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'contacted': return 'Contacted';
            case 'confirmed': return 'Confirmed';
            case 'cancelled': return 'Cancelled';
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
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100/50';
            case 'completed':
            case 'rejected': 
                return 'bg-zinc-50 text-zinc-600 border-zinc-100/50';
            default: return 'bg-zinc-50 text-zinc-600 border-zinc-100/50';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-amber-500 shrink-0" />;
            case 'contacted': return <MessageSquare size={16} className="text-blue-500 shrink-0" />;
            case 'confirmed': return <CheckCircle2 size={16} className="text-green-500 shrink-0" />;
            case 'cancelled': return <X size={16} className="text-red-500 shrink-0" />;
            default: return <Clock size={16} className="text-zinc-500 shrink-0" />;
        }
    };

    const sidebarItems = [
        { id: 'profile', name: 'My Profile', icon: UserIcon },
        { id: 'enquiries', name: 'Consultation Requests', icon: Package, badge: enquiries.length },
        { id: 'saved', name: 'Wishlist', icon: Heart, badge: profileDetails?.savedItems?.length || 0 },
        { id: 'addresses', name: 'Delivery Addresses', icon: MapPin },
        { id: 'settings', name: 'Account Settings', icon: Settings }
    ];

    return (
        <Layout title={`My Account`}>
            <div className="bg-[#F6F1EB] min-h-screen pt-32 pb-24 text-[#330020] font-sans">
                <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
                    
                    {/* Header Greetings Section */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#330020]/10 pb-10">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-[#330020] mb-2.5">
                                Greetings, <span className="italic font-light">{user?.name.split(' ')[0]}</span>
                            </h1>
                            <p className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-[0.25em]">
                                Welcome back to your personal design consultation portfolio
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs bg-white/55 border border-[#330020]/10 px-6 py-3.5 rounded-2xl shadow-sm self-start md:self-auto backdrop-blur-md">
                            <Calendar size={14} className="text-[#8A8F68]" />
                            <span className="text-[#330020]/48 uppercase font-black text-[9px] tracking-wider">Joined:</span>
                            <span className="text-[#330020] font-bold">
                                {profileDetails ? new Date(profileDetails.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '...'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
                        
                        {/* SIDEBAR NAVIGATION */}
                        <aside className="flex flex-col gap-2">
                            {/* Mobile Tabs Rail */}
                            <div className="flex lg:hidden overflow-x-auto pb-4 gap-3 scrollbar-hide px-1">
                                {sidebarItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center gap-3 px-5 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border whitespace-nowrap shrink-0 ${
                                            activeTab === item.id 
                                                ? 'bg-[#330020] text-[#F6F1EB] border-transparent shadow-md' 
                                                : 'bg-white/55 text-[#330020]/60 border-[#330020]/10 hover:text-[#330020] hover:bg-white'
                                        }`}
                                    >
                                        <item.icon size={13} />
                                        <span>{item.name}</span>
                                        {item.badge > 0 && (
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${activeTab === item.id ? 'bg-[#F6F1EB] text-[#330020]' : 'bg-[#330020]/10 text-[#330020]'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Desktop Sidebar */}
                            <div className="hidden lg:flex flex-col bg-white/55 border border-[#330020]/10 p-5 rounded-[2rem] shadow-soft backdrop-blur-md">
                                {sidebarItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex items-center justify-between w-full p-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 group cursor-pointer ${
                                            activeTab === item.id 
                                                ? 'bg-[#330020] text-[#F6F1EB] border-l-4 border-[#8A8F68] rounded-r-xl rounded-l-none' 
                                                : 'text-[#330020]/50 hover:text-[#330020] hover:bg-[#330020]/5 border-l-4 border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <item.icon size={14} className={`transition-transform duration-300 ${activeTab === item.id ? 'text-[#8A8F68]' : 'text-[#330020]/48'}`} />
                                            <span>{item.name}</span>
                                        </div>
                                        {item.badge > 0 && (
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-normal ${activeTab === item.id ? 'bg-[#8A8F68] text-[#F6F1EB]' : 'bg-[#330020]/10 text-[#330020]'}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </aside>

                        {/* CORE WORKSPACE CONTENT AREA */}
                        <main className="bg-white/55 border border-[#330020]/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_40px_rgba(51,0,32,0.08)] backdrop-blur-md min-h-[500px]">
                            <AnimatePresence mode="wait">
                                
                                {/* TAB 1: PROFILE OVERVIEW */}
                                {activeTab === 'profile' && (
                                    <motion.div
                                        key="profile"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-12"
                                    >
                                        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-[#330020]/10 pb-10">
                                            <div className="w-24 h-24 rounded-[2rem] bg-[#330020] text-[#F6F1EB] text-3xl font-serif flex items-center justify-center border border-[#330020]/10 shadow-lg shrink-0">
                                                {user?.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-center md:text-left space-y-2">
                                                <h3 className="text-2xl font-serif text-[#330020]">{user?.name}</h3>
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-[#330020]/60">
                                                    <span>{user?.email}</span>
                                                    {user?.phone && (
                                                        <>
                                                            <span className="w-1.5 h-1.5 bg-[#330020]/30 rounded-full hidden md:inline-block" />
                                                            <span>{user?.phone}</span>
                                                        </>
                                                    )}
                                                    {user?.preferences && (
                                                        <>
                                                            <span className="w-1.5 h-1.5 bg-[#330020]/30 rounded-full hidden md:inline-block" />
                                                            <span className="font-bold text-[#8A8F68]">{user?.preferences}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Summarized Dashboard Statistic Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-6 bg-[#F6F1EB]/50 border border-[#330020]/10 rounded-2xl flex flex-col justify-between h-36 hover:border-[#330020]/30 transition-all">
                                                <Package className="text-[#8A8F68]" size={20} />
                                                <div>
                                                    <p className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest mb-1">Consultation Requests</p>
                                                    <p className="text-3xl font-bold text-[#330020]">{enquiries.length}</p>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-[#F6F1EB]/50 border border-[#330020]/10 rounded-2xl flex flex-col justify-between h-36 hover:border-[#330020]/30 transition-all">
                                                <Heart className="text-[#8A8F68]" size={20} />
                                                <div>
                                                    <p className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest mb-1">Wishlist Items</p>
                                                    <p className="text-3xl font-bold text-[#330020]">{profileDetails?.savedItems?.length || 0}</p>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-[#F6F1EB]/50 border border-[#330020]/10 rounded-2xl flex flex-col justify-between h-36 hover:border-[#330020]/30 transition-all">
                                                <MapPin className="text-[#8A8F68]" size={20} />
                                                <div>
                                                    <p className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest mb-1">Delivery Addresses</p>
                                                    <p className="text-3xl font-bold text-[#330020]">{profileDetails?.addresses?.length || 0}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recently Viewed Tracks Section */}
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-lg font-serif text-[#330020] mb-1">Recently Viewed Pieces</h4>
                                                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/48">Your explored statement objects</p>
                                            </div>
                                            
                                            {loadingDetails ? (
                                                <div className="flex justify-center py-10">
                                                    <Loader2 className="animate-spin text-[#8A8F68]" size={24} />
                                                </div>
                                            ) : !profileDetails?.recentlyViewed || profileDetails.recentlyViewed.length === 0 ? (
                                                <div className="text-center p-10 bg-[#F6F1EB]/50 border border-dashed border-[#330020]/10 rounded-2xl text-xs text-[#330020]/60">
                                                    Your recently viewed pieces will populate here as you explore the catalog.
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {profileDetails.recentlyViewed.map((item, idx) => (
                                                        <Link 
                                                            key={`recent-${item._id || 'id'}-${idx}`} 
                                                            to={`/products/${item.slug}`}
                                                            className="group bg-white/55 p-2.5 rounded-xl border border-[#330020]/10 flex flex-col h-full hover:shadow-[0_20px_40px_rgba(51,0,32,0.08)] hover:-translate-y-1 transition-all duration-300"
                                                        >
                                                            <div className="w-full aspect-[4/5] bg-[#F6F1EB] rounded-lg overflow-hidden border border-[#330020]/10 mb-3">
                                                                <SafeImage 
                                                                    src={item.images?.[0]?.url || item.image} 
                                                                    alt={item.name} 
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                                                />
                                                            </div>
                                                            <div className="px-1 flex-1 flex flex-col">
                                                                <h5 className="text-[11px] font-bold text-[#330020] truncate group-hover:text-[#4A012E] transition-colors leading-tight mb-1">{item.name}</h5>
                                                                <p className="text-[10px] text-[#330020]/72 font-bold mt-auto">₹{item.price?.toLocaleString('en-IN')}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* TAB 2: MY ENQUIRIES */}
                                {activeTab === 'enquiries' && (
                                    <motion.div
                                        key="enquiries"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-serif text-[#330020] mb-1">Consultation Requests</h3>
                                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/48">Review status logs of your design consultation requests</p>
                                        </div>

                                        {loadingEnquiries ? (
                                            <div className="flex justify-center py-20">
                                                <Loader2 className="animate-spin text-[#8A8F68]" size={36} />
                                            </div>
                                        ) : enquiries.length === 0 ? (
                                            <div className="text-center py-16 bg-[#F6F1EB]/50 rounded-3xl border border-[#330020]/10">
                                                <Package className="mx-auto text-[#330020]/20 mb-4" size={48} strokeWidth={1} />
                                                <h4 className="text-sm font-bold text-[#330020] mb-1">No consultation requests found</h4>
                                                <p className="text-xs text-[#330020]/40 max-w-xs mx-auto leading-relaxed">Request design consultations by exploring the catalog and adding pieces to your consultation list.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 pb-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#330020]/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#330020]/20">
                                                {enquiries.map((enquiry, idx) => (
                                                    <div 
                                                        key={`enq-${enquiry._id || 'id'}-${idx}`}
                                                        className="bg-white/55 rounded-3xl p-6 border border-[#330020]/10 shadow-[0_10px_20px_rgba(51,0,32,0.03)] relative overflow-hidden group"
                                                    >
                                                        {/* Status Accent Top Line */}
                                                        <div className={`absolute top-0 left-0 w-full h-[3px] ${
                                                            enquiry.status === 'confirmed' ? 'bg-green-500' :
                                                            enquiry.status === 'contacted' ? 'bg-blue-500' :
                                                            enquiry.status === 'pending' ? 'bg-amber-500' :
                                                            enquiry.status === 'cancelled' ? 'bg-red-500' :
                                                            'bg-zinc-300'
                                                        }`} />

                                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${getStatusStyles(enquiry.status)} shadow-sm shrink-0`}>
                                                                    {getStatusIcon(enquiry.status)}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2.5 mb-1">
                                                                        <span className="text-xs font-bold text-[#330020] tracking-wider">ENQ-{enquiry._id.slice(-6).toUpperCase()}</span>
                                                                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${getStatusStyles(enquiry.status)}`}>
                                                                            {mapStatusText(enquiry.status)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest">
                                                                        {new Date(enquiry.createdAt || enquiry.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="bg-[#F6F1EB]/60 border border-[#330020]/10 px-4 py-2 rounded-xl text-right">
                                                                <p className="text-[7px] font-bold text-[#330020]/48 uppercase tracking-[0.2em]">Total</p>
                                                                <p className="text-sm font-bold text-[#330020]">{enquiry.products.length} Items</p>
                                                            </div>
                                                        </div>

                                                        {/* Products layout inside enquiry */}
                                                        <div className="bg-[#F6F1EB]/40 rounded-2xl p-4 border border-[#330020]/10 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                                            {enquiry.products.map((item, idx) => (
                                                                <div key={`enq-prod-${item.productId?._id || 'id'}-${idx}`} className="bg-white/55 p-2.5 rounded-xl border border-[#330020]/10 flex items-center gap-3">
                                                                    <div className="w-10 h-12 bg-[#F6F1EB] rounded-lg overflow-hidden shrink-0 border border-[#330020]/10">
                                                                        <SafeImage 
                                                                            src={item.productId?.images?.[0]?.url || item.productId?.image} 
                                                                            alt="Product" 
                                                                            className="w-full h-full object-cover" 
                                                                        />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-[11px] font-bold text-[#330020] truncate">{item.productId?.name || 'Mart Piece'}</p>
                                                                        <p className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-wider mt-0.5">
                                                                            Qty: {item.quantity} • <span className="text-[#8A8F68]">₹{item.productId?.price?.toLocaleString('en-IN') || 'N/A'}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {enquiry.note && (
                                                            <p className="text-[10px] text-[#330020]/60 italic font-light mt-4 pt-3.5 border-t border-[#330020]/10">
                                                                "{enquiry.note}"
                                                            </p>
                                                        )}

                                                        {/* Tracker */}
                                                        <div className="mt-6 pt-5 border-t border-[#330020]/10">
                                                            <div className="flex items-center justify-between mb-5">
                                                                <p className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest">Progress Tracker</p>
                                                                {(enquiry.status === 'pending' || enquiry.status === 'contacted') && (
                                                                    <button
                                                                        onClick={() => handleCancelEnquiry(enquiry._id)}
                                                                        className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 border border-transparent hover:border-red-100"
                                                                    >
                                                                        <X size={12} /> Cancel Request
                                                                    </button>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="relative flex justify-between items-center w-full px-2">
                                                                <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-0.5 bg-[#330020]/5 z-0" />
                                                                {['pending', 'contacted', 'confirmed', 'completed'].map((step, stepIdx) => {
                                                                    const stages = ['pending', 'contacted', 'confirmed', 'completed'];
                                                                    const currentStageIdx = stages.indexOf(enquiry.status);
                                                                    const thisStageIdx = stages.indexOf(step);
                                                                    
                                                                    const isCompleted = currentStageIdx > thisStageIdx && enquiry.status !== 'cancelled';
                                                                    const isActive = enquiry.status === step;
                                                                    const isCancelled = enquiry.status === 'cancelled';

                                                                    return (
                                                                        <div key={`step-${step}-${stepIdx}`} className="relative z-10 flex flex-col items-center gap-2">
                                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${
                                                                                isActive ? 'bg-[#330020] text-white shadow-[0_0_15px_rgba(51,0,32,0.3)] scale-110' : 
                                                                                isCompleted ? 'bg-[#8A8F68] text-white border border-[#8A8F68]' : 
                                                                                isCancelled ? 'bg-white border-2 border-[#330020]/5 text-[#330020]/20' :
                                                                                'bg-white border-2 border-[#330020]/10 text-[#330020]/20'
                                                                            }`}>
                                                                                {isCompleted ? <CheckCircle2 size={12} /> : isActive ? <Clock size={12} className={isActive && !isCompleted ? "animate-pulse" : ""} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                                                            </div>
                                                                            <span className={`text-[8px] font-bold uppercase tracking-wider ${isActive ? 'text-[#330020]' : 'text-[#330020]/40'}`}>
                                                                                {step}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* TAB 3: SAVED PIECES */}
                                {activeTab === 'saved' && (
                                    <motion.div
                                        key="saved"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-serif text-[#330020] mb-1">Wishlist</h3>
                                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/48">Your curated luxury wishlist</p>
                                        </div>

                                        {loadingDetails ? (
                                            <div className="flex justify-center py-20">
                                                <Loader2 className="animate-spin text-[#8A8F68]" size={36} />
                                            </div>
                                        ) : !profileDetails?.savedItems || profileDetails.savedItems.length === 0 ? (
                                            <div className="text-center py-16 bg-[#F6F1EB]/50 rounded-3xl border border-[#330020]/10">
                                                <Heart className="mx-auto text-[#330020]/20 mb-4" size={48} strokeWidth={1} />
                                                <h4 className="text-sm font-bold text-[#330020] mb-1">Your wishlist is empty</h4>
                                                <p className="text-xs text-[#330020]/40 max-w-xs mx-auto leading-relaxed">Save statement objects during browsing by clicking the Heart icon.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {profileDetails.savedItems.map((item, idx) => (
                                                    <div 
                                                        key={`saved-${item._id || 'id'}-${idx}`}
                                                        className="group bg-white/55 p-3 rounded-2xl border border-[#330020]/10 flex flex-col h-full shadow-sm hover:shadow-[0_20px_40px_rgba(51,0,32,0.08)] hover:-translate-y-1 transition-all duration-500"
                                                    >
                                                        <div className="relative w-full aspect-[4/5] bg-[#F6F1EB] rounded-xl overflow-hidden mb-4 border border-[#330020]/10">
                                                            <SafeImage 
                                                                src={item.images?.[0]?.url || item.image} 
                                                                alt={item.name} 
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                                            />
                                                            <button 
                                                                onClick={() => handleRemoveWishlistItem(item._id)}
                                                                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#F6F1EB]/95 border border-[#330020]/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-red-500 hover:bg-red-50 cursor-pointer shadow-sm z-10"
                                                            >
                                                                <X size={12} strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                        <div className="px-1 flex-1 flex flex-col">
                                                            <span className="text-[8px] uppercase tracking-widest text-[#8A8F68] font-black mb-1">
                                                                {item.category?.name || 'Artisan Work'}
                                                            </span>
                                                            <h5 className="text-[13px] font-bold text-[#330020] truncate leading-tight mb-2 group-hover:text-[#4A012E] transition-colors">{item.name}</h5>
                                                            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#330020]/10">
                                                                <span className="text-xs font-black text-[#330020]">₹{item.price?.toLocaleString('en-IN')}</span>
                                                                <Link 
                                                                    to={`/products/${item.slug}`}
                                                                    className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-[#330020] hover:text-[#330020] transition-colors"
                                                                >
                                                                    <Eye size={10} /> View
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* TAB 4: ADDRESS BOOK */}
                                {activeTab === 'addresses' && (
                                    <motion.div
                                        key="addresses"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-end justify-between border-b border-[#330020]/10 pb-6">
                                            <div>
                                                <h3 className="text-2xl font-serif text-[#330020] mb-1">Delivery Addresses</h3>
                                                <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/48">Manage your saved delivery locations</p>
                                            </div>
                                            <button
                                                onClick={() => handleOpenAddressModal()}
                                                className="h-10 px-6 rounded-full bg-[#330020] text-[#F6F1EB] text-[8px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#4A1132] transition-colors cursor-pointer"
                                            >
                                                <Plus size={12} /> Add New
                                            </button>
                                        </div>

                                        {loadingDetails ? (
                                            <div className="flex justify-center py-20">
                                                <Loader2 className="animate-spin text-[#8A8F68]" size={36} />
                                            </div>
                                        ) : !profileDetails?.addresses || profileDetails.addresses.length === 0 ? (
                                            <div className="text-center py-16 bg-[#F6F1EB]/50 rounded-3xl border border-[#330020]/10">
                                                <MapPin className="mx-auto text-[#330020]/20 mb-4" size={48} strokeWidth={1} />
                                                <h4 className="text-sm font-bold text-[#330020] mb-1">No addresses found</h4>
                                                <p className="text-xs text-[#330020]/40 max-w-xs mx-auto leading-relaxed">Save delivery details here to quickly populate checkout details.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {profileDetails.addresses.map((address, idx) => (
                                                    <div 
                                                        key={`address-${address._id || 'id'}-${idx}`}
                                                        className="bg-white/55 p-6 rounded-2xl border border-[#330020]/10 shadow-sm flex flex-col justify-between min-h-[160px]"
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2.5 text-[#330020]/48 uppercase font-black tracking-widest text-[8px] mb-3">
                                                                <MapPin size={10} className="text-[#8A8F68]" /> Delivery Address
                                                            </div>
                                                            <p className="text-xs font-bold text-[#330020] mb-1">{address.fullAddress}</p>
                                                            <p className="text-xs text-[#330020]/60 font-medium">
                                                                {address.city}, {address.state} - <span className="font-bold text-[#330020]">{address.pincode}</span>
                                                            </p>
                                                            {address.landmark && (
                                                                <p className="text-[10px] text-[#330020]/60 italic mt-2">Landmark: "{address.landmark}"</p>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-end gap-5 mt-6 pt-4 border-t border-[#330020]/10">
                                                            <button 
                                                                onClick={() => handleOpenAddressModal(address)}
                                                                className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-[#330020]/60 hover:text-[#330020] transition-colors cursor-pointer"
                                                            >
                                                                <Edit size={10} /> Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteAddress(address._id)}
                                                                className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 size={10} /> Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* TAB 5: ACCOUNT SETTINGS */}
                                {activeTab === 'settings' && (
                                    <motion.div
                                        key="settings"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.5 }}
                                        className="space-y-12"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-serif text-[#330020] mb-1">Account Settings</h3>
                                            <p className="text-[10px] font-bold text-[#330020]/48 uppercase tracking-widest">Manage your personal details and saved preferences.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            
                                            {/* Profile Update Form */}
                                            <div className="space-y-6">
                                                <h4 className="text-md font-serif text-[#330020] border-b border-[#330020]/10 pb-3 flex items-center gap-3">
                                                    <UserIcon size={16} className="text-[#8A8F68]" /> Personal Details
                                                </h4>
                                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                                    <div>
                                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Full Name</label>
                                                        <input 
                                                            type="text" 
                                                            value={profileForm.name}
                                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                            required
                                                            placeholder="Full Name"
                                                            className="w-full bg-[#F6F1EB] border border-[#330020]/10 focus:border-[#8A8F68]/40 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-bold focus:ring-0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Email Address</label>
                                                        <input 
                                                            type="email" 
                                                            value={user?.email || ''}
                                                            readOnly={user?.provider !== 'local'}
                                                            disabled={user?.provider !== 'local'}
                                                            className={`w-full border border-[#330020]/10 focus:border-[#8A8F68]/40 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-bold focus:ring-0 ${user?.provider !== 'local' ? 'bg-[#F6F1EB]/50 cursor-not-allowed opacity-70' : 'bg-[#F6F1EB]'}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Phone Number</label>
                                                        <input 
                                                            type="text" 
                                                            value={profileForm.phone}
                                                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                            placeholder="Phone Number"
                                                            className="w-full bg-[#F6F1EB] border border-[#330020]/10 focus:border-[#8A8F68]/40 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-bold focus:ring-0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Design Preferences (Optional)</label>
                                                        <input 
                                                            type="text" 
                                                            value={profileForm.preferences || ''}
                                                            onChange={(e) => setProfileForm({ ...profileForm, preferences: e.target.value })}
                                                            placeholder="e.g. Minimalist, Heritage, Mid-Century Modern"
                                                            className="w-full bg-[#F6F1EB] border border-[#330020]/10 focus:border-[#8A8F68]/40 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-bold focus:ring-0"
                                                        />
                                                    </div>
                                                    <button 
                                                        type="submit"
                                                        disabled={submittingProfile}
                                                        className="h-12 w-full rounded-xl bg-[#330020] text-[#F6F1EB] text-[8px] font-bold uppercase tracking-widest flex items-center justify-center hover:bg-[#4A1132] transition-colors disabled:opacity-50 cursor-pointer mt-4"
                                                    >
                                                        {submittingProfile ? <Loader2 size={12} className="animate-spin" /> : 'Save Changes'}
                                                    </button>
                                                </form>
                                            </div>

                                            {/* Password Update Form (Only for local provider accounts) */}
                                            {user?.provider === 'local' ? (
                                                <div className="space-y-6">
                                                    <h4 className="text-md font-serif text-[#330020] border-b border-[#330020]/10 pb-3 flex items-center gap-3">
                                                        <Lock size={16} className="text-[#8A8F68]" /> Credentials & Security
                                                    </h4>
                                                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                                                        <div>
                                                            <label className="block text-[8px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Current Password</label>
                                                            <input 
                                                                type="password" 
                                                                value={passwordForm.currentPassword}
                                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                                required
                                                                placeholder="••••••••"
                                                                className="w-full bg-[#F6F1EB] border border-[#330020]/10 focus:border-[#8A8F68]/40 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] focus:ring-0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[8px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">New Password</label>
                                                            <input 
                                                                type="password" 
                                                                value={passwordForm.newPassword}
                                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                                required
                                                                placeholder="••••••••"
                                                                className="w-full bg-[#F6F1EB] border border-[#330020]/10 focus:border-[#8A8F68]/40 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] focus:ring-0"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[8px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Confirm New Password</label>
                                                            <input 
                                                                type="password" 
                                                                value={passwordForm.confirmPassword}
                                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                                required
                                                                placeholder="••••••••"
                                                                className="w-full bg-[#F6F1EB] border border-[#330020]/10 focus:border-[#8A8F68]/40 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] focus:ring-0"
                                                            />
                                                        </div>
                                                        <button 
                                                            type="submit"
                                                            disabled={submittingPassword}
                                                            className="h-12 w-full rounded-xl bg-[#330020] text-[#F6F1EB] text-[8px] font-bold uppercase tracking-widest flex items-center justify-center hover:bg-[#4A1132] transition-colors disabled:opacity-50 cursor-pointer mt-4"
                                                        >
                                                            {submittingPassword ? <Loader2 size={12} className="animate-spin" /> : 'Update Password'}
                                                        </button>
                                                    </form>
                                                </div>
                                            ) : (
                                                <div className="p-6 bg-[#F6F1EB]/50 rounded-2xl border border-[#330020]/10 flex items-center justify-center text-center">
                                                    <p className="text-xs text-[#330020]/60 italic leading-relaxed">
                                                        Your account is securely connected with Google sign-in. Password management is handled through your Google account.
                                                    </p>
                                                </div>
                                            )}

                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </main>
                    </div>

                </div>
            </div>

            {/* Glassmorphic Address Modal Popup dialog box */}
            <AnimatePresence>
                {isAddressModalOpen && (
                    <div className="fixed inset-0 bg-[#330020]/20 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#F6F1EB] max-w-md w-full rounded-[2.5rem] border border-[#330020]/10 p-8 md:p-10 shadow-premium relative"
                        >
                            <button 
                                onClick={() => setIsAddressModalOpen(false)}
                                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/55 flex items-center justify-center border border-[#330020]/10 text-[#330020]/70 hover:text-[#330020] hover:scale-105 cursor-pointer transition-all shadow-sm"
                            >
                                <X size={14} />
                            </button>
                            
                            <h3 className="text-xl font-serif text-[#330020] mb-2">{editingAddressId ? 'Update Delivery Location' : 'Add Delivery Location'}</h3>
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#330020]/48 mb-8">Save shipping addresses for seamless consultation bookings</p>

                            <form onSubmit={handleSaveAddress} className="space-y-4">
                                <div>
                                    <label className="block text-[8px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Street/Full Address</label>
                                    <input 
                                        type="text" 
                                        value={addressForm.fullAddress}
                                        onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
                                        required
                                        placeholder="Flat/House no., Building, Street Name"
                                        className="w-full bg-[#F6F1EB]/40 border border-[#330020]/10 focus:border-[#8A8F68]/20 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-medium focus:ring-0"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">City</label>
                                        <input 
                                            type="text" 
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                            required
                                            placeholder="City"
                                            className="w-full bg-[#F6F1EB]/40 border border-[#330020]/10 focus:border-[#8A8F68]/20 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-medium focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">State</label>
                                        <input 
                                            type="text" 
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                            required
                                            placeholder="State"
                                            className="w-full bg-[#F6F1EB]/40 border border-[#330020]/10 focus:border-[#8A8F68]/20 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-medium focus:ring-0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Pincode</label>
                                        <input 
                                            type="text" 
                                            value={addressForm.pincode}
                                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                            required
                                            placeholder="Pincode"
                                            className="w-full bg-[#F6F1EB]/40 border border-[#330020]/10 focus:border-[#8A8F68]/20 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-medium focus:ring-0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-bold uppercase tracking-widest text-[#330020]/48 mb-2">Landmark (Optional)</label>
                                        <input 
                                            type="text" 
                                            value={addressForm.landmark}
                                            onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                                            placeholder="e.g. Near central park"
                                            className="w-full bg-[#F6F1EB]/40 border border-[#330020]/10 focus:border-[#8A8F68]/20 rounded-xl px-4 py-3.5 text-xs outline-none transition-all placeholder:text-[#330020]/30 text-[#330020] font-medium focus:ring-0"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    disabled={submittingAddress}
                                    className="h-12 w-full rounded-xl bg-[#330020] text-[#F6F1EB] text-[8px] font-bold uppercase tracking-widest flex items-center justify-center hover:bg-[#4A1132] transition-colors disabled:opacity-50 cursor-pointer mt-6"
                                >
                                    {submittingAddress ? <Loader2 size={12} className="animate-spin" /> : editingAddressId ? 'Update Location' : 'Save Location'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
};

export default Dashboard;

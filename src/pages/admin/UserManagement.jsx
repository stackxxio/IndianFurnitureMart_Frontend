import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { Link } from 'react-router-dom';
import { 
    User, 
    Mail, 
    Store, 
    ChevronRight, 
    Loader2, 
    ArrowUpRight, 
    Ban, 
    Trash2, 
    ShieldCheck, 
    Phone,
    Search,
    UserPlus,
    Filter,
    ShieldAlert,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const results = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.preferences?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm)
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users');
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (id, isBlocked) => {
        try {
            await api.patch(`/users/${id}/block`);
            toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will permanently delete the user account.')) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error('Delete operation failed');
        }
    };

    return (
        <Layout title="Customer Directory">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1.5">Premium Customers</h1>
                        <p className="font-sans text-sm font-bold text-[#8A8F68] uppercase tracking-[2px]">Manage customer profiles, preferences and design consultation logs</p>
                    </div>
                    <div className="flex bg-white/82 backdrop-blur-md px-8 py-4 rounded-[24px] shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08 items-center gap-6">
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-[#330020]/48 uppercase tracking-widest mb-0.5">Total Customers</p>
                            <p className="text-xl font-bold text-[#330020]">{users.length}</p>
                        </div>
                        <div className="w-[1px] h-8 bg-[#330020]/10" />
                        <div className="text-right">
                            <p className="text-[9px] font-bold text-[#8A8F68]/80 uppercase tracking-widest mb-0.5">Active</p>
                            <p className="text-xl font-bold text-[#8A8F68]">{users.filter(u => !u.isBlocked).length}</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <div className="flex-grow relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#330020]/20" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or design preferences..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-16 pl-16 pr-8 bg-white/75 border border-[#330020]/10 rounded-[20px] outline-none focus:border-[#8A8F68] focus:ring-4 focus:ring-[#8A8F68]/08 transition-all font-sans font-semibold text-sm text-[#330020] placeholder:text-[#330020]/40"
                        />
                    </div>
                    <Button variant="secondary" className="!px-8 !py-4 !text-[11px] !text-[#330020] font-bold !bg-white/80 border border-[#330020]/10 hover:!bg-[#F6F1EB]">
                        <Filter size={14} className="mr-2 text-[#8A8F68]" /> Advanced Filter
                    </Button>
                </div>

                {/* Users Table */}
                <div className="bg-white/82 backdrop-blur-md rounded-[28px] border border-[#330020]/08 shadow-[0_10px_30px_rgba(51,0,32,0.05)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[850px]">
                            <thead>
                                <tr className="bg-[#FAF6F0]/60 font-sans text-[11px] font-bold uppercase tracking-[2px] text-[#330020]/60 border-b border-[#330020]/5">
                                    <th className="px-8 py-6">Customer Details</th>
                                    <th className="px-6 py-6">Contact Info</th>
                                    <th className="px-6 py-6">Design Preferences</th>
                                    <th className="px-6 py-6">Auth Method</th>
                                    <th className="px-6 py-6">Account Status</th>
                                    <th className="px-6 py-6">Enquiries</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#330020]/5">
                                {loading ? (
                                    <tr><td colSpan="7" className="py-32 text-center"><Loader2 className="animate-spin inline text-[#330020]/20" size={32} /></td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan="7" className="py-32 text-center opacity-20"><User size={48} className="mx-auto mb-4 text-[#330020]" /><p className="text-[10px] font-bold uppercase tracking-widest text-[#330020]">No premium customers found matching your search</p></td></tr>
                                ) : filteredUsers.map((user, idx) => (
                                    <tr key={`user-${user._id || idx}`} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-6">
                                                <div className="relative flex-shrink-0">
                                                    <div className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-transform duration-500 group-hover:scale-105 ${user.isBlocked ? 'border-[#330020]/5' : 'border-[#8A8F68]/20'}`}>
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className={`w-full h-full flex items-center justify-center font-serif text-lg font-bold ${user.isBlocked ? 'bg-surface text-primary/20' : 'bg-[#8A8F68]/5 text-[#8A8F68]'}`}>
                                                                {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {!user.isBlocked && <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-[#8A8F68] border-2 border-white rounded-full shadow-soft" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <h5 className={`font-sans font-semibold text-[16px] tracking-tight mb-1 truncate ${user.isBlocked ? 'text-[#330020]/30 line-through' : 'text-[#330020]'}`}>
                                                        {user.name}
                                                    </h5>
                                                    <p className="font-sans text-[9px] font-bold text-[#330020]/48 uppercase tracking-[1px] truncate">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2 font-sans text-xs font-semibold text-[#330020]/72">
                                                    <Mail size={12} className="text-[#330020]/20" /> {user.email}
                                                </div>
                                                <div className="flex items-center gap-2 font-sans text-[10px] font-bold text-[#330020]/48 uppercase tracking-[1px]">
                                                    <Phone size={12} className="text-[#330020]/20" /> {user.phone || 'Silent'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-sans text-xs font-bold text-[#8A8F68] truncate max-w-[180px] block">
                                                {user.preferences || 'None Saved'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge variant="neutral" className="!text-[8px] !bg-white/80 border border-[#330020]/10">
                                                {user.provider === 'google' ? (
                                                    <span className="flex items-center gap-2">
                                                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                                                        Google Auth
                                                    </span>
                                                ) : 'Email/Password'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            {user.isBlocked ? (
                                                <Badge variant="error" className="!px-3 !py-1.5 !text-[9px]">
                                                    Suspended
                                                </Badge>
                                            ) : (
                                                <Badge variant="success" className="!px-3 !py-1.5 !text-[9px]">
                                                    Active
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-sans text-[18px] font-bold text-[#330020]">{user.enquiryCount || 0}</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    to={`/admin/users/${user._id}`}
                                                    className="p-3 text-[#330020]/48 hover:text-[#330020] hover:bg-[#330020]/5 hover:shadow-soft rounded-xl transition-all"
                                                    title="View Customer Details"
                                                >
                                                    <ArrowUpRight size={18} />
                                                </Link>
                                                <button 
                                                    onClick={() => handleBlock(user._id, user.isBlocked)}
                                                    className={`p-3 rounded-xl transition-all ${user.isBlocked ? 'text-green-500 bg-green-50' : 'text-[#330020]/48 hover:text-[#330020] hover:bg-[#330020]/5'}`}
                                                    title={user.isBlocked ? 'Unblock Customer' : 'Block Customer'}
                                                >
                                                    <Ban size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user._id)}
                                                    className="p-3 text-[#330020]/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Customer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserManagement;

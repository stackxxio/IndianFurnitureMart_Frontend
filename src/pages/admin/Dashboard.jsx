import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../api';
import { 
    Users, 
    Package, 
    MessageCircle, 
    Activity,
    TrendingUp,
    ArrowUpRight,
    Clock,
    ShieldCheck,
    AlertCircle,
    Loader2,
    Calendar,
    ArrowRight,
    ArrowDownRight,
    Search,
    Sofa,
    MessageSquare
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const placeholderData = [
    { name: 'Week 1', total: 12, confirmed: 8 },
    { name: 'Week 2', total: 18, confirmed: 12 },
    { name: 'Week 3', total: 24, confirmed: 15 },
    { name: 'Week 4', total: 20, confirmed: 14 },
];

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalEnquiries: 0,
        pendingEnquiries: 0,
        completedEnquiries: 0,
        totalDebit: 0,
        totalCredit: 0,
        totalPreviousBalance: 0,
        todayRevenue: 0,
        monthlyRevenue: 0,
        totalConfirmed: 0,
        trends: { users: 0, products: 0, enquiries: 0, revenue: 0 },
        recentEnquiries: [],
        activities: [],
        chartData: []
    });
    const [period, setPeriod] = useState('weekly');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        try {
            const { data } = await api.get(`/transactions/stats?period=${period}`);
            setStats(data);
        } catch (error) {
            console.error('Stats error', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { 
            label: 'Total Customers', 
            value: stats.totalUsers || 0, 
            narration: 'Registered luxury clients',
            icon: Users, 
            trend: stats.trends?.users || 0,
            link: '/admin/users'
        },
        { 
            label: 'Total Products', 
            value: stats.totalProducts || 0, 
            narration: 'Curated mart pieces',
            icon: Package, 
            trend: stats.trends?.products || 0,
            link: '/admin/products'
        },
        { 
            label: 'Active Enquiries', 
            value: stats.totalEnquiries || 0, 
            narration: 'Pending consultation requests',
            icon: MessageCircle, 
            trend: stats.trends?.enquiries || 0,
            link: '/admin/enquiries'
        },
        { 
            label: 'Monthly Growth', 
            value: `${(stats.trends?.revenue || 0) >= 0 ? '+' : ''}${stats.trends?.revenue || 0}%`, 
            narration: 'Mart engagement analytics',
            icon: TrendingUp, 
            trend: stats.trends?.revenue || 0,
            link: '/admin/dashboard',
            featured: true
        },
        { 
            label: 'Featured Collections', 
            value: stats.featuredCollectionsCount || 8, 
            narration: 'Highlighted premium spaces',
            icon: Sofa, 
            trend: 0,
            link: '/admin/products'
        },
    ];

    if (loading && stats.chartData.length === 0) {
        return (
            <Layout title="Dashboard">
                <div className="min-h-[60vh] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary/20" size={40} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Command Center">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="font-serif text-3xl font-semibold text-[#330020] mb-1.5">Overview</h1>
                        <p className="font-sans text-sm font-bold text-[#8A8F68] uppercase tracking-[3px]">Real-time statistics and system activity</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white/80 p-1 rounded-xl border border-[#330020]/10">
                            <button 
                                onClick={() => setPeriod('weekly')}
                                className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${period === 'weekly' ? 'bg-[#330020] shadow-soft text-[#FAF6F0]' : 'text-[#330020]/40 hover:text-[#330020]'}`}
                            >
                                Weekly
                            </button>
                            <button 
                                onClick={() => setPeriod('monthly')}
                                className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${period === 'monthly' ? 'bg-[#330020] shadow-soft text-[#FAF6F0]' : 'text-[#330020]/40 hover:text-[#330020]'}`}
                            >
                                Monthly
                            </button>
                        </div>
                        <Button variant="primary" className="!px-6 !py-3 !text-[10px]">
                            <Calendar size={14} className="mr-2" /> Schedule Report
                        </Button>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
                    {statCards.map((card, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`rounded-[30px] p-7 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-[255px] cursor-pointer ${
                                card.featured 
                                    ? 'bg-gradient-to-br from-[#330020] to-[#4A0130] text-white shadow-[0_15px_40px_rgba(51,0,32,0.15)] hover:shadow-[0_25px_50px_rgba(51,0,32,0.25)] hover:-translate-y-1.5' 
                                    : 'bg-white/82 backdrop-blur-md border border-[#330020]/08 text-[#330020] shadow-[0_12px_35px_rgba(51,0,32,0.05)] hover:shadow-[0_20px_45px_rgba(51,0,32,0.1)] hover:-translate-y-1.5'
                            }`}
                        >
                            {card.trend !== 0 && !card.featured && (
                                <div className="absolute top-0 right-0 p-7">
                                    <div className={`flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg ${card.trend >= 0 ? 'text-[#8A8F68] bg-[#8A8F68]/10' : 'text-red-600 bg-red-50'}`}>
                                        {card.trend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                        {Math.abs(card.trend)}%
                                    </div>
                                </div>
                            )}
                            <div className={`w-[54px] h-[54px] rounded-[16px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shrink-0 ${
                                card.featured 
                                    ? 'bg-white/14 text-white' 
                                    : 'bg-[#8A8F68]/10 text-[#8A8F68]'
                            }`}>
                                <card.icon size={18} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className={`font-sans text-[10px] font-bold uppercase tracking-[2.5px] mb-2 ${card.featured ? 'text-white/60' : 'text-[#330020]/45'}`}>{card.label}</p>
                                <h4 className={`font-sans text-[38px] font-bold tracking-tight leading-none mb-2 ${card.featured ? 'text-white' : 'text-[#330020]'}`}>{card.value}</h4>
                                <p className={`font-sans text-[12px] leading-relaxed ${card.featured ? 'text-white/80' : 'text-[#330020]/60'}`}>{card.narration}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Growth Analytics */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 bg-white/88 backdrop-blur-md rounded-[34px] p-10 shadow-[0_15px_45px_rgba(51,0,32,0.06)] border border-[#330020]/08 relative"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-serif text-2xl font-semibold tracking-tight mb-1 text-[#330020]">Enquiry Analytics</h3>
                                <p className="font-sans text-[10px] font-bold text-[#8A8F68] uppercase tracking-[2px]">Mart enquiries & consultation tracking</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#330020]" />
                                    <span className="font-sans text-[10px] font-bold text-[#330020]/50 uppercase tracking-[1px]">Total Enquiries</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#8A8F68]" />
                                    <span className="font-sans text-[10px] font-bold text-[#330020]/50 uppercase tracking-[1px]">Confirmed Enquiries</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="h-[350px] w-full mb-10 relative">
                            {(!stats.chartData || stats.chartData.length === 0) && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 bg-[#FAF6F0]/20 backdrop-blur-[1px] rounded-[24px]">
                                    <div className="w-16 h-16 rounded-full bg-[#330020]/05 flex items-center justify-center text-[#330020]/60 mb-4 animate-pulse">
                                        <Sofa size={28} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="font-serif text-lg font-semibold mb-1 text-[#330020]">No mart enquiries yet.</h4>
                                    <p className="font-sans text-[11px] font-semibold text-[#8A8F68] uppercase tracking-[1px]">Enquiry insights will appear once customers place online queries.</p>
                                </div>
                            )}
                            
                            <div className={`h-full w-full ${(!stats.chartData || stats.chartData.length === 0) ? 'opacity-15 blur-[1px] pointer-events-none' : ''}`}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.chartData && stats.chartData.length > 0 ? stats.chartData : placeholderData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#330020" floodOpacity="0.25"/>
                                            </filter>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#330020" stopOpacity={0.18}/>
                                                <stop offset="95%" stopColor="#330020" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(51, 0, 32, 0.06)" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: 'rgba(51, 0, 32, 0.48)', fontSize: 9, fontWeight: 700 }}
                                            dy={15}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: 'rgba(51, 0, 32, 0.48)', fontSize: 9, fontWeight: 700 }}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '16px', 
                                                border: '1px solid rgba(51, 0, 32, 0.08)', 
                                                boxShadow: '0 15px 35px rgba(51, 0, 32, 0.05)',
                                                padding: '16px',
                                                backgroundColor: '#FFFFFF'
                                            }}
                                            itemStyle={{ fontWeight: 600, fontFamily: 'Manrope', fontSize: '12px', color: '#330020' }}
                                            labelStyle={{ fontWeight: 700, fontFamily: 'Manrope', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(51, 0, 32, 0.5)' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="total" 
                                            name="Total Enquiries"
                                            stroke="#330020" 
                                            strokeWidth={4}
                                            filter="url(#glow)"
                                            fillOpacity={1} 
                                            fill="url(#colorRevenue)" 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="confirmed" 
                                            name="Confirmed Enquiries"
                                            stroke="rgba(138, 143, 104, 0.85)" 
                                            strokeWidth={2}
                                            fillOpacity={0} 
                                            fill="none" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-[#330020]/08 shadow-[0_8px_25px_rgba(51,0,32,0.03)] hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(51,0,32,0.08)] transition-all duration-300 flex flex-col justify-between">
                                <p className="text-[#330020]/48 font-sans font-bold text-[10px] uppercase tracking-[2px] mb-2">Today's Enquiries</p>
                                <p className="text-3xl font-sans font-bold text-[#330020]">{stats.todayRevenue}</p>
                            </div>
                            <div className="p-8 bg-gradient-to-br from-[#330020] to-[#4A0130] rounded-3xl shadow-[0_15px_35px_rgba(51,0,32,0.15)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(51,0,32,0.25)] transition-all duration-300 flex flex-col justify-between text-white">
                                <p className="text-white/60 font-sans font-bold text-[10px] uppercase tracking-[2px] mb-2">Monthly Enquiries</p>
                                <p className="text-3xl font-sans font-bold">{stats.monthlyRevenue}</p>
                            </div>
                            <div className="p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-[#330020]/08 shadow-[0_8px_25px_rgba(51,0,32,0.03)] hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(51,0,32,0.08)] transition-all duration-300 flex flex-col justify-between">
                                <p className="text-[#330020]/48 font-sans font-bold text-[10px] uppercase tracking-[2px] mb-2">Confirmed Enquiries</p>
                                <p className="text-3xl font-sans font-bold text-[#330020]">{stats.totalConfirmed}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Operational Activity */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/82 backdrop-blur-md rounded-[28px] p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-bold tracking-tight text-[#330020]">Recent Activity</h3>
                            <Link to="/admin/users">
                                <Button variant="secondary" className="!p-3"><Search size={14} /></Button>
                            </Link>
                        </div>

                        <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#330020]/10">
                            {stats.activities.length > 0 ? stats.activities.map((act, idx) => (
                                <div key={idx} className="relative pl-12 group">
                                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#F6F1EB] border border-[#330020]/10 shadow-soft flex items-center justify-center z-10 group-hover:border-[#8A8F68] transition-colors">
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            act.type === 'user' ? 'bg-[#8A8F68]' : 
                                            act.type === 'product' ? 'bg-[#330020]/60' :
                                            act.type === 'enquiry' ? 'bg-[#8A8F68]' : 'bg-[#8A8F68]'
                                        }`} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-bold text-[#330020] leading-tight mb-1">{act.action}</p>
                                        <p className="text-[9px] text-[#330020]/48 uppercase tracking-widest font-black">{act.target}</p>
                                        <div className="flex items-center gap-2 text-[8px] text-[#330020]/30 mt-3 font-bold uppercase tracking-[0.2em]">
                                            <Clock size={10} />
                                            {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-20 text-center opacity-20 text-[#330020]">
                                    <Activity size={32} className="mx-auto mb-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No signals detected</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Brief Management */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white/82 backdrop-blur-md rounded-[28px] p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight mb-1 text-[#330020]">Recent Enquiries</h3>
                                <p className="text-[10px] font-bold text-[#8A8F68] uppercase tracking-widest">{stats.pendingEnquiries} Pending enquiries awaiting review</p>
                            </div>
                            <Link to="/admin/enquiries">
                                <Button variant="secondary" className="!px-6 !py-3 !text-[10px]">View All Enquiries</Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stats.recentEnquiries.length > 0 ? stats.recentEnquiries.map((enq, idx) => (
                                <div key={idx} className="p-8 bg-[#F6F1EB]/40 rounded-[24px] border border-[#330020]/06 hover:bg-white/90 hover:shadow-[0_12px_36px_rgba(51,0,32,0.06)] transition-all cursor-pointer group">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#330020]/60 border border-[#330020]/10 shadow-soft">
                                                <Users size={20} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-[#330020] text-xs mb-1 truncate max-w-[120px]">{enq.userId?.name || enq.customerName || 'Guest Customer'}</h5>
                                                <p className="text-[9px] text-[#330020]/48 font-bold uppercase tracking-widest">{enq.products?.length || 0} Assets Requested</p>
                                            </div>
                                        </div>
                                        <Badge variant={enq.status === 'pending' ? 'warning' : 'success'} className="!text-[8px]">
                                            {enq.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-[#330020]/10">
                                        <div>
                                            <p className="text-[8px] text-[#330020]/30 font-bold uppercase tracking-widest mb-1">Value</p>
                                            <p className="text-sm font-bold text-[#330020]">₹{(enq.totalAmount || 0).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] text-[#330020]/30 font-bold uppercase tracking-widest mb-1">Timeline</p>
                                            <p className="text-[10px] font-bold text-[#330020]/60">{new Date(enq.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 py-20 text-center opacity-20 text-[#330020]">
                                    <MessageSquare size={40} className="mx-auto mb-4" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Archive is empty</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Logistics Command */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/82 backdrop-blur-md rounded-[28px] p-10 shadow-[0_10px_30px_rgba(51,0,32,0.05)] border border-[#330020]/08 flex flex-col"
                    >
                        <h3 className="text-xl font-bold tracking-tight mb-8 text-[#330020]">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {[
                                { name: 'Products', sub: 'Manage Stock', icon: Package, link: '/admin/products' },
                                { name: 'Enquiries', sub: 'Customer Requests', icon: MessageCircle, link: '/admin/enquiries' },
                                { name: 'Users', sub: 'Manage Accounts', icon: Users, link: '/admin/users' },
                                { name: 'Finance', sub: 'Transaction Logs', icon: Activity, link: '/admin/users' }
                            ].map((action, idx) => (
                                <Link 
                                    key={idx} 
                                    to={action.link}
                                    className="p-6 bg-[#F6F1EB]/50 border border-[#330020]/06 rounded-[24px] hover:bg-[#330020] hover:text-[#FAF6F0] hover:border-transparent transition-all group relative overflow-hidden shadow-sm hover:shadow-soft"
                                >
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#330020] group-hover:bg-[#FAF6F0]/20 group-hover:text-[#FAF6F0] mb-4 transition-colors shadow-soft">
                                        <action.icon size={18} strokeWidth={1.5} />
                                    </div>
                                    <p className="font-bold text-[#330020] group-hover:text-[#FAF6F0] text-xs mb-1">{action.name}</p>
                                    <p className="text-[8px] text-[#330020]/48 group-hover:text-[#FAF6F0]/40 font-bold uppercase tracking-widest">{action.sub}</p>
                                </Link>
                            ))}
                        </div>
                        
                        <div className="mt-auto p-10 bg-[#F6F1EB]/50 rounded-[24px] border border-[#330020]/06 relative overflow-hidden group cursor-pointer shadow-soft">
                            <div className="relative z-10">
                                <h4 className="text-2xl font-bold leading-tight mb-6 text-[#330020]">Generate System <br />Performance Report</h4>
                                <Button variant="primary" className="!px-6 !py-3 !text-[10px] group-hover:translate-x-2 transition-transform">
                                    Export PDF <ArrowRight size={14} className="ml-2" />
                                </Button>
                            </div>
                            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#8A8F68]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;


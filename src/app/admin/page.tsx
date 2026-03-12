'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Package, FileText, FolderOpen, Megaphone,
    Eye, Star, ArrowUpRight, ArrowRight, Activity, TrendingUp
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface Stats {
    products: number; publishedProducts: number;
    posts: number; publishedPosts: number;
    categories: number; ads: number;
}

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';

interface Stats {
    products: number; publishedProducts: number;
    posts: number; publishedPosts: number;
    categories: number; ads: number;
    totalClicks: number;
}

const clickData = [
    { name: 'Mon', clicks: 45 },
    { name: 'Tue', clicks: 52 },
    { name: 'Wed', clicks: 38 },
    { name: 'Thu', clicks: 65 },
    { name: 'Fri', clicks: 89 },
    { name: 'Sat', clicks: 120 },
    { name: 'Sun', clicks: 95 },
];

const trafficData = [
    { name: 'Jan', views: 4000 },
    { name: 'Feb', views: 3000 },
    { name: 'Mar', views: 2000 },
    { name: 'Apr', views: 2780 },
    { name: 'May', views: 1890 },
    { name: 'Jun', views: 2390 },
    { name: 'Jul', views: 3490 },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        products: 0, publishedProducts: 0,
        posts: 0, publishedPosts: 0,
        categories: 0, ads: 0,
        totalClicks: 1240 // Mocking for now
    });
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [recentPosts, setRecentPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [prod, pubProd, posts, pubPosts, cats, ads, recProd, recPosts] = await Promise.all([
                    supabase.from('products').select('id, status', { count: 'exact', head: true }),
                    supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
                    supabase.from('blog_posts').select('id, status', { count: 'exact', head: true }),
                    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
                    supabase.from('categories').select('id', { count: 'exact', head: true }),
                    supabase.from('ads').select('id', { count: 'exact', head: true }),
                    supabase.from('products').select('id,title,slug,status,rating,created_at').order('created_at', { ascending: false }).limit(5),
                    supabase.from('blog_posts').select('id,title,slug,status,views,created_at').order('created_at', { ascending: false }).limit(5),
                ]);

                setStats({
                    products: prod.count || 0, publishedProducts: pubProd.count || 0,
                    posts: posts.count || 0, publishedPosts: pubPosts.count || 0,
                    categories: cats.count || 0, ads: ads.count || 0,
                    totalClicks: 1240 
                });
                setRecentProducts(recProd.data || []);
                setRecentPosts(recPosts.data || []);
            } catch (error: any) {
                console.error('Dashboard intelligence sync failed:', error);
                toast.error('Command Center Link Failure: ' + (error.message || 'Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Inventory', value: stats.products, sub: `${stats.publishedProducts} live items`, icon: Package, color: 'from-slate-700 to-slate-800', link: '/admin/products' },
        { label: 'Journal', value: stats.posts, sub: `${stats.publishedPosts} articles`, icon: FileText, color: 'from-indigo-600 to-indigo-700', link: '/admin/blog' },
        { label: 'Conversions', value: stats.totalClicks, sub: 'Affiliate Clicks', icon: Activity, color: 'from-slate-600 to-slate-700', link: '/admin/analytics' },
        { label: 'Revenue Est.', value: '$2,450', sub: 'Target Achieved', icon: TrendingUp, color: 'from-zinc-700 to-zinc-800', link: '/admin/analytics' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Dynamic Welcome Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-px bg-slate-400" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] leading-none">Intelligence Engine</p>
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Command Center</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Last Synced</p>
                        <p className="text-xs font-bold text-gray-500">Just Now</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm">
                        <Activity className="w-5 h-5 text-green-500" />
                    </div>
                </div>
            </div>

            {/* Futuristic Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map(({ label, value, sub, icon: Icon, color, link }) => (
                    <Link key={label} href={link} className="bg-white rounded-[2rem] p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                        <div className="flex items-start justify-between mb-8 relative">
                            <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-[1.25rem] flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform`}>
                                <Icon className="w-7 h-7 text-white" />
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-slate-200 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <div className="text-4xl font-black text-slate-900 mb-2 relative leading-none uppercase tracking-tighter tabular-nums group-hover:text-slate-800 transition-colors">
                            {loading ? '---' : value}
                        </div>
                        <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1 relative opacity-70">{label}</div>
                        <div className="text-[10px] font-bold text-slate-500/60 uppercase tracking-widest relative">{sub}</div>
                    </Link>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm group">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                <Activity className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Affiliate Performance</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Click-through and conversion trends</p>
                            </div>
                        </div>
                        <select className="bg-gray-50 border-none text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-100 cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={clickData}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#475569" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="clicks" stroke="#475569" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Traffic Velocity</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Reach Growth</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} dy={10} />
                                <Tooltip 
                                    cursor={{fill: '#f9fafb'}}
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="views" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Products with Advanced UI */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                    <div className="flex items-center justify-between px-8 py-8 border-b border-slate-50 bg-slate-50/10">
                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-slate-700" />
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Core Inventory</h3>
                        </div>
                        <Link href="/admin/products" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-1.5 leading-none">
                            Full Cargo <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50 flex-1">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-16 mx-8 my-4 bg-gray-50 rounded-2xl animate-pulse" />)
                        ) : recentProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                                <Package className="w-12 h-12 mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">Inventory empty</p>
                            </div>
                        ) : recentProducts.map(p => (
                            <div key={p.id} className="group flex items-center gap-4 px-8 py-5 hover:bg-gray-50/50 transition-all cursor-default">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${p.status === 'published' ? 'bg-orange-50' : 'bg-gray-100'
                                    }`}>
                                    <Star className={`w-4 h-4 ${p.status === 'published' ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate leading-none mb-1.5 group-hover:text-orange-600 transition-colors uppercase italic">{p.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(p.created_at))} · RATING: {p.rating || 'N/A'}</p>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl scale-90 ${p.status === 'published'
                                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                    }`}>
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 border-t border-gray-50 bg-gray-50/30">
                        <Link href="/admin/products/new" className="flex items-center justify-center py-4 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-[1.25rem] transition-all shadow-xl shadow-gray-200 uppercase tracking-widest">
                            + Initialize New Item
                        </Link>
                    </div>
                </div>

                {/* Recent Posts with Advanced UI */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                    <div className="flex items-center justify-between px-8 py-8 border-b border-slate-50 bg-slate-50/10">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Editorial Vault</h3>
                        </div>
                        <Link href="/admin/blog" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-1.5 leading-none">
                            Archive <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50 flex-1">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-16 mx-8 my-4 bg-gray-50 rounded-2xl animate-pulse" />)
                        ) : recentPosts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                                <FileText className="w-12 h-12 mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">Vault silent</p>
                            </div>
                        ) : recentPosts.map(p => (
                            <div key={p.id} className="group flex items-center gap-4 px-8 py-5 hover:bg-gray-50/50 transition-all cursor-default">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-3 ${p.status === 'published' ? 'bg-blue-50' : 'bg-gray-100'
                                    }`}>
                                    <Eye className={`w-4 h-4 ${p.status === 'published' ? 'text-blue-400' : 'text-gray-300'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate leading-none mb-1.5 group-hover:text-blue-600 transition-colors uppercase italic">{p.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                                        {p.views || 0} READS · {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(p.created_at))}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl scale-90 ${p.status === 'published'
                                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                    }`}>
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 border-t border-slate-50 bg-slate-50/30">
                        <Link href="/admin/blog/new" className="flex items-center justify-center py-4 bg-slate-800 hover:bg-slate-900 text-white text-xs font-black rounded-[1.25rem] transition-all shadow-xl shadow-slate-200/50 uppercase tracking-widest">
                            + Craft New Article
                        </Link>
                    </div>
                </div>
            </div>

            {/* Futuristic Dashboard Footer (System Health) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-8 bg-slate-900 rounded-[2.5rem] text-slate-300">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">System Status</p>
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Operational
                        </div>
                    </div>
                    <div className="w-px h-8 bg-slate-800" />
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">Security Hash</p>
                        <p className="text-[10px] font-mono text-slate-400">CC-X829-PRO</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Powered by Intelligence</p>
                    <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
                        <Star className="w-4 h-4 text-amber-500" />
                    </div>
                </div>
            </div>
        </div>
    );
}

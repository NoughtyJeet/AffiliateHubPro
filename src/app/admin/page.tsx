'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Package, FileText, FolderOpen, Megaphone,
    Eye, Star, ArrowUpRight, ArrowRight, Activity, TrendingUp
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Stats {
    products: number; publishedProducts: number;
    posts: number; publishedPosts: number;
    categories: number; ads: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        products: 0, publishedProducts: 0,
        posts: 0, publishedPosts: 0,
        categories: 0, ads: 0
    });
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [recentPosts, setRecentPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchStats = async () => {
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
            });
            setRecentProducts(recProd.data || []);
            setRecentPosts(recPosts.data || []);
            setLoading(false);
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Products', value: stats.products, sub: `${stats.publishedProducts} live on site`, icon: Package, color: 'from-orange-500 to-orange-600', link: '/admin/products' },
        { label: 'Blog Content', value: stats.posts, sub: `${stats.publishedPosts} published articles`, icon: FileText, color: 'from-blue-500 to-blue-600', link: '/admin/blog' },
        { label: 'Categories', value: stats.categories, sub: 'Taxonomy management', icon: FolderOpen, color: 'from-green-500 to-green-600', link: '/admin/categories' },
        { label: 'Ad Placements', value: stats.ads, sub: 'Active campaigns', icon: Megaphone, color: 'from-purple-500 to-purple-600', link: '/admin/ads' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Dynamic Welcome Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-2 leading-none">System Overview</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Command Center</h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Server Online</span>
                </div>
            </div>

            {/* Futuristic Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {statCards.map(({ label, value, sub, icon: Icon, color, link }) => (
                    <Link key={label} href={link} className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                        <div className="flex items-start justify-between mb-6 relative">
                            <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 group-hover:rotate-6 transition-transform`}>
                                <Icon className="w-7 h-7 text-white" />
                            </div>
                            <ArrowUpRight className="w-6 h-6 text-gray-200 group-hover:text-orange-500 transition-colors" />
                        </div>
                        <div className="text-4xl font-black text-gray-900 mb-1 relative leading-none uppercase tracking-tighter tabular-nums">
                            {loading ? '---' : value}
                        </div>
                        <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1 relative">{label}</div>
                        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest relative">{sub}</div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Recent Products with Advanced UI */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="flex items-center gap-3">
                            <Package className="w-5 h-5 text-orange-500" />
                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Recent Discovery</h3>
                        </div>
                        <Link href="/admin/products" className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-colors flex items-center gap-1.5 leading-none">
                            All Items <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50 flex-1">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-16 mx-8 my-4 bg-gray-50 rounded-2xl animate-pulse" />)
                        ) : recentProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                                <Package className="w-12 h-12 mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">Cargo empty</p>
                            </div>
                        ) : recentProducts.map(p => (
                            <div key={p.id} className="group flex items-center gap-4 px-8 py-4 hover:bg-gray-50/50 transition-all cursor-default">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${p.status === 'published' ? 'bg-orange-50' : 'bg-gray-100'
                                    }`}>
                                    <Star className={`w-4 h-4 ${p.status === 'published' ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate leading-none mb-1 group-hover:text-orange-600 transition-colors">{p.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Intl.DateTimeFormat('en-US').format(new Date(p.created_at))}</p>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${p.status === 'published'
                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 border-t border-gray-50 bg-gray-50/10">
                        <Link href="/admin/products/new" className="flex items-center justify-center py-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-2xl transition-all shadow-lg shadow-orange-500/20 uppercase tracking-widest">
                            + Register New Product
                        </Link>
                    </div>
                </div>

                {/* Recent Posts with Advanced UI */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm flex flex-col">
                    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Latest Journals</h3>
                        </div>
                        <Link href="/admin/blog" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center gap-1.5 leading-none">
                            Library <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50 flex-1">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => <div key={i} className="h-16 mx-8 my-4 bg-gray-50 rounded-2xl animate-pulse" />)
                        ) : recentPosts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 grayscale opacity-40">
                                <FileText className="w-12 h-12 mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">Vault quiet</p>
                            </div>
                        ) : recentPosts.map(p => (
                            <div key={p.id} className="group flex items-center gap-4 px-8 py-4 hover:bg-gray-50/50 transition-all cursor-default">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-3 ${p.status === 'published' ? 'bg-blue-50' : 'bg-gray-100'
                                    }`}>
                                    <Eye className={`w-4 h-4 ${p.status === 'published' ? 'text-blue-400' : 'text-gray-300'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-gray-900 truncate leading-none mb-1 group-hover:text-blue-600 transition-colors">{p.title}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        {p.views || 0} READS · {new Intl.DateTimeFormat('en-US').format(new Date(p.created_at))}
                                    </p>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${p.status === 'published'
                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                    }`}>
                                    {p.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 border-t border-gray-50 bg-gray-50/10">
                        <Link href="/admin/blog/new" className="flex items-center justify-center py-4 bg-blue-500 hover:bg-blue-600 text-white text-xs font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest">
                            + Author New Article
                        </Link>
                    </div>
                </div>
            </div>

            {/* Futuristic Command Palette (Quick Actions) */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 leading-none">System Shortcuts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { to: '/admin/products', icon: '📦', label: 'Inventory', color: 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-100' },
                        { to: '/admin/blog', icon: '✍️', label: 'Editorial', color: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100' },
                        { to: '/admin/categories', icon: '📁', label: 'Taxonomy', color: 'hover:bg-green-50 hover:text-green-600 hover:border-green-100' },
                        { to: '/admin/ads', icon: '📣', label: 'Promotion', color: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-100' },
                        { to: '/admin/seo', icon: '🔍', label: 'Visibility', color: 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100' },
                        { to: '/admin/settings', icon: '⚙️', label: 'Core', color: 'hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200' },
                    ].map(({ to, icon, label, color }) => (
                        <Link key={to} href={to} className={`flex flex-col items-center gap-3 p-6 rounded-3xl text-center border-2 border-transparent transition-all group ${color}`}>
                            <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
    Activity, TrendingUp, MousePointer2, Target, 
    ArrowUpRight, ArrowDownRight, Package, FileText,
    Calendar, Filter, RefreshCw
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AffiliateClick, AuditLog } from '@/types/database';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [clicks, setClicks] = useState<AffiliateClick[]>([]);
    const [stats, setStats] = useState({
        totalClicks: 0,
        uniqueVisitors: 0,
        topProduct: '---',
        conversionRate: '2.4%'
    });
    const supabase = createClient();

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('affiliate_clicks')
            .select(`
                *,
                products (title),
                blog_posts (title)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error(error);
        } else {
            setClicks(data || []);
            // Simple stats aggregation
            setStats({
                totalClicks: data?.length || 0,
                uniqueVisitors: new Set(data?.map(c => c.ip_hash)).size || 0,
                topProduct: 'Amazon Echo Dot', // Mock or calculate from data
                conversionRate: '3.8%'
            });
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        const init = async () => {
            await Promise.resolve();
            fetchAnalytics();
        };
        init();
    }, [fetchAnalytics]);

    // Chart Data Preparation
    const chartData = [
        { name: 'Mon', clicks: 40 },
        { name: 'Tue', clicks: 30 },
        { name: 'Wed', clicks: 65 },
        { name: 'Thu', clicks: 45 },
        { name: 'Fri', clicks: 90 },
        { name: 'Sat', clicks: 120 },
        { name: 'Sun', clicks: 85 },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Intel Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 leading-none">Growth Metrics</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase italic">Performance Intelligence</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Monitoring {clicks.length} Active Events
                    </p>
                </div>
                <button 
                    onClick={fetchAnalytics}
                    className="flex items-center gap-3 bg-white border border-gray-100 text-gray-900 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm hover:bg-gray-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
                </button>
            </div>

            {/* Scoreboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Gross Clicks', value: stats.totalClicks, sub: '+12% vs last week', icon: MousePointer2, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Unique Reach', value: stats.uniqueVisitors, sub: '+5.2% Velocity', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Top Performer', value: stats.topProduct, sub: 'Inventory Node 82', icon: Target, color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Conv. Engine', value: stats.conversionRate, sub: 'Target: 4.0%', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform`}>
                            <s.icon className={`w-6 h-6 ${s.color}`} />
                        </div>
                        <div className="text-3xl font-black text-gray-900 mb-1 leading-none uppercase tracking-tighter">
                            {loading ? '---' : s.value}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tight">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Visual Intelligence Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                            <Activity className="text-orange-500 w-4 h-4" /> Click Velocity (7D)
                        </h3>
                    </div>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#9ca3af'}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="clicks" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-10 flex items-center gap-3">
                        <Target className="text-blue-500 w-4 h-4" /> Top Traffic Sources
                    </h3>
                    <div className="flex-1 space-y-6">
                        {[
                            { name: 'Direct Traffic', percent: 45, color: 'bg-blue-500' },
                            { name: 'Google Search', percent: 32, color: 'bg-orange-500' },
                            { name: 'Social Media', percent: 18, color: 'bg-green-500' },
                            { name: 'Referrals', percent: 5, color: 'bg-purple-500' },
                        ].map((source, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-gray-900">{source.name}</span>
                                    <span className="text-gray-400">{source.percent}%</span>
                                </div>
                                <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                    <div className={`h-full ${source.color} transition-all duration-1000`} style={{ width: `${source.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Live Event Stream */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/10 flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                        < RefreshCw className="text-gray-400 w-4 h-4" /> Live Signal Stream
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-[10px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="text-left px-10 py-5 font-black text-gray-400 uppercase tracking-widest">Temporal Log</th>
                                <th className="text-left px-10 py-5 font-black text-gray-400 uppercase tracking-widest">Target Entity</th>
                                <th className="text-left px-10 py-5 font-black text-gray-400 uppercase tracking-widest">Origin Node</th>
                                <th className="text-right px-10 py-5 font-black text-gray-400 uppercase tracking-widest">Agent ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => <tr key={i} className="h-16 animate-pulse bg-white"><td colSpan={4} /></tr>)
                            ) : clicks.length === 0 ? (
                                <tr><td colSpan={4} className="py-20 text-center text-gray-400 font-black uppercase tracking-widest">No signals detected</td></tr>
                            ) : clicks.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50/30 transition-all">
                                    <td className="px-10 py-4 font-bold text-gray-500 italic">
                                        {new Date(c.created_at).toLocaleTimeString()}
                                    </td>
                                    <td className="px-10 py-4">
                                        <div className="flex items-center gap-3">
                                            {c.product_id ? <Package size={14} className="text-orange-500" /> : <FileText size={14} className="text-blue-500" />}
                                            <span className="font-black text-gray-900 uppercase truncate max-w-[200px]">
                                                {c.products?.title || c.blog_posts?.title || 'System Direct'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-4 font-bold text-gray-400 truncate max-w-[150px]">
                                        {c.referrer || 'Direct Entry'}
                                    </td>
                                    <td className="px-10 py-4 text-right font-mono text-gray-300">
                                        {c.id.substring(0, 8).toUpperCase()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

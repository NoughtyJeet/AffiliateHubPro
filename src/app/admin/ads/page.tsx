'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Edit, Trash2, Megaphone, Monitor,
    Smartphone, ToggleLeft, ToggleRight, X,
    ChevronRight, Calendar, Layout, Terminal
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type Ad = {
    id: string; ad_name: string; ad_type: 'adsense' | 'custom_html' | 'image' | 'script' | 'affiliate_banner';
    ad_code: string | null; image_url: string | null; link_url: string | null;
    placement: string; device_target: 'desktop' | 'mobile' | 'both';
    start_date: string | null; end_date: string | null; status: boolean;
    width: number; height: number; created_at: string;
};

const PLACEMENTS = [
    'homepage_top', 'homepage_middle', 'blog_top', 'blog_middle', 'blog_bottom',
    'sidebar', 'category_page', 'product_grid', 'after_paragraph_2', 'before_faq'
];

const PLACEMENT_LABELS: Record<string, string> = {
    homepage_top: 'Homepage — Hero Header', homepage_middle: 'Homepage — Feed Break',
    blog_top: 'Article — Header Injection', blog_middle: 'Article — Inline Content', blog_bottom: 'Article — Footer Conclusion',
    sidebar: 'System Sidebar', category_page: 'Category Discovery', product_grid: 'Product Grid Matrix',
    after_paragraph_2: 'Semantic Break (2nd P)', before_faq: 'FAQ Pre-Header'
};

const empty = (): Partial<Ad> => ({
    ad_name: '', ad_type: 'custom_html', ad_code: '', image_url: '', link_url: '',
    placement: 'blog_middle', device_target: 'both', start_date: null, end_date: null,
    status: true, width: 728, height: 90
});

export default function AdminAds() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Ad | null>(null);
    const [form, setForm] = useState<Partial<Ad>>(empty());
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        setLoading(true);
        const { data } = await supabase.from('ads').select('*').order('created_at', { ascending: false });
        setAds(data || []);
        setLoading(false);
    }

    function openNew() { setEditing(null); setForm(empty()); setShowForm(true); }
    function openEdit(a: Ad) { setEditing(a); setForm({ ...a }); setShowForm(true); }

    async function handleSave() {
        if (!form.ad_name?.trim()) { toast.error('Ad Campaign Name Required'); return; }
        setSaving(true);
        const payload = { ...form, updated_at: new Date().toISOString() };

        const { error } = editing
            ? await supabase.from('ads').update(payload).eq('id', editing.id)
            : await supabase.from('ads').insert(payload);

        if (error) { toast.error(error.message); }
        else { toast.success(editing ? 'Ad Updated Successfully' : 'Ad Campaign Initialized'); setShowForm(false); fetchData(); }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Abort campaign? This will permanently erase the ad configuration.')) return;
        const { error } = await supabase.from('ads').delete().eq('id', id);
        if (error) toast.error(error.message);
        else { toast.success('Ad Campaign Erased'); fetchData(); }
    }

    async function toggleAd(a: Ad) {
        const { error } = await supabase.from('ads').update({ status: !a.status }).eq('id', a.id);
        if (!error) {
            toast.success(`Ad instance ${!a.status ? 'activated' : 'deactivated'}`);
            fetchData();
        }
    }

    const set = (key: keyof Ad, value: unknown) => setForm(f => ({ ...f, [key]: value }));

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em] mb-2 leading-none">Monetization Hub</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Marketing Placements</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-3">
                        {ads.filter(a => a.status).length} Active Channels Across Network
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Initialize Campaign
                </button>
            </div>

            {/* Futuristic Statistics Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {PLACEMENTS.slice(0, 5).map(p => {
                    const count = ads.filter(a => a.placement === p && a.status).length;
                    return (
                        <div key={p} className="bg-white rounded-[1.5rem] border border-gray-100 p-5 shadow-sm group hover:border-purple-200 transition-all">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 truncate">{PLACEMENT_LABELS[p]}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{count}</p>
                                <div className={`w-1.5 h-1.5 rounded-full mb-1 ${count > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-200'}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Advanced Data Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center p-32">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : ads.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center justify-center grayscale opacity-30">
                        <Megaphone size={64} className="mb-6" />
                        <p className="font-black uppercase tracking-widest text-xs">No active advertisement nodes</p>
                        <button onClick={openNew} className="mt-4 text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] underline">Launch System →</button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-50">
                                    {['Campaign Asset', 'Type', 'Target Placement', 'Device Matrix', 'Lifecycle Status', 'Power', 'Actions'].map(h =>
                                        <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {ads.map(a => (
                                    <tr key={a.id} className="hover:bg-gray-50/20 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                                                    <Megaphone className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight group-hover:text-purple-600 transition-colors">{a.ad_name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{a.width}×{a.height} PX</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-2 py-1 bg-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-600 rounded-lg">{a.ad_type}</span>
                                        </td>
                                        <td className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">{PLACEMENT_LABELS[a.placement] || a.placement}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                {(a.device_target === 'both' || a.device_target === 'desktop') && <Monitor className="w-3.5 h-3.5 text-gray-300" />}
                                                {(a.device_target === 'both' || a.device_target === 'mobile') && <Smartphone className="w-3.5 h-3.5 text-gray-300" />}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">
                                                    {a.start_date ? new Intl.DateTimeFormat('en-US').format(new Date(a.start_date)) : 'INDEFINITE'}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Temporal Bound</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button onClick={() => toggleAd(a)} className="transition-transform active:scale-90">
                                                {a.status
                                                    ? <ToggleRight className="w-10 h-10 text-green-500" />
                                                    : <ToggleLeft className="w-10 h-10 text-gray-200" />}
                                            </button>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(a)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all"><Edit size={14} /></button>
                                                <button onClick={() => handleDelete(a.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Advanced Ad Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !saving && setShowForm(false)} />
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border-8 border-white">

                        <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.4em] mb-1">Campaign Config</p>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                    {editing ? 'Modify Instance' : 'Protocol Launch'}
                                </h2>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 shadow-sm transition-all hover:rotate-90">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
                            <section className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Moniker *</label>
                                        <input value={form.ad_name || ''} onChange={e => set('ad_name', e.target.value)}
                                            className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-purple-500/5 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Technological Base</label>
                                        <select value={form.ad_type || 'custom_html'} onChange={e => set('ad_type', e.target.value)}
                                            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm appearance-none cursor-pointer">
                                            <option value="adsense">AdSense Network</option>
                                            <option value="custom_html">Custom HTML Code</option>
                                            <option value="image">Asset (Image) Node</option>
                                            <option value="script">Execution Script</option>
                                            <option value="affiliate_banner">Affiliate Interface</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/30 p-8 rounded-[2rem] border border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Spatial Placement</label>
                                        <select value={form.placement || 'blog_middle'} onChange={e => set('placement', e.target.value)}
                                            className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm appearance-none">
                                            {PLACEMENTS.map(p => <option key={p} value={p}>{PLACEMENT_LABELS[p]}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Device Targeting Matrix</label>
                                        <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                                            {(['both', 'desktop', 'mobile'] as const).map(d => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() => set('device_target', d)}
                                                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${form.device_target === d ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'
                                                        }`}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 px-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Horizontal Pixels</label>
                                        <input type="number" value={form.width || 728} onChange={e => set('width', parseInt(e.target.value))}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-black tabular-nums" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vertical Pixels</label>
                                        <input type="number" value={form.height || 90} onChange={e => set('height', parseInt(e.target.value))}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-black tabular-nums" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Calendar size={12} /> Genesis Projection</label>
                                        <input type="date" value={form.start_date || ''} onChange={e => set('start_date', e.target.value || null)}
                                            className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-xl text-xs font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Calendar size={12} /> Temporal Limit</label>
                                        <input type="date" value={form.end_date || ''} onChange={e => set('end_date', e.target.value || null)}
                                            className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-xl text-xs font-bold" />
                                    </div>
                                </div>

                                {(form.ad_type === 'image' || form.ad_type === 'affiliate_banner') && (
                                    <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Source (CDN URL)</label>
                                            <input value={form.image_url || ''} onChange={e => set('image_url', e.target.value)}
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white transition-all shadow-inner" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Terminal Objective (Link URL)</label>
                                            <input value={form.link_url || ''} onChange={e => set('link_url', e.target.value)}
                                                placeholder="https://..."
                                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:bg-white transition-all shadow-inner" />
                                        </div>
                                    </div>
                                )}

                                {(form.ad_type === 'custom_html' || form.ad_type === 'adsense' || form.ad_type === 'script') && (
                                    <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"><Terminal size={14} /> Logic Injection (Ad Code)</label>
                                            <span className="text-[9px] font-black text-purple-400 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-widest transition-all">Encrypted Shell</span>
                                        </div>
                                        <textarea
                                            rows={10}
                                            value={form.ad_code || ''}
                                            onChange={e => set('ad_code', e.target.value)}
                                            placeholder="<!-- AD SYSTEM INITIALIZING... -->"
                                            className="w-full px-8 py-8 bg-gray-900 border-4 border-gray-800 rounded-[2.5rem] text-sm font-mono text-green-400 focus:outline-none focus:border-purple-500/30 transition-all shadow-2xl resize-none"
                                        />
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-10">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${form.status ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Node Power Phase:</span>
                                <button
                                    type="button"
                                    onClick={() => set('status', !form.status)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${form.status ? 'bg-green-50 text-green-600 border-green-100' : 'bg-white text-gray-400 border-gray-200'
                                        }`}
                                >
                                    {form.status ? 'Online' : 'Standby'}
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    Abort Config
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-12 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-purple-600/20 transition-all active:scale-95"
                                >
                                    {saving ? 'VERIFYING...' : editing ? 'DEPLOY UPDATES' : 'LAUNCH CAMPAIGN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

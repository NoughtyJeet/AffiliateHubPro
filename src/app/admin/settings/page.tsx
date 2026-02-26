'use client';

import { useState, useEffect } from 'react';
import {
    Save, Globe, MessageCircle, Twitter,
    Facebook, Camera, ShieldCheck, Info,
    ExternalLink, Layout, Palette, Share2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type Settings = {
    id: string; site_title: string; site_tagline: string | null;
    default_meta_description: string | null; og_default_image: string | null;
    site_logo: string | null; favicon_url: string | null;
    affiliate_disclosure: string | null; twitter_handle: string | null;
    facebook_url: string | null;
};

export default function AdminSettings() {
    const [settings, setSettings] = useState<Partial<Settings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => { fetch(); }, []);

    async function fetch() {
        setLoading(true);
        const { data } = await supabase.from('seo_settings').select('*').single();
        if (data) setSettings(data);
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        const payload = { ...settings, updated_at: new Date().toISOString() };
        delete (payload as any).id;

        const { error } = settings.id
            ? await supabase.from('seo_settings').update(payload).eq('id', settings.id)
            : await supabase.from('seo_settings').insert(payload);

        if (error) { toast.error(error.message); }
        else { toast.success('Global System Parameters Synced'); fetch(); }
        setSaving(false);
    }

    const set = (key: keyof Settings, value: string) => setSettings(s => ({ ...s, [key]: value }));

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Accessing Central Core...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 leading-none">System Configuration</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">Site Parameters</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Establishing Global Brand Identity & Legal Protocols
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-200 cursor-pointer disabled:bg-gray-400"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    Sync Core Identity
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
                {/* Main Interface */}
                <div className="xl:col-span-2 space-y-10">

                    {/* Site Identity Section */}
                    <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-30 transition-transform group-hover:scale-110" />

                        <div className="flex items-center gap-4 mb-10 relative">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                                <Palette className="w-5 h-5 text-orange-600" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Global Brand DNA</h2>
                        </div>

                        <div className="space-y-8 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand Moniker (Site Title)</label>
                                    <input
                                        value={settings.site_title || ''}
                                        onChange={e => set('site_title', e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold shadow-inner focus:bg-white transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tagline Narrative</label>
                                    <input
                                        value={settings.site_tagline || ''}
                                        onChange={e => set('site_tagline', e.target.value)}
                                        placeholder="Defining the standard..."
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold shadow-inner focus:bg-white transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Camera size={12} /> Visual Identity (Logo URL)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            value={settings.site_logo || ''}
                                            onChange={e => set('site_logo', e.target.value)}
                                            className="flex-1 px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold"
                                        />
                                        {settings.site_logo && (
                                            <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 p-2 shadow-sm flex items-center justify-center overflow-hidden">
                                                <img src={settings.site_logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Interface Icon (Favicon URL)</label>
                                        <input value={settings.favicon_url || ''} onChange={e => set('favicon_url', e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Default OG Canvas URL</label>
                                        <input value={settings.og_default_image || ''} onChange={e => set('og_default_image', e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Legal Section */}
                    <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                                <MessageCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">FTC Transparency Protocol</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 leading-none block">Universal Affiliate Disclosure</label>
                            <textarea
                                rows={5}
                                value={settings.affiliate_disclosure || ''}
                                onChange={e => set('affiliate_disclosure', e.target.value)}
                                placeholder="Declare affiliate relationships clearly..."
                                className="w-full px-10 py-8 bg-amber-50/30 border-2 border-amber-100/50 rounded-[2.5rem] text-sm font-medium italic text-amber-900 focus:outline-none focus:bg-white transition-all resize-none shadow-inner"
                            />
                            <div className="flex items-center gap-2 p-1 text-[10px] font-black uppercase tracking-widest text-amber-600/60 leading-none">
                                <ShieldCheck size={12} /> Automatically injected into Footer and Product Analysis Nodes
                            </div>
                        </div>
                    </section>

                    {/* Social Channels */}
                    <section className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                <Share2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Social Network Integration</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Twitter size={12} /> Network (X) Handle</label>
                                <input value={settings.twitter_handle || ''} onChange={e => set('twitter_handle', e.target.value)}
                                    placeholder="@yourbrand" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black tracking-tight" />
                            </div>
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"><Facebook size={12} /> Profile Segment (FB URL)</label>
                                <input value={settings.facebook_url || ''} onChange={e => set('facebook_url', e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold" />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Support Sidebar */}
                <div className="space-y-8">
                    <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500 mb-6 flex items-center gap-2 leading-none"><Info size={14} /> System Snapshot</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Brand Moniker</p>
                                <p className="text-sm font-black truncate max-w-[140px] leading-none mb-px">{settings.site_title || 'NULL'}</p>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Identity Root</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${settings.site_logo ? 'text-green-500' : 'text-red-500'}`}>
                                    {settings.site_logo ? 'Synced' : 'Missing'}
                                </p>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Legal Status</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${settings.affiliate_disclosure ? 'text-green-500' : 'text-amber-500'}`}>
                                    {settings.affiliate_disclosure ? 'Verified' : 'Action Required'}
                                </p>
                            </div>
                        </div>
                        <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] transition-all border border-white/10 flex items-center justify-center gap-3">
                            Preview Live Site <ExternalLink size={12} />
                        </button>
                    </div>

                    <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldCheck className="text-orange-600" size={24} />
                            <h3 className="text-xs font-black uppercase tracking-widest text-orange-950">Compliance Alert</h3>
                        </div>
                        <p className="text-xs text-orange-700 leading-relaxed font-medium">
                            Federal regulations require prominent affiliate disclosure. The parameters established here are broadcasted site-wide to maintain system-wide transparency and protect project integrity.
                        </p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <Layout className="text-gray-200 mb-4" size={48} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">Architecture Node</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">v1.2.0-Alpha Core</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

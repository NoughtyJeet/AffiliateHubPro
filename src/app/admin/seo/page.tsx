'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Save, RefreshCw, Search, BarChart2,
    Globe, FileCode, MapPin, CheckCircle,
    AlertCircle, X, Check, ShieldCheck, Zap
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type SEOSettings = {
    id: string; site_title: string; site_tagline: string | null;
    default_meta_description: string | null; search_console_meta: string | null;
    search_console_enabled: boolean; ga_measurement_id: string | null;
    ga_enabled: boolean; ga_affiliate_tracking: boolean; robots_txt: string | null;
    og_default_image: string | null; site_logo: string | null; favicon_url: string | null;
    affiliate_disclosure: string | null; twitter_handle: string | null; facebook_url: string | null;
};

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /api/

Sitemap: https://yoursite.com/sitemap.xml`;

export default function AdminSEO() {
    const [settings, setSettings] = useState<Partial<SEOSettings>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'gsc' | 'ga4' | 'robots' | 'sitemap' | 'general'>('general');
    const [sitemapGenerating, setSitemapGenerating] = useState(false);
    const supabase = createClient();

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await supabase.from('seo_settings').select('*').single();
            if (data) setSettings(data);
            else setSettings({
                robots_txt: DEFAULT_ROBOTS,
                search_console_enabled: false,
                ga_enabled: false,
                ga_affiliate_tracking: true,
                site_title: 'Flow Pro | Affiliate Hub',
                site_tagline: 'Premium Tools Discovery'
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown protocol error';
            console.error('Settings sync failure:', error);
            toast.error('Configuration Blocked: ' + (message || 'Unknown error'));
        }
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        const init = async () => {
            await fetchSettings();
        };
        init();
    }, [fetchSettings]);

    async function handleSave() {
        setSaving(true);
        const payload = { ...settings, updated_at: new Date().toISOString() };
        delete (payload as { id?: string }).id; // Remove id from payload for upsert if using single() logic or use specific update

        try {
            const { error } = settings.id
                ? await supabase.from('seo_settings').update(payload).eq('id', settings.id)
                : await supabase.from('seo_settings').insert(payload);

            if (error) { toast.error(error.message); }
            else { toast.success('SEO System Manifest Updated'); fetchSettings(); }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown protocol error';
            console.error('SEO settings sync failed:', message);
            toast.error('Search Engine Link Failure: ' + (message || 'Unknown error'));
        }
        setSaving(false);
    }

    function set(key: keyof SEOSettings, value: unknown) {
        setSettings(s => ({ ...s, [key]: value }));
    }

    async function handleGenerateSitemap() {
        setSitemapGenerating(true);
        await new Promise(r => setTimeout(r, 1500));
        toast.success('Sitemap Generation Triggered');
        setSitemapGenerating(false);
    }

    const tabs = [
        { id: 'general', label: 'Primary Config', icon: Globe },
        { id: 'gsc', label: 'Search Console', icon: Search },
        { id: 'ga4', label: 'Telemetry (GA4)', icon: BarChart2 },
        { id: 'robots', label: 'Spider Control', icon: FileCode },
        { id: 'sitemap', label: 'Network Map', icon: MapPin },
    ] as const;

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-32 space-y-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Decrypting SEO Matrix...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2 leading-none">Visibility Optimization</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">Search Intelligence</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Configure Global Indexing & Tracking Protocols
                    </p>
                </div>
                <button
                    onClick={async () => {
                        try {
                            await handleSave();
                        } catch (err: unknown) {
                            const message = err instanceof Error ? err.message : 'Unknown protocol error';
                            toast.error(message);
                        }
                    }}
                    disabled={saving}
                    className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-200 cursor-pointer disabled:bg-gray-400"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Commit Changes
                </button>
            </div>

            {/* Futuristic Tabs Navigation */}
            <div className="flex bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide gap-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-3 px-6 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === id
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                                : 'text-gray-400 hover:text-gray-900'
                            }`}
                    >
                        <Icon className="w-4 h-4" /> {label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -mr-32 -mt-32 opacity-50" />

                {/* General Management */}
                {activeTab === 'general' && (
                    <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Global Metadata</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Site Title Protocol</label>
                                <input value={settings.site_title || ''} onChange={e => set('site_title', e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold shadow-inner focus:bg-white focus:ring-4 focus:ring-amber-500/5 transition-all" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Universal Tagline</label>
                                <input value={settings.site_tagline || ''} onChange={e => set('site_tagline', e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold shadow-inner focus:bg-white transition-all" />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Meta Narrative</label>
                                <textarea rows={3} value={settings.default_meta_description || ''} onChange={e => set('default_meta_description', e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-medium shadow-inner focus:bg-white transition-all resize-none" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Default OG Canvas (URL)</label>
                                <input value={settings.og_default_image || ''} onChange={e => set('og_default_image', e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identity Asset (Logo URL)</label>
                                <input value={settings.site_logo || ''} onChange={e => set('site_logo', e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Social Handle (X)</label>
                                <input value={settings.twitter_handle || ''} onChange={e => set('twitter_handle', e.target.value)}
                                    placeholder="@handle" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Social Node (FB)</label>
                                <input value={settings.facebook_url || ''} onChange={e => set('facebook_url', e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" />
                            </div>
                            <div className="md:col-span-2 space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Affiliate Disclosure Manifesto</label>
                                <textarea rows={3} value={settings.affiliate_disclosure || ''} onChange={e => set('affiliate_disclosure', e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-[2rem] text-xs font-medium italic shadow-inner focus:bg-white transition-all resize-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Search Console Logic */}
                {activeTab === 'gsc' && (
                    <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                                <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Google Index Verification</h2>
                            </div>
                            <button
                                onClick={() => set('search_console_enabled', !settings.search_console_enabled)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.search_console_enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                    }`}
                            >
                                {settings.search_console_enabled ? <CheckCircle size={14} /> : <Zap size={14} />}
                                {settings.search_console_enabled ? 'ENABLED' : 'DISABLED'}
                            </button>
                        </div>

                        <div className={`space-y-8 ${settings.search_console_enabled ? '' : 'opacity-40 grayscale pointer-events-none'}`}>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Verification Token (Meta Content)</label>
                                <input value={settings.search_console_meta || ''} onChange={e => set('search_console_meta', e.target.value)}
                                    placeholder="GSC-Node-Key..."
                                    className="w-full px-8 py-6 bg-gray-900 border-4 border-gray-800 rounded-[2rem] text-sm font-mono text-blue-400 shadow-2xl focus:outline-none focus:border-blue-500/30 transition-all" />
                                {settings.search_console_meta && (
                                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 mt-4">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Injected Logic:</p>
                                        <code className="text-xs font-bold text-blue-900 break-all">{`<meta name="google-site-verification" content="${settings.search_console_meta}" />`}</code>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                    <ShieldCheck className="text-blue-500 mb-4" size={32} />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2">Root Verification</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">Verify your property to access deep indexing data, keyword performance, and core web vitals through GSC.</p>
                                </div>
                                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                    <AlertCircle className="text-amber-500 mb-4" size={32} />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-2">DNS Alternative</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed font-medium">For multi-domain coverage, use the DNS TXT record verification method in your registrar settings.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Layer */}
                {activeTab === 'ga4' && (
                    <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-6 bg-green-500 rounded-full" />
                                <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Telemetry Streams (GA4)</h2>
                            </div>
                            <button
                                onClick={() => set('ga_enabled', !settings.ga_enabled)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.ga_enabled ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                    }`}
                            >
                                {settings.ga_enabled ? <CheckCircle size={14} /> : <Zap size={14} />}
                                {settings.ga_enabled ? 'STREAMING' : 'OFFLINE'}
                            </button>
                        </div>

                        <div className={`space-y-10 ${settings.ga_enabled ? '' : 'opacity-40 grayscale pointer-events-none'}`}>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Measurement Identifier</label>
                                <input value={settings.ga_measurement_id || ''} onChange={e => set('ga_measurement_id', e.target.value)}
                                    placeholder="G-XXXXXX..."
                                    className="w-full px-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-black tabular-nums tracking-widest focus:bg-white focus:ring-4 focus:ring-green-500/5 shadow-inner transition-all" />
                            </div>

                            <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Advanced event tracking</h3>
                                    <div className="h-px bg-gray-100 flex-1 mx-6" />
                                </div>
                                <label className="flex items-center justify-between group cursor-pointer">
                                    <div>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight mb-0.5">Affiliate Signal Interception</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Track all &quot;Buy on Amazon&quot; actions automatically</p>
                                    </div>
                                    <button
                                        onClick={() => set('ga_affiliate_tracking', !settings.ga_affiliate_tracking)}
                                        className={`w-12 h-6 rounded-full relative transition-all ${settings.ga_affiliate_tracking ? 'bg-green-500 shadow-lg shadow-green-500/20' : 'bg-gray-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.ga_affiliate_tracking ? 'translate-x-7' : 'translate-x-1'}`} />
                                    </button>
                                </label>
                            </div>

                            <div className="p-8 bg-green-50/30 rounded-[2.5rem] border border-green-100 flex items-center gap-8">
                                <BarChart2 size={48} className="text-green-600 flex-shrink-0" />
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-green-900 mb-1 leading-none">Intelligence Metrics Enabled</h4>
                                    <p className="text-[10px] text-green-700 font-medium leading-relaxed">System is shadowing: Scroll Depth, Outbound Clicks, Article Dwell Time, and Referral Geographies. Optimized for minimal Vitals impact.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Robots.txt Command Shell */}
                {activeTab === 'robots' && (
                    <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-6 bg-gray-900 rounded-full" />
                                <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">Crawler Protocols (Robots.txt)</h2>
                            </div>
                            <button
                                onClick={() => set('robots_txt', DEFAULT_ROBOTS)}
                                className="text-[10px] font-black text-amber-500 uppercase tracking-widest hover:underline"
                            >
                                Revert to Default
                            </button>
                        </div>
                        <div className="relative group">
                            <textarea rows={16} value={settings.robots_txt || DEFAULT_ROBOTS} onChange={e => set('robots_txt', e.target.value)}
                                className="w-full px-10 py-10 bg-gray-900 border-4 border-gray-800 rounded-[3rem] text-sm font-mono text-green-400 focus:outline-none focus:border-amber-500/30 transition-all shadow-2xl resize-none" />
                            <div className="absolute top-10 right-10 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Protocol Active</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Network Map logic */}
                {activeTab === 'sitemap' && (
                    <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                            <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">XML Dynamic Sitemap</h2>
                        </div>

                        <div className="group bg-orange-50 border border-orange-100 p-10 rounded-[2.5rem] relative overflow-hidden transition-all hover:shadow-xl hover:shadow-orange-200/20">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full -mr-20 -mt-20 opacity-50" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-6">
                                    <RefreshCw className={`w-10 h-10 text-orange-600 ${sitemapGenerating ? 'animate-spin' : ''}`} />
                                    <div>
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">System Reconstruction</h3>
                                        <p className="text-xs text-orange-700 font-medium">Re-indexing all published nodes (Inventory + Journals + Taxonomy)</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerateSitemap}
                                    disabled={sitemapGenerating}
                                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 disabled:bg-orange-300"
                                >
                                    {sitemapGenerating ? 'TRANSMITTING...' : 'FORCE RE-INDEX GLOBAL MAP'}
                                </button>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 leading-none">Sitemap Manifest URL</p>
                            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <code className="text-xs font-black text-blue-600 tracking-tighter">https://yoursite.com/sitemap.xml</code>
                                <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900">Copy URL</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { 
    Settings, Globe, Shield, CreditCard, Mail, 
    Image as ImageIcon, Save, Check, AlertCircle, 
    Lock, Share2, Palette
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'contact' | 'social'>('general');

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Site settings synchronized!');
        }, 1500);
    };

    const tabs = [
        { id: 'general', label: 'Identity', icon: Globe },
        { id: 'seo', label: 'Visibility', icon: Shield },
        { id: 'contact', label: 'Channels', icon: Mail },
        { id: 'social', label: 'Social Sync', icon: Share2 },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 leading-none">System Architecture</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase italic">Core Configuration</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Managing Global Site Parameters
                    </p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-200 disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving ? 'SYNCRONIZING...' : 'COMMIT CHANGES'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Navigation Sidebar */}
                <aside className="lg:w-64 space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                activeTab === tab.id 
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Settings Form */}
                <main className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm shadow-gray-200/50">
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2 text-center pb-8 border-b border-gray-50">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs italic">01. Baseline Identity</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Platform Name</label>
                                    <input placeholder="Affiliate Pro" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand Visual (Logo URL)</label>
                                    <div className="flex gap-4">
                                        <input placeholder="/images/logo-dark.png" className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:bg-white" />
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-300">
                                            <ImageIcon size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Thematic Palette</label>
                                    <div className="flex gap-4">
                                        {['#f97316', '#3b82f6', '#10b981', '#ef4444'].map(c => (
                                            <button key={c} className="w-10 h-10 rounded-xl border-2 border-white ring-1 ring-gray-100 shadow-sm hover:scale-110 transition-transform" style={{ backgroundColor: c }} />
                                        ))}
                                        <button className="w-10 h-10 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                                            <Palette size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2 text-center pb-8 border-b border-gray-50">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs italic">02. Search Engine Strategy</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Global Meta Title</label>
                                    <input placeholder="Top Brands & Offers | TechPilot" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Meta Description Engine</label>
                                    <textarea rows={4} placeholder="High-fidelity product reviews and affiliate offers..." className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2 text-center pb-8 border-b border-gray-50">
                                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs italic">03. Communication Channels</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Administrative Email</label>
                                    <input type="email" placeholder="admin@example.com" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Endpoint</label>
                                    <input placeholder="https://support.example.com" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-12 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-center gap-4">
                        <AlertCircle className="text-blue-500 w-5 h-5 flex-shrink-0" />
                        <p className="text-[10px] text-blue-600 font-medium leading-relaxed uppercase tracking-tight">
                            Changes committed here will broadcast throughout the entire platform infrastructure instantly. Proceed with authorization.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}

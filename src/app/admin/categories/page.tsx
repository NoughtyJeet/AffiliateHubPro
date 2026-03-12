'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Plus, Edit, Trash2, Tag, FileText,
    ChevronRight, X, LayoutGrid, Search,
    FolderTree, Globe, Hash
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type Category = {
    id: string; name: string; slug: string; description: string | null;
    type: 'product' | 'blog'; meta_title: string | null; meta_description: string | null;
    image_url: string | null; created_at: string;
};

function slugify(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const empty = (): Partial<Category> => ({
    name: '', slug: '', description: '', type: 'product',
    meta_title: '', meta_description: '', image_url: ''
});

function CategoryContent() {
    const searchParams = useSearchParams();
    const [cats, setCats] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState<Partial<Category>>(empty());
    const [typeFilter, setTypeFilter] = useState<'all' | 'product' | 'blog'>('all');
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');
    const supabase = createClient();

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'blog' || type === 'product') {
            setTypeFilter(type);
        } else {
            setTypeFilter('all');
        }
    }, [searchParams]);

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('categories').select('*').order('name');
            if (error) throw error;
            setCats(data || []);
        } catch (error: any) {
            console.error('Category sync failure:', error);
            toast.error('Taxonomy Link Failed: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }

    function openNew() { setEditing(null); setForm(empty()); setShowForm(true); }
    function openEdit(c: Category) { setEditing(c); setForm({ ...c }); setShowForm(true); }

    async function handleSave() {
        if (!form.name?.trim()) { toast.error('Category name required'); return; }
        setSaving(true);
        console.log('Initiating taxonomy sync for node:', form.name);

        const payload = {
            ...form,
            slug: form.slug || slugify(form.name || ''),
            updated_at: new Date().toISOString()
        };

        try {
            const { error } = editing
                ? await supabase.from('categories').update(payload).eq('id', editing.id)
                : await supabase.from('categories').insert(payload);

            if (error) {
                console.error('Taxonomy sync failure:', error);
                toast.error(`Classification Blocked: ${error.message}`);
            } else {
                toast.success(editing ? 'Category node updated!' : 'New node initialized!');
                setShowForm(false);
                fetchData();
            }
        } catch (err: any) {
            console.error('Fatal taxonomy error:', err);
            toast.error('Fatal Protocol Error: Check console.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('DANGER: Deleting this category will leave associated records uncategorized. Proceed?')) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) toast.error(error.message);
        else { toast.success('Category erased'); fetchData(); }
    }

    const filtered = cats.filter(c => {
        const matchType = typeFilter === 'all' || c.type === typeFilter;
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 leading-none">Taxonomy Engine</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none text-balance">Content Classifications</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Managing {cats.length} Nodes in the Network
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200/50 cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Append New Node
                </button>
            </div>

            {/* Modern Filter Interface */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search directory..."
                        className="w-full pl-14 pr-6 py-4 rounded-[1.25rem] bg-white border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 transition-all shadow-sm placeholder:text-slate-300"
                    />
                </div>
                <div className="flex bg-white p-1.5 rounded-[1.25rem] border border-slate-100 shadow-sm w-full lg:w-auto">
                    {(['all', 'product', 'blog'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${typeFilter === t
                                    ? 'bg-slate-800 text-white shadow-lg shadow-slate-200/50'
                                    : 'bg-transparent text-slate-400 hover:text-slate-900'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-50 rounded-[2.5rem] animate-pulse border border-gray-100" />
                    ))
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center grayscale opacity-30">
                        <FolderTree size={64} className="mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs">No classification nodes found</p>
                    </div>
                ) : filtered.map(c => (
                    <div key={c.id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all flex flex-col items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />

                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 mb-6 ${c.type === 'product' ? 'bg-slate-50 text-slate-700' : 'bg-indigo-50 text-indigo-500'
                            }`}>
                            {c.type === 'product' ? <Tag size={28} /> : <FileText size={28} />}
                        </div>

                        <div className="text-center mb-6">
                            <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg mb-1 group-hover:text-slate-700 transition-colors leading-none">{c.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{c.slug}</p>
                        </div>

                        {c.description && (
                            <p className="text-center text-xs text-gray-500 line-clamp-2 mb-8 font-medium leading-relaxed px-2">
                                {c.description}
                            </p>
                        )}

                        <div className="mt-auto w-full flex items-center justify-between pt-6 border-t border-slate-50">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${c.type === 'product' ? 'bg-slate-50 text-slate-600' : 'bg-indigo-50 text-indigo-600'
                                }`}>
                                {c.type} ENTITY
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEdit(c)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all"
                                    title="Edit Data"
                                >
                                    <Edit size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                                    title="Erase Node"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Futuristic Category Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !saving && setShowForm(false)} />
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border-8 border-white">

                        <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Taxonomy Form</p>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    {editing ? 'Modify Node' : 'Initialize Node'}
                                </h2>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                            <section className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Entity Name *</label>
                                        <input
                                            value={form.name || ''}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))}
                                            className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Global Slug</label>
                                        <input
                                            value={form.slug || ''}
                                            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                            className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:ring-4 focus:ring-orange-500/5 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Domain Architecture</label>
                                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                                        {(['product', 'blog'] as const).map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, type: t }))}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.type === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                {t === 'product' ? <Tag size={12} /> : <FileText size={12} />}
                                                {t} Unit
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Node Description</label>
                                    <textarea
                                        rows={3}
                                        value={form.description || ''}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-orange-500/5 transition-all resize-none shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SEO Title Override</label>
                                    <input
                                        value={form.meta_title || ''}
                                        onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
                                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-bold"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Search Engine Summary</label>
                                    <textarea
                                        rows={2}
                                        value={form.meta_description || ''}
                                        onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
                                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-medium resize-none"
                                    />
                                </div>
                            </section>
                        </div>

                        <div className="p-10 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-4">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-10 py-4 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:bg-slate-400"
                            >
                                {saving ? 'SYNCING...' : editing ? 'VERIFY UPDATE' : 'DEPLOY NODE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminCategories() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-32">
                <div className="w-12 h-12 border-4 border-slate-700 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <CategoryContent />
        </Suspense>
    );
}

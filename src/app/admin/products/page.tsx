'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Edit, Trash2, Search, Filter,
    Star, ExternalLink, Eye, EyeOff, Tag,
    ChevronRight, MoreVertical, X, Check, Package, Upload
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Image from 'next/image';
import ProductImport from '@/components/admin/products/ProductImport';

type Product = {
    id: string; title: string; slug: string; description: string | null;
    short_description: string | null; pros: string[]; cons: string[];
    features: string[]; rating: number; review_count: number;
    affiliate_link: string | null; category_id: string | null;
    featured_image: string | null; meta_title: string | null;
    meta_description: string | null; schema_enabled: boolean;
    featured: boolean; status: 'draft' | 'published';
    price_range: string | null; brand: string | null;
    created_at: string;
};

type Category = { id: string; name: string; type: string };

function slugify(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const emptyProduct = (): Partial<Product> => ({
    title: '', slug: '', description: '', short_description: '',
    pros: [], cons: [], features: [], rating: 4.5, review_count: 0,
    affiliate_link: '', category_id: null, featured_image: '', meta_title: '',
    meta_description: '', schema_enabled: true, featured: false, status: 'draft',
    price_range: '', brand: ''
});

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState<Partial<Product>>(emptyProduct());
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [saving, setSaving] = useState(false);
    const [showImport, setShowImport] = useState(false);
    const supabase = createClient();

    // Array fields helpers
    const [prosInput, setProsInput] = useState('');
    const [consInput, setConsInput] = useState('');
    const [featuresInput, setFeaturesInput] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const { data: prods, error: pError } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (pError) throw pError;

            const { data: cats, error: cError } = await supabase
                .from('categories')
                .select('id, name, type')
                .eq('type', 'product');
            
            if (cError) throw cError;

            setProducts(prods || []);
            setCategories(cats || []);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown protocol error';
            console.error('Error fetching inventory intel:', error);
            toast.error('Intelligence Link Failed: ' + (message || 'Unknown protocol error'));
        } finally {
            setLoading(false);
        }
    }

    function openNew() {
        setEditing(null);
        setForm(emptyProduct());
        setProsInput(''); setConsInput(''); setFeaturesInput('');
        setShowForm(true);
    }

    function openEdit(p: Product) {
        setEditing(p);
        setForm({ ...p });
        setProsInput(p.pros?.join('\n') || '');
        setConsInput(p.cons?.join('\n') || '');
        setFeaturesInput(p.features?.join('\n') || '');
        setShowForm(true);
    }

    function handleTitleChange(title: string) {
        setForm(f => ({ ...f, title, slug: editing ? f.slug : slugify(title) }));
    }

    async function handleSave() {
        if (!form.title?.trim()) { toast.error('Title is required'); return; }
        setSaving(true);
        console.log('Initiating registry sync for product:', form.title);
        
        const payload = {
            ...form,
            pros: prosInput.split('\n').filter(l => l.trim()),
            cons: consInput.split('\n').filter(l => l.trim()),
            features: featuresInput.split('\n').filter(l => l.trim()),
            slug: form.slug || slugify(form.title || ''),
            updated_at: new Date().toISOString(),
        };

        try {
            const { error } = editing
                ? await supabase.from('products').update(payload).eq('id', editing.id)
                : await supabase.from('products').insert(payload);

            if (error) {
                console.error('Registry sync failed:', error);
                toast.error(`Protocol Failure: ${error.message} (Code: ${error.code})`);
            } else {
                toast.success(editing ? 'Product blueprint updated!' : 'New product authorized!');
                setShowForm(false);
                fetchData();
            }
        } catch (err: any) {
            console.error('Fatal error during sync:', err);
            toast.error('Fatal Sync Error: Check system console.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to permanently delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) toast.error(error.message);
        else { toast.success('Product deleted successfully'); fetchData(); }
    }

    async function toggleStatus(p: Product) {
        const newStatus = p.status === 'published' ? 'draft' : 'published';
        const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', p.id);
        if (!error) {
            toast.success(`Product ${newStatus === 'published' ? 'published' : 'moved to draft'}`);
            fetchData();
        }
    }

    const handleImportUrlData = (data: any) => {
        setForm(f => ({ ...f, ...data, slug: slugify(data.title) }));
        setShowForm(true);
        setShowImport(false);
    };

    const handleBulkImport = async (data: any[]) => {
        setSaving(true);
        const productsToInsert = data.map(item => ({
            title: item.title || 'Imported Product',
            slug: slugify(item.title || 'Imported Product') + '-' + Math.random().toString(36).substring(2, 5),
            brand: item.brand || null,
            affiliate_link: item.link || item.affiliate_link || null,
            status: 'draft',
            rating: 4.5,
            review_count: 0,
            pros: [], cons: [], features: [],
            created_at: new Date().toISOString(),
        }));

        const { error } = await supabase.from('products').insert(productsToInsert);
        
        if (error) {
            toast.error(`Bulk import failed: ${error.message}`);
        } else {
            toast.success(`Successfully registered ${data.length} products!`);
            fetchData();
            setShowImport(false);
        }
        setSaving(false);
    };

    const filtered = products.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 leading-none">Catalog Management</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Inventory Database</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Displaying {filtered.length} of {products.length} Products
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowImport(!showImport)}
                        className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer ${showImport ? 'bg-slate-100 text-slate-900 border border-slate-200' : 'bg-white text-slate-900 border border-slate-100 shadow-slate-200/50 hover:bg-slate-50'}`}
                    >
                        {showImport ? <X className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                        {showImport ? 'Close Portal' : 'Mass Registry'}
                    </button>
                    <button
                        onClick={openNew}
                        className="flex items-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-slate-200/50 cursor-pointer"
                    >
                        <Plus className="w-5 h-5" /> Register Product
                    </button>
                </div>
            </div>

            {/* Import Portal */}
            {showImport && (
                <ProductImport 
                    onImportUrl={handleImportUrlData}
                    onBulkImport={handleBulkImport}
                />
            )}

            {/* Futuristic Command Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search inventory by title or slug..."
                        className="w-full pl-14 pr-6 py-4 rounded-[1.25rem] bg-white border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 transition-all shadow-sm placeholder:text-slate-300"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="pl-14 pr-12 py-4 rounded-[1.25rem] bg-white border border-slate-100 text-sm font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="all">Level: All Status</option>
                        <option value="published">Status: Live</option>
                        <option value="draft">Status: Draft</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
            </div>

            {/* Advanced Data Table */}
            <div className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                        <div className="w-12 h-12 border-4 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 grayscale opacity-40">
                        <Package size={64} className="mb-6" />
                        <p className="font-black uppercase tracking-widest text-xs">No records matching your search</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    {['Product Intelligence', 'Affiliation & Category', 'Metrics', 'Live Status', 'Control Panel'].map(h => (
                                        <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-all group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 relative group-hover:scale-105 transition-transform">
                                                    {p.featured_image ? (
                                                        <Image src={p.featured_image} alt="" fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Tag size={20} className="text-slate-200" />
                                                        </div>
                                                    )}
                                                    {p.featured && (
                                                        <div className="absolute top-0 right-0 p-1 bg-amber-500 text-white rounded-bl-lg shadow-sm">
                                                            <Star size={10} className="fill-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-900 text-sm truncate group-hover:text-slate-700 transition-colors uppercase tracking-tight">{p.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{p.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 bg-gray-100 px-2 py-1 rounded w-fit">
                                                    {categories.find(c => c.id === p.category_id)?.name || 'Uncategorized'}
                                                </span>
                                                {p.brand && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-0.5">{p.brand}</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                                    <Star size={12} className="fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-black text-amber-700 leading-none">{p.rating}</span>
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold leading-none">{p.review_count} Reviews</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => toggleStatus(p)}
                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${p.status === 'published'
                                                    ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
                                                    : 'bg-gray-100 text-gray-400 border border-transparent hover:bg-gray-200'
                                                    }`}
                                            >
                                                {p.status === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {p.status}
                                            </button>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                    title="Edit Blueprint"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Erase Record"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Advanced Product Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !saving && setShowForm(false)} />
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border-8 border-white">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-8 border-b border-slate-50 bg-slate-50/50">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">System Form</p>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    {editing ? 'Modify Blueprint' : 'New Product Entry'}
                                </h2>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Scroll Content */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                            {/* Basic Meta */}
                            <section>
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1 italic">01. Core Identity</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Product Title *</label>
                                        <input value={form.title || ''} onChange={e => handleTitleChange(e.target.value)}
                                            className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Permanent Slug</label>
                                        <input value={form.slug || ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                            className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-500 transition-all" />
                                    </div>
                                </div>
                            </section>

                            {/* Specs */}
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1 italic">02. Specifications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/30 p-6 rounded-3xl border border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Brand</label>
                                        <input value={form.brand || ''} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Market Value</label>
                                        <input value={form.price_range || ''} onChange={e => setForm(f => ({ ...f, price_range: e.target.value }))}
                                            placeholder="e.g. $299 - $349" className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quality Rating</label>
                                        <input type="number" min="0" max="5" step="0.1" value={form.rating || 0}
                                            onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) }))}
                                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-black shadow-sm" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Affiliate Node (Amazon URL)</label>
                                        <input value={form.affiliate_link || ''} onChange={e => setForm(f => ({ ...f, affiliate_link: e.target.value }))}
                                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Classification</label>
                                        <select value={form.category_id || ''} onChange={e => setForm(f => ({ ...f, category_id: e.target.value || null }))}
                                            className="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm appearance-none">
                                            <option value="">ROOT: NO CATEGORY</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </section>

                            {/* Narrative Content */}
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1 italic">03. Content Engine</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Visual Asset URL (CDN)</label>
                                        <input value={form.featured_image || ''} onChange={e => setForm(f => ({ ...f, featured_image: e.target.value }))}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">The Overview (Excerpt)</label>
                                        <textarea rows={2} value={form.short_description || ''} onChange={e => setForm(f => ({ ...f, short_description: e.target.value }))}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium transition-all focus:bg-white focus:ring-2 focus:ring-orange-100" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">The Verdict (Review Body)</label>
                                        <textarea rows={4} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium transition-all focus:bg-white focus:ring-2 focus:ring-orange-100" />
                                    </div>
                                </div>
                            </section>

                            {/* Analysis Lists */}
                            <section>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1 italic">04. Field Analysis</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest ml-1">
                                            <Check size={12} /> Positive Factors
                                        </label>
                                        <textarea rows={4} value={prosInput} onChange={e => setProsInput(e.target.value)}
                                            className="w-full px-4 py-3 bg-green-50/10 border border-green-100 rounded-2xl text-xs font-medium focus:bg-white ring-green-100 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-widest ml-1">
                                            <X size={12} /> Negative Factors
                                        </label>
                                        <textarea rows={4} value={consInput} onChange={e => setConsInput(e.target.value)}
                                            className="w-full px-4 py-3 bg-red-50/10 border border-red-100 rounded-2xl text-xs font-medium focus:bg-white ring-red-100 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">
                                            Technical DNA
                                        </label>
                                        <textarea rows={4} value={featuresInput} onChange={e => setFeaturesInput(e.target.value)}
                                            className="w-full px-4 py-3 bg-blue-50/10 border border-blue-100 rounded-2xl text-xs font-medium focus:bg-white ring-blue-100 transition-all" />
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.featured ? 'bg-amber-500 border-amber-500' : 'border-slate-200 group-hover:border-amber-300'
                                        }`}>
                                        {form.featured && <Check size={14} className="text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Promote to Featured</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security:</span>
                                    <select value={form.status || 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none">
                                        <option value="draft">Level 0: Draft</option>
                                        <option value="published">Level 1: Live</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-8 py-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-slate-200 transition-all"
                                >
                                    {saving ? 'SYNCHRONIZING...' : editing ? 'VERIFY & UPDATE' : 'AUTHORIZE ENTRY'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

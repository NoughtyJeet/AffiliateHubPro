'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Edit, Trash2, Search, Filter,
    FileText, Eye, ChevronRight, X, Clock,
    MoreVertical, Check, MessageCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

type Post = {
    id: string; title: string; slug: string; content: string | null;
    excerpt: string | null; featured_image: string | null; category_id: string | null;
    meta_title: string | null; meta_description: string | null;
    faq_schema: Array<{ question: string; answer: string }>;
    tags: string[]; status: 'draft' | 'published' | 'scheduled';
    scheduled_at: string | null; read_time: number; created_at: string;
    views: number;
};

type Category = { id: string; name: string };

function slugify(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const emptyPost = (): Partial<Post> => ({
    title: '', slug: '', content: '', excerpt: '', featured_image: '',
    category_id: null, meta_title: '', meta_description: '',
    faq_schema: [], tags: [], status: 'draft', read_time: 5
});

export default function AdminBlog() {
    const { profile } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Post | null>(null);
    const [form, setForm] = useState<Partial<Post>>(emptyPost());
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [saving, setSaving] = useState(false);
    const [faqItems, setFaqItems] = useState<{ question: string; answer: string }[]>([]);
    const [tagsInput, setTagsInput] = useState('');
    const supabase = createClient();

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        setLoading(true);
        const { data: p } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        const { data: c } = await supabase.from('categories').select('id, name').eq('type', 'blog');
        setPosts(p || []); setCategories(c || []); setLoading(false);
    }

    function openNew() {
        setEditing(null); setForm(emptyPost()); setFaqItems([]); setTagsInput(''); setShowForm(true);
    }

    function openEdit(post: Post) {
        setEditing(post); setForm({ ...post });
        setFaqItems(post.faq_schema || []);
        setTagsInput((post.tags || []).join(', '));
        setShowForm(true);
    }

    function addFaq() { setFaqItems(f => [...f, { question: '', answer: '' }]); }
    function removeFaq(i: number) { setFaqItems(f => f.filter((_, idx) => idx !== i)); }
    function updateFaq(i: number, field: 'question' | 'answer', val: string) {
        setFaqItems(f => f.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
    }

    async function handleSave() {
        if (!form.title?.trim()) { toast.error('Title is required'); return; }
        setSaving(true);
        const payload = {
            ...form,
            slug: form.slug || slugify(form.title || ''),
            faq_schema: faqItems.filter(f => f.question.trim()),
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
            author_id: profile?.id,
            updated_at: new Date().toISOString(),
        };

        const { error } = editing
            ? await supabase.from('blog_posts').update(payload).eq('id', editing.id)
            : await supabase.from('blog_posts').insert(payload);

        if (error) { toast.error(error.message); }
        else { toast.success(editing ? 'Article updated!' : 'Article published!'); setShowForm(false); fetchData(); }
        setSaving(false);
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to permanently delete this article?')) return;
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) toast.error(error.message);
        else { toast.success('Article erased successfully'); fetchData(); }
    }

    async function toggleStatus(p: Post) {
        const s = p.status === 'published' ? 'draft' : 'published';
        const { error } = await supabase.from('blog_posts').update({ status: s }).eq('id', p.id);
        if (!error) {
            toast.success(`Article code shifted to ${s}`);
            fetchData();
        }
    }

    const filtered = posts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === 'all' || p.status === statusFilter)
    );

    const wordCount = (form.content || '').split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 leading-none">Editorial Control</p>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Journal Library</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Managing {filtered.length} of {posts.length} Articles
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                    <Plus className="w-5 h-5" /> Author New Guide
                </button>
            </div>

            {/* Futuristic Command Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Filter library by headline or slug..."
                        className="w-full pl-14 pr-6 py-4 rounded-[1.25rem] bg-white border border-gray-100 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-300"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="pl-14 pr-12 py-4 rounded-[1.25rem] bg-white border border-gray-100 text-sm font-black uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 appearance-none cursor-pointer shadow-sm"
                    >
                        <option value="all">Level: All Status</option>
                        <option value="published">Status: Live</option>
                        <option value="draft">Status: Draft</option>
                        <option value="scheduled">Status: Scheduled</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                </div>
            </div>

            {/* Advanced Data Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 grayscale opacity-40">
                        <FileText size={64} className="mb-6" />
                        <p className="font-black uppercase tracking-widest text-xs">No records matching your filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-50">
                                    {['Article Context', 'Intelligence', 'Interaction', 'Availability', 'Created At', 'Control Panel'].map(h => (
                                        <th key={h} className="text-left px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-blue-500">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 relative group-hover:scale-105 transition-transform">
                                                    {p.featured_image ? (
                                                        <img src={p.featured_image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FileText size={20} className="text-gray-200" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{p.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg w-fit block">
                                                {categories.find(c => c.id === p.category_id)?.name || 'Editorial'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-blue-600">
                                                    <Eye size={12} />
                                                    <span className="text-xs font-black uppercase tracking-widest leading-none">{p.views || 0}</span>
                                                </div>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Global Reads</p>
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
                                                {p.status === 'published' ? <Check size={12} /> : <Clock size={12} />}
                                                {p.status}
                                            </button>
                                        </td>
                                        <td className="px-8 py-5 text-[11px] font-bold text-gray-500 tabular-nums">
                                            {new Intl.DateTimeFormat('en-US').format(new Date(p.created_at))}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-sm"
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

            {/* Advanced Blog Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => !saving && setShowForm(false)} />
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border-8 border-white">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-10 border-b border-gray-50 bg-gray-50/30">
                            <div>
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">Editorial Interface</p>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                    {editing ? 'Modify Publication' : 'Release New Journal'}
                                </h2>
                            </div>
                            <button onClick={() => setShowForm(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-md hover:rotate-90">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Scroll Content */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-12 scrollbar-hide">
                            {/* Genesis Block */}
                            <section>
                                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-8 leading-none px-1">01 // Publication Identity</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Article Headline *</label>
                                        <input
                                            value={form.title || ''}
                                            onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))}
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL Identifier (Slug)</label>
                                        <input
                                            value={form.slug || ''}
                                            onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Editorial Type</label>
                                        <select value={form.category_id || ''} onChange={e => setForm(f => ({ ...f, category_id: e.target.value || null }))}
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm appearance-none">
                                            <option value="">ROOT: GUIDES</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Classification Tags</label>
                                        <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tech, review, guide..."
                                            className="w-full px-6 py-4 bg-white border border-gray-100 rounded-2xl text-xs font-bold" />
                                    </div>
                                </div>
                            </section>

                            {/* Cognitive Content */}
                            <section>
                                <div className="flex items-center justify-between mb-8 px-1">
                                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] leading-none">02 // Knowledge Engine</h3>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${wordCount > 1000 ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                                            {wordCount} Core Words
                                        </span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                                            EST. {form.read_time || 5} MIN
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Narrative Abstract (Excerpt)</label>
                                        <textarea rows={2} value={form.excerpt || ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl text-sm font-medium focus:bg-white transition-all shadow-inner" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Manuscript (Full Body)</label>
                                        <textarea
                                            rows={16}
                                            value={form.content || ''}
                                            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                            placeholder="Inject HTML or Markdown content here..."
                                            className="w-full px-8 py-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] text-sm font-mono leading-relaxed focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all shadow-inner"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Data Insights (FAQ) */}
                            <section>
                                <div className="flex items-center justify-between mb-8 px-1">
                                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] leading-none">03 // Intelligence Blocks (FAQ)</h3>
                                    <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">
                                        <Plus size={14} /> Add Block
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {faqItems.map((faq, i) => (
                                        <div key={i} className="group bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm relative animate-in zoom-in-95 duration-300">
                                            <button onClick={() => removeFaq(i)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="space-y-4">
                                                <input value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)}
                                                    placeholder="Query Statement"
                                                    className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-tight" />
                                                <textarea rows={3} value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)}
                                                    placeholder="Response Data"
                                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-xs font-medium leading-relaxed resize-none" />
                                            </div>
                                        </div>
                                    ))}
                                    {faqItems.length === 0 && (
                                        <div className="col-span-full py-12 text-center bg-gray-50/30 border-2 border-dashed border-gray-100 rounded-[2rem]">
                                            <MessageCircle size={32} className="mx-auto text-gray-200 mb-4" />
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No Intelligence Blocks Found</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex flex-wrap items-center justify-between gap-10">
                            <div className="flex items-center gap-8">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Protocol Level</span>
                                    <select value={form.status || 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as Post['status'] }))}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-100">
                                        <option value="draft">STG: Draft</option>
                                        <option value="published">PRD: Live</option>
                                        <option value="scheduled">TIM: Scheduled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    Discard Manuscript
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                                >
                                    {saving ? 'SYNCHRONIZING...' : editing ? 'DEPLOY UPDATES' : 'PUBLISH OVERRIDE'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

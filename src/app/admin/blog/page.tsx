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

import ArticleEditor from '@/components/admin/blog/ArticleEditor';
import AIAssistant from '@/components/admin/blog/AIAssistant';

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
        try {
            const { data: p, error: pError } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
            if (pError) throw pError;
            
            const { data: c, error: cError } = await supabase.from('categories').select('id, name').eq('type', 'blog');
            if (cError) throw cError;

            setPosts(p || []);
            setCategories(c || []);
        } catch (error: any) {
            console.error('Blog sync failure:', error);
            toast.error('Editorial Link Failed: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
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

    const handleApplyAI = (type: 'title' | 'meta' | 'outline', value: string) => {
        if (type === 'title') {
            setForm(f => ({ ...f, title: value, slug: editing ? f.slug : slugify(value) }));
            toast.success('AI Title Applied!');
        } else if (type === 'meta') {
            setForm(f => ({ ...f, meta_description: value }));
            toast.success('AI Meta Description Applied!');
        }
    };

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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Dynamic Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 leading-none">Editorial Control</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Journal Library</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-3">
                        Managing {filtered.length} of {posts.length} Publications
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-3 bg-slate-800 border border-slate-700 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer"
                >
                    <Plus className="w-5 h-5 text-slate-400" /> Author New Manuscript
                </button>
            </div>

            {/* Futuristic Command Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search publications by headline or digital signature..."
                        className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] bg-white border border-slate-100 text-sm font-bold text-slate-900 focus:outline-none focus:ring-8 focus:ring-slate-50/50 focus:border-slate-500/30 transition-all shadow-sm placeholder:text-slate-300"
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="pl-14 pr-12 py-5 rounded-[1.5rem] bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:outline-none focus:border-slate-500 transition-all appearance-none cursor-pointer shadow-sm min-w-[200px]"
                    >
                        <option value="all">Level: All Status</option>
                        <option value="published">Status: PRD / Live</option>
                        <option value="draft">Status: STG / Draft</option>
                        <option value="scheduled">Status: TIM / Scheduled</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
                </div>
            </div>

            {/* Advanced Data Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="w-10 h-10 border-4 border-slate-700 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 grayscale opacity-40">
                        <FileText size={48} className="mb-6 text-gray-300" />
                        <p className="font-black uppercase tracking-widest text-[10px] text-gray-400">No records found matching current protocol</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-50">
                                    {['Manuscript', 'Topic', 'Intelligence', 'Availability', 'Created', 'Control'].map(h => (
                                        <th key={h} className="text-left px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-all group border-l-4 border-l-transparent hover:border-l-slate-500">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 relative group-hover:scale-105 transition-transform">
                                                    {p.featured_image ? (
                                                        <img src={p.featured_image} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <FileText size={24} className="text-slate-200" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-slate-900 text-sm truncate group-hover:text-slate-700 transition-colors uppercase italic tracking-tight">{p.title}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate mt-1 opacity-70">{p.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                                {categories.find(c => c.id === p.category_id)?.name || 'Editorial'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-slate-900 italic">
                                                    <Eye size={12} className="text-slate-500" />
                                                    <span className="text-xs font-black uppercase tracking-widest leading-none">{p.views || 0}</span>
                                                </div>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Global Reads</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <button
                                                onClick={() => toggleStatus(p)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${p.status === 'published'
                                                        ? 'bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500/20'
                                                        : 'bg-gray-100 text-gray-400 border border-transparent hover:bg-gray-200'
                                                    }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`} />
                                                {p.status}
                                            </button>
                                        </td>
                                        <td className="px-10 py-6 text-[11px] font-bold text-gray-500 tabular-nums uppercase opacity-70">
                                            {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(p.created_at))}
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-800 text-white hover:bg-slate-900 transition-all shadow-xl shadow-slate-200"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-red-500 hover:bg-red-50 transition-all shadow-lg"
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

            {/* Advanced Blog Form Modal (Command Center Style) */}
            {showForm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => !saving && setShowForm(false)} />
                    <div className="bg-[#FDFDFD] w-full h-full lg:w-[98vw] lg:h-[96vh] lg:rounded-[3rem] shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-500 overflow-hidden border-4 border-white">

                        {/* Modal Top Bar */}
                        <div className="flex items-center justify-between px-10 h-24 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200">
                                    <FileText className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">Editor Terminal</p>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
                                        {editing ? 'Modify Manuscript' : 'Initialize New Publication'}
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
                                >
                                    Cancel Operations
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:bg-black active:scale-95 disabled:bg-gray-400"
                                >
                                    {saving ? 'Synchronizing...' : (editing ? 'Update Registry' : 'Deploy Manuscript')}
                                </button>
                            </div>
                        </div>

                        {/* Full Screen Layout: Editor + Sidebar */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto p-12 space-y-16 scrollbar-hide">
                                {/* Core Identity Block */}
                                <section>
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-black text-xs">01</div>
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Manuscript Core Identity</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                        <div className="lg:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Headline Manifest *</label>
                                            <input
                                                value={form.title || ''}
                                                onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))}
                                                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold shadow-sm focus:outline-none focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500 transition-all placeholder:text-gray-300"
                                                placeholder="Enter a powerful title..."
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Digital Slug</label>
                                            <input
                                                value={form.slug || ''}
                                                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold shadow-sm focus:outline-none focus:border-orange-500 transition-all opacity-60 hover:opacity-100"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Editorial Dept</label>
                                            <select value={form.category_id || ''} onChange={e => setForm(f => ({ ...f, category_id: e.target.value || null }))}
                                                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm appearance-none focus:border-orange-500 transition-all">
                                                <option value="">DEPT: GUIDES</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                {/* Rich Text Engine */}
                                <section className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-black text-xs">02</div>
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Knowledge Block (Rich Text)</h3>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-end">
                                                <p className="text-[9px] font-black text-gray-300 uppercase leading-none mb-1">Estimated Reading</p>
                                                <p className="text-xs font-bold text-gray-500 italic uppercase tabular-nums">{Math.ceil((form.content || '').split(/\s+/).length / 200)} Minutes</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Manucript Abstract (Excerpt)</label>
                                        <textarea 
                                            rows={2} 
                                            value={form.excerpt || ''} 
                                            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                                            placeholder="Provide a concise summary for SEO and previews..."
                                            className="w-full px-8 py-6 bg-white border border-gray-100 rounded-[2rem] text-sm font-medium focus:border-orange-500 transition-all shadow-sm italic leading-relaxed" 
                                        />
                                    </div>

                                    <ArticleEditor 
                                        content={form.content || ''} 
                                        onChange={(html) => setForm(f => ({ ...f, content: html }))} 
                                    />
                                </section>

                                {/* Metadata & Taxonomy Block */}
                                <section>
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 font-black text-xs">03</div>
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Global Connectivity (SEO & Tags)</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SEO Title Override</label>
                                            <input value={form.meta_title || ''} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
                                                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold shadow-sm focus:border-purple-500 transition-all" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Classification Keywords (Tags)</label>
                                            <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tech, review, efficiency..."
                                                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-3xl text-sm font-bold focus:border-purple-500 transition-all" />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SEO Description Manifest</label>
                                            <textarea rows={3} value={form.meta_description || ''} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
                                                className="w-full px-8 py-6 bg-white border border-gray-100 rounded-[2rem] text-sm font-medium focus:border-purple-500 transition-all" />
                                        </div>
                                    </div>
                                </section>

                                {/* Intelligence Blocks (FAQ) */}
                                <section>
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 font-black text-xs">04</div>
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Intelligence Blocks (FAQ)</h3>
                                        </div>
                                        <button onClick={addFaq} className="flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
                                            <Plus size={16} /> New Intelligence Block
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {faqItems.map((faq, i) => (
                                            <div key={i} className="group bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-10 relative hover:border-orange-500 transition-all">
                                                <button onClick={() => removeFaq(i)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">System Query</label>
                                                        <input value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)}
                                                            className="w-full px-4 py-2 bg-gray-50/50 rounded-xl text-xs font-black uppercase tracking-tight" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">Protocol Response</label>
                                                        <textarea rows={3} value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)}
                                                            className="w-full px-4 py-3 bg-gray-50/50 rounded-xl text-xs font-medium leading-relaxed resize-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Availability Protocol */}
                                <section className="p-10 bg-gray-900 rounded-[3rem] text-white flex flex-wrap items-center justify-between gap-10">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Deployment Level</p>
                                        <div className="flex bg-white/5 rounded-2xl p-1.5 p-1 border border-white/10">
                                            {[
                                                { id: 'draft', label: 'STG : DRAFT', color: 'bg-amber-500' },
                                                { id: 'published', label: 'PRD : LIVE', color: 'bg-green-500' },
                                                { id: 'scheduled', label: 'TIM : FUTURE', color: 'bg-blue-500' }
                                            ].map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setForm(f => ({ ...f, status: s.id as Post['status'] }))}
                                                    className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all gap-2 flex items-center ${form.status === s.id ? 'bg-white text-gray-900 shadow-xl' : 'text-gray-400 hover:text-white'}`}
                                                >
                                                    <div className={`w-1.5 h-1.5 rounded-full ${s.color} ${form.status === s.id ? '' : 'opacity-40'}`} />
                                                    {s.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Manuscript Hash</p>
                                        <p className="text-xs font-mono text-gray-400 truncate max-w-[200px]">{form.id || 'NEW-RECORD'}</p>
                                    </div>
                                </section>
                            </div>

                            {/* AI Assistant Sidebar */}
                            <AIAssistant 
                                title={form.title || ''} 
                                content={form.content || ''} 
                                onApply={handleApplyAI} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, FileText, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type Post = {
  id: string; title: string; slug: string; content: string | null;
  excerpt: string | null; featured_image: string | null; category_id: string | null;
  meta_title: string | null; meta_description: string | null;
  faq_schema: Array<{ question: string; answer: string }>;
  tags: string[]; status: 'draft' | 'published' | 'scheduled';
  scheduled_at: string | null; read_time: number; created_at: string;
};
type Category = { id: string; name: string };

function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

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

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setLoading(true);
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name').eq('type', 'blog'),
    ]);
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
    if (!form.title?.trim()) { toast.error('Title required'); return; }
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
    if (error) toast.error(error.message);
    else { toast.success(editing ? 'Post updated!' : 'Post created!'); setShowForm(false); fetchData(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    toast.success('Deleted'); fetchData();
  }

  async function toggleStatus(p: Post) {
    const s = p.status === 'published' ? 'draft' : 'published';
    await supabase.from('blog_posts').update({ status: s }).eq('id', p.id);
    fetchData();
  }

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || p.status === statusFilter)
  );

  const wordCount = (form.content || '').split(/\s+/).filter(Boolean).length;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} posts</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No posts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Post', 'Category', 'Status', 'Read Time', 'Date', 'Actions'].map(h =>
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                )}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.featured_image ? (
                          <img src={p.featured_image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                          <p className="text-xs text-gray-400">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {categories.find(c => c.id === p.category_id)?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(p)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === 'published' ? 'bg-green-100 text-green-700' : p.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.read_time} min</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Post' : 'New Blog Post'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input value={form.slug || ''} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category_id || ''} onChange={e => setForm(f => ({ ...f, category_id: e.target.value || null }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                    <option value="">— Select —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status || 'draft'} onChange={e => setForm(f => ({ ...f, status: e.target.value as Post['status'] }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input value={form.featured_image || ''} onChange={e => setForm(f => ({ ...f, featured_image: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                  <input value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="tech, review, guide"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea rows={2} value={form.excerpt || ''} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Content (HTML/Markdown)</label>
                  <span className="text-xs text-gray-400">{wordCount} words</span>
                </div>
                <textarea rows={16} value={form.content || ''} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Write your long-form content here. Supports HTML tags for formatting."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-y" />
                {wordCount < 300 && wordCount > 0 && (
                  <p className="text-xs text-amber-500 mt-1">⚠️ Recommended: 2000+ words for SEO performance</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                  <input value={form.meta_title || ''} onChange={e => setForm(f => ({ ...f, meta_title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <input value={form.meta_description || ''} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
              </div>

              {/* FAQ Builder */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">FAQ Schema Builder</label>
                  <button onClick={addFaq} className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add FAQ
                  </button>
                </div>
                <div className="space-y-3">
                  {faqItems.map((faq, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">FAQ #{i + 1}</span>
                        <button onClick={() => removeFaq(i)} className="text-red-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <input value={faq.question} onChange={e => updateFaq(i, 'question', e.target.value)}
                        placeholder="Question"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                      <textarea rows={2} value={faq.answer} onChange={e => updateFaq(i, 'answer', e.target.value)}
                        placeholder="Answer"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none" />
                    </div>
                  ))}
                  {faqItems.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No FAQs added yet. FAQs improve SEO with structured data.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2 rounded-xl text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

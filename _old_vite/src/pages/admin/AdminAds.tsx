import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Megaphone, Monitor, Smartphone, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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
  homepage_top: 'Homepage — Top', homepage_middle: 'Homepage — Middle',
  blog_top: 'Blog Post — Top', blog_middle: 'Blog Post — Middle', blog_bottom: 'Blog Post — Bottom',
  sidebar: 'Sidebar', category_page: 'Category Page', product_grid: 'Between Product Grid',
  after_paragraph_2: 'After 2nd Paragraph', before_faq: 'Before FAQ Section'
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
    if (!form.ad_name?.trim()) { toast.error('Ad name required'); return; }
    setSaving(true);
    const payload = { ...form, updated_at: new Date().toISOString() };
    const { error } = editing
      ? await supabase.from('ads').update(payload).eq('id', editing.id)
      : await supabase.from('ads').insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editing ? 'Ad updated!' : 'Ad created!'); setShowForm(false); fetchData(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this ad?')) return;
    await supabase.from('ads').delete().eq('id', id);
    toast.success('Deleted'); fetchData();
  }

  async function toggleAd(a: Ad) {
    await supabase.from('ads').update({ status: !a.status }).eq('id', a.id);
    fetchData();
  }

  const set = (key: keyof Ad, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ad Manager</h1>
          <p className="text-sm text-gray-500 mt-1">{ads.filter(a => a.status).length} active ads</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-600">
          <Plus className="w-4 h-4" /> Create Ad
        </button>
      </div>

      {/* Placement Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {PLACEMENTS.slice(0, 5).map(p => {
          const count = ads.filter(a => a.placement === p && a.status).length;
          return (
            <div key={p} className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-xs text-gray-500 mb-1">{PLACEMENT_LABELS[p]}</p>
              <p className="text-lg font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-400">active</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16">
            <Megaphone className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500">No ads created yet</p>
            <button onClick={openNew} className="mt-4 text-orange-500 font-medium text-sm hover:text-orange-600">Create your first ad →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Ad Name', 'Type', 'Placement', 'Device', 'Schedule', 'Status', 'Actions'].map(h =>
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                )}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ads.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Megaphone className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{a.ad_name}</p>
                          <p className="text-xs text-gray-400">{a.width}×{a.height}px</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">{a.ad_type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{PLACEMENT_LABELS[a.placement] || a.placement}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {(a.device_target === 'both' || a.device_target === 'desktop') && <Monitor className="w-4 h-4 text-gray-500" />}
                        {(a.device_target === 'both' || a.device_target === 'mobile') && <Smartphone className="w-4 h-4 text-gray-500" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {a.start_date ? new Date(a.start_date).toLocaleDateString() : 'Always'}
                      {a.end_date ? ` → ${new Date(a.end_date).toLocaleDateString()}` : ''}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleAd(a)}>
                        {a.status
                          ? <ToggleRight className="w-8 h-8 text-green-500 hover:text-green-600" />
                          : <ToggleLeft className="w-8 h-8 text-gray-300 hover:text-gray-400" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editing ? 'Edit Ad' : 'Create New Ad'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Name *</label>
                  <input value={form.ad_name || ''} onChange={e => set('ad_name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Type</label>
                  <select value={form.ad_type || 'custom_html'} onChange={e => set('ad_type', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                    <option value="adsense">Google AdSense</option>
                    <option value="custom_html">Custom HTML</option>
                    <option value="image">Image Ad</option>
                    <option value="script">Script Ad</option>
                    <option value="affiliate_banner">Affiliate Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placement</label>
                  <select value={form.placement || 'blog_middle'} onChange={e => set('placement', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                    {PLACEMENTS.map(p => <option key={p} value={p}>{PLACEMENT_LABELS[p]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Device Target</label>
                  <select value={form.device_target || 'both'} onChange={e => set('device_target', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white">
                    <option value="both">Both (Desktop + Mobile)</option>
                    <option value="desktop">Desktop Only</option>
                    <option value="mobile">Mobile Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                  <input type="number" value={form.width || 728} onChange={e => set('width', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                  <input type="number" value={form.height || 90} onChange={e => set('height', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (optional)</label>
                  <input type="date" value={form.start_date || ''} onChange={e => set('start_date', e.target.value || null)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
                  <input type="date" value={form.end_date || ''} onChange={e => set('end_date', e.target.value || null)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                </div>
              </div>

              {(form.ad_type === 'image' || form.ad_type === 'affiliate_banner') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input value={form.image_url || ''} onChange={e => set('image_url', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                    <input value={form.link_url || ''} onChange={e => set('link_url', e.target.value)}
                      placeholder="https://amazon.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                  </div>
                </>
              )}

              {(form.ad_type === 'custom_html' || form.ad_type === 'adsense' || form.ad_type === 'script') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Code</label>
                  <p className="text-xs text-gray-500 mb-1">Paste your ad code here (HTML, AdSense snippet, or script)</p>
                  <textarea rows={8} value={form.ad_code || ''} onChange={e => set('ad_code', e.target.value)}
                    placeholder="<!-- Ad code here -->"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-y bg-gray-900 text-green-400" />
                </div>
              )}

              <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800">
                💡 Ad containers reserve space to prevent layout shift (CLS). Width × Height defines the reserved space.
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.status !== false} onChange={e => set('status', e.target.checked)}
                  className="w-4 h-4 text-orange-500 rounded" />
                <span className="text-sm font-medium text-gray-700">Active (show this ad)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2 rounded-xl text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update Ad' : 'Create Ad'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

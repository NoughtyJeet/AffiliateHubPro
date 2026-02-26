import { useState, useEffect } from 'react';
import { Save, Globe, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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
    const { error } = settings.id
      ? await supabase.from('seo_settings').update(payload).eq('id', settings.id)
      : await supabase.from('seo_settings').insert(payload);
    if (error) toast.error(error.message);
    else toast.success('Settings saved!');
    setSaving(false);
  }

  const set = (key: keyof Settings, value: string) => setSettings(s => ({ ...s, [key]: value }));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Global site configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Globe className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-semibold text-gray-900">Site Identity</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                <input value={settings.site_title || ''} onChange={e => set('site_title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input value={settings.site_tagline || ''} onChange={e => set('site_tagline', e.target.value)}
                  placeholder="Your trusted source for product reviews"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo URL</label>
                <input value={settings.site_logo || ''} onChange={e => set('site_logo', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                {settings.site_logo && <img src={settings.site_logo} alt="Logo preview" className="mt-2 h-10 object-contain rounded" />}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <input value={settings.favicon_url || ''} onChange={e => set('favicon_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default OG Image URL</label>
                <input value={settings.og_default_image || ''} onChange={e => set('og_default_image', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-semibold text-gray-900">Affiliate Disclosure</h2>
            </div>
            <textarea rows={4} value={settings.affiliate_disclosure || ''} onChange={e => set('affiliate_disclosure', e.target.value)}
              placeholder="This site participates in the Amazon Services LLC Associates Program..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none" />
            <p className="text-xs text-gray-500 mt-1">Displayed in site footer and product pages. Required by FTC.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Twitter className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-semibold text-gray-900">Social Media</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Handle</label>
                <input value={settings.twitter_handle || ''} onChange={e => set('twitter_handle', e.target.value)}
                  placeholder="@youraccount"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page URL</label>
                <input value={settings.facebook_url || ''} onChange={e => set('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Info</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between"><span>Site Title</span><span className="font-medium text-gray-900 truncate max-w-[120px]">{settings.site_title || 'Not set'}</span></li>
              <li className="flex justify-between"><span>Logo</span><span className={settings.site_logo ? 'text-green-600 font-medium' : 'text-gray-400'}>
                {settings.site_logo ? '✓ Set' : 'Not set'}</span></li>
              <li className="flex justify-between"><span>Disclosure</span><span className={settings.affiliate_disclosure ? 'text-green-600 font-medium' : 'text-amber-500'}>
                {settings.affiliate_disclosure ? '✓ Set' : '⚠ Required'}</span></li>
            </ul>
          </div>

          <div className="bg-orange-50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-orange-900 mb-2">FTC Compliance</h3>
            <p className="text-xs text-orange-700">Amazon affiliates must prominently disclose their relationship. Ensure your affiliate disclosure is clear and visible on all product pages and posts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

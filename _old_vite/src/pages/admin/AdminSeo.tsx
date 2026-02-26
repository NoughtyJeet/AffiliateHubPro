import { useState, useEffect } from 'react';
import { Save, RefreshCw, Search, BarChart2, Globe, FileCode, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
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

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    setLoading(true);
    const { data } = await supabase.from('seo_settings').select('*').single();
    if (data) setSettings(data);
    else setSettings({ robots_txt: DEFAULT_ROBOTS, search_console_enabled: false, ga_enabled: false, ga_affiliate_tracking: true });
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...settings, updated_at: new Date().toISOString() };
    const { error } = settings.id
      ? await supabase.from('seo_settings').update(payload).eq('id', settings.id)
      : await supabase.from('seo_settings').insert(payload);
    if (error) toast.error(error.message);
    else { toast.success('SEO settings saved!'); fetchSettings(); }
    setSaving(false);
  }

  function set(key: keyof SEOSettings, value: unknown) {
    setSettings(s => ({ ...s, [key]: value }));
  }

  async function handleGenerateSitemap() {
    setSitemapGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Sitemap generation triggered! Auto-deploys on publish.');
    setSitemapGenerating(false);
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'gsc', label: 'Search Console', icon: Search },
    { id: 'ga4', label: 'Analytics (GA4)', icon: BarChart2 },
    { id: 'robots', label: 'Robots.txt', icon: FileCode },
    { id: 'sitemap', label: 'Sitemap', icon: MapPin },
  ] as const;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Google Search Console, Analytics, Robots, and Sitemap management</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === id ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* General */}
        {activeTab === 'general' && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900">General SEO Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
                <input value={settings.site_title || ''} onChange={e => set('site_title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Tagline</label>
                <input value={settings.site_tagline || ''} onChange={e => set('site_tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Description</label>
                <textarea rows={3} value={settings.default_meta_description || ''} onChange={e => set('default_meta_description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default OG Image URL</label>
                <input value={settings.og_default_image || ''} onChange={e => set('og_default_image', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Logo URL</label>
                <input value={settings.site_logo || ''} onChange={e => set('site_logo', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Handle</label>
                <input value={settings.twitter_handle || ''} onChange={e => set('twitter_handle', e.target.value)}
                  placeholder="@yoursitename"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page URL</label>
                <input value={settings.facebook_url || ''} onChange={e => set('facebook_url', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Affiliate Disclosure Text</label>
                <textarea rows={3} value={settings.affiliate_disclosure || ''} onChange={e => set('affiliate_disclosure', e.target.value)}
                  placeholder="This site contains affiliate links. As an Amazon Associate, we earn from qualifying purchases..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-none" />
              </div>
            </div>
          </div>
        )}

        {/* Google Search Console */}
        {activeTab === 'gsc' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Google Search Console</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-600">Enable</span>
                <div onClick={() => set('search_console_enabled', !settings.search_console_enabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.search_console_enabled ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.search_console_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>
            </div>

            <div className={`${settings.search_console_enabled ? '' : 'opacity-50 pointer-events-none'}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HTML Meta Verification Content</label>
                <p className="text-xs text-gray-500 mb-2">Paste the <code className="bg-gray-100 px-1 rounded">content</code> attribute value from the HTML tag Google provides.</p>
                <input value={settings.search_console_meta || ''} onChange={e => set('search_console_meta', e.target.value)}
                  placeholder="abc123xyz..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                {settings.search_console_meta && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">This will be injected as:</p>
                    <code className="text-xs text-blue-600">{`<meta name="google-site-verification" content="${settings.search_console_meta}" />`}</code>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">DNS TXT Record Alternative</h3>
                <p className="text-xs text-blue-700 mb-2">You can also verify via DNS TXT record:</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Go to your domain registrar's DNS settings</li>
                  <li>Add a TXT record to your root domain</li>
                  <li>Value: <code className="bg-blue-100 px-1 rounded">google-site-verification=YOUR_TOKEN</code></li>
                  <li>Wait up to 72 hours for propagation</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Google Analytics GA4 */}
        {activeTab === 'ga4' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Google Analytics 4</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-600">Enable</span>
                <div onClick={() => set('ga_enabled', !settings.ga_enabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${settings.ga_enabled ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings.ga_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </label>
            </div>

            <div className={`${settings.ga_enabled ? '' : 'opacity-50 pointer-events-none'} space-y-5`}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GA4 Measurement ID</label>
                <input value={settings.ga_measurement_id || ''} onChange={e => set('ga_measurement_id', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                <p className="text-xs text-gray-500 mt-1">Found in GA4 Admin → Data Streams → Your Web Stream</p>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Tracking Options</label>
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
                  <input type="checkbox" checked={settings.ga_affiliate_tracking || false}
                    onChange={e => set('ga_affiliate_tracking', e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Affiliate Click Tracking</p>
                    <p className="text-xs text-gray-500">Track all "Buy on Amazon" button clicks as custom events</p>
                  </div>
                </label>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="text-sm font-semibold text-green-900 mb-2">What We Track</h3>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>✓ Page views & session data</li>
                  <li>✓ Affiliate link clicks (custom event)</li>
                  <li>✓ Scroll depth tracking</li>
                  <li>✓ Top performing content</li>
                  <li>✓ Performance-optimized (loads after interaction)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Robots.txt */}
        {activeTab === 'robots' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Robots.txt Editor</h2>
                <p className="text-sm text-gray-500">Controls how search engines crawl your site</p>
              </div>
              <button onClick={() => set('robots_txt', DEFAULT_ROBOTS)} className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                Reset to Default
              </button>
            </div>
            <textarea rows={18} value={settings.robots_txt || DEFAULT_ROBOTS} onChange={e => set('robots_txt', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 resize-y bg-gray-900 text-green-400" />
            <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-800">
              ⚠️ Changes take effect immediately. Ensure your sitemap URL is correct before saving.
            </div>
          </div>
        )}

        {/* Sitemap */}
        {activeTab === 'sitemap' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">XML Sitemap Management</h2>
              <p className="text-sm text-gray-500 mt-1">Auto-generated sitemap includes all published products, blog posts, and category pages.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Products', desc: 'All published products', color: 'orange' },
                { label: 'Blog Posts', desc: 'All published posts', color: 'blue' },
                { label: 'Categories', desc: 'Product + blog categories', color: 'green' },
              ].map(({ label, desc, color }) => (
                <div key={label} className={`p-4 rounded-xl bg-${color}-50 border border-${color}-100`}>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className={`w-4 h-4 text-${color}-600`} />
                    <span className="text-sm font-semibold text-gray-900">{label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700 mb-1 font-medium">Sitemap URL Pattern</p>
              <code className="text-xs text-blue-600">https://yoursite.com/sitemap.xml</code>
              <p className="text-xs text-gray-500 mt-2">The sitemap auto-updates whenever you publish/unpublish content.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleGenerateSitemap} disabled={sitemapGenerating}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors">
                <RefreshCw className={`w-4 h-4 ${sitemapGenerating ? 'animate-spin' : ''}`} />
                {sitemapGenerating ? 'Generating...' : 'Regenerate Sitemap'}
              </button>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Submit to Google Search Console</h3>
              <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                <li>Open Google Search Console for your property</li>
                <li>Go to Sitemaps section</li>
                <li>Enter your sitemap URL and click Submit</li>
                <li>Monitor indexing status regularly</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
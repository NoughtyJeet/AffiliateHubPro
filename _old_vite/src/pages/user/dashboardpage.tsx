import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, ShoppingCart, Settings, Trash2, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { MainLayout } from '../../components/layout/MainLayout';
import { SEOHead } from '../../components/seo/SEOHead';
import { useAuth } from '../../contexts/AuthContext';
import { ProductCard } from '../../components/products/ProductCard';

interface SavedProduct {
  id: string;
  created_at: string;
  products: {
    id: string; title: string; slug: string; short_description: string | null;
    rating: number; review_count: number; affiliate_link: string | null;
    featured_image: string | null; price_range: string | null; brand: string | null; pros: string[];
  };
}

export default function UserDashboardPage() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'saved' | 'profile' | 'settings'>('saved');
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('saved_products').select('id, created_at, products(id,title,slug,short_description,rating,review_count,affiliate_link,featured_image,price_range,brand,pros)').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      setSavedProducts((data || []) as unknown as SavedProduct[]);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    setDisplayName(profile?.display_name || '');
  }, [profile]);

  if (!user) {
    window.location.href = '/auth/login';
    return null;
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateProfile({ display_name: displayName });
    setSaving(false);
    alert('Profile updated!');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm) {
      await supabase.auth.signOut();
      window.location.href = '/';
    }
    setDeleteConfirm(true);
  };

  const removeSaved = async (savedId: string) => {
    await supabase.from('saved_products').delete().eq('id', savedId);
    setSavedProducts(prev => prev.filter(p => p.id !== savedId));
  };

  return (
    <MainLayout showAds={false}>
      <SEOHead title="My Dashboard" noindex />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.display_name || 'Welcome back!'}</h1>
              <p className="text-orange-100 text-sm">{profile?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">
                {profile?.role === 'admin' ? '👑 Admin' : '👤 Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
          {[['saved', 'Saved Products', Heart], ['profile', 'Profile', User], ['settings', 'Settings', Settings]].map(([id, label, Icon]) => (
            <button key={id as string} onClick={() => setTab(id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-white shadow-sm text-orange-600' : 'text-gray-600 hover:text-gray-900'}`}>
              <span>{label as string}</span>
            </button>
          ))}
        </div>

        {/* Saved Products */}
        {tab === 'saved' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Saved Products ({savedProducts.length})</h2>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />)}
              </div>
            ) : savedProducts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved products yet</h3>
                <p className="text-gray-500 mb-6">Browse products and click the heart icon to save them here.</p>
                <Link to="/products" className="px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">Browse Products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {savedProducts.map(saved => saved.products && <ProductCard key={saved.id} product={saved.products} />)}
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && (
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input type="email" value={profile?.email || ''} disabled
                  className="w-full px-4 py-2.5 border border-gray-100 bg-gray-50 rounded-xl text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <button onClick={handleSaveProfile} disabled={saving}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition-colors">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <div className="max-w-md space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Sign Out</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Sign out of your account</p>
                </div>
                <button onClick={signOut} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <h3 className="font-semibold text-red-800 mb-1">Danger Zone</h3>
              <p className="text-sm text-red-600 mb-4">Permanently delete your account and all data. This cannot be undone.</p>
              <button onClick={handleDeleteAccount}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${deleteConfirm ? 'bg-red-600 text-white hover:bg-red-700' : 'text-red-600 border border-red-200 hover:bg-red-100'}`}>
                <Trash2 className="w-4 h-4" />
                {deleteConfirm ? 'Click again to confirm deletion' : 'Delete Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

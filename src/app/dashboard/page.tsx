'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Heart, Settings, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { ProductCard } from '@/components/ui/ProductCard';
import { toast } from 'react-hot-toast';

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
    const supabase = createClient();

    useEffect(() => {
        if (!user) return;

        const fetchSaved = async () => {
            const { data } = await supabase
                .from('saved_products')
                .select(`
          id, 
          created_at, 
          products (
            id, title, slug, short_description, rating, review_count, 
            affiliate_link, featured_image, price_range, brand, pros
          )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setSavedProducts((data || []) as unknown as SavedProduct[]);
            setLoading(false);
        };

        fetchSaved();
    }, [user]);

    useEffect(() => {
        setDisplayName(profile?.display_name || '');
    }, [profile]);

    if (!user) return null;

    const handleSaveProfile = async () => {
        setSaving(true);
        const { error } = await updateProfile({ display_name: displayName });
        setSaving(false);
        if (!error) {
            toast.success('Profile updated successfully!');
        } else {
            toast.error('Failed to update profile');
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirm) {
            const { error } = await supabase.auth.signOut();
            if (!error) window.location.href = '/';
        }
        setDeleteConfirm(true);
    };

    const tabs = [
        { id: 'saved', label: 'Saved Products', icon: Heart },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'settings', label: 'Account Settings', icon: Settings }
    ] as const;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header Banner */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 text-white mb-10 shadow-lg shadow-orange-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-inner">
                        <span className="text-white text-4xl font-black">
                            {(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl font-black mb-1">Hello, {profile?.display_name || 'Shopper'}!</h1>
                        <p className="text-orange-50 opacity-90 font-medium">{profile?.email}</p>
                        <div className="mt-3 flex gap-2 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-lg font-bold uppercase tracking-wider">
                                {profile?.role === 'admin' ? '👑 Administrator' : '👤 Global Member'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Navigation Sidebar */}
                <aside className="lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-3xl border border-gray-100 p-3 shadow-sm sticky top-24">
                        <nav className="space-y-1">
                            {tabs.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setTab(id)}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all cursor-pointer ${tab === id
                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${tab === id ? 'text-white' : 'text-gray-400'}`} />
                                    {label}
                                </button>
                            ))}
                            <div className="pt-4 mt-4 border-t border-gray-50 px-2 pb-2">
                                <button
                                    onClick={signOut}
                                    className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    {/* Saved Products */}
                    {tab === 'saved' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Saved Items</h2>
                                <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-500 uppercase">
                                    {savedProducts.length} Total
                                </span>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {Array(3).fill(0).map((_, i) => <div key={i} className="bg-gray-50 rounded-3xl h-80 animate-pulse" />)}
                                </div>
                            ) : savedProducts.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <div className="text-6xl mb-6 grayscale">❤️</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Found something you like? Click the heart icon to save it for later.</p>
                                    <Link href="/products" className="inline-block px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                                        Explore Best Products
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {savedProducts.map(saved => saved.products && (
                                        <div key={saved.id} className="relative group">
                                            <ProductCard product={saved.products as any} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Profile Editor */}
                    {tab === 'profile' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Personal Information</h2>
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={e => setDisplayName(e.target.value)}
                                        placeholder="Your full name"
                                        className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Account Email</label>
                                    <div className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 font-medium cursor-not-allowed">
                                        {profile?.email}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 px-1">Email address cannot be changed for security reasons.</p>
                                </div>
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                                >
                                    {saving ? 'Updating Profile...' : 'Save Member Info'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Account Settings */}
                    {tab === 'settings' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                            <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Security & Privacy</h2>
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Danger Zone</h3>
                                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">Permanently delete your account and all associated data. This action is irreverisble.</p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all cursor-pointer ${deleteConfirm
                                                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                                                : 'text-red-600 border-2 border-red-50 hover:bg-red-50'
                                            }`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                        {deleteConfirm ? 'Confirm Account Deletion' : 'Delete My Account'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

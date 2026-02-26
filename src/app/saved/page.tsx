import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ui/ProductCard';
import { Heart, ShoppingBag, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Saved Products - Your Curated Collection',
    description: 'Access your personally saved gadgets and deals. Your private collection of the best tech and home gear.',
};

export default async function SavedPage() {
    const supabase = await createClient();

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center space-y-8 bg-gray-50 p-12 rounded-[3rem] border border-gray-100 shadow-xl">
                    <div className="w-20 h-20 bg-white rounded-[2rem] shadow-inner flex items-center justify-center mx-auto text-gray-300">
                        <User size={40} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-4">Identity Required</h1>
                        <p className="text-gray-500 font-medium">Please sign into your profile to access your private asset repository.</p>
                    </div>
                    <div className="flex flex-col gap-3 pt-4">
                        <Link href="/auth/login" className="px-8 py-4 bg-gray-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-gray-200 hover:-translate-y-1 transition-all">
                            Login To Account
                        </Link>
                        <Link href="/auth/signup" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                            Initialize New Profile
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Fetch saved products
    // Note: Assuming saved_products table exists with product_id and user_id columns
    const { data: savedItems } = await supabase
        .from('saved_products')
        .select(`
            product_id,
            products (*)
        `)
        .eq('user_id', session.user.id);

    const savedProducts = savedItems?.map(item => item.products).filter(Boolean) || [];

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-10 -mr-48 -mt-48" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-orange-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                <Heart size={12} className="fill-orange-400" /> Private Collection
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                                Your Saved <span className="text-orange-500">Assets</span>
                            </h1>
                        </div>
                        <div className="flex bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                            <div className="text-center px-6 border-r border-white/10">
                                <p className="text-2xl font-black text-white">{savedProducts.length}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Saved Items</p>
                            </div>
                            <div className="text-center px-6">
                                <p className="text-2xl font-black text-orange-500">{(savedProducts.length * 0.4).toFixed(1)}K</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Est. Value</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {savedProducts.length === 0 ? (
                    <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mx-auto mb-8 text-gray-200">
                            <Heart size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-4 italic">Repository Empty</h2>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto mb-10">You haven't archived any products yet. Start exploring our directory to build your collection.</p>
                        <Link href="/products" className="inline-flex items-center gap-3 bg-gray-900 hover:bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-gray-200">
                            Explore All Products <ShoppingBag size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {savedProducts.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Recommendation Mini-Section */}
                <div className="mt-24 pt-16 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Trending For You</h2>
                        <Link href="/deals" className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2 hover:gap-4 transition-all">
                            View Flash Deals <ArrowRight size={14} />
                        </Link>
                    </div>
                    {/* Placeholder for trending */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-center animate-pulse">
                                <ShoppingBag className="text-gray-200" size={32} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

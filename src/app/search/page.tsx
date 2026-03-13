import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ui/ProductCard';
import { Search as SearchIcon, SlidersHorizontal, PackageSearch } from 'lucide-react';
import { AdBanner } from '@/components/ui/AdBanner';

export const metadata = {
    title: 'Search Results - AffiliateHub Pro Intelligence',
    description: 'Search through our curated database of products and reviews to find the best gear for your needs.',
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const supabase = await createClient();

    let products: any[] = [];

    if (q) {
        const { data } = await supabase
            .from('products')
            .select('*')
            .or(`title.ilike.%${q}%,brand.ilike.%${q}%,short_description.ilike.%${q}%`)
            .eq('status', 'published')
            .limit(20);
        products = data || [];
    }

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Search Header */}
            <div className="bg-gray-50 border-b border-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2 leading-none">Query Diagnostics</p>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                                Results for: <span className="text-gray-500">&quot;{q || 'All Products'}&quot;</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 shadow-sm transition-all hover:shadow-md">
                                <SlidersHorizontal size={14} /> Filter Logic
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {!q ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center grayscale opacity-30">
                        <SearchIcon size={64} className="mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs">Awaiting Query Input</p>
                        <p className="mt-2 text-[10px] font-bold">Use the search bar above to begin indexing the database.</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <PackageSearch size={64} className="mb-6 text-gray-200" />
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2 italic">Zero Matches Found</h2>
                        <p className="text-gray-500 font-medium max-w-sm mx-auto">Our database doesn&apos;t have a record matching that specific query. Try a more generic term.</p>
                        <div className="mt-10 p-8 bg-orange-50 rounded-3xl border border-orange-100 inline-block">
                            <p className="text-xs font-black text-orange-800 uppercase tracking-widest mb-4">Try these popular clusters:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {['Sony', 'Kitchen', 'Fitness', 'Headphones', 'LG OLED'].map(t => (
                                    <a key={t} href={`/search?q=${t}`} className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-orange-600 border border-orange-100 hover:scale-105 transition-transform">{t}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="pt-12 border-t border-gray-50 flex justify-center">
                            <AdBanner placement="search_bottom" className="max-w-2xl" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

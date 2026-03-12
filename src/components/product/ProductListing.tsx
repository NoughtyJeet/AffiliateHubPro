import Link from 'next/link';
import { ChevronRight, SlidersHorizontal, Star, Grid3X3, List } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { AdBanner } from '@/components/ui/AdBanner';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProductListingProps {
    products: Product[];
    category?: Category | null;
    title: string;
    description?: string;
    sortBy: string;
    minRating: number;
}

export function ProductListing({
    products,
    category,
    title,
    description,
    sortBy,
    minRating
}: ProductListingProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500 mb-10 overflow-hidden whitespace-nowrap">
                <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4 flex-shrink-0 text-orange-500/20" />
                {category ? (
                    <>
                        <Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 text-orange-500/20" />
                        <span className="text-gray-900 dark:text-zinc-100 truncate">{category.name}</span>
                    </>
                ) : (
                    <span className="text-gray-900 dark:text-zinc-100">All Products</span>
                )}
            </nav>

            {/* Header */}
            <div className="mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-500/10 rounded-full text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider mb-4 border border-orange-100 dark:border-orange-500/20">
                    Category Exploration
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-zinc-400">
                    {title}
                </h1>
                {description && <p className="text-gray-500 dark:text-zinc-400 mt-6 text-lg md:text-xl leading-relaxed max-w-3xl font-medium">{description}</p>}
            </div>

            <AdBanner placement="category_page" className="mb-16 rounded-3xl shadow-2xl border border-white/10" />

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Sidebar Filters */}
                <aside className="lg:w-72 flex-shrink-0">
                    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-gray-200/50 dark:border-white/5 p-8 sticky top-24 shadow-2xl shadow-gray-200/10 dark:shadow-none">
                        <div className="flex items-center gap-3 mb-10 pb-5 border-b border-gray-100 dark:border-white/5">
                            <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                            <h2 className="font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest text-[10px]">Filter Gear</h2>
                        </div>

                        {/* Sort */}
                        <div className="mb-10">
                            <h3 className="text-xs font-black text-gray-900 dark:text-zinc-100 mb-6 uppercase tracking-widest opacity-60">Sort Result</h3>
                            <div className="space-y-4">
                                {[
                                    { val: 'rating', label: 'Top Rated First' },
                                    { val: 'created_at', label: 'Recently Added' }
                                ].map(({ val, label }) => (
                                    <Link
                                        key={val}
                                        href={{ query: { sort: val, minRating } }}
                                        className={`flex items-center gap-4 group transition-all ${sortBy === val ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${sortBy === val ? 'border-orange-500 bg-orange-500 dark:bg-orange-500' : 'border-gray-200 dark:border-zinc-800 group-hover:border-orange-500/50'
                                            }`}>
                                            {sortBy === val && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-wide">{label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Min Rating */}
                        <div>
                            <h3 className="text-xs font-black text-gray-900 dark:text-zinc-100 mb-6 uppercase tracking-widest opacity-60">Minimum Quality</h3>
                            <div className="space-y-4">
                                {[0, 4, 4.5, 4.8].map(rating => (
                                    <Link
                                        key={rating}
                                        href={{ query: { sort: sortBy, minRating: rating } }}
                                        className={`flex items-center gap-4 group transition-all ${minRating === rating ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${minRating === rating ? 'border-orange-500 bg-orange-500 dark:bg-orange-500' : 'border-gray-200 dark:border-zinc-800 group-hover:border-orange-500/50'
                                            }`}>
                                            {minRating === rating && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-wide flex items-center gap-2">
                                            {rating === 0 ? 'All Ratings' : <><Star className="w-4 h-4 fill-orange-500 text-orange-500" />{rating}+</>}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-10 pb-5 border-b border-gray-100 dark:border-white/5">
                        <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.3em] leading-none">
                            Discovering {products.length} {products.length === 1 ? 'Prime Item' : 'Prime Items'}
                        </span>
                        <div className="flex items-center gap-2 p-1.5 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/5">
                            <button className="p-2.5 rounded-xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 leading-none transition-all scale-105"><Grid3X3 className="w-4.5 h-4.5" /></button>
                            <button className="p-2.5 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-orange-500 dark:hover:text-white leading-none transition-all hover:scale-105"><List className="w-4.5 h-4.5" /></button>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-zinc-800 transition-colors">
                            <div className="text-6xl mb-6 grayscale opacity-20">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-50 mb-2">No items found</h3>
                            <p className="text-gray-500 dark:text-zinc-500">Try adjusting your filters or browsing other categories.</p>
                            <Link href="/products" className="inline-block mt-6 px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20">
                                Clear all filters
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products.map(product => <ProductCard key={product.id} product={product} className="h-full" />)}
                        </div>
                    )}

                    {/* Pagination could be added here if needed */}
                </div>
            </div>
        </div>
    );
}

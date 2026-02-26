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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-hidden whitespace-nowrap">
                <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
                {category ? (
                    <>
                        <Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        <span className="text-gray-900 font-bold truncate">{category.name}</span>
                    </>
                ) : (
                    <span className="text-gray-900 font-bold">All Products</span>
                )}
            </nav>

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{title}</h1>
                {description && <p className="text-gray-500 mt-3 text-lg leading-relaxed max-w-3xl">{description}</p>}
            </div>

            <AdBanner placement="category_page" className="mb-10 rounded-2xl shadow-sm" />

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filters */}
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 sticky top-24 shadow-sm">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
                            <SlidersHorizontal className="w-5 h-5 text-orange-500" />
                            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Filters</h2>
                        </div>

                        {/* Sort */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Sort Result</h3>
                            <div className="space-y-3">
                                {[
                                    { val: 'rating', label: 'By Rating' },
                                    { val: 'created_at', label: 'Latest Added' }
                                ].map(({ val, label }) => (
                                    <Link
                                        key={val}
                                        href={{ query: { sort: val, minRating } }}
                                        className={`flex items-center gap-3 group transition-all ${sortBy === val ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${sortBy === val ? 'border-orange-500 bg-orange-50' : 'border-gray-200 group-hover:border-gray-300'
                                            }`}>
                                            {sortBy === val && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                        </div>
                                        <span className="text-sm font-semibold">{label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Min Rating */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-4">Minimum Quality</h3>
                            <div className="space-y-3">
                                {[0, 4, 4.5, 4.8].map(rating => (
                                    <Link
                                        key={rating}
                                        href={{ query: { sort: sortBy, minRating: rating } }}
                                        className={`flex items-center gap-3 group transition-all ${minRating === rating ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${minRating === rating ? 'border-orange-500 bg-orange-50' : 'border-gray-200 group-hover:border-gray-300'
                                            }`}>
                                            {minRating === rating && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                        </div>
                                        <span className="text-sm font-semibold flex items-center gap-1.5">
                                            {rating === 0 ? 'All Ratings' : <><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{rating}+</>}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
                            Showing {products.length} {products.length === 1 ? 'Product' : 'Products'}
                        </span>
                        <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl">
                            <button className="p-2 rounded-lg bg-white shadow-sm text-orange-500 leading-none"><Grid3X3 className="w-4 h-4" /></button>
                            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 leading-none"><List className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="text-6xl mb-6 grayscale">🔍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
                            <p className="text-gray-500">Try adjusting your filters or browsing other categories.</p>
                            <Link href="/products" className="inline-block mt-6 px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
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

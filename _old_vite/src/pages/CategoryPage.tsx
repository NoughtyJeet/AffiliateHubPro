import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Filter, Star, Grid3X3, List, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../components/products/ProductCard';
import { SEOHead } from '../components/seo/SEOHead';
import { AdBanner } from '../components/ads/AdBanner';

interface Product { id: string; title: string; slug: string; short_description: string | null; rating: number; review_count: number; affiliate_link: string | null; featured_image: string | null; price_range: string | null; brand: string | null; pros: string[]; }
interface Category { id: string; name: string; slug: string; meta_title: string | null; meta_description: string | null; }

export default function CategoryPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('rating');
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const perPage = 12;

  useEffect(() => {
    setPage(1);
    setLoading(true);
    const queries: Promise<any>[] = [
      supabase.from('products').select('*').eq('status', 'published').order(sortBy === 'rating' ? 'rating' : 'created_at', { ascending: false }).gte('rating', minRating).range(0, perPage - 1)
    ];
    if (slug) queries.unshift(supabase.from('categories').select('*').eq('slug', slug).single());
    Promise.all(queries).then(results => {
      if (slug && results.length === 2) {
        const [catResult, prodResult] = results;
        if (catResult.data) setCategory(catResult.data as Category);
        setProducts((prodResult.data || []) as Product[]);
        setHasMore((prodResult.data || []).length === perPage);
      } else {
        setProducts((results[0].data || []) as Product[]);
        setHasMore((results[0].data || []).length === perPage);
      }
      setLoading(false);
    });
  }, [slug, sortBy, minRating]);

  return (
    <MainLayout>
      <SEOHead
        title={category?.meta_title || category?.name || 'All Products'}
        description={category?.meta_description || undefined}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-orange-500 transition-colors">Products</Link>
          {category && <><ChevronRight className="w-4 h-4" /><span className="text-gray-900 font-medium">{category.name}</span></>}
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{category?.name || 'All Products'}</h1>
          <p className="text-gray-500 mt-2">{category?.meta_description || 'Explore our curated product reviews and find the best deals.'}</p>
        </div>

        {/* Ad Banner */}
        <div className="mb-6"><AdBanner placement="category_page" /></div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold text-gray-900">Filters</h2>
              </div>
              
              {/* Sort */}
              <div className="mb-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
                <div className="space-y-1.5">
                  {[['rating', 'Highest Rated'], ['created_at', 'Newest First']].map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="sort" value={val} checked={sortBy === val} onChange={() => setSortBy(val)}
                        className="w-4 h-4 text-orange-500 border-gray-300" />
                      <span className={`text-sm ${sortBy === val ? 'text-orange-600 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
                <div className="space-y-1.5">
                  {[0, 4, 4.5, 4.8].map(rating => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="rating" value={rating} checked={minRating === rating} onChange={() => setMinRating(rating)}
                        className="w-4 h-4 text-orange-500 border-gray-300" />
                      <span className={`text-sm flex items-center gap-1 ${minRating === rating ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                        {rating === 0 ? 'All Ratings' : <><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{rating}+</>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">{loading ? 'Loading...' : `${products.length} products`}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}><Grid3X3 className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
            
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {Array(6).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {products.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
            
            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button onClick={() => { setPage(p => p + 1); }} className="px-8 py-3 border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

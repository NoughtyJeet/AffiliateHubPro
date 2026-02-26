import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, TrendingUp, Zap, BookOpen, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../components/products/ProductCard';
import { BlogCard } from '../components/blog/BlogCard';
import { AdBanner } from '../components/ads/AdBanner';
import { SEOHead } from '../components/seo/SEOHead';
import { useSEOSettings } from '../hooks/useSEOSettings';

interface Category { id: string; name: string; slug: string; type: string; }
interface Product { id: string; title: string; slug: string; short_description: string | null; rating: number; review_count: number; affiliate_link: string | null; featured_image: string | null; price_range: string | null; brand: string | null; pros: string[]; featured: boolean; }
interface BlogPost { id: string; title: string; slug: string; excerpt: string | null; featured_image: string | null; tags: string[]; read_time: number; created_at: string; }

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const { settings } = useSEOSettings();

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*').eq('status', 'published').eq('featured', true).limit(4),
      supabase.from('products').select('*').eq('status', 'published').order('rating', { ascending: false }).limit(8),
      supabase.from('blog_posts').select('id,title,slug,excerpt,featured_image,tags,read_time,created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(6),
    ]).then(([cats, featured, top, posts]) => {
      setCategories((cats.data || []) as Category[]);
      setFeaturedProducts((featured.data || []) as Product[]);
      setTopProducts((top.data || []) as Product[]);
      setLatestPosts((posts.data || []) as BlogPost[]);
      setLoading(false);
    });
  }, []);

  const productCats = categories.filter(c => c.type === 'product');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings?.site_title || 'AffiliateHub',
    url: window.location.origin,
    description: settings?.default_meta_description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <MainLayout>
      <SEOHead schema={schema} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "30px 30px"}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Trusted Reviews. Real Recommendations.
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Find The <span className="text-orange-400">Best Products</span> Worth Your Money
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
              Expert reviews, in-depth comparisons, and honest recommendations for Amazon's best products. We test so you don't have to.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30">
                Browse Products <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/blog" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all border border-white/20">
                <BookOpen className="w-5 h-5" /> Read Guides
              </Link>
            </div>
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[['500+', 'Products Reviewed'], ['50K+', 'Happy Readers'], ['4.9★', 'Trust Score']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{num}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:flex items-center justify-center opacity-10">
          <Star className="w-96 h-96 text-orange-400" />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Find products in your area of interest</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {productCats.map((cat) => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="group flex flex-col items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center">
                <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-500 rounded-xl flex items-center justify-center mb-3 transition-colors">
                  <span className="text-2xl">
                    {cat.slug === 'electronics' ? '📱' : cat.slug === 'home-kitchen' ? '🏠' : cat.slug === 'health-fitness' ? '💪' : '🛍️'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{cat.name}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 mt-1 transition-colors" />
              </Link>
            ))}
            <Link to="/products" className="flex flex-col items-center p-5 bg-orange-500 rounded-2xl hover:bg-orange-600 transition-colors text-center">
              <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center mb-3">
                <span className="text-2xl">🔍</span>
              </div>
              <span className="text-sm font-semibold text-white">All Products</span>
              <ChevronRight className="w-4 h-4 text-orange-200 mt-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {(loading || featuredProducts.length > 0) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500 uppercase tracking-wide">Editor's Choice</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              </div>
              <Link to="/products" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner placement="product_grid" className="rounded-xl overflow-hidden" />
      </div>

      {/* Top Rated */}
      {(loading || topProducts.length > 0) && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">Highest Rated</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Top-Rated Products</h2>
              </div>
              <Link to="/products?sort=rating" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
                See More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {topProducts.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {(loading || latestPosts.length > 0) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">Guides & Reviews</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Latest from the Blog</h2>
              </div>
              <Link to="/blog" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
                All Posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestPosts.slice(0, 1).map(post => <BlogCard key={post.id} post={post} featured className="md:col-span-2" />)}
                <div className="space-y-4">
                  {latestPosts.slice(1, 4).map(post => <BlogCard key={post.id} post={post} />)}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Stay Updated with Best Deals</h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">Get weekly product roundups, exclusive deals, and expert buying tips delivered to your inbox.</p>
          <form onSubmit={(e) => { e.preventDefault(); setEmail(''); alert('Thanks for subscribing!'); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
              className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm" />
            <button type="submit" className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap">
              Subscribe Free
            </button>
          </form>
          <p className="text-orange-200 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </MainLayout>
  );
}
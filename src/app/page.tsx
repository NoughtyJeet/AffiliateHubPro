import { createClient } from '@/lib/supabase/server';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { Newsletter } from '@/components/home/Newsletter';
import { ProductCard } from '@/components/ui/ProductCard';
import { BlogCard } from '@/components/ui/BlogCard';
import { AdBanner } from '@/components/ui/AdBanner';
import { TrendingUp, Star, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: categories },
    { data: featuredProducts },
    { data: topProducts },
    { data: latestPosts }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('products').select('*').eq('status', 'published').eq('featured', true).limit(4),
    supabase.from('products').select('*').eq('status', 'published').order('rating', { ascending: false }).limit(8),
    supabase.from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(6)
  ]);

  return (
    <div className="flex flex-col gap-0">
      <Hero />

      {/* High-Impact Showcase */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="relative -mt-10 mb-12 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <span className="w-2 h-8 bg-orange-500 rounded-full" />
                    Top Recommendations
                  </h2>
                  <p className="text-gray-500 mt-1 font-medium">Hand-picked gear for your lifestyle</p>
                </div>
                <Link href="/products" className="hidden sm:flex items-center gap-2 text-orange-600 font-bold text-sm hover:gap-3 transition-all">
                  Browse Catalog <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} className="!shadow-none hover:!bg-gray-50" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {categories && <Categories categories={categories} />}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
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
              <Link href="/products" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner placement="product_grid" className="rounded-xl overflow-hidden" />
      </div>

      {/* Top Rated */}
      {topProducts && topProducts.length > 0 && (
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
              <Link href="/products?sort=rating" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
                See More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {latestPosts && latestPosts.length > 0 && (
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
              <Link href="/blog" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium text-sm transition-colors">
                All Posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.slice(0, 1).map((post) => (
                <BlogCard key={post.id} post={post} featured className="md:col-span-2" />
              ))}
              <div className="flex flex-col gap-4">
                {latestPosts.slice(1, 4).map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </div>
  );
}

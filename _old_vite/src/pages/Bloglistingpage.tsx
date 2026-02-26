import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Search, Tag, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MainLayout } from '../components/layout/MainLayout';
import { BlogCard } from '../components/blog/BlogCard';
import { SEOHead } from '../components/seo/SEOHead';
import { AdBanner } from '../components/ads/AdBanner';

interface BlogPost { id: string; title: string; slug: string; excerpt: string | null; featured_image: string | null; tags: string[]; read_time: number; created_at: string; }
interface Category { id: string; name: string; slug: string; }

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const perPage = 9;

  useEffect(() => {
    setLoading(true);
    setPage(1);
    let query = supabase.from('blog_posts').select('id,title,slug,excerpt,featured_image,tags,read_time,created_at,category_id').eq('status', 'published').order('created_at', { ascending: false });
    if (selectedCat) query = query.eq('category_id', selectedCat);
    if (searchQuery) query = query.ilike('title', `%${searchQuery}%`);
    query.range(0, perPage - 1).then(({ data }) => {
      setPosts((data || []) as BlogPost[]);
      setHasMore((data || []).length === perPage);
      setLoading(false);
    });
    supabase.from('categories').select('id,name,slug').eq('type', 'blog').then(({ data }) => {
      setCategories((data || []) as Category[]);
    });
  }, [selectedCat, searchQuery]);

  return (
    <MainLayout>
      <SEOHead title="Blog - Guides, Reviews & Buying Advice" description="Expert buying guides, product reviews, and tech tutorials to help you make smarter purchasing decisions." />
      
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold mb-3">Blog & Guides</h1>
          <p className="text-gray-300 mb-8 max-w-xl">Expert buying guides, detailed reviews, and product comparisons to help you shop smarter.</p>
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Tag className="w-4 h-4 text-gray-500" />
          <button onClick={() => setSelectedCat(null)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedCat ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            All
          </button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCat === cat.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {cat.name}
            </button>
          ))}
        </div>

        <AdBanner placement="blog_post_top" className="mb-8" />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No articles found</h2>
            <p className="text-gray-500">Try a different search or category</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {posts.length > 0 && page === 1 && !selectedCat && !searchQuery && (
              <div className="mb-8">
                <BlogCard post={posts[0]} featured />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {((!selectedCat && !searchQuery && page === 1) ? posts.slice(1) : posts).map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {hasMore && !loading && (
          <div className="text-center mt-10">
            <button className="flex items-center gap-2 mx-auto px-8 py-3 border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors">
              Load More Articles <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

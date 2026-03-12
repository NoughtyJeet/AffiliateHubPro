import { createClient } from '@/lib/supabase/server';
import { BlogCard } from '@/components/ui/BlogCard';
import { AdBanner } from '@/components/ui/AdBanner';
import { Search, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Blog - Guides, Reviews & Buying Advice',
    description: 'Expert buying guides, product reviews, and tech tutorials to help you make smarter purchasing decisions.',
};

interface BlogPageProps {
    searchParams: Promise<{
        category?: string;
        q?: string;
        page?: string;
    }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    const { category, q, page: pageStr } = await searchParams;
    const currentPage = parseInt(pageStr || '1');
    const perPage = 9;
    const supabase = await createClient();

    // Fetch categories
    const { data: categories } = await supabase
        .from('categories')
        .select('id,name,slug')
        .eq('type', 'blog');

    // Fetch posts
    let query = supabase
        .from('blog_posts')
        .select('id,title,slug,excerpt,featured_image,tags,read_time,created_at,category_id', { count: 'exact' })
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (category) {
        // Find category ID by slug
        const { data: catData } = await supabase.from('categories').select('id').eq('slug', category).single();
        if (catData) {
            query = query.eq('category_id', catData.id);
        }
    }

    if (q) {
        query = query.ilike('title', `%${q}%`);
    }

    const from = (currentPage - 1) * perPage;
    const to = from + perPage - 1;

    const { data: posts, count } = await query.range(from, to);

    const hasMore = count ? count > from + perPage : false;

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-500">
            {/* Hero */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-zinc-950 dark:to-zinc-900 text-white py-16 md:py-24 relative overflow-hidden transition-colors duration-500">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: "linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Blog & <span className="text-orange-500">Guides</span></h1>
                    <p className="text-gray-300 dark:text-zinc-400 mb-10 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">Expert buying guides, detailed reviews, and product comparisons to help you shop smarter.</p>

                    {/* Search */}
                    <form action="/blog" className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="Search articles..."
                            className="w-full pl-12 pr-4 py-4 bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/5 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-md transition-all"
                        />
                        {category && <input type="hidden" name="category" value={category} />}
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Category Filter */}
                <div className="flex items-center gap-3 flex-wrap mb-12">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <Link
                        href="/blog"
                        className={`px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${!category ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
                    >
                        All
                    </Link>
                    {categories?.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/blog?category=${cat.slug}${q ? `&q=${q}` : ''}`}
                            className={`px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${category === cat.slug ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-800'}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                <AdBanner placement="blog_post_top" className="mb-8" />

                {!posts || posts.length === 0 ? (
                    <div className="text-center py-32 bg-gray-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-zinc-800 transition-colors">
                        <div className="text-7xl mb-8 grayscale opacity-20">📝</div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-50 mb-3 tracking-tight">No articles found</h2>
                        <p className="text-gray-500 dark:text-zinc-500 text-lg">Try a different search or category</p>
                    </div>
                ) : (
                    <>
                        {/* Featured Post - Only on first page with no filters */}
                        {currentPage === 1 && !category && !q && (
                            <div className="mb-12">
                                <BlogCard post={posts[0]} featured />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(currentPage === 1 && !category && !q ? posts.slice(1) : posts).map(post => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Pagination / Load More */}
                        {hasMore && (
                            <div className="text-center mt-20">
                                <Link
                                    href={`/blog?page=${currentPage + 1}${category ? `&category=${category}` : ''}${q ? `&q=${q}` : ''}`}
                                    className="inline-flex items-center gap-3 px-10 py-4 border-2 border-orange-500 text-orange-500 dark:text-orange-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-orange-500 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/10"
                                >
                                    Load More Articles <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

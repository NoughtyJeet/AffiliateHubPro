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
        <div className="bg-white">
            {/* Hero */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold mb-3">Blog & Guides</h1>
                    <p className="text-gray-300 mb-8 max-w-xl">Expert buying guides, detailed reviews, and product comparisons to help you shop smarter.</p>

                    {/* Search */}
                    <form action="/blog" className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="q"
                            defaultValue={q}
                            placeholder="Search articles..."
                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 backdrop-blur-sm"
                        />
                        {category && <input type="hidden" name="category" value={category} />}
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Category Filter */}
                <div className="flex items-center gap-2 flex-wrap mb-8">
                    <Tag className="w-4 h-4 text-gray-500" />
                    <Link
                        href="/blog"
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        All
                    </Link>
                    {categories?.map(cat => (
                        <Link
                            key={cat.id}
                            href={`/blog?category=${cat.slug}${q ? `&q=${q}` : ''}`}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat.slug ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>

                <AdBanner placement="blog_post_top" className="mb-8" />

                {!posts || posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📝</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No articles found</h2>
                        <p className="text-gray-500">Try a different search or category</p>
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
                            <div className="text-center mt-12">
                                <Link
                                    href={`/blog?page=${currentPage + 1}${category ? `&category=${category}` : ''}${q ? `&q=${q}` : ''}`}
                                    className="inline-flex items-center gap-2 px-8 py-3 border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
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

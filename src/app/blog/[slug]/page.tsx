import { createClient } from '@/lib/supabase/server';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChevronRight, BookOpen, Star } from 'lucide-react';
import { BlogCard } from '@/components/ui/BlogCard';
import { AdBanner } from '@/components/ui/AdBanner';
import { FAQSection } from '@/components/blog/FAQSection';
import { TableOfContents } from '@/components/blog/TableOfContents';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(
    { params }: BlogPostPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: post } = await supabase
        .from('blog_posts')
        .select('title, excerpt, meta_title, meta_description, featured_image')
        .eq('slug', slug)
        .single();

    if (!post) return {};

    return {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt,
        openGraph: {
            images: post.featured_image ? [post.featured_image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (!post) notFound();

    // Related posts
    const { data: relatedPosts } = await supabase
        .from('blog_posts')
        .select('id,title,slug,excerpt,featured_image,tags,read_time,created_at')
        .eq('status', 'published')
        .neq('slug', slug)
        .limit(3);

    // Parse TOC and Inject IDs into content
    const toc: Array<{ id: string; title: string; level: number }> = [];
    let contentWithIds = post.content || '';

    const headingRegex = /<(h[23])>(.*?)<\/h\1>/gi;
    let match;
    let i = 0;

    // Reset regex lastIndex for safety
    headingRegex.lastIndex = 0;

    const matches = [...contentWithIds.matchAll(headingRegex)];

    // We need to replace them one by one to inject unique IDs
    contentWithIds = contentWithIds.replace(headingRegex, (fullMatch: string, tag: string, text: string) => {
        const id = `heading-${i++}`;
        const level = parseInt(tag[1]);
        const cleanText = text.replace(/<[^>]*>?/gm, ''); // Remove any nested tags in heading
        toc.push({ id, title: cleanText, level });
        return `<${tag} id="${id}">${text}</${tag}>`;
    });

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.featured_image,
        datePublished: post.created_at,
        author: {
            '@type': 'Organization',
            name: 'AffiliateHub',
        },
    };

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-500">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero Section */}
            <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-zinc-950">
                {post.featured_image && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover opacity-60 scale-105"
                            priority
                        />
                        {/* Intelligent Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950 z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950 opacity-40 z-10" />
                    </div>
                )}
                
                <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
                    <nav className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white/50 mb-10 transition-all hover:border-orange-500/30">
                        <Link href="/" className="hover:text-orange-500 transition-colors uppercase tracking-widest">Home</Link>
                        <ChevronRight className="w-3 h-3 text-orange-500/50" />
                        <Link href="/blog" className="hover:text-orange-500 transition-colors uppercase tracking-widest">Blog</Link>
                        <ChevronRight className="w-3 h-3 text-orange-500/50" />
                        <span className="text-orange-400 font-black uppercase tracking-widest truncate max-w-[150px]">Article</span>
                    </nav>

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex justify-center gap-3 mb-8">
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="px-4 py-1.5 bg-orange-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-orange-600/20 italic">#{tag}</span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tight leading-[1.05] drop-shadow-2xl">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-8 text-white/60 text-xs font-black uppercase tracking-[0.2em]">
                        <div className="flex items-center gap-3 bg-white/5 py-2 px-4 rounded-2xl border border-white/10">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black shadow-lg">A</div>
                            <span className="text-white">Editorial Team</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-2xl border border-white/10">
                            <span className="text-orange-400">Published</span>
                            <span className="text-white">{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-2xl border border-white/10">
                            <Clock className="w-4 h-4 text-orange-400" />
                            <span className="text-white">{post.read_time} Min Read</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Blur Transition */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Article */}
                    <article className="flex-1 min-w-0">
                        <AdBanner placement="blog_post_top" className="mb-10 rounded-xl" />

                        {post.excerpt && (
                            <div className="bg-orange-50 dark:bg-orange-500/5 border-l-4 border-orange-500 p-8 rounded-r-[2rem] mb-12 text-orange-950 dark:text-orange-200 font-medium text-lg leading-relaxed italic shadow-sm transition-colors">
                                {post.excerpt}
                            </div>
                        )}

                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: contentWithIds }}
                        />

                        <AdBanner placement="blog_post_middle" className="my-14 rounded-xl" />

                        {/* FAQ Section */}
                        {post.faq_schema && post.faq_schema.length > 0 && (
                            <FAQSection faqs={post.faq_schema} />
                        )}

                        <AdBanner placement="blog_post_bottom" className="mt-14 rounded-xl" />

                        {/* Author Footer */}
                        <div className="mt-20 p-10 bg-gray-50 dark:bg-zinc-900/50 rounded-[3rem] border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left shadow-sm transition-colors">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl shadow-orange-500/20">
                                <span className="text-white text-4xl font-black">A</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">AffiliateHub Editorial Team</h3>
                                <p className="text-gray-600 dark:text-zinc-400 mt-3 text-lg leading-relaxed font-medium">
                                    Our professional research team spends thousands of hours testing and comparing products to provide you with honest, expert recommendations you can trust.
                                </p>
                                <div className="flex gap-6 mt-6 justify-center md:justify-start">
                                    <Link href="/about" className="text-orange-600 dark:text-orange-400 font-bold hover:text-orange-700 transition-colors text-sm uppercase tracking-widest">About our process</Link>
                                    <Link href="/blog" className="text-gray-400 dark:text-zinc-500 font-bold hover:text-gray-600 transition-colors text-sm uppercase tracking-widest">More guides</Link>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Table of Contents - Hidden on small screens */}
                    {toc.length > 1 && (
                        <div className="hidden lg:block">
                            <TableOfContents items={toc} />
                        </div>
                    )}
                </div>

                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && (
                    <div className="mt-32 border-t border-gray-100 dark:border-zinc-800 pt-20 transition-colors">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Recommended for You</h2>
                            <Link href="/blog" className="text-orange-500 font-black uppercase tracking-widest text-xs hover:text-orange-600 transition-colors flex items-center gap-2">
                                Explore Blog <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((p) => (
                                <BlogCard key={p.id} post={p} className="h-full" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

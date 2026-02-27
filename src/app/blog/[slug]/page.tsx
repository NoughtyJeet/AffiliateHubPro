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
        <div className="bg-white min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero / Header */}
            <div className="relative bg-gray-900 text-white overflow-hidden py-16 md:py-24">
                {post.featured_image && (
                    <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="object-cover opacity-25"
                        priority
                    />
                )}
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 overflow-hidden whitespace-nowrap">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                        <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        <span className="text-gray-300 truncate">{post.title}</span>
                    </nav>

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag: string) => (
                                <span key={tag} className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-semibold rounded-full border border-orange-500/20">{tag}</span>
                            ))}
                        </div>
                    )}

                    <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">{post.title}</h1>

                    <div className="flex items-center gap-6 text-gray-400 text-sm font-medium">
                        <span className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">A</span>
                            Editorial Team
                        </span>
                        <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.read_time} min read</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Article */}
                    <article className="flex-1 min-w-0">
                        <AdBanner placement="blog_post_top" className="mb-10 rounded-xl" />

                        {post.excerpt && (
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-2xl mb-10 text-orange-950 font-medium leading-relaxed italic shadow-sm">
                                {post.excerpt}
                            </div>
                        )}

                        <div
                            className="prose prose-lg prose-gray max-w-none 
                prose-headings:text-gray-900 prose-headings:font-bold 
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-orange-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-lg
                prose-ul:list-disc prose-ol:list-decimal"
                            dangerouslySetInnerHTML={{ __html: contentWithIds }}
                        />

                        <AdBanner placement="blog_post_middle" className="my-14 rounded-xl" />

                        {/* FAQ Section */}
                        {post.faq_schema && post.faq_schema.length > 0 && (
                            <FAQSection faqs={post.faq_schema} />
                        )}

                        <AdBanner placement="blog_post_bottom" className="mt-14 rounded-xl" />

                        {/* Author Footer */}
                        <div className="mt-16 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left shadow-sm">
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
                                <span className="text-white text-3xl font-bold">A</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">AffiliateHub Editorial Team</h3>
                                <p className="text-gray-600 mt-2 leading-relaxed">
                                    Our professional research team spends thousands of hours testing and comparing products to provide you with honest, expert recommendations you can trust.
                                </p>
                                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                                    <Link href="/about" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm">About our process</Link>
                                    <Link href="/blog" className="text-gray-500 font-semibold hover:text-gray-700 transition-colors text-sm">More guides</Link>
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
                    <div className="mt-20 border-t border-gray-100 pt-16">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
                            <Link href="/blog" className="text-orange-500 font-bold hover:text-orange-600 transition-colors flex items-center gap-1">
                                Explore Blog <ArrowRight size={20} className="ml-1" />
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

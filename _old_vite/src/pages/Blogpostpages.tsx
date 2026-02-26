import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ChevronRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MainLayout } from '../components/layout/MainLayout';
import { BlogCard } from '../components/blog/BlogCard';
import { SEOHead } from '../components/seo/SEOHead';
import { AdBanner } from '../components/ads/AdBanner';

interface BlogPost {
  id: string; title: string; slug: string; content: string | null; excerpt: string | null;
  featured_image: string | null; tags: string[]; read_time: number; created_at: string;
  meta_title: string | null; meta_description: string | null;
  faq_schema: Array<{question: string; answer: string}>;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<Array<{id: string; title: string; level: number}>>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('status', 'published').single().then(({ data }) => {
      if (data) {
        setPost(data as BlogPost);
        // Parse TOC from content headings
        if (data.content) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.content, 'text/html');
          const headings = doc.querySelectorAll('h2, h3');
          const tocItems = Array.from(headings).map((h, i) => ({
            id: `heading-${i}`,
            title: h.textContent || '',
            level: parseInt(h.tagName[1])
          }));
          setToc(tocItems);
        }
        // Update view count
        supabase.from('blog_posts').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
        // Related posts
        supabase.from('blog_posts').select('id,title,slug,excerpt,featured_image,tags,read_time,created_at').eq('status', 'published').neq('slug', slug).limit(3).then(({ data: rel }) => {
          setRelatedPosts((rel || []) as BlogPost[]);
        });
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return (
    <MainLayout showAds={false}>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {Array(5).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-lg h-8 animate-pulse" />)}
      </div>
    </MainLayout>
  );

  if (!post) return (
    <MainLayout><div className="text-center py-24"><h1 className="text-2xl font-bold">Post not found</h1><Link to="/blog" className="text-orange-500 hover:underline mt-4 block">Back to Blog</Link></div></MainLayout>
  );

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featured_image,
    datePublished: post.created_at,
    mainEntityOfPage: { '@type': 'WebPage', '@id': window.location.href },
    publisher: { '@type': 'Organization', name: 'AffiliateHub' }
  };

  const faqSchema = post.faq_schema?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq_schema.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  } : undefined;

  return (
    <MainLayout showAds={false}>
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || undefined}
        image={post.featured_image || undefined}
        type="article"
        schema={blogSchema}
      />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      {/* Hero */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        {post.featured_image && (
          <img src={post.featured_image} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-300 line-clamp-1">{post.title}</span>
          </nav>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs font-medium rounded-full">{tag}</span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <span>{new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.read_time} min read</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AdBanner placement="blog_post_top" className="mb-8" />
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* TOC Sidebar */}
          {toc.length > 2 && (
            <aside className="lg:w-64 flex-shrink-0 order-first lg:order-last">
              <div className="bg-orange-50 rounded-2xl p-5 sticky top-20 border border-orange-100">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                  <h2 className="font-semibold text-gray-900 text-sm">Table of Contents</h2>
                </div>
                <ul className="space-y-1.5">
                  {toc.map((item, i) => (
                    <li key={i} className={`${item.level === 3 ? 'pl-4' : ''}`}>
                      <a href={`#${item.id}`} className="text-sm text-gray-600 hover:text-orange-600 transition-colors line-clamp-2">{item.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}

          {/* Article Content */}
          <article className="flex-1 min-w-0">
            {post.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-8 text-blue-800 text-sm font-medium leading-relaxed">
                {post.excerpt}
              </div>
            )}
            
            <div
              className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-h2:text-2xl prose-h3:text-xl prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            <AdBanner placement="blog_post_middle" className="my-10" />

            {/* FAQ */}
            {post.faq_schema?.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {post.faq_schema.map((faq, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                        {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                      </button>
                      {openFaq === i && <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.answer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <AdBanner placement="blog_post_bottom" className="mt-10" />

            {/* Author Box */}
            <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
              <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AffiliateHub Editorial Team</h3>
                <p className="text-sm text-gray-600 mt-1">Our team of product experts tests and reviews hundreds of products to bring you the most accurate, unbiased reviews and buying guides.</p>
              </div>
            </div>
          </article>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(p => <BlogCard key={p.id} post={p} />)}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

import { createClient } from '@/lib/supabase/server';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, Check, X, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductFAQ } from '@/components/product/ProductFAQ';
import { BuyButton } from '@/components/product/BuyButton';
import { SaveButton } from '@/components/product/SaveButton';
import { LeadMagnetCard } from '@/components/product/LeadMagnetCard';
import { BlogSection } from '@/components/product/BlogSection';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(
    { params }: ProductPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: product } = await supabase
        .from('products')
        .select('title, short_description, meta_title, meta_description, featured_image')
        .eq('slug', slug)
        .single();

    if (!product) return {};

    return {
        title: product.meta_title || product.title,
        description: product.meta_description || product.short_description,
        openGraph: {
            images: product.featured_image ? [product.featured_image] : [],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (!product) notFound();

    // Related products: same category first, fall back to top-rated from any category
    let { data: relatedProducts } = await supabase
        .from('products')
        .select('id,title,slug,short_description,rating,review_count,affiliate_link,featured_image,price_range,brand,pros,specifications')
        .eq('status', 'published')
        .eq('category_id', product.category_id)
        .neq('slug', slug)
        .limit(4);

    // If not enough same-category products, fill with top-rated products from any category
    if (!relatedProducts || relatedProducts.length < 4) {
        const existingIds = relatedProducts?.map(p => p.id) || [];
        const needed = 4 - (relatedProducts?.length || 0);
        const { data: moreProducts } = await supabase
            .from('products')
            .select('id,title,slug,short_description,rating,review_count,affiliate_link,featured_image,price_range,brand,pros,specifications')
            .eq('status', 'published')
            .neq('slug', slug)
            .not('id', 'in', `(${[product.id, ...existingIds].join(',')})`)
            .order('rating', { ascending: false })
            .limit(needed);
        relatedProducts = [...(relatedProducts || []), ...(moreProducts || [])];
    }

    // Fetch latest blog posts
    const { data: recentPosts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3);

    const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));
    const allImages = [product.featured_image, ...(product.gallery_images || [])].filter(Boolean) as string[];

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.short_description,
        image: product.featured_image,
        brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
        aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.review_count },
        offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', url: product.affiliate_link || undefined }
    };

    const faqs = [
        { question: `Is ${product.title} worth buying?`, answer: `Based on our testing and ${product.review_count.toLocaleString()} user reviews, the ${product.title} scores ${product.rating.toFixed(1)}/5. ${product.pros?.[0] || 'It offers excellent value for its price.'}` },
        { question: `What is the price of ${product.title}?`, answer: product.price_range ? `The ${product.title} is typically priced at ${product.price_range}. Click "Buy on Amazon" to see the current price.` : `Click the "Buy on Amazon" button to see the latest price.` },
        { question: `Where to buy ${product.title}?`, answer: `We recommend purchasing the ${product.title} through Amazon for the best price, fast shipping, and easy returns.` }
    ];

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-500">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-500 mb-8 overflow-hidden whitespace-nowrap">
                    <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-zinc-100 font-bold truncate">{product.title}</span>
                </nav>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Left: Gallery + Mini Related Products */}
                    <div className="flex flex-col gap-6">
                        <ProductGallery images={allImages} title={product.title} />

                        {/* Mini Related Products below Gallery */}
                        {relatedProducts && relatedProducts.length > 0 && (
                            <div className="hidden lg:block">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.25em]">Similar Products</span>
                                    <Link href="/products" className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 hover:text-orange-500 transition-colors uppercase tracking-widest">
                                        View All →
                                    </Link>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {relatedProducts.slice(0, 4).map((p) => (
                                        <Link
                                            key={p.id}
                                            href={`/product/${p.slug}`}
                                            className="group flex items-center gap-4 p-4 bg-gray-50 dark:bg-zinc-900/60 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-orange-500/30 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300"
                                        >
                                            {/* Thumbnail */}
                                            {p.featured_image ? (
                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={p.featured_image}
                                                        alt={p.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-500/10 dark:to-amber-500/5 flex items-center justify-center border border-orange-100 dark:border-orange-500/20">
                                                    <span className="text-orange-400 text-xl font-black">{p.title[0]}</span>
                                                </div>
                                            )}
                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors mb-1.5">
                                                    {p.title}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-amber-400 text-xs">★</span>
                                                    <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">{p.rating?.toFixed(1)}</span>
                                                    {p.price_range && (
                                                        <span className="text-xs font-black text-orange-500 ml-auto bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg">{p.price_range}</span>
                                                    )}
                                                </div>
                                                {p.pros && p.pros.length > 0 && (
                                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1.5 line-clamp-1 font-medium">✓ {p.pros[0]}</p>
                                                )}
                                            </div>
                                            {/* Arrow */}
                                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-zinc-600 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Right: Info */}
                    <div className="flex flex-col">
                        {product.brand && (
                            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">{product.brand}</span>
                        )}
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 leading-tight mb-6 tracking-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex gap-0.5">
                                {stars.map((filled, i) => (
                                    <Star key={i} className={`w-5 h-5 ${filled ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-zinc-800'}`} />
                                ))}
                            </div>
                            <span className="text-3xl font-black text-gray-900 dark:text-zinc-50">{product.rating.toFixed(1)}</span>
                            <span className="text-gray-400 dark:text-zinc-500 font-bold text-xs uppercase tracking-widest border-l border-gray-200 dark:border-zinc-800 pl-4">
                                {product.review_count.toLocaleString()} Global Reviews
                            </span>
                        </div>

                        {product.short_description && (
                            <p className="text-lg text-gray-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium">
                                {product.short_description}
                            </p>
                        )}

                        {product.price_range && (
                            <div className="mb-10 p-6 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-black text-gray-900 dark:text-zinc-50 tracking-tighter">{product.price_range}</span>
                                    <span className="text-xs text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest">Market Value</span>
                                </div>
                            </div>
                        )}

                        {/* Variants Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="space-y-6 mb-10">
                                {product.variants.map((variant: any, i: number) => (
                                    <div key={i}>
                                        <h3 className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3">
                                            Select {variant.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {variant.options.map((option: string, j: number) => (
                                                <button
                                                    key={j}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300 ${
                                                        j === 0
                                                            ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                            : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-orange-500/50'
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <BuyButton productTitle={product.title} affiliateLink={product.affiliate_link || ''} className="flex-1 px-8 py-5 h-auto text-lg" />
                            <SaveButton productId={product.id} />
                        </div>

                        <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl p-6 mb-10 flex items-start gap-4 transition-colors">
                            <div className="mt-1 text-amber-600 dark:text-amber-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            </div>
                            <p className="text-xs text-amber-800 dark:text-amber-200/60 leading-relaxed italic">
                                <strong>Affiliate Disclosure:</strong> When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission. Affiliate programs and affiliations include, but are not limited to, the eBay Partner Network and Amazon Associates.
                            </p>
                        </div>


                    </div>
                </div>

                {/* Technical Specifications - Horizontal Strip */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mb-16 bg-gray-50 dark:bg-zinc-900/50 rounded-[2rem] p-8 border border-gray-100 dark:border-zinc-800 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
                            <div className="flex-shrink-0">
                                <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Technical</h3>
                                <div className="text-xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Specifications</div>
                            </div>
                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-6">
                                {Object.entries(product.specifications).map(([key, value], i) => (
                                    <div key={i} className="group flex flex-col gap-1 transition-all">
                                        <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest group-hover:text-orange-500 transition-colors">{key}</span>
                                        <span className="text-xs font-black text-gray-900 dark:text-zinc-100">{value as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}




                {/* Full Review Content + Lead Magnet */}
                <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Expert Verdict content */}
                    <div>
                        <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2">Expert Verdict</h2>
                        <div
                            className="blog-content"
                            dangerouslySetInnerHTML={{ __html: product.description || '' }}
                        />

                        {/* Quick Highlights Strip - fills space below short descriptions */}
                        {product.features && product.features.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {product.features.map((feature: string, i: number) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-lg border border-orange-100 dark:border-orange-500/20">
                                        ⚡ {feature}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Rating Summary Card - visual filler */}
                        <div className="mt-6 p-5 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-black text-gray-900 dark:text-zinc-50">{product.rating.toFixed(1)}</div>
                                <div className="flex gap-0.5 mt-1 justify-center">
                                    {stars.map((filled, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${filled ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-zinc-700'}`} />
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold mt-1 uppercase tracking-wider">{product.review_count.toLocaleString()} Reviews</p>
                            </div>
                            <div className="flex-1 space-y-1.5">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const percent = star === Math.round(product.rating) ? 65 : star === Math.round(product.rating) - 1 ? 20 : star === Math.round(product.rating) + 1 ? 10 : 3;
                                    return (
                                        <div key={star} className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 w-3">{star}</span>
                                            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 w-8 text-right">{percent}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Offer Cards side by side below rating */}
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 dark:from-emerald-500/5 dark:to-green-500/[0.02] border border-emerald-200/50 dark:border-emerald-500/10 p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                        <span className="text-emerald-500 text-sm">💰</span>
                                    </div>
                                    <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-400">Save Extra 5%</h4>
                                </div>
                                <p className="text-xs text-emerald-600/70 dark:text-emerald-300/50 font-medium leading-relaxed">Use code <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">TECH5</span> at checkout for an additional discount.</p>
                            </div>
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-500/5 dark:to-indigo-500/[0.02] border border-blue-200/50 dark:border-blue-500/10 p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                        <span className="text-blue-500 text-sm">⚖️</span>
                                    </div>
                                    <h4 className="text-sm font-black text-blue-700 dark:text-blue-400">Compare Prices</h4>
                                </div>
                                <p className="text-xs text-blue-600/70 dark:text-blue-300/50 font-medium leading-relaxed">We compare prices across <span className="font-black">15+ retailers</span> to find you the lowest price every time.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <LeadMagnetCard productTitle={product.title} />
                    </div>
                </div>

                {/* Trust Signal Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: '🚚', title: 'Free Shipping', desc: 'On orders above $50', color: 'from-violet-500/10 to-purple-500/5 dark:from-violet-500/5 dark:to-purple-500/[0.02]', border: 'border-violet-200/50 dark:border-violet-500/10', text: 'text-violet-700 dark:text-violet-400', muted: 'text-violet-600/60 dark:text-violet-300/50' },
                        { icon: '🔄', title: '30-Day Returns', desc: 'Hassle-free guarantee', color: 'from-sky-500/10 to-cyan-500/5 dark:from-sky-500/5 dark:to-cyan-500/[0.02]', border: 'border-sky-200/50 dark:border-sky-500/10', text: 'text-sky-700 dark:text-sky-400', muted: 'text-sky-600/60 dark:text-sky-300/50' },
                        { icon: '🏷️', title: 'Price Match', desc: 'Found it cheaper? We match', color: 'from-amber-500/10 to-yellow-500/5 dark:from-amber-500/5 dark:to-yellow-500/[0.02]', border: 'border-amber-200/50 dark:border-amber-500/10', text: 'text-amber-700 dark:text-amber-400', muted: 'text-amber-600/60 dark:text-amber-300/50' },
                        { icon: '🔒', title: 'Secure Checkout', desc: 'SSL encrypted payments', color: 'from-emerald-500/10 to-green-500/5 dark:from-emerald-500/5 dark:to-green-500/[0.02]', border: 'border-emerald-200/50 dark:border-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', muted: 'text-emerald-600/60 dark:text-emerald-300/50' },
                    ].map((card, i) => (
                        <div key={i} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} border ${card.border} p-5 text-center group hover:shadow-lg transition-all duration-300`}>
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{card.icon}</div>
                            <h4 className={`text-xs font-black ${card.text} uppercase tracking-widest mb-1`}>{card.title}</h4>
                            <p className={`text-[10px] ${card.muted} font-medium`}>{card.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Our Blog Section */}
                <BlogSection posts={recentPosts || []} />

                {/* FAQ Section */}
                <ProductFAQ faqs={faqs} />

                {/* Sticky Mobile CTA */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 lg:hidden z-50 transition-colors">
                    <BuyButton productTitle={product.title} affiliateLink={product.affiliate_link || ''} className="w-full shadow-2xl shadow-orange-500/20 py-5" />
                </div>

                {/* You May Also Like */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-24 pt-20 border-t border-gray-100 dark:border-zinc-800 transition-colors">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
                            <div className="text-center md:text-left">
                                <span className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-3 block">Premium Curation</span>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">You May Also <span className="text-orange-500">Like</span></h2>
                            </div>
                            <Link href="/products" className="text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest text-[10px] hover:text-orange-500 transition-colors decoration-orange-500/30 underline underline-offset-8">View Collection</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p as any} layout="compact" className="h-full" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

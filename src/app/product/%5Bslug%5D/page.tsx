import { createClient } from '@/lib/supabase/server';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, Check, X, ChevronRight, ShoppingCart } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { AdBanner } from '@/components/ui/AdBanner';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductFAQ } from '@/components/product/ProductFAQ';
import { BuyButton } from '@/components/product/BuyButton';
import { SaveButton } from '@/components/product/SaveButton';

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

    // Debug: Check if product exists at all with this slug
    const { data: anyStatusProduct } = await supabase
        .from('products')
        .select('title, status, slug')
        .eq('slug', slug)
        .single();
    
    console.log('--- DEBUG PRODUCT FETCH ---');
    console.log('URL Slug:', slug);
    if (anyStatusProduct) {
        console.log('Product exists in DB:', anyStatusProduct.title);
        console.log('Product status in DB:', anyStatusProduct.status);
    } else {
        console.log('Product does NOT exist in DB with this slug');
    }

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) console.error('Supabase query error:', error);

    if (!product) notFound();

    // Related products in the same category
    const { data: relatedProducts } = await supabase
        .from('products')
        .select('id,title,slug,short_description,rating,review_count,affiliate_link,featured_image,price_range,brand,pros,specifications')
        .eq('status', 'published')
        .eq('category_id', product.category_id)
        .neq('slug', slug)
        .limit(4);

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
                    {/* Left: Gallery */}
                    <ProductGallery images={allImages} title={product.title} />

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

                        {/* Specifications Grid */}
                        {product.specifications && Object.keys(product.specifications).length > 0 && (
                            <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 transition-colors">
                                <h3 className="text-xs font-black text-orange-500 mb-6 uppercase tracking-[0.2em]">Technical Specifications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                                    {Object.entries(product.specifications).map(([key, value], i) => (
                                        <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-zinc-800 last:border-0">
                                            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{key}</span>
                                            <span className="text-sm font-black text-gray-900 dark:text-zinc-100">{value as string}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pros & Cons Section */}
                {(product.pros?.length > 0 || product.cons?.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
                        <div className="bg-green-50/30 dark:bg-green-500/[0.03] rounded-[2.5rem] p-10 border border-green-100/50 dark:border-green-500/10 shadow-sm transition-all hover:shadow-xl hover:shadow-green-500/5 group">
                            <h2 className="text-2xl font-black text-green-900 dark:text-green-400 mb-8 flex items-center gap-4">
                                <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                                Elite Strengths
                            </h2>
                            <ul className="space-y-6">
                                {product.pros?.map((pro: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-green-800 dark:text-green-200/70 font-bold text-lg leading-snug">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2.5 flex-shrink-0 shadow-sm" />
                                        {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-50/30 dark:bg-red-500/[0.03] rounded-[2.5rem] p-10 border border-red-100/50 dark:border-red-500/10 shadow-sm transition-all hover:shadow-xl hover:shadow-red-500/5 group">
                            <h2 className="text-2xl font-black text-red-900 dark:text-red-400 mb-8 flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-400 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                                    <X className="w-6 h-6 text-white" />
                                </div>
                                Potential Pitfalls
                            </h2>
                            <ul className="space-y-6">
                                {product.cons?.map((con: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-red-800 dark:text-red-200/70 font-bold text-lg leading-snug">
                                        <span className="w-2 h-2 bg-red-300 rounded-full mt-2.5 flex-shrink-0 shadow-sm" />
                                        {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Full Review Content */}
                {product.description && (
                    <div className="mb-24">
                        <div className="max-w-4xl">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 mb-10 tracking-tight">Expert <span className="text-orange-500">Verdict</span></h2>
                            <div
                                className="blog-content"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                <ProductFAQ faqs={faqs} />

                {/* Sticky Mobile CTA */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 lg:hidden z-50 transition-colors">
                    <BuyButton productTitle={product.title} affiliateLink={product.affiliate_link || ''} className="w-full shadow-2xl shadow-orange-500/20 py-5" />
                </div>

                {/* Related Products */}
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

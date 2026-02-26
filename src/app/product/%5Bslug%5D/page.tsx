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

    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (!product) notFound();

    // Related products in the same category
    const { data: relatedProducts } = await supabase
        .from('products')
        .select('id,title,slug,short_description,rating,review_count,affiliate_link,featured_image,price_range,brand,pros')
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
        <div className="bg-white min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-hidden whitespace-nowrap">
                    <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <Link href="/products" className="hover:text-orange-500 transition-colors">Products</Link>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    <span className="text-gray-900 font-medium truncate">{product.title}</span>
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
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex">
                                {stars.map((filled, i) => (
                                    <Star key={i} className={`w-5 h-5 ${filled ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                            <span className="text-gray-400 font-medium font-sm border-l border-gray-200 pl-3">
                                {product.review_count.toLocaleString()} customer reviews
                            </span>
                        </div>

                        {product.short_description && (
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                {product.short_description}
                            </p>
                        )}

                        {product.price_range && (
                            <div className="mb-8">
                                <span className="text-4xl font-black text-gray-900">{product.price_range}</span>
                                <span className="text-sm text-gray-400 ml-2 font-medium">Estimated Price</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <BuyButton productTitle={product.title} affiliateLink={product.affiliate_link || ''} className="flex-1" />
                            <SaveButton productId={product.id} />
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex items-start gap-3">
                            <div className="mt-1 text-amber-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                            </div>
                            <p className="text-xs text-amber-800 leading-relaxed italic">
                                <strong>Affiliate Disclosure:</strong> When you click on links to various merchants on this site and make a purchase, this can result in this site earning a commission. Affiliate programs and affiliations include, but are not limited to, the eBay Partner Network and Amazon Associates.
                            </p>
                        </div>

                        {/* Quick Features */}
                        {product.features && product.features.length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Key Highlights</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {product.features.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pros & Cons Section */}
                {(product.pros?.length > 0 || product.cons?.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-green-50/50 rounded-3xl p-8 border border-green-100/50 shadow-sm transition-hover hover:shadow-md">
                            <h2 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                    <Check className="w-5 h-5 text-white" />
                                </div>
                                What We Like
                            </h2>
                            <ul className="space-y-4">
                                {product.pros?.map((pro: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-green-800 font-medium">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2.5 flex-shrink-0" />
                                        {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-50/50 rounded-3xl p-8 border border-red-100/50 shadow-sm transition-hover hover:shadow-md">
                            <h2 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-400 rounded-lg flex items-center justify-center">
                                    <X className="w-5 h-5 text-white" />
                                </div>
                                Things to Consider
                            </h2>
                            <ul className="space-y-4">
                                {product.cons?.map((con: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-red-800 font-medium">
                                        <span className="w-1.5 h-1.5 bg-red-300 rounded-full mt-2.5 flex-shrink-0" />
                                        {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Full Review Content */}
                {product.description && (
                    <div className="mb-16">
                        <div className="max-w-4xl">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 font-primary">Our Expert Verdict</h2>
                            <div
                                className="prose prose-lg prose-gray max-w-none 
                  prose-p:text-gray-600 prose-p:leading-relaxed 
                  prose-headings:text-gray-900 prose-headings:font-bold
                  prose-a:text-orange-600 prose-a:font-semibold"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                <ProductFAQ faqs={faqs} />

                {/* Sticky Mobile CTA - For larger layout we can use a component but keep it simple here */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 lg:hidden z-50">
                    <BuyButton productTitle={product.title} affiliateLink={product.affiliate_link || ''} className="w-full shadow-xl" />
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-16 pt-16 border-t border-gray-100">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center md:text-left">Recommended Alternatives</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} className="h-full" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

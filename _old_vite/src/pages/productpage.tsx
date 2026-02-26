import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Check, X, ExternalLink, ChevronRight, ChevronDown, ShoppingCart, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductCard } from '../components/products/ProductCard';
import { SEOHead } from '../components/seo/SEOHead';
import { AdBanner } from '../components/ads/AdBanner';
import { trackAffiliateClick } from '../components/seo/SEOHead';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string; title: string; slug: string; description: string | null; short_description: string | null;
  pros: string[]; cons: string[]; features: string[]; rating: number; review_count: number;
  affiliate_link: string | null; category_id: string | null; featured_image: string | null;
  gallery_images: string[]; meta_title: string | null; meta_description: string | null;
  schema_enabled: boolean; price_range: string | null; brand: string | null; created_at: string;
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!slug) return;
    supabase.from('products').select('*').eq('slug', slug).eq('status', 'published').single().then(({ data }) => {
      if (data) {
        setProduct(data as Product);
        if (data.category_id) {
          supabase.from('products').select('id,title,slug,short_description,rating,review_count,affiliate_link,featured_image,price_range,brand,pros').eq('status', 'published').eq('category_id', data.category_id).neq('slug', slug).limit(4).then(({ data: rel }) => {
            setRelatedProducts((rel || []) as Product[]);
          });
        }
        // Check if saved
        if (user) {
          supabase.from('saved_products').select('id').eq('user_id', user.id).eq('product_id', data.id).single().then(({ data: saved }) => {
            setIsSaved(!!saved);
          });
        }
      }
      setLoading(false);
    });
  }, [slug, user]);

  const handleAffiliateClick = () => {
    if (product?.affiliate_link) {
      trackAffiliateClick(product.title, product.affiliate_link);
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSave = async () => {
    if (!user || !product) { window.location.href = '/auth/login'; return; }
    if (isSaved) {
      await supabase.from('saved_products').delete().eq('user_id', user.id).eq('product_id', product.id);
      setIsSaved(false);
    } else {
      await supabase.from('saved_products').insert({ user_id: user.id, product_id: product.id });
      setIsSaved(true);
    }
  };

  if (loading) return (
    <MainLayout showAds={false}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gray-100 rounded-2xl h-96 animate-pulse" />
          <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-lg h-8 animate-pulse" />)}</div>
        </div>
      </div>
    </MainLayout>
  );

  if (!product) return (
    <MainLayout><div className="text-center py-24"><h1 className="text-2xl font-bold text-gray-900">Product not found</h1><Link to="/products" className="text-orange-500 hover:underline mt-4 block">Browse all products</Link></div></MainLayout>
  );

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(product.rating));
  const allImages = [product.featured_image, ...(product.gallery_images || [])].filter(Boolean) as string[];
  
  const productSchema = product.schema_enabled ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.short_description,
    image: product.featured_image,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.review_count },
    offers: { '@type': 'Offer', availability: 'https://schema.org/InStock', url: product.affiliate_link || undefined }
  } : undefined;

  const faqs = [
    { q: `Is ${product.title} worth buying?`, a: `Based on our testing and ${product.review_count.toLocaleString()} user reviews, the ${product.title} scores ${product.rating}/5. ${product.pros[0] || 'It offers excellent value for its price.'}`},
    { q: `What is the price of ${product.title}?`, a: product.price_range ? `The ${product.title} is typically priced at ${product.price_range}. Click "Buy on Amazon" to see the current price.` : `Click the "Buy on Amazon" button to see the latest price.`},
    { q: `Where to buy ${product.title}?`, a: `We recommend purchasing the ${product.title} through Amazon for the best price, fast shipping, and easy returns.`}
  ];

  return (
    <MainLayout showAds={false}>
      <SEOHead
        title={product.meta_title || product.title}
        description={product.meta_description || product.short_description || undefined}
        image={product.featured_image || undefined}
        type="product"
        schema={productSchema}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-orange-500">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium line-clamp-1">{product.title}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div>
            <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden mb-3">
              {allImages[activeImage] ? (
                <img src={allImages[activeImage]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200"><ShoppingCart className="w-20 h-20" /></div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.brand && <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">{product.brand}</span>}
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mt-1 mb-4 leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {stars.map((filled, i) => <Star key={i} className={`w-5 h-5 ${filled ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
              </div>
              <span className="text-xl font-bold text-gray-900">{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 text-sm">({product.review_count.toLocaleString()} reviews)</span>
            </div>

            {product.short_description && <p className="text-gray-600 mb-5 leading-relaxed">{product.short_description}</p>}
            
            {product.price_range && (
              <div className="mb-5">
                <span className="text-3xl font-bold text-gray-900">{product.price_range}</span>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button onClick={handleAffiliateClick} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30 text-lg">
                <ExternalLink className="w-5 h-5" /> Buy on Amazon
              </button>
              <button onClick={handleSave} className={`px-4 py-3.5 rounded-xl border-2 transition-all ${isSaved ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-500 hover:border-orange-200 hover:text-orange-500'}`}>
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
              🔗 <strong>Affiliate Disclosure:</strong> We may earn a commission when you buy through our links, at no extra cost to you.
            </div>

            {/* Key Features */}
            {product.features.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Key Features</h3>
                <ul className="space-y-1.5">
                  {product.features.slice(0, 5).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Pros & Cons */}
        {(product.pros.length > 0 || product.cons.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {product.pros.length > 0 && (
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h2 className="font-bold text-green-800 mb-4 flex items-center gap-2"><Check className="w-5 h-5" /> Pros</h2>
                <ul className="space-y-2">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" /> {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.cons.length > 0 && (
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <h2 className="font-bold text-red-800 mb-4 flex items-center gap-2"><X className="w-5 h-5" /> Cons</h2>
                <ul className="space-y-2">
                  {product.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" /> {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Full Description */}
        {product.description && (
          <div className="mb-12">
            <AdBanner placement="blog_post_top" className="mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">In-Depth Review</h2>
            <div className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Ad */}
        <AdBanner placement="blog_post_middle" className="my-8" />

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 lg:hidden z-40">
          <button onClick={handleAffiliateClick} className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
            <ExternalLink className="w-5 h-5" /> Buy on Amazon
          </button>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-24 lg:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

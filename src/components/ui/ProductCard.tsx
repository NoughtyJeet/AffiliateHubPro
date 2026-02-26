'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { trackAffiliateClick } from '@/utils/analytics';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
    const [isSaved, setIsSaved] = useState(false);
    const { user } = useAuth();
    const supabase = createClient();

    const handleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!user) { window.location.href = '/auth/login'; return; }
        if (isSaved) {
            await supabase.from('saved_products').delete().eq('user_id', user.id).eq('product_id', product.id);
            setIsSaved(false);
        } else {
            await supabase.from('saved_products').insert({ user_id: user.id, product_id: product.id });
            setIsSaved(true);
        }
    };

    const handleAffiliateClick = (e: React.MouseEvent) => {
        e.preventDefault();
        trackAffiliateClick(product.title, product.affiliate_link || '');
        if (product.affiliate_link) {
            window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
        }
    };

    const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(product.rating));

    return (
        <div className={`group bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full ${className}`}>
            {/* Image */}
            <Link href={`/product/${product.slug}`} className="block relative overflow-hidden">
                <div className="aspect-[4/3] bg-gray-50 relative">
                    {product.featured_image ? (
                        <Image
                            src={product.featured_image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingCart className="w-12 h-12" />
                        </div>
                    )}
                </div>
                {/* Save button */}
                <button
                    onClick={handleSave}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title="Save product"
                >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                {product.brand && <span className="text-xs font-medium text-orange-500 uppercase tracking-wide">{product.brand}</span>}
                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-2 hover:text-orange-500 transition-colors leading-tight">{product.title}</h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex">
                        {stars.map((filled, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${filled ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">{product.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({product.review_count.toLocaleString()})</span>
                </div>

                {product.short_description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.short_description}</p>
                )}

                {product.pros && product.pros.length > 0 && (
                    <ul className="mb-3 space-y-0.5">
                        {product.pros.slice(0, 2).map((pro, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span className="line-clamp-1">{pro}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                    {product.price_range && (
                        <span className="text-sm font-bold text-gray-800">{product.price_range}</span>
                    )}
                    <button
                        onClick={handleAffiliateClick}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors ml-auto cursor-pointer"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buy on Amazon
                    </button>
                </div>
            </div>
        </div>
    );
}

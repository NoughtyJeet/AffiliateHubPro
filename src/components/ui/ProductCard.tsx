'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { trackAffiliateClick } from '@/utils/analytics';
import { Database } from '@/types/database';

type Product = Database['public']['Tables']['products']['Row'];

type ProductCardProduct = Pick<Product, 'id' | 'title' | 'slug' | 'short_description' | 'rating' | 'review_count' | 'affiliate_link' | 'featured_image' | 'price_range' | 'brand' | 'pros'>;

interface ProductCardProps {
    product: ProductCardProduct;
    layout?: 'default' | 'horizontal' | 'compact';
    className?: string;
}

export function ProductCard({ product, layout = 'default', className = '' }: ProductCardProps) {
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
        const title = product.title || 'Product';
        const link = product.affiliate_link || '';
        trackAffiliateClick(title, link);
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    const rating = product.rating || 0;
    const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));

    // --------------------------------------------------------------------------------
    // COMPACT LAYOUT (Community Favorites) - Matches uploaded design
    // --------------------------------------------------------------------------------
    if (layout === 'compact') {
        return (
            <div className={cn(
                "group relative bg-[#121212] dark:bg-[#121212] rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden flex flex-col h-full",
                className
            )}>
                {/* Image Section */}
                <Link href={`/product/${product.slug}`} className="block relative h-48 w-full p-2">
                    <div className="w-full h-full relative rounded-[1.5rem] overflow-hidden bg-zinc-800">
                        {product.featured_image ? (
                            <Image
                                src={product.featured_image}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 bg-zinc-800">
                                <ShoppingCart className="w-12 h-12 stroke-[1]" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 z-20">
                        {product.brand && (
                            <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-[0.2em] rounded-full">
                                {product.brand}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleSave}
                        className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full transition-all cursor-pointer group/btn"
                        title="Save product"
                    >
                        <Heart className={cn("w-4 h-4 transition-colors", isSaved ? "fill-white text-white" : "text-white/60 group-hover/btn:text-white")} />
                    </button>
                </Link>

                <div className="p-5 flex flex-col flex-grow relative z-20">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                            {stars.map((filled, i) => (
                                <Star key={i} className={cn("w-3 h-3 text-orange-500", filled ? "fill-orange-500" : "")} />
                            ))}
                        </div>
                        <span className="text-[11px] font-bold text-gray-400">{rating.toFixed(1)}</span>
                    </div>

                    {/* Title */}
                    <Link href={`/product/${product.slug}`}>
                        <h3 className="font-bold text-white text-base mb-2 line-clamp-2 hover:text-orange-400 transition-colors leading-tight tracking-tight">
                            {product.title}
                        </h3>
                    </Link>

                    {/* Short Description */}
                    {product.short_description && (
                        <p className="text-xs text-gray-400 line-clamp-1 mb-4 italic opacity-80">
                            "{product.short_description}"
                        </p>
                    )}

                    {/* Pros (Pill style) */}
                    {product.pros && product.pros.length > 0 && (
                        <div className="space-y-2 mb-6 mt-auto">
                            {product.pros.slice(0, 2).map((pro, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
                                    <span className="w-4 h-4 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-[8px] font-bold">✓</span>
                                    <span className="text-xs text-gray-300 font-medium line-clamp-1">{pro}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer: Price & CTA */}
                    <div className="flex items-end justify-between pt-4 border-t border-white/10 mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase font-black text-gray-500 tracking-widest mb-0.5">Availability</span>
                            <span className="text-sm font-bold text-white">{product.price_range || 'Check Price'}</span>
                        </div>
                        <button
                            onClick={handleAffiliateClick}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-gray-200 active:scale-95 shadow-sm"
                        >
                            Unlock Deal
                            <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --------------------------------------------------------------------------------
    // HORIZONTAL LAYOUT (Editor's Prime Picks) - Image left, content right
    // --------------------------------------------------------------------------------
    if (layout === 'horizontal') {
        return (
            <div className={cn(
                "group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 hover:border-orange-500/30 dark:hover:border-orange-500/50 transition-all duration-500 overflow-hidden flex flex-col md:flex-row h-full hover:shadow-xl",
                className
            )}>
                {/* Image Section (Left) */}
                <Link href={`/product/${product.slug}`} className="block relative p-4 md:w-2/5 flex-shrink-0">
                    <div className="w-full h-48 md:h-full relative rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-zinc-800">
                        {product.featured_image ? (
                            <Image
                                src={product.featured_image}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-zinc-700">
                                <ShoppingCart className="w-16 h-16 stroke-[1]" />
                            </div>
                        )}
                    </div>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-8 left-8 z-20">
                        {product.brand && (
                            <span className="px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[10px] font-black text-gray-900 dark:text-zinc-100 uppercase tracking-[0.2em] rounded-full shadow-sm border border-white/20">
                                {product.brand}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        className="absolute top-8 right-8 z-20 p-2.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20 group/btn"
                    >
                        <Heart className={cn("w-4 h-4 transition-colors", isSaved ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/btn:text-red-400")} />
                    </button>
                </Link>

                {/* Content Section (Right) */}
                <div className="p-6 md:p-8 flex flex-col flex-grow justify-center relative z-20">
                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex bg-orange-50/50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-100/50 dark:border-orange-500/20">
                            {stars.map((filled, i) => (
                                <Star key={i} className={cn("w-2.5 h-2.5", filled ? "fill-orange-500 text-orange-500" : "text-orange-200 dark:text-zinc-700")} />
                            ))}
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">{rating.toFixed(1)}</span>
                    </div>

                    {/* Title */}
                    <Link href={`/product/${product.slug}`}>
                        <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-xl md:text-2xl mb-3 line-clamp-2 hover:text-orange-500 dark:hover:text-orange-400 transition-colors leading-tight">
                            {product.title}
                        </h3>
                    </Link>

                    {/* Description */}
                    {product.short_description && (
                        <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-6 font-medium leading-relaxed">
                            {product.short_description}
                        </p>
                    )}

                    {/* Key Features / Pros Grid */}
                    {product.pros && product.pros.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                            {product.pros.slice(0, 4).map((pro, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <span className="w-5 h-5 mt-0.5 flex-shrink-0 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                                    <span className="text-sm text-gray-700 dark:text-zinc-300 font-semibold">{pro}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer: Price & CTA */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-zinc-800 mt-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-tighter">Availability</span>
                            <span className="text-lg font-black text-gray-900 dark:text-zinc-100">{product.price_range || 'Check Price'}</span>
                        </div>
                        <button
                            onClick={handleAffiliateClick}
                            className="relative group/buy flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-black rounded-2xl transition-all hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none"
                        >
                            <span className="relative z-10 uppercase tracking-widest">Unlock Deal</span>
                            <ExternalLink className="w-4 h-4 relative z-10 group-hover/buy:translate-x-0.5 group-hover/buy:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --------------------------------------------------------------------------------
    // DEFAULT LAYOUT
    // --------------------------------------------------------------------------------
    return (
        <div className={cn(

            "group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 hover:border-orange-500/30 dark:hover:border-orange-500/50 transition-all duration-500 overflow-hidden flex flex-col h-full hover:shadow-[0_0_50px_-12px_rgba(249,115,22,0.08)] dark:hover:shadow-[0_0_50px_-12px_rgba(249,115,22,0.2)]",
            className
        )}>
            {/* Image Section */}
            <Link href={`/product/${product.slug}`} className="block relative overflow-hidden flex-shrink-0 p-3">
                <div className="aspect-[4/3] bg-gray-50/50 dark:bg-zinc-800/50 relative rounded-[2rem] overflow-hidden">
                    {product.featured_image ? (
                        <Image
                            src={product.featured_image}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-zinc-700 bg-gray-50 dark:bg-zinc-800">
                            <ShoppingCart className="w-16 h-16 stroke-[1]" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                {/* Floating Badges */}
                <div className="absolute top-6 left-6 z-20">
                    {product.brand && (
                        <span className="px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[10px] font-black text-gray-900 dark:text-zinc-100 uppercase tracking-[0.2em] rounded-full shadow-sm border border-white/20 dark:border-zinc-700/50">
                            {product.brand}
                        </span>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    className="absolute top-6 right-6 z-20 p-2.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer border border-white/20 dark:border-zinc-700/50 group/btn"
                    title="Save product"
                >
                    <Heart className={cn("w-4 h-4 transition-colors", isSaved ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/btn:text-red-400")} />
                </button>
            </Link>

            <div className="p-6 pt-2 flex flex-col flex-grow relative z-20">
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex bg-orange-50/50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-100/50 dark:border-orange-500/20">
                        {stars.map((filled, i) => (
                            <Star key={i} className={cn("w-2.5 h-2.5", filled ? "fill-orange-500 text-orange-500" : "text-orange-200 dark:text-zinc-700")} />
                        ))}
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">{rating.toFixed(1)}</span>
                </div>

                <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-lg mb-3 line-clamp-2 hover:text-orange-500 dark:hover:text-orange-400 transition-colors leading-tight tracking-tight">
                        {product.title}
                    </h3>
                </Link>

                {product.short_description && (
                    <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-4 font-medium leading-relaxed italic opacity-80">
                        "{product.short_description}"
                    </p>
                )}

                {product.pros && product.pros.length > 0 && (
                    <div className="mt-auto space-y-2 mb-6">
                        {product.pros.slice(0, 2).map((pro, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-gray-50/50 dark:bg-zinc-800/50 rounded-xl border border-gray-100/50 dark:border-zinc-700/50 group/pro hover:bg-white dark:hover:bg-zinc-800 transition-colors">
                                <span className="w-5 h-5 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span>
                                <span className="text-xs text-gray-700 dark:text-zinc-300 font-semibold line-clamp-1">{pro}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-gray-400 dark:text-zinc-500 tracking-tighter">Availability</span>
                        <span className="text-sm font-black text-gray-900 dark:text-zinc-100">{product.price_range || 'Check Price'}</span>
                    </div>
                    <button
                        onClick={handleAffiliateClick}
                        className="relative group/buy flex items-center gap-2 px-5 py-3 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-black rounded-2xl transition-all hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white active:scale-95 overflow-hidden shadow-lg shadow-gray-200 dark:shadow-none"
                    >
                        <span className="relative z-10 uppercase tracking-widest">Unlock Deal</span>
                        <ExternalLink className="w-3.5 h-3.5 relative z-10 group-hover/buy:translate-x-0.5 group-hover/buy:-translate-y-0.5 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover/buy:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </div>
        </div>
    );
}

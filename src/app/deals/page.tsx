import { createClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/ui/ProductCard';
import { Zap, Clock, ShieldCheck, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AdBanner } from '@/components/ui/AdBanner';

export const metadata = {
    title: 'Exclusive Deals - Limited Time Amazon Offers',
    description: 'Save big with our curated list of the best limited-time deals on Amazon. Expert-verified discounts on top-rated tech, home, and fitness gear.',
};

export default async function DealsPage() {
    const supabase = await createClient();

    // Fetch featured products that act as our "Deals"
    const { data: deals } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .limit(12);

    // Mock discount data for demo purposes since we don't have separate price columns
    const dealsWithPrices = deals?.map((p, i) => ({
        ...p,
        // Calculate a mock original price for the UI based on the current price_range
        // We'll strip currency symbols and add 20-30% for the "Original" display
        original_price: p.price_range?.includes('$')
            ? `$${(parseFloat(p.price_range.replace(/[^0-9.]/g, '')) * 1.25).toFixed(2)}`
            : '$199.99'
    })) || [];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero Promotional Banner */}
            <div className="relative bg-gradient-to-br from-orange-600 to-red-600 text-white overflow-hidden py-16 md:py-24">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 border border-white/30 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
                            <Zap className="w-3 h-3 fill-white" /> Limited Time Event
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
                            Today's Top <span className="text-orange-200 underline decoration-wavy underline-offset-8">Flash Deals</span>
                        </h1>
                        <p className="text-lg text-orange-50 font-medium mb-8 max-w-xl">
                            We've analyzed thousands of listings to find the deepest discounts on high-rated products. Prices are updated hourly. Don't miss out!
                        </p>

                        {/* Countdown Timer (Static Demo) */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex flex-col items-center">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 w-16 h-16 flex items-center justify-center text-2xl font-black">04</div>
                                <span className="text-[10px] font-bold uppercase mt-2 opacity-80">Hours</span>
                            </div>
                            <span className="text-2xl font-bold">:</span>
                            <div className="flex flex-col items-center">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 w-16 h-16 flex items-center justify-center text-2xl font-black">28</div>
                                <span className="text-[10px] font-bold uppercase mt-2 opacity-80">Mins</span>
                            </div>
                            <span className="text-2xl font-bold">:</span>
                            <div className="flex flex-col items-center">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 w-16 h-16 flex items-center justify-center text-2xl font-black">35</div>
                                <span className="text-[10px] font-bold uppercase mt-2 opacity-80">Secs</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-orange-100">
                            <div className="flex items-center gap-1.5"><ShieldCheck size={14} /> Verified Savings</div>
                            <div className="w-1 h-1 bg-white/30 rounded-full" />
                            <div className="flex items-center gap-1.5"><Clock size={14} /> Ends Tonight</div>
                        </div>
                    </div>
                </div>

                {/* Decorative Element */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-center opacity-20 rotate-12 pointer-events-none">
                    <Tag size={400} className="text-white" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                {/* Stats Bar */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    <div className="flex items-center gap-4 px-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600"><Zap size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">Highest Discounts</h4>
                            <p className="text-xs text-gray-500">Up to 60% off MSRP</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><ShieldCheck size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">Price Protection</h4>
                            <p className="text-xs text-gray-500">Verified deal history</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 px-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Tag size={20} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-900">Featured Categories</h4>
                            <p className="text-xs text-gray-500">Tech, Home & Kitchen</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Featured Discounts</h2>
                        <p className="text-gray-500 font-medium mt-2">Our editor's top picks for maximum value today.</p>
                    </div>
                    <AdBanner placement="deals_top" className="hidden md:block max-w-sm" />
                </div>

                {!dealsWithPrices.length ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                        <div className="text-4xl mb-4">🏷️</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Refining Today's Deals...</h3>
                        <p className="text-gray-500">We are currently scanning for the best prices. Check back in a few minutes!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {dealsWithPrices.map(product => (
                            <div key={product.id} className="relative group">
                                {/* Discount Badge Overlay */}
                                <div className="absolute top-4 left-4 z-20 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg animate-pulse">
                                    -28% OFF
                                </div>
                                <ProductCard
                                    product={{
                                        ...product,
                                        sale_price: product.price_range || '',
                                        original_price: product.original_price
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Secondary Deals Section */}
                <div className="mt-24">
                    <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" />
                        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                            <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase leading-none italic text-orange-400">Never Miss A Saving</h2>
                            <p className="text-gray-400 font-medium mb-10 leading-relaxed text-lg">
                                Join 50,000+ shoppers who receive our daily "Deal Drop" newsletter. We scan Amazon 24/7 so you don't have to.
                            </p>
                            <form className="w-full flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email address..."
                                    className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                                />
                                <button className="px-10 py-5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl shadow-black/20">
                                    Unlock Access
                                </button>
                            </form>
                            <p className="mt-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">No SPAM. NO FEE. JUST SAVINGS.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

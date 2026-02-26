import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Star } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-6">
                        <Zap className="w-4 h-4" />
                        Trusted Reviews. Real Recommendations.
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                        Find The <span className="text-orange-400">Best Products</span> Worth Your Money
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                        Expert reviews, in-depth comparisons, and honest recommendations for Amazon's best products. We test so you don't have to.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/products" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30">
                            Browse Products <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/blog" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-sm transition-all border border-white/20">
                            <BookOpen className="w-5 h-5" /> Read Guides
                        </Link>
                    </div>
                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                        {[
                            ['500+', 'Products Reviewed'],
                            ['50K+', 'Happy Readers'],
                            ['4.9★', 'Trust Score']
                        ].map(([num, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-2xl font-bold text-orange-400">{num}</div>
                                <div className="text-xs text-gray-400 mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Decorative */}
            <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:flex items-center justify-center opacity-10 pointer-events-none">
                <Star className="w-96 h-96 text-orange-400" />
            </div>
        </section>
    );
}

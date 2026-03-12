import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Star } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative bg-transparent text-gray-900 dark:text-white transition-colors duration-500 overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2 md:pt-20 md:pb-6">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm font-medium mb-8">
                        <Zap className="w-4 h-4 animate-pulse" />
                        Trusted Reviews. Real Recommendations.
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight text-gray-900 dark:text-white">
                        Find The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-400 dark:to-amber-300">Best Products</span> Worth Your Money
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl font-medium leading-relaxed">
                        Expert reviews, in-depth comparisons, and honest recommendations for Amazon's best products. We test so you don't have to.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5">
                        <Link href="/products" className="flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/40 active:scale-95">
                            Browse Products <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="/blog" className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white font-black uppercase tracking-widest text-sm rounded-2xl backdrop-blur-md transition-all border border-gray-200 dark:border-white/20 active:scale-95">
                            <BookOpen className="w-5 h-5" /> Read Guides
                        </Link>
                    </div>
                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-md border-t border-gray-200 dark:border-white/10 pt-8">
                        {[
                            ['500+', 'Reviews'],
                            ['50K+', 'Readers'],
                            ['4.9★', 'Trust']
                        ].map(([num, label]) => (
                            <div key={label} className="text-left">
                                <div className="text-2xl font-black text-orange-400 tracking-tight">{num}</div>
                                <div className="text-[10px] uppercase font-bold text-gray-400 mt-1 tracking-widest">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Decorative Icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full hidden lg:flex items-center justify-center opacity-[0.05] dark:opacity-[0.08] pointer-events-none">
                <Star className="w-full h-full text-orange-500 dark:text-white" />
            </div>
        </section>
    );
}

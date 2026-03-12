import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoriesProps {
    categories: Category[];
}

export function Categories({ categories }: CategoriesProps) {
    const productCats = categories.filter(c => c.type === 'product');

    return (
        <section className="py-6 bg-transparent transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight uppercase tracking-widest text-sm">Explore Universe</h2>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-zinc-50 mt-2">Browse by <span className="text-orange-500">Category</span></h3>
                        <p className="text-gray-500 dark:text-zinc-400 text-base mt-3 font-medium">Find meticulously reviewed products in your area of interest</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                    {productCats.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="group flex flex-col items-center p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 hover:border-orange-500/30 dark:hover:border-orange-500/50 hover:shadow-2xl dark:hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 text-center"
                        >
                            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 group-hover:bg-orange-500 rounded-[1.25rem] flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-orange-100 dark:border-orange-500/20">
                                <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">
                                    {cat.slug === 'electronics' ? '📱' : cat.slug === 'home-kitchen' ? '🏠' : cat.slug === 'health-fitness' ? '💪' : '🛍️'}
                                </span>
                            </div>
                            <span className="text-xs font-black text-gray-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors uppercase tracking-[0.2em]">{cat.name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-zinc-700 group-hover:text-orange-400 mt-2 transition-colors" />
                        </Link>
                    ))}
                    <Link href="/products" className="flex flex-col items-center p-8 bg-gray-900 dark:bg-orange-600 rounded-[2rem] hover:bg-orange-600 dark:hover:bg-orange-500 transition-all duration-300 hover:-translate-y-1 text-center shadow-2xl shadow-gray-200 dark:shadow-orange-500/20 group">
                        <div className="w-16 h-16 bg-white/10 rounded-[1.25rem] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <span className="text-3xl">🔍</span>
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-[0.2em]">All Products</span>
                        <ChevronRight className="w-4 h-4 text-white/50 mt-2 group-hover:text-white" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

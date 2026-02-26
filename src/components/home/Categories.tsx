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
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
                        <p className="text-gray-500 text-sm mt-1">Find products in your area of interest</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {productCats.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="group flex flex-col items-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-center"
                        >
                            <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-500 rounded-xl flex items-center justify-center mb-3 transition-colors">
                                <span className="text-2xl">
                                    {cat.slug === 'electronics' ? '📱' : cat.slug === 'home-kitchen' ? '🏠' : cat.slug === 'health-fitness' ? '💪' : '🛍️'}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors uppercase tracking-tight">{cat.name}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 mt-1 transition-colors" />
                        </Link>
                    ))}
                    <Link href="/products" className="flex flex-col items-center p-5 bg-orange-500 rounded-2xl hover:bg-orange-600 transition-colors text-center shadow-lg shadow-orange-500/20">
                        <div className="w-12 h-12 bg-orange-400 rounded-xl flex items-center justify-center mb-3">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <span className="text-sm font-semibold text-white">All Products</span>
                        <ChevronRight className="w-4 h-4 text-orange-200 mt-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

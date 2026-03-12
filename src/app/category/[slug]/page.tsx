import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { ProductListing } from '@/components/product/ProductListing';

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        sort?: string;
        minRating?: string;
    }>;
}

export async function generateMetadata(
    { params }: CategoryPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: category } = await supabase
        .from('categories')
        .select('name, meta_title, meta_description')
        .eq('slug', slug)
        .single();

    if (!category) return {};

    return {
        title: category.meta_title || `${category.name} - Best Product Reviews`,
        description: category.meta_description || `Discover the best ${category.name} products, expert reviews, and top-rated recommendations.`,
    };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { slug } = await params;
    const { sort = 'rating', minRating = '0' } = await searchParams;
    const rating = parseFloat(minRating);
    const supabase = await createClient();

    // Fetch category
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!category) notFound();

    // Fetch products in this category
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .eq('category_id', category.id)
        .order(sort === 'rating' ? 'rating' : 'created_at', { ascending: false })
        .gte('rating', rating);

    return (
        <div className="flex flex-col gap-0 overflow-x-hidden relative bg-gradient-to-br from-orange-50 via-white to-orange-100/50 dark:from-[#050505] dark:via-[#0c0c0c] dark:to-[#1a0f00] min-h-screen transition-colors duration-500">
            {/* Unified Background Elements */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none z-0" 
                 style={{ backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            
            <div className="absolute inset-0 opacity-10 dark:opacity-20 hidden dark:block z-0" 
                 style={{ backgroundImage: "radial-gradient(circle, rgba(249,115,22,0.15) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            
            {/* Shared Ambient Glows */}
            <div className="absolute top-[10%] right-0 w-[600px] h-[600px] bg-orange-500/10 dark:bg-orange-500/15 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
            <div className="absolute bottom-[20%] left-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 pointer-events-none z-0" />

            <div className="relative z-10">
                <ProductListing
                    products={products || []}
                    category={category}
                    title={`${category.name}`}
                    description={category.meta_description || `Explore our hand-picked selection of the best ${category.name} products based on expert testing and real user reviews.`}
                    sortBy={sort}
                    minRating={rating}
                />
            </div>
        </div>
    );
}

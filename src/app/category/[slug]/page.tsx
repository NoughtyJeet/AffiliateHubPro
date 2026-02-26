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
        <div className="bg-white min-h-screen">
            <ProductListing
                products={products || []}
                category={category}
                title={`${category.name}`}
                description={category.meta_description || `Explore our hand-picked selection of the best ${category.name} products based on expert testing and real user reviews.`}
                sortBy={sort}
                minRating={rating}
            />
        </div>
    );
}

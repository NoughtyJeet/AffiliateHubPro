import { createClient } from '@/lib/supabase/server';
import { ProductListing } from '@/components/product/ProductListing';

export const metadata = {
    title: 'Explore All Products - Expert Reviews & Recommendations',
    description: 'Browse our full catalog of expert-reviewed products. Filter by rating and date to find the best deals on Amazon.',
};

interface ProductsPageProps {
    searchParams: Promise<{
        sort?: string;
        minRating?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const { sort = 'rating', minRating = '0' } = await searchParams;
    const rating = parseFloat(minRating);
    const supabase = await createClient();

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order(sort === 'rating' ? 'rating' : 'created_at', { ascending: false })
        .gte('rating', rating);

    return (
        <div className="bg-white min-h-screen">
            <ProductListing
                products={products || []}
                title="All Products"
                description="Discover the best-rated products across all categories, tested and reviewed by our experts."
                sortBy={sort}
                minRating={rating}
            />
        </div>
    );
}

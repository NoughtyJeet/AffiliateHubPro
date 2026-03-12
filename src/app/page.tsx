import { createClient } from '@/lib/supabase/server';
import { Hero } from '@/components/home/Hero';
import { Categories } from '@/components/home/Categories';
import { Newsletter } from '@/components/home/Newsletter';
import { SmartProductGrid } from '@/components/home/SmartProductGrid';
import { BlogSlider } from '@/components/home/BlogSlider';
import { BrandSlider } from '@/components/home/BrandSlider';
import { AdBanner } from '@/components/ui/AdBanner';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: categories },
    { data: featuredProducts },
    { data: topProducts },
    { data: latestPosts }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('products').select('*').eq('status', 'published').eq('featured', true).limit(6),
    supabase.from('products').select('*').eq('status', 'published').order('rating', { ascending: false }).limit(8),
    supabase.from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(10)
  ]);

  return (
    <div className="flex flex-col gap-0 overflow-x-hidden relative bg-gradient-to-br from-orange-50 via-white to-orange-100/50 dark:from-[#050505] dark:via-[#0c0c0c] dark:to-[#1a0f00] transition-colors duration-500">
      {/* Unified Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1] pointer-events-none z-0" 
           style={{ backgroundImage: "linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      
      <div className="absolute inset-0 opacity-10 dark:opacity-20 hidden dark:block z-0" 
           style={{ backgroundImage: "radial-gradient(circle, rgba(249,115,22,0.15) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      
      {/* Shared Ambient Glows */}
      <div className="absolute top-[10%] right-0 w-[800px] h-[800px] bg-orange-500/10 dark:bg-orange-500/15 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none z-0" />
      <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full -translate-x-1/2 pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-0 w-[700px] h-[700px] bg-orange-500/5 dark:bg-orange-500/10 blur-[120px] rounded-full translate-x-1/2 pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col gap-0">
        <Hero />

        {/* Modern Smart Grid for Featured Products */}
        <SmartProductGrid 
          products={featuredProducts || []} 
          title="Editor's Prime Picks"
          subtitle="Our team spent 100+ hours testing these top-tier gadgets so you can buy with absolute confidence."
          cardLayout="horizontal"
        />

        <BrandSlider />

        {/* Ad Banner - More integrated look */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <AdBanner placement="product_grid" className="relative rounded-2xl overflow-hidden shadow-2xl" />
          </div>
        </div>

        {categories && <Categories categories={categories} />}

        {/* Smart Grid for Top Rated Products */}
        <SmartProductGrid 
          products={topProducts || []} 
          title="Community Favorites"
          subtitle="The highest-rated gear as decided by thousands of real-world users and expert reviewers."
          cardLayout="compact"
        />

        {/* Beautiful Blog Slider */}
        <BlogSlider posts={latestPosts || []} />

        <Newsletter />
      </div>
    </div>
  );
}

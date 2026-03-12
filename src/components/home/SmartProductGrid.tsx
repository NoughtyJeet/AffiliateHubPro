'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ui/ProductCard';
import { Database } from '@/types/database';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Product = Database['public']['Tables']['products']['Row'];

interface SmartProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  cardLayout?: 'default' | 'horizontal' | 'compact';
}

export function SmartProductGrid({ products, title, subtitle, cardLayout = 'default' }: SmartProductGridProps) {
  // If no products, show beautiful "Coming Soon" or Demo placeholders
  const displayProducts = products.length > 0 ? products : Array(4).fill(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section className="py-6 relative bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 dark:bg-orange-500/10 rounded-full text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-100 dark:border-orange-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Curation
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              {title || "Featured Selection"}
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 mt-4 text-lg max-w-2xl font-medium leading-relaxed">
              {subtitle || "Discover meticulously reviewed tech gear and lifestyle essentials chosen for performance and value."}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/products" 
              className="group flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all shadow-xl shadow-gray-200 dark:shadow-none"
            >
              Explore Full Catalog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Grid Layout Based on Card Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={cn(
            "grid gap-6 h-full",
            cardLayout === 'horizontal' && "grid-cols-1 xl:grid-cols-2", // Horizontal layout works better in fewer columns
            cardLayout === 'compact' && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", // Small vertical compact layout
            cardLayout === 'default' && "grid-cols-1 md:grid-cols-4 md:grid-rows-2" // Original Bento layout
          )}
        >
          {displayProducts.map((product, idx) => {
            // Apply bento spanning only for default layout
            let spanClass = "col-span-1";
            if (cardLayout === 'default') {
                spanClass = "md:col-span-1 md:row-span-1";
                if (idx === 0) spanClass = "md:col-span-2 md:row-span-2"; 
                if (idx === 1) spanClass = "md:col-span-2 md:row-span-1"; 
            }

            return (
              <motion.div key={product?.id || idx} variants={itemVariants} className={spanClass}>
                {product ? (
                  <ProductCard 
                    product={product} 
                    layout={cardLayout}
                    className="h-full" 
                  />
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-gray-50 dark:bg-zinc-900 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center group hover:border-orange-200 dark:hover:border-orange-500/30 transition-colors duration-500">
                    <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-gray-100 dark:border-zinc-700">
                      <Sparkles className="w-8 h-8 text-gray-300 dark:text-zinc-600 group-hover:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-black text-gray-400 dark:text-zinc-500 group-hover:text-gray-900 dark:group-hover:text-zinc-100 transition-colors uppercase tracking-widest">Premium Gear</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 max-w-[200px] font-medium leading-relaxed uppercase tracking-tighter">Expert review in progress. Stay tuned for our verdict.</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

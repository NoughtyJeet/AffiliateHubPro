'use client';

import { motion } from 'framer-motion';
import { BlogCard } from '@/components/ui/BlogCard';
import { Database } from '@/types/database';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

interface BlogSectionProps {
  posts: BlogPost[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-zinc-800 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <Zap className="w-3.5 h-3.5" />
              Pulse of Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-zinc-50 tracking-tight leading-tight">
              In-Depth <span className="text-orange-500">Guides</span> & Insights
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 mt-4 text-lg font-medium leading-relaxed">
              Stay ahead of the curve with our expert analysis on the latest hardware, software, and industry trends.
            </p>
          </div>

          <Link 
            href="/blog" 
            className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5"
          >
            Explore Hub
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Techy Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <BlogCard 
                post={post} 
                className="h-full hover:-translate-y-2 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
        
        {/* Bottom Decorative Line */}
        <div className="mt-24 h-px bg-gradient-to-r from-transparent via-gray-100 dark:via-zinc-800/50 to-transparent" />
      </div>
    </section>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { BlogCard } from '@/components/ui/BlogCard';
import { Database } from '@/types/database';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

interface BlogSliderProps {
  posts: BlogPost[];
}

export function BlogSlider({ posts }: BlogSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fallback demo posts if none exist
  const displayPosts = posts.length > 0 ? posts : [];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(displayPosts.length, 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayPosts.length) % Math.max(displayPosts.length, 1));
  };

  if (displayPosts.length === 0) return null;

  return (
    <section className="py-10 bg-transparent border-y border-white/5 relative overflow-hidden transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-wider mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Pulse of Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              In-Depth <span className="text-orange-500">Guides</span> & Insights
            </h2>
            <p className="text-gray-500 dark:text-zinc-400 mt-4 text-lg max-w-xl font-medium">
              Stay ahead with our expert analysis on the latest hardware, software, and industry trends.
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={prevSlide}
              className="p-5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
              aria-label="Previous slide"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-5 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
              aria-label="Next slide"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative">
          <motion.div 
            className="flex gap-8 overflow-hidden select-none px-4"
            ref={scrollRef}
          >
            <AnimatePresence mode="popLayout">
              {displayPosts.slice(currentIndex, currentIndex + 3).concat(
                displayPosts.slice(0, Math.max(0, 3 - (displayPosts.length - currentIndex)))
              ).map((post, idx) => (
                <motion.div 
                  key={`${post.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: 100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "circOut" }}
                  className="min-w-[320px] md:min-w-[420px] flex-1"
                >
                  <BlogCard 
                    post={post} 
                    className="!bg-white dark:!bg-white/5 !border-gray-100 dark:!border-white/10 !shadow-lg dark:!shadow-none hover:!bg-gray-50 dark:hover:!bg-white/10 hover:!border-orange-500/30 transition-all duration-500" 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/blog" className="inline-flex items-center gap-3 text-gray-400 dark:text-white/40 hover:text-orange-500 dark:hover:text-white font-black uppercase tracking-widest text-xs transition-all group">
            Visit the Knowledge Hub
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

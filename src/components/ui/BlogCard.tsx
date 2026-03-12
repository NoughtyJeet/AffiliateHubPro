'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { Database } from '@/types/database';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

type BlogCardPost = Pick<BlogPost, 'id' | 'title' | 'slug' | 'excerpt' | 'featured_image' | 'tags' | 'read_time' | 'created_at'>;

interface BlogCardProps {
    post: BlogCardPost;
    featured?: boolean;
    className?: string;
}

export function BlogCard({ post, featured = false, className = '' }: BlogCardProps) {
    const date = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    if (featured) {
        return (
            <article className={`group relative overflow-hidden rounded-[2.5rem] bg-gray-900 min-h-[400px] flex border border-white/5 hover:border-orange-500/30 transition-all duration-700 ${className}`}>
                {post.featured_image && (
                    <Image
                        src={post.featured_image}
                        alt={post.title}
                        fill
                        className="absolute inset-0 object-cover opacity-40 group-hover:opacity-30 group-hover:scale-110 transition-all duration-1000 ease-out"
                        sizes="(max-width: 768px) 100vw, 66vw"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent z-10" />
                
                <div className="relative p-8 md:p-12 flex flex-col justify-end w-full z-20">
                    <div className="flex items-center gap-3 mb-6">
                        {post.tags && post.tags.length > 0 && (
                            <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-orange-600/20">{post.tags[0]}</span>
                        )}
                        <span className="flex items-center gap-1.5 text-white/50 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <Clock className="w-3 h-3" /> {post.read_time} min read
                        </span>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="group/title">
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-4 transition-colors line-clamp-2 leading-[1.1] tracking-tighter group-hover/title:text-orange-400">
                            {post.title}
                        </h2>
                    </Link>
                    
                    <p className="text-gray-400 text-base md:text-lg line-clamp-2 mb-8 font-medium leading-relaxed max-w-2xl">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/10">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{date}</span>
                        <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-[0.2em] group/btn transition-all hover:text-orange-400">
                            Read Deep Dive 
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article className={`group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 hover:border-orange-500/20 dark:hover:border-orange-500/40 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] transition-all duration-500 overflow-hidden flex flex-col h-full ${className}`}>
            <Link href={`/blog/${post.slug}`} className="block overflow-hidden relative flex-shrink-0 p-3">
                <div className="aspect-[16/10] bg-gray-50 dark:bg-zinc-800 relative rounded-[2rem] overflow-hidden">
                    {post.featured_image ? (
                        <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                            sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-gray-200 dark:text-zinc-700 stroke-[1]" />
                        </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 z-20">
                        {post.tags && post.tags.length > 0 && (
                            <span className="px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-gray-900 dark:text-zinc-100 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border border-white/20 dark:border-zinc-700/50 italic">
                                #{post.tags[0]}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="p-6 pt-2 flex flex-col flex-grow relative">
                <div className="flex items-center gap-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                    <span className="px-2 py-0.5 bg-gray-50 dark:bg-zinc-800 rounded-md border border-gray-100 dark:border-zinc-700">{date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time} min read</span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mb-3 leading-tight tracking-tight">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mb-6 font-medium leading-relaxed">
                    {post.excerpt}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                    <Link href={`/blog/${post.slug}`} className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors inline-flex items-center gap-1">
                        Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-500/20 border-2 border-white dark:border-zinc-900" />
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900" />
                    </div>
                </div>
            </div>
        </article>
    );
}

import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  tags: string[];
  read_time: number;
  created_at: string;
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  className?: string;
}

export function BlogCard({ post, featured = false, className = '' }: BlogCardProps) {
  const date = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  if (featured) {
    return (
      <article className={`group relative overflow-hidden rounded-2xl bg-gray-900 ${className}`}>
        {post.featured_image && (
          <img src={post.featured_image} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500" loading="lazy" />
        )}
        <div className="relative p-6 md:p-8 flex flex-col justify-end min-h-[300px]">
          {post.tags.length > 0 && (
            <span className="inline-block px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-md mb-3 w-fit">{post.tags[0]}</span>
          )}
          <Link to={`/blog/${post.slug}`}>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 hover:text-orange-300 transition-colors line-clamp-2">{post.title}</h2>
          </Link>
          <p className="text-gray-300 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-400 text-xs">
              <span>{date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time} min read</span>
            </div>
            <Link to={`/blog/${post.slug}`} className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
              Read More <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`group bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden ${className}`}>
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
        <div className="aspect-video bg-gray-100">
          {post.featured_image ? (
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        {post.tags.length > 0 && (
          <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-md mb-2">{post.tags[0]}</span>
        )}
        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-semibold text-gray-900 hover:text-orange-500 transition-colors line-clamp-2 mb-2 leading-tight">{post.title}</h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{date}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time} min</span>
        </div>
      </div>
    </article>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, FolderOpen, Megaphone, TrendingUp, Eye, Star, Users, Activity, ArrowUpRight, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from './AdminLayout';

interface Stats {
  products: number; publishedProducts: number;
  posts: number; publishedPosts: number;
  categories: number; ads: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, publishedProducts: 0, posts: 0, publishedPosts: 0, categories: 0, ads: 0 });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('id, status', { count: 'exact' }),
      supabase.from('products').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('blog_posts').select('id, status', { count: 'exact' }),
      supabase.from('blog_posts').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('categories').select('id', { count: 'exact' }),
      supabase.from('ads').select('id', { count: 'exact' }),
      supabase.from('products').select('id,title,slug,status,rating,created_at').order('created_at', { ascending: false }).limit(5),
      supabase.from('blog_posts').select('id,title,slug,status,views,created_at').order('created_at', { ascending: false }).limit(5),
    ]).then(([prod, pubProd, posts, pubPosts, cats, ads, recProd, recPosts]) => {
      setStats({
        products: prod.count || 0, publishedProducts: pubProd.count || 0,
        posts: posts.count || 0, publishedPosts: pubPosts.count || 0,
        categories: cats.count || 0, ads: ads.count || 0,
      });
      setRecentProducts(recProd.data || []);
      setRecentPosts(recPosts.data || []);
      setLoading(false);
    });
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, sub: `${stats.publishedProducts} published`, icon: Package, color: 'bg-orange-500', link: '/admin/products' },
    { label: 'Blog Posts', value: stats.posts, sub: `${stats.publishedPosts} published`, icon: FileText, color: 'bg-blue-500', link: '/admin/blog' },
    { label: 'Categories', value: stats.categories, sub: 'Product & Blog', icon: FolderOpen, color: 'bg-green-500', link: '/admin/categories' },
    { label: 'Active Ads', value: stats.ads, sub: 'All placements', icon: Megaphone, color: 'bg-purple-500', link: '/admin/ads' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">Welcome to Admin Panel 🚀</h2>
          <p className="text-orange-100">Manage your affiliate platform from here. Everything you need in one place.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map(({ label, value, sub, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{loading ? '—' : value}</div>
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Products</h3>
              <Link to="/admin/products" className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => <div key={i} className="h-14 mx-6 my-2 bg-gray-100 rounded-lg animate-pulse" />)
              ) : recentProducts.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No products yet</p>
                  <Link to="/admin/products/new" className="text-orange-500 text-sm font-medium hover:underline">Add your first product</Link>
                </div>
              ) : recentProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                  <Star className={`w-4 h-4 ${p.status === 'published' ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4">
              <Link to="/admin/products/new" className="block w-full text-center py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors">
                + Add New Product
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Blog Posts</h3>
              <Link to="/admin/blog" className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => <div key={i} className="h-14 mx-6 my-2 bg-gray-100 rounded-lg animate-pulse" />)
              ) : recentPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No posts yet</p>
                  <Link to="/admin/blog/new" className="text-orange-500 text-sm font-medium hover:underline">Write your first post</Link>
                </div>
              ) : recentPosts.map(p => (
                <div key={p.id} className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors">
                  <Eye className={`w-4 h-4 ${p.status === 'published' ? 'text-blue-400' : 'text-gray-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()} · {p.views || 0} views</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-4">
              <Link to="/admin/blog/new" className="block w-full text-center py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors">
                + Write New Post
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { to: '/admin/products/new', icon: '📦', label: 'New Product', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
              { to: '/admin/blog/new', icon: '✍️', label: 'New Post', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
              { to: '/admin/categories', icon: '📁', label: 'Categories', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
              { to: '/admin/ads', icon: '📣', label: 'Manage Ads', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
              { to: '/admin/seo', icon: '🔍', label: 'SEO Settings', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
              { to: '/admin/settings', icon: '⚙️', label: 'Settings', color: 'bg-gray-50 text-gray-600 hover:bg-gray-100' },
            ].map(({ to, icon, label, color }) => (
              <Link key={to} to={to} className={`flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-colors ${color}`}>
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

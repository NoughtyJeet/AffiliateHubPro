'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Search, Heart, User, ChevronDown, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Category = Database['public']['Tables']['categories']['Row'];

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { user, profile, isAdmin, signOut } = useAuth();
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        supabase.from('categories').select('*').then(({ data }) => {
            if (data) setCategories(data as Category[]);
        });
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const productCats = categories.filter(c => c.type === 'product');
    const blogCats = categories.filter(c => c.type === 'blog');

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="font-bold text-xl text-gray-900">Affiliate<span className="text-orange-500">Hub</span></span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">Home</Link>

                        {/* Products Dropdown */}
                        <div className="relative group">
                            <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer">
                                Products <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-2">
                                    <Link href="/products" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">All Products</Link>
                                    {productCats.map(cat => (
                                        <Link key={cat.id} href={`/category/${cat.slug}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">{cat.name}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Blog Dropdown */}
                        <div className="relative group">
                            <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer">
                                Blog <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                            </button>
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-2">
                                    <Link href="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">All Posts</Link>
                                    {blogCats.map(cat => (
                                        <Link key={cat.id} href={`/blog?category=${cat.slug}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">{cat.name}</Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link href="/deals" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors">Deals</Link>
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-2">
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">{(profile?.display_name || profile?.email || 'U')[0].toUpperCase()}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 hidden sm:block">{profile?.display_name || 'Account'}</span>
                                    <ChevronDown className="w-3 h-3 text-gray-500" />
                                </button>
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-2">
                                        <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                                            <User className="w-4 h-4" /> Dashboard
                                        </Link>
                                        <Link href="/saved" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                                            <Heart className="w-4 h-4" /> Saved Products
                                        </Link>
                                        {isAdmin && (
                                            <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 font-medium hover:bg-orange-50">
                                                <ExternalLink className="w-4 h-4" /> Admin Panel
                                            </Link>
                                        )}
                                        <hr className="my-1 border-gray-100" />
                                        <button onClick={signOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors hidden sm:block">Sign In</Link>
                                <Link href="/auth/signup" className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">Get Started</Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:text-orange-500">
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {isSearchOpen && (
                    <div className="pb-3 pt-1">
                        <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`; }}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search products and articles..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                                />
                            </div>
                        </form>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden pb-4 border-t border-gray-100 mt-2">
                        <div className="pt-3 space-y-1">
                            <Link href="/" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">Home</Link>
                            <Link href="/products" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">All Products</Link>
                            {productCats.map(cat => (
                                <Link key={cat.id} href={`/category/${cat.slug}`} className="block px-3 py-2 pl-6 text-sm text-gray-600 hover:bg-orange-50 rounded-lg">{cat.name}</Link>
                            ))}
                            <Link href="/blog" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50 rounded-lg">Blog</Link>
                            {blogCats.map(cat => (
                                <Link key={cat.id} href={`/blog?category=${cat.slug}`} className="block px-3 py-2 pl-6 text-sm text-gray-600 hover:bg-orange-50 rounded-lg">{cat.name}</Link>
                            ))}
                            {!user && <Link href="/auth/login" className="block px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg">Sign In</Link>}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

'use client';

import Link from 'next/link';
import { Mail, Facebook, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { useSEOSettings } from '@/hooks/useSEOSettings';

export function Footer() {
    const { settings } = useSEOSettings();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-zinc-950 text-gray-600 dark:text-zinc-400 border-t border-gray-100 dark:border-zinc-900 transition-colors duration-500">
            {/* Affiliate Disclosure */}
            <div className="bg-orange-50/50 dark:bg-orange-500/[0.03] border-b border-orange-100/50 dark:border-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-[10px] text-orange-700/70 dark:text-zinc-500 text-center uppercase font-black tracking-[0.2em] leading-relaxed">
                        <strong className="text-orange-600 dark:text-orange-400">Affiliate Disclosure:</strong> {settings?.affiliate_disclosure || 'This site contains affiliate links. We may earn a commission when you click links and make purchases, at no extra cost to you.'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                                <span className="text-white font-black text-lg">A</span>
                            </div>
                            <span className="font-black text-2xl text-gray-900 dark:text-white uppercase tracking-tighter">Affiliate<span className="text-orange-500">Hub</span></span>
                        </Link>
                        <p className="text-sm font-medium leading-relaxed opacity-80">{settings?.site_tagline || 'Your trusted source for honest product reviews and the best Amazon deals.'}</p>
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Facebook, href: settings?.facebook_url, color: 'hover:text-blue-500' },
                                { Icon: Twitter, href: settings?.twitter_handle ? `https://twitter.com/${settings.twitter_handle}` : '#', color: 'hover:text-sky-500' },
                                { Icon: Instagram, href: '#', color: 'hover:text-pink-500' },
                                { Icon: Youtube, href: '#', color: 'hover:text-red-500' }
                            ].map(({ Icon, href, color }, i) => (
                                <a key={i} href={href || '#'} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 flex items-center justify-center text-gray-400 transition-all ${color} hover:scale-110 active:scale-95`}>
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-8">Ecosystem</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="/category/electronics" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Electronics</Link></li>
                            <li><Link href="/category/home-kitchen" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Home & Kitchen</Link></li>
                            <li><Link href="/category/health-fitness" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Health & Fitness</Link></li>
                            <li><Link href="/products" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> All Products</Link></li>
                        </ul>
                    </div>

                    {/* Blog */}
                    <div>
                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-8">Intelligence</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="/blog" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> All Articles</Link></li>
                            <li><Link href="/blog?category=buying-guides" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Buying Guides</Link></li>
                            <li><Link href="/blog?category=tech-reviews" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Tech Reviews</Link></li>
                            <li><Link href="/deals" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Exclusive Deals</Link></li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.3em] mb-8">Core</h3>
                        <ul className="space-y-4 text-sm font-bold">
                            <li><Link href="/about" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Support Center</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Privacy Policy</Link></li>
                            <li><Link href="/disclaimer" className="hover:text-orange-500 transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" /> Affiliate Terms</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-gray-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40">© {year} AffiliateHub. Developed for Excellence.</p>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-40 flex items-center gap-1.5">
                        Proprietary Data Tracking Enabled <a href="https://amazon.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-400 flex items-center gap-0.5">Verified Amazon Partner <ExternalLink className="w-2.5 h-2.5" /></a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

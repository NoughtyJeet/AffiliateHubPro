'use client';

import Link from 'next/link';
import { Mail, Facebook, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react';
import { useSEOSettings } from '@/hooks/useSEOSettings';

export function Footer() {
    const { settings } = useSEOSettings();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Affiliate Disclosure */}
            <div className="bg-amber-900/30 border-b border-amber-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <p className="text-xs text-amber-200/80 text-center">
                        <strong>Affiliate Disclosure:</strong> {settings?.affiliate_disclosure || 'This site contains affiliate links. We may earn a commission when you click links and make purchases, at no extra cost to you.'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">A</span>
                            </div>
                            <span className="font-bold text-xl text-white">Affiliate<span className="text-orange-400">Hub</span></span>
                        </Link>
                        <p className="text-sm text-gray-400 mb-4">{settings?.site_tagline || 'Your trusted source for honest product reviews and the best Amazon deals.'}</p>
                        <div className="flex items-center gap-3">
                            {settings?.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors"><Facebook className="w-5 h-5" /></a>}
                            {settings?.twitter_handle && <a href={`https://twitter.com/${settings.twitter_handle}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-400 transition-colors"><Twitter className="w-5 h-5" /></a>}
                            <a href="#" className="text-gray-500 hover:text-pink-400 transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-500 hover:text-red-400 transition-colors"><Youtube className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Product Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/category/electronics" className="text-gray-400 hover:text-orange-400 transition-colors">Electronics</Link></li>
                            <li><Link href="/category/home-kitchen" className="text-gray-400 hover:text-orange-400 transition-colors">Home & Kitchen</Link></li>
                            <li><Link href="/category/health-fitness" className="text-gray-400 hover:text-orange-400 transition-colors">Health & Fitness</Link></li>
                            <li><Link href="/products" className="text-gray-400 hover:text-orange-400 transition-colors">All Products</Link></li>
                        </ul>
                    </div>

                    {/* Blog */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Blog & Guides</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/blog" className="text-gray-400 hover:text-orange-400 transition-colors">All Articles</Link></li>
                            <li><Link href="/blog?category=buying-guides" className="text-gray-400 hover:text-orange-400 transition-colors">Buying Guides</Link></li>
                            <li><Link href="/blog?category=tech-reviews" className="text-gray-400 hover:text-orange-400 transition-colors">Tech Reviews</Link></li>
                            <li><Link href="/deals" className="text-gray-400 hover:text-orange-400 transition-colors">Best Deals</Link></li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-gray-400 hover:text-orange-400 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1"><Mail className="w-3 h-3" /> Contact</Link></li>
                            <li><Link href="/privacy-policy" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/disclaimer" className="text-gray-400 hover:text-orange-400 transition-colors">Affiliate Disclaimer</Link></li>
                            <li><Link href="/sitemap" className="text-gray-400 hover:text-orange-400 transition-colors">Sitemap</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">© {year} AffiliateHub. All rights reserved.</p>
                    <p className="text-xs text-gray-600 flex items-center gap-1">
                        Amazon and the Amazon logo are trademarks of <a href="https://amazon.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-400 flex items-center gap-0.5">Amazon.com, Inc <ExternalLink className="w-3 h-3" /></a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

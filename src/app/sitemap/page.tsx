import { Map, Layers, ShoppingBag, BookOpen, Star, Info, Shield, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Sitemap - Navigate Our Future',
    description: 'A comprehensive map of all pages and sections on AffiliateHub Pro, designed for both humans and search engines.',
};

export default function SitemapPage() {
    const groups = [
        {
            title: 'Shopping Intelligence',
            icon: <ShoppingBag className="w-5 h-5 text-orange-500" />,
            links: [
                { name: 'Product Directory', href: '/products' },
                { name: 'Exclusive Deals', href: '/deals' },
                { name: 'Gadget Repository', href: '/category/electronics' },
                { name: 'Home Essentials', href: '/category/home-kitchen' },
                { name: 'Fitness Hardware', href: '/category/health-fitness' }
            ]
        },
        {
            title: 'Knowledge Base',
            icon: <BookOpen className="w-5 h-5 text-blue-500" />,
            links: [
                { name: 'Blog Archive', href: '/blog' },
                { name: 'Buying Guides', href: '/category/buying-guides' },
                { name: 'Deep-Dive Reviews', href: '/category/tech-reviews' },
                { name: 'Industry News', href: '/blog?category=news' }
            ]
        },
        {
            title: 'Corporate Nodes',
            icon: <Info className="w-5 h-5 text-green-500" />,
            links: [
                { name: 'Mission Control (About)', href: '/about' },
                { name: 'Direct Pipeline (Contact)', href: '/contact' },
                { name: 'Privacy Framework', href: '/privacy-policy' },
                { name: 'Legal Disclaimer', href: '/disclaimer' }
            ]
        },
        {
            title: 'User Interface',
            icon: <Layers className="w-5 h-5 text-purple-500" />,
            links: [
                { name: 'Control Panel (Dashboard)', href: '/dashboard' },
                { name: 'Saved Assets', href: '/saved' },
                { name: 'Profile Settings', href: '/dashboard' },
                { name: 'Search Interface', href: '/search' }
            ]
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-32">
            <div className="bg-gray-50 border-b border-gray-100 py-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Map size={48} className="mx-auto mb-6 text-gray-900" />
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-4">Architecture <span className="text-orange-500">Map</span></h1>
                    <p className="max-w-md mx-auto text-gray-500 font-medium">Synthesized structure of the AffiliateHub Pro network.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {groups.map(group => (
                        <div key={group.title} className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                {group.icon}
                                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">{group.title}</h2>
                            </div>
                            <ul className="space-y-6">
                                {group.links.map(link => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center justify-between text-gray-500 hover:text-orange-600 transition-colors"
                                        >
                                            <span className="text-sm font-bold">{link.name}</span>
                                            <div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                                <Star size={10} className="text-orange-500 fill-orange-500" />
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-32 p-10 bg-gray-900 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
                    <div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-2 leading-none">Can't find a specific node?</h3>
                        <p className="text-gray-400 text-sm font-medium">Our intelligence directory is constantly updating.</p>
                    </div>
                    <Link
                        href="/contact"
                        className="px-10 py-5 bg-orange-500 hover:bg-orange-400 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-xl shadow-black/20"
                    >
                        Report Missing Link
                    </Link>
                </div>
            </div>
        </div>
    );
}

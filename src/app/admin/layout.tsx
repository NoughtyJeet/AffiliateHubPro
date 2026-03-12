'use client';

import { useState } from 'react';
import { Menu, ExternalLink, Bell, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { path: '/admin', label: 'Command Center' },
    { path: '/admin/products', label: 'Inventory' },
    { path: '/admin/products/import', label: 'Bulk Import' },
    { path: '/admin/blog', label: 'Editorial' },
    { path: '/admin/categories', label: 'Taxonomy' },
    { path: '/admin/media', label: 'Media Vault' },
    { path: '/admin/analytics', label: 'Insights' },
    { path: '/admin/ads', label: 'Promotions' },
    { path: '/admin/seo', label: 'Visibility' },
    { path: '/admin/settings', label: 'Core' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const currentLabel = navItems.find(n =>
        pathname === n.path || (n.path !== '/admin' && pathname.startsWith(n.path))
    )?.label || 'Admin Portal';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex">
            {/* Dynamic Sidebar */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Container */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Futuristic Top Bar */}
                <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2.5 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">{currentLabel}</h1>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Global Search Interface Placeholder */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100/50 border border-slate-200 rounded-2xl text-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100 group transition-all">
                            <SearchIcon size={16} className="group-hover:text-slate-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search repository..."
                                className="bg-transparent border-none text-xs font-bold text-slate-900 focus:outline-none w-48 placeholder:text-slate-300"
                            />
                        </div>

                        <button className="p-2.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>

                        <div className="h-4 w-px bg-gray-100 mx-1" />

                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-black transition-all uppercase tracking-widest leading-none shadow-sm"
                        >
                            <ExternalLink className="w-4 h-4" /> Live Site
                        </Link>
                    </div>
                </header>

                {/* Dynamic Page Content */}
                <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}

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
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/blog', label: 'Blog Posts' },
    { path: '/admin/categories', label: 'Categories' },
    { path: '/admin/ads', label: 'Ad Manager' },
    { path: '/admin/seo', label: 'SEO Settings' },
    { path: '/admin/settings', label: 'Site Settings' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const currentLabel = navItems.find(n =>
        pathname === n.path || (n.path !== '/admin' && pathname.startsWith(n.path))
    )?.label || 'Admin Portal';

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex">
            {/* Dynamic Sidebar */}
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Main Container */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Futuristic Top Bar */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-50 flex items-center justify-between px-6 sm:px-10 sticky top-0 z-30">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2.5 bg-gray-50 text-gray-400 hover:text-orange-500 rounded-xl transition-all"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                            <h1 className="text-xl font-black text-gray-900 tracking-tight">{currentLabel}</h1>
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 animate-pulse" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Global Search Interface Placeholder */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 group transition-all">
                            <SearchIcon size={16} className="group-hover:text-gray-900 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search dashboard..."
                                className="bg-transparent border-none text-xs font-bold text-gray-900 focus:outline-none w-48 placeholder:text-gray-300"
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
                            className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-600 text-xs font-black rounded-xl hover:bg-orange-100 transition-all uppercase tracking-widest leading-none"
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

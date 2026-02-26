'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Package, FileText, FolderOpen,
    Settings, Megaphone, Search, X, ExternalLink, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/blog', label: 'Blog Posts', icon: FileText },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { path: '/admin/ads', label: 'Ad Manager', icon: Megaphone },
    { path: '/admin/seo', label: 'SEO Settings', icon: Search },
    { path: '/admin/settings', label: 'Site Settings', icon: Settings },
];

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
    const pathname = usePathname();
    const { profile } = useAuth();

    return (
        <>
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-2xl lg:shadow-none transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static flex flex-col`}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between px-8 h-20 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-white font-black text-lg">A</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-gray-900 leading-tight uppercase tracking-tighter text-sm">Flow Pro</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Admin Control</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto scrollbar-hide">
                    <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Management</p>
                    {navItems.map(({ path, label, icon: Icon, exact }) => {
                        const isActive = exact
                            ? pathname === path
                            : pathname.startsWith(path) && path !== '/admin';

                        return (
                            <Link
                                key={path}
                                href={path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all group ${isActive
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400'
                                    }`} />
                                {label}
                                {isActive && (
                                    <div className="ml-auto animate-in fade-in slide-in-from-left-2 duration-300">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Card Section */}
                <div className="p-4 bg-gray-50/50">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-orange-500/5 rounded-full -mr-6 -mt-6" />
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
                            <span className="text-white text-sm font-black">
                                {(profile?.display_name || profile?.email || 'A')[0].toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-gray-900 truncate leading-none mb-1">
                                {profile?.display_name || 'Administrator'}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
                                Super User
                            </p>
                        </div>
                        <Link
                            href="/"
                            target="_blank"
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                            title="View Public Site"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}

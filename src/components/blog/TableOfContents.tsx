'use client';

import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TOCItem {
    id: string;
    title: string;
    level: number;
}

interface TableOfContentsProps {
    items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-10% 0% -80% 0%' }
        );

        items.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [items]);

    if (!items || items.length < 2) return null;

    return (
        <aside className="lg:w-64 flex-shrink-0 order-first lg:order-last">
            <div className="bg-orange-50 rounded-2xl p-6 sticky top-24 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                    <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wider">In this guide</h2>
                </div>
                <ul className="space-y-3">
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className={`${item.level === 3 ? 'pl-4' : ''}`}
                        >
                            <a
                                href={`#${item.id}`}
                                className={`text-sm transition-colors block line-clamp-2 ${activeId === item.id
                                        ? 'text-orange-600 font-semibold'
                                        : 'text-gray-600 hover:text-orange-500 font-medium'
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    window.history.pushState(null, '', `#${item.id}`);
                                }}
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}

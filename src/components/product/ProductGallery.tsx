'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/3] bg-gray-50 dark:bg-zinc-900 rounded-3xl flex items-center justify-center text-gray-200 dark:text-zinc-800 transition-colors">
                <ShoppingCart className="w-20 h-20" />
            </div>
        );
    }

    return (
        <div>
            <div className="aspect-[4/3] bg-gray-50 dark:bg-zinc-900 rounded-3xl overflow-hidden mb-6 relative shadow-inner transition-colors">
                <Image
                    src={images[activeImage]}
                    alt={title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shadow-sm ${activeImage === i
                                    ? 'border-orange-500 scale-105 shadow-lg shadow-orange-500/20'
                                    : 'border-white dark:border-zinc-900 hover:border-gray-200 dark:hover:border-zinc-800'
                                }`}
                        >
                            <div className="relative w-full h-full">
                                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

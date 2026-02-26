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
            <div className="aspect-[4/3] bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                <ShoppingCart className="w-20 h-20" />
            </div>
        );
    }

    return (
        <div>
            <div className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden mb-4 relative shadow-inner">
                <Image
                    src={images[activeImage]}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${activeImage === i
                                    ? 'border-orange-500 scale-105'
                                    : 'border-white hover:border-gray-200'
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

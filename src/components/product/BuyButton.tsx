'use client';

import { ExternalLink } from 'lucide-react';
import { trackAffiliateClick } from '@/utils/analytics';

interface BuyButtonProps {
    productTitle: string;
    affiliateLink: string;
    className?: string;
}

export function BuyButton({ productTitle, affiliateLink, className = "" }: BuyButtonProps) {
    const handleAffiliateClick = () => {
        if (affiliateLink) {
            trackAffiliateClick(productTitle, affiliateLink);
            window.open(affiliateLink, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <button
            onClick={handleAffiliateClick}
            className={`flex items-center justify-center gap-3 py-4 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 text-lg cursor-pointer group px-8 ${className}`}
        >
            <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" /> Buy on Amazon
        </button>
    );
}

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
            className={`flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30 text-lg cursor-pointer ${className}`}
        >
            <ExternalLink className="w-5 h-5" /> Buy on Amazon
        </button>
    );
}

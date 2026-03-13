'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type Ad = Database['public']['Tables']['ads']['Row'];

interface AdBannerProps {
    placement: string;
    className?: string;
}

export function AdBanner({ placement, className = '' }: AdBannerProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
        const deviceQuery = isMobile ? ['mobile', 'both'] : ['desktop', 'both'];
        const now = new Date().toISOString();

        supabase
            .from('ads')
            .select('*')
            .eq('placement', placement)
            .eq('status', true)
            .in('device_target', deviceQuery)
            .or(`start_date.is.null,start_date.lte.${now}`)
            .or(`end_date.is.null,end_date.gte.${now}`)
            .limit(1)
            .maybeSingle()
            .then(({ data }) => {
                if (data) setAd(data as Ad);
            });
    }, [placement]);

    if (!ad) return null;

    return (
        <div
            className={`ad-container flex items-center justify-center overflow-hidden ${className}`}
            style={{ minHeight: ad.height ? `${ad.height}px` : 'auto', minWidth: ad.width ? `${ad.width}px` : 'auto' }}
            data-placement={placement}
        >
            {ad.ad_type === 'custom_html' || ad.ad_type === 'adsense' || ad.ad_type === 'script' ? (
                <div dangerouslySetInnerHTML={{ __html: ad.ad_code || '' }} />
            ) : ad.ad_type === 'image' || ad.ad_type === 'affiliate_banner' ? (
                <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer sponsored" className="block relative" style={{ width: ad.width, height: ad.height }}>
                    <Image 
                        src={ad.image_url || ''} 
                        alt="Advertisement" 
                        width={ad.width} 
                        height={ad.height} 
                        className="max-w-full h-auto object-contain"
                    />
                </a>
            ) : null}
            <span className="sr-only">Advertisement</span>
        </div>
    );
}

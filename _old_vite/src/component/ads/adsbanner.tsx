import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Ad {
  id: string;
  ad_type: string;
  ad_code: string | null;
  image_url: string | null;
  link_url: string | null;
  placement: string;
  device_target: string;
  width: number;
  height: number;
}

interface AdBannerProps {
  placement: string;
  className?: string;
}

export function AdBanner({ placement, className = '' }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
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
      .single()
      .then(({ data }) => {
        if (data) setAd(data as Ad);
      });
  }, [placement]);

  if (!ad) return null;

  return (
    <div 
      className={`ad-container flex items-center justify-center overflow-hidden ${className}`}
      style={{ minHeight: `${ad.height}px`, minWidth: `${ad.width}px` }}
      data-placement={placement}
    >
      {ad.ad_type === 'custom_html' || ad.ad_type === 'adsense' || ad.ad_type === 'script' ? (
        <div dangerouslySetInnerHTML={{ __html: ad.ad_code || '' }} />
      ) : ad.ad_type === 'image' || ad.ad_type === 'affiliate_banner' ? (
        <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer sponsored">
          <img src={ad.image_url || ''} alt="Advertisement" width={ad.width} height={ad.height} loading="lazy" className="max-w-full h-auto" />
        </a>
      ) : null}
      <span className="sr-only">Advertisement</span>
    </div>
  );
}

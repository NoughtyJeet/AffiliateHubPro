export function trackAffiliateClick(productTitle: string, affiliateUrl: string) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'affiliate_click', {
            event_category: 'Affiliate',
            event_label: productTitle,
            transport_url: affiliateUrl
        });
    }
}

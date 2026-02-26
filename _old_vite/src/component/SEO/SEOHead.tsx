import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSEOSettings } from '../../hooks/useSEOSettings';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  schema?: object;
  noindex?: boolean;
}

export function SEOHead({ title, description, image, type = 'website', schema, noindex }: SEOHeadProps) {
  const { settings } = useSEOSettings();
  const location = useLocation();

  const siteTitle = settings?.site_title || 'AffiliateHub';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDesc = description || settings?.default_meta_description || '';
  const metaImage = image || settings?.og_default_image || '';
  const canonicalUrl = `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (metaDesc) setMeta('description', metaDesc);
    if (noindex) setMeta('robots', 'noindex, nofollow');

    // Open Graph
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', metaDesc, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    if (metaImage) setMeta('og:image', metaImage, 'property');

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', metaDesc);
    if (metaImage) setMeta('twitter:image', metaImage);
    if (settings?.twitter_handle) setMeta('twitter:site', `@${settings.twitter_handle}`);

    // Search Console verification
    if (settings?.search_console_enabled && settings?.search_console_meta) {
      setMeta('google-site-verification', settings.search_console_meta);
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Schema
    if (schema) {
      let schemaEl = document.getElementById('page-schema');
      if (!schemaEl) {
        schemaEl = document.createElement('script');
        schemaEl.id = 'page-schema';
        schemaEl.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify(schema);
    }

    // GA4 injection
    if (settings?.ga_enabled && settings?.ga_measurement_id) {
      const gaId = settings.ga_measurement_id;
      if (!document.getElementById('ga-script')) {
        const gaScript = document.createElement('script');
        gaScript.id = 'ga-script';
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        gaScript.async = true;
        document.head.appendChild(gaScript);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'ga-inline';
        inlineScript.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { page_path: '${location.pathname}' });
        `;
        document.head.appendChild(inlineScript);
      }
    }
  }, [fullTitle, metaDesc, metaImage, type, canonicalUrl, schema, settings, noindex, location.pathname]);

  return null;
}

// Track affiliate clicks
export function trackAffiliateClick(productTitle: string, affiliateUrl: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      event_category: 'Affiliate',
      event_label: productTitle,
      transport_url: affiliateUrl
    });
  }
}

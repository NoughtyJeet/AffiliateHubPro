import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SEOSettings {
  id: string;
  site_title: string;
  site_tagline: string | null;
  default_meta_description: string | null;
  search_console_meta: string | null;
  search_console_enabled: boolean;
  ga_measurement_id: string | null;
  ga_enabled: boolean;
  ga_affiliate_tracking: boolean;
  robots_txt: string | null;
  og_default_image: string | null;
  site_logo: string | null;
  affiliate_disclosure: string | null;
  twitter_handle: string | null;
  facebook_url: string | null;
}

let cachedSettings: SEOSettings | null = null;

export function useSEOSettings() {
  const [settings, setSettings] = useState<SEOSettings | null>(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) return;
    supabase.from('seo_settings').select('*').single().then(({ data }) => {
      if (data) {
        cachedSettings = data as SEOSettings;
        setSettings(data as SEOSettings);
      }
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}

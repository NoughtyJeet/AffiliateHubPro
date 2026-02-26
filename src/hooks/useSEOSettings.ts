'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database';

type SEOSettings = Database['public']['Tables']['seo_settings']['Row'];

let cachedSettings: SEOSettings | null = null;

export function useSEOSettings() {
    const [settings, setSettings] = useState<SEOSettings | null>(cachedSettings);
    const [loading, setLoading] = useState(!cachedSettings);
    const supabase = createClient();

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

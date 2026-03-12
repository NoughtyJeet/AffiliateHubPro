-- Admin Panel Sync Script
-- This script creates the necessary tables and structure for the new Admin Command Center.

-- 1. AD MANAGEMENT TABLE
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_name TEXT NOT NULL,
    ad_type TEXT CHECK (ad_type IN ('adsense', 'custom_html', 'image', 'script', 'affiliate_banner')),
    ad_code TEXT,
    image_url TEXT,
    link_url TEXT,
    placement TEXT NOT NULL,
    device_target TEXT DEFAULT 'both' CHECK (device_target IN ('desktop', 'mobile', 'both')),
    start_date DATE,
    end_date DATE,
    status BOOLEAN DEFAULT true,
    width INTEGER DEFAULT 728,
    height INTEGER DEFAULT 90,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    admin_id UUID REFERENCES auth.users(id),
    details JSONB DEFAULT '{}'::jsonb,
    severity TEXT CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. AFFILIATE CLICKS (FOR ANALYTICS)
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    admin_id UUID REFERENCES auth.users(id), -- If logged in
    referrer_url TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ENSURE PRODUCTS TABLE HAS ALL NECESSARY FIELDS
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS pros TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cons TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS schema_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS price_range TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 5. SITE SETTINGS (FOR GLOBAL CONTROL)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    site_name TEXT DEFAULT 'Affiliate Hub Pro',
    site_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color TEXT DEFAULT '#f97316',
    contact_email TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ENABLE RLS (Security)
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 7. POLICIES (Super Admins can do everything, public can read ads/settings)
CREATE POLICY "Public Read Ads" ON public.ads FOR SELECT USING (status = true);
CREATE POLICY "Admin Full Access Ads" ON public.ads FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin Read Logs" ON public.admin_audit_logs FOR SELECT USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin Full Access Settings" ON public.site_settings FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

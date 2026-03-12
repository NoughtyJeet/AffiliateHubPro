-- Admin Command Center: Final Synchronization Script
-- Run this in the Supabase SQL Editor to ensure all tables and columns are correctly configured for the new Admin Panel.

-- 1. PROFILES & ROLES
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'editor';
    END IF;
END $$;

-- 2. CATEGORIES ENUM FIX (If applicable)
-- Ensure categories has a 'type' column for both products and blog posts
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'type') THEN
        ALTER TABLE public.categories ADD COLUMN type TEXT DEFAULT 'product' CHECK (type IN ('product', 'blog'));
    END IF;
END $$;

-- 3. MEDIA LIBRARY TABLE
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size INTEGER,
    alt_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES auth.users(id),
    meta_title TEXT,
    meta_description TEXT,
    faq_schema JSONB DEFAULT '[]'::jsonb,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
    scheduled_at TIMESTAMPTZ,
    read_time INTEGER DEFAULT 5,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. AUDIT LOGS TABLE
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

-- 6. AFFILIATE CLICKS TABLE (With Type Handling)
-- Drop existing if there's a type mismatch issue
DROP TABLE IF EXISTS public.affiliate_clicks;

CREATE TABLE public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Use TEXT to avoid strictly bound UUID issues if your products table uses slugs or mismatched types
    product_id TEXT, 
    admin_id UUID REFERENCES auth.users(id),
    referrer_url TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ADS MANAGEMENT
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_name TEXT NOT NULL,
    ad_type TEXT CHECK (ad_type IN ('adsense', 'custom_html', 'image', 'script', 'affiliate_banner')),
    ad_code TEXT,
    image_url TEXT,
    link_url TEXT,
    placement TEXT NOT NULL,
    device_target TEXT DEFAULT 'both' CHECK (device_target IN ('desktop', 'mobile', 'both')),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. SITE SETTINGS
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

-- 9. ENABLE RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 10. POLICIES
-- NOTE: Replace 'admin' check with your actual admin role implementation if different
CREATE POLICY "Admin CRUD Media" ON public.media_library FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin' OR role = 'super_admin'));
CREATE POLICY "Public View Media" ON public.media_library FOR SELECT USING (true);

CREATE POLICY "Admin CRUD Blog" ON public.blog_posts FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin' OR role = 'super_admin'));
CREATE POLICY "Public View Published Blog" ON public.blog_posts FOR SELECT USING (status = 'published');

CREATE POLICY "Admin View Logs" ON public.admin_audit_logs FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin' OR role = 'super_admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_ads_updated_at ON public.ads;
CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

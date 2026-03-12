-- Migration: Admin Infrastructure
-- Description: Sets up tables for affiliate clicks, media library, and notifications.

-- 1. Create affiliate_clicks table
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.blog_posts(id) ON DELETE SET NULL,
    user_agent TEXT,
    referrer TEXT,
    ip_hash TEXT, -- Storing hash for privacy while allowing basic bot detection
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create media_library table
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_type TEXT,
    size INTEGER,
    width INTEGER,
    height INTEGER,
    folder TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- info, success, warning, error
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Update profiles to ensure role consistency
-- Assuming profiles table exists with a 'role' column from previous research.
-- If not, this ensures it exists.
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Enable RLS (Security)
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policies for Admin Access
-- Note: Replace 'admin' with your actual admin role check logic if different
CREATE POLICY "Admins can manage clicks" ON public.affiliate_clicks
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage media" ON public.media_library
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage notifications" ON public.admin_notifications
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Allow public to record clicks (Insert only)
CREATE POLICY "Public can record clicks" ON public.affiliate_clicks
    FOR INSERT WITH CHECK (true);

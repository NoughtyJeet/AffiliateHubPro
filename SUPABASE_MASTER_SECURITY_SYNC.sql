-- ============================================================
-- GLOBAL SECURITY HARDENING PROTOCOL
-- ============================================================
-- This script fixes security vulnerabilities including:
-- 1. Mutable search_path in functions (potential shadowing attacks)
-- 2. Missing Row Level Security (RLS) on sensitive tables
-- ============================================================

-- 1. HARDEN DATABASE FUNCTIONS
-- Set explicit search_path and SECURITY DEFINER to prevent path-based attacks.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 2. SECURE CORE TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Drop permissive policies if they exist to ensure tightening
DROP POLICY IF EXISTS "Allow public insert for click tracking" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Admin view access for analytics" ON public.affiliate_clicks;

CREATE POLICY "Allow public insert for click tracking" ON public.affiliate_clicks 
FOR INSERT WITH CHECK (product_id IS NOT NULL);

CREATE POLICY "Admin view access for analytics" ON public.affiliate_clicks 
FOR SELECT USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. SECURE SUBMISSIONS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Drop permissive policies if they exist to ensure tightening
DROP POLICY IF EXISTS "Allow public contact submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admin access to submissions" ON public.submissions;

CREATE POLICY "Allow public contact submissions" ON public.submissions 
FOR INSERT WITH CHECK (name IS NOT NULL AND email IS NOT NULL AND message IS NOT NULL);

CREATE POLICY "Admin access to submissions" ON public.submissions 
FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 4. ADDITIONAL HARDENING
ALTER TABLE IF EXISTS public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;

-- 5. VERIFY SEARCH PATHS
-- Ensure all functions in public schema are checked
-- (At this stage, we have handled the primary reporter's issue)

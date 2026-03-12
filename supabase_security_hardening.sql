-- Security Protocol: Row Level Security Hardening
-- This script secures the affiliate_clicks table, preventing unauthorized data exposure while maintaining tracking functionality.

-- 1. ENABLE RLS
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC INSERT POLICY
-- Allows anonymous/public users to record clicks (essential for affiliate tracking)
DROP POLICY IF EXISTS "Allow public insert for click tracking" ON public.affiliate_clicks;

CREATE POLICY "Allow public insert for click tracking" ON public.affiliate_clicks 
FOR INSERT WITH CHECK (product_id IS NOT NULL);

-- 3. ADMIN SELECT POLICY
-- Restricts data retrieval to authenticated administrators
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_clicks' AND policyname = 'Admin view access for analytics'
    ) THEN
        CREATE POLICY "Admin view access for analytics" ON public.affiliate_clicks 
        FOR SELECT USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$;

-- 4. SUBMISSIONS TABLE RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public contact submissions" ON public.submissions;
DROP POLICY IF EXISTS "Admin access to submissions" ON public.submissions;

CREATE POLICY "Allow public contact submissions" ON public.submissions 
FOR INSERT WITH CHECK (name IS NOT NULL AND email IS NOT NULL AND message IS NOT NULL);

CREATE POLICY "Admin access to submissions" ON public.submissions 
FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 5. HOUSEKEEPING
-- Ensure other sensitive tables have RLS enabled (Recursive Check)
ALTER TABLE IF EXISTS public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.media_library ENABLE ROW LEVEL SECURITY;
